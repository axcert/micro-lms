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
            ->get();

        // Get upcoming lessons for teacher's batches
        $upcomingClasses = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->where('scheduled_at', '>=', now())
            ->with(['batch'])
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        // Get recent quizzes for teacher's batches
        $recentQuizzes = Quiz::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->withCount('attempts')
            ->with(['batch'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Teacher/Dashboard', [
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
            'quizzes' => $quizzes,
        ]);
    }

    public function reports(): Response
    {
        return Inertia::render('Teacher/Reports/Index');
    }
}