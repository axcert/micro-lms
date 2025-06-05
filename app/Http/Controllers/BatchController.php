<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\User;
use App\Models\BatchStudent;
use App\Http\Requests\Teacher\CreateBatchRequest;
use App\Http\Requests\Teacher\UpdateBatchRequest;
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
            ->withCount(['students'])
            ->with(['students:id,name,email']);

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

        // Calculate stats
        $stats = [
            'total_batches' => Batch::where('teacher_id', $teacher->id)->count(),
            'active_batches' => Batch::where('teacher_id', $teacher->id)->where('is_active', true)->count(),
            'total_students' => BatchStudent::whereHas('batch', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            })->count(),
            'total_classes' => 0 // Temporary: Set to 0 until class model is ready
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
        // Get available students (not assigned to any batch by this teacher)
        $availableStudents = User::where('role', 'student')
            ->whereNotIn('id', function ($query) {
                $query->select('student_id')
                      ->from('batch_students')
                      ->whereIn('batch_id', function ($subQuery) {
                          $subQuery->select('id')
                                   ->from('batches')
                                   ->where('teacher_id', Auth::id());
                      });
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
    public function store(CreateBatchRequest $request)
    {
        try {
            DB::beginTransaction();

            $batch = Batch::create([
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'max_students' => $request->max_students,
                'is_active' => $request->is_active ?? true,
                'teacher_id' => Auth::id(),
            ]);

            // Assign students if provided
            if ($request->student_ids && is_array($request->student_ids)) {
                foreach ($request->student_ids as $studentId) {
                    BatchStudent::create([
                        'batch_id' => $batch->id,
                        'student_id' => $studentId,
                        'enrolled_at' => now(),
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch created successfully!'
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
        $this->authorize('view', $batch);

        $batch->load([
            'students:id,name,email',
            'teacher:id,name'
        ]);

        // Add pivot data for students
        $batch->students->each(function ($student) use ($batch) {
            $pivotData = BatchStudent::where('batch_id', $batch->id)
                                   ->where('student_id', $student->id)
                                   ->first(['enrolled_at']);
            $student->pivot_data = $pivotData;
        });

        return Inertia::render('Teacher/Batches/Show', [
            'batch' => $batch,
            'stats' => [
                'students_count' => $batch->students->count(),
                'classes_count' => 0, // Temporary: Set to 0 until class model is ready
                'quizzes_count' => 0, // Temporary: Set to 0 until quiz model is ready
                'active_quizzes_count' => 0,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified batch
     */
    public function edit(Batch $batch)
    {
        $this->authorize('update', $batch);

        $batch->load('students:id,name,email');

        // Get all available students (including currently assigned ones)
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
    public function update(UpdateBatchRequest $request, Batch $batch)
    {
        $this->authorize('update', $batch);

        try {
            DB::beginTransaction();

            $batch->update([
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'max_students' => $request->max_students,
                'is_active' => $request->is_active ?? $batch->is_active,
            ]);

            // Update student assignments
            if ($request->has('student_ids')) {
                // Remove current assignments
                BatchStudent::where('batch_id', $batch->id)->delete();
                
                // Add new assignments
                if (is_array($request->student_ids)) {
                    foreach ($request->student_ids as $studentId) {
                        BatchStudent::create([
                            'batch_id' => $batch->id,
                            'student_id' => $studentId,
                            'enrolled_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('teacher.batches.index')
                           ->with('flash', [
                               'type' => 'success',
                               'message' => 'Batch updated successfully!'
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
        $this->authorize('delete', $batch);

        try {
            DB::beginTransaction();

            // For now, just check if batch has students
            if ($batch->students()->count() > 0) {
                return back()->withErrors([
                    'error' => 'Cannot delete batch with assigned students. Please remove them first.'
                ]);
            }

            // Remove student assignments
            BatchStudent::where('batch_id', $batch->id)->delete();
            
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
        $this->authorize('update', $batch);

        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id'
        ]);

        try {
            foreach ($request->student_ids as $studentId) {
                BatchStudent::firstOrCreate([
                    'batch_id' => $batch->id,
                    'student_id' => $studentId,
                ], [
                    'enrolled_at' => now(),
                ]);
            }

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
        $this->authorize('update', $batch);

        try {
            BatchStudent::where('batch_id', $batch->id)
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
        $this->authorize('update', $batch);

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
        $this->authorize('view', $batch);

        try {
            DB::beginTransaction();

            $newBatch = $batch->replicate();
            $newBatch->name = $batch->name . ' (Copy)';
            $newBatch->created_at = now();
            $newBatch->updated_at = now();
            $newBatch->save();

            // Copy student assignments
            $students = BatchStudent::where('batch_id', $batch->id)->get();
            foreach ($students as $student) {
                BatchStudent::create([
                    'batch_id' => $newBatch->id,
                    'student_id' => $student->student_id,
                    'enrolled_at' => now(),
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
}