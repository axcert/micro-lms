namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Send notification to user
     */
    public function sendNotification($userId, $title, $message, $type = 'info', $data = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => $data,
        ]);
    }

    /**
     * Send notification to multiple users
     */
    public function sendBulkNotification($userIds, $title, $message, $type = 'info', $data = null)
    {
        $notifications = [];
        
        foreach ($userIds as $userId) {
            $notifications[] = [
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'data' => json_encode($data),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        return Notification::insert($notifications);
    }

    /**
     * Send notification to all students in a batch
     */
    public function sendBatchNotification($batchId, $title, $message, $type = 'info')
    {
        $studentIds = \App\Models\Batch::find($batchId)->students->pluck('id')->toArray();
        return $this->sendBulkNotification($studentIds, $title, $message, $type);
    }

    /**
     * Send class reminder notifications
     */
    public function sendClassReminders($classId)
    {
        $class = \App\Models\Class::with('batch.students')->find($classId);
        
        $title = "Class Reminder: {$class->title}";
        $message = "Your class '{$class->title}' is scheduled for " . $class->scheduled_at->format('M d, Y at h:i A');
        
        $studentIds = $class->batch->students->pluck('id')->toArray();
        
        return $this->sendBulkNotification($studentIds, $title, $message, 'info', [
            'class_id' => $classId,
            'zoom_link' => $class->zoom_link,
        ]);
    }

    /**
     * Send quiz notifications
     */
    public function sendQuizNotifications($quizId)
    {
        $quiz = \App\Models\Quiz::with('batch.students')->find($quizId);
        
        $title = "New Quiz Available: {$quiz->title}";
        $message = "A new quiz '{$quiz->title}' is now available. Due date: " . $quiz->end_time->format('M d, Y at h:i A');
        
        $studentIds = $quiz->batch->students->pluck('id')->toArray();
        
        return $this->sendBulkNotification($studentIds, $title, $message, 'info', [
            'quiz_id' => $quizId,
            'due_date' => $quiz->end_time,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($notificationId, $userId = null)
    {
        $query = Notification::where('id', $notificationId);
        
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}
