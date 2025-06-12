<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\BatchController;
use App\Http\Controllers\Teacher\QuizController;
use App\Http\Controllers\Teacher\QuestionController;
use App\Http\Controllers\Teacher\ClassController;
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
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.update');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin routes - UPDATED WITH NEW ROUTES
    Route::middleware([RoleMiddleware::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // User Management - NEW ROUTE
        Route::get('/user-management', [AdminDashboardController::class, 'userManagement'])->name('user-management');
        
        // Teachers & Students
        Route::get('/teachers', [AdminDashboardController::class, 'teachers'])->name('teachers.index');
        Route::get('/students', [AdminDashboardController::class, 'students'])->name('students.index');
        
        // Reports & Analytics - UPDATED WITH SUBROUTES
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');
        Route::get('/system-reports', [AdminDashboardController::class, 'systemReports'])->name('system-reports');
        Route::get('/user-analytics', [AdminDashboardController::class, 'userAnalytics'])->name('user-analytics');
        Route::get('/financial-reports', [AdminDashboardController::class, 'financialReports'])->name('financial-reports');
        
        // Settings - UPDATED ROUTES
        Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings');
        Route::get('/system-settings', [AdminDashboardController::class, 'systemSettings'])->name('system-settings');
        Route::post('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
        Route::post('/settings/reset', [AdminSettingsController::class, 'reset'])->name('settings.reset');
    });

    // Teacher routes
    Route::middleware([RoleMiddleware::class . ':teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        
        // Batch Management
        Route::resource('batches', BatchController::class)->except(['destroy']);
        Route::delete('batches/{batch}', [BatchController::class, 'destroy'])->name('batches.destroy');
        Route::post('batches/{batch}/students', [BatchController::class, 'assignStudents'])->name('batches.assign-students');
        Route::delete('batches/{batch}/students/{student}', [BatchController::class, 'removeStudent'])->name('batches.remove-student');
        Route::get('batches/{batch}/students', [BatchController::class, 'getStudents'])->name('batches.students');
        Route::patch('batches/{batch}/toggle-status', [BatchController::class, 'toggleStatus'])->name('batches.toggle-status');
        Route::post('batches/{batch}/duplicate', [BatchController::class, 'duplicate'])->name('batches.duplicate');
        Route::get('batches/{batch}/export', [BatchController::class, 'export'])->name('batches.export');
        
        // Class Management
        Route::resource('classes', ClassController::class);
        Route::patch('classes/{class}/toggle-status', [ClassController::class, 'toggleStatus'])->name('classes.toggle-status');
        
        // Quiz Management
        Route::resource('quizzes', QuizController::class);
        Route::patch('quizzes/{quiz}/toggle-status', [QuizController::class, 'toggleStatus'])->name('quizzes.toggle-status');
        Route::get('quizzes/{quiz}/results', [QuizController::class, 'results'])->name('quizzes.results');
        Route::post('quizzes/{quiz}/duplicate', [QuizController::class, 'duplicate'])->name('quizzes.duplicate');
        
        // Question Management
        Route::resource('quizzes.questions', QuestionController::class)->except(['index']);
        Route::get('quizzes/{quiz}/questions', [QuestionController::class, 'index'])->name('quizzes.questions.index');
        
        Route::get('/reports', [TeacherDashboardController::class, 'reports'])->name('reports');
    });

    // Student routes
    Route::middleware([RoleMiddleware::class . ':student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/classes', [StudentDashboardController::class, 'classes'])->name('classes.index');
        Route::get('/quizzes', [StudentDashboardController::class, 'quizzes'])->name('quizzes.index');
        Route::get('/results', [StudentDashboardController::class, 'results'])->name('results');
    });
});

// Debug routes (you can keep these for testing)
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