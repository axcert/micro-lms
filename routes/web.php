<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\BatchController;
use App\Http\Controllers\Teacher\ClassController; 
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
    ]);
});

// Guest routes (Authentication)
Route::middleware('guest')->group(function () {
    // Login routes
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Student Registration routes
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Staff (Teacher/Admin) Registration routes
    Route::get('register/staff', [RegisteredUserController::class, 'createStaff'])->name('register.staff');
    Route::post('register/staff', [RegisteredUserController::class, 'storeStaff'])->name('register.staff.store');

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

    // Student Approval routes (accessible by admin and teachers)
    Route::middleware([RoleMiddleware::class . ':admin,teacher'])->group(function () {
        Route::get('/pending-approvals', [RegisteredUserController::class, 'getPendingApprovals'])->name('pending.approvals');
        Route::post('/approve-student/{student}', [RegisteredUserController::class, 'approveStudent'])->name('approve.student');
        Route::post('/reject-student/{student}', [RegisteredUserController::class, 'rejectStudent'])->name('reject.student');
    });

    // Admin routes
    Route::middleware([RoleMiddleware::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/teachers', [AdminDashboardController::class, 'teachers'])->name('teachers.index');
        Route::get('/students', [AdminDashboardController::class, 'students'])->name('students.index');
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');
        Route::get('/settings', [AdminDashboardController::class, 'settings'])->name('settings');
        
        // Admin-specific approval management
        Route::get('/pending-students', [AdminDashboardController::class, 'pendingStudents'])->name('pending.students');
    });

    // Teacher routes
    Route::middleware([RoleMiddleware::class . ':teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        
        // FIXED: Batch Export Route (must come BEFORE resource routes)
        Route::get('batches/export', [BatchController::class, 'export'])->name('batches.export');
        
        // Batch Management - Full CRUD Resource Routes
        Route::resource('batches', BatchController::class);
        
        // Batch Student Management
        Route::post('batches/{batch}/students', [BatchController::class, 'assignStudents'])->name('batches.assign-students');
        Route::delete('batches/{batch}/students/{student}', [BatchController::class, 'removeStudent'])->name('batches.remove-student');
        Route::get('batches/{batch}/students', [BatchController::class, 'getStudents'])->name('batches.students');
        
        // Batch Actions
        Route::patch('batches/{batch}/toggle-status', [BatchController::class, 'toggleStatus'])->name('batches.toggle-status');
        Route::post('batches/{batch}/duplicate', [BatchController::class, 'duplicate'])->name('batches.duplicate');
        
        // Class Management Routes
        Route::prefix('classes')->name('classes.')->group(function () {
            Route::get('/', [ClassController::class, 'index'])->name('index');
            Route::get('/create', [ClassController::class, 'create'])->name('create');
            Route::post('/', [ClassController::class, 'store'])->name('store');
            Route::get('/{id}', [ClassController::class, 'show'])->name('show');
            Route::get('/{id}/edit', [ClassController::class, 'edit'])->name('edit');
            Route::put('/{id}', [ClassController::class, 'update'])->name('update');
            Route::delete('/{id}', [ClassController::class, 'destroy'])->name('destroy');
            
            // Class Actions
            Route::post('/{id}/start', [ClassController::class, 'start'])->name('start');
            Route::post('/{id}/complete', [ClassController::class, 'complete'])->name('complete');
            Route::post('/{id}/cancel', [ClassController::class, 'cancel'])->name('cancel');
        });
        
        // Other Teacher Routes
        Route::get('/quizzes', [TeacherDashboardController::class, 'quizzes'])->name('quizzes.index');
        Route::get('/reports', [TeacherDashboardController::class, 'reports'])->name('reports');
        
        // Teacher-specific approval management (for their batches)
        Route::get('/pending-students', [TeacherDashboardController::class, 'pendingStudents'])->name('pending.students');
    });

    // Student routes (only for approved students)
    Route::middleware([RoleMiddleware::class . ':student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/classes', [StudentDashboardController::class, 'classes'])->name('classes.index');
        Route::get('/quizzes', [StudentDashboardController::class, 'quizzes'])->name('quizzes.index');
        Route::get('/results', [StudentDashboardController::class, 'results'])->name('results');
    });
});

/*
|--------------------------------------------------------------------------
| API Routes for AJAX calls
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', RoleMiddleware::class . ':teacher'])->prefix('api/teacher')->name('api.teacher.')->group(function () {
    
    // Get batch students
    Route::get('/batches/{id}/students', [BatchController::class, 'getStudents'])->name('batch.students');
    
    // Check class scheduling conflicts
    Route::post('/classes/check-conflicts', [ClassController::class, 'checkConflicts'])->name('classes.check-conflicts');
    
    // Get class statistics
    Route::get('/classes/{id}/stats', [ClassController::class, 'getStats'])->name('classes.stats');
    
    // Get dashboard data
    Route::get('/dashboard/data', [TeacherDashboardController::class, 'getDashboardData'])->name('dashboard.data');
});

/*
|--------------------------------------------------------------------------
| Error Testing Routes (REMOVE IN PRODUCTION)
|--------------------------------------------------------------------------
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

    // Registration testing routes
    Route::get('/debug-registrations', function () {
        return response()->json([
            'total_users' => \App\Models\User::count(),
            'students' => [
                'total' => \App\Models\User::students()->count(),
                'approved' => \App\Models\User::students()->approved()->count(),
                'pending' => \App\Models\User::students()->pendingApproval()->count(),
            ],
            'teachers' => \App\Models\User::teachers()->count(),
            'admins' => \App\Models\User::admins()->count(),
            'pending_students' => \App\Models\User::students()
                ->pendingApproval()
                ->with('batch:id,name')
                ->get()
                ->map(function($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'batch' => $user->batch->name ?? 'No batch',
                        'bank_slip' => $user->bank_slip_path ? 'Yes' : 'No',
                        'registered_at' => $user->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
        ], 200, [], JSON_PRETTY_PRINT);
    });

    // Debug routes
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
}

/*
|--------------------------------------------------------------------------
| Fallback Route (404 Handler)
|--------------------------------------------------------------------------
*/
Route::fallback(function () {
    if (request()->header('X-Inertia')) {
        return Inertia::render('Errors/404', [
            'status' => 404,
            'message' => 'Page Not Found',
            'description' => 'The page you are looking for could not be found.',
        ]);
    }
    
    abort(404);
});