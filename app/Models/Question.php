<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'type',
        'question_text',
        'options',
        'correct_answer',
        'marks',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'marks' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Get the quiz that owns the question
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the answers for this question
     */
    public function quizAnswers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    /**
     * Scope to get questions by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get MCQ questions
     */
    public function scopeMcq($query)
    {
        return $query->where('type', 'mcq');
    }

    /**
     * Scope to get short answer questions
     */
    public function scopeShortAnswer($query)
    {
        return $query->where('type', 'short_answer');
    }

    /**
     * Scope to order questions by their order field
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Check if question is MCQ
     */
    public function isMcq(): bool
    {
        return $this->type === 'mcq';
    }

    /**
     * Check if question is short answer
     */
    public function isShortAnswer(): bool
    {
        return $this->type === 'short_answer';
    }

    /**
     * Get shuffled options for MCQ
     */
    public function getShuffledOptions(): array
    {
        if (!$this->isMcq() || !$this->options) {
            return [];
        }

        $options = $this->options;
        shuffle($options);
        return $options;
    }
}