<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');
        
        // Call seeders in correct order
        $this->call([
            UserSeeder::class,      // Create users first
            BatchSeeder::class,     // Create batches (needs users)
            QuizSeeder::class,      // Create quizzes (needs users and batches)
        ]);
        
        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->line('');
        $this->command->info('🔑 Demo Login Credentials:');
        $this->command->line('👑 Admin: admin@mlms.com');
        $this->command->line('👨‍🏫 Teacher: teacher@mlms.com');
        $this->command->line('👨‍🎓 Student: student@mlms.com');
        $this->command->line('🔒 Password: password');
    }
}