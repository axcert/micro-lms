<?php
// routes/web.php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
    
    // Dashboard - redirect based on role
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
    
    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'admin'])
            ->name('admin.dashboard');
        Route::get('/users', function () {
            return inertia('Admin/Users');
        })->name('admin.users');
        Route::get('/reports', function () {
            return inertia('Admin/Reports');
        })->name('admin.reports');
    });
    
    // Teacher routes
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'teacher'])
            ->name('teacher.dashboard');
        Route::get('/batches', function () {
            return inertia('Teacher/Batches');
        })->name('teacher.batches');
        Route::get('/classes', function () {
            return inertia('Teacher/Classes');
        })->name('teacher.classes');
        Route::get('/quizzes', function () {
            return inertia('Teacher/Quizzes');
        })->name('teacher.quizzes');
        Route::get('/quiz/create', function () {
            return inertia('Teacher/QuizCreate');
        })->name('teacher.quiz.create');
    });
    
    // Student routes
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'student'])
            ->name('student.dashboard');
        Route::get('/classes', function () {
            return inertia('Student/Classes');
        })->name('student.classes');
        Route::get('/quiz/{quiz}', function () {
            return inertia('Student/QuizTake');
        })->name('student.quiz.take');
        Route::get('/results', function () {
            return inertia('Student/Results');
        })->name('student.results');
    });
});