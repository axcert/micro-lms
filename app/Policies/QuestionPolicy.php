<?php

namespace App\Policies;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuestionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any questions.
     */
    public function viewAny(User $user, Quiz $quiz)
    {
        // Admin can view all questions
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher can view questions for their quizzes
        if ($user->role === UserRole::TEACHER) {
            return $quiz->batch->teacher_id === $user->id;
        }

        // Students can view questions during quiz attempts
        if ($user->role === UserRole::STUDENT) {
            return $user->batches->contains($quiz->batch_id) && $quiz->is_available;
        }

        return false;
    }

    /**
     * Determine whether the user can view the question.
     */
    public function view(User $user, Question $question)
    {
        $quiz = $question->quiz;
        
        // Admin can view all questions
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        // Teacher can view questions for their quizzes
        if ($user->role === UserRole::TEACHER) {
            return $quiz->batch->teacher_id === $user->id;
        }

        // Students can view questions during quiz attempts
        if ($user->role === UserRole::STUDENT) {
            return $user->batches->contains($quiz->batch_id) && $quiz->is_available;
        }

        return false;
    }

    /**
     * Determine whether the user can create questions.
     */
    public function create(User $user, Quiz $quiz)
    {
        // Only teachers can create questions
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the quiz's batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only add questions to draft quizzes or active quizzes without attempts
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Determine whether the user can update the question.
     */
    public function update(User $user, Question $question)
    {
        $quiz = $question->quiz;
        
        // Only teachers can update questions
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the quiz's batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only edit questions in draft quizzes or active quizzes without attempts
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Determine whether the user can delete the question.
     */
    public function delete(User $user, Question $question)
    {
        $quiz = $question->quiz;
        
        // Only teachers can delete questions
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the quiz's batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Cannot delete questions with existing attempts
        if ($question->attempts()->exists()) {
            return false;
        }

        // Can only delete questions from draft quizzes or active quizzes without attempts
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Determine whether the user can restore the question.
     */
    public function restore(User $user, Question $question)
    {
        $quiz = $question->quiz;
        
        return $user->role === UserRole::ADMIN || 
               ($user->role === UserRole::TEACHER && $quiz->batch->teacher_id === $user->id);
    }

    /**
     * Determine whether the user can permanently delete the question.
     */
    public function forceDelete(User $user, Question $question)
    {
        return $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can duplicate the question.
     */
    public function duplicate(User $user, Question $question)
    {
        $quiz = $question->quiz;
        
        // Only teachers can duplicate questions
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the quiz's batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only duplicate questions in editable quizzes
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }

    /**
     * Determine whether the user can reorder questions.
     */
    public function reorder(User $user, Quiz $quiz)
    {
        // Only teachers can reorder questions
        if ($user->role !== UserRole::TEACHER) {
            return false;
        }

        // Teacher must own the quiz's batch
        if ($quiz->batch->teacher_id !== $user->id) {
            return false;
        }

        // Can only reorder questions in editable quizzes
        return $quiz->status === 'draft' || 
               ($quiz->status === 'active' && $quiz->attempts()->count() === 0);
    }
}