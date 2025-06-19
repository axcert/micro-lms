<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Basic user fields
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::in([UserRole::STUDENT->value])], // Only students for this endpoint
            
            // Student-specific fields
            'batch_id' => ['required', 'exists:batches,id'],
            'class_id' => ['required', 'string', 'max:255'],
            'bank_slip' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:2048'], // 2MB max
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // Basic field messages
            'name.required' => 'Please enter your full name.',
            'name.min' => 'Name must be at least 2 characters long.',
            'name.max' => 'Name cannot be longer than 255 characters.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.max' => 'Email cannot be longer than 255 characters.',
            'phone.max' => 'Phone number cannot be longer than 255 characters.',
            'phone.unique' => 'This phone number is already registered.',
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role.required' => 'Please select your role.',
            'role.in' => 'Invalid role selected.',
            
            // Student-specific field messages
            'batch_id.required' => 'Please select a batch.',
            'batch_id.exists' => 'Selected batch is not available.',
            'class_id.required' => 'Please select a class type.',
            'class_id.max' => 'Class ID cannot be longer than 255 characters.',
            'bank_slip.required' => 'Please upload your payment slip.',
            'bank_slip.file' => 'Payment slip must be a valid file.',
            'bank_slip.mimes' => 'Payment slip must be an image (JPEG, PNG, JPG) or PDF file.',
            'bank_slip.max' => 'Payment slip file size cannot exceed 2MB.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
            'phone' => 'phone number',
            'password' => 'password',
            'role' => 'role',
            'batch_id' => 'batch',
            'class_id' => 'class type',
            'bank_slip' => 'payment slip',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        Log::info('Preparing student registration data for validation', [
            'original_data' => $this->except(['password', 'password_confirmation', 'bank_slip'])
        ]);

        // Clean and prepare data before validation
        $this->merge([
            'name' => trim($this->name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
            'phone' => $this->phone ? trim($this->phone) : null,
            'role' => UserRole::STUDENT->value, // Force role to student for this endpoint
            'class_id' => trim($this->class_id ?? ''),
        ]);

        Log::info('Cleaned student registration data', [
            'cleaned_data' => $this->except(['password', 'password_confirmation', 'bank_slip'])
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Log validation attempt
            Log::info('Student registration validation completed', [
                'email' => $this->email,
                'batch_id' => $this->batch_id,
                'has_errors' => $validator->errors()->count() > 0,
                'errors' => $validator->errors()->toArray()
            ]);

            // Custom validation logic
            if ($this->phone && strlen($this->phone) < 10) {
                $validator->errors()->add('phone', 'Phone number must be at least 10 characters long.');
            }

            // Check if batch is full (optional additional validation)
            if ($this->batch_id) {
                try {
                    $batch = \App\Models\Batch::withCount('students')->find($this->batch_id);
                    if ($batch && $batch->max_students && ($batch->students_count >= $batch->max_students)) {
                        $validator->errors()->add('batch_id', 'Selected batch is currently full. Please choose another batch.');
                    }
                } catch (\Exception $e) {
                    Log::warning('Failed to check batch capacity during validation', [
                        'batch_id' => $this->batch_id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Validate file upload if present
            if ($this->hasFile('bank_slip')) {
                $file = $this->file('bank_slip');
                
                // Additional file validation
                if ($file->getSize() > 2048 * 1024) { // 2MB in bytes
                    $validator->errors()->add('bank_slip', 'Payment slip file size cannot exceed 2MB.');
                }

                // Check file extension more strictly
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
                $extension = strtolower($file->getClientOriginalExtension());
                if (!in_array($extension, $allowedExtensions)) {
                    $validator->errors()->add('bank_slip', 'Payment slip must be a JPG, PNG, or PDF file.');
                }
            }
        });
    }
}