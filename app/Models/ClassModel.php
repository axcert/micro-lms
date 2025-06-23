<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassModel extends Model
{
    use HasFactory;

    protected $table = 'classes'; // Specify the table name

    protected $fillable = [
        'title',
        'description',
        'batch_id',
        'teacher_id',
        'scheduled_at',
        'zoom_link',
        'status',
        'duration_minutes',
        'is_recurring',
        'recurring_pattern',
        'max_attendance'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
        'is_recurring' => 'boolean',
        'max_attendance' => 'integer'
    ];

    /**
     * Get the batch that owns the class.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the teacher that created the class.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get attendance records for this class.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    /**
     * Scope to get upcoming classes.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
                     ->where('status', '!=', 'cancelled');
    }

    /**
     * Scope to get classes for a specific batch.
     */
    public function scopeForBatch($query, $batchId)
    {
        return $query->where('batch_id', $batchId);
    }

    /**
     * Scope to get classes for a specific teacher.
     */
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    /**
     * Check if the class is upcoming.
     */
    public function isUpcoming(): bool
    {
        return $this->scheduled_at && $this->scheduled_at->isFuture();
    }

    /**
     * Check if the class is ongoing.
     */
    public function isOngoing(): bool
    {
        if (!$this->scheduled_at) {
            return false;
        }
        
        $now = now();
        $endTime = $this->scheduled_at->addMinutes($this->duration_minutes ?? 60);
        
        return $now->between($this->scheduled_at, $endTime);
    }

    /**
     * Check if the class has ended.
     */
    public function hasEnded(): bool
    {
        if (!$this->scheduled_at) {
            return false;
        }
        
        $endTime = $this->scheduled_at->addMinutes($this->duration_minutes ?? 60);
        return now()->isAfter($endTime);
    }

    /**
     * Get the status with automatic detection.
     */
    public function getAutoStatusAttribute(): string
    {
        if ($this->status === 'cancelled') {
            return 'cancelled';
        }

        if ($this->isUpcoming()) {
            return 'scheduled';
        }

        if ($this->isOngoing()) {
            return 'ongoing';
        }

        if ($this->hasEnded()) {
            return 'completed';
        }

        return $this->status ?? 'scheduled';
    }

    /**
     * Get formatted scheduled time.
     */
    public function getFormattedScheduledTimeAttribute(): string
    {
        return $this->scheduled_at ? 
            $this->scheduled_at->format('M j, Y \a\t g:i A') : 
            'Not scheduled';
    }

    /**
     * Get duration in human readable format.
     */
    public function getFormattedDurationAttribute(): string
    {
        if (!$this->duration_minutes) {
            return '1 hour'; // default
        }

        $hours = intdiv($this->duration_minutes, 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }
}