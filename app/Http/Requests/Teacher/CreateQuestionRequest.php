<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateQuestionRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'teacher';
    }

    public function rules()
    {
        $rules = [
            'type' => 'required|in:mcq,multiple_choice,true_false,short_answer',
            'question_text' => 'required|string|max:2000',
            'explanation' => 'nullable|string|max:1000',
            'marks' => 'required|numeric|min:0.1|max:100',
            'is_required' => 'boolean',
            'case_sensitive' => 'boolean',
            'partial_credit' => 'boolean',
        ];

        // Type-specific validation rules
        switch ($this->type) {
            case 'mcq':
                $rules = array_merge($rules, $this->getMcqRules());
                break;
            
            case 'multiple_choice':
                $rules = array_merge($rules, $this->getMultipleChoiceRules());
                break;
            
            case 'true_false':
                $rules = array_merge($rules, $this->getTrueFalseRules());
                break;
            
            case 'short_answer':
                $rules = array_merge($rules, $this->getShortAnswerRules());
                break;
        }

        return $rules;
    }

    protected function getMcqRules()
    {
        return [
            'options' => 'required|array|min:2|max:6',
            'options.*.id' => 'required|string|max:10',
            'options.*.text' => 'required|string|max:500',
            'correct_answer' => 'required|array|size:1',
            'correct_answer.0' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!$this->isValidOptionId($value)) {
                        $fail('The selected correct answer is not a valid option.');
                    }
                }
            ]
        ];
    }

    protected function getMultipleChoiceRules()
    {
        return [
            'options' => 'required|array|min:2|max:6',
            'options.*.id' => 'required|string|max:10',
            'options.*.text' => 'required|string|max:500',
            'correct_answer' => 'required|array|min:1',
            'correct_answer.*' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!$this->isValidOptionId($value)) {
                        $fail('One or more selected correct answers are not valid options.');
                    }
                }
            ]
        ];
    }

    protected function getTrueFalseRules()
    {
        return [
            'correct_answer' => 'required|array|size:1',
            'correct_answer.0' => 'required|in:true,false'
        ];
    }

    protected function getShortAnswerRules()
    {
        return [
            'correct_answer' => 'required|array|min:1|max:5',
            'correct_answer.*' => 'required|string|max:500'
        ];
    }

    public function messages()
    {
        return [
            'type.required' => 'Question type is required.',
            'type.in' => 'Invalid question type selected.',
            'question_text.required' => 'Question text is required.',
            'question_text.max' => 'Question text cannot exceed 2000 characters.',
            'explanation.max' => 'Explanation cannot exceed 1000 characters.',
            'marks.required' => 'Marks are required.',
            'marks.numeric' => 'Marks must be a number.',
            'marks.min' => 'Marks must be at least 0.1.',
            'marks.max' => 'Marks cannot exceed 100.',
            
            // MCQ specific messages
            'options.required' => 'Options are required for this question type.',
            'options.array' => 'Options must be provided as a list.',
            'options.min' => 'At least 2 options are required.',
            'options.max' => 'Maximum 6 options are allowed.',
            'options.*.id.required' => 'Each option must have an ID.',
            'options.*.text.required' => 'Each option must have text.',
            'options.*.text.max' => 'Option text cannot exceed 500 characters.',
            
            // Correct answer messages
            'correct_answer.required' => 'Correct answer is required.',
            'correct_answer.array' => 'Correct answer must be provided as a list.',
            'correct_answer.size' => 'Single choice questions must have exactly one correct answer.',
            'correct_answer.min' => 'At least one correct answer is required.',
            'correct_answer.max' => 'Maximum 5 correct answers are allowed for short answer questions.',
            'correct_answer.*.required' => 'Correct answer cannot be empty.',
            'correct_answer.*.string' => 'Correct answer must be text.',
            'correct_answer.*.max' => 'Correct answer cannot exceed 500 characters.',
            'correct_answer.0.in' => 'Correct answer must be either true or false.',
        ];
    }

    public function prepareForValidation()
    {
        // Convert empty strings to null for nullable fields
        if ($this->explanation === '') {
            $this->merge(['explanation' => null]);
        }

        // Ensure boolean fields are properly set
        $booleanFields = ['is_required', 'case_sensitive', 'partial_credit'];
        foreach ($booleanFields as $field) {
            if (!$this->has($field)) {
                $this->merge([$field => false]);
            } else {
                $this->merge([$field => (bool) $this->get($field)]);
            }
        }

        // Clean up options based on question type
        if (in_array($this->type, ['mcq', 'multiple_choice'])) {
            $this->cleanupOptions();
        } elseif ($this->type === 'true_false') {
            // Set default options for true/false
            $this->merge([
                'options' => [
                    ['id' => 'true', 'text' => 'True'],
                    ['id' => 'false', 'text' => 'False']
                ]
            ]);
        } else {
            // Remove options for non-MCQ questions
            $this->merge(['options' => null]);
        }

        // Clean up correct answers
        if ($this->has('correct_answer') && is_array($this->correct_answer)) {
            // Remove empty answers
            $correctAnswers = array_filter($this->correct_answer, function($answer) {
                return !empty(trim($answer));
            });
            $this->merge(['correct_answer' => array_values($correctAnswers)]);
        }
    }

    protected function cleanupOptions()
    {
        if (!$this->has('options') || !is_array($this->options)) {
            return;
        }

        $cleanOptions = [];
        foreach ($this->options as $option) {
            if (isset($option['text']) && !empty(trim($option['text']))) {
                $cleanOptions[] = [
                    'id' => $option['id'] ?? chr(65 + count($cleanOptions)), // A, B, C, etc.
                    'text' => trim($option['text'])
                ];
            }
        }

        $this->merge(['options' => $cleanOptions]);
    }

    protected function isValidOptionId($optionId)
    {
        if (!$this->has('options') || !is_array($this->options)) {
            return false;
        }

        foreach ($this->options as $option) {
            if (isset($option['id']) && $option['id'] === $optionId) {
                return true;
            }
        }

        return false;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate that MCQ/Multiple Choice questions have unique option IDs
            if (in_array($this->type, ['mcq', 'multiple_choice']) && $this->has('options')) {
                $optionIds = collect($this->options)->pluck('id')->toArray();
                if (count($optionIds) !== count(array_unique($optionIds))) {
                    $validator->errors()->add('options', 'Option IDs must be unique.');
                }
            }

            // Validate that all correct answers exist in options (for MCQ/Multiple Choice)
            if (in_array($this->type, ['mcq', 'multiple_choice'])) {
                $optionIds = collect($this->options ?? [])->pluck('id')->toArray();
                $correctAnswers = $this->correct_answer ?? [];
                
                foreach ($correctAnswers as $correctAnswer) {
                    if (!in_array($correctAnswer, $optionIds)) {
                        $validator->errors()->add('correct_answer', 
                            "Correct answer '{$correctAnswer}' does not match any option."
                        );
                    }
                }
            }

            // Validate multiple choice has at least one but not all correct answers
            if ($this->type === 'multiple_choice') {
                $correctCount = count($this->correct_answer ?? []);
                $totalOptions = count($this->options ?? []);
                
                if ($correctCount >= $totalOptions && $totalOptions > 1) {
                    $validator->errors()->add('correct_answer', 
                        'Multiple choice questions cannot have all options as correct answers.'
                    );
                }
            }

            // Validate short answer questions
            if ($this->type === 'short_answer') {
                $correctAnswers = $this->correct_answer ?? [];
                
                // Check for duplicate answers
                if (count($correctAnswers) !== count(array_unique($correctAnswers))) {
                    $validator->errors()->add('correct_answer', 
                        'Duplicate correct answers are not allowed.'
                    );
                }
            }
        });
    }
}