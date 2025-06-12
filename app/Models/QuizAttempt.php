<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'started_at',
        'completed_at',
        'score',
        'total_points',
        'status',
        'attempt_number',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'score' => 'decimal:2',
        'total_points' => 'integer',
    ];

    /**
     * Get the quiz for this attempt.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the student who made this attempt.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the answers for this attempt.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    /**
     * Calculate the percentage score.
     */
    public function getPercentageAttribute(): float
    {
        if ($this->total_points == 0) return 0;
        return ($this->score / $this->total_points) * 100;
    }
}