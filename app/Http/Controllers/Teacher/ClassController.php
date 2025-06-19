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
            // Get teacher's batches with student counts
            $batches = DB::table('batches')
                ->where('teacher_id', $teacher->id)
                ->where('is_active', 1)
                ->get()
                ->map(function ($batch) {
                    // Get student count from batch_students table
                    $studentCount = DB::table('batch_students')
                        ->where('batch_id', $batch->id)
                        ->count();
                    
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'student_count' => $studentCount,
                        'description' => $batch->description ?? '',
                        'students' => []
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

            // Prepare class data
            $classData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'batch_id' => $validated['batch_id'],
                'scheduled_at' => Carbon::parse($validated['scheduled_at']),
                'duration_minutes' => $validated['duration_minutes'],
                'status' => 'scheduled',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Add optional fields if they exist in the table
            if (Schema::hasColumn('classes', 'teacher_id')) {
                $classData['teacher_id'] = $teacher->id;
            }

            if (isset($validated['zoom_link']) && Schema::hasColumn('classes', 'zoom_link')) {
                $classData['zoom_link'] = $validated['zoom_link'];
            }

            if (isset($validated['notes']) && Schema::hasColumn('classes', 'notes')) {
                $classData['notes'] = $validated['notes'];
            }

            // Create the class
            $classId = DB::table('classes')->insertGetId($classData);

            // Create attendance records if requested
            if ($request->boolean('create_attendance')) {
                $students = DB::table('batch_students')
                    ->where('batch_id', $validated['batch_id'])
                    ->get();

                $attendanceRecords = [];
                foreach ($students as $student) {
                    $attendanceRecords[] = [
                        'class_id' => $classId,
                        'user_id' => $student->user_id,
                        'status' => 'absent',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($attendanceRecords)) {
                    DB::table('attendance')->insert($attendanceRecords);
                }
            }

            return redirect()->route('teacher.classes.index')
                           ->with('success', 'Class scheduled successfully!');
                           
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            Log::error('Class creation failed', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
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
            $class = Lesson::with([
                'batch:id,name,teacher_id',
                'attendance.user:id,name,email'
            ])
            ->whereHas('batch', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->findOrFail($id);

            // Get students in this batch
            $students = DB::table('batch_students')
                ->join('users', 'batch_students.user_id', '=', 'users.id')
                ->where('batch_students.batch_id', $class->batch_id)
                ->select('users.id', 'users.name', 'users.email')
                ->get();

            return Inertia::render('Teacher/Classes/Show', [
                'class' => $class,
                'students' => $students,
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
            Log::error('Class show failed', [
                'class_id' => $id,
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()->route('teacher.classes.index')
                ->withErrors(['general' => 'Class not found or access denied.']);
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

            // Get teacher's batches
            $batches = DB::table('batches')
                ->where('teacher_id', $teacher->id)
                ->where('is_active', 1)
                ->get()
                ->map(function ($batch) {
                    $studentCount = DB::table('batch_students')
                        ->where('batch_id', $batch->id)
                        ->count();
                    
                    return [
                        'id' => $batch->id,
                        'name' => $batch->name,
                        'student_count' => $studentCount,
                        'description' => $batch->description ?? '',
                    ];
                });

            return Inertia::render('Teacher/Classes/Edit', [
                'class' => $class,
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

            // Update the class
            $updateData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'batch_id' => $validated['batch_id'],
                'scheduled_at' => Carbon::parse($validated['scheduled_at']),
                'duration_minutes' => $validated['duration_minutes'],
                'updated_at' => now(),
            ];

            if (isset($validated['zoom_link']) && Schema::hasColumn('classes', 'zoom_link')) {
                $updateData['zoom_link'] = $validated['zoom_link'];
            }

            if (isset($validated['notes']) && Schema::hasColumn('classes', 'notes')) {
                $updateData['notes'] = $validated['notes'];
            }

            DB::table('classes')->where('id', $id)->update($updateData);

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

            // Delete related attendance records first
            DB::table('attendance')->where('class_id', $id)->delete();
            
            // Delete the class
            DB::table('classes')->where('id', $id)->delete();

            return redirect()->route('teacher.classes.index')
                           ->with('success', 'Class deleted successfully!');
                           
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

            DB::table('classes')
                ->where('id', $id)
                ->update([
                    'status' => 'completed',
                    'updated_at' => now()
                ]);

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
}