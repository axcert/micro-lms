<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'instructions',
        'batch_id',
        'total_marks',
        'pass_marks',
        'duration_minutes',
        'start_time',
        'end_time',
        'max_attempts',
        'shuffle_questions',
        'shuffle_options',
        'show_results_immediately',
        'allow_review',
        'auto_submit',
        'require_webcam',
        'prevent_copy_paste',
        'status'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'shuffle_questions' => 'boolean',
        'shuffle_options' => 'boolean',
        'show_results_immediately' => 'boolean',
        'allow_review' => 'boolean',
        'auto_submit' => 'boolean',
        'require_webcam' => 'boolean',
        'prevent_copy_paste' => 'boolean',
        'total_marks' => 'integer',
        'pass_marks' => 'integer',
        'duration_minutes' => 'integer',
        'max_attempts' => 'integer'
    ];

    protected $dates = [
        'start_time',
        'end_time',
        'created_at',
        'updated_at'
    ];

    // Add these to be automatically appended to JSON
    protected $appends = [
        'is_available',
        'can_edit',
        'pass_rate',
        'average_score',
        'completion_rate'
    ];

    // Relationships
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function completedAttempts()
    {
        return $this->hasMany(QuizAttempt::class)->whereNotNull('submitted_at');
    }

    public function successfulAttempts()
    {
        return $this->hasMany(QuizAttempt::class)->where('has_passed', true);
    }

    // Accessors & Computed Properties
    public function getIsAvailableAttribute()
    {
        if ($this->status !== 'active') {
            return false;
        }

        $now = now();
        
        if ($this->start_time && $now->lt($this->start_time)) {
            return false;
        }
        
        if ($this->end_time && $now->gt($this->end_time)) {
            return false;
        }

        return true;
    }

    public function getCanEditAttribute()
    {
        return $this->status === 'draft' || 
               ($this->status === 'active' && $this->attempts()->count() === 0);
    }

    public function getPassRateAttribute()
    {
        $totalAttempts = $this->completedAttempts()->count();
        if ($totalAttempts === 0) return 0;

        $passedAttempts = $this->successfulAttempts()->count();
        return round(($passedAttempts / $totalAttempts) * 100, 1);
    }

    public function getAverageScoreAttribute()
    {
        return round($this->completedAttempts()->avg('score') ?? 0, 1);
    }

    public function getCompletionRateAttribute()
    {
        $studentCount = $this->batch ? $this->batch->students_count : 0;
        if ($studentCount === 0) return 0;
        
        $totalAttempts = $this->completedAttempts()->count();
        return round(($totalAttempts / $studentCount) * 100, 1);
    }

    public function getQuestionsCountAttribute()
    {
        return $this->questions()->count();
    }

    public function getAttemptsCountAttribute()
    {
        return $this->attempts()->count();
    }

    public function getCompletedAttemptsCountAttribute()
    {
        return $this->completedAttempts()->count();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'active')
                    ->where(function ($q) {
                        $q->whereNull('start_time')->orWhere('start_time', '<=', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('end_time')->orWhere('end_time', '>=', now());
                    });
    }

    public function scopeForTeacher($query, $teacherId)
    {
        return $query->whereHas('batch', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        });
    }

    public function scopeWithStats($query)
    {
        return $query->withCount([
            'attempts',
            'attempts as completed_attempts_count' => function ($q) {
                $q->whereNotNull('submitted_at');
            },
            'attempts as successful_attempts_count' => function ($q) {
                $q->where('has_passed', true);
            },
            'questions as questions_count'
        ])->withAvg('attempts as average_score', 'score');
    }

    // Methods
    public function canBeAttemptedBy($student)
    {
        if (!$this->is_available) {
            return false;
        }

        if ($this->max_attempts) {
            $studentAttempts = $this->attempts()
                ->where('student_id', $student->id)
                ->whereNotNull('submitted_at')
                ->count();
                
            if ($studentAttempts >= $this->max_attempts) {
                return false;
            }
        }

        return true;
    }

    public function getStudentAttemptCount($studentId)
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->whereNotNull('submitted_at')
            ->count();
    }

    public function getStudentBestScore($studentId)
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->whereNotNull('submitted_at')
            ->max('score');
    }

    public function calculateTotalMarks()
    {
        return $this->questions()->sum('marks');
    }

    public function updateTotalMarks()
    {
        $this->update(['total_marks' => $this->calculateTotalMarks()]);
    }

    public function activate()
    {
        if ($this->status !== 'draft') {
            throw new \Exception('Only draft quizzes can be activated.');
        }

        if ($this->questions()->count() === 0) {
            throw new \Exception('Cannot activate quiz without questions.');
        }

        $this->update(['status' => 'active']);
    }

    public function archive()
    {
        $this->update(['status' => 'archived']);
    }
}