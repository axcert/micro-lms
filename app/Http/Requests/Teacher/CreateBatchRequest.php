<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class CreateBatchRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'teacher';
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id',
            'is_active' => 'boolean'
        ];
    }
}