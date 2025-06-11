<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Http\Requests\Teacher\CreateQuestionRequest;
use App\Http\Requests\Teacher\UpdateQuestionRequest;
use App\Enums\QuestionType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:teacher');
    }

    /**
     * Display questions for a specific quiz
     */
    public function index(Quiz $quiz)
    {
        $this->authorize('view', $quiz);

        $questions = $quiz->questions()
            ->with(['attempts' => function ($q) {
                $q->select('question_id', 'is_correct');
            }])
            ->orderBy('order')
            ->get();

        // Calculate analytics for each question
        $questions->transform(function ($question) {
            $totalAttempts = $question->attempts->count();
            $correctAttempts = $question->attempts->where('is_correct', true)->count();
            
            $question->attempts_count = $totalAttempts;
            $question->correct_attempts_count = $correctAttempts;
            $question->correct_percentage = $totalAttempts > 0 ? ($correctAttempts / $totalAttempts) * 100 : 0;
            $question->difficulty_level = $this->calculateDifficultyLevel($question->correct_percentage);
            
            unset($question->attempts);
            return $question;
        });

        return response()->json([
            'questions' => $questions,
            'can_edit' => $this->canEditQuiz($quiz)
        ]);
    }

    /**
     * Store a new question
     */
    public function store(CreateQuestionRequest $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        if (!$this->canEditQuiz($quiz)) {
            return response()->json(['error' => 'Cannot add questions to this quiz'], 403);
        }

        DB::beginTransaction();
        
        try {
            // Get the next order number
            $nextOrder = $quiz->questions()->max('order') + 1;

            $question = Question::create([
                'quiz_id' => $quiz->id,
                'type' => $request->type,
                'question_text' => $request->question_text,
                'explanation' => $request->explanation,
                'marks' => $request->marks,
                'order' => $nextOrder,
                'is_required' => $request->is_required ?? true,
                'options' => $this->processOptions($request->type, $request->options),
                'correct_answer' => $this->processCorrectAnswer($request->type, $request->correct_answer),
                'case_sensitive' => $request->case_sensitive ?? false,
                'partial_credit' => $request->partial_credit ?? false
            ]);

            // Update quiz total marks
            $this->updateQuizTotalMarks($quiz);

            DB::commit();

            return response()->json([
                'message' => 'Question added successfully!',
                'question' => $question->load('quiz:id,total_marks')
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to create question'], 500);
        }
    }

    /**
     * Display a specific question
     */
    public function show(Quiz $quiz, Question $question)
    {
        $this->authorize('view', $quiz);

        if ($question->quiz_id !== $quiz->id) {
            abort(404);
        }

        $question->load(['attempts' => function ($q) {
            $q->with('student:id,name')->latest();
        }]);

        // Calculate question analytics
        $totalAttempts = $question->attempts->count();
        $correctAttempts = $question->attempts->where('is_correct', true)->count();
        
        $analytics = [
            'total_attempts' => $totalAttempts,
            'correct_attempts' => $correctAttempts,
            'incorrect_attempts' => $totalAttempts - $correctAttempts,
            'correct_percentage' => $totalAttempts > 0 ? ($correctAttempts / $totalAttempts) * 100 : 0,
            'difficulty_level' => $this->calculateDifficultyLevel($totalAttempts > 0 ? ($correctAttempts / $totalAttempts) * 100 : 0)
        ];

        return response()->json([
            'question' => $question,
            'analytics' => $analytics
        ]);
    }

    /**
     * Update a question
     */
    public function update(UpdateQuestionRequest $request, Quiz $quiz, Question $question)
    {
        $this->authorize('update', $quiz);

        if ($question->quiz_id !== $quiz->id) {
            abort(404);
        }

        if (!$this->canEditQuiz($quiz)) {
            return response()->json(['error' => 'Cannot edit questions for this quiz'], 403);
        }

        DB::beginTransaction();
        
        try {
            $question->update([
                'type' => $request->type,
                'question_text' => $request->question_text,
                'explanation' => $request->explanation,
                'marks' => $request->marks,
                'is_required' => $request->is_required ?? true,
                'options' => $this->processOptions($request->type, $request->options),
                'correct_answer' => $this->processCorrectAnswer($request->type, $request->correct_answer),
                'case_sensitive' => $request->case_sensitive ?? false,
                'partial_credit' => $request->partial_credit ?? false
            ]);

            // Update quiz total marks
            $this->updateQuizTotalMarks($quiz);

            DB::commit();

            return response()->json([
                'message' => 'Question updated successfully!',
                'question' => $question->fresh()
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to update question'], 500);
        }
    }

    /**
     * Delete a question
     */
    public function destroy(Quiz $quiz, Question $question)
    {
        $this->authorize('update', $quiz);

        if ($question->quiz_id !== $quiz->id) {
            abort(404);
        }

        if (!$this->canEditQuiz($quiz)) {
            return response()->json(['error' => 'Cannot delete questions from this quiz'], 403);
        }

        if ($question->attempts()->exists()) {
            return response()->json(['error' => 'Cannot delete question with existing attempts'], 403);
        }

        DB::beginTransaction();
        
        try {
            $order = $question->order;
            $question->delete();

            // Reorder remaining questions
            $quiz->questions()
                ->where('order', '>', $order)
                ->decrement('order');

            // Update quiz total marks
            $this->updateQuizTotalMarks($quiz);

            DB::commit();

            return response()->json(['message' => 'Question deleted successfully!']);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to delete question'], 500);
        }
    }

    /**
     * Reorder questions
     */
    public function reorder(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        if (!$this->canEditQuiz($quiz)) {
            return response()->json(['error' => 'Cannot reorder questions for this quiz'], 403);
        }

        $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.order' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();
        
        try {
            foreach ($request->questions as $questionData) {
                Question::where('id', $questionData['id'])
                    ->where('quiz_id', $quiz->id)
                    ->update(['order' => $questionData['order']]);
            }

            DB::commit();

            return response()->json(['message' => 'Questions reordered successfully!']);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to reorder questions'], 500);
        }
    }

    /**
     * Duplicate a question
     */
    public function duplicate(Quiz $quiz, Question $question)
    {
        $this->authorize('update', $quiz);

        if ($question->quiz_id !== $quiz->id) {
            abort(404);
        }

        if (!$this->canEditQuiz($quiz)) {
            return response()->json(['error' => 'Cannot duplicate questions for this quiz'], 403);
        }

        DB::beginTransaction();
        
        try {
            $newQuestion = $question->replicate();
            $newQuestion->question_text = $question->question_text . ' (Copy)';
            $newQuestion->order = $quiz->questions()->max('order') + 1;
            $newQuestion->save();

            // Update quiz total marks
            $this->updateQuizTotalMarks($quiz);

            DB::commit();

            return response()->json([
                'message' => 'Question duplicated successfully!',
                'question' => $newQuestion
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to duplicate question'], 500);
        }
    }

    /**
     * Process options based on question type
     */
    private function processOptions($type, $options)
    {
        if (in_array($type, [QuestionType::MCQ, QuestionType::MULTIPLE_CHOICE, QuestionType::TRUE_FALSE])) {
            return $options;
        }
        
        return null;
    }

    /**
     * Process correct answer based on question type
     */
    private function processCorrectAnswer($type, $correctAnswer)
    {
        if (in_array($type, [QuestionType::MCQ, QuestionType::MULTIPLE_CHOICE, QuestionType::TRUE_FALSE])) {
            return is_array($correctAnswer) ? $correctAnswer : [$correctAnswer];
        }
        
        // For short answer questions, store as array to allow multiple acceptable answers
        return is_array($correctAnswer) ? $correctAnswer : [$correctAnswer];
    }

    /**
     * Update quiz total marks
     */
    private function updateQuizTotalMarks(Quiz $quiz)
    {
        $totalMarks = $quiz->questions()->sum('marks');
        $quiz->update(['total_marks' => $totalMarks]);
    }

    /**
     * Check if quiz can be edited
     */
    private function canEditQuiz(Quiz $quiz)
    {
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Calculate difficulty level based on correct percentage
     */
    private function calculateDifficultyLevel($correctPercentage)
    {
        if ($correctPercentage >= 80) return 'Easy';
        if ($correctPercentage >= 60) return 'Medium';
        return 'Hard';
    }
}