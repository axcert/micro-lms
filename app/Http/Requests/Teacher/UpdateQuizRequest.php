<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Batch;

class UpdateQuizRequest extends FormRequest
{
    public function authorize()
    {
        $quiz = $this->route('quiz');
        return auth()->check() && 
               auth()->user()->role === 'teacher' &&
               $quiz->batch->teacher_id === auth()->id();
    }

    public function rules()
    {
        $quiz = $this->route('quiz');
        $canEditRestricted = $quiz->status === 'draft' || 
                           ($quiz->status === 'active' && $quiz->attempts()->count() === 0);

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'pass_marks' => 'required|integer|min:0',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
        ];

        if ($canEditRestricted) {
            $rules = array_merge($rules, [
                'batch_id' => [
                    'required',
                    'exists:batches,id',
                    function ($attribute, $value, $fail) {
                        $batch = Batch::find($value);
                        if ($batch && $batch->teacher_id !== auth()->id()) {
                            $fail('You can only assign quizzes to your own batches.');
                        }
                    }
                ],
                'duration_minutes' => 'nullable|integer|min:1|max:480',
                'start_time' => 'nullable|date',
                'end_time' => 'nullable|date|after:start_time',
                'max_attempts' => 'nullable|integer|min:1|max:10',
                'shuffle_questions' => 'boolean',
                'shuffle_options' => 'boolean',
                'auto_submit' => 'boolean',
                'require_webcam' => 'boolean',
                'prevent_copy_paste' => 'boolean'
            ]);
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'title.required' => 'Quiz title is required.',
            'batch_id.required' => 'Please select a batch for this quiz.',
            'batch_id.exists' => 'The selected batch does not exist.',
            'pass_marks.required' => 'Pass marks are required.',
            'pass_marks.min' => 'Pass marks must be at least 0.',
            'end_time.after' => 'End time must be after start time.',
            'duration_minutes.max' => 'Duration cannot exceed 8 hours (480 minutes).',
            'max_attempts.max' => 'Maximum attempts cannot exceed 10.'
        ];
    }
}