<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // For now, return sample data. You can connect to database later.
        return Inertia::render('Teacher/Classes/Index', [
            'classes' => $this->getSampleClasses()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get sample batches (replace with real data from your batches table)
        $batches = collect([
            ['id' => 1, 'name' => 'Mathematics Grade 10', 'students_count' => 25],
            ['id' => 2, 'name' => 'Physics Grade 11', 'students_count' => 30],
            ['id' => 3, 'name' => 'Chemistry Grade 12', 'students_count' => 22],
            ['id' => 4, 'name' => 'Biology Advanced', 'students_count' => 18],
        ]);

        // Get sample classes for the manage tab
        $classes = $this->getSampleClasses();
        
        return Inertia::render('Teacher/Classes/Create', [
            'batches' => $batches,
            'classes' => $classes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the class data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'batch_id' => 'required|numeric',
            'scheduled_at' => 'required|date|after:now',
            'duration' => 'required|integer|min:15|max:480',
            'zoom_link' => 'nullable|url',
            'zoom_meeting_id' => 'nullable|string',
            'zoom_passcode' => 'nullable|string',
            'send_notifications' => 'boolean',
            'allow_recordings' => 'boolean',
            'auto_attendance' => 'boolean',
        ]);

        // For now, just return success message
        // Later, you can save to database: $class = Class::create($validated);
        
        return redirect()->route('teacher.classes.create')
                         ->with('success', 'Class scheduled successfully! Students will be notified.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('Teacher/Classes/Show', [
            'class' => $this->getSampleClass($id)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $batches = collect([
            ['id' => 1, 'name' => 'Mathematics Grade 10', 'students_count' => 25],
            ['id' => 2, 'name' => 'Physics Grade 11', 'students_count' => 30],
            ['id' => 3, 'name' => 'Chemistry Grade 12', 'students_count' => 22],
        ]);
            
        return Inertia::render('Teacher/Classes/Edit', [
            'class' => $this->getSampleClass($id),
            'batches' => $batches
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'batch_id' => 'required|numeric',
            'scheduled_at' => 'required|date',
            'duration' => 'required|integer|min:15|max:480',
            'zoom_link' => 'nullable|url',
            'zoom_meeting_id' => 'nullable|string',
            'zoom_passcode' => 'nullable|string',
        ]);

        return redirect()->route('teacher.classes.create')
                         ->with('success', 'Class updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return redirect()->route('teacher.classes.create')
                         ->with('success', 'Class cancelled successfully!');
    }

    /**
     * Toggle class status
     */
    public function toggleStatus(string $id)
    {
        return redirect()->back()->with('success', 'Class status updated!');
    }

    /**
     * Get sample classes for testing
     */
    private function getSampleClasses()
    {
        return collect([
            [
                'id' => 1,
                'title' => 'Algebra Fundamentals',
                'description' => 'Introduction to algebraic equations and problem solving',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'scheduled_at' => now()->addDays(2)->setHour(14)->setMinute(0)->toDateTimeString(),
                'duration' => 60,
                'zoom_link' => 'https://zoom.us/j/1234567890',
                'zoom_meeting_id' => '123 456 7890',
                'zoom_passcode' => 'math123',
                'status' => 'scheduled',
                'attendance_count' => 0,
                'created_at' => now()->subDays(5)->toDateTimeString(),
            ],
            [
                'id' => 2,
                'title' => 'Quantum Physics Basics',
                'description' => 'Understanding quantum mechanics principles',
                'batch' => ['name' => 'Physics Grade 11'],
                'scheduled_at' => now()->addDays(5)->setHour(16)->setMinute(30)->toDateTimeString(),
                'duration' => 90,
                'zoom_link' => 'https://zoom.us/j/0987654321',
                'zoom_meeting_id' => '098 765 4321',
                'zoom_passcode' => 'physics',
                'status' => 'scheduled',
                'attendance_count' => 0,
                'created_at' => now()->subDays(3)->toDateTimeString(),
            ],
            [
                'id' => 3,
                'title' => 'Organic Chemistry Review',
                'description' => 'Review session for upcoming exam',
                'batch' => ['name' => 'Chemistry Grade 12'],
                'scheduled_at' => now()->subDays(3)->setHour(10)->setMinute(0)->toDateTimeString(),
                'duration' => 120,
                'zoom_link' => 'https://zoom.us/j/1122334455',
                'zoom_meeting_id' => '112 233 4455',
                'zoom_passcode' => 'chem2024',
                'status' => 'completed',
                'attendance_count' => 18,
                'created_at' => now()->subDays(10)->toDateTimeString(),
            ],
            [
                'id' => 4,
                'title' => 'Cell Biology Deep Dive',
                'description' => 'Detailed study of cellular processes',
                'batch' => ['name' => 'Biology Advanced'],
                'scheduled_at' => now()->subDays(1)->setHour(13)->setMinute(15)->toDateTimeString(),
                'duration' => 75,
                'status' => 'completed',
                'attendance_count' => 15,
                'created_at' => now()->subDays(7)->toDateTimeString(),
            ],
            [
                'id' => 5,
                'title' => 'Calculus Applications',
                'description' => 'Real-world applications of calculus',
                'batch' => ['name' => 'Mathematics Grade 10'],
                'scheduled_at' => now()->addHours(2)->toDateTimeString(),
                'duration' => 45,
                'zoom_link' => 'https://zoom.us/j/5566778899',
                'zoom_meeting_id' => '556 677 8899',
                'zoom_passcode' => 'calc123',
                'status' => 'ongoing',
                'attendance_count' => 22,
                'created_at' => now()->subDays(1)->toDateTimeString(),
            ]
        ]);
    }

    /**
     * Get a single sample class
     */
    private function getSampleClass(string $id)
    {
        return $this->getSampleClasses()->firstWhere('id', (int)$id) ?? [
            'id' => $id,
            'title' => 'Sample Class',
            'description' => 'This is a sample class',
            'batch' => ['name' => 'Sample Batch'],
            'scheduled_at' => now()->addDay()->toDateTimeString(),
            'duration' => 60,
            'status' => 'scheduled',
        ];
    }
}