<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',      // Your actual column name
        'started_at',
        'submitted_at',
        'total_score',     // Your actual column name
        'max_score',       // Your actual column name
        'status',          // Your actual column name
        'question_order',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'total_score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'question_order' => 'array',
    ];

    // Status constants based on your actual database
    const STATUS_STARTED = 'started';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_COMPLETED = 'completed';

    /**
     * Get the quiz that this attempt belongs to.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the student who made this attempt.
     * Using student_id as the foreign key
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Alias for student() method for consistency with other code
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Calculate the percentage score based on your schema
     */
    public function getPercentageAttribute(): float
    {
        if ($this->max_score == 0) {
            return 0;
        }
        
        return round(($this->total_score / $this->max_score) * 100, 2);
    }

    /**
     * Check if the attempt is completed
     */
    public function getIsCompletedAttribute(): bool
    {
        return in_array($this->status, [self::STATUS_SUBMITTED, self::STATUS_COMPLETED]);
    }

    /**
     * Get time taken in seconds
     */
    public function getTimeTakenAttribute(): ?int
    {
        if (!$this->started_at || !$this->submitted_at) {
            return null;
        }

        return $this->submitted_at->diffInSeconds($this->started_at);
    }

    /**
     * Get formatted time taken
     */
    public function getFormattedTimeTakenAttribute(): string
    {
        $timeTaken = $this->time_taken;
        
        if (!$timeTaken) {
            return 'N/A';
        }

        $minutes = floor($timeTaken / 60);
        $seconds = $timeTaken % 60;

        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    /**
     * Scope to get attempts by a specific student
     */
    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    /**
     * Scope to get completed attempts using your status column
     */
    public function scopeCompleted($query)
    {
        return $query->whereIn('status', [self::STATUS_SUBMITTED, self::STATUS_COMPLETED]);
    }

    /**
     * Scope to get attempts for a specific quiz
     */
    public function scopeForQuiz($query, $quizId)
    {
        return $query->where('quiz_id', $quizId);
    }
}