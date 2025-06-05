<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Batch;
use App\Models\Quiz;
use App\Models\Lesson;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalTeachers' => User::where('role', 'teacher')->count(),
            'totalStudents' => User::where('role', 'student')->count(),
            'totalBatches' => Batch::count(),
            'totalClasses' => Lesson::count(),
            'totalQuizzes' => Quiz::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function teachers(): Response
    {
        $teachers = User::where('role', 'teacher')
            ->with(['teachingBatches'])
            ->paginate(15);

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    public function students(): Response
    {
        $students = User::where('role', 'student')
            ->with(['studentBatches'])
            ->paginate(15);

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
        ]);
    }

    public function reports(): Response
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function settings(): Response
    {
        return Inertia::render('Admin/Settings/Index');
    }
}