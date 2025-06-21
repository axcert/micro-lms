<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassController extends Controller
{
    /**
     * Display a listing of classes
     */
    public function index(Request $request)
    {
        $teacher = Auth::user();
        
        try {
            // Build query with search and filters
            $query = Lesson::with(['batch' => function($q) {
                $q->select('id', 'name', 'teacher_id');
                $q->withCount('students');
            }])
            ->whereHas('batch', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            });

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereHas('batch', function ($bq) use ($search) {
                          $bq->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Apply status filter
            if ($request->filled('status')) {
                $query->where('status', $request->get('status'));
            }

            $classes = $query->orderBy('scheduled_at', 'desc')->paginate(15);

            // Calculate basic stats
            $statsQuery = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            });

            $stats = [
                'total_classes' => $statsQuery->count(),
                'upcoming_classes' => $statsQuery->where('scheduled_at', '>', now())
                    ->where('status', 'scheduled')->count(),
                'completed_classes' => $statsQuery->where('status', 'completed')->count(),
                'classes_today' => $statsQuery->whereDate('scheduled_at', today())->count(),
            ];

            return Inertia::render('Teacher/Classes/Index', [
                'classes' => $classes,
                'stats' => $stats,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Classes index failed', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Teacher/Classes/Index', [
                'classes' => collect(),
                'stats' => [
                    'total_classes' => 0, 
                    'upcoming_classes' => 0, 
                    'completed_classes' => 0, 
                    'classes_today' => 0
                ],
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ],
                'flash' => [
                    'error' => 'Unable to load classes. Please try again.'
                ]
            ]);
        }
    }

    /**
     * Display the specified class
     */
    public function show($id)
    {
        $teacher = Auth::user();
        
        try {
            Log::info('Attempting to show class', [
                'class_id' => $id,
                'teacher_id' => $teacher->id
            ]);

            // First, let's check if the class exists at all
            $classExists = Lesson::where('id', $id)->exists();
            
            if (!$classExists) {
                Log::warning('Class not found', ['class_id' => $id]);
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Get the class with proper authorization check
            $class = Lesson::with([
                'batch' => function($q) {
                    $q->select('id', 'name', 'teacher_id', 'description');
                    $q->with(['students' => function($sq) {
                        $sq->select('users.id', 'users.name', 'users.email');
                    }]);
                },
                'attendances' => function($q) {
                    $q->with(['user' => function($uq) {
                        $uq->select('id', 'name', 'email');
                    }]);
                }
            ])->find($id);

            if (!$class) {
                Log::warning('Class not found after query', ['class_id' => $id]);
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check if teacher has permission to view this class
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                Log::warning('Teacher access denied', [
                    'class_id' => $id,
                    'teacher_id' => $teacher->id,
                    'batch_teacher_id' => $class->batch?->teacher_id
                ]);
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to view this class.');
            }

            // Get students from the batch
            $students = $class->batch->students ?? collect();

            // Calculate attendance stats with safety checks
            $attendanceStats = $this->calculateAttendanceStats($class, $students);

            // Format class data for frontend
            $classData = $this->formatClassData($class);

            Log::info('Class show successful', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'student_count' => $students->count()
            ]);

            return Inertia::render('Teacher/Classes/Show', [
                'classData' => $classData,
                'students' => $students->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                    ];
                })->toArray(),
                'attendanceStats' => $attendanceStats,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Class show failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('teacher.classes.index')
                ->with('error', 'Unable to load class details. Please try again.');
        }
    }

    /**
     * Show the form for creating a new class
     */
    public function create()
    {
        $teacher = Auth::user();
        
        try {
            // Get teacher's batches with student counts
            $batches = Batch::where('teacher_id', $teacher->id)
                ->where('is_active', 1)
                ->withCount('students')
                ->select('id', 'name', 'description')
                ->get()
                ->map(function ($batch) {
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'student_count' => $batch->students_count,
                        'description' => $batch->description ?? '',
                    ];
                });

            return Inertia::render('Teacher/Classes/Create', [
                'batches' => $batches,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Class create form failed', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return Inertia::render('Teacher/Classes/Create', [
                'batches' => [],
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ],
                'flash' => [
                    'error' => 'Unable to load batches. Please try again.'
                ]
            ]);
        }
    }

    /**
     * Store a newly created class
     */
    public function store(Request $request)
    {
        $teacher = Auth::user();
        
        try {
            // Validate request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'batch_id' => 'required|integer|exists:batches,id',
                'scheduled_at' => 'required|date|after:now',
                'duration_minutes' => 'required|integer|min:15|max:480',
                'zoom_link' => 'nullable|url',
                'zoom_password' => 'nullable|string|max:50',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Verify teacher owns the batch
            $batch = Batch::where('id', $validated['batch_id'])
                         ->where('teacher_id', $teacher->id)
                         ->first();
            
            if (!$batch) {
                return back()->withErrors([
                    'batch_id' => 'You do not have permission to create classes for this batch.'
                ])->withInput();
            }

            DB::beginTransaction();

            try {
                // Create the class
                $class = Lesson::create([
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'batch_id' => $validated['batch_id'],
                    'teacher_id' => $teacher->id,
                    'scheduled_at' => Carbon::parse($validated['scheduled_at']),
                    'duration_minutes' => $validated['duration_minutes'],
                    'status' => 'scheduled',
                    'zoom_link' => $validated['zoom_link'] ?? null,
                    'zoom_password' => $validated['zoom_password'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                DB::commit();

                return redirect()->route('teacher.classes.index')
                               ->with('success', 'Class created successfully!');

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
                           
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            Log::error('Class creation failed', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()
                ->with('error', 'Failed to create class. Please try again.')
                ->withInput();
        }
    }

    /**
     * Show the form for editing the specified class
     */
    public function edit($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with(['batch' => function($q) {
                $q->select('id', 'name', 'teacher_id');
            }])->find($id);

            if (!$class) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check teacher permission
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to edit this class.');
            }

            // Don't allow editing completed classes
            if (in_array($class->status, ['completed', 'live'])) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Cannot edit completed or live classes.');
            }

            // Get teacher's batches
            $batches = Batch::where('teacher_id', $teacher->id)
                ->where('is_active', 1)
                ->withCount('students')
                ->select('id', 'name', 'description')
                ->get()
                ->map(function ($batch) {
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'student_count' => $batch->students_count,
                        'description' => $batch->description ?? '',
                    ];
                });

            return Inertia::render('Teacher/Classes/Edit', [
                'classData' => $this->formatClassData($class),
                'batches' => $batches->toArray(),
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value ?? $teacher->role,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Class edit form failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()->route('teacher.classes.index')
                ->with('error', 'Class not found or access denied.');
        }
    }

    /**
     * Update the specified class
     */
    public function update(Request $request, $id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with('batch')->find($id);

            if (!$class) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check teacher permission
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to update this class.');
            }

            // Don't allow updating completed classes
            if (in_array($class->status, ['completed', 'live'])) {
                return back()->with('error', 'Cannot update completed or live classes.');
            }

            // Validate request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'batch_id' => 'required|integer|exists:batches,id',
                'scheduled_at' => 'required|date',
                'duration_minutes' => 'required|integer|min:15|max:480',
                'zoom_link' => 'nullable|url',
                'zoom_password' => 'nullable|string|max:50',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Verify teacher owns the new batch (if changed)
            if ($validated['batch_id'] != $class->batch_id) {
                $batch = Batch::where('id', $validated['batch_id'])
                             ->where('teacher_id', $teacher->id)
                             ->first();
                
                if (!$batch) {
                    return back()->withErrors([
                        'batch_id' => 'You do not have permission to assign classes to this batch.'
                    ])->withInput();
                }
            }

            // Update the class
            $class->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'batch_id' => $validated['batch_id'],
                'scheduled_at' => Carbon::parse($validated['scheduled_at']),
                'duration_minutes' => $validated['duration_minutes'],
                'zoom_link' => $validated['zoom_link'] ?? null,
                'zoom_password' => $validated['zoom_password'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            return redirect()->route('teacher.classes.show', $class->id)
                           ->with('success', 'Class updated successfully!');
                           
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            Log::error('Class update failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return back()
                ->with('error', 'Failed to update class. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified class
     */
    public function destroy($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with('batch')->find($id);

            if (!$class) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check teacher permission
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to delete this class.');
            }

            // Don't allow deleting completed or live classes
            if (in_array($class->status, ['completed', 'live'])) {
                return back()->with('error', 'Cannot delete completed or live classes.');
            }

            DB::beginTransaction();
            
            try {
                // Delete related attendance records first
                $class->attendances()->delete();
                
                // Delete the class
                $class->delete();
                
                DB::commit();

                return redirect()->route('teacher.classes.index')
                               ->with('success', 'Class deleted successfully!');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
                           
        } catch (\Exception $e) {
            Log::error('Class deletion failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->with('error', 'Failed to delete class. Please try again.');
        }
    }

    /**
     * Mark class as completed
     */
    public function complete($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with('batch')->find($id);

            if (!$class) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check teacher permission
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to update this class.');
            }

            if ($class->status === 'completed') {
                return back()->with('error', 'Class is already marked as completed.');
            }

            $class->update(['status' => 'completed']);

            return back()->with('success', 'Class marked as completed!');
            
        } catch (\Exception $e) {
            Log::error('Mark class completed failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->with('error', 'Failed to mark class as completed.');
        }
    }

    /**
     * Cancel class
     */
    public function cancel($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with('batch')->find($id);

            if (!$class) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'Class not found.');
            }

            // Check teacher permission
            if (!$class->batch || $class->batch->teacher_id !== $teacher->id) {
                return redirect()->route('teacher.classes.index')
                    ->with('error', 'You do not have permission to update this class.');
            }

            $class->update(['status' => 'cancelled']);

            return back()->with('success', 'Class cancelled successfully!');
            
        } catch (\Exception $e) {
            Log::error('Class cancellation failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->with('error', 'Failed to cancel class.');
        }
    }

    /**
     * Calculate attendance statistics
     */
    private function calculateAttendanceStats($class, $students)
    {
        $totalStudents = $students->count();
        
        if ($totalStudents === 0) {
            return [
                'total_students' => 0,
                'present_count' => 0,
                'absent_count' => 0,
                'late_count' => 0,
                'attendance_rate' => 0,
            ];
        }

        $attendances = $class->attendances ?? collect();
        
        $presentCount = $attendances->where('status', 'present')->count();
        $absentCount = $attendances->where('status', 'absent')->count();
        $lateCount = $attendances->where('status', 'late')->count();
        
        // Calculate attendance rate (present + late students)
        $attendanceRate = $totalStudents > 0 
            ? round((($presentCount + $lateCount) / $totalStudents) * 100, 1)
            : 0;

        return [
            'total_students' => $totalStudents,
            'present_count' => $presentCount,
            'absent_count' => $absentCount,
            'late_count' => $lateCount,
            'attendance_rate' => $attendanceRate,
        ];
    }

    /**
     * Format class data for frontend
     */
    private function formatClassData($class)
    {
        $now = Carbon::now();
        $scheduledTime = Carbon::parse($class->scheduled_at);
        
        // Check if class can be started (15 minutes before to 30 minutes after)
        $canStart = $scheduledTime->diffInMinutes($now, false) >= -15 
                   && $scheduledTime->diffInMinutes($now, false) <= 30 
                   && $class->status === 'scheduled';

        // Format duration
        $hours = floor($class->duration_minutes / 60);
        $minutes = $class->duration_minutes % 60;
        $formattedDuration = $hours > 0 
            ? ($minutes > 0 ? "{$hours}h {$minutes}m" : "{$hours}h")
            : "{$minutes}m";

        return [
            'id' => $class->id,
            'title' => $class->title,
            'description' => $class->description,
            'scheduled_at' => $class->scheduled_at->toISOString(),
            'duration_minutes' => $class->duration_minutes,
            'formatted_duration' => $formattedDuration,
            'status' => $class->status,
            'zoom_meeting_id' => $class->zoom_meeting_id,
            'zoom_join_url' => $class->zoom_link, // Using your field name
            'zoom_start_url' => $class->zoom_start_url,
            'zoom_password' => $class->zoom_password,
            'recording_url' => $class->recording_url,
            'notes' => $class->notes,
            'max_attendees' => $class->max_attendees,
            'can_start' => $canStart,
            'is_upcoming' => $scheduledTime->isFuture(),
            'is_completed' => $class->status === 'completed',
            'batch' => [
                'id' => $class->batch->id,
                'name' => $class->batch->name,
                'description' => $class->batch->description ?? '',
                'student_count' => $class->batch->students ? $class->batch->students->count() : 0,
            ],
            'teacher' => $class->batch ? [
                'id' => $class->batch->teacher_id,
                'name' => $class->batch->teacher->name ?? 'Unknown',
                'email' => $class->batch->teacher->email ?? '',
            ] : null,
            'created_at' => $class->created_at ? $class->created_at->toISOString() : null,
            'updated_at' => $class->updated_at ? $class->updated_at->toISOString() : null,
        ];
    }
}