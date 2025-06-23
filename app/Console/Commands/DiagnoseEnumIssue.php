<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Enums\UserRole;

class DiagnoseEnumIssue extends Command
{
    protected $signature = 'diagnose:enum';
    protected $description = 'Diagnose enum issues';

    public function handle()
    {
        $this->info('=== ENUM DIAGNOSIS ===');
        
        // Test 1: PHP Version
        $this->info('PHP Version: ' . PHP_VERSION);
        if (version_compare(PHP_VERSION, '8.1.0', '<')) {
            $this->error('❌ PHP version too old for enums');
            return;
        }
        $this->info('✅ PHP version supports enums');
        
        // Test 2: Enum file exists and is valid
        try {
            $this->info('Testing enum instantiation...');
            $admin = UserRole::ADMIN;
            $teacher = UserRole::TEACHER;
            $student = UserRole::STUDENT;
            $this->info('✅ Enum constants work');
            
            $fromString = UserRole::from('teacher');
            $this->info('✅ Enum::from() works');
            
        } catch (\Exception $e) {
            $this->error('❌ Enum error: ' . $e->getMessage());
            return;
        }
        
        // Test 3: Database connection and data
        try {
            $userCount = User::count();
            $this->info("✅ Database connection works. Users: {$userCount}");
            
            // Check for problematic roles directly in DB
            $invalidRoles = \DB::table('users')
                ->whereNotIn('role', ['admin', 'teacher', 'student'])
                ->orWhereNull('role')
                ->count();
                
            if ($invalidRoles > 0) {
                $this->error("❌ Found {$invalidRoles} users with invalid roles");
                return;
            }
            $this->info('✅ All roles in database are valid');
            
        } catch (\Exception $e) {
            $this->error('❌ Database error: ' . $e->getMessage());
            return;
        }
        
        // Test 4: Try loading users with enum casting
        try {
            $this->info('Testing user model loading...');
            
            // Load without using the role attribute first
            $user = \DB::table('users')->where('role', 'teacher')->first();
            if ($user) {
                $this->info("✅ Raw DB query works. User role: {$user->role}");
            }
            
            // Now try with Eloquent model (this is where it might fail)
            $eloquentUser = User::where('role', 'teacher')->first();
            if ($eloquentUser) {
                $this->info('✅ Eloquent model loading works');
                
                // Test role property access
                $roleValue = $eloquentUser->role;
                $this->info('✅ Role property access works: ' . $roleValue->value);
                
                // Test role methods
                $isTeacher = $eloquentUser->isTeacher();
                $this->info('✅ Role methods work. isTeacher: ' . ($isTeacher ? 'true' : 'false'));
                
                // Test serialization (this is often where it breaks)
                $array = $eloquentUser->toArray();
                $this->info('✅ User serialization works');
                
            }
            
        } catch (\Exception $e) {
            $this->error('❌ User model error: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return;
        }
        
        $this->info('=== ALL TESTS PASSED ===');
    }
}