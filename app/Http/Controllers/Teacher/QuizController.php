<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Batch;
use App\Models\Question;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class QuizController extends Controller
{
    /**
     * Display a listing of the quizzes for the authenticated teacher
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Safety check - ensure user exists and has proper role
        if (!$user || !$user->isTeacher()) {
            \Log::error('QuizController::index - Invalid user or role', [
                'user_id' => $user?->id,
                'user_role' => $user?->role ?? 'null',
                'is_teacher' => $user?->isTeacher() ?? false
            ]);
            abort(403, 'Access denied - Teacher role required');
        }
        
        $query = Quiz::with(['batch', 'questions:quiz_id,id'])
            ->whereHas('batch', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })
            ->withCount([
                'attempts',
                'attempts as completed_attempts_count' => function ($q) {
                    $q->where('is_completed', true); // Using your actual column
                }
            ])
            ->withAvg('attempts as average_score', 'score'); // Using your actual column

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('batch_id')) {
            $query->where('batch_id', $request->batch_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('batch', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $quizzes = $query->orderBy('created_at', 'desc')->paginate(10);

        // Calculate additional metrics
        $quizzes->getCollection()->transform(function ($quiz) {
            $quiz->questions_count = $quiz->questions->count();
            
            // Calculate pass rate using your actual schema
            $completedAttempts = $quiz->completed_attempts_count;
            if ($completedAttempts > 0) {
                $passedAttempts = $quiz->attempts()
                    ->where('is_completed', true)
                    ->whereRaw('score >= ?', [$quiz->pass_marks])
                    ->count();
                $quiz->pass_rate = ($passedAttempts / $completedAttempts) * 100;
            } else {
                $quiz->pass_rate = 0;
            }
            
            $quiz->is_available = $this->isQuizAvailable($quiz);
            $quiz->can_edit = $this->canEditQuiz($quiz);
            
            // Add the batch data with student count
            if ($quiz->batch) {
                $quiz->batch->student_count = $quiz->batch->students()->count();
            }
            
            unset($quiz->questions); // Remove to reduce payload
            return $quiz;
        });

        // Get stats for dashboard
        $stats = $this->getTeacherQuizStats($user->id);

        // Get teacher's batches for filter dropdown
        $batches = Batch::where('teacher_id', $user->id)
            ->select('id', 'name')
            ->withCount('students')
            ->get();

        return Inertia::render('Teacher/Quizzes/Index', [
            'auth' => [
                'user' => $this->serializeUserSafely($user)
            ],
            'quizzes' => $quizzes,
            'stats' => $stats,
            'batches' => $batches,
            'filters' => $request->only(['status', 'batch_id', 'search']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new quiz
     */
    public function create()
    {
        $user = Auth::user();
        
        // Safety check - ensure user exists and has proper role
        if (!$user || !$user->isTeacher()) {
            \Log::error('QuizController::create - Invalid user or role', [
                'user_id' => $user?->id,
                'user_role' => $user?->role ?? 'null',
                'is_teacher' => $user?->isTeacher() ?? false
            ]);
            abort(403, 'Access denied - Teacher role required');
        }
        
        $batches = Batch::where('teacher_id', $user->id)
            ->withCount('students')
            ->get();

        return Inertia::render('Teacher/Quizzes/Create', [
            'auth' => [
                'user' => $this->serializeUserSafely($user)
            ],
            'batches' => $batches
        ]);
    }

    /**
     * Store a newly created quiz
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Safety check
        if (!$user || !$user->isTeacher()) {
            abort(403, 'Access denied - Teacher role required');
        }
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'batch_id' => [
                'required',
                'exists:batches,id',
                function ($attribute, $value, $fail) use ($user) {
                    $batch = Batch::find($value);
                    if ($batch && $batch->teacher_id !== $user->id) {
                        $fail('You can only create quizzes for your own batches.');
                    }
                }
            ],
            'pass_marks' => 'required|integer|min:1|max:1000',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'start_time' => 'nullable|date|after:now',
            'end_time' => 'nullable|date|after:start_time',
            'max_attempts' => 'nullable|integer|min:1|max:10',
        ], [
            'pass_marks.required' => 'Pass marks is required.',
            'pass_marks.min' => 'Pass marks must be at least 1.',
            'pass_marks.integer' => 'Pass marks must be a valid number.',
            'batch_id.required' => 'Please select a batch.',
            'batch_id.exists' => 'The selected batch is invalid.',
            'title.required' => 'Quiz title is required.',
        ]);

        DB::beginTransaction();
        
        try {
            $quiz = Quiz::create([
                'title' => $request->title,
                'description' => $request->description,
                'instructions' => $request->instructions,
                'batch_id' => $request->batch_id,
                'pass_marks' => $request->pass_marks,
                'duration_minutes' => $request->duration_minutes,
                'start_time' => $request->start_time ? Carbon::parse($request->start_time) : null,
                'end_time' => $request->end_time ? Carbon::parse($request->end_time) : null,
                'max_attempts' => $request->max_attempts,
                'shuffle_questions' => $request->shuffle_questions ?? false,
                'shuffle_options' => $request->shuffle_options ?? false,
                'show_results_immediately' => $request->show_results_immediately ?? true,
                'allow_review' => $request->allow_review ?? true,
                'auto_submit' => $request->auto_submit ?? true,
                'require_webcam' => $request->require_webcam ?? false,
                'prevent_copy_paste' => $request->prevent_copy_paste ?? true,
                'status' => 'draft'
            ]);

            DB::commit();

            return redirect()->route('teacher.quizzes.show', $quiz)
                ->with('success', 'Quiz created successfully! Add questions to activate it.');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error creating quiz', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create quiz. Please try again.']);
        }
    }

    /**
     * Display the specified quiz with comprehensive data
     */
    public function show(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load([
            'batch:id,name,teacher_id',
            'questions' => function ($q) {
                $q->orderBy('order')
                  ->select('id', 'quiz_id', 'type', 'question_text', 'explanation', 'marks', 'order', 'options', 'correct_answer');
            }
        ]);

        // Get student count for the batch
        if ($quiz->batch) {
            $quiz->batch->student_count = $quiz->batch->students()->count();
        }

        // Calculate quiz analytics
        $analytics = $this->getQuizAnalytics($quiz);
        
        // Get recent attempts with student information
        $recentAttempts = QuizAttempt::with(['student:id,name,email'])
            ->where('quiz_id', $quiz->id)
            ->where('is_completed', true)
            ->orderBy('submitted_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($attempt) use ($quiz) {
                return [
                    'id' => $attempt->id,
                    'score' => $attempt->score,
                    'total_marks' => $quiz->total_marks,
                    'percentage' => $quiz->total_marks > 0 ? ($attempt->score / $quiz->total_marks) * 100 : 0,
                    'has_passed' => $attempt->score >= $quiz->pass_marks,
                    'submitted_at' => $attempt->submitted_at->toISOString(),
                    'time_taken_minutes' => $this->calculateTimeTaken($attempt),
                    'student' => [
                        'id' => $attempt->student->id,
                        'name' => $attempt->student->name,
                        'email' => $attempt->student->email,
                    ]
                ];
            });

        // Add computed properties to quiz
        $quiz->is_available = $this->isQuizAvailable($quiz);
        $quiz->can_edit = $this->canEditQuiz($quiz);
        $quiz->questions_count = $quiz->questions->count();
        $quiz->attempts_count = $quiz->attempts()->count();
        $quiz->completed_attempts_count = $quiz->attempts()->where('is_completed', true)->count();

        // Calculate average score and pass rate
        $completedAttempts = $quiz->attempts()->where('is_completed', true)->get();
        $quiz->average_score = $completedAttempts->avg('score') ?? 0;
        
        if ($completedAttempts->count() > 0) {
            $passedAttempts = $completedAttempts->where('score', '>=', $quiz->pass_marks)->count();
            $quiz->pass_rate = ($passedAttempts / $completedAttempts->count()) * 100;
        } else {
            $quiz->pass_rate = 0;
        }

        return Inertia::render('Teacher/Quizzes/Show', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz,
            'analytics' => $analytics,
            'recentAttempts' => $recentAttempts
        ]);
    }

    /**
     * Show the form for editing the quiz
     */
    public function edit(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load(['batch:id,name', 'questions' => function ($q) {
            $q->orderBy('order');
        }]);

        $user = Auth::user();
        $batches = Batch::where('teacher_id', $user->id)
            ->select('id', 'name')
            ->withCount('students')
            ->get();

        $quiz->can_edit = $this->canEditQuiz($quiz);
        $quiz->questions_count = $quiz->questions->count();
        $quiz->attempts_count = $quiz->attempts()->count();

        return Inertia::render('Teacher/Quizzes/Edit', [
            'auth' => [
                'user' => $this->serializeUserSafely($user)
            ],
            'quiz' => $quiz,
            'batches' => $batches
        ]);
    }

    /**
     * Update the specified quiz
     */
    public function update(Request $request, Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'pass_marks' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) use ($quiz) {
                    // If quiz has questions, pass marks can't exceed total marks
                    if ($quiz->total_marks > 0 && $value > $quiz->total_marks) {
                        $fail("Pass marks cannot exceed total marks ({$quiz->total_marks}).");
                    }
                    // If no questions yet, allow reasonable values (up to 1000)
                    if ($quiz->total_marks === 0 && $value > 1000) {
                        $fail("Pass marks cannot exceed 1000.");
                    }
                }
            ],
        ], [
            'pass_marks.required' => 'Pass marks is required.',
            'pass_marks.min' => 'Pass marks must be at least 1.',
            'title.required' => 'Quiz title is required.',
        ]);

        DB::beginTransaction();
        
        try {
            $updateData = [
                'title' => $request->title,
                'description' => $request->description,
                'instructions' => $request->instructions,
                'pass_marks' => $request->pass_marks,
                'show_results_immediately' => $request->show_results_immediately ?? true,
                'allow_review' => $request->allow_review ?? true,
            ];

            // Only allow certain fields to be updated if quiz hasn't been attempted
            if ($this->canEditQuiz($quiz)) {
                $updateData = array_merge($updateData, [
                    'batch_id' => $request->batch_id,
                    'duration_minutes' => $request->duration_minutes,
                    'start_time' => $request->start_time ? Carbon::parse($request->start_time) : null,
                    'end_time' => $request->end_time ? Carbon::parse($request->end_time) : null,
                    'max_attempts' => $request->max_attempts,
                    'shuffle_questions' => $request->shuffle_questions ?? false,
                    'shuffle_options' => $request->shuffle_options ?? false,
                    'auto_submit' => $request->auto_submit ?? true,
                    'require_webcam' => $request->require_webcam ?? false,
                    'prevent_copy_paste' => $request->prevent_copy_paste ?? true,
                ]);
            }

            $quiz->update($updateData);

            // Recalculate total marks
            $totalMarks = $quiz->questions()->sum('marks');
            $quiz->update(['total_marks' => $totalMarks]);

            DB::commit();

            return redirect()->route('teacher.quizzes.show', $quiz)
                ->with('success', 'Quiz updated successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error updating quiz', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to update quiz. Please try again.']);
        }
    }

    /**
     * Preview the quiz as students would see it
     */
    public function preview(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load([
            'batch:id,name',
            'questions' => function ($q) {
                $q->orderBy('order');
            }
        ]);

        // Prepare questions for preview (similar to how students would see them)
        $previewQuestions = $quiz->questions->map(function ($question, $index) {
            $questionData = [
                'id' => $question->id,
                'order' => $index + 1,
                'type' => $question->type,
                'question_text' => $question->question_text,
                'marks' => $question->marks,
                'explanation' => $question->explanation,
            ];

            // Add options for MCQ questions
            if ($question->type === 'mcq' && $question->options) {
                $questionData['options'] = $question->options;
                
                // Show correct answer in preview mode
                if ($question->correct_answer) {
                    $correctIndex = intval($question->correct_answer[0] ?? 0);
                    $questionData['correct_answer_preview'] = $question->options[$correctIndex] ?? null;
                }
            }

            return $questionData;
        });

        // Calculate preview statistics
        $previewStats = [
            'total_questions' => $quiz->questions_count,
            'total_marks' => $quiz->total_marks,
            'estimated_time' => $this->estimateQuizTime($quiz),
            'question_types' => [
                'mcq' => $quiz->questions->where('type', 'mcq')->count(),
                'short_answer' => $quiz->questions->where('type', 'short_answer')->count(),
            ]
        ];

        return Inertia::render('Teacher/Quizzes/Preview', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz,
            'questions' => $previewQuestions,
            'stats' => $previewStats
        ]);
    }

    /**
     * Show detailed quiz results
     */
    public function results(Quiz $quiz, Request $request)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load(['batch:id,name,teacher_id']);

        // Get student count for the batch
        if ($quiz->batch) {
            $quiz->batch->student_count = $quiz->batch->students()->count();
        }

        // Build query for attempts
        $query = QuizAttempt::with(['student:id,name,email'])
            ->where('quiz_id', $quiz->id)
            ->where('is_completed', true);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'passed') {
                $query->whereRaw('score >= ?', [$quiz->pass_marks]);
            } elseif ($status === 'failed') {
                $query->whereRaw('score < ?', [$quiz->pass_marks]);
            }
        }

        // Apply sorting
        $sortBy = $request->get('sort', 'submitted_at');
        switch ($sortBy) {
            case 'score_desc':
                $query->orderBy('score', 'desc');
                break;
            case 'score_asc':
                $query->orderBy('score', 'asc');
                break;
            case 'name':
                $query->join('users', 'quiz_attempts.student_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc');
                break;
            default:
                $query->orderBy('submitted_at', 'desc');
        }

        $attempts = $query->paginate(20)->through(function ($attempt) use ($quiz) {
            return [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'total_marks' => $quiz->total_marks,
                'percentage' => $quiz->total_marks > 0 ? ($attempt->score / $quiz->total_marks) * 100 : 0,
                'has_passed' => $attempt->score >= $quiz->pass_marks,
                'submitted_at' => $attempt->submitted_at->toISOString(),
                'time_taken_minutes' => $this->calculateTimeTaken($attempt),
                'student' => [
                    'id' => $attempt->student->id,
                    'name' => $attempt->student->name,
                    'email' => $attempt->student->email,
                ]
            ];
        });

        // Calculate analytics
        $analytics = $this->getQuizAnalytics($quiz);

        return Inertia::render('Teacher/Quizzes/Results', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz,
            'attempts' => $attempts,
            'analytics' => $analytics,
            'filters' => $request->only(['search', 'status', 'sort'])
        ]);
    }

    /**
     * Activate a draft quiz
     */
    public function activate(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        // Check if quiz is in draft status
        if ($quiz->status !== 'draft') {
            return back()->withErrors(['error' => 'Only draft quizzes can be activated.']);
        }

        // Check if quiz has questions
        if ($quiz->questions()->count() === 0) {
            return back()->withErrors(['error' => 'Cannot activate quiz without questions. Please add questions first.']);
        }

        // Check if quiz has valid settings
        if ($quiz->pass_marks <= 0) {
            return back()->withErrors(['error' => 'Please set valid pass marks before activating.']);
        }

        DB::beginTransaction();
        
        try {
            // Activate the quiz
            $quiz->update(['status' => 'active']);

            // Log the activation
            \Log::info('Quiz activated', [
                'quiz_id' => $quiz->id,
                'quiz_title' => $quiz->title,
                'teacher_id' => Auth::id(),
                'batch_id' => $quiz->batch_id,
                'questions_count' => $quiz->questions()->count(),
                'total_marks' => $quiz->total_marks
            ]);

            DB::commit();

            return back()->with('success', 'Quiz activated successfully! Students can now take this quiz.');
            
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error activating quiz', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to activate quiz. Please try again.']);
        }
    }

    /**
     * Archive the quiz
     */
    public function archive(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->update(['status' => 'archived']);

        \Log::info('Quiz archived', [
            'quiz_id' => $quiz->id,
            'quiz_title' => $quiz->title,
            'teacher_id' => Auth::id()
        ]);

        return back()->with('success', 'Quiz archived successfully!');
    }

    /**
     * Delete the quiz
     */
    public function destroy(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        if ($quiz->attempts()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete quiz with existing attempts.']);
        }

        DB::beginTransaction();
        
        try {
            $quiz->questions()->delete();
            $quiz->delete();
            
            DB::commit();

            return redirect()->route('teacher.quizzes.index')
                ->with('success', 'Quiz deleted successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error deleting quiz', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to delete quiz. Please try again.']);
        }
    }

    /**
     * Duplicate a quiz
     */
    public function duplicate(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        DB::beginTransaction();
        
        try {
            $newQuiz = $quiz->replicate();
            $newQuiz->title = $quiz->title . ' (Copy)';
            $newQuiz->status = 'draft';
            $newQuiz->save();

            // Copy questions
            foreach ($quiz->questions as $question) {
                $newQuestion = $question->replicate();
                $newQuestion->quiz_id = $newQuiz->id;
                $newQuestion->save();
            }

            DB::commit();

            return redirect()->route('teacher.quizzes.edit', $newQuiz)
                ->with('success', 'Quiz duplicated successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error duplicating quiz', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to duplicate quiz. Please try again.']);
        }
    }

    // =============================================================================
    // PRIVATE HELPER METHODS
    // =============================================================================
    
    private function authorizeQuizAccess(Quiz $quiz)
    {
        $user = Auth::user();
        if (!$user || $quiz->batch->teacher_id !== $user->id) {
            \Log::warning('Unauthorized quiz access attempt', [
                'quiz_id' => $quiz->id,
                'user_id' => $user?->id,
                'quiz_teacher_id' => $quiz->batch->teacher_id
            ]);
            abort(403, 'Access denied.');
        }
    }

    private function getTeacherQuizStats($teacherId)
    {
        $batches = Batch::where('teacher_id', $teacherId)->pluck('id');
        
        return [
            'total_quizzes' => Quiz::whereIn('batch_id', $batches)->count(),
            'active_quizzes' => Quiz::whereIn('batch_id', $batches)->where('status', 'active')->count(),
            'draft_quizzes' => Quiz::whereIn('batch_id', $batches)->where('status', 'draft')->count(),
            'total_attempts' => QuizAttempt::whereHas('quiz', function ($q) use ($batches) {
                $q->whereIn('batch_id', $batches);
            })->where('is_completed', true)->count()
        ];
    }

    private function getQuizAnalytics(Quiz $quiz)
    {
        $completedAttempts = $quiz->attempts()->where('is_completed', true)->get();
        $totalAttempts = $completedAttempts->count();
        
        if ($totalAttempts === 0) {
            return [
                'total_attempts' => 0,
                'completion_rate' => 0,
                'average_score' => 0,
                'highest_score' => 0,
                'lowest_score' => 0,
                'pass_rate' => 0,
                'average_time_taken' => 0,
                'score_distribution' => [
                    '0-20%' => 0,
                    '21-40%' => 0,
                    '41-60%' => 0,
                    '61-80%' => 0,
                    '81-100%' => 0
                ]
            ];
        }

        $studentCount = $quiz->batch->students()->count();
        $scores = $completedAttempts->pluck('score');
        $passedAttempts = $completedAttempts->where('score', '>=', $quiz->pass_marks)->count();
        
        // Calculate score distribution
        $scoreDistribution = [
            '0-20%' => 0,
            '21-40%' => 0,
            '41-60%' => 0,
            '61-80%' => 0,
            '81-100%' => 0
        ];

        foreach ($completedAttempts as $attempt) {
            $percentage = $quiz->total_marks > 0 ? ($attempt->score / $quiz->total_marks) * 100 : 0;
            
            if ($percentage <= 20) {
                $scoreDistribution['0-20%']++;
            } elseif ($percentage <= 40) {
                $scoreDistribution['21-40%']++;
            } elseif ($percentage <= 60) {
                $scoreDistribution['41-60%']++;
            } elseif ($percentage <= 80) {
                $scoreDistribution['61-80%']++;
            } else {
                $scoreDistribution['81-100%']++;
            }
        }

        // Calculate average time taken
        $averageTime = 0;
        $attemptsWithTime = $completedAttempts->whereNotNull('started_at')->whereNotNull('submitted_at');
        
        if ($attemptsWithTime->count() > 0) {
            $totalMinutes = 0;
            foreach ($attemptsWithTime as $attempt) {
                $totalMinutes += $this->calculateTimeTaken($attempt) ?? 0;
            }
            $averageTime = $totalMinutes / $attemptsWithTime->count();
        }

        return [
            'total_attempts' => $totalAttempts,
            'completion_rate' => $studentCount > 0 ? ($totalAttempts / $studentCount) * 100 : 0,
            'average_score' => $scores->avg(),
            'highest_score' => $scores->max(),
            'lowest_score' => $scores->min(),
            'pass_rate' => ($passedAttempts / $totalAttempts) * 100,
            'average_time_taken' => $averageTime,
            'score_distribution' => $scoreDistribution
        ];
    }

    private function isQuizAvailable(Quiz $quiz)
    {
        if ($quiz->status !== 'active') {
            return false;
        }

        $now = Carbon::now();
        
        if ($quiz->start_time && $now->lt($quiz->start_time)) {
            return false;
        }
        
        if ($quiz->end_time && $now->gt($quiz->end_time)) {
            return false;
        }

        return true;
    }

    private function canEditQuiz(Quiz $quiz)
    {
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Estimate how long the quiz might take
     */
    private function estimateQuizTime(Quiz $quiz)
    {
        $estimatedMinutes = 0;
        
        foreach ($quiz->questions as $question) {
            // Basic time estimation per question type
            switch ($question->type) {
                case 'mcq':
                    $estimatedMinutes += 1.5; // 1.5 minutes per MCQ
                    break;
                case 'short_answer':
                    $estimatedMinutes += 3; // 3 minutes per short answer
                    break;
                default:
                    $estimatedMinutes += 2; // Default 2 minutes
            }
        }

        // Add buffer time for reading instructions
        $estimatedMinutes += 5;

        return round($estimatedMinutes);
    }

    /**
     * Calculate time taken for an attempt
     */
    private function calculateTimeTaken($attempt)
    {
        if (!$attempt->started_at || !$attempt->submitted_at) {
            return null;
        }

        $startTime = \Carbon\Carbon::parse($attempt->started_at);
        $endTime = \Carbon\Carbon::parse($attempt->submitted_at);
        
        return $startTime->diffInMinutes($endTime);
    }

    /**
     * Safely serialize user to prevent enum errors
     * This is critical for Inertia.js compatibility
     */
    private function serializeUserSafely($user)
    {
        if (!$user) {
            return null;
        }

        try {
            // Try normal serialization first
            return $user->toArray();
        } catch (\Exception $e) {
            // If that fails, create a safe fallback
            \Log::warning('Error serializing user, using fallback', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->attributes['role'] ?? 'teacher',
                'is_active' => $user->is_active ?? true,
                'is_approved' => $user->is_approved ?? true,
            ];
        }
    }
}