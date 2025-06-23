<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display questions for a specific quiz
     */
    public function index(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load([
            'batch:id,name',
            'questions' => function ($q) {
                $q->orderBy('order');
            }
        ]);

        return Inertia::render('Teacher/Questions/Index', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz,
            'questions' => $quiz->questions
        ]);
    }

    /**
     * Show the form for creating a new question
     */
    public function create(Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $quiz->load(['batch:id,name']);

        return Inertia::render('Teacher/Questions/Create', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz
        ]);
    }

    /**
     * Store a newly created question
     */
    public function store(Request $request, Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $request->validate([
            'question_text' => 'required|string|max:2000',
            'question_type' => 'required|in:mcq,short_answer',
            'marks' => 'required|integer|min:1|max:100',
            'options' => 'required_if:question_type,mcq|array|min:2|max:6',
            'options.*' => 'required_if:question_type,mcq|string|max:500',
            'correct_answer' => 'required_if:question_type,mcq|string',
            'explanation' => 'nullable|string|max:1000',
        ], [
            'question_text.required' => 'Question text is required.',
            'question_type.required' => 'Please select a question type.',
            'marks.required' => 'Marks are required.',
            'marks.min' => 'Marks must be at least 1.',
            'marks.max' => 'Marks cannot exceed 100.',
            'options.required_if' => 'MCQ questions must have at least 2 options.',
            'options.min' => 'MCQ questions must have at least 2 options.',
            'options.max' => 'MCQ questions cannot have more than 6 options.',
            'correct_answer.required_if' => 'Please select the correct answer for MCQ questions.',
        ]);

        DB::beginTransaction();
        
        try {
            // Get the next order number
            $nextOrder = $quiz->questions()->max('order') + 1;

            // Prepare question data
            $questionData = [
                'quiz_id' => $quiz->id,
                'question_text' => $request->question_text,
                'type' => $request->question_type, // Using 'type' field from your model
                'marks' => $request->marks,
                'order' => $nextOrder,
            ];

            // Handle MCQ specific data
            if ($request->question_type === 'mcq') {
                $options = array_filter($request->options); // Remove empty options
                $options = array_values($options); // Re-index array
                
                if (count($options) < 2) {
                    return back()->withErrors(['options' => 'MCQ questions must have at least 2 options.']);
                }

                // Format options for your model structure
                $formattedOptions = [];
                foreach ($options as $index => $option) {
                    $formattedOptions[] = [
                        'id' => (string)$index,
                        'text' => $option
                    ];
                }

                $questionData['options'] = $formattedOptions;
                
                // Find the correct answer index
                $correctAnswerIndex = array_search($request->correct_answer, $options);
                $questionData['correct_answer'] = [(string)$correctAnswerIndex];
                
                // Validate that correct answer exists in options
                if ($correctAnswerIndex === false) {
                    return back()->withErrors(['correct_answer' => 'Correct answer must be one of the provided options.']);
                }
            } else {
                // For short answer questions
                $questionData['options'] = null;
                $questionData['correct_answer'] = $request->correct_answer ? [$request->correct_answer] : [];
            }

            $question = Question::create($questionData);

            // Update quiz total marks
            $quiz->updateTotalMarks();

            DB::commit();

            // Log the creation
            \Log::info('Question created', [
                'question_id' => $question->id,
                'quiz_id' => $quiz->id,
                'teacher_id' => Auth::id(),
                'question_type' => $request->question_type,
                'marks' => $request->marks
            ]);

            return redirect()->route('teacher.quizzes.questions.index', $quiz)
                ->with('success', 'Question created successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error creating question', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create question. Please try again.']);
        }
    }

    /**
     * Show the form for editing the specified question
     */
    public function edit(Quiz $quiz, Question $question)
    {
        $this->authorizeQuizAccess($quiz);
        $this->authorizeQuestionAccess($question, $quiz);

        $quiz->load(['batch:id,name']);

        return Inertia::render('Teacher/Questions/Edit', [
            'auth' => [
                'user' => $this->serializeUserSafely(Auth::user())
            ],
            'quiz' => $quiz,
            'question' => $question
        ]);
    }

    /**
     * Update the specified question
     */
    public function update(Request $request, Quiz $quiz, Question $question)
    {
        $this->authorizeQuizAccess($quiz);
        $this->authorizeQuestionAccess($question, $quiz);

        $request->validate([
            'question_text' => 'required|string|max:2000',
            'question_type' => 'required|in:mcq,short_answer',
            'marks' => 'required|integer|min:1|max:100',
            'options' => 'required_if:question_type,mcq|array|min:2|max:6',
            'options.*' => 'required_if:question_type,mcq|string|max:500',
            'correct_answer' => 'required_if:question_type,mcq|string',
            'explanation' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        
        try {
            $updateData = [
                'question_text' => $request->question_text,
                'type' => $request->question_type, // Using 'type' field from your model
                'marks' => $request->marks,
            ];

            // Handle MCQ specific data
            if ($request->question_type === 'mcq') {
                $options = array_filter($request->options);
                $options = array_values($options);
                
                if (count($options) < 2) {
                    return back()->withErrors(['options' => 'MCQ questions must have at least 2 options.']);
                }

                // Format options for your model structure
                $formattedOptions = [];
                foreach ($options as $index => $option) {
                    $formattedOptions[] = [
                        'id' => (string)$index,
                        'text' => $option
                    ];
                }

                $updateData['options'] = $formattedOptions;
                
                // Find the correct answer index
                $correctAnswerIndex = array_search($request->correct_answer, $options);
                $updateData['correct_answer'] = [(string)$correctAnswerIndex];
                
                if ($correctAnswerIndex === false) {
                    return back()->withErrors(['correct_answer' => 'Correct answer must be one of the provided options.']);
                }
            } else {
                // Clear MCQ data for short answer questions
                $updateData['options'] = null;
                $updateData['correct_answer'] = $request->correct_answer ? [$request->correct_answer] : [];
            }

            $question->update($updateData);

            // Update quiz total marks
            $quiz->updateTotalMarks();

            DB::commit();

            return redirect()->route('teacher.quizzes.questions.index', $quiz)
                ->with('success', 'Question updated successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error updating question', [
                'question_id' => $question->id,
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to update question. Please try again.']);
        }
    }

    /**
     * Remove the specified question
     */
    public function destroy(Quiz $quiz, Question $question)
    {
        $this->authorizeQuizAccess($quiz);
        $this->authorizeQuestionAccess($question, $quiz);

        // Check if quiz has been attempted
        if ($quiz->attempts()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete questions from a quiz that has been attempted.']);
        }

        DB::beginTransaction();
        
        try {
            $deletedOrder = $question->order;
            $question->delete();

            // Reorder remaining questions
            $quiz->questions()
                ->where('order', '>', $deletedOrder)
                ->decrement('order');

            // Update quiz total marks
            $quiz->updateTotalMarks();

            DB::commit();

            return back()->with('success', 'Question deleted successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error deleting question', [
                'question_id' => $question->id,
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to delete question. Please try again.']);
        }
    }

    /**
     * Reorder questions
     */
    public function reorder(Request $request, Quiz $quiz)
    {
        $this->authorizeQuizAccess($quiz);

        $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.order' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        
        try {
            foreach ($request->questions as $questionData) {
                $question = Question::find($questionData['id']);
                if ($question && $question->quiz_id == $quiz->id) {
                    $question->update(['order' => $questionData['order']]);
                }
            }

            DB::commit();

            return response()->json(['message' => 'Questions reordered successfully!']);
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error reordering questions', [
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to reorder questions.'], 500);
        }
    }

    /**
     * Duplicate a question
     */
    public function duplicate(Quiz $quiz, Question $question)
    {
        $this->authorizeQuizAccess($quiz);
        $this->authorizeQuestionAccess($question, $quiz);

        DB::beginTransaction();
        
        try {
            $newQuestion = $question->replicate();
            $newQuestion->question_text = $question->question_text . ' (Copy)';
            $newQuestion->order = $quiz->questions()->max('order') + 1;
            $newQuestion->save();

            // Update quiz total marks
            $quiz->updateTotalMarks();

            DB::commit();

            return back()->with('success', 'Question duplicated successfully!');
                
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error duplicating question', [
                'question_id' => $question->id,
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to duplicate question. Please try again.']);
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

    private function authorizeQuestionAccess(Question $question, Quiz $quiz)
    {
        if ($question->quiz_id !== $quiz->id) {
            \Log::warning('Question does not belong to quiz', [
                'question_id' => $question->id,
                'question_quiz_id' => $question->quiz_id,
                'quiz_id' => $quiz->id
            ]);
            abort(404, 'Question not found.');
        }
    }

    private function serializeUserSafely($user)
    {
        if (!$user) {
            return null;
        }

        try {
            return $user->toArray();
        } catch (\Exception $e) {
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