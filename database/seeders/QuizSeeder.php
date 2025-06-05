<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Batch;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use Carbon\Carbon;

class QuizSeeder extends Seeder
{
    public function run()
    {
        // Ensure we have a teacher and students
        $teacher = User::where('role', 'teacher')->first();
        if (!$teacher) {
            $teacher = User::create([
                'name' => 'John Doe',
                'email' => 'teacher@example.com',
                'password' => bcrypt('password'),
                'role' => 'teacher'
            ]);
        }

        // Create students if they don't exist
        $students = User::where('role', 'student')->take(5)->get();
        if ($students->count() < 5) {
            for ($i = $students->count(); $i < 5; $i++) {
                User::create([
                    'name' => 'Student ' . ($i + 1),
                    'email' => 'student' . ($i + 1) . '@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'student'
                ]);
            }
            $students = User::where('role', 'student')->take(5)->get();
        }

        // Create a batch if it doesn't exist
        $batch = Batch::where('teacher_id', $teacher->id)->first();
        if (!$batch) {
            $batch = Batch::create([
                'name' => 'Test Batch - Mathematics',
                'description' => 'Test batch for quiz system',
                'teacher_id' => $teacher->id,
                'start_date' => now(),
                'is_active' => true
            ]);
            
            // Assign students to batch
            $batch->students()->attach($students->pluck('id'));
        }

        // Create test quizzes
        $this->createMathQuiz($teacher, $batch, $students);
        $this->createScienceQuiz($teacher, $batch, $students);
        $this->createDraftQuiz($teacher, $batch);
    }

    private function createMathQuiz($teacher, $batch, $students)
    {
        $quiz = Quiz::create([
            'title' => 'Quadratic Equations Test',
            'description' => 'Test your understanding of quadratic equations',
            'instructions' => 'Answer all questions. You have 60 minutes to complete this quiz.',
            'batch_id' => $batch->id,
            'teacher_id' => $teacher->id,
            'total_marks' => 50,
            'pass_marks' => 30,
            'duration_minutes' => 60,
            'start_time' => now()->subDays(2),
            'end_time' => now()->addDays(7),
            'max_attempts' => 2,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'show_results_immediately' => true,
            'allow_review' => true,
            'status' => 'active'
        ]);

        // Add questions
        $this->addMathQuestions($quiz);

        // Create some test attempts
        $this->createTestAttempts($quiz, $students->take(3));
    }

    private function createScienceQuiz($teacher, $batch, $students)
    {
        $quiz = Quiz::create([
            'title' => 'Basic Physics Quiz',
            'description' => 'Newton\'s laws and basic mechanics',
            'instructions' => 'Choose the best answer for each question.',
            'batch_id' => $batch->id,
            'teacher_id' => $teacher->id,
            'total_marks' => 30,
            'pass_marks' => 18,
            'duration_minutes' => 45,
            'start_time' => now()->subDay(),
            'end_time' => now()->addDays(5),
            'max_attempts' => 1,
            'shuffle_questions' => false,
            'shuffle_options' => true,
            'show_results_immediately' => true,
            'allow_review' => true,
            'status' => 'active'
        ]);

        $this->addScienceQuestions($quiz);
        $this->createTestAttempts($quiz, $students->take(2));
    }

