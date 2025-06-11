<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\ActivityLog;
use App\Enums\UserRole;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        Log::info('=== REGISTRATION ATTEMPT STARTED ===', [
            'email' => $request->email,
            'role' => $request->role,
            'name' => $request->name,
            'phone' => $request->phone,
            'ip' => $request->ip()
        ]);

        try {
            // Start database transaction
            DB::beginTransaction();

            // Prepare user data with detailed logging
            $userData = [
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'phone' => trim($request->phone),
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'email_verified_at' => now(),
                'is_active' => true,
            ];

            Log::info('Creating user with data:', [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'],
                'role' => $userData['role'],
                'is_active' => $userData['is_active']
            ]);

            // Create the user
            $user = User::create($userData);

            if (!$user) {
                throw new Exception('Failed to create user - User::create returned null');
            }

            Log::info('User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role instanceof UserRole ? $user->role->value : $user->role,
                'is_active' => $user->is_active
            ]);

            // Log user registration activity
            $this->logRegistrationActivity($user, $request);

            // Fire the registered event
            event(new Registered($user));

            // Log the user in
            Auth::login($user);

            // Log successful login after registration
            $this->logLoginActivity($user, $request);

            // Commit the transaction
            DB::commit();

            // Log successful registration
            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role instanceof UserRole ? $user->role->value : $user->role,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Redirect based on user role
            return $this->redirectUserBasedOnRole($user);

        } catch (Exception $e) {
            // Rollback the transaction
            DB::rollBack();

            // Log the detailed error
            Log::error('User registration failed', [
                'email' => $request->email ?? 'N/A',
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'stack_trace' => $e->getTraceAsString(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Return back with detailed error
            return back()->withErrors([
                'registration' => 'Registration failed: ' . $e->getMessage()
            ])->withInput($request->except('password', 'password_confirmation'));
        }
    }

    /**
     * Redirect user to appropriate dashboard based on their role
     */
    private function redirectUserBasedOnRole(User $user): RedirectResponse
    {
        // Generate personalized welcome message
        $welcomeMessage = $this->generateWelcomeMessage($user);
        
        // Handle both enum and string roles safely
        $roleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;
        
        switch ($roleValue) {
            case 'admin':
                return redirect()->route('admin.dashboard')
                    ->with('success', $welcomeMessage)
                    ->with('user_role', 'admin')
                    ->with('first_login', true);
            
            case 'teacher':
                return redirect()->route('teacher.dashboard')
                    ->with('success', $welcomeMessage)
                    ->with('user_role', 'teacher')
                    ->with('first_login', true)
                    ->with('getting_started', 'Create your first batch to get started with teaching!');
            
            case 'student':
                return redirect()->route('student.dashboard')
                    ->with('success', $welcomeMessage)
                    ->with('user_role', 'student')
                    ->with('first_login', true)
                    ->with('getting_started', 'Explore available classes and start learning!');
            
            default:
                return redirect()->route('dashboard')
                    ->with('success', 'Welcome to Micro LMS! Your account has been created successfully.')
                    ->with('first_login', true);
        }
    }

    /**
     * Generate personalized welcome message
     */
    private function generateWelcomeMessage(User $user): string
    {
        $firstName = explode(' ', $user->name)[0];
        
        try {
            $roleDisplayName = $user->role instanceof UserRole ? $user->role->getDisplayName() : ucfirst($user->role);
        } catch (Exception $e) {
            $roleDisplayName = 'User';
        }
        
        return "Welcome to Micro LMS, {$firstName}! Your {$roleDisplayName} account has been created successfully. Let's get you started!";
    }

    /**
     * Log user registration activity
     */
    private function logRegistrationActivity(User $user, Request $request): void
    {
        try {
            $roleDisplayName = $user->role instanceof UserRole ? $user->role->getDisplayName() : ucfirst($user->role);
            $roleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;
            
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'user_registration',
                'description' => "User registered with role: {$roleDisplayName}",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode([
                    'role' => $roleValue,
                    'email' => $user->email,
                    'registration_method' => 'web_form',
                    'timestamp' => now()->toISOString(),
                ]),
            ]);
        } catch (Exception $e) {
            // Log error but don't fail registration
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
                'description' => 'First login after registration',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode([
                    'login_type' => 'auto_after_registration',
                    'timestamp' => now()->toISOString(),
                ]),
            ]);
        } catch (Exception $e) {
            // Log error but don't fail registration
            Log::warning('Failed to log login activity', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get registration statistics (for admin dashboard)
     */
    public function getRegistrationStats(): array
    {
        try {
            return [
                'total_registrations' => User::count(),
                'registrations_today' => User::whereDate('created_at', today())->count(),
                'registrations_this_week' => User::where('created_at', '>=', now()->startOfWeek())->count(),
                'registrations_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
                'by_role' => [
                    'students' => User::where('role', UserRole::STUDENT->value)->count(),
                    'teachers' => User::where('role', UserRole::TEACHER->value)->count(),
                    'admins' => User::where('role', UserRole::ADMIN->value)->count(),
                ],
                'recent_registrations' => User::latest()
                    ->take(5)
                    ->select('id', 'name', 'email', 'role', 'created_at')
                    ->get()
                    ->toArray(),
            ];
        } catch (Exception $e) {
            Log::error('Failed to get registration stats', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Check if email domain is allowed (if you want to restrict domains)
     */
    private function isAllowedEmailDomain(string $email): bool
    {
        // Add your domain restrictions here if needed
        $allowedDomains = config('auth.allowed_email_domains', []);
        
        if (empty($allowedDomains)) {
            return true; // No restrictions
        }
        
        $domain = substr(strrchr($email, "@"), 1);
        return in_array($domain, $allowedDomains);
    }

    /**
     * Generate user initials for avatar
     */
    private function generateUserInitials(string $name): string
    {
        $words = explode(' ', trim($name));
        $initials = '';
        
        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper(substr($word, 0, 1));
            }
        }
        
        return substr($initials, 0, 2); // Max 2 initials
    }

    /**
     * Send welcome notification (if you implement notification system)
     */
    private function sendWelcomeNotification(User $user): void
    {
        try {
            // You can implement this when you add notification system
            // $user->notify(new WelcomeNotification());
            
            Log::info('Welcome notification queued for user', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (Exception $e) {
            Log::warning('Failed to send welcome notification', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}