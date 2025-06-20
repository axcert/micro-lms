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
    public function index()
    {
        $teacher = Auth::user();
        
        try {
            $classes = Lesson::with(['batch:id,name,teacher_id'])
                ->whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->orderBy('scheduled_at', 'desc')
                ->paginate(15);

            // Calculate basic stats
            $stats = [
                'total_classes' => Lesson::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })->count(),
                'upcoming_classes' => Lesson::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })->where('scheduled_at', '>', now())->count(),
                'completed_classes' => Lesson::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })->where('status', 'completed')->count(),
                'classes_today' => Lesson::whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })->whereDate('scheduled_at', today())->count(),
            ];

            return Inertia::render('Teacher/Classes/Index', [
                'classes' => $classes,
                'stats' => $stats,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Classes index failed', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
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
                        'role' => $teacher->role->value,
                    ]
                ]
            ]);
        }
    }

    /**
     * Show the form for creating a new class
     */
    public function create()
    {
        $teacher = Auth::user();
        
        try {
            // Get teacher's batches with student counts - optimized query
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
                        'role' => $teacher->role->value,
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
                        'role' => $teacher->role->value,
                    ]
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
                'notes' => 'nullable|string|max:1000',
                'create_attendance' => 'boolean'
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

            // Use DB transaction for data consistency
            DB::beginTransaction();

            try {
                // Create the class using Eloquent model
                $class = new Lesson();
                $class->title = $validated['title'];
                $class->description = $validated['description'];
                $class->batch_id = $validated['batch_id'];
                $class->scheduled_at = Carbon::parse($validated['scheduled_at']);
                $class->duration_minutes = $validated['duration_minutes'];
                $class->status = 'scheduled';
                
                // Add optional fields if they exist
                if (Schema::hasColumn('classes', 'teacher_id')) {
                    $class->teacher_id = $teacher->id;
                }
                if (isset($validated['zoom_link']) && Schema::hasColumn('classes', 'zoom_link')) {
                    $class->zoom_link = $validated['zoom_link'];
                }
                if (isset($validated['notes']) && Schema::hasColumn('classes', 'notes')) {
                    $class->notes = $validated['notes'];
                }
                
                $class->save();

                // Create attendance records if requested
                if ($request->boolean('create_attendance')) {
                    $students = $batch->students()->pluck('user_id');
                    
                    $attendanceRecords = $students->map(function ($studentId) use ($class) {
                        return [
                            'class_id' => $class->id,
                            'user_id' => $studentId,
                            'status' => 'absent',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    })->toArray();

                    if (!empty($attendanceRecords)) {
                        Attendance::insert($attendanceRecords);
                    }
                }

                DB::commit();

                return redirect()->route('teacher.classes.index')
                               ->with('success', 'Class scheduled successfully!');

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
                ->withErrors(['general' => 'Failed to create class. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Display the specified class
     */
    public function show($id)
    {
        $teacher = Auth::user();
        
        try {
            // Optimized query to get class with all related data
            $class = Lesson::with([
                'batch:id,name,teacher_id,description',
                'attendances.user:id,name,email'
            ])
            ->whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->findOrFail($id);

            // Get students in this batch with better query
            $students = $class->batch->students()
                ->select('users.id', 'users.name', 'users.email')
                ->get();

            // Calculate attendance stats
            $attendanceStats = [
                'total_students' => $students->count(),
                'present_count' => $class->attendances->where('status', 'present')->count(),
                'absent_count' => $class->attendances->where('status', 'absent')->count(),
                'late_count' => $class->attendances->where('status', 'late')->count(),
            ];
            $attendanceStats['attendance_rate'] = $attendanceStats['total_students'] > 0 
                ? round(($attendanceStats['present_count'] / $attendanceStats['total_students']) * 100, 1)
                : 0;

            // Add formatted fields
            $class->formatted_duration = $this->formatDuration($class->duration_minutes);
            $class->can_start = $this->canStartClass($class);
            $class->is_upcoming = $class->scheduled_at > now();
            $class->is_completed = $class->status === 'completed';

            return Inertia::render('Teacher/Classes/Show', [
                'classData' => $class->toArray(), // Use 'classData' consistently
                'students' => $students->toArray(),
                'attendanceStats' => $attendanceStats,
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value,
                    ]
                ]
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->route('teacher.classes.index')
                ->withErrors(['general' => 'Class not found.']);
                
        } catch (\Exception $e) {
            Log::error('Class show failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('teacher.classes.index')
                ->withErrors(['general' => 'Unable to load class details. Please try again.']);
        }
    }

    /**
     * Show the form for editing the specified class
     */
    public function edit($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::with('batch:id,name,teacher_id')
                ->whereHas('batch', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->findOrFail($id);

            // Don't allow editing completed or ongoing classes
            if (in_array($class->status, ['completed', 'ongoing'])) {
                return redirect()->route('teacher.classes.index')
                    ->withErrors(['general' => 'Cannot edit completed or ongoing classes.']);
            }

            // Get teacher's batches with optimized query
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
                'classData' => $class->toArray(),
                'batches' => $batches->toArray(),
                'auth' => [
                    'user' => [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'role' => $teacher->role->value,
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
                ->withErrors(['general' => 'Class not found or access denied.']);
        }
    }

    /**
     * Update the specified class
     */
    public function update(Request $request, $id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->findOrFail($id);

            // Don't allow updating completed or ongoing classes
            if (in_array($class->status, ['completed', 'ongoing'])) {
                return back()->withErrors([
                    'general' => 'Cannot update completed or ongoing classes.'
                ]);
            }

            // Validate request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'batch_id' => 'required|integer|exists:batches,id',
                'scheduled_at' => 'required|date|after:now',
                'duration_minutes' => 'required|integer|min:15|max:480',
                'zoom_link' => 'nullable|url',
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

            // Update using Eloquent model
            $class->title = $validated['title'];
            $class->description = $validated['description'];
            $class->batch_id = $validated['batch_id'];
            $class->scheduled_at = Carbon::parse($validated['scheduled_at']);
            $class->duration_minutes = $validated['duration_minutes'];

            if (isset($validated['zoom_link']) && Schema::hasColumn('classes', 'zoom_link')) {
                $class->zoom_link = $validated['zoom_link'];
            }

            if (isset($validated['notes']) && Schema::hasColumn('classes', 'notes')) {
                $class->notes = $validated['notes'];
            }

            $class->save();

            return redirect()->route('teacher.classes.index')
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
                ->withErrors(['general' => 'Failed to update class. Please try again.'])
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
            $class = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->findOrFail($id);

            // Don't allow deleting completed or ongoing classes
            if (in_array($class->status, ['completed', 'ongoing'])) {
                return back()->withErrors([
                    'general' => 'Cannot delete completed or ongoing classes.'
                ]);
            }

            // Use DB transaction for consistency
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
            
            return back()->withErrors([
                'general' => 'Failed to delete class. Please try again.'
            ]);
        }
    }

    /**
     * Mark class as completed
     */
    public function markCompleted($id)
    {
        $teacher = Auth::user();
        
        try {
            $class = Lesson::whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->findOrFail($id);

            if ($class->status === 'completed') {
                return back()->withErrors([
                    'general' => 'Class is already marked as completed.'
                ]);
            }

            $class->status = 'completed';
            $class->save();

            return back()->with('success', 'Class marked as completed!');
            
        } catch (\Exception $e) {
            Log::error('Mark class completed failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors([
                'general' => 'Failed to mark class as completed.'
            ]);
        }
    }

    /**
     * Helper method to format duration
     */
    private function formatDuration($minutes)
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        
        if ($hours > 0) {
            return $hours . 'h ' . $mins . 'm';
        }
        
        return $mins . ' minutes';
    }

    /**
     * Helper method to determine if class can be started
     */
    private function canStartClass($class)
    {
        $now = now();
        $scheduledTime = Carbon::parse($class->scheduled_at);
        
        // Can start 15 minutes before scheduled time
        return $class->status === 'scheduled' 
            && $now >= $scheduledTime->subMinutes(15)
            && $class->zoom_start_url;
    }
}