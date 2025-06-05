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
        
        // Batch Management - Full CRUD Resource Routes
        Route::resource('batches', BatchController::class)->except(['destroy']);
        Route::delete('batches/{batch}', [BatchController::class, 'destroy'])->name('batches.destroy');
        
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