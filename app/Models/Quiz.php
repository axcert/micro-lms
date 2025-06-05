<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'batch_id',
        'teacher_id',
        'start_time',
        'end_time',
        'duration_minutes',
        'total_marks',
        'is_active',
        'randomize_questions',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean',
        'randomize_questions' => 'boolean',
    ];

    /**
     * Get the batch that owns the quiz.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the teacher that created the quiz.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the quiz attempts using your actual column names.
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get questions for the quiz (if you have a Question model)
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Get students who have attempted this quiz using your actual schema
     */
    public function attemptedByStudents(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class, 
            'quiz_attempts',    // pivot table name
            'quiz_id',          // foreign key for this model (Quiz) in pivot table
            'student_id'        // foreign key for related model (User) in pivot table - use student_id
        )->withPivot(['total_score', 'max_score', 'status', 'submitted_at'])
         ->withTimestamps();
    }

    /**
     * Scope to get pending quizzes for a specific student.
     * FIXED to use your actual column names
     */
    public function scopePendingForStudent($query, $studentId)
    {
        return $query->where('end_time', '>=', now())
                     ->where('is_active', true)
                     ->whereDoesntHave('attempts', function ($query) use ($studentId) {
                         $query->where('student_id', $studentId)  // Use student_id
                               ->whereIn('status', ['submitted', 'completed']); // Use status
                     });
    }

    /**
     * Scope to get quizzes available to a student (through their batches)
     */
    public function scopeAvailableToStudent($query, $studentId)
    {
        return $query->whereHas('batch.students', function ($query) use ($studentId) {
            $query->where('batch_students.student_id', $studentId); // batch_students uses student_id
        });
    }

    /**
     * Check if a student has completed this quiz using your actual schema
     */
    public function hasBeenCompletedBy($studentId): bool
    {
        return $this->attempts()
                    ->where('student_id', $studentId)  // Use student_id
                    ->whereIn('status', ['submitted', 'completed']) // Use status
                    ->exists();
    }

    /**
     * Check if a student has an in-progress attempt for this quiz
     */
    public function hasInProgressAttemptBy($studentId): bool
    {
        return $this->attempts()
                    ->where('student_id', $studentId)  // Use student_id
                    ->whereIn('status', ['started', 'in_progress']) // Use status
                    ->exists();
    }

    /**
     * Get a student's attempt for this quiz using your actual schema
     */
    public function getAttemptByStudent($studentId)
    {
        return $this->attempts()
                    ->where('student_id', $studentId)  // Use student_id
                    ->first();
    }

    /**
     * Get a student's latest attempt for this quiz
     */
    public function getLatestAttemptByStudent($studentId)
    {
        return $this->attempts()
                    ->where('student_id', $studentId)  // Use student_id
                    ->latest()
                    ->first();
    }

    /**
     * Get completed attempts count using your actual schema
     */
    public function getCompletedAttemptsCountAttribute(): int
    {
        return $this->attempts()
                    ->whereIn('status', ['submitted', 'completed']) // Use status
                    ->count();
    }

    /**
     * Get average score for completed attempts using your actual schema
     */
    public function getAverageScoreAttribute(): float
    {
        $completedAttempts = $this->attempts()
                                 ->whereIn('status', ['submitted', 'completed']) // Use status
                                 ->whereNotNull('total_score')
                                 ->whereNotNull('max_score')
                                 ->where('max_score', '>', 0);

        if ($completedAttempts->count() === 0) {
            return 0;
        }

        $averagePercentage = $completedAttempts->get()
                                               ->avg(function ($attempt) {
                                                   return ($attempt->total_score / $attempt->max_score) * 100;
                                               });

        return round($averagePercentage, 2);
    }
}