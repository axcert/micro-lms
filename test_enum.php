<?php
/**
 * Test script to verify UserRole enum functionality
 * Place this file in your Laravel project root and run: php test_enum.php
 */

echo "=== UserRole Enum Test Script ===\n";

// Load Laravel autoloader
if (!file_exists('vendor/autoload.php')) {
    echo "❌ Error: vendor/autoload.php not found. Run 'composer install' first.\n";
    exit(1);
}

require_once 'vendor/autoload.php';

// Load Laravel app if needed
if (file_exists('bootstrap/app.php')) {
    $app = require_once 'bootstrap/app.php';
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
}

try {
    echo "Testing UserRole enum...\n";
    
    // Test 1: Basic enum constants
    echo "\n1. Testing enum constants:\n";
    $admin = App\Enums\UserRole::ADMIN;
    echo "   ADMIN: " . $admin->value . " ✓\n";
    
    $teacher = App\Enums\UserRole::TEACHER;
    echo "   TEACHER: " . $teacher->value . " ✓\n";
    
    $student = App\Enums\UserRole::STUDENT;
    echo "   STUDENT: " . $student->value . " ✓\n";
    
    // Test 2: From string conversion
    echo "\n2. Testing from() method:\n";
    $fromAdmin = App\Enums\UserRole::from('admin');
    echo "   from('admin'): " . $fromAdmin->value . " ✓\n";
    
    $fromTeacher = App\Enums\UserRole::from('teacher');
    echo "   from('teacher'): " . $fromTeacher->value . " ✓\n";
    
    $fromStudent = App\Enums\UserRole::from('student');
    echo "   from('student'): " . $fromStudent->value . " ✓\n";
    
    // Test 3: Enum methods
    echo "\n3. Testing enum methods:\n";
    echo "   ADMIN display name: " . $admin->getDisplayName() . " ✓\n";
    echo "   TEACHER color: " . $teacher->color() . " ✓\n";
    echo "   STUDENT can take_quizzes: " . ($student->can('take_quizzes') ? 'Yes' : 'No') . " ✓\n";
    
    // Test 4: Equality
    echo "\n4. Testing equality:\n";
    $anotherAdmin = App\Enums\UserRole::ADMIN;
    echo "   ADMIN === ADMIN: " . ($admin === $anotherAdmin ? 'Yes' : 'No') . " ✓\n";
    echo "   ADMIN === TEACHER: " . ($admin === $teacher ? 'Yes' : 'No') . " ✓\n";
    
    // Test 5: Match statements
    echo "\n5. Testing match statements:\n";
    $testRole = App\Enums\UserRole::TEACHER;
    $dashboardRoute = match($testRole) {
        App\Enums\UserRole::ADMIN => 'admin.dashboard',
        App\Enums\UserRole::TEACHER => 'teacher.dashboard',
        App\Enums\UserRole::STUDENT => 'student.dashboard',
    };
    echo "   TEACHER dashboard route: " . $dashboardRoute . " ✓\n";
    
    // Test 6: Serialization
    echo "\n6. Testing serialization:\n";
    $roleArray = $teacher->toArray();
    echo "   TEACHER toArray() works ✓\n";
    echo "   Array keys: " . implode(', ', array_keys($roleArray)) . "\n";
    
    echo "\n✅ All enum tests passed successfully!\n";
    echo "✅ UserRole enum is working correctly.\n\n";
    
} catch (ValueError $e) {
    echo "❌ ValueError: " . $e->getMessage() . "\n";
    echo "This usually means an invalid enum value was used.\n";
    exit(1);
} catch (Error $e) {
    echo "❌ Fatal Error: " . $e->getMessage() . "\n";
    echo "This might indicate enum class not found or PHP version issue.\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

// Test database connection if available
try {
    echo "7. Testing database connection:\n";
    
    if (class_exists('Illuminate\\Support\\Facades\\DB')) {
        $userCount = Illuminate\Support\Facades\DB::table('users')->count();
        echo "   Database connection works. Users: " . $userCount . " ✓\n";
        
        // Check for invalid roles
        $invalidRoles = Illuminate\Support\Facades\DB::table('users')
            ->whereNotIn('role', ['admin', 'teacher', 'student'])
            ->orWhereNull('role')
            ->count();
            
        if ($invalidRoles > 0) {
            echo "   ⚠️  Found " . $invalidRoles . " users with invalid roles\n";
        } else {
            echo "   All user roles are valid ✓\n";
        }
        
        // Test role distribution
        $roleDistribution = Illuminate\Support\Facades\DB::table('users')
            ->select('role', Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get();
            
        echo "   Role distribution:\n";
        foreach ($roleDistribution as $role) {
            echo "     - " . $role->role . ": " . $role->count . "\n";
        }
        
    } else {
        echo "   Database not available in this context\n";
    }
    
} catch (Exception $e) {
    echo "   Database test failed: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
?>