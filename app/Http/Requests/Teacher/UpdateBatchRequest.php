<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateBatchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $batch = $this->route('batch');
        return Auth::check() && 
               Auth::user()->role === 'teacher' && 
               $batch && 
               $batch->teacher_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $batchId = $this->route('batch')->id;
        
        return [
            'name' => 'required|string|max:255|unique:batches,name,' . $batchId . ',id,teacher_id,' . Auth::id(),
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id'
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Batch name is required.',
            'name.unique' => 'You already have another batch with this name. Please choose a different name.',
            'name.max' => 'Batch name cannot exceed 255 characters.',
            
            'description.max' => 'Description cannot exceed 1000 characters.',
            
            'start_date.required' => 'Start date is required.',
            'start_date.date' => 'Start date must be a valid date.',
            
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after' => 'End date must be after the start date.',
            
            'max_students.integer' => 'Maximum students must be a number.',
            'max_students.min' => 'Maximum students must be at least 1.',
            'max_students.max' => 'Maximum students cannot exceed 100.',
            
            'is_active.boolean' => 'Active status must be true or false.',
            
            'student_ids.array' => 'Student selection must be a valid list.',
            'student_ids.*.exists' => 'One or more selected students do not exist.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'batch name',
            'description' => 'batch description',
            'start_date' => 'start date',
            'end_date' => 'end date',
            'max_students' => 'maximum students',
            'is_active' => 'active status',
            'student_ids' => 'selected students',
            'student_ids.*' => 'student',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $batch = $this->route('batch');

            // Custom validation: Check if student count exceeds max_students
            if ($this->filled(['student_ids', 'max_students'])) {
                $studentCount = is_array($this->student_ids) ? count($this->student_ids) : 0;
                if ($studentCount > $this->max_students) {
                    $validator->errors()->add(
                        'student_ids', 
                        "Cannot assign {$studentCount} students when maximum is {$this->max_students}."
                    );
                }
            }

            // Validate that students have 'student' role
            if ($this->filled('student_ids') && is_array($this->student_ids)) {
                $validStudents = \App\Models\User::whereIn('id', $this->student_ids)
                    ->where('role', 'student')
                    ->count();
                
                if ($validStudents !== count($this->student_ids)) {
                    $validator->errors()->add(
                        'student_ids',
                        'One or more selected users are not students.'
                    );
                }
            }

            // Validate that students are not already assigned to other active batches by this teacher
            // (excluding the current batch being updated)
            if ($this->filled('student_ids') && is_array($this->student_ids)) {
                $alreadyAssigned = \Illuminate\Support\Facades\DB::table('batch_students')
                    ->join('batches', 'batch_students.batch_id', '=', 'batches.id')
                    ->whereIn('batch_students.student_id', $this->student_ids)
                    ->where('batches.teacher_id', Auth::id())
                    ->where('batches.is_active', true)
                    ->where('batches.id', '!=', $batch->id) // Exclude current batch
                    ->pluck('batch_students.student_id')
                    ->toArray();

                if (!empty($alreadyAssigned)) {
                    $studentNames = \App\Models\User::whereIn('id', $alreadyAssigned)
                        ->pluck('name')
                        ->join(', ');
                    
                    $validator->errors()->add(
                        'student_ids',
                        "The following students are already assigned to another active batch: {$studentNames}"
                    );
                }
            }

            // Validate start date changes for active batches with classes/quizzes
            if ($batch && $batch->is_active && $this->start_date) {
                $startDateChanged = $batch->start_date->format('Y-m-d') !== $this->start_date;
                
                if ($startDateChanged) {
                    // Check if batch has classes (uncomment when you have classes model)
                    // $hasClasses = $batch->classes()->count() > 0;
                    // if ($hasClasses) {
                    //     $validator->errors()->add(
                    //         'start_date',
                    //         'Cannot change start date for batches with existing classes.'
                    //     );
                    // }

                    // Check if new start date is in the past
                    if ($this->start_date < now()->format('Y-m-d')) {
                        $validator->errors()->add(
                            'start_date',
                            'Cannot change start date to a past date for active batches.'
                        );
                    }
                }
            }

            // Validate date logic
            if ($this->filled(['start_date', 'end_date'])) {
                $startDate = \Carbon\Carbon::parse($this->start_date);
                $endDate = \Carbon\Carbon::parse($this->end_date);
                
                // Check if the batch duration is reasonable (not more than 2 years)
                if ($endDate->diffInMonths($startDate) > 24) {
                    $validator->errors()->add(
                        'end_date',
                        'Batch duration cannot exceed 24 months.'
                    );
                }
            }

            // Validate deactivation - prevent deactivating batches with active classes
            if ($batch && $batch->is_active && $this->filled('is_active') && !$this->is_active) {
                // Uncomment when you have classes model
                // $hasActiveClasses = $batch->classes()
                //     ->where('scheduled_at', '>', now())
                //     ->count() > 0;
                
                // if ($hasActiveClasses) {
                //     $validator->errors()->add(
                //         'is_active',
                //         'Cannot deactivate batch with scheduled future classes. Please cancel the classes first.'
                //     );
                // }
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Ensure boolean values are properly formatted
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);

        // Clean up empty values
        if ($this->end_date === '') {
            $this->merge(['end_date' => null]);
        }
        
        if ($this->max_students === '' || $this->max_students === '0') {
            $this->merge(['max_students' => null]);
        }

        // Trim string values
        if ($this->filled('name')) {
            $this->merge(['name' => trim($this->name)]);
        }

        if ($this->filled('description')) {
            $this->merge(['description' => trim($this->description)]);
        }

        // Remove duplicate student IDs
        if ($this->filled('student_ids') && is_array($this->student_ids)) {
            $this->merge(['student_ids' => array_unique($this->student_ids)]);
        }
    }
}