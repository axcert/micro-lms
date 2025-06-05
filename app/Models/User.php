<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get batches where this user is a teacher
     */
    public function teachingBatches(): HasMany
    {
        return $this->hasMany(Batch::class, 'teacher_id');
    }

    /**
     * Get batches where this user is a student
     * Using the corrected foreign key 'student_id'
     */
    public function studentBatches(): BelongsToMany
    {
        return $this->belongsToMany(
            Batch::class,
            'batch_students',    // Pivot table
            'student_id',        // Foreign key for this model (User) in pivot table
            'batch_id'           // Foreign key for related model (Batch) in pivot table
        )->withTimestamps();
    }

    /**
     * Get batch enrollments for this student
     */
    public function batchEnrollments(): HasMany
    {
        return $this->hasMany(BatchStudent::class, 'student_id');
    }

    // ========== QUIZ-RELATED RELATIONSHIPS USING YOUR ACTUAL SCHEMA ==========

    /**
     * Get quiz attempts made by this user
     * Using 'student_id' based on your actual database schema
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'student_id'); // Use student_id
    }

    /**
     * Get quizzes this user has attempted using your actual schema
     */
    public function attemptedQuizzes(): BelongsToMany
    {
        return $this->belongsToMany(
            Quiz::class, 
            'quiz_attempts',    // pivot table name
            'student_id',       // foreign key for this model (User) in pivot table - use student_id
            'quiz_id'           // foreign key for related model (Quiz) in pivot table
        )->withPivot(['total_score', 'max_score', 'status', 'submitted_at'])
         ->withTimestamps();
    }

    /**
     * Get quizzes created by this teacher
     */
    public function createdQuizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'teacher_id');
    }

    /**
     * Get completed quiz attempts using your actual schema
     */
    public function completedQuizAttempts()
    {
        return $this->quizAttempts()
                    ->whereIn('status', ['submitted', 'completed']); // Use status
    }

    /**
     * Get in-progress quiz attempts using your actual schema
     */
    public function inProgressQuizAttempts()
    {
        return $this->quizAttempts()
                    ->whereIn('status', ['started', 'in_progress']); // Use status
    }

    /**
     * Get pending quizzes for this student using your actual schema
     */
    public function pendingQuizzes()
    {
        return Quiz::whereHas('batch.students', function ($query) {
                $query->where('batch_students.student_id', $this->id); // batch_students uses student_id
            })
            ->where('end_time', '>=', now())
            ->whereDoesntHave('attempts', function ($query) {
                $query->where('student_id', $this->id) // quiz_attempts uses student_id
                      ->whereIn('status', ['submitted', 'completed']); // Use status
            });
    }

    /**
     * Get available quizzes for this student (through their batches)
     */
    public function availableQuizzes()
    {
        return Quiz::whereHas('batch.students', function ($query) {
                $query->where('batch_students.student_id', $this->id); // batch_students uses student_id
            });
    }

    /**
     * Get student statistics for dashboard using your actual schema
     */
    public function getStudentStats()
    {
        if (!$this->isStudent()) {
            return [
                'averageScore' => 0,
                'quizzesCompleted' => 0,
                'attendance' => 0,
            ];
        }

        $completedAttempts = $this->quizAttempts()
                                 ->whereIn('status', ['submitted', 'completed']) // Use status
                                 ->whereNotNull('total_score')
                                 ->whereNotNull('max_score')
                                 ->where('max_score', '>', 0);

        // Calculate average percentage score using your actual column names
        $averageScore = 0;
        if ($completedAttempts->count() > 0) {
            $averageScore = $completedAttempts->get()->avg(function ($attempt) {
                return ($attempt->total_score / $attempt->max_score) * 100;
            });
        }

        return [
            'averageScore' => round($averageScore, 1),
            'quizzesCompleted' => $completedAttempts->count(),
            'attendance' => 85, // This would need to be calculated based on your attendance system
        ];
    }

    // ========== EXISTING ROLE METHODS ==========

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is teacher
     */
    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    /**
     * Check if user is student
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }
}