<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Quiz;
use App\Models\Class as ClassModel;
use App\Models\User;
use App\Enums\UserRole;
use App\Enums\QuizStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role
     * 
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function index()
    {
         \Log::info('=== DashboardController::index() CALLED ===', [
        'user_id' => Auth::id(),
        'user_email' => Auth::user()?->email,
        'timestamp' => now()
    ]);
        $user = Auth::user();
        
        // Redirect to role-specific dashboard
        switch ($user->role) {
            case UserRole::ADMIN:
                return redirect()->route('admin.dashboard');
            case UserRole::TEACHER:
                return redirect()->route('teacher.dashboard');
            case UserRole::STUDENT:
                return redirect()->route('student.dashboard');
            default:
                // Fallback dashboard for unknown roles
                return Inertia::render('Dashboard/Default', [
                    'user' => $user,
                ]);
        }
    }

    /**
     * Display the teacher dashboard with real data
     */
    public function teacherDashboard(): Response
    {
        $user = Auth::user();
        
        if ($user->role !== UserRole::TEACHER) {
            abort(403, 'Access denied. Teacher role required.');
        }

        // Get teacher's batches with student count
        $myBatches = Batch::where('teacher_id', $user->id)
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'students_count' => $batch->students_count,
                    'description' => $batch->description ?? ''
                ];
            });

        // Get upcoming classes
        $upcomingClasses = ClassModel::with(['batch:id,name'])
            ->whereHas('batch', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })
            ->where('scheduled_at', '>', Carbon::now())
            ->orderBy('scheduled_at', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'title' => $class->title,
                    'scheduled_at' => $class->scheduled_at->toISOString(),
                    'zoom_link' => $class->zoom_link ?? '',
                    'batch' => [
                        'id' => $class->batch->id,
                        'name' => $class->batch->name
                    ]
                ];
            });

        // Get recent quizzes
        $recentQuizzes = Quiz::with(['batch:id,name'])
            ->whereHas('batch', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })
            ->withCount([
                'attempts as attempts_count' => function ($q) {
                    $q->whereNotNull('submitted_at');
                }
            ])
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($quiz) {
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'status' => $quiz->status,
                    'total_marks' => $quiz->total_marks ?? 0,
                    'questions_count' => $quiz->questions_count,
                    'attempts_count' => $quiz->attempts_count,
                    'batch' => [
                        'id' => $quiz->batch->id,
                        'name' => $quiz->batch->name
                    ]
                ];
            });

        // Calculate dashboard statistics
        $stats = $this->getTeacherStats($user->id);

        return Inertia::render('Teacher/Dashboard', [
            'myBatches' => $myBatches,
            'upcomingClasses' => $upcomingClasses,
            'recentQuizzes' => $recentQuizzes,
            'stats' => $stats
        ]);
    }

    /**
     * Display the student dashboard with real data
     */
    public function studentDashboard(): Response
    {
        $user = Auth::user();
        
        if ($user->role !== UserRole::STUDENT) {
            abort(403, 'Access denied. Student role required.');
        }

        // Get student's batches
        $studentBatches = $user->batches()
            ->with(['teacher:id,name,email'])
            ->withCount('students')
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'description' => $batch->description ?? '',
                    'students_count' => $batch->students_count,
                    'teacher' => [
                        'id' => $batch->teacher->id,
                        'name' => $batch->teacher->name,
                        'email' => $batch->teacher->email
                    ]
                ];
            });

        // Get upcoming classes for student's batches
        $upcomingClasses = ClassModel::with(['batch:id,name'])
            ->whereIn('batch_id', $user->batches->pluck('id'))
            ->where('scheduled_at', '>', Carbon::now())
            ->orderBy('scheduled_at', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'title' => $class->title,
                    'scheduled_at' => $class->scheduled_at->toISOString(),
                    'zoom_link' => $class->zoom_link ?? '',
                    'batch' => [
                        'id' => $class->batch->id,
                        'name' => $class->batch->name
                    ]
                ];
            });

        // Get available quizzes for student
        $availableQuizzes = Quiz::with(['batch:id,name'])
            ->whereIn('batch_id', $user->batches->pluck('id'))
            ->where('status', 'active')
            ->where(function ($q) {
                $now = Carbon::now();
                $q->where(function ($query) use ($now) {
                    $query->whereNull('start_time')->orWhere('start_time', '<=', $now);
                })
                ->where(function ($query) use ($now) {
                    $query->whereNull('end_time')->orWhere('end_time', '>=', $now);
                });
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($quiz) use ($user) {
                $attemptCount = $quiz->attempts()
                    ->where('student_id', $user->id)
                    ->whereNotNull('submitted_at')
                    ->count();
                
                $bestScore = $quiz->attempts()
                    ->where('student_id', $user->id)
                    ->whereNotNull('submitted_at')
                    ->max('score');
                
                $canAttempt = true;
                if ($quiz->max_attempts && $attemptCount >= $quiz->max_attempts) {
                    $canAttempt = false;
                }
                
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description ?? '',
                    'total_marks' => $quiz->total_marks ?? 0,
                    'pass_marks' => $quiz->pass_marks,
                    'duration_minutes' => $quiz->duration_minutes,
                    'max_attempts' => $quiz->max_attempts,
                    'attempt_count' => $attemptCount,
                    'best_score' => $bestScore,
                    'can_attempt' => $canAttempt,
                    'batch' => [
                        'id' => $quiz->batch->id,
                        'name' => $quiz->batch->name
                    ]
                ];
            });

        // Get recent quiz results
        $recentResults = DB::table('quiz_attempts')
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->join('batches', 'quizzes.batch_id', '=', 'batches.id')
            ->where('quiz_attempts.student_id', $user->id)
            ->whereNotNull('quiz_attempts.submitted_at')
            ->orderBy('quiz_attempts.submitted_at', 'desc')
            ->limit(10)
            ->select([
                'quiz_attempts.id',
                'quizzes.title as quiz_title',
                'quiz_attempts.score',
                'quizzes.total_marks',
                'quiz_attempts.percentage',
                'quiz_attempts.grade',
                'quiz_attempts.has_passed',
                'quiz_attempts.submitted_at',
                'batches.name as batch_name'
            ])
            ->get()
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'quiz_title' => $attempt->quiz_title,
                    'score' => $attempt->score,
                    'total_marks' => $attempt->total_marks,
                    'percentage' => $attempt->percentage,
                    'grade' => $attempt->grade,
                    'has_passed' => $attempt->has_passed,
                    'submitted_at' => Carbon::parse($attempt->submitted_at)->toISOString(),
                    'batch_name' => $attempt->batch_name
                ];
            });

        // Calculate student statistics
        $stats = $this->getStudentStats($user->id);

        return Inertia::render('Student/Dashboard', [
            'studentBatches' => $studentBatches,
            'upcomingClasses' => $upcomingClasses,
            'availableQuizzes' => $availableQuizzes,
            'recentResults' => $recentResults,
            'stats' => $stats
        ]);
    }

    /**
     * Display the admin dashboard with real data
     */
    public function adminDashboard(): Response
    {
        $user = Auth::user();
        
        if ($user->role !== UserRole::ADMIN) {
            abort(403, 'Access denied. Admin role required.');
        }

        // System-wide statistics
        $systemStats = [
            'total_teachers' => User::where('role', UserRole::TEACHER)->count(),
            'total_students' => User::where('role', UserRole::STUDENT)->count(),
            'total_batches' => Batch::count(),
            'total_quizzes' => Quiz::count(),
            'active_quizzes' => Quiz::where('status', 'active')->count(),
            'total_quiz_attempts' => DB::table('quiz_attempts')->whereNotNull('submitted_at')->count()
        ];

        // Recent activities
        $recentTeachers = User::where('role', UserRole::TEACHER)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        $recentStudents = User::where('role', UserRole::STUDENT)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        $recentBatches = Batch::with(['teacher:id,name'])
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentQuizzes = Quiz::with(['batch.teacher:id,name'])
            ->withCount('attempts')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'systemStats' => $systemStats,
            'recentTeachers' => $recentTeachers,
            'recentStudents' => $recentStudents,
            'recentBatches' => $recentBatches,
            'recentQuizzes' => $recentQuizzes
        ]);
    }

    /**
     * Get teacher-specific statistics
     */
    private function getTeacherStats($teacherId): array
    {
        $batchIds = Batch::where('teacher_id', $teacherId)->pluck('id');
        
        // Handle case where teacher has no batches yet
        if ($batchIds->isEmpty()) {
            return [
                'total_batches' => 0,
                'total_students' => 0,
                'active_quizzes' => 0,
                'upcoming_classes' => 0,
                'total_quiz_attempts' => 0
            ];
        }

        return [
            'total_batches' => $batchIds->count(),
            'total_students' => DB::table('batch_students')
                ->whereIn('batch_id', $batchIds)
                ->where('is_active', true)
                ->count(),
            'active_quizzes' => Quiz::whereIn('batch_id', $batchIds)
                ->where('status', 'active')
                ->count(),
            'upcoming_classes' => ClassModel::whereIn('batch_id', $batchIds)
                ->where('scheduled_at', '>', Carbon::now())
                ->count(),
            'total_quiz_attempts' => DB::table('quiz_attempts')
                ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
                ->whereIn('quizzes.batch_id', $batchIds)
                ->whereNotNull('quiz_attempts.submitted_at')
                ->count()
        ];
    }

    /**
     * Get student-specific statistics
     */
    private function getStudentStats($studentId): array
    {
        $user = User::find($studentId);
        
        // Handle case where student is not enrolled in any batches
        if (!$user || !$user->batches || $user->batches->isEmpty()) {
            return [
                'enrolled_batches' => 0,
                'upcoming_classes' => 0,
                'available_quizzes' => 0,
                'completed_quizzes' => 0,
                'total_quizzes' => 0,
                'passed_quizzes' => 0,
                'average_score' => 0,
                'completion_rate' => 0
            ];
        }

        $batchIds = $user->batches->pluck('id');
        
        $quizAttempts = DB::table('quiz_attempts')
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->where('quiz_attempts.student_id', $studentId)
            ->whereNotNull('quiz_attempts.submitted_at')
            ->whereIn('quizzes.batch_id', $batchIds)
            ->get();
            
        $totalQuizzes = Quiz::whereIn('batch_id', $batchIds)->count();
        $completedQuizzes = $quizAttempts->unique('quiz_id')->count();
        $passedQuizzes = $quizAttempts->where('has_passed', true)->unique('quiz_id')->count();
        
        return [
            'enrolled_batches' => $batchIds->count(),
            'upcoming_classes' => ClassModel::whereIn('batch_id', $batchIds)
                ->where('scheduled_at', '>', Carbon::now())
                ->count(),
            'available_quizzes' => Quiz::whereIn('batch_id', $batchIds)
                ->where('status', 'active')
                ->where(function ($q) {
                    $now = Carbon::now();
                    $q->where(function ($query) use ($now) {
                        $query->whereNull('start_time')->orWhere('start_time', '<=', $now);
                    })
                    ->where(function ($query) use ($now) {
                        $query->whereNull('end_time')->orWhere('end_time', '>=', $now);
                    });
                })
                ->count(),
            'completed_quizzes' => $completedQuizzes,
            'total_quizzes' => $totalQuizzes,
            'passed_quizzes' => $passedQuizzes,
            'average_score' => $quizAttempts->avg('percentage') ?? 0,
            'completion_rate' => $totalQuizzes > 0 ? ($completedQuizzes / $totalQuizzes) * 100 : 0
        ];
    }
}