<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    /**
     * Display the student dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Sample data - replace with real database queries
        $myBatch = [
            'id' => 1,
            'name' => 'Mathematics Grade 10 - Section A',
            'teacher_name' => 'Dr. Sarah Johnson',
            'students_count' => 28
        ];

        $upcomingClasses = collect([
            [
                'id' => 1,
                'title' => 'Algebra Fundamentals',
                'scheduled_at' => now()->addHours(4)->toDateTimeString(),
                'duration' => 60,
                'zoom_link' => 'https://zoom.us/j/1234567890',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'status' => 'upcoming'
            ],
            [
                'id' => 2,
                'title' => 'Geometry Workshop',
                'scheduled_at' => now()->addDays(1)->setHour(14)->setMinute(30)->toDateTimeString(),
                'duration' => 90,
                'zoom_link' => 'https://zoom.us/j/0987654321',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'status' => 'upcoming'
            ],
            [
                'id' => 3,
                'title' => 'Problem Solving Session',
                'scheduled_at' => now()->addDays(3)->setHour(16)->setMinute(0)->toDateTimeString(),
                'duration' => 75,
                'zoom_link' => 'https://zoom.us/j/1122334455',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'status' => 'upcoming'
            ]
        ]);

        $availableQuizzes = collect([
            [
                'id' => 1,
                'title' => 'Linear Equations Quiz',
                'description' => 'Test your understanding of linear equations',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'duration' => 30,
                'questions_count' => 15,
                'start_time' => now()->subHour()->toDateTimeString(),
                'end_time' => now()->addDays(2)->toDateTimeString(),
                'status' => 'available'
            ],
            [
                'id' => 2,
                'title' => 'Quadratic Functions Assessment',
                'description' => 'Comprehensive test on quadratic functions',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'duration' => 45,
                'questions_count' => 20,
                'start_time' => now()->addDays(1)->toDateTimeString(),
                'end_time' => now()->addDays(5)->toDateTimeString(),
                'status' => 'upcoming'
            ],
            [
                'id' => 3,
                'title' => 'Trigonometry Basics',
                'description' => 'Introduction to trigonometric functions',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'teacher' => ['name' => 'Dr. Sarah Johnson'],
                'duration' => 40,
                'questions_count' => 18,
                'start_time' => now()->addHours(2)->toDateTimeString(),
                'end_time' => now()->addDays(3)->toDateTimeString(),
                'status' => 'available'
            ]
        ]);

        $recentResults = collect([
            [
                'id' => 1,
                'title' => 'Polynomials Quiz',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'score' => 92,
                'total_points' => 100,
                'completed_at' => now()->subDays(2)->toDateTimeString()
            ],
            [
                'id' => 2,
                'title' => 'Factorization Test',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'score' => 85,
                'total_points' => 100,
                'completed_at' => now()->subDays(5)->toDateTimeString()
            ],
            [
                'id' => 3,
                'title' => 'Basic Algebra Quiz',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'score' => 78,
                'total_points' => 100,
                'completed_at' => now()->subWeek()->toDateTimeString()
            ]
        ]);

        $stats = [
            'classes_attended' => 24,
            'quizzes_completed' => 12,
            'average_score' => 85.3,
            'current_streak' => 7
        ];

        return Inertia::render('Student/Dashboard', [
            // ADD THE MISSING 'role' FIELD HERE:
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'student',  // 👈 THIS WAS MISSING!
            ],
            'myBatch' => $myBatch,
            'upcomingClasses' => $upcomingClasses,
            'availableQuizzes' => $availableQuizzes,
            'recentResults' => $recentResults,
            'stats' => $stats
        ]);
    }

    // ... rest of your methods remain the same
}