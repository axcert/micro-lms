<?php

namespace App\Enums;

enum QuestionType: string
{
    case MCQ = 'mcq';
    case SHORT_ANSWER = 'short_answer';
    case MULTIPLE_CHOICE = 'multiple_choice';
    case TRUE_FALSE = 'true_false';

    public function label(): string
    {
        return match($this) {
            self::MCQ => 'Multiple Choice Question',
            self::SHORT_ANSWER => 'Short Answer',
            self::MULTIPLE_CHOICE => 'Multiple Choice (Multiple Answers)',
            self::TRUE_FALSE => 'True/False',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::MCQ => 'check-circle',
            self::SHORT_ANSWER => 'file-text',
            self::MULTIPLE_CHOICE => 'check-square',
            self::TRUE_FALSE => 'toggle-left',
        };
    }

    public static function getBasicTypes(): array
    {
        return [
            self::MCQ,
            self::SHORT_ANSWER
        ];
    }
}