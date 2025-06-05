<?php
// app/Services/QuizRandomizerService.php

namespace App\Services;

class QuizRandomizerService
{
    /**
     * Randomize questions for a user
     */
    public function randomizeQuestions($questions, $userId = null)
    {
        if ($userId) {
            // Use user ID as seed for consistent randomization per user
            srand($userId);
        }

        $randomizedQuestions = $questions->shuffle();
        
        // Reset random seed
        srand();
        
        return $randomizedQuestions;
    }

    /**
     * Randomize MCQ options
     */
    public function randomizeOptions($options, $userId = null, $questionId = null)
    {
        if ($userId && $questionId) {
            // Use combined seed for consistent randomization
            srand($userId + $questionId);
        }

        $shuffled = collect($options)->shuffle()->toArray();
        
        // Reset random seed
        srand();
        
        return $shuffled;
    }

    /**
     * Generate randomized quiz for user
     */
    public function generateUserQuiz($quiz, $userId)
    {
        $questions = $quiz->questions;
        
        if ($quiz->randomize_questions) {
            $questions = $this->randomizeQuestions($questions, $userId);
        }

        return $questions->map(function ($question) use ($userId, $quiz) {
            if ($question->type === 'mcq' && $quiz->randomize_options) {
                $question->options = $this->randomizeOptions($question->options, $userId, $question->id);
            }
            return $question;
        });
    }
}