<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Batch;
use App\Models\User;
use Carbon\Carbon;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get teachers and students
        $teachers = User::where('role', 'teacher')->get();
        $students = User::where('role', 'student')->get();

        if ($teachers->isEmpty()) {
            $this->command->info('No teachers found. Creating sample teacher...');
            $teacher = User::create([
                'name' => 'John Teacher',
                'email' => 'teacher@example.com',
                'password' => bcrypt('password'),
                'role' => 'teacher',
                'email_verified_at' => now(),
            ]);
            $teachers = collect([$teacher]);
        }

        if ($students->isEmpty()) {
            $this->command->info('No students found. Creating sample students...');
            $studentData = [
                ['name' => 'Alice Student', 'email' => 'alice@example.com'],
                ['name' => 'Bob Student', 'email' => 'bob@example.com'],
                ['name' => 'Charlie Student', 'email' => 'charlie@example.com'],
                ['name' => 'Diana Student', 'email' => 'diana@example.com'],
                ['name' => 'Eve Student', 'email' => 'eve@example.com'],
                ['name' => 'Frank Student', 'email' => 'frank@example.com'],
                ['name' => 'Grace Student', 'email' => 'grace@example.com'],
                ['name' => 'Henry Student', 'email' => 'henry@example.com'],
            ];

            foreach ($studentData as $data) {
                $students->push(User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => bcrypt('password'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                ]));
            }
        }

        // Sample batch data
        $batchData = [
            [
                'name' => 'Mathematics Grade 10 - Morning',
                'description' => 'Advanced mathematics course for Grade 10 students focusing on algebra and geometry',
                'start_date' => Carbon::now()->addDays(7),
                'end_date' => Carbon::now()->addMonths(6),
                'max_students' => 30,
                'is_active' => true,
                'student_count' => 15,
            ],
            [
                'name' => 'Physics Grade 11 - Afternoon',
                'description' => 'Comprehensive physics course covering mechanics and thermodynamics',
                'start_date' => Carbon::now()->addDays(14),
                'end_date' => Carbon::now()->addMonths(8),
                'max_students' => 25,
                'is_active' => true,
                'student_count' => 20,
            ],
            [
                'name' => 'Chemistry Grade 12 - Evening',
                'description' => 'Organic and inorganic chemistry for final year students',
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => null,
                'max_students' => 20,
                'is_active' => true,
                'student_count' => 12,
            ],
            [
                'name' => 'Biology Grade 9 - Morning',
                'description' => 'Introduction to biological sciences',
                'start_date' => Carbon::now()->addDays(30),
                'end_date' => Carbon::now()->addMonths(10),
                'max_students' => 35,
                'is_active' => true,
                'student_count' => 18,
            ],
            [
                'name' => 'English Literature - Advanced',
                'description' => 'Advanced literature analysis and writing skills',
                'start_date' => Carbon::now()->subDays(60),
                'end_date' => Carbon::now()->subDays(10),
                'max_students' => 15,
                'is_active' => false,
                'student_count' => 10,
            ],
            [
                'name' => 'Computer Science Basics',
                'description' => 'Introduction to programming and computer science concepts',
                'start_date' => Carbon::now()->addDays(45),
                'end_date' => Carbon::now()->addMonths(12),
                'max_students' => null, // No limit
                'is_active' => true,
                'student_count' => 8,
            ],
        ];

        foreach ($batchData as $data) {
            foreach ($teachers as $teacher) {
                // Create batch
                $batch = Batch::create([
                    'name' => $data['name'] . ' (Teacher: ' . $teacher->name . ')',
                    'description' => $data['description'],
                    'teacher_id' => $teacher->id,
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'max_students' => $data['max_students'],
                    'is_active' => $data['is_active'],
                ]);

                // Assign random students to the batch
                $studentsToAssign = $students->random(min($data['student_count'], $students->count()));
                
                foreach ($studentsToAssign as $student) {
                    $batch->students()->attach($student->id, [
                        'enrolled_at' => $batch->start_date->subDays(rand(1, 14)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                $this->command->info("Created batch: {$batch->name} with {$studentsToAssign->count()} students");
                
                // Only create one batch per batch data for the first teacher
                // (to avoid too much test data)
                break;
            }
        }

        $this->command->info('Batch seeding completed!');
        $this->command->info('Created ' . Batch::count() . ' batches with students assigned.');
    }
}