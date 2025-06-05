<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                
                // Allow access to welcome page even when authenticated
                if ($request->is('/')) {
                    return $next($request);
                }
                
                // Only redirect authenticated users from login/register pages
                if ($request->is('login') || $request->is('register') || 
                    $request->is('forgot-password') || $request->is('reset-password/*')) {
                    
                    // Role-based redirection
                    switch ($user->role) {
                        case 'admin':
                            return redirect()->route('admin.dashboard');
                        case 'teacher':
                            return redirect()->route('teacher.dashboard');
                        case 'student':
                            return redirect()->route('student.dashboard');
                        default:
                            return redirect()->route('dashboard');
                    }
                }
            }
        }

        return $next($request);
    }
}