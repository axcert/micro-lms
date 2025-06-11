<?php

namespace App\Services;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Support\Collection;

class QuizRandomizerService
{
    /**
     * Get randomized questions for a quiz attempt
     */
    public function getRandomizedQuestions(Quiz $quiz): Collection
    {
        $questions = $quiz->questions()->orderBy('order')->get();
        
        if ($quiz->shuffle_questions) {
            $questions = $questions->shuffle();
        }
        
        // Randomize options for each question if enabled
        if ($quiz->shuffle_options) {
            $questions = $questions->map(function ($question) {
                if ($question->options && is_array($question->options)) {
                    $shuffledOptions = collect($question->options)->shuffle()->values();
                    $question->options = $shuffledOptions->toArray();
                }
                return $question;
            });
        }
        
        return $questions;
    }
    
    /**
     * Prepare questions for display (without correct answers)
     */
    public function prepareQuestionsForDisplay(Collection $questions): Collection
    {
        return $questions->map(function ($question) {
            // Remove correct answers and explanations for display
            $displayQuestion = $question->toArray();
            unset($displayQuestion['correct_answer']);
            unset($displayQuestion['explanation']);
            
            // Ensure options are properly formatted
            if ($question->type === 'true_false') {
                $displayQuestion['options'] = [
                    ['id' => 'true', 'text' => 'True'],
                    ['id' => 'false', 'text' => 'False']
                ];
            }
            
            return $displayQuestion;
        });
    }
}