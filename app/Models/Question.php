<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\QuestionType;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'type',
        'question_text',
        'explanation',
        'marks',
        'order',
        'is_required',
        'options',
        'correct_answer',
        'case_sensitive',
        'partial_credit'
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'array',
        'marks' => 'integer',
        'order' => 'integer',
        'is_required' => 'boolean',
        'case_sensitive' => 'boolean',
        'partial_credit' => 'boolean',
        'type' => QuestionType::class
    ];

    // Relationships
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAnswer::class);
    }

    // Accessors
    public function getCorrectAnswerTextAttribute()
    {
        if ($this->type === QuestionType::SHORT_ANSWER) {
            return implode(', ', $this->correct_answer);
        }

        if (in_array($this->type, [QuestionType::MCQ, QuestionType::MULTIPLE_CHOICE])) {
            $options = collect($this->options);
            $correctTexts = [];
            
            foreach ($this->correct_answer as $correctId) {
                $option = $options->firstWhere('id', $correctId);
                if ($option) {
                    $correctTexts[] = $option['text'];
                }
            }
            
            return implode(', ', $correctTexts);
        }

        if ($this->type === QuestionType::TRUE_FALSE) {
            return $this->correct_answer[0] === 'true' ? 'True' : 'False';
        }

        return implode(', ', $this->correct_answer);
    }

    public function getAttemptsCountAttribute()
    {
        return $this->attempts()->count();
    }

    public function getCorrectAttemptsCountAttribute()
    {
        return $this->attempts()->where('is_correct', true)->count();
    }

    public function getCorrectPercentageAttribute()
    {
        $total = $this->attempts_count;
        if ($total === 0) return 0;
        
        return ($this->correct_attempts_count / $total) * 100;
    }

    public function getDifficultyLevelAttribute()
    {
        $percentage = $this->correct_percentage;
        
        if ($percentage >= 80) return 'Easy';
        if ($percentage >= 60) return 'Medium';
        return 'Hard';
    }

    // Scopes
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    public function scopeOptional($query)
    {
        return $query->where('is_required', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    // Methods
    public function checkAnswer($studentAnswer)
    {
        switch ($this->type) {
            case QuestionType::MCQ:
                return in_array($studentAnswer, $this->correct_answer);

            case QuestionType::MULTIPLE_CHOICE:
                if (!is_array($studentAnswer)) return false;
                
                sort($studentAnswer);
                $correctSorted = $this->correct_answer;
                sort($correctSorted);
                
                return $studentAnswer === $correctSorted;

            case QuestionType::TRUE_FALSE:
                return $studentAnswer === $this->correct_answer[0];

            case QuestionType::SHORT_ANSWER:
                if (!$this->case_sensitive) {
                    $studentAnswer = strtolower(trim($studentAnswer));
                    $correctAnswers = array_map(function($answer) {
                        return strtolower(trim($answer));
                    }, $this->correct_answer);
                } else {
                    $studentAnswer = trim($studentAnswer);
                    $correctAnswers = array_map('trim', $this->correct_answer);
                }
                
                return in_array($studentAnswer, $correctAnswers);

            default:
                return false;
        }
    }

    public function calculateScore($studentAnswer)
    {
        if ($this->checkAnswer($studentAnswer)) {
            return $this->marks;
        }

        // Handle partial credit for multiple choice questions
        if ($this->type === QuestionType::MULTIPLE_CHOICE && $this->partial_credit && is_array($studentAnswer)) {
            $correctCount = count(array_intersect($studentAnswer, $this->correct_answer));
            $incorrectCount = count(array_diff($studentAnswer, $this->correct_answer));
            $totalCorrect = count($this->correct_answer);
            
            // Give partial credit: (correct - incorrect) / total * marks
            $score = max(0, ($correctCount - $incorrectCount) / $totalCorrect * $this->marks);
            return round($score, 2);
        }

        return 0;
    }

    public function getOptionsForDisplay()
    {
        if (!$this->options) return null;

        if ($this->type === QuestionType::TRUE_FALSE) {
            return [
                ['id' => 'true', 'text' => 'True'],
                ['id' => 'false', 'text' => 'False']
            ];
        }

        return $this->options;
    }
}