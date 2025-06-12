<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'batch_id',
        'start_time',
        'end_time',
        'duration',
        'randomize_questions',
        'show_results_immediately',
        'allow_review',
        'max_attempts',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'randomize_questions' => 'boolean',
        'show_results_immediately' => 'boolean',
        'allow_review' => 'boolean',
    ];

    /**
     * Get the teacher that owns the quiz.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the batch that this quiz belongs to.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the questions for the quiz.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Get the quiz attempts.
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Check if the quiz is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               now()->between($this->start_time, $this->end_time);
    }

    /**
     * Get the total points for this quiz.
     */
    public function getTotalPointsAttribute(): int
    {
        return $this->questions()->sum('points');
    }
}