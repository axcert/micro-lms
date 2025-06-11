<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case TEACHER = 'teacher';
    case STUDENT = 'student';

    /**
     * Get all role values as an array
     */
    public static function values(): array
    {
        return [
            self::ADMIN->value,
            self::TEACHER->value,
            self::STUDENT->value,
        ];
    }

    // ❌ REMOVED: cases() method - this is auto-provided by PHP 8.1+
    // /**
    //  * Get all role instances
    //  */
    // public static function cases(): array
    // {
    //     return [
    //         self::ADMIN,
    //         self::TEACHER,
    //         self::STUDENT,
    //     ];
    // }

    /**
     * Get role display name
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::TEACHER => 'Teacher',
            self::STUDENT => 'Student',
        };
    }

    /**
     * Legacy method for backward compatibility
     */
    public function label(): string
    {
        return $this->getDisplayName();
    }
    
    /**
     * Get role permissions
     */
    public function permissions(): array
    {
        return match($this) {
            self::ADMIN => [
                'manage_users',
                'manage_batches',
                'manage_quizzes',
                'view_all_reports',
                'system_settings'
            ],
            self::TEACHER => [
                'manage_own_batches',
                'manage_own_quizzes',
                'view_own_reports',
                'grade_submissions'
            ],
            self::STUDENT => [
                'take_quizzes',
                'view_own_results',
                'access_materials'
            ],
        };
    }

    /**
     * Get role description for UI
     */
    public function description(): string
    {
        return match($this) {
            self::ADMIN => 'Full system access and user management',
            self::TEACHER => 'Manage batches, create quizzes, track progress',
            self::STUDENT => 'Access classes, take quizzes, view results',
        };
    }

    /**
     * Get role color for UI styling
     */
    public function color(): string
    {
        return match($this) {
            self::ADMIN => 'purple',
            self::TEACHER => 'blue',
            self::STUDENT => 'emerald',
        };
    }

    /**
     * Get role icon class for UI
     */
    public function icon(): string
    {
        return match($this) {
            self::ADMIN => 'shield-check',
            self::TEACHER => 'users',
            self::STUDENT => 'user',
        };
    }

    /**
     * Check if role can perform a specific action
     */
    public function can(string $permission): bool
    {
        return in_array($permission, $this->permissions());
    }

    /**
     * Check if role has any of the given permissions
     */
    public function canAny(array $permissions): bool
    {
        return !empty(array_intersect($permissions, $this->permissions()));
    }

    /**
     * Check if role has all of the given permissions
     */
    public function canAll(array $permissions): bool
    {
        return empty(array_diff($permissions, $this->permissions()));
    }

    /**
     * Get role priority (higher number = higher priority)
     */
    public function priority(): int
    {
        return match($this) {
            self::ADMIN => 100,
            self::TEACHER => 50,
            self::STUDENT => 10,
        };
    }

    /**
     * Check if this role has higher priority than another role
     */
    public function hasHigherPriorityThan(UserRole $role): bool
    {
        return $this->priority() > $role->priority();
    }

    /**
     * Get default redirect route after login
     */
    public function defaultRoute(): string
    {
        return match($this) {
            self::ADMIN => 'admin.dashboard',
            self::TEACHER => 'teacher.dashboard',
            self::STUDENT => 'student.dashboard',
        };
    }

    /**
     * Get dashboard title
     */
    public function dashboardTitle(): string
    {
        return match($this) {
            self::ADMIN => 'Admin Dashboard',
            self::TEACHER => 'Teacher Dashboard',
            self::STUDENT => 'Student Dashboard',
        };
    }

    /**
     * Get welcome message for new users
     */
    public function welcomeMessage(): string
    {
        return match($this) {
            self::ADMIN => 'Welcome to Micro LMS! You have administrator access to manage the entire system.',
            self::TEACHER => 'Welcome to Micro LMS! You can now create batches, manage classes, and create quizzes.',
            self::STUDENT => 'Welcome to Micro LMS! You can now access your classes and take quizzes.',
        };
    }

    /**
     * Check if role is administrative (has elevated privileges)
     */
    public function isAdministrative(): bool
    {
        return match($this) {
            self::ADMIN => true,
            self::TEACHER, self::STUDENT => false,
        };
    }

    /**
     * Check if role can manage other users
     */
    public function canManageUsers(): bool
    {
        return $this->can('manage_users');
    }

    /**
     * Get role-specific navigation items
     */
    public function navigationItems(): array
    {
        return match($this) {
            self::ADMIN => [
                'dashboard' => 'Dashboard',
                'users' => 'User Management',
                'teachers' => 'Teachers',
                'batches' => 'All Batches',
                'reports' => 'System Reports',
                'settings' => 'Settings',
            ],
            self::TEACHER => [
                'dashboard' => 'Dashboard',
                'batches' => 'My Batches',
                'classes' => 'Classes',
                'quizzes' => 'Quizzes',
                'attendance' => 'Attendance',
                'reports' => 'Reports',
            ],
            self::STUDENT => [
                'dashboard' => 'Dashboard',
                'classes' => 'My Classes',
                'quizzes' => 'Quizzes',
                'results' => 'Results',
                'profile' => 'Profile',
            ],
        };
    }

    /**
     * Get role-specific quick actions
     */
    public function quickActions(): array
    {
        return match($this) {
            self::ADMIN => [
                'create_teacher' => 'Add Teacher',
                'view_reports' => 'View Reports',
                'system_backup' => 'System Backup',
            ],
            self::TEACHER => [
                'create_batch' => 'Create Batch',
                'create_quiz' => 'Create Quiz',
                'schedule_class' => 'Schedule Class',
            ],
            self::STUDENT => [
                'take_quiz' => 'Take Quiz',
                'view_schedule' => 'View Schedule',
                'check_results' => 'Check Results',
            ],
        };
    }

    /**
     * Convert to array for JSON responses
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'label' => $this->getDisplayName(),
            'description' => $this->description(),
            'color' => $this->color(),
            'icon' => $this->icon(),
            'permissions' => $this->permissions(),
            'priority' => $this->priority(),
            'default_route' => $this->defaultRoute(),
            'dashboard_title' => $this->dashboardTitle(),
            'is_administrative' => $this->isAdministrative(),
        ];
    }

    /**
     * Check equality
     */
    public function equals(UserRole $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * Static factory methods for convenience
     */
    public static function admin(): self
    {
        return self::ADMIN;
    }

    public static function teacher(): self
    {
        return self::TEACHER;
    }

    public static function student(): self
    {
        return self::STUDENT;
    }
}