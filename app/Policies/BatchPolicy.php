<?php

namespace App\Policies;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BatchPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any batches.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'teacher' || $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the batch.
     */
    public function view(User $user, Batch $batch): bool
    {
        // Teachers can only view their own batches
        if ($user->role === 'teacher') {
            return $batch->teacher_id === $user->id;
        }

        // Admins can view all batches
        if ($user->role === 'admin') {
            return true;
        }

        // Students can view batches they're enrolled in
        if ($user->role === 'student') {
            return $batch->students()->where('student_id', $user->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create batches.
     */
    public function create(User $user): bool
    {
        return $user->role === 'teacher' || $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the batch.
     */
    public function update(User $user, Batch $batch): bool
    {
        // Teachers can only update their own batches
        if ($user->role === 'teacher') {
            return $batch->teacher_id === $user->id;
        }

        // Admins can update all batches
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the batch.
     */
    public function delete(User $user, Batch $batch): bool
    {
        // Teachers can only delete their own batches if they have no classes or quizzes
        if ($user->role === 'teacher') {
            return $batch->teacher_id === $user->id && 
                   $batch->classes()->count() === 0 && 
                   $batch->quizzes()->count() === 0;
        }

        // Admins can delete any batch
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the batch.
     */
    public function restore(User $user, Batch $batch): bool
    {
        return $this->update($user, $batch);
    }

    /**
     * Determine whether the user can permanently delete the batch.
     */
    public function forceDelete(User $user, Batch $batch): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can manage students in the batch.
     */
    public function manageStudents(User $user, Batch $batch): bool
    {
        return $this->update($user, $batch);
    }

    /**
     * Determine whether the user can duplicate the batch.
     */
    public function duplicate(User $user, Batch $batch): bool
    {
        return $this->view($user, $batch) && $this->create($user);
    }

    /**
     * Determine whether the user can export batch data.
     */
    public function export(User $user, Batch $batch): bool
    {
        return $this->view($user, $batch);
    }
}