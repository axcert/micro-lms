<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Batch;

class CreateQuizRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check() && auth()->user()->role === 'teacher';
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'batch_id' => [
                'required',
                'exists:batches,id',
                function ($attribute, $value, $fail) {
                    $batch = Batch::find($value);
                    if ($batch && $batch->teacher_id !== auth()->id()) {
                        $fail('You can only create quizzes for your own batches.');
                    }
                }
            ],
            'pass_marks' => 'required|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'start_time' => 'nullable|date|after:now',
            'end_time' => 'nullable|date|after:start_time',
            'max_attempts' => 'nullable|integer|min:1|max:10',
            'shuffle_questions' => 'boolean',
            'shuffle_options' => 'boolean',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
            'auto_submit' => 'boolean',
            'require_webcam' => 'boolean',
            'prevent_copy_paste' => 'boolean'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Quiz title is required.',
            'batch_id.required' => 'Please select a batch for this quiz.',
            'batch_id.exists' => 'The selected batch does not exist.',
            'pass_marks.required' => 'Pass marks are required.',
            'pass_marks.min' => 'Pass marks must be at least 0.',
            'start_time.after' => 'Start time must be in the future.',
            'end_time.after' => 'End time must be after start time.',
            'duration_minutes.max' => 'Duration cannot exceed 8 hours (480 minutes).',
            'max_attempts.max' => 'Maximum attempts cannot exceed 10.'
        ];
    }
}