<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@mlms.com',
            'phone' => '+94771234567',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Teacher Users
        User::create([
            'name' => 'John Smith',
            'email' => 'teacher@mlms.com',
            'phone' => '+94772345678',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Sarah Wilson',
            'email' => 'sarah.wilson@mlms.com',
            'phone' => '+94773456789',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Michael Brown',
            'email' => 'michael.brown@mlms.com',
            'phone' => '+94774567890',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        // Create Student Users
        User::create([
            'name' => 'Emma Davis',
            'email' => 'student@mlms.com',
            'phone' => '+94775678901',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'James Johnson',
            'email' => 'james.johnson@mlms.com',
            'phone' => '+94776789012',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Olivia Miller',
            'email' => 'olivia.miller@mlms.com',
            'phone' => '+94777890123',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'William Garcia',
            'email' => 'william.garcia@mlms.com',
            'phone' => '+94778901234',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Sophia Martinez',
            'email' => 'sophia.martinez@mlms.com',
            'phone' => '+94779012345',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Benjamin Anderson',
            'email' => 'benjamin.anderson@mlms.com',
            'phone' => '+94770123456',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Isabella Taylor',
            'email' => 'isabella.taylor@mlms.com',
            'phone' => '+94771234560',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Alexander Thomas',
            'email' => 'alexander.thomas@mlms.com',
            'phone' => '+94772345601',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Mia Hernandez',
            'email' => 'mia.hernandez@mlms.com',
            'phone' => '+94773456012',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Ethan Moore',
            'email' => 'ethan.moore@mlms.com',
            'phone' => '+94774560123',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Charlotte Jackson',
            'email' => 'charlotte.jackson@mlms.com',
            'phone' => '+94775601234',
            'password' => Hash::make('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        // Additional demo users for testing
        User::factory(20)->create([
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        User::factory(5)->create([
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Demo users created successfully!');
        $this->command->line('Admin: admin@mlms.com');
        $this->command->line('Teacher: teacher@mlms.com');
        $this->command->line('Student: student@mlms.com');
        $this->command->line('Password for all: password');
    }
}