<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'title',
        'description',
        'batch_id',
        'zoom_link',
        'scheduled_at',
        'duration_minutes',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    /**
     * Get the batch that owns the lesson
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the attendance records for this lesson
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    /**
     * Scope to get upcoming lessons
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now());
    }

    /**
     * Scope to get past lessons
     */
    public function scopePast($query)
    {
        return $query->where('scheduled_at', '<', now());
    }

    /**
     * Scope to get today's lessons
     */
    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    /**
     * Scope to get lessons by status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if lesson is ongoing
     */
    public function isOngoing(): bool
    {
        $now = now();
        $endTime = $this->scheduled_at->addMinutes($this->duration_minutes);
        
        return $now >= $this->scheduled_at && $now <= $endTime;
    }

    /**
     * Check if lesson has ended
     */
    public function hasEnded(): bool
    {
        $endTime = $this->scheduled_at->addMinutes($this->duration_minutes);
        return now() > $endTime;
    }

    /**
     * Get the end time of the lesson
     */
    public function getEndTimeAttribute()
    {
        return $this->scheduled_at->addMinutes($this->duration_minutes);
    }
}