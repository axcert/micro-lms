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
        'user_id',        // Your actual column name (not student_id)
        'started_at',
        'submitted_at',
        'score',          // Your actual column name
        'percentage',     // Your actual column name
        'answers',        // Your actual column name
        'is_completed',   // Your actual column name
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
        'percentage' => 'decimal:2',
        'answers' => 'json',
        'is_completed' => 'boolean',
    ];

    // =============================================================================
    // RELATIONSHIPS
    // =============================================================================

    /**
     * Get the quiz that this attempt belongs to.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the student who made this attempt.
     * Using user_id as the foreign key (your actual column)
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Alias for student() method for consistency
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get quiz answers for this attempt
     */
    public function quizAnswers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    // =============================================================================
    // ACCESSORS & COMPUTED ATTRIBUTES
    // =============================================================================

    /**
     * Check if the student passed based on quiz pass marks
     */
    public function getHasPassedAttribute(): bool
    {
        if (!$this->quiz) {
            $this->load('quiz');
        }
        
        return $this->score >= $this->quiz->pass_marks;
    }

    /**
     * Get time taken in minutes
     */
    public function getTimeTakenMinutesAttribute(): ?int
    {
        if (!$this->started_at || !$this->submitted_at) {
            return null;
        }

        return $this->submitted_at->diffInMinutes($this->started_at);
    }

    /**
     * Get formatted time taken
     */
    public function getTimeTakenFormattedAttribute(): string
    {
        $minutes = $this->time_taken_minutes;
        
        if (!$minutes) {
            return 'N/A';
        }

        $hours = floor($minutes / 60);
        $mins = $minutes % 60;

        if ($hours > 0) {
            return "{$hours}h {$mins}m";
        }
        return "{$mins}m";
    }

    /**
     * Get status display
     */
    public function getStatusAttribute(): string
    {
        if (!$this->is_completed) {
            return 'in_progress';
        }
        
        return $this->has_passed ? 'passed' : 'failed';
    }

    /**
     * Get status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'passed' => 'green',
            'failed' => 'red',
            'in_progress' => 'yellow',
            default => 'gray'
        };
    }

    /**
     * Get grade display
     */
    public function getGradeAttribute(): string
    {
        if (!$this->is_completed) {
            return 'Incomplete';
        }

        $percentage = $this->percentage;
        
        if ($percentage >= 85) return 'A';
        if ($percentage >= 75) return 'B';
        if ($percentage >= 65) return 'C';
        if ($percentage >= 55) return 'D';
        return 'F';
    }

    // =============================================================================
    // SCOPES
    // =============================================================================

    /**
     * Scope to get attempts by a specific student
     */
    public function scopeByStudent($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get completed attempts
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope to get in-progress attempts
     */
    public function scopeInProgress($query)
    {
        return $query->where('is_completed', false);
    }

    /**
     * Scope to get attempts for a specific quiz
     */
    public function scopeForQuiz($query, $quizId)
    {
        return $query->where('quiz_id', $quizId);
    }

    /**
     * Scope to get passed attempts (based on quiz pass marks)
     */
    public function scopePassed($query)
    {
        return $query->whereRaw('score >= (SELECT pass_marks FROM quizzes WHERE quizzes.id = quiz_attempts.quiz_id)');
    }

    /**
     * Scope to get failed attempts
     */
    public function scopeFailed($query)
    {
        return $query->where('is_completed', true)
                    ->whereRaw('score < (SELECT pass_marks FROM quizzes WHERE quizzes.id = quiz_attempts.quiz_id)');
    }

    /**
     * Scope to get attempts with submitted_at not null
     */
    public function scopeSubmitted($query)
    {
        return $query->whereNotNull('submitted_at');
    }

    // =============================================================================
    // METHODS
    // =============================================================================

    /**
     * Check if attempt is completed
     */
    public function isCompleted(): bool
    {
        return $this->is_completed;
    }

    /**
     * Check if attempt is in progress
     */
    public function isInProgress(): bool
    {
        return !$this->is_completed;
    }

    /**
     * Calculate if student passed
     */
    public function calculateHasPassed(): bool
    {
        if (!$this->quiz) {
            $this->load('quiz');
        }
        
        return $this->score >= $this->quiz->pass_marks;
    }

    /**
     * Mark attempt as completed
     */
    public function markAsCompleted(float $score = null, float $percentage = null): void
    {
        $updateData = [
            'is_completed' => true,
            'submitted_at' => now(),
        ];

        if ($score !== null) {
            $updateData['score'] = $score;
        }

        if ($percentage !== null) {
            $updateData['percentage'] = $percentage;
        }

        $this->update($updateData);
    }

    /**
     * Calculate percentage from score and total marks
     */
    public function calculatePercentage(): float
    {
        if (!$this->quiz) {
            $this->load('quiz');
        }

        if ($this->quiz->total_marks <= 0) {
            return 0;
        }

        return round(($this->score / $this->quiz->total_marks) * 100, 2);
    }

    /**
     * Update percentage based on current score
     */
    public function updatePercentage(): void
    {
        $this->update(['percentage' => $this->calculatePercentage()]);
    }
}