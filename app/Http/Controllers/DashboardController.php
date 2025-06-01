<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Redirect to role-specific dashboard
        switch ($user->role) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'teacher':
                return redirect()->route('teacher.dashboard');
            case 'student':
                return redirect()->route('student.dashboard');
            default:
                return redirect()->route('login');
        }
    }
    
    public function admin(Request $request)
    {
        // TODO: Fetch real stats from database
        $stats = [
            'total_users' => 125,
            'total_students' => 100,
            'total_teachers' => 20,
            'total_batches' => 15,
            'total_classes' => 45,
            'total_quizzes' => 30,
            'active_students' => 85,
        ];
        
        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
        ]);
    }
    
    public function teacher(Request $request)
    {
        $user = $request->user();
        
        // TODO: Fetch real data from database
        $batches = [];
        $upcomingClasses = [];
        $recentQuizzes = [];
        $stats = [
            'total_batches' => 5,
            'upcoming_classes' => 3,
            'pending_quizzes' => 2,
        ];
        
        return Inertia::render('Dashboard/Teacher', [
            'batches' => $batches,
            'upcomingClasses' => $upcomingClasses,
            'recentQuizzes' => $recentQuizzes,
            'stats' => $stats,
        ]);
    }
    
    public function student(Request $request)
    {
        $user = $request->user();
        
        // TODO: Fetch real data from database
        $upcomingClasses = [];
        $pendingQuizzes = [];
        
        return Inertia::render('Dashboard/Student', [
            'upcomingClasses' => $upcomingClasses,
            'pendingQuizzes' => $pendingQuizzes,
        ]);
    }
}