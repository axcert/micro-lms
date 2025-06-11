<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize()
    {
        $quiz = $this->route('quiz');
        $question = $this->route('question');
        
        return auth()->check() && 
               auth()->user()->role === 'teacher' &&
               $quiz->batch->teacher_id === auth()->id() &&
               $question->quiz_id === $quiz->id;
    }

    public function rules()
    {
        $rules = [
            'type' => 'required|in:mcq,multiple_choice,true_false,short_answer',
            'question_text' => 'required|string|max:2000',
            'explanation' => 'nullable|string|max:1000',
            'marks' => 'required|integer|min:1|max:100',
            'is_required' => 'boolean',
            'case_sensitive' => 'boolean',
            'partial_credit' => 'boolean'
        ];

        // Add validation based on question type
        if ($this->type === 'mcq') {
            $rules['options'] = 'required|array|min:2|max:6';
            $rules['options.*.id'] = 'required|string|max:5';
            $rules['options.*.text'] = 'required|string|max:500';
            $rules['correct_answer'] = 'required|string';
        } elseif ($this->type === 'multiple_choice') {
            $rules['options'] = 'required|array|min:2|max:6';
            $rules['options.*.id'] = 'required|string|max:5';
            $rules['options.*.text'] = 'required|string|max:500';
            $rules['correct_answer'] = 'required|array|min:1';
            $rules['correct_answer.*'] = 'string';
        } elseif ($this->type === 'true_false') {
            $rules['correct_answer'] = 'required|in:true,false';
        } elseif ($this->type === 'short_answer') {
            $rules['correct_answer'] = 'required|array|min:1';
            $rules['correct_answer.*'] = 'string|max:500';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'type.required' => 'Question type is required.',
            'type.in' => 'Invalid question type selected.',
            'question_text.required' => 'Question text is required.',
            'question_text.max' => 'Question text cannot exceed 2000 characters.',
            'marks.required' => 'Marks are required.',
            'marks.min' => 'Marks must be at least 1.',
            'marks.max' => 'Marks cannot exceed 100.',
            'options.required' => 'Options are required for this question type.',
            'options.min' => 'At least 2 options are required.',
            'options.max' => 'Maximum 6 options are allowed.',
            'correct_answer.required' => 'Correct answer is required.',
            'correct_answer.array' => 'Multiple correct answers must be provided as an array.',
            'correct_answer.min' => 'At least one correct answer is required.'
        ];
    }
}