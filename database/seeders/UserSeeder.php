<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@mlms.com',
            'phone' => '+1234567890',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create teacher user
        User::create([
            'name' => 'Teacher User',
            'email' => 'teacher@mlms.com',
            'phone' => '+1234567891',
            'role' => 'teacher',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create student user
        User::create([
            'name' => 'Student User',
            'email' => 'student@mlms.com',
            'phone' => '+1234567892',
            'role' => 'student',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}