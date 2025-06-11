<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\BatchController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        // ADD THIS: Pass authentication data to the frontend
        'auth' => [
            'user' => auth()->check() ? [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role,
            ] : null,
        ],
    ]);
});

// Guest routes (Authentication)
Route::middleware('guest')->group(function () {
    // Login routes
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Register routes
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Password reset routes
    Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.update');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Generic dashboard (fallback)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin routes - Using full class name instead of 'role:admin'
    Route::middleware([RoleMiddleware::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/teachers', [AdminDashboardController::class, 'teachers'])->name('teachers.index');
        Route::get('/students', [AdminDashboardController::class, 'students'])->name('students.index');
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');
        Route::get('/settings', [AdminDashboardController::class, 'settings'])->name('settings');
    });

    // Teacher routes - Using full class name instead of 'role:teacher'
    Route::middleware([RoleMiddleware::class . ':teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        
        // Batch Management - Full CRUD Resource Routes (including destroy)
        Route::resource('batches', BatchController::class);
        
        // Batch Student Management
        Route::post('batches/{batch}/students', [BatchController::class, 'assignStudents'])->name('batches.assign-students');
        Route::delete('batches/{batch}/students/{student}', [BatchController::class, 'removeStudent'])->name('batches.remove-student');
        Route::get('batches/{batch}/students', [BatchController::class, 'getStudents'])->name('batches.students');
        
        // Batch Actions
        Route::patch('batches/{batch}/toggle-status', [BatchController::class, 'toggleStatus'])->name('batches.toggle-status');
        Route::post('batches/{batch}/duplicate', [BatchController::class, 'duplicate'])->name('batches.duplicate');
        Route::get('batches/{batch}/export', [BatchController::class, 'export'])->name('batches.export');
        
        // Other existing routes
        Route::get('/classes', [TeacherDashboardController::class, 'classes'])->name('classes.index');
        Route::get('/quizzes', [TeacherDashboardController::class, 'quizzes'])->name('quizzes.index');
        Route::get('/reports', [TeacherDashboardController::class, 'reports'])->name('reports');
    });

    // Student routes - Using full class name instead of 'role:student'
    Route::middleware([RoleMiddleware::class . ':student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/classes', [StudentDashboardController::class, 'classes'])->name('classes.index');
        Route::get('/quizzes', [StudentDashboardController::class, 'quizzes'])->name('quizzes.index');
        Route::get('/results', [StudentDashboardController::class, 'results'])->name('results');
    });
});

/*
|--------------------------------------------------------------------------
| Error Testing Routes (REMOVE IN PRODUCTION)
|--------------------------------------------------------------------------
| These routes are for testing error pages during development
*/
if (app()->environment(['local', 'development'])) {
    Route::prefix('test-errors')->name('test.errors.')->group(function () {
        // Test 403 - Forbidden Access
        Route::get('/403', function () {
            abort(403, 'Test 403 error - Access forbidden for testing purposes');
        })->name('403');

        // Test 404 - Not Found
        Route::get('/404', function () {
            abort(404, 'Test 404 error - Page not found for testing purposes');
        })->name('404');

        // Test 500 - Server Error
        Route::get('/500', function () {
            throw new \Exception('Test 500 error - Server error for testing purposes');
        })->name('500');

        // Test role-based 403 errors
        Route::get('/admin-only', function () {
            return response()->json(['message' => 'Admin access granted']);
        })->middleware(['auth', RoleMiddleware::class . ':admin'])->name('admin-only');

        Route::get('/teacher-only', function () {
            return response()->json(['message' => 'Teacher access granted']);
        })->middleware(['auth', RoleMiddleware::class . ':teacher'])->name('teacher-only');

        Route::get('/student-only', function () {
            return response()->json(['message' => 'Student access granted']);
        })->middleware(['auth', RoleMiddleware::class . ':student'])->name('student-only');
    });
}

