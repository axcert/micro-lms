<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\User;
use App\Models\BatchStudent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BatchController extends Controller
{
    /**
     * Display a listing of batches for the authenticated teacher
     */
    public function index(Request $request)
    {
        $teacher = Auth::user();
        
        $query = Batch::where('teacher_id', $teacher->id)
            ->withCount(['students', 'classes', 'quizzes']);

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->status) {
            switch ($request->status) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'starting_soon':
                    $query->where('is_active', true)
                          ->where('start_date', '>', now())
                          ->where('start_date', '<=', now()->addDays(7));
                    break;
            }
        }

        $batches = $query->orderBy('created_at', 'desc')->paginate(10);

        // Add computed properties to each batch
        $batches->getCollection()->transform(function ($batch) {
            $batch->is_full = $batch->max_students && $batch->students_count >= $batch->max_students;
            return $batch;
        });

        // Calculate stats
        $stats = [
            'total_batches' => Batch::where('teacher_id', $teacher->id)->count(),
            'active_batches' => Batch::where('teacher_id', $teacher->id)->where('is_active', true)->count(),
            'total_students' => DB::table('batch_students')
                ->join('batches', 'batch_students.batch_id', '=', 'batches.id')
                ->where('batches.teacher_id', $teacher->id)
                ->count(),
            'total_classes' => $this->getWeeklyClassesCount($teacher->id)
        ];

        return Inertia::render('Teacher/Batches/Index', [
            'batches' => $batches,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
            'flash' => session('flash')
        ]);
    }

    /**
     * Show the form for creating a new batch
     */
    public function create()
    {
        try {
            // Get available students (not assigned to any active batch by this teacher)
            $availableStudents = User::where('role', 'student')
                ->whereNotIn('id', function ($query) {
                    $query->select('student_id')
                          ->from('batch_students')
                          ->join('batches', 'batch_students.batch_id', '=', 'batches.id')
                          ->where('batches.teacher_id', Auth::id())
                          ->where('batches.is_active', true);
                })
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            Log::info('Available students for batch creation', [
                'teacher_id' => Auth::id(),
                'student_count' => $availableStudents->count()
            ]);

            return Inertia::render('Teacher/Batches/Create', [
                'availableStudents' => $availableStudents
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading batch create form', [
                'error' => $e->getMessage(),
                'teacher_id' => Auth::id()
            ]);

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'error',
                               'message' => 'Error loading form. Please try again.'
                           ]);
        }
    }

    /**
     * Store a newly created batch
     */
    public function store(Request $request)
    {
        Log::info('Batch creation attempt', [
            'teacher_id' => Auth::id(),
            'request_data' => $request->all()
        ]);

        // Enhanced validation with better error messages
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:batches,name,NULL,id,teacher_id,' . Auth::id()
            ],
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id'
        ], [
            'name.required' => 'Batch name is required.',
            'name.unique' => 'You already have a batch with this name.',
            'start_date.required' => 'Start date is required.',
            'start_date.after_or_equal' => 'Start date must be today or later.',
            'end_date.after' => 'End date must be after the start date.',
            'max_students.min' => 'Maximum students must be at least 1.',
            'max_students.max' => 'Maximum students cannot exceed 100.',
            'student_ids.*.exists' => 'One or more selected students do not exist.'
        ]);

        try {
            DB::beginTransaction();

            // Validate student count vs max_students
            if (!empty($validated['student_ids']) && !empty($validated['max_students'])) {
                if (count($validated['student_ids']) > $validated['max_students']) {
                    throw new \Exception('Cannot assign ' . count($validated['student_ids']) . ' students when maximum is ' . $validated['max_students']);
                }
            }

            // Better data handling
            $batchData = [
                'name' => trim($validated['name']),
                'description' => trim($validated['description'] ?? ''),
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'teacher_id' => Auth::id(),
            ];

            Log::info('Creating batch with data', $batchData);

            $batch = Batch::create($batchData);

            Log::info('Batch created successfully', [
                'batch_id' => $batch->id,
                'batch_name' => $batch->name
            ]);

            // Assign students if provided
            if (!empty($validated['student_ids'])) {
                $this->assignStudentsToBatch($batch, $validated['student_ids']);
                
                Log::info('Students assigned to batch', [
                    'batch_id' => $batch->id,
                    'student_count' => count($validated['student_ids'])
                ]);
            }

            DB::commit();

            Log::info('Batch creation transaction completed successfully', [
                'batch_id' => $batch->id
            ]);

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch "' . $batch->name . '" created successfully with ' . count($validated['student_ids'] ?? []) . ' students!'
                           ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error during batch creation', [
                'errors' => $e->errors(),
                'teacher_id' => Auth::id()
            ]);
            throw $e;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error creating batch', [
                'error' => $e->getMessage(),
                'teacher_id' => Auth::id(),
                'stack_trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to create batch: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified batch - ENHANCED for Show.tsx
     */
    public function show(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            // Load batch with relationships
            $batch->load([
                'students:id,name,email',
                'teacher:id,name'
            ]);

            // Get recent classes for this batch with better data structure
            $recentClasses = DB::table('classes')
                ->where('batch_id', $batch->id)
                ->orderBy('scheduled_at', 'desc')
                ->limit(5)
                ->select([
                    'id',
                    'title',
                    'scheduled_at',
                    'zoom_link',
                    'status'
                ])
                ->get()
                ->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'title' => $class->title ?? 'Untitled Class',
                        'scheduled_at' => $class->scheduled_at,
                        'zoom_link' => $class->zoom_link,
                        'status' => $class->status ?? 'scheduled'
                    ];
                });

            // Get recent quizzes for this batch with better data structure
            $recentQuizzes = DB::table('quizzes')
                ->where('batch_id', $batch->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->select([
                    'id',
                    'title',
                    'created_at',
                    'status',
                    'total_marks'
                ])
                ->get()
                ->map(function ($quiz) {
                    // Get questions count and attempts count for this quiz
                    $questionsCount = DB::table('questions')->where('quiz_id', $quiz->id)->count();
                    $attemptsCount = DB::table('quiz_attempts')->where('quiz_id', $quiz->id)->count();
                    
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title ?? 'Untitled Quiz',
                        'questions_count' => $questionsCount,
                        'attempts_count' => $attemptsCount,
                        'created_at' => $quiz->created_at,
                        'status' => $quiz->status ?? 'draft'
                    ];
                });

            // Add enrollment dates to students from pivot table
            $batch->students->each(function ($student) use ($batch) {
                $pivotData = DB::table('batch_students')
                    ->where('batch_id', $batch->id)
                    ->where('student_id', $student->id)
                    ->first();
                
                if ($pivotData) {
                    $student->enrolled_at = $pivotData->created_at;
                }
            });

            // Calculate comprehensive stats
            $stats = [
                'students_count' => $batch->students->count(),
                'classes_count' => DB::table('classes')->where('batch_id', $batch->id)->count(),
                'quizzes_count' => DB::table('quizzes')->where('batch_id', $batch->id)->count(),
            ];

            Log::info('Batch show page loaded', [
                'batch_id' => $batch->id,
                'stats' => $stats,
                'recent_classes_count' => $recentClasses->count(),
                'recent_quizzes_count' => $recentQuizzes->count()
            ]);

            return Inertia::render('Teacher/Batches/Show', [
                'batch' => $batch,
                'recentClasses' => $recentClasses,
                'recentQuizzes' => $recentQuizzes,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading batch show page', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'error',
                               'message' => 'Error loading batch details. Please try again.'
                           ]);
        }
    }

    /**
     * Show the form for editing the specified batch
     */
    public function edit(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            // Load batch with students
            $batch->load('students:id,name,email');

            // Get all available students (not just unassigned ones for edit)
            $availableStudents = User::where('role', 'student')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            // Get current student IDs for easy access
            $currentStudentIds = $batch->students->pluck('id')->toArray();

            Log::info('Batch edit page loaded', [
                'batch_id' => $batch->id,
                'current_students_count' => count($currentStudentIds),
                'available_students_count' => $availableStudents->count()
            ]);

            return Inertia::render('Teacher/Batches/Edit', [
                'batch' => $batch,
                'availableStudents' => $availableStudents,
                'currentStudentIds' => $currentStudentIds
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading batch edit page', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'error',
                               'message' => 'Error loading batch edit page. Please try again.'
                           ]);
        }
    }

    /**
     * Update the specified batch - ENHANCED for Edit.tsx
     */
    public function update(Request $request, Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        Log::info('Batch update attempt', [
            'batch_id' => $batch->id,
            'teacher_id' => Auth::id(),
            'request_data' => $request->all()
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:batches,name,' . $batch->id . ',id,teacher_id,' . Auth::id(),
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id'
        ], [
            'name.required' => 'Batch name is required.',
            'name.unique' => 'You already have a batch with this name.',
            'start_date.required' => 'Start date is required.',
            'end_date.after' => 'End date must be after the start date.',
            'max_students.min' => 'Maximum students must be at least 1.',
            'max_students.max' => 'Maximum students cannot exceed 100.',
            'student_ids.*.exists' => 'One or more selected students do not exist.'
        ]);

        try {
            DB::beginTransaction();

            // Validate student count vs max_students
            if (!empty($validated['student_ids']) && !empty($validated['max_students'])) {
                if (count($validated['student_ids']) > $validated['max_students']) {
                    throw new \Exception('Cannot assign ' . count($validated['student_ids']) . ' students when maximum is ' . $validated['max_students']);
                }
            }

            $batch->update([
                'name' => trim($validated['name']),
                'description' => trim($validated['description'] ?? ''),
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'is_active' => $validated['is_active'] ?? $batch->is_active,
            ]);

            // Update student assignments
            if (array_key_exists('student_ids', $validated)) {
                $this->updateBatchStudents($batch, $validated['student_ids'] ?? []);
            }

            DB::commit();

            Log::info('Batch updated successfully', [
                'batch_id' => $batch->id,
                'student_count' => count($validated['student_ids'] ?? [])
            ]);

            // Redirect to show page instead of index for better UX
            return redirect()->route('teacher.batches.show', $batch)
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch "' . $batch->name . '" updated successfully!'
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error updating batch', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to update batch: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified batch
     */
    public function destroy(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            DB::beginTransaction();

            // Check for dependencies before deletion
            $classCount = DB::table('classes')->where('batch_id', $batch->id)->count();
            $quizCount = DB::table('quizzes')->where('batch_id', $batch->id)->count();

            if ($classCount > 0 || $quizCount > 0) {
                return back()->withErrors([
                    'error' => "Cannot delete batch with existing classes ({$classCount}) or quizzes ({$quizCount}). Please remove them first."
                ]);
            }

            $batchName = $batch->name;

            // Remove student assignments
            DB::table('batch_students')->where('batch_id', $batch->id)->delete();
            
            // Delete the batch
            $batch->delete();

            DB::commit();

            Log::info('Batch deleted successfully', [
                'batch_id' => $batch->id,
                'batch_name' => $batchName
            ]);

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => "Batch \"{$batchName}\" deleted successfully!"
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error deleting batch', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to delete batch: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Remove a student from a batch - NEW method for Show.tsx
     */
    public function removeStudent(Batch $batch, User $student)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        // Check if student is actually in this batch
        if (!DB::table('batch_students')->where('batch_id', $batch->id)->where('student_id', $student->id)->exists()) {
            return back()->withErrors([
                'error' => 'Student is not enrolled in this batch.'
            ]);
        }

        try {
            DB::table('batch_students')
                ->where('batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->delete();

            Log::info('Student removed from batch', [
                'batch_id' => $batch->id,
                'student_id' => $student->id,
                'student_name' => $student->name
            ]);

            return back()->with('flash', [
                'type' => 'success',
                'message' => $student->name . ' has been removed from the batch successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Error removing student from batch', [
                'batch_id' => $batch->id,
                'student_id' => $student->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'error' => 'Failed to remove student. Please try again.'
            ]);
        }
    }

    /**
     * Export batch data - NEW method for Index.tsx export button
     */
    public function export(Request $request)
    {
        $teacher = Auth::user();
        
        try {
            $query = Batch::where('teacher_id', $teacher->id)
                ->with(['students:id,name,email']);

            // Apply same filters as index page
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            if ($request->status) {
                switch ($request->status) {
                    case 'active':
                        $query->where('is_active', true);
                        break;
                    case 'inactive':
                        $query->where('is_active', false);
                        break;
                    case 'starting_soon':
                        $query->where('is_active', true)
                              ->where('start_date', '>', now())
                              ->where('start_date', '<=', now()->addDays(7));
                        break;
                }
            }

            $batches = $query->get();

            // Create CSV content
            $csvContent = "Batch Name,Description,Start Date,End Date,Status,Max Students,Current Students,Student Names\n";
            
            foreach ($batches as $batch) {
                $studentNames = $batch->students->pluck('name')->join('; ');
                $csvContent .= sprintf(
                    "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%d\",\"%s\"\n",
                    $batch->name,
                    $batch->description ?? '',
                    $batch->start_date,
                    $batch->end_date ?? '',
                    $batch->is_active ? 'Active' : 'Inactive',
                    $batch->max_students ?? 'Unlimited',
                    $batch->students->count(),
                    $studentNames
                );
            }

            $fileName = 'batches_export_' . now()->format('Y_m_d_His') . '.csv';

            Log::info('Batch data exported', [
                'teacher_id' => $teacher->id,
                'batch_count' => $batches->count(),
                'filename' => $fileName
            ]);

            return response($csvContent)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');

        } catch (\Exception $e) {
            Log::error('Error exporting batches', [
                'teacher_id' => $teacher->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'error' => 'Failed to export data. Please try again.'
            ]);
        }
    }

    /**
     * Assign students to a batch - ENHANCED for better frontend support
     */
    public function assignStudents(Request $request, Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id'
        ]);

        try {
            // Check max students limit
            if ($batch->max_students && count($validated['student_ids']) > $batch->max_students) {
                return back()->withErrors([
                    'error' => "Cannot assign " . count($validated['student_ids']) . " students. Maximum limit is {$batch->max_students}."
                ]);
            }

            $this->assignStudentsToBatch($batch, $validated['student_ids']);

            Log::info('Students assigned to batch via assign endpoint', [
                'batch_id' => $batch->id,
                'student_count' => count($validated['student_ids'])
            ]);

            return back()->with('flash', [
                'type' => 'success',
                'message' => count($validated['student_ids']) . ' students assigned successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Error in assignStudents endpoint', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'error' => 'Failed to assign students. Please try again.'
            ]);
        }
    }

    /**
     * Toggle batch status (active/inactive) - USEFUL for quick actions
     */
    public function toggleStatus(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            $batch->update([
                'is_active' => !$batch->is_active
            ]);

            $status = $batch->is_active ? 'activated' : 'deactivated';

            Log::info('Batch status toggled', [
                'batch_id' => $batch->id,
                'new_status' => $batch->is_active
            ]);

            return back()->with('flash', [
                'type' => 'success',
                'message' => "Batch \"{$batch->name}\" has been {$status} successfully!"
            ]);

        } catch (\Exception $e) {
            Log::error('Error toggling batch status', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'error' => 'Failed to update batch status. Please try again.'
            ]);
        }
    }

    /**
     * Duplicate a batch - USEFUL feature for teachers
     */
    public function duplicate(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            DB::beginTransaction();

            // Create a copy of the batch
            $newBatch = $batch->replicate();
            $newBatch->name = $batch->name . ' (Copy)';
            $newBatch->start_date = now()->addWeek(); // Start next week
            $newBatch->end_date = $batch->end_date ? now()->addWeek()->addMonths(3) : null;
            $newBatch->created_at = now();
            $newBatch->updated_at = now();
            $newBatch->save();

            // Copy student assignments
            $students = DB::table('batch_students')->where('batch_id', $batch->id)->get();
            foreach ($students as $student) {
                DB::table('batch_students')->insert([
                    'batch_id' => $newBatch->id,
                    'student_id' => $student->student_id,
                    'enrolled_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            Log::info('Batch duplicated successfully', [
                'original_batch_id' => $batch->id,
                'new_batch_id' => $newBatch->id,
                'student_count' => $students->count()
            ]);

            return redirect()->route('teacher.batches.edit', $newBatch)
                           ->with('flash', [
                               'type' => 'success',
                               'message' => "Batch duplicated successfully! You can now edit \"{$newBatch->name}\"."
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error duplicating batch', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to duplicate batch. Please try again.'
            ]);
        }
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Better student assignment with error handling
     */
    private function assignStudentsToBatch(Batch $batch, array $studentIds)
    {
        try {
            foreach ($studentIds as $studentId) {
                // Check if student exists and has correct role
                $student = User::where('id', $studentId)
                             ->where('role', 'student')
                             ->first();

                if (!$student) {
                    Log::warning('Skipping invalid student assignment', [
                        'student_id' => $studentId,
                        'batch_id' => $batch->id
                    ]);
                    continue;
                }

                // Use updateOrInsert to prevent duplicates
                DB::table('batch_students')->updateOrInsert(
                    [
                        'batch_id' => $batch->id,
                        'student_id' => $studentId,
                    ],
                    [
                        'enrolled_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            Log::info('Students assigned to batch successfully', [
                'batch_id' => $batch->id,
                'student_ids' => $studentIds
            ]);

        } catch (\Exception $e) {
            Log::error('Error assigning students to batch', [
                'batch_id' => $batch->id,
                'student_ids' => $studentIds,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Update batch student assignments
     */
    private function updateBatchStudents(Batch $batch, array $studentIds)
    {
        try {
            // Remove current assignments
            DB::table('batch_students')->where('batch_id', $batch->id)->delete();
            
            // Add new assignments
            if (!empty($studentIds)) {
                $this->assignStudentsToBatch($batch, $studentIds);
            }

            Log::info('Batch students updated successfully', [
                'batch_id' => $batch->id,
                'new_student_count' => count($studentIds)
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating batch students', [
                'batch_id' => $batch->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get count of classes for current week
     */
    private function getWeeklyClassesCount($teacherId)
    {
        try {
            return DB::table('classes')
                ->join('batches', 'classes.batch_id', '=', 'batches.id')
                ->where('batches.teacher_id', $teacherId)
                ->whereDate('classes.scheduled_at', '>=', now()->startOfWeek())
                ->whereDate('classes.scheduled_at', '<=', now()->endOfWeek())
                ->count();
        } catch (\Exception $e) {
            Log::error('Error getting weekly classes count', [
                'teacher_id' => $teacherId,
                'error' => $e->getMessage()
            ]);
            return 0; // Fallback
        }
    }
}