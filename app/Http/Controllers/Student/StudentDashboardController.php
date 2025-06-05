<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        $student = Auth::user();

        // Get student's enrolled batches
        $batchIds = $student->studentBatches()->pluck('batches.id');

        // Get upcoming classes for student's batches
        $myClasses = Lesson::whereIn('batch_id', $batchIds)
            ->with(['batch'])
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        // FIXED: Get pending quizzes using your ACTUAL column names
        $pendingQuizzes = Quiz::whereIn('batch_id', $batchIds)
            ->where('end_time', '>=', now())
            ->whereDoesntHave('attempts', function ($query) use ($student) {
                $query->where('quiz_attempts.student_id', $student->id)  // Use student_id (not user_id)
                      ->whereIn('quiz_attempts.status', ['submitted', 'completed']); // Use status (not is_completed)
            })
            ->with(['batch'])
            ->take(5)
            ->get();

        // FIXED: Calculate student statistics using your actual column names
        $completedAttempts = QuizAttempt::where('student_id', $student->id) // Use student_id
                                       ->whereIn('status', ['submitted', 'completed']) // Use status
                                       ->whereNotNull('total_score')
                                       ->whereNotNull('max_score')
                                       ->where('max_score', '>', 0);

        // Calculate average percentage score
        $averageScore = 0;
        if ($completedAttempts->count() > 0) {
            $averageScore = $completedAttempts->get()->avg(function ($attempt) {
                return ($attempt->total_score / $attempt->max_score) * 100;
            });
        }

        $stats = [
            'averageScore' => round($averageScore, 1),
            'quizzesCompleted' => $completedAttempts->count(),
            'attendance' => 95, // This would come from actual attendance tracking
        ];

        return Inertia::render('Student/Dashboard', [
            'myClasses' => $myClasses,
            'pendingQuizzes' => $pendingQuizzes,
            'stats' => $stats,
        ]);
    }

    public function classes(): Response
    {
        $student = Auth::user();
        $batchIds = $student->studentBatches()->pluck('batches.id');

        $classes = Lesson::whereIn('batch_id', $batchIds)
            ->with(['batch'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(15);

        return Inertia::render('Student/Classes/Index', [
            'classes' => $classes,
        ]);
    }

    public function quizzes(): Response
    {
        $student = Auth::user();
        $batchIds = $student->studentBatches()->pluck('batches.id');

        $availableQuizzes = Quiz::whereIn('batch_id', $batchIds)
            ->where('end_time', '>=', now())
            ->with(['batch', 'attempts' => function ($query) use ($student) {
                $query->where('student_id', $student->id); // Use student_id
            }])
            ->paginate(15);

        return Inertia::render('Student/Quizzes/Index', [
            'quizzes' => $availableQuizzes,
        ]);
    }

    public function results(): Response
    {
        $student = Auth::user();

        $results = QuizAttempt::where('student_id', $student->id) // Use student_id
                              ->whereIn('status', ['submitted', 'completed']) // Use status
                              ->with(['quiz.batch'])
                              ->orderBy('submitted_at', 'desc')
                              ->paginate(15);

        return Inertia::render('Student/Results/Index', [
            'results' => $results,
        ]);
    }
}