<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log;

class StaffRegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::in([
                UserRole::TEACHER->value,
                UserRole::ADMIN->value,
            ])],
            'specialization' => ['nullable', 'required_if:role,teacher', 'string', 'max:255'],
            'department' => ['nullable', 'required_if:role,admin', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
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
            'role.in' => 'Please select a valid role (teacher or admin).',
            'specialization.required_if' => 'Please enter your specialization area.',
            'specialization.max' => 'Specialization cannot be longer than 255 characters.',
            'department.required_if' => 'Please enter your department.',
            'department.max' => 'Department cannot be longer than 255 characters.',
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
            'specialization' => 'specialization',
            'department' => 'department',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        Log::info('Preparing staff registration data for validation', [
            'original_data' => $this->except(['password', 'password_confirmation'])
        ]);

        // Clean and prepare data before validation
        $this->merge([
            'name' => trim($this->name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
            'phone' => $this->phone ? trim($this->phone) : null,
            'specialization' => $this->specialization ? trim($this->specialization) : null,
            'department' => $this->department ? trim($this->department) : null,
        ]);

        Log::info('Cleaned staff registration data', [
            'cleaned_data' => $this->except(['password', 'password_confirmation'])
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Log validation attempt
            Log::info('Staff registration validation completed', [
                'email' => $this->email,
                'role' => $this->role,
                'has_errors' => $validator->errors()->count() > 0,
                'errors' => $validator->errors()->toArray()
            ]);

            // Custom validation logic
            if ($this->phone && strlen($this->phone) < 10) {
                $validator->errors()->add('phone', 'Phone number must be at least 10 characters long.');
            }

            // Role-specific validation
            if ($this->role === UserRole::TEACHER->value && empty($this->specialization)) {
                $validator->errors()->add('specialization', 'Specialization is required for teachers.');
            }

            if ($this->role === UserRole::ADMIN->value && empty($this->department)) {
                $validator->errors()->add('department', 'Department is required for administrators.');
            }
        });
    }
}