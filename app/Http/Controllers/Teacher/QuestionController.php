<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of questions for a specific quiz.
     */
    public function index(string $quizId)
    {
        // TODO: Get questions for the specified quiz
        $questions = collect([]); // Placeholder - replace with actual data
        
        return Inertia::render('Teacher/Questions/Index', [
            'quiz' => [], // Placeholder - quiz details
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create(string $quizId)
    {
        // TODO: Get quiz details
        $quiz = []; // Placeholder - replace with actual quiz data
        
        return Inertia::render('Teacher/Questions/Create', [
            'quiz' => $quiz
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(Request $request, string $quizId)
    {
        // TODO: Validate and store the question
        $request->validate([
            'question_text' => 'required|string',
            'question_type' => 'required|in:mcq,short_answer',
            'options' => 'required_if:question_type,mcq|array|min:2',
            'options.*' => 'required_if:question_type,mcq|string',
            'correct_answer' => 'required|string',
            'points' => 'required|integer|min:1',
            'explanation' => 'nullable|string',
        ]);

        // TODO: Create question logic here
        
        return redirect()->route('teacher.quizzes.questions.index', $quizId)
                         ->with('success', 'Question added successfully!');
    }

    /**
     * Display the specified question.
     */
    public function show(string $quizId, string $id)
    {
        // TODO: Show specific question details
        return Inertia::render('Teacher/Questions/Show', [
            'quiz' => [], // Placeholder
            'question' => [] // Placeholder
        ]);
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(string $quizId, string $id)
    {
        // TODO: Get question and quiz for editing
        return Inertia::render('Teacher/Questions/Edit', [
            'quiz' => [], // Placeholder
            'question' => [] // Placeholder
        ]);
    }

    /**
     * Update the specified question.
     */
    public function update(Request $request, string $quizId, string $id)
    {
        // TODO: Validate and update the question
        $request->validate([
            'question_text' => 'required|string',
            'question_type' => 'required|in:mcq,short_answer',
            'options' => 'required_if:question_type,mcq|array|min:2',
            'options.*' => 'required_if:question_type,mcq|string',
            'correct_answer' => 'required|string',
            'points' => 'required|integer|min:1',
            'explanation' => 'nullable|string',
        ]);

        // TODO: Update question logic here
        
        return redirect()->route('teacher.quizzes.questions.index', $quizId)
                         ->with('success', 'Question updated successfully!');
    }

    /**
     * Remove the specified question.
     */
    public function destroy(string $quizId, string $id)
    {
        // TODO: Delete question logic
        
        return redirect()->route('teacher.quizzes.questions.index', $quizId)
                         ->with('success', 'Question deleted successfully!');
    }
}