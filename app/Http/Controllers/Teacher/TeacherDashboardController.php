<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class TeacherDashboardController extends Controller
{
    // FIXED: Changed return type to allow both Inertia\Response and JsonResponse
    public function index(): Response|JsonResponse
    {
        \Log::info('=== TeacherDashboardController::index() CALLED ===', [
            'user_id' => Auth::id(),
            'user_email' => Auth::user()?->email,
            'timestamp' => now()
        ]);
        
        try {
            \Log::info('Step 1: Getting teacher user');
            $teacher = Auth::user();
            
            if (!$teacher) {
                \Log::error('Step 1 FAILED: No authenticated user');
                abort(401, 'User not authenticated');
            }

            // FIXED: Better role checking that handles both enum and string roles
            $isTeacher = false;
            if (method_exists($teacher, 'isTeacher')) {
                $isTeacher = $teacher->isTeacher();
            } else {
                $userRole = $teacher->role;
                $isTeacher = ($userRole === 'teacher' || (is_object($userRole) && $userRole->value === 'teacher'));
            }
            
            if (!$isTeacher) {
                \Log::error('Step 1 FAILED: User is not a teacher', [
                    'user_role' => $teacher->role,
                    'user_id' => $teacher->id
                ]);
                abort(403, 'Unauthorized access - Teacher role required');
            }
            \Log::info('Step 1 SUCCESS: Teacher authorized');
            
            \Log::info('Step 2: Getting batches');
            $myBatches = Batch::where('teacher_id', $teacher->id)
                ->withCount('students')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($batch) {
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'description' => $batch->description ?? '',
                        'students_count' => $batch->students_count ?? 0,
                        'start_date' => $batch->start_date ?? null,
                        'end_date' => $batch->end_date ?? null,
                        'is_active' => $batch->is_active ?? true,
                    ];
                });
            \Log::info('Step 2 SUCCESS: Got ' . count($myBatches) . ' batches');

            \Log::info('Step 3: Getting lessons');
            // FIXED: Use 'classes' table instead of 'lessons' if that's your table name
            $upcomingClasses = \DB::table('classes')
                ->join('batches', 'classes.batch_id', '=', 'batches.id')
                ->where('batches.teacher_id', $teacher->id)
                ->where('classes.scheduled_at', '>=', now())
                ->orderBy('classes.scheduled_at')
                ->take(5)
                ->select([
                    'classes.id',
                    'classes.title',
                    'classes.scheduled_at',
                    'classes.zoom_link',
                    'batches.id as batch_id',
                    'batches.name as batch_name'
                ])
                ->get()
                ->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'title' => $class->title ?? 'Untitled Class',
                        'scheduled_at' => \Carbon\Carbon::parse($class->scheduled_at)->toISOString(),
                        'zoom_link' => $class->zoom_link ?? '',
                        'batch' => [
                            'id' => $class->batch_id,
                            'name' => $class->batch_name,
                        ],
                    ];
                });
            \Log::info('Step 3 SUCCESS: Got ' . count($upcomingClasses) . ' classes');

            \Log::info('Step 4: Getting quizzes');
            $recentQuizzes = Quiz::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->with(['batch:id,name'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($quiz) {
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title ?? 'Untitled Quiz',
                        'status' => $quiz->status ?? 'draft',
                        'total_marks' => $quiz->total_marks ?? 0,
                        'attempts_count' => 0,
                        'questions_count' => 0,
                        'batch' => [
                            'id' => $quiz->batch->id,
                            'name' => $quiz->batch->name,
                        ],
                    ];
                });
            \Log::info('Step 4 SUCCESS: Got ' . count($recentQuizzes) . ' quizzes');

            \Log::info('Step 5: Calculating stats');
            $totalBatches = Batch::where('teacher_id', $teacher->id)->count();
            $batchesWithStudents = Batch::where('teacher_id', $teacher->id)->withCount('students')->get();
            $totalStudents = $batchesWithStudents->sum('students_count');
            
            $activeQuizzes = Quiz::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->where('status', 'active')->count();
            
            $upcomingClassesCount = \DB::table('classes')
                ->join('batches', 'classes.batch_id', '=', 'batches.id')
                ->where('batches.teacher_id', $teacher->id)
                ->where('classes.scheduled_at', '>=', now())
                ->count();

            $stats = [
                'total_batches' => $totalBatches,
                'total_students' => $totalStudents,
                'active_quizzes' => $activeQuizzes,
                'upcoming_classes' => $upcomingClassesCount,
            ];
            \Log::info('Step 5 SUCCESS: Stats calculated', $stats);

            // FIXED: Safely get role value
            $roleValue = is_object($teacher->role) ? $teacher->role->value : $teacher->role;

            \Log::info('Step 6: Rendering Inertia response');
            return Inertia::render('Teacher/Dashboard', [
                'myBatches' => $myBatches,
                'upcomingClasses' => $upcomingClasses,
                'recentQuizzes' => $recentQuizzes,
                'stats' => $stats,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'phone' => $teacher->phone ?? '',
                        'role' => $roleValue,
                        'email_verified_at' => $teacher->email_verified_at,
                        'created_at' => $teacher->created_at,
                        'updated_at' => $teacher->updated_at,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('=== TEACHER DASHBOARD ERROR ===', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // FIXED: Return JSON for debugging (now allowed by return type)
            if (request()->expectsJson() || app()->environment('local')) {
                return response()->json([
                    'error' => 'Dashboard failed',
                    'message' => $e->getMessage(),
                    'file' => basename($e->getFile()) . ':' . $e->getLine(),
                    'trace' => app()->environment('local') ? $e->getTraceAsString() : null
                ], 500);
            }
            
            // FIXED: Return Inertia error page for web requests
            return Inertia::render('Errors/500', [
                'error' => 'Dashboard loading failed',
                'message' => 'Please try again or contact support if the problem persists.',
                'auth' => [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->email,
                        'role' => is_object(Auth::user()->role) ? Auth::user()->role->value : Auth::user()->role,
                    ] : null
                ]
            ]);
        }
    }

    public function batches(): Response
    {
        $teacher = Auth::user();
        
        $batches = Batch::where('teacher_id', $teacher->id)
            ->withCount('students')
            ->paginate(15);

        $roleValue = is_object($teacher->role) ? $teacher->role->value : $teacher->role;

        return Inertia::render('Teacher/Batches/Index', [
            'batches' => $batches,
            'auth' => [
                'user' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'role' => $roleValue,
                ]
            ]
        ]);
    }

    public function classes(): Response
    {
        $teacher = Auth::user();
        
        // FIXED: Use direct DB query if Lesson model has issues
        $classes = \DB::table('classes')
            ->join('batches', 'classes.batch_id', '=', 'batches.id')
            ->where('batches.teacher_id', $teacher->id)
            ->orderBy('classes.scheduled_at', 'desc')
            ->select([
                'classes.*',
                'batches.name as batch_name'
            ])
            ->paginate(15);

        $roleValue = is_object($teacher->role) ? $teacher->role->value : $teacher->role;

        return Inertia::render('Teacher/Classes/Index', [
            'classes' => $classes,
            'auth' => [
                'user' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'role' => $roleValue,
                ]
            ]
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

        $roleValue = is_object($teacher->role) ? $teacher->role->value : $teacher->role;

        return Inertia::render('Teacher/Quizzes/Index', [
            'quizzes' => $quizzes,
            'auth' => [
                'user' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'role' => $roleValue,
                ]
            ]
        ]);
    }

    public function reports(): Response
    {
        $teacher = Auth::user();
        
        $roleValue = is_object($teacher->role) ? $teacher->role->value : $teacher->role;
        
        return Inertia::render('Teacher/Reports/Index', [
            'auth' => [
                'user' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'role' => $roleValue,
                ]
            ]
        ]);
    }
}

