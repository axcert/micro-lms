<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateQuizRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'teacher';
    }

    public function rules()
    {
        $quizId = $this->route('quiz')?->id;
        
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('quizzes', 'title')
                    ->where('teacher_id', auth()->id())
                    ->ignore($quizId)
            ],
            'description' => 'nullable|string|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'batch_id' => [
                'required',
                'exists:batches,id',
                Rule::exists('batches', 'id')->where(function ($query) {
                    $query->where('teacher_id', auth()->id());
                })
            ],
            'total_marks' => 'nullable|numeric|min:0|max:1000',
            'pass_marks' => 'nullable|numeric|min:0|lte:total_marks',
            'duration_minutes' => 'nullable|integer|min:1|max:480', // 1 min to 8 hours
            'start_time' => 'nullable|date|after:now',
            'end_time' => 'nullable|date|after:start_time',
            'max_attempts' => 'nullable|integer|min:1|max:10',
            'shuffle_questions' => 'boolean',
            'shuffle_options' => 'boolean',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
            'auto_submit' => 'boolean',
            'require_webcam' => 'boolean',
            'prevent_copy_paste' => 'boolean',
            'status' => 'nullable|in:draft,active,archived'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Quiz title is required.',
            'title.unique' => 'You already have a quiz with this title.',
            'title.max' => 'Quiz title cannot exceed 255 characters.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'instructions.max' => 'Instructions cannot exceed 2000 characters.',
            'batch_id.required' => 'Please select a batch for this quiz.',
            'batch_id.exists' => 'Selected batch is invalid or you do not have permission to use it.',
            'total_marks.numeric' => 'Total marks must be a number.',
            'total_marks.min' => 'Total marks cannot be negative.',
            'total_marks.max' => 'Total marks cannot exceed 1000.',
            'pass_marks.numeric' => 'Pass marks must be a number.',
            'pass_marks.min' => 'Pass marks cannot be negative.',
            'pass_marks.lte' => 'Pass marks cannot be greater than total marks.',
            'duration_minutes.integer' => 'Duration must be a whole number of minutes.',
            'duration_minutes.min' => 'Duration must be at least 1 minute.',
            'duration_minutes.max' => 'Duration cannot exceed 8 hours (480 minutes).',
            'start_time.after' => 'Start time must be in the future.',
            'end_time.after' => 'End time must be after start time.',
            'max_attempts.integer' => 'Maximum attempts must be a whole number.',
            'max_attempts.min' => 'Maximum attempts must be at least 1.',
            'max_attempts.max' => 'Maximum attempts cannot exceed 10.',
        ];
    }

    public function prepareForValidation()
    {
        // Convert empty strings to null for nullable fields
        $nullableFields = [
            'description', 'instructions', 'total_marks', 'pass_marks', 
            'duration_minutes', 'start_time', 'end_time', 'max_attempts'
        ];

        foreach ($nullableFields as $field) {
            if ($this->get($field) === '') {
                $this->merge([$field => null]);
            }
        }

        // Ensure boolean fields are properly set
        $booleanFields = [
            'shuffle_questions', 'shuffle_options', 'show_results_immediately',
            'allow_review', 'auto_submit', 'require_webcam', 'prevent_copy_paste'
        ];

        foreach ($booleanFields as $field) {
            if (!$this->has($field)) {
                $this->merge([$field => false]);
            } else {
                $this->merge([$field => (bool) $this->get($field)]);
            }
        }
    }

    protected function passedValidation()
    {
        // Additional validation after basic rules pass
        
        // Check if teacher owns the batch
        $batch = \App\Models\Batch::find($this->batch_id);
        if ($batch && $batch->teacher_id !== auth()->id()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'batch_id' => 'You do not have permission to create quizzes for this batch.'
            ]);
        }

        // Validate time range consistency
        if ($this->start_time && $this->end_time) {
            $start = \Carbon\Carbon::parse($this->start_time);
            $end = \Carbon\Carbon::parse($this->end_time);
            
            if ($this->duration_minutes) {
                $maxDuration = $start->diffInMinutes($end);
                if ($this->duration_minutes > $maxDuration) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'duration_minutes' => 'Quiz duration cannot exceed the time between start and end times.'
                    ]);
                }
            }
        }

        // Validate pass marks
        if ($this->pass_marks && $this->total_marks && $this->pass_marks > $this->total_marks) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'pass_marks' => 'Pass marks cannot exceed total marks.'
            ]);
        }
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Custom validation for updating active quizzes
            if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                $quiz = $this->route('quiz');
                
                if ($quiz && $quiz->status === 'active' && $quiz->attempts_count > 0) {
                    // Restrict certain fields when quiz has attempts
                    $restrictedFields = [
                        'batch_id', 'duration_minutes', 'start_time', 'end_time',
                        'max_attempts', 'shuffle_questions', 'shuffle_options'
                    ];

                    foreach ($restrictedFields as $field) {
                        if ($this->has($field) && $this->get($field) != $quiz->$field) {
                            $validator->errors()->add($field, 
                                "Cannot modify {$field} for an active quiz with existing attempts."
                            );
                        }
                    }
                }
            }
        });
    }
}