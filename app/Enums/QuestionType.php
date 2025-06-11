<?php

namespace App\Enums;

enum QuestionType: string
{
    case MCQ = 'mcq';
    case MULTIPLE_CHOICE = 'multiple_choice';
    case TRUE_FALSE = 'true_false';
    case SHORT_ANSWER = 'short_answer';
    
    public function label(): string
    {
        return match($this) {
            self::MCQ => 'Multiple Choice (Single)',
            self::MULTIPLE_CHOICE => 'Multiple Choice (Multiple)',
            self::TRUE_FALSE => 'True/False',
            self::SHORT_ANSWER => 'Short Answer',
        };
    }
    
    public function hasOptions(): bool
    {
        return match($this) {
            self::MCQ, self::MULTIPLE_CHOICE, self::TRUE_FALSE => true,
            self::SHORT_ANSWER => false,
        };
    }
    
    public function allowsMultipleAnswers(): bool
    {
        return $this === self::MULTIPLE_CHOICE;
    }
}