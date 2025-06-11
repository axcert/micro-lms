<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuizPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any quizzes.
     */
    public function viewAny(User $user)
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::TEACHER]);
    }

    /**
     * Determine whether the user can view the quiz.
     */
    public function view(User $user, Quiz $quiz)
    {
        // Admin can view all quizzes
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher can view their own batch quizzes
        if ($user->role === UserRole::TEACHER) {
            return $quiz->batch->teacher_id === $user->id;
        }

        // Students can view quizzes from their batches if quiz is active
        if ($user->role === UserRole::STUDENT) {
            return $user->batches->contains($quiz->batch_id) && 
                   $quiz->status === 'active';
        }

        return false;
    }

    /**
     * Determine whether the user can create quizzes.
     */
    public function create(User $user)
    {
        return $user->role === UserRole::TEACHER;
    }

    /**
     * Determine whether the user can update the quiz.
     */
    public function update(User $user, Quiz $quiz)
    {
        // Only teachers can update quizzes
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Additional restrictions based on quiz state
        return true; // Basic authorization passed, specific restrictions handled in controller
    }

    /**
     * Determine whether the user can delete the quiz.
     */
    public function delete(User $user, Quiz $quiz)
    {
        // Only teachers can delete quizzes
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Cannot delete quiz with existing attempts
        if ($quiz->attempts()->exists()) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can restore the quiz.
     */
    public function restore(User $user, Quiz $quiz)
    {
        return $user->role === UserRole::ADMIN || 
               ($user->role === UserRole::TEACHER && $quiz->batch->teacher_id === $user->id);
    }

    /**
     * Determine whether the user can permanently delete the quiz.
     */
    public function forceDelete(User $user, Quiz $quiz)
    {
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can activate the quiz.
     */
    public function activate(User $user, Quiz $quiz)
    {
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only activate draft quizzes with questions
        return $quiz->status === 'draft' && $quiz->questions()->count() > 0;
    }

    /**
     * Determine whether the user can archive the quiz.
     */
    public function archive(User $user, Quiz $quiz)
    {
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only archive active quizzes
        return $quiz->status === 'active';
    }

    /**
     * Determine whether the user can duplicate the quiz.
     */
    public function duplicate(User $user, Quiz $quiz)
    {
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the batch to duplicate
        return $quiz->batch->teacher_id === $user->id;
    }

    /**
     * Determine whether the user can view quiz results.
     */
    public function viewResults(User $user, Quiz $quiz)
    {
        // Admin can view all results
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher can view results for their quizzes
        if ($user->role === UserRole::TEACHER) {
            return $quiz->batch->teacher_id === $user->id;
        }

        // Students can view their own results if allowed
        if ($user->role === UserRole::STUDENT) {
            return $user->batches->contains($quiz->batch_id) && 
                   $quiz->show_results_immediately;
        }

        return false;
    }

    /**
     * Determine whether the user can attempt the quiz.
     */
    public function attempt(User $user, Quiz $quiz)
    {
        // Only students can attempt quizzes
        if ($user->role !== UserRole::STUDENT) {
            return false;
        }

        // Student must be in the quiz's batch
        if (!$user->batches->contains($quiz->batch_id)) {
            return false;
        }

        // Quiz must be active and available
        if (!$quiz->is_available) {
            return false;
        }

        // Check attempt limits
        if ($quiz->max_attempts) {
            $attemptCount = $quiz->attempts()
                ->where('student_id', $user->id)
                ->whereNotNull('submitted_at')
                ->count();
                
            if ($attemptCount >= $quiz->max_attempts) {
                return false;
            }
        }

        // Check if student has an ongoing attempt
        $ongoingAttempt = $quiz->attempts()
            ->where('student_id', $user->id)
            ->whereNull('submitted_at')
            ->first();

        // If there's an ongoing attempt, they can continue it
        // If no ongoing attempt, they can start a new one
        return true;
    }

    /**
     * Determine whether the user can export quiz data.
     */
    public function export(User $user, Quiz $quiz)
    {
        // Admin can export all quiz data
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher can export their quiz data
        if ($user->role === UserRole::TEACHER) {
            return $quiz->batch->teacher_id === $user->id;
        }

        return false;
    }
}