    private function createDraftQuiz($teacher, $batch)
    {
        $quiz = Quiz::create([
            'title' => 'Advanced Calculus Final',
            'description' => 'Comprehensive calculus examination',
            'batch_id' => $batch->id,
            'teacher_id' => $teacher->id,
            'total_marks' => 100,
            'pass_marks' => 60,
            'duration_minutes' => 120,
            'status' => 'draft'
        ]);

        // Add a few questions to draft
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'short_answer',
            'question_text' => 'Find the derivative of f(x) = x³ + 2x² - 5x + 3',
            'marks' => 10,
            'order' => 1,
            'correct_answer' => ['3x² + 4x - 5', '3x^2 + 4x - 5']
        ]);
    }

    private function addMathQuestions($quiz)
    {
        // MCQ Question
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'mcq',
            'question_text' => 'What is the discriminant of the quadratic equation 2x² + 3x - 1 = 0?',
            'explanation' => 'The discriminant is b² - 4ac = 3² - 4(2)(-1) = 9 + 8 = 17',
            'marks' => 5,
            'order' => 1,
            'options' => [
                ['id' => 'A', 'text' => '17'],
                ['id' => 'B', 'text' => '1'],
                ['id' => 'C', 'text' => '-7'],
                ['id' => 'D', 'text' => '25']
            ],
            'correct_answer' => ['A']
        ]);

        // Multiple Choice Question
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'multiple_choice',
            'question_text' => 'Which of the following are roots of x² - 5x + 6 = 0? (Select all that apply)',
            'explanation' => 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3',
            'marks' => 10,
            'order' => 2,
            'options' => [
                ['id' => 'A', 'text' => '1'],
                ['id' => 'B', 'text' => '2'],
                ['id' => 'C', 'text' => '3'],
                ['id' => 'D', 'text' => '6']
            ],
            'correct_answer' => ['B', 'C'],
            'partial_credit' => true
        ]);

        // True/False Question
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'true_false',
            'question_text' => 'A quadratic equation can have at most 2 real roots.',
            'explanation' => 'True. A quadratic equation is degree 2, so it can have at most 2 roots.',
            'marks' => 5,
            'order' => 3,
            'correct_answer' => ['true']
        ]);

        // Short Answer Question
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'short_answer',
            'question_text' => 'Solve for x: x² + 4x - 5 = 0 (provide both solutions separated by comma)',
            'explanation' => 'Using the quadratic formula or factoring: (x+5)(x-1) = 0',
            'marks' => 10,
            'order' => 4,
            'correct_answer' => ['x = 1, x = -5', '1, -5', '-5, 1'],
            'case_sensitive' => false
        ]);

        // Update quiz total marks
        $quiz->update(['total_marks' => $quiz->questions()->sum('marks')]);
    }

    private function addScienceQuestions($quiz)
    {
        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'mcq',
            'question_text' => 'Newton\'s first law states that an object at rest will:',
            'marks' => 10,
            'order' => 1,
            'options' => [
                ['id' => 'A', 'text' => 'Always remain at rest'],
                ['id' => 'B', 'text' => 'Remain at rest unless acted upon by a force'],
                ['id' => 'C', 'text' => 'Start moving automatically'],
                ['id' => 'D', 'text' => 'Move in a circular path']
            ],
            'correct_answer' => ['B']
        ]);

        Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'short_answer',
            'question_text' => 'What is the unit of force in the SI system?',
            'marks' => 5,
            'order' => 2,
            'correct_answer' => ['Newton', 'N', 'newton'],
            'case_sensitive' => false
        ]);

        $quiz->update(['total_marks' => $quiz->questions()->sum('marks')]);
    }

    private function createTestAttempts($quiz, $students)
    {
        foreach ($students as $index => $student) {
            $attempt = QuizAttempt::create([
                'quiz_id' => $quiz->id,
                'student_id' => $student->id,
                'started_at' => now()->subHours(2),
                'submitted_at' => now()->subHour(),
                'status' => 'completed',
                'time_taken_minutes' => 45 + ($index * 5),
                'ip_address' => '127.0.0.1'
            ]);

            // Create answers for each question
            $totalScore = 0;
            foreach ($quiz->questions as $questionIndex => $question) {
                $score = $this->generateTestScore($question, $index);
                $totalScore += $score;

                QuizAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'answer' => $this->generateTestAnswer($question, $score > 0),
                    'score' => $score,
                    'is_correct' => $score > 0,
                    'order' => $questionIndex + 1,
                    'answered_at' => $attempt->started_at->addMinutes($questionIndex * 3)
                ]);
            }

            // Update attempt with scores
            $attempt->update([
                'score' => $totalScore,
                'total_marks' => $quiz->total_marks,
                'percentage' => round(($totalScore / $quiz->total_marks) * 100, 2)
            ]);
        }
    }

    private function generateTestScore($question, $studentIndex)
    {
        // Simulate different student performance levels
        $performance = [0.9, 0.7, 0.8][$studentIndex] ?? 0.6;
        
        if (rand(1, 100) <= ($performance * 100)) {
            return $question->marks; // Full marks
        } elseif ($question->partial_credit && rand(1, 100) <= 30) {
            return $question->marks * 0.5; // Partial credit
        } else {
            return 0; // No marks
        }
    }

    private function generateTestAnswer($question, $isCorrect)
    {
        if ($isCorrect) {
            return $question->correct_answer;
        }

        // Generate wrong answers based on question type
        switch ($question->type) {
            case 'mcq':
            case 'true_false':
                $options = collect($question->formatted_options)->pluck('id');
                $correct = $question->correct_answer[0];
                return [$options->filter(fn($id) => $id !== $correct)->random()];
            
            case 'multiple_choice':
                return [$question->formatted_options[0]['id']]; // Wrong selection
            
            case 'short_answer':
                return ['Wrong answer'];
        }
    }
}