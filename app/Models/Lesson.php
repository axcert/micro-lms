<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'classes'; // Using classes table

    protected $fillable = [
        'title',
        'description',
        'batch_id',
        'zoom_link',
        'zoom_meeting_id',
        'scheduled_at',
        'duration_minutes',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    /**
     * Get the batch that owns the lesson.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the teacher through the batch relationship.
     */
    public function teacher()
    {
        return $this->hasOneThrough(User::class, Batch::class, 'id', 'id', 'batch_id', 'teacher_id');
    }
}