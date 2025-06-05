<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

// Models
use App\Models\Batch;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\QuizAttempt;

// Policies
use App\Policies\BatchPolicy;
use App\Policies\UserPolicy;
use App\Policies\ClassPolicy;
use App\Policies\QuizPolicy;
use App\Policies\QuestionPolicy;
use App\Policies\QuizAttemptPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Batch Management
        Batch::class => BatchPolicy::class,
        
        // User Management (for admin/teacher managing users)
        User::class => UserPolicy::class,
        
        // Class Management (when you implement classes)
        // ClassModel::class => ClassPolicy::class,
        
        // Quiz Management (when you implement quizzes)
        // Quiz::class => QuizPolicy::class,
        // Question::class => QuestionPolicy::class,
        // QuizAttempt::class => QuizAttemptPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // ===================== ROLE-BASED GATES =====================

        // Admin Gates
        Gate::define('admin-access', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-users', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-system-settings', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('view-all-reports', function (User $user) {
            return $user->role === 'admin';
        });

        // Teacher Gates
        Gate::define('teacher-access', function (User $user) {
            return in_array($user->role, ['admin', 'teacher']);
        });

        Gate::define('manage-batches', function (User $user) {
            return in_array($user->role, ['admin', 'teacher']);
        });

        Gate::define('manage-classes', function (User $user) {
            return in_array($user->role, ['admin', 'teacher']);
        });

        Gate::define('manage-quizzes', function (User $user) {
            return in_array($user->role, ['admin', 'teacher']);
        });

        Gate::define('view-student-progress', function (User $user) {
            return in_array($user->role, ['admin', 'teacher']);
        });

        // Student Gates
        Gate::define('student-access', function (User $user) {
            return $user->role === 'student';
        });

        Gate::define('take-quizzes', function (User $user) {
            return $user->role === 'student';
        });

        Gate::define('view-own-results', function (User $user) {
            return $user->role === 'student';
        });

        Gate::define('join-classes', function (User $user) {
            return $user->role === 'student';
        });

        // ===================== RESOURCE-SPECIFIC GATES =====================

        // Batch-specific gates
        Gate::define('view-batch', function (User $user, Batch $batch) {
            // Admins can view all batches
            if ($user->role === 'admin') {
                return true;
            }
            
            // Teachers can view their own batches
            if ($user->role === 'teacher') {
                return $batch->teacher_id === $user->id;
            }
            
            // Students can view batches they're enrolled in
            if ($user->role === 'student') {
                return $batch->students()->where('student_id', $user->id)->exists();
            }
            
            return false;
        });

        Gate::define('edit-batch', function (User $user, Batch $batch) {
            // Admins can edit all batches
            if ($user->role === 'admin') {
                return true;
            }
            
            // Teachers can edit their own batches
            return $user->role === 'teacher' && $batch->teacher_id === $user->id;
        });

        Gate::define('delete-batch', function (User $user, Batch $batch) {
            // Only allow deletion if no classes or quizzes exist
            $hasContent = $batch->classes()->count() > 0 || $batch->quizzes()->count() > 0;
            
            if ($hasContent) {
                return false;
            }
            
            // Admins can delete any batch
            if ($user->role === 'admin') {
                return true;
            }
            
            // Teachers can delete their own batches
            return $user->role === 'teacher' && $batch->teacher_id === $user->id;
        });

        // ===================== CONDITIONAL GATES =====================

        // Gates that depend on application state or settings
        Gate::define('create-batch', function (User $user) {
            if (!in_array($user->role, ['admin', 'teacher'])) {
                return false;
            }
            
            // Check if teacher has reached batch limit (optional)
            if ($user->role === 'teacher') {
                $batchCount = Batch::where('teacher_id', $user->id)
                    ->where('is_active', true)
                    ->count();
                
                // Adjust this limit based on your business rules
                return $batchCount < 20;
            }
            
            return true;
        });

        Gate::define('assign-students', function (User $user, Batch $batch) {
            // Must be able to edit the batch
            if (!Gate::allows('edit-batch', $batch)) {
                return false;
            }
            
            // Batch must be active to assign students
            return $batch->is_active;
        });

        Gate::define('remove-students', function (User $user, Batch $batch) {
            // Must be able to edit the batch
            if (!Gate::allows('edit-batch', $batch)) {
                return false;
            }
            
            // Can remove students from any batch (active or inactive)
            return true;
        });

        // ===================== SUPER ADMIN GATES =====================

        // For future use if you need a super admin role
        Gate::define('super-admin', function (User $user) {
            // You can add a 'super_admin' boolean field to users table
            return $user->role === 'admin' && ($user->is_super_admin ?? false);
        });

        Gate::before(function (User $user, string $ability) {
            // Super admins can do anything (if implemented)
            if ($user->role === 'admin' && ($user->is_super_admin ?? false)) {
                return true;
            }
            
            // No global permissions - let individual gates decide
            return null;
        });

        // ===================== DEBUGGING GATES (Development Only) =====================

        if (app()->environment('local', 'development')) {
            Gate::define('debug-access', function (User $user) {
                return true; // Allow debugging in development
            });
        }
    }
}