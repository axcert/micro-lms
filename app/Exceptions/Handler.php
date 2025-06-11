<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e): Response
    {
        $response = parent::render($request, $e);
        $status = $response->getStatusCode();

        // Only handle error pages for HTTP errors (4xx, 5xx)
        if ($status < 400) {
            return $response;
        }

        // Handle Inertia requests with custom error pages
        if ($request->header('X-Inertia')) {
            return $this->handleInertiaError($request, $e, $status);
        }

        // Handle regular requests - let your RoleMiddleware handle redirects for 403
        if ($status === 403 && !$request->expectsJson()) {
            // Don't override RoleMiddleware redirects, let them handle it
            return $response;
        }

        return $response;
    }

    /**
     * Handle errors for Inertia requests
     */
    protected function handleInertiaError(Request $request, Throwable $e, int $status)
    {
        // Get user data for all error pages
        $authData = [
            'user' => auth()->check() ? [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role,
            ] : null,
        ];

        // Log the error for debugging
        Log::info('Error page rendered', [
            'status' => $status,
            'url' => $request->url(),
            'user_id' => auth()->id(),
            'user_role' => auth()->user()?->role,
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
        ]);

        switch ($status) {
            case 403:
                return Inertia::render('Errors/403', [
                    'status' => 403,
                    'message' => 'Access Forbidden',
                    'description' => $this->get403Message(auth()->user()?->role),
                    'auth' => $authData,
                ])->toResponse($request)->setStatusCode(403);

            case 404:
                return Inertia::render('Errors/404', [
                    'status' => 404,
                    'message' => 'Page Not Found',
                    'description' => $this->get404Message(auth()->user()?->role),
                    'auth' => $authData,
                ])->toResponse($request)->setStatusCode(404);

            case 500:
                return Inertia::render('Errors/500', [
                    'status' => 500,
                    'message' => 'Server Error',
                    'description' => config('app.debug') 
                        ? $e->getMessage() 
                        : 'Something went wrong on our end. Please try again later.',
                    'auth' => $authData,
                ])->toResponse($request)->setStatusCode(500);

            case 419: // CSRF Token Mismatch
                return Inertia::render('Errors/500', [
                    'status' => 419,
                    'message' => 'Session Expired',
                    'description' => 'Your session has expired for security reasons. Please refresh the page and log in again.',
                    'auth' => $authData,
                ])->toResponse($request)->setStatusCode(419);

            case 429: // Too Many Requests
                return Inertia::render('Errors/500', [
                    'status' => 429,
                    'message' => 'Too Many Requests',
                    'description' => 'You are making requests too quickly. Please wait a moment and try again.',
                    'auth' => $authData,
                ])->toResponse($request)->setStatusCode(429);

            default:
                // For other 4xx/5xx errors, use a generic error page
                if ($status >= 400) {
                    return Inertia::render('Errors/500', [
                        'status' => $status,
                        'message' => 'Error',
                        'description' => 'An error occurred while processing your request.',
                        'auth' => $authData,
                    ])->toResponse($request)->setStatusCode($status);
                }
        }

        return parent::render($request, $e);
    }

    /**
     * Get 403 error message based on user role
     */
    private function get403Message(?string $userRole): string
    {
        switch ($userRole) {
            case 'student':
                return 'This section is only available to teachers and administrators. Students can access classes, quizzes, and results from their dashboard.';
            case 'teacher':
                return 'This administrative feature is only available to system administrators. Teachers can manage their batches, classes, and quizzes.';
            case 'admin':
                return 'Even administrators have certain access restrictions. This action may be system-protected.';
            default:
                return 'You do not have permission to access this resource. Please contact your administrator if you believe this is an error.';
        }
    }

    /**
     * Get 404 error message based on user role
     */
    private function get404Message(?string $userRole): string
    {
        switch ($userRole) {
            case 'student':
                return 'The class or quiz you are looking for might not be available to you yet, or it may have been moved by your teacher.';
            case 'teacher':
                return 'The resource you are looking for is not in your assigned batches or may have been removed by an administrator.';
            case 'admin':
                return 'The requested administrative resource could not be found. It may have been removed or the URL is incorrect.';
            default:
                return 'The page you are looking for could not be found. It may have been moved or deleted.';
        }
    }

    /**
     * Convert an authentication exception into a response.
     */
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}