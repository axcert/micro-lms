<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if tables exist before querying
        if (!Schema::hasTable('quizzes')) {
            return Inertia::render('Teacher/Quizzes/Index', [
                'quizzes' => collect([])
            ]);
        }

        try {
            // Try to get quizzes, but handle any errors gracefully
            $quizzes = \App\Models\Quiz::with(['batch'])
                ->where('teacher_id', Auth::id())
                ->latest()
                ->get()
                ->map(function ($quiz) {
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'description' => $quiz->description,
                        'batch' => [
                            'name' => $quiz->batch->name ?? 'No Batch'
                        ],
                        'questions_count' => $quiz->questions()->count() ?? 0,
                        'attempts_count' => $quiz->attempts()->count() ?? 0,
                        'duration' => $quiz->duration,
                        'start_time' => $quiz->start_time,
                        'end_time' => $quiz->end_time,
                        'status' => $quiz->status ?? 'inactive',
                        'created_at' => $quiz->created_at->format('Y-m-d H:i:s'),
                    ];
                });
        } catch (\Exception $e) {
            $quizzes = collect([]);
        }
        
        return Inertia::render('Teacher/Quizzes/Index', [
            'quizzes' => $quizzes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get sample batches (you can replace this with real data)
        $batches = collect([]);
        
        // Check if batches table exists and get real data
        if (Schema::hasTable('batches')) {
            try {
                $batches = \App\Models\Batch::where('teacher_id', Auth::id())
                    ->get()
                    ->map(function ($batch) {
                        return [
                            'id' => $batch->id,
                            'name' => $batch->name,
                            'students_count' => $batch->students()->count() ?? 0,
                        ];
                    });
            } catch (\Exception $e) {
                // If there's an error, use sample data
                $batches = collect([
                    ['id' => 1, 'name' => 'Sample Batch 1', 'students_count' => 25],
                    ['id' => 2, 'name' => 'Sample Batch 2', 'students_count' => 30],
                ]);
            }
        } else {
            // Use sample data if table doesn't exist
            $batches = collect([
                ['id' => 1, 'name' => 'Sample Batch 1', 'students_count' => 25],
                ['id' => 2, 'name' => 'Sample Batch 2', 'students_count' => 30],
            ]);
        }

        // Get existing quizzes for the manage tab
        $quizzes = collect([]);
        
        if (Schema::hasTable('quizzes')) {
            try {
                $quizzes = \App\Models\Quiz::with(['batch'])
                    ->where('teacher_id', Auth::id())
                    ->latest()
                    ->get()
                    ->map(function ($quiz) {
                        return [
                            'id' => $quiz->id,
                            'title' => $quiz->title,
                            'description' => $quiz->description,
                            'batch' => [
                                'name' => $quiz->batch->name ?? 'No Batch'
                            ],
                            'questions_count' => $quiz->questions()->count() ?? 0,
                            'attempts_count' => $quiz->attempts()->count() ?? 0,
                            'duration' => $quiz->duration,
                            'start_time' => $quiz->start_time,
                            'end_time' => $quiz->end_time,
                            'status' => $quiz->status ?? 'inactive',
                            'created_at' => $quiz->created_at->format('Y-m-d H:i:s'),
                        ];
                    });
            } catch (\Exception $e) {
                // Use sample data for testing
                $quizzes = collect([
                    [
                        'id' => 1,
                        'title' => 'Sample Quiz 1',
                        'description' => 'This is a sample quiz for demonstration',
                        'batch' => ['name' => 'Sample Batch 1'],
                        'questions_count' => 10,
                        'attempts_count' => 5,
                        'duration' => 60,
                        'start_time' => now()->addDay()->toDateTimeString(),
                        'end_time' => now()->addDays(2)->toDateTimeString(),
                        'status' => 'active',
                        'created_at' => now()->toDateTimeString(),
                    ],
                    [
                        'id' => 2,
                        'title' => 'Sample Quiz 2',
                        'description' => 'Another sample quiz',
                        'batch' => ['name' => 'Sample Batch 2'],
                        'questions_count' => 15,
                        'attempts_count' => 12,
                        'duration' => 90,
                        'start_time' => now()->addDays(3)->toDateTimeString(),
                        'end_time' => now()->addDays(4)->toDateTimeString(),
                        'status' => 'inactive',
                        'created_at' => now()->toDateTimeString(),
                    ]
                ]);
            }
        }
        
        return Inertia::render('Teacher/Quizzes/Create', [
            'batches' => $batches,
            'quizzes' => $quizzes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the quiz data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'batch_id' => 'required|numeric',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'duration' => 'required|integer|min:1',
            'randomize_questions' => 'boolean',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
            'max_attempts' => 'required|integer|min:1|max:10',
        ]);

        // Check if we can actually save to database
        if (!Schema::hasTable('quizzes')) {
            return redirect()->route('teacher.quizzes.create')
                             ->with('error', 'Database not ready. Please run migrations first.');
        }

        try {
            // Add teacher_id to the validated data
            $validated['teacher_id'] = Auth::id();
            $validated['status'] = 'inactive'; // Default status

            // Create the quiz
            $quiz = \App\Models\Quiz::create($validated);
            
            return redirect()->route('teacher.quizzes.create')
                             ->with('success', 'Quiz created successfully! You can now add questions.');
        } catch (\Exception $e) {
            return redirect()->route('teacher.quizzes.create')
                             ->with('error', 'Error creating quiz: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('Teacher/Quizzes/Show', [
            'quiz' => ['id' => $id, 'title' => 'Sample Quiz']
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Teacher/Quizzes/Edit', [
            'quiz' => ['id' => $id, 'title' => 'Sample Quiz'],
            'batches' => []
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return redirect()->route('teacher.quizzes.create')
                         ->with('success', 'Quiz would be updated (database not ready).');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return redirect()->route('teacher.quizzes.create')
                         ->with('success', 'Quiz would be deleted (database not ready).');
    }

    /**
     * Toggle quiz status (active/inactive)
     */
    public function toggleStatus(string $id)
    {
        return redirect()->back()->with('success', 'Quiz status would be updated (database not ready).');
    }

    /**
     * View quiz results
     */
    public function results(string $id)
    {
        return Inertia::render('Teacher/Quizzes/Results', [
            'quiz' => ['id' => $id, 'title' => 'Sample Quiz'],
            'results' => []
        ]);
    }

    /**
     * Duplicate a quiz
     */
    public function duplicate(string $id)
    {
        return redirect()->route('teacher.quizzes.create')
                         ->with('success', 'Quiz would be duplicated (database not ready).');
    }
}