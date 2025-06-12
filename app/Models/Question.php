<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'options',
        'correct_answer',
        'points',
        'explanation',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'points' => 'integer',
    ];

    /**
     * Get the quiz that owns the question.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Check if this is a multiple choice question.
     */
    public function isMCQ(): bool
    {
        return $this->question_type === 'mcq';
    }

    /**
     * Check if this is a short answer question.
     */
    public function isShortAnswer(): bool
    {
        return $this->question_type === 'short_answer';
    }
}