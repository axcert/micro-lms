<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\UserRole;
use App\Models\Batch;
use App\Models\Lesson;

class CreateClassRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === UserRole::TEACHER;
    }

    public function rules()
    {
        $classId = $this->route('id'); // Get ID from route parameter
        
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'batch_id' => [
                'required',
                'exists:batches,id',
                Rule::exists('batches', 'id')->where(function ($query) {
                    $query->where('teacher_id', auth()->id());
                })
            ],
            'scheduled_at' => [
                'required',
                'date',
                'after:now',
                function ($attribute, $value, $fail) use ($classId) {
                    $this->validateSchedulingConflicts($attribute, $value, $fail, $classId);
                },
            ],
            'duration_minutes' => 'required|integer|min:15|max:480', // 15 min to 8 hours
            'zoom_password' => 'nullable|string|min:6|max:10',
            'max_attendees' => 'nullable|integer|min:1|max:1000',
            'notes' => 'nullable|string|max:2000',
            'create_attendance' => 'boolean',
            'status' => 'nullable|in:scheduled,live,ongoing,completed,cancelled,rescheduled'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Class title is required.',
            'title.max' => 'Class title cannot exceed 255 characters.',
            'batch_id.required' => 'Please select a batch for this class.',
            'batch_id.exists' => 'Selected batch is invalid or you do not have permission to use it.',
            'scheduled_at.required' => 'Class date and time is required.',
            'scheduled_at.after' => 'Class must be scheduled for a future date and time.',
            'duration_minutes.required' => 'Class duration is required.',
            'duration_minutes.min' => 'Class duration must be at least 15 minutes.',
            'duration_minutes.max' => 'Class duration cannot exceed 8 hours.',
            'zoom_password.min' => 'Zoom password must be at least 6 characters.',
            'zoom_password.max' => 'Zoom password cannot exceed 10 characters.',
            'max_attendees.min' => 'Maximum attendees must be at least 1.',
            'max_attendees.max' => 'Maximum attendees cannot exceed 1000.',
            'notes.max' => 'Notes cannot exceed 2000 characters.',
        ];
    }

    public function prepareForValidation()
    {
        // Convert empty strings to null for nullable fields
        if ($this->max_attendees === '') {
            $this->merge(['max_attendees' => null]);
        }
        
        if ($this->zoom_password === '') {
            $this->merge(['zoom_password' => null]);
        }

        if ($this->notes === '') {
            $this->merge(['notes' => null]);
        }

        // Ensure create_attendance is boolean
        if ($this->has('create_attendance')) {
            $this->merge(['create_attendance' => (bool) $this->create_attendance]);
        } else {
            $this->merge(['create_attendance' => true]); // Default to true
        }
    }

    /**
     * Validate scheduling conflicts
     */
    protected function validateSchedulingConflicts($attribute, $value, $fail, $classId = null)
    {
        $scheduledAt = \Carbon\Carbon::parse($value);
        $endTime = $scheduledAt->copy()->addMinutes($this->duration_minutes);

        // Check for overlapping classes for the same teacher
        $conflictingClass = Lesson::whereHas('batch', function ($query) {
                $query->where('teacher_id', auth()->id());
            })
            ->where('id', '!=', $classId)
            ->whereIn('status', ['scheduled', 'live', 'ongoing', 'rescheduled'])
            ->where(function ($query) use ($scheduledAt, $endTime) {
                $query->where(function ($q) use ($scheduledAt, $endTime) {
                    // New class starts during existing class
                    $q->where('scheduled_at', '<=', $scheduledAt)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) > ?', [$scheduledAt]);
                })->orWhere(function ($q) use ($scheduledAt, $endTime) {
                    // New class ends during existing class
                    $q->where('scheduled_at', '<', $endTime)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) >= ?', [$endTime]);
                })->orWhere(function ($q) use ($scheduledAt, $endTime) {
                    // New class completely covers existing class
                    $q->where('scheduled_at', '>=', $scheduledAt)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) <= ?', [$endTime]);
                });
            })
            ->first();

        if ($conflictingClass) {
            $fail("This time conflicts with another class: \"{$conflictingClass->title}\" scheduled at " . 
                 $conflictingClass->scheduled_at->format('M j, Y g:i A'));
        }

        // Check for batch conflicts (same batch, overlapping time)
        $batchConflict = Lesson::where('batch_id', $this->batch_id)
            ->where('id', '!=', $classId)
            ->whereIn('status', ['scheduled', 'live', 'ongoing', 'rescheduled'])
            ->where(function ($query) use ($scheduledAt, $endTime) {
                $query->where(function ($q) use ($scheduledAt, $endTime) {
                    $q->where('scheduled_at', '<=', $scheduledAt)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) > ?', [$scheduledAt]);
                })->orWhere(function ($q) use ($scheduledAt, $endTime) {
                    $q->where('scheduled_at', '<', $endTime)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) >= ?', [$endTime]);
                })->orWhere(function ($q) use ($scheduledAt, $endTime) {
                    $q->where('scheduled_at', '>=', $scheduledAt)
                      ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) <= ?', [$endTime]);
                });
            })
            ->first();

        if ($batchConflict) {
            $fail("This batch already has a class scheduled at this time: \"{$batchConflict->title}\" at " . 
                 $batchConflict->scheduled_at->format('M j, Y g:i A'));
        }
    }

    protected function passedValidation()
    {
        // Additional validation after basic rules pass
        
        // Check if teacher owns the batch
        $batch = Batch::find($this->batch_id);
        if ($batch && $batch->teacher_id !== auth()->id()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'batch_id' => 'You do not have permission to schedule classes for this batch.'
            ]);
        }

        // Check if batch has approved students
        if ($batch && $batch->students()->approved()->count() === 0) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'batch_id' => 'This batch has no approved students. Please wait for students to be approved or select a different batch.'
            ]);
        }
    }
}