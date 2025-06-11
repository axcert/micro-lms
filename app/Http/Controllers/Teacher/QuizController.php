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
        
        $query = Quiz::with(['batch:id,name,teacher_id', 'questions:quiz_id,id'])
            ->whereHas('batch', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })
            ->withCount([
                'attempts',
                'attempts as completed_attempts_count' => function ($q) {
                    $q->whereNotNull('submitted_at');
                }
            ])
            ->withAvg('attempts as average_score', 'score');

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
            $quiz->pass_rate = $quiz->completed_attempts_count > 0 
                ? ($quiz->attempts->where('has_passed', true)->count() / $quiz->completed_attempts_count) * 100 
                : 0;
            $quiz->is_available = $this->isQuizAvailable($quiz);
            $quiz->can_edit = $this->canEditQuiz($quiz);
            unset($quiz->questions); // Remove to reduce payload
            return $quiz;
        });

        // Get stats for dashboard
        $stats = $this->getTeacherQuizStats($user->id);

        // Get teacher's batches for filter dropdown
        $batches = Batch::where('teacher_id', $user->id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Teacher/Quizzes/Index', [
            'quizzes' => $quizzes,
            'stats' => $stats,
            'batches' => $batches,
            'filters' => $request->only(['status', 'batch_id', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new quiz
     */
    public function create()
    {
        $user = Auth::user();
        $batches = Batch::where('teacher_id', $user->id)
            ->with('students:id,name,email')
            ->get();

        return Inertia::render('Teacher/Quizzes/Create', [
            'batches' => $batches
        ]);
    }

    /**
     * Store a newly created quiz
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
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
            'pass_marks' => 'required|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'start_time' => 'nullable|date|after:now',
            'end_time' => 'nullable|date|after:start_time',
            'max_attempts' => 'nullable|integer|min:1|max:10',
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
            return back()->withErrors(['error' => 'Failed to create quiz. Please try again.']);
        }
    }

    /**
     * Display the specified quiz
     */
    public function show(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load([
            'batch:id,name,student_count',
            'questions' => function ($q) {
                $q->orderBy('order');
            },
            'attempts' => function ($q) {
                $q->with('student:id,name,email')
                  ->whereNotNull('submitted_at')
                  ->orderBy('submitted_at', 'desc')
                  ->limit(10);
            }
        ]);

        // Calculate quiz analytics
        $analytics = $this->getQuizAnalytics($quiz);
        
        $quiz->is_available = $this->isQuizAvailable($quiz);
        $quiz->can_edit = $this->canEditQuiz($quiz);

        return Inertia::render('Teacher/Quizzes/Show', [
            'quiz' => $quiz,
            'analytics' => $analytics,
            'recentAttempts' => $quiz->attempts
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
            ->get();

        $quiz->can_edit = $this->canEditQuiz($quiz);

        return Inertia::render('Teacher/Quizzes/Edit', [
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
            'pass_marks' => 'required|integer|min:0',
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
            return back()->withErrors(['error' => 'Failed to update quiz. Please try again.']);
        }
    }

    /**
     * Activate a draft quiz
     */
    public function activate(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        if ($quiz->status !== 'draft') {
            return back()->withErrors(['error' => 'Only draft quizzes can be activated.']);
        }

        if ($quiz->questions()->count() === 0) {
            return back()->withErrors(['error' => 'Cannot activate quiz without questions.']);
        }

        $quiz->update(['status' => 'active']);

        return back()->with('success', 'Quiz activated successfully!');
    }

    /**
     * Archive the quiz
     */
    public function archive(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->update(['status' => 'archived']);

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
            return back()->withErrors(['error' => 'Failed to delete quiz. Please try again.']);
        }
    }

    /**
     * Show quiz results
     */
    public function results(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load(['batch:id,name,student_count']);

        $attempts = QuizAttempt::with(['student:id,name,email'])
            ->where('quiz_id', $quiz->id)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->paginate(20);

        $analytics = $this->getQuizAnalytics($quiz);

        return Inertia::render('Teacher/Quizzes/Results', [
            'quiz' => $quiz,
            'attempts' => $attempts,
            'analytics' => $analytics
        ]);
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
            return back()->withErrors(['error' => 'Failed to duplicate quiz. Please try again.']);
        }
    }

    // Private helper methods
    private function authorizeQuizAccess(Quiz $quiz)
    {
        if ($quiz->batch->teacher_id !== Auth::id()) {
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
            })->whereNotNull('submitted_at')->count()
        ];
    }

    private function getQuizAnalytics(Quiz $quiz)
    {
        $totalAttempts = $quiz->attempts()->whereNotNull('submitted_at')->count();
        $passedAttempts = $quiz->attempts()->where('has_passed', true)->count();
        
        $scores = $quiz->attempts()->whereNotNull('submitted_at')->pluck('score');
        
        return [
            'total_attempts' => $totalAttempts,
            'completion_rate' => $quiz->batch->student_count > 0 
                ? ($totalAttempts / $quiz->batch->student_count) * 100 
                : 0,
            'average_score' => $scores->avg() ?? 0,
            'highest_score' => $scores->max() ?? 0,
            'lowest_score' => $scores->min() ?? 0,
            'pass_rate' => $totalAttempts > 0 ? ($passedAttempts / $totalAttempts) * 100 : 0,
            'average_time_taken' => $quiz->attempts()
                ->whereNotNull('submitted_at')
                ->avg(DB::raw('TIMESTAMPDIFF(MINUTE, started_at, submitted_at)')) ?? 0,
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
}