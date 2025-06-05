<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'class_id',
        'user_id',
        'status',
        'marked_at',
        'marked_by',
        'notes',
    ];

    protected $casts = [
        'marked_at' => 'datetime',
    ];

    /**
     * Get the lesson that owns the attendance record
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'class_id');
    }

    /**
     * Get the class that owns the attendance record (alias for lesson)
     */
    public function class(): BelongsTo
    {
        return $this->lesson();
    }

    /**
     * Get the user (student) that owns the attendance record
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who marked the attendance
     */
    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    /**
     * Scope to get present students
     */
    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    /**
     * Scope to get absent students
     */
    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    /**
     * Scope to get late students
     */
    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    /**
     * Scope to get attendance for a specific class
     */
    public function scopeForClass($query, $classId)
    {
        return $query->where('class_id', $classId);
    }

    /**
     * Scope to get attendance for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}