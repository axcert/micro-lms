<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'teacher_id',
        'start_date',
        'end_date',
        'max_students',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'max_students' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        // Add any sensitive fields here if needed
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'students_count',
        'is_full',
        'days_until_start',
        'status_text',
        'duration_text'
    ];

    // ===================== RELATIONSHIPS =====================

    /**
     * Get the teacher that owns the batch.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the students for the batch through the pivot table.
     * IMPORTANT: Using 'student_id' as the foreign key, not 'user_id'
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,         // Related model
            'batch_students',    // Pivot table name
            'batch_id',          // Foreign key for this model (Batch) in pivot table
            'student_id'         // Foreign key for related model (User) in pivot table
        )->withTimestamps()
         ->withPivot(['enrolled_at']); // Include enrollment date from pivot
    }

    /**
     * Get the batch student enrollments.
     */
    public function batchStudents(): HasMany
    {
        return $this->hasMany(BatchStudent::class);
    }

    /**
     * Get the lessons for the batch (using Lesson model that points to classes table).
     * THIS IS THE NEW RELATIONSHIP THAT FIXES THE DASHBOARD
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get the classes for the batch (if you have ClassModel).
     */
    public function classes(): HasMany
    {
        return $this->hasMany(ClassModel::class);
    }

    /**
     * Get the quizzes for the batch.
     */
    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    // ===================== ACCESSORS =====================

    /**
     * Get the student count for the batch.
     */
    public function getStudentsCountAttribute(): int
    {
        return $this->students()->count();
    }

    /**
     * Check if the batch is full.
     */
    public function getIsFullAttribute(): bool
    {
        if (!$this->max_students) {
            return false;
        }
        return $this->students_count >= $this->max_students;
    }

    /**
     * Get days until batch starts.
     */
    public function getDaysUntilStartAttribute(): int
    {
        if (!$this->start_date) {
            return 0;
        }
        return max(0, Carbon::now()->diffInDays($this->start_date, false));
    }

    /**
     * Get human-readable status text.
     */
    public function getStatusTextAttribute(): string
    {
        if (!$this->is_active) {
            return 'Inactive';
        }

        if (!$this->start_date) {
            return 'Active';
        }

        $daysUntilStart = $this->days_until_start;

        if ($daysUntilStart > 0) {
            if ($daysUntilStart == 1) {
                return 'Starting Tomorrow';
            } elseif ($daysUntilStart <= 7) {
                return "Starts in {$daysUntilStart} days";
            } else {
                return 'Starting Soon';
            }
        } elseif ($daysUntilStart == 0) {
            return 'Starting Today';
        } else {
            // Check if batch has ended
            if ($this->end_date && Carbon::now()->isAfter($this->end_date)) {
                return 'Completed';
            }
            return 'Active';
        }
    }

    /**
     * Get human-readable duration text.
     */
    public function getDurationTextAttribute(): string
    {
        if (!$this->start_date) {
            return 'No duration set';
        }

        if (!$this->end_date) {
            return 'Started ' . $this->start_date->format('M j, Y') . ' (Ongoing)';
        }

        $duration = $this->start_date->diffInMonths($this->end_date);
        
        if ($duration == 0) {
            $days = $this->start_date->diffInDays($this->end_date);
            return $days == 1 ? '1 day' : "{$days} days";
        } elseif ($duration == 1) {
            return '1 month';
        } else {
            return "{$duration} months";
        }
    }

    /**
     * Get formatted start date.
     */
    public function getFormattedStartDateAttribute(): string
    {
        return $this->start_date ? $this->start_date->format('M j, Y') : 'Not set';
    }

    /**
     * Get formatted end date.
     */
    public function getFormattedEndDateAttribute(): string
    {
        return $this->end_date ? $this->end_date->format('M j, Y') : 'Ongoing';
    }

    // ===================== SCOPES =====================

    /**
     * Scope a query to only include active batches.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include inactive batches.
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope a query to only include batches for a specific teacher.
     */
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    /**
     * Scope a query to only include batches starting soon.
     */
    public function scopeStartingSoon($query, $days = 7)
    {
        return $query->where('is_active', true)
                    ->where('start_date', '>', Carbon::now())
                    ->where('start_date', '<=', Carbon::now()->addDays($days));
    }

    /**
     * Scope a query to only include currently running batches.
     */
    public function scopeCurrentlyRunning($query)
    {
        return $query->where('is_active', true)
                    ->where('start_date', '<=', Carbon::now())
                    ->where(function ($q) {
                        $q->whereNull('end_date')
                          ->orWhere('end_date', '>=', Carbon::now());
                    });
    }

    /**
     * Scope a query to only include completed batches.
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('end_date')
                    ->where('end_date', '<', Carbon::now());
    }

    /**
     * Scope a query to only include full batches.
     */
    public function scopeFull($query)
    {
        return $query->whereNotNull('max_students')
                    ->whereHas('students', function ($q) {
                        $q->havingRaw('COUNT(*) >= batches.max_students');
                    });
    }

    // ===================== METHODS =====================

    /**
     * Check if the batch can accept more students.
     */
    public function canAcceptMoreStudents(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if (!$this->max_students) {
            return true;
        }

        return $this->students_count < $this->max_students;
    }

    /**
     * Get available spots in the batch.
     */
    public function getAvailableSpots(): ?int
    {
        if (!$this->max_students) {
            return null; // Unlimited
        }

        return max(0, $this->max_students - $this->students_count);
    }

    /**
     * Check if a student is enrolled in this batch.
     */
    public function hasStudent(User $student): bool
    {
        return $this->students()->where('student_id', $student->id)->exists();
    }

    /**
     * Add a student to the batch.
     */
    public function addStudent(User $student): bool
    {
        if (!$this->canAcceptMoreStudents()) {
            return false;
        }

        if ($this->hasStudent($student)) {
            return false;
        }

        $this->students()->attach($student->id, [
            'enrolled_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return true;
    }

    /**
     * Remove a student from the batch.
     */
    public function removeStudent(User $student): bool
    {
        if (!$this->hasStudent($student)) {
            return false;
        }

        $this->students()->detach($student->id);
        return true;
    }

    /**
     * Get batch progress percentage (if has end date).
     */
    public function getProgressPercentage(): ?float
    {
        if (!$this->start_date || !$this->end_date) {
            return null;
        }

        $today = Carbon::now();
        
        if ($today->isBefore($this->start_date)) {
            return 0.0;
        }

        if ($today->isAfter($this->end_date)) {
            return 100.0;
        }

        $totalDays = $this->start_date->diffInDays($this->end_date);
        $elapsedDays = $this->start_date->diffInDays($today);

        return $totalDays > 0 ? round(($elapsedDays / $totalDays) * 100, 1) : 0.0;
    }

    /**
     * Check if batch is currently active (started and not ended).
     */
    public function isCurrentlyActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $today = Carbon::now();

        // Must have started
        if ($this->start_date && $today->isBefore($this->start_date)) {
            return false;
        }

        // Must not have ended
        if ($this->end_date && $today->isAfter($this->end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Get statistics for the batch.
     */
    public function getStatistics(): array
    {
        return [
            'students_count' => $this->students_count,
            'available_spots' => $this->getAvailableSpots(),
            'classes_count' => $this->classes()->count(),
            'quizzes_count' => $this->quizzes()->count(),
            'progress_percentage' => $this->getProgressPercentage(),
            'days_until_start' => $this->days_until_start,
            'is_currently_active' => $this->isCurrentlyActive(),
            'can_accept_students' => $this->canAcceptMoreStudents(),
        ];
    }

    // ===================== BOOT METHODS =====================

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        // Set default values when creating
        static::creating(function ($batch) {
            if ($batch->is_active === null) {
                $batch->is_active = true;
            }
        });

        // Clean up related data when deleting
        static::deleting(function ($batch) {
            // Remove all student associations
            $batch->students()->detach();
            
            // Note: You might want to handle classes and quizzes differently
            // depending on your business logic
        });
    }
}