/*
|--------------------------------------------------------------------------
| Debug Routes (REMOVE IN PRODUCTION)
|--------------------------------------------------------------------------
*/
if (app()->environment(['local', 'development'])) {
    // Add these temporary debug routes to the bottom of your web.php
    Route::get('/debug-auth', function () {
        return response()->json([
            'authenticated' => auth()->check(),
            'user' => auth()->user(),
            'session_id' => session()->getId(),
            'session_data' => session()->all(),
        ]);
    });

    Route::get('/force-logout', function () {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
        return redirect('/')->with('message', 'Logged out successfully');
    });

    Route::get('/clear-sessions', function () {
        session()->flush();
        session()->regenerate();
        return redirect('/')->with('message', 'Sessions cleared');
    });

    // Debug route for teacher dashboard data
    Route::get('/debug-teacher-dashboard', function() {
        // Simulate what the dashboard controller does
        $teacher = \App\Models\User::where('email', 'teacher@mlms.com')->first();
        
        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found']);
        }
        
        try {
            // Get teacher's batches with student count
            $myBatches = \App\Models\Batch::where('teacher_id', $teacher->id)
                ->withCount('students')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($batch) {
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'description' => $batch->description ?? '',
                        'students_count' => $batch->students_count ?? 0,
                    ];
                });

            // Get upcoming classes for teacher's batches
            $upcomingClasses = \App\Models\Lesson::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->where('scheduled_at', '>=', now())
                ->with(['batch:id,name'])
                ->orderBy('scheduled_at')
                ->take(5)
                ->get()
                ->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'title' => $class->title ?? 'Untitled Class',
                        'scheduled_at' => $class->scheduled_at->toISOString(),
                        'zoom_link' => $class->zoom_link ?? '',
                        'batch' => [
                            'id' => $class->batch->id,
                            'name' => $class->batch->name,
                        ],
                    ];
                });

            // Get recent quizzes for teacher's batches
            $recentQuizzes = \App\Models\Quiz::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->with(['batch:id,name'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($quiz) {
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title ?? 'Untitled Quiz',
                        'status' => $quiz->status ?? 'draft',
                        'total_marks' => $quiz->total_marks ?? 0,
                        'batch' => [
                            'id' => $quiz->batch->id,
                            'name' => $quiz->batch->name,
                        ],
                    ];
                });

            // Calculate stats
            $totalBatches = \App\Models\Batch::where('teacher_id', $teacher->id)->count();
            $batchesWithStudents = \App\Models\Batch::where('teacher_id', $teacher->id)->withCount('students')->get();
            $totalStudents = $batchesWithStudents->sum('students_count');
            
            $activeQuizzes = \App\Models\Quiz::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->where('status', 'active')->count();
            
            $upcomingClassesCount = \App\Models\Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->where('scheduled_at', '>=', now())->count();

            $stats = [
                'total_batches' => $totalBatches,
                'total_students' => $totalStudents,
                'active_quizzes' => $activeQuizzes,
                'upcoming_classes' => $upcomingClassesCount,
            ];

            return response()->json([
                'success' => true,
                'teacher' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                ],
                'dashboard_data' => [
                    'myBatches' => $myBatches,
                    'upcomingClasses' => $upcomingClasses,
                    'recentQuizzes' => $recentQuizzes,
                    'stats' => $stats,
                ],
                'summary' => [
                    'batches_count' => count($myBatches),
                    'classes_count' => count($upcomingClasses),
                    'quizzes_count' => count($recentQuizzes),
                    'should_dashboard_work' => count($myBatches) > 0 || count($upcomingClasses) > 0
                ],
                'raw_counts' => [
                    'total_batches' => \App\Models\Batch::count(),
                    'teacher_batches' => \App\Models\Batch::where('teacher_id', $teacher->id)->count(),
                    'total_lessons' => \App\Models\Lesson::count(),
                    'teacher_lessons' => \App\Models\Lesson::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->count(),
                    'total_quizzes' => \App\Models\Quiz::count(),
                    'teacher_quizzes' => \App\Models\Quiz::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->count(),
                ]
            ], 200, [], JSON_PRETTY_PRINT);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Dashboard data fetch failed',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    });

    // Quick data verification route
    Route::get('/verify-data', function() {
        try {
            $teacher = \App\Models\User::where('email', 'teacher@mlms.com')->first();
            
            if (!$teacher) {
                return response()->json(['error' => 'Teacher not found. Run UserSeeder first.']);
            }
            
            $data = [
                'teacher' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                ],
                'counts' => [
                    'total_users' => \App\Models\User::count(),
                    'teachers' => \App\Models\User::where('role', 'teacher')->count(),
                    'students' => \App\Models\User::where('role', 'student')->count(),
                    'total_batches' => \App\Models\Batch::count(),
                    'teacher_batches' => \App\Models\Batch::where('teacher_id', $teacher->id)->count(),
                    'total_lessons' => \App\Models\Lesson::count(),
                    'teacher_lessons' => \App\Models\Lesson::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->count(),
                    'total_quizzes' => \App\Models\Quiz::count(),
                    'teacher_quizzes' => \App\Models\Quiz::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->count(),
                ],
                'sample_data' => [
                    'first_batch' => \App\Models\Batch::where('teacher_id', $teacher->id)->first(),
                    'first_lesson' => \App\Models\Lesson::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->first(),
                    'first_quiz' => \App\Models\Quiz::whereHas('batch', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->first(),
                ]
            ];
            
            return response()->json($data, 200, [], JSON_PRETTY_PRINT);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error checking data',
                'message' => $e->getMessage(),
            ]);
        }
    });
}

/*
|--------------------------------------------------------------------------
| Fallback Route (404 Handler)
|--------------------------------------------------------------------------
| This must be the LAST route defined. It catches all undefined routes
| and renders the 404 error page through Inertia.js
*/
Route::fallback(function () {
    // Check if it's an Inertia request
    if (request()->header('X-Inertia')) {
        return Inertia::render('Errors/404', [
            'status' => 404,
            'message' => 'Page Not Found',
            'description' => 'The page you are looking for could not be found.',
            'auth' => [
                'user' => auth()->check() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                    'role' => auth()->user()->role,
                ] : null,
            ],
        ]);
    }
    
    // For non-Inertia requests, still abort with 404
    abort(404);
});