<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Batch;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $admin = Auth::user();
        
        $stats = [
            'totalUsers' => User::count(),
            'totalTeachers' => User::where('role', 'teacher')->count(),
            'totalStudents' => User::where('role', 'student')->count(),
            'totalBatches' => Batch::count(),
            'totalClasses' => Lesson::count(),
            'totalQuizzes' => Quiz::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
            'stats' => $stats,
        ]);
    }

    // NEW METHOD: User Management
    public function userManagement(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/UserManagement/Index', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }

    public function teachers(): Response
    {
        $admin = Auth::user();
        
        $teachers = User::where('role', 'teacher')
            ->with(['teachingBatches'])
            ->paginate(15);

        return Inertia::render('Admin/Teachers/Index', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
            'teachers' => $teachers,
        ]);
    }

    public function students(): Response
    {
        $admin = Auth::user();
        
        $students = User::where('role', 'student')
            ->with(['studentBatches'])
            ->paginate(15);

        return Inertia::render('Admin/Students/Index', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
            'students' => $students,
        ]);
    }

    public function reports(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/Reports/Index', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }

    // NEW METHOD: System Reports
    public function systemReports(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/Reports/SystemReports', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }

    // NEW METHOD: User Analytics
    public function userAnalytics(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/Reports/UserAnalytics', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }

    // NEW METHOD: Financial Reports
    public function financialReports(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/Reports/FinancialReports', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }

    // NEW METHOD: System Settings
    public function systemSettings(): Response
    {
        $admin = Auth::user();
        
        return Inertia::render('Admin/Settings/SystemSettings', [
            'user' => [
                'name' => $admin->name,
                'role' => 'admin',
            ],
        ]);
    }
}