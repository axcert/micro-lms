<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\StaffRegisterRequest;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\Batch;
use App\Enums\UserRole;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class RegisteredUserController extends Controller
{
    /**
     * Display the student registration view.
     */
    public function create(): Response
    {
        // Get available batches for student selection
        $batches = Batch::with('teacher:id,name')
            ->where('is_active', true)
            ->select('id', 'name', 'description', 'teacher_id', 'max_students', 'fee')
            ->withCount('students')
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'description' => $batch->description,
                    'teacher' => $batch->teacher->name ?? 'Unknown',
                    'fee' => $batch->fee ?? 'Contact for pricing',
                    'students_count' => $batch->students_count ?? 0,
                    'max_students' => $batch->max_students ?? 30,
                    'is_full' => ($batch->students_count ?? 0) >= ($batch->max_students ?? 30),
                ];
            });

        return Inertia::render('Auth/Register', [
            'batches' => $batches
        ]);
    }

    /**
     * Display the staff registration view.
     */
    public function createStaff(): Response
    {
        return Inertia::render('Auth/AdminTeacherRegister');
    }

    /**
     * Handle student registration.
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        Log::info('=== STUDENT REGISTRATION ATTEMPT ===', [
            'email' => $request->email,
            'name' => $request->name,
            'batch_id' => $request->batch_id,
            'ip' => $request->ip()
        ]);

        try {
            DB::beginTransaction();

            // Validate batch selection and file upload for students
            $request->validate([
                'batch_id' => 'required|exists:batches,id',
                'class_id' => 'required|string',
                'bank_slip' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
            ], [
                'batch_id.required' => 'Please select a batch.',
                'batch_id.exists' => 'Selected batch is not available.',
                'class_id.required' => 'Please select a class type.',
                'bank_slip.required' => 'Please upload your payment slip.',
                'bank_slip.mimes' => 'Payment slip must be an image (JPEG, PNG, JPG) or PDF.',
                'bank_slip.max' => 'Payment slip file size cannot exceed 2MB.',
            ]);

            // Check if batch is full
            $batch = Batch::withCount('students')->findOrFail($request->batch_id);
            if (($batch->students_count ?? 0) >= ($batch->max_students ?? 30)) {
                return back()->withErrors([
                    'batch_id' => 'Selected batch is currently full. Please choose another batch.'
                ])->withInput();
            }

            // Handle bank slip upload
            $bankSlipPath = null;
            if ($request->hasFile('bank_slip')) {
                $bankSlipPath = $request->file('bank_slip')->store('bank_slips', 'public');
                Log::info('Bank slip uploaded', ['path' => $bankSlipPath]);
            }

            // Create student user (pending approval)
            $userData = [
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'phone' => trim($request->phone),
                'password' => Hash::make($request->password),
                'role' => UserRole::STUDENT->value,
                'batch_id' => $request->batch_id,
                'class_id' => $request->class_id,
                'bank_slip_path' => $bankSlipPath,
                'email_verified_at' => now(),
                'is_active' => false,    // Inactive until approved
                'is_approved' => false,  // Pending approval
            ];

            $user = User::create($userData);

            Log::info('Student user created (pending approval)', [
                'user_id' => $user->id,
                'email' => $user->email,
                'batch_id' => $user->batch_id,
                'bank_slip_path' => $user->bank_slip_path
            ]);

            // Log registration activity
            $this->logRegistrationActivity($user, $request, 'student_registration_pending');

            // Fire the registered event
            event(new Registered($user));

            DB::commit();

            // Redirect to login with pending approval message (DO NOT auto-login)
            return redirect()->route('login')->with('success', 
                'Registration successful! Your account is pending approval. You will be notified via email once your payment is verified and account is approved.'
            )->with('info',
                'Please wait for admin approval before attempting to log in. This usually takes 24-48 hours.'
            );

        } catch (Exception $e) {
            DB::rollBack();

            // Delete uploaded file if registration fails
            if (isset($bankSlipPath) && $bankSlipPath) {
                Storage::disk('public')->delete($bankSlipPath);
            }

            Log::error('Student registration failed', [
                'email' => $request->email ?? 'N/A',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'registration' => 'Registration failed: ' . $e->getMessage()
            ])->withInput($request->except('password', 'password_confirmation'));
        }
    }

    /**
     * Handle staff (teacher/admin) registration.
     */
    public function storeStaff(StaffRegisterRequest $request): RedirectResponse
    {
        Log::info('=== STAFF REGISTRATION ATTEMPT ===', [
            'email' => $request->email,
            'name' => $request->name,
            'role' => $request->role,
            'ip' => $request->ip()
        ]);

        try {
            DB::beginTransaction();

            // Create staff user (auto-approved)
            $userData = [
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'phone' => trim($request->phone),
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'email_verified_at' => now(),
                'is_active' => true,     // Auto-active for staff
                'is_approved' => true,   // Auto-approved for staff
            ];

            // Add role-specific fields
            if ($request->role === UserRole::TEACHER->value && $request->specialization) {
                $userData['specialization'] = trim($request->specialization);
            }

            if ($request->role === UserRole::ADMIN->value && $request->department) {
                $userData['department'] = trim($request->department);
            }

            $user = User::create($userData);

            Log::info('Staff user created and auto-approved', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'specialization' => $user->specialization ?? null,
                'department' => $user->department ?? null
            ]);

            // Log registration activity
            $this->logRegistrationActivity($user, $request, 'staff_registration_approved');

            // Fire the registered event
            event(new Registered($user));

            // Auto-login staff users
            Auth::login($user);

            // Log auto-login activity
            $this->logLoginActivity($user, $request);

            DB::commit();

            Log::info('Staff registration completed with auto-login', [
                'user_id' => $user->id,
                'role' => $user->role,
                'redirect_to' => $this->getStaffDashboardRoute($user)
            ]);

            // Redirect to appropriate dashboard based on role
            return $this->redirectStaffToDashboard($user);

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Staff registration failed', [
                'email' => $request->email ?? 'N/A',
                'role' => $request->role ?? 'N/A',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'registration' => 'Registration failed: ' . $e->getMessage()
            ])->withInput($request->except('password', 'password_confirmation'));
        }
    }

    /**
     * Redirect staff user to appropriate dashboard
     */
    private function redirectStaffTodashboard(User $user): RedirectResponse
    {
        $welcomeMessage = $this->generateStaffWelcomeMessage($user);
        $roleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;
        
        switch ($roleValue) {
            case 'admin':
                return redirect()->route('admin.dashboard')
                    ->with('success', $welcomeMessage)
                    ->with('first_login', true);
            
            case 'teacher':
                return redirect()->route('teacher.dashboard')
                    ->with('success', $welcomeMessage)
                    ->with('first_login', true)
                    ->with('getting_started', 'Create your first batch to get started with teaching!');
            
            default:
                return redirect()->route('dashboard')
                    ->with('success', 'Welcome to Micro LMS!')
                    ->with('first_login', true);
        }
    }

    /**
     * Generate staff welcome message
     */
    private function generateStaffWelcomeMessage(User $user): string
    {
        $firstName = explode(' ', $user->name)[0];
        $roleDisplay = $user->role instanceof UserRole ? $user->role->getDisplayName() : ucfirst($user->role);
        
        return "Welcome to Micro LMS, {$firstName}! Your {$roleDisplay} account has been created and activated. Let's get you started!";
    }

    /**
     * Get staff dashboard route
     */
    private function getStaffDashboardRoute(User $user): string
    {
        $roleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;
        
        return match($roleValue) {
            'admin' => route('admin.dashboard'),
            'teacher' => route('teacher.dashboard'),
            default => route('dashboard')
        };
    }

    /**
     * Log user registration activity
     */
    private function logRegistrationActivity(User $user, Request $request, string $activityType): void
    {
        try {
            $roleDisplayName = $user->role instanceof UserRole ? $user->role->getDisplayName() : ucfirst($user->role);
            $roleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;
            
            $metadata = [
                'role' => $roleValue,
                'email' => $user->email,
                'registration_method' => 'web_form',
                'timestamp' => now()->toISOString(),
            ];

            // Add student-specific metadata
            if ($user->isStudent()) {
                $metadata['batch_id'] = $user->batch_id;
                $metadata['class_id'] = $user->class_id;
                $metadata['has_bank_slip'] = !empty($user->bank_slip_path);
                $metadata['approval_status'] = $user->is_approved ? 'approved' : 'pending';
            }

            // Add staff-specific metadata
            if ($user->isTeacher() && $user->specialization) {
                $metadata['specialization'] = $user->specialization;
            }
            if ($user->isAdmin() && $user->department) {
                $metadata['department'] = $user->department;
            }
            
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => $activityType,
                'description' => "User registered with role: {$roleDisplayName}",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode($metadata),
            ]);
        } catch (Exception $e) {
            Log::warning('Failed to log registration activity', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Log user login activity after registration
     */
    private function logLoginActivity(User $user, Request $request): void
    {
        try {
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'user_login',
                'description' => 'Auto-login after staff registration',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode([
                    'login_type' => 'auto_after_registration',
                    'role' => $user->role instanceof UserRole ? $user->role->value : $user->role,
                    'timestamp' => now()->toISOString(),
                ]),
            ]);
        } catch (Exception $e) {
            Log::warning('Failed to log login activity', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get pending approval students (for admin/teacher dashboard)
     */
    public function getPendingApprovals()
    {
        try {
            $pendingStudents = User::students()
                ->pendingApproval()
                ->with(['batch:id,name'])
                ->select('id', 'name', 'email', 'phone', 'batch_id', 'class_id', 'bank_slip_path', 'created_at')
                ->latest()
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'phone' => $student->phone,
                        'batch' => $student->batch ? [
                            'id' => $student->batch->id,
                            'name' => $student->batch->name,
                        ] : null,
                        'class_id' => $student->class_id,
                        'bank_slip_url' => $student->bank_slip_url,
                        'registered_at' => $student->created_at->format('M j, Y g:i A'),
                        'days_pending' => $student->created_at->diffInDays(now()),
                    ];
                });

            return response()->json([
                'success' => true,
                'pending_students' => $pendingStudents,
                'total_pending' => $pendingStudents->count()
            ]);
        } catch (Exception $e) {
            Log::error('Failed to get pending approvals', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Approve student registration
     */
    public function approveStudent(Request $request, User $student)
    {
        try {
            if (!$student->isStudent() || $student->isApproved()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Student is not eligible for approval'
                ], 400);
            }

            $student->approve();

            Log::info('Student approved', [
                'student_id' => $student->id,
                'approved_by' => auth()->id(),
                'student_email' => $student->email
            ]);

            // Log approval activity
            ActivityLog::create([
                'user_id' => $student->id,
                'activity_type' => 'student_approved',
                'description' => 'Student registration approved by ' . auth()->user()->name,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode([
                    'approved_by' => auth()->id(),
                    'approved_by_name' => auth()->user()->name,
                    'approved_at' => now()->toISOString(),
                ]),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Student approved successfully'
            ]);

        } catch (Exception $e) {
            Log::error('Failed to approve student', [
                'student_id' => $student->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to approve student'
            ], 500);
        }
    }

    /**
     * Reject student registration
     */
    public function rejectStudent(Request $request, User $student)
    {
        try {
            if (!$student->isStudent() || $student->isApproved()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Student is not eligible for rejection'
                ], 400);
            }

            $student->reject();

            Log::info('Student rejected', [
                'student_id' => $student->id,
                'rejected_by' => auth()->id(),
                'student_email' => $student->email
            ]);

            // Log rejection activity
            ActivityLog::create([
                'user_id' => $student->id,
                'activity_type' => 'student_rejected',
                'description' => 'Student registration rejected by ' . auth()->user()->name,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode([
                    'rejected_by' => auth()->id(),
                    'rejected_by_name' => auth()->user()->name,
                    'rejected_at' => now()->toISOString(),
                    'reason' => $request->reason ?? 'No reason provided',
                ]),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Student registration rejected'
            ]);

        } catch (Exception $e) {
            Log::error('Failed to reject student', [
                'student_id' => $student->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to reject student'
            ], 500);
        }
    }
}