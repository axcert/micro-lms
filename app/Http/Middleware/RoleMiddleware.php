<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;
use Inertia\Inertia;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Get the authenticated user
        $user = Auth::user();

        // Check if user needs approval (students only)
        if ($user->isStudent() && !$user->isApproved()) {
            \Log::warning('Unapproved student attempted access', [
                'user_id' => $user->id,
                'email' => $user->email,
                'requested_url' => $request->url(),
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip()
            ]);

            // For AJAX requests, return JSON error
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your account is pending approval. Please wait for admin verification.',
                    'status' => 'pending_approval',
                    'redirect_url' => route('login')
                ], 403);
            }

            // For Inertia requests, render pending approval page
            if ($request->header('X-Inertia')) {
                return Inertia::render('Auth/PendingApproval', [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'registered_at' => $user->created_at->format('M j, Y g:i A'),
                        'days_pending' => $user->created_at->diffInDays(now()),
                    ]
                ]);
            }

            // For regular requests, redirect to login with message
            Auth::logout();
            return redirect()->route('login')->with('warning', 
                'Your account is pending approval. Please wait for admin verification before accessing the system.'
            );
        }

        // Check if user is active
        if (!$user->isActive()) {
            \Log::warning('Inactive user attempted access', [
                'user_id' => $user->id,
                'email' => $user->email,
                'requested_url' => $request->url(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your account has been deactivated. Please contact support.',
                    'status' => 'inactive',
                    'redirect_url' => route('login')
                ], 403);
            }

            Auth::logout();
            return redirect()->route('login')->with('error', 
                'Your account has been deactivated. Please contact support for assistance.'
            );
        }

        // Handle role checking - support multiple roles separated by comma
        $allowedRoles = explode(',', $role);
        $hasAccess = false;

        try {
            foreach ($allowedRoles as $allowedRole) {
                $requiredRole = UserRole::from(trim($allowedRole));
                if ($user->role === $requiredRole) {
                    $hasAccess = true;
                    break;
                }
            }
            
            $userRoleString = $user->role->value;
            
        } catch (\ValueError $e) {
            \Log::error('Invalid role parameter in middleware', [
                'role_parameter' => $role,
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            
            return redirect()->route('dashboard')
                ->with('error', 'Invalid role specified.');
        }

        // Log access attempt for debugging
        \Log::info('Role middleware check', [
            'user_id' => $user->id,
            'user_role' => $userRoleString,
            'required_roles' => $allowedRoles,
            'access_granted' => $hasAccess,
            'route' => $request->route()?->getName(),
            'url' => $request->url(),
            'is_approved' => $user->isApproved(),
            'is_active' => $user->isActive()
        ]);

        // Check if user has any of the required roles
        if (!$hasAccess) {
            \Log::warning('Unauthorized access attempt', [
                'user_id' => $user->id,
                'user_role' => $userRoleString,
                'required_roles' => $allowedRoles,
                'requested_url' => $request->url(),
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip()
            ]);

            // For AJAX requests, return JSON error
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Required role: ' . implode(' or ', $allowedRoles),
                    'required_roles' => $allowedRoles,
                    'user_role' => $userRoleString,
                    'redirect_url' => $this->getUserDashboardRoute($userRoleString)
                ], 403);
            }

            // For regular requests, redirect to appropriate dashboard with flash message
            return $this->redirectToUserDashboard($userRoleString, $allowedRoles);
        }

        // ✅ Access granted
        \Log::info('Role middleware access granted', [
            'user_id' => $user->id,
            'role' => $userRoleString,
            'route' => $request->route()?->getName()
        ]);

        return $next($request);
    }

    /**
     * Redirect user to their appropriate dashboard with a flash message
     */
    private function redirectToUserDashboard(string $userRole, array $requiredRoles)
    {
        $message = "Access denied. You need '" . implode(' or ', array_map('ucfirst', $requiredRoles)) . "' privileges to access that page.";
        
        switch ($userRole) {
            case 'admin':
                return redirect()->route('admin.dashboard')
                    ->with('error', $message);
            case 'teacher':
                return redirect()->route('teacher.dashboard')
                    ->with('error', $message);
            case 'student':
                return redirect()->route('student.dashboard')
                    ->with('error', $message);
            default:
                return redirect()->route('dashboard')
                    ->with('error', $message);
        }
    }

    /**
     * Get the dashboard route for a user role
     */
    private function getUserDashboardRoute(string $userRole): string
    {
        switch ($userRole) {
            case 'admin':
                return route('admin.dashboard');
            case 'teacher':
                return route('teacher.dashboard');
            case 'student':
                return route('student.dashboard');
            default:
                return route('dashboard');
        }
    }
}