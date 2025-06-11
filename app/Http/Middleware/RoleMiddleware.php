<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;

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

        // ✅ FIXED: Properly handle UserRole enum objects
        try {
            // Convert the string parameter to enum for comparison
            $requiredRole = UserRole::from($role);
            
            // Now compare enum to enum (both are UserRole objects)
            $hasAccess = $user->role === $requiredRole;
            
            // Get string values for logging
            $userRoleString = $user->role->value;
            $requiredRoleString = $requiredRole->value;
            
        } catch (\ValueError $e) {
            // If role string is invalid, log and deny access
            \Log::error('Invalid role parameter in middleware', [
                'role_parameter' => $role,
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            
            return redirect()->route('dashboard')
                ->with('flash', ['type' => 'error', 'message' => 'Invalid role specified.']);
        }

        // Log access attempt for debugging
        \Log::info('Role middleware check', [
            'user_id' => $user->id,
            'user_role' => $userRoleString,
            'required_role' => $requiredRoleString,
            'access_granted' => $hasAccess,
            'route' => $request->route()?->getName(),
            'url' => $request->url()
        ]);

        // Check if user has the required role
        if (!$hasAccess) {
            // Log the unauthorized access attempt
            \Log::warning('Unauthorized access attempt', [
                'user_id' => $user->id,
                'user_role' => $userRoleString,
                'required_role' => $requiredRoleString,
                'requested_url' => $request->url(),
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip()
            ]);

            // For AJAX requests, return JSON error
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Required role: ' . ucfirst($requiredRoleString),
                    'required_role' => $requiredRoleString,
                    'user_role' => $userRoleString,
                    'redirect_url' => $this->getUserDashboardRoute($userRoleString)
                ], 403);
            }

            // For regular requests, redirect to appropriate dashboard with flash message
            return $this->redirectToUserDashboard($userRoleString, $requiredRoleString);
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
    private function redirectToUserDashboard(string $userRole, string $requiredRole)
    {
        $message = "Access denied. You need '" . ucfirst($requiredRole) . "' privileges to access that page.";
        
        switch ($userRole) {
            case 'admin':
                return redirect()->route('admin.dashboard')
                    ->with('flash', ['type' => 'error', 'message' => $message]);
            case 'teacher':
                return redirect()->route('teacher.dashboard')
                    ->with('flash', ['type' => 'error', 'message' => $message]);
            case 'student':
                return redirect()->route('student.dashboard')
                    ->with('flash', ['type' => 'error', 'message' => $message]);
            default:
                return redirect()->route('dashboard')
                    ->with('flash', ['type' => 'error', 'message' => $message]);
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