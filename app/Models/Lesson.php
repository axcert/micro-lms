<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'classes'; // Using classes table

    protected $fillable = [
        'title',
        'description',
        'batch_id',
        'teacher_id',
        'scheduled_at',
        'duration_minutes',
        'status',
        'zoom_link',
        'zoom_meeting_id',
        'zoom_start_url',
        'zoom_password',
        'max_attendees',
        'notes',
        'recording_url',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
        'max_attendees' => 'integer',
    ];

    protected $appends = [
        'end_time',
        'is_upcoming',
        'is_completed',
        'can_start',
        'formatted_duration',
    ];

    /**
     * Get the batch that owns the lesson.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the teacher that owns the lesson.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get all attendance records for this class.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    /**
     * Get attendance records with student information.
     */
    public function attendancesWithStudents()
    {
        return $this->attendances()->with('user:id,name,email');
    }

    /**
     * Scope to filter by teacher
     */
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where(function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId)
              ->orWhereHas('batch', function ($batchQuery) use ($teacherId) {
                  $batchQuery->where('teacher_id', $teacherId);
              });
        });
    }

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter upcoming classes
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
                     ->where('status', 'scheduled');
    }

    /**
     * Scope to filter today's classes
     */
    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    /**
     * Get the end time of the class
     */
    public function getEndTimeAttribute()
    {
        return $this->scheduled_at->addMinutes($this->duration_minutes);
    }

    /**
     * Check if the class is upcoming
     */
    public function getIsUpcomingAttribute()
    {
        return $this->scheduled_at->isFuture() && $this->status === 'scheduled';
    }

    /**
     * Check if the class is completed
     */
    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed' || $this->end_time->isPast();
    }

    /**
     * Check if the class can be started
     */
    public function getCanStartAttribute()
    {
        $now = Carbon::now();
        $scheduledAt = $this->scheduled_at;
        
        // Can start 15 minutes before scheduled time and until scheduled time
        $canStartTime = $scheduledAt->copy()->subMinutes(15);
        
        return $now->gte($canStartTime) && 
               $now->lte($scheduledAt) && 
               in_array($this->status, ['scheduled', 'live']);
    }

    /**
     * Get formatted duration string
     */
    public function getFormattedDurationAttribute()
    {
        $minutes = $this->duration_minutes;
        
        if ($minutes < 60) {
            return $minutes . 'm';
        }
        
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;
        
        if ($remainingMinutes === 0) {
            return $hours . 'h';
        }
        
        return $hours . 'h ' . $remainingMinutes . 'm';
    }

    /**
     * Get attendance statistics for this class
     */
    public function getAttendanceStats()
    {
        $attendances = $this->attendances;
        $total = $attendances->count();
        
        if ($total === 0) {
            // Get approved student count from batch
            $batchStudentCount = $this->batch->students()->count();
            return [
                'total_students' => $batchStudentCount,
                'present_count' => 0,
                'absent_count' => 0,
                'late_count' => 0,
                'attendance_rate' => 0,
            ];
        }
        
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();
        
        return [
            'total_students' => $total,
            'present_count' => $present,
            'absent_count' => $absent,
            'late_count' => $late,
            'attendance_rate' => round(($present / $total) * 100, 1),
        ];
    }

    /**
     * Start the class (update status to live)
     */
    public function start()
    {
        $this->update(['status' => 'live']);
        return $this;
    }

    /**
     * Complete the class
     */
    public function complete()
    {
        $this->update(['status' => 'completed']);
        return $this;
    }

    /**
     * Cancel the class
     */
    public function cancel()
    {
        $this->update(['status' => 'cancelled']);
        return $this;
    }

    /**
     * Reschedule the class
     */
    public function reschedule(Carbon $newDateTime)
    {
        $this->update([
            'scheduled_at' => $newDateTime,
            'status' => 'rescheduled'
        ]);
        return $this;
    }

    /**
     * Check if class has Zoom meeting configured
     */
    public function hasZoomMeeting()
    {
        return !empty($this->zoom_meeting_id) || !empty($this->zoom_link);
    }

    /**
     * Get Zoom meeting details
     */
    public function getZoomMeetingDetails()
    {
        if (!$this->hasZoomMeeting()) {
            return null;
        }

        return [
            'meeting_id' => $this->zoom_meeting_id,
            'join_url' => $this->zoom_link,
            'start_url' => $this->zoom_start_url,
            'password' => $this->zoom_password,
        ];
    }

    /**
     * Boot method to set defaults
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lesson) {
            // Set teacher_id from batch if not set
            if (!$lesson->teacher_id && $lesson->batch_id) {
                $batch = Batch::find($lesson->batch_id);
                if ($batch && $batch->teacher_id) {
                    $lesson->teacher_id = $batch->teacher_id;
                }
            }
            
            // Set default status if not set
            if (!$lesson->status) {
                $lesson->status = 'scheduled';
            }
        });
    }
}