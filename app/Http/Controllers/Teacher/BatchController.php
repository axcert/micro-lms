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
        // Get available students (students not assigned to any active batch by this teacher)
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

        return Inertia::render('Teacher/Batches/Create', [
            'availableStudents' => $availableStudents
        ]);
    }

    /**
     * Store a newly created batch
     */
    public function store(Request $request)
    {
        // Basic validation (you can create a Form Request class later)
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:batches,name,NULL,id,teacher_id,' . Auth::id(),
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id'
        ]);

        try {
            DB::beginTransaction();

            $batch = Batch::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'teacher_id' => Auth::id(),
            ]);

            // Assign students if provided
            if (!empty($validated['student_ids'])) {
                $this->assignStudentsToBatch($batch, $validated['student_ids']);
            }

            DB::commit();

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch "' . $batch->name . '" created successfully!'
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Failed to create batch. Please try again.'
            ])->withInput();
        }
    }

    /**
     * Display the specified batch
     */
    public function show(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        $batch->load([
            'students:id,name,email',
            'teacher:id,name'
        ]);

        // Get recent classes and quizzes (you'll need to adjust these based on your models)
        $recentClasses = []; // Replace with actual query when you have classes model
        $recentQuizzes = []; // Replace with actual query when you have quizzes model

        // Add enrollment dates to students
        $batch->students->each(function ($student) use ($batch) {
            $pivotData = DB::table('batch_students')
                ->where('batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->first();
            $student->enrolled_at = $pivotData ? $pivotData->created_at : null;
        });

        return Inertia::render('Teacher/Batches/Show', [
            'batch' => $batch,
            'recentClasses' => $recentClasses,
            'recentQuizzes' => $recentQuizzes,
            'stats' => [
                'students_count' => $batch->students->count(),
                'classes_count' => 0, // Update when you have classes
                'quizzes_count' => 0,  // Update when you have quizzes
            ]
        ]);
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

        $batch->load('students:id,name,email');

        // Get all available students
        $availableStudents = User::where('role', 'student')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Teacher/Batches/Edit', [
            'batch' => $batch,
            'availableStudents' => $availableStudents,
            'currentStudentIds' => $batch->students->pluck('id')->toArray()
        ]);
    }

    /**
     * Update the specified batch
     */
    public function update(Request $request, Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:batches,name,' . $batch->id . ',id,teacher_id,' . Auth::id(),
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'max_students' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id'
        ]);

        try {
            DB::beginTransaction();

            $batch->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
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

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch "' . $batch->name . '" updated successfully!'
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Failed to update batch. Please try again.'
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

            // Check if batch has any classes or quizzes (uncomment when you have these models)
            // if ($batch->classes()->count() > 0 || $batch->quizzes()->count() > 0) {
            //     return back()->withErrors([
            //         'error' => 'Cannot delete batch with existing classes or quizzes. Please remove them first.'
            //     ]);
            // }

            // Remove student assignments
            DB::table('batch_students')->where('batch_id', $batch->id)->delete();
            
            // Delete the batch
            $batch->delete();

            DB::commit();

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch deleted successfully!'
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Failed to delete batch. Please try again.'
            ]);
        }
    }

    /**
     * Assign students to a batch
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
            $this->assignStudentsToBatch($batch, $validated['student_ids']);

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Students assigned successfully!'
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to assign students. Please try again.'
            ]);
        }
    }

    /**
     * Remove a student from a batch
     */
    public function removeStudent(Batch $batch, User $student)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            DB::table('batch_students')
                ->where('batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->delete();

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Student removed from batch successfully!'
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to remove student. Please try again.'
            ]);
        }
    }

    /**
     * Toggle batch status (active/inactive)
     */
    public function toggleStatus(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        $batch->update([
            'is_active' => !$batch->is_active
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Batch status updated successfully!'
        ]);
    }

    /**
     * Duplicate a batch
     */
    public function duplicate(Batch $batch)
    {
        // Check if teacher owns this batch
        if ($batch->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized access to batch.');
        }

        try {
            DB::beginTransaction();

            $newBatch = $batch->replicate();
            $newBatch->name = $batch->name . ' (Copy)';
            $newBatch->created_at = now();
            $newBatch->updated_at = now();
            $newBatch->save();

            // Copy student assignments
            $students = DB::table('batch_students')->where('batch_id', $batch->id)->get();
            foreach ($students as $student) {
                DB::table('batch_students')->insert([
                    'batch_id' => $newBatch->id,
                    'student_id' => $student->student_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return redirect()->route('teacher.batches.edit', $newBatch)
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch duplicated successfully!'
                           ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Failed to duplicate batch. Please try again.'
            ]);
        }
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Assign students to a batch
     */
    private function assignStudentsToBatch(Batch $batch, array $studentIds)
    {
        foreach ($studentIds as $studentId) {
            DB::table('batch_students')->updateOrInsert(
                [
                    'batch_id' => $batch->id,
                    'student_id' => $studentId,
                ],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    /**
     * Update batch student assignments
     */
    private function updateBatchStudents(Batch $batch, array $studentIds)
    {
        // Remove current assignments
        DB::table('batch_students')->where('batch_id', $batch->id)->delete();
        
        // Add new assignments
        if (!empty($studentIds)) {
            $this->assignStudentsToBatch($batch, $studentIds);
        }
    }

    /**
     * Get count of classes for current week
     */
    private function getWeeklyClassesCount($teacherId)
    {
        // This is a placeholder - implement when you have classes model
        // return DB::table('classes')
        //     ->join('batches', 'classes.batch_id', '=', 'batches.id')
        //     ->where('batches.teacher_id', $teacherId)
        //     ->whereDate('classes.scheduled_at', '>=', now()->startOfWeek())
        //     ->whereDate('classes.scheduled_at', '<=', now()->endOfWeek())
        //     ->count();
        
        return 0; // Placeholder
    }
}