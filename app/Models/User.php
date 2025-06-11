<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// REMOVED: use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Log;
use Exception;

class User extends Authenticatable implements MustVerifyEmail
{
    // REMOVED HasApiTokens from the use statement
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'email_verified_at',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => UserRole::class,
        'is_active' => 'boolean',
    ];

    /**
     * Handle role setting properly
     */
    public function setRoleAttribute($value)
    {
        if ($value instanceof UserRole) {
            $this->attributes['role'] = $value->value;
        } else {
            $this->attributes['role'] = $value;
        }
    }

    /**
     * Handle role getting properly
     */
    public function getRoleAttribute($value)
    {
        try {
            return UserRole::from($value);
        } catch (Exception $e) {
            Log::warning('Invalid role value in database', [
                'role' => $value, 
                'user_id' => $this->id ?? 'unknown'
            ]);
            return UserRole::STUDENT; // Default fallback
        }
    }

    /**
     * Get the user's role display name
     */
    public function getRoleDisplayNameAttribute(): string
    {
        try {
            return $this->role->getDisplayName();
        } catch (Exception $e) {
            return 'Student'; // Fallback
        }
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(UserRole $role): bool
    {
        try {
            return $this->role === $role;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Check if user can perform a specific action
     */
    public function can($ability, $arguments = []): bool
    {
        if (is_string($ability)) {
            try {
                return $this->role->can($ability);
            } catch (Exception $e) {
                return false;
            }
        }
        
        return parent::can($ability, $arguments);
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Activate user
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate user
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for inactive users
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope for users by role
     */
    public function scopeByRole($query, UserRole|string $role)
    {
        $roleValue = $role instanceof UserRole ? $role->value : $role;
        return $query->where('role', $roleValue);
    }

    /**
     * Scope for students
     */
    public function scopeStudents($query)
    {
        return $query->where('role', UserRole::STUDENT->value);
    }

    /**
     * Scope for teachers
     */
    public function scopeTeachers($query)
    {
        return $query->where('role', UserRole::TEACHER->value);
    }

    /**
     * Scope for admins
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', UserRole::ADMIN->value);
    }

    /**
     * Relationships
     */

    /**
     * Batches created by this user (if teacher)
     */
    public function createdBatches(): HasMany
    {
        return $this->hasMany(Batch::class, 'teacher_id');
    }

    /**
     * Batches this user belongs to (if student)
     */
    public function batches(): BelongsToMany
    {
        return $this->belongsToMany(Batch::class, 'batch_students', 'student_id', 'batch_id');
    }

    /**
     * Classes created by this user (if teacher)
     */
    public function createdClasses(): HasMany
    {
        return $this->hasMany(ClassModel::class, 'teacher_id');
    }

    /**
     * Quizzes created by this user (if teacher)
     */
    public function createdQuizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'teacher_id');
    }

    /**
     * Quiz attempts by this user (if student)
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'student_id');
    }

    /**
     * Attendance records for this user (if student)
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    /**
     * Activity logs for this user
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Notifications for this user
     */
    public function userNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Helper methods
     */

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        try {
            return $this->role === UserRole::ADMIN;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Check if user is teacher
     */
    public function isTeacher(): bool
    {
        try {
            return $this->role === UserRole::TEACHER;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Check if user is student
     */
    public function isStudent(): bool
    {
        try {
            return $this->role === UserRole::STUDENT;
        } catch (Exception $e) {
            return true; // Default to student
        }
    }

    /**
     * Get user's full name
     */
    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    /**
     * Get user's initials
     */
    public function getInitialsAttribute(): string
    {
        $names = explode(' ', $this->name);
        $initials = '';
        
        foreach ($names as $name) {
            if (!empty($name)) {
                $initials .= strtoupper(substr($name, 0, 1));
            }
        }
        
        return substr($initials, 0, 2); // Max 2 initials
    }
}