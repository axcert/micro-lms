<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TeacherDashboardController extends Controller
{
    public function index(): Response
    {
        $teacher = Auth::user();
        
        // Get teacher's batches with student count
        $myBatches = Batch::where('teacher_id', $teacher->id)
            ->withCount('students')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'students_count' => $batch->students_count,
                ];
            });

        // Get upcoming lessons for teacher's batches
        $upcomingClasses = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->where('scheduled_at', '>=', now())
            ->with(['batch'])
            ->orderBy('scheduled_at')
            ->take(5)
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title ?? $lesson->name, // Use title if available, fallback to name
                    'scheduled_at' => $lesson->scheduled_at,
                    'batch' => [
                        'name' => $lesson->batch->name,
                    ],
                ];
            });

        // Get recent quizzes for teacher's batches
        $recentQuizzes = Quiz::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->withCount('attempts')
            ->with(['batch'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($quiz) {
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'attempts_count' => $quiz->attempts_count,
                    'batch' => [
                        'name' => $quiz->batch->name,
                    ],
                ];
            });

        return Inertia::render('Teacher/Dashboard', [
            // Add user data with role
            'user' => [
                'name' => $teacher->name,
                'role' => 'teacher',
            ],
            'myBatches' => $myBatches,
            'upcomingClasses' => $upcomingClasses,
            'recentQuizzes' => $recentQuizzes,
        ]);
    }

    public function batches(): Response
    {
        $teacher = Auth::user();
        
        $batches = Batch::where('teacher_id', $teacher->id)
            ->withCount('students')
            ->paginate(15);

        return Inertia::render('Teacher/Batches/Index', [
            'user' => [
                'name' => $teacher->name,
                'role' => 'teacher',
            ],
            'batches' => $batches,
        ]);
    }

    public function classes(): Response
    {
        $teacher = Auth::user();
        
        $classes = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->with(['batch'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(15);

        return Inertia::render('Teacher/Classes/Index', [
            'user' => [
                'name' => $teacher->name,
                'role' => 'teacher',
            ],
            'classes' => $classes,
        ]);
    }

    public function quizzes(): Response
    {
        $teacher = Auth::user();
        
        $quizzes = Quiz::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->with(['batch'])
            ->withCount('attempts')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Teacher/Quizzes/Index', [
            'user' => [
                'name' => $teacher->name,
                'role' => 'teacher',
            ],
            'quizzes' => $quizzes,
        ]);
    }

    public function reports(): Response
    {
        $teacher = Auth::user();
        
        return Inertia::render('Teacher/Reports/Index', [
            'user' => [
                'name' => $teacher->name,
                'role' => 'teacher',
            ],
        ]);
    }
}