namespace App\Services;

use App\Models\User;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Attendance;
use App\Models\Batch;
use Illuminate\Support\Facades\DB;

class ReportGeneratorService
{
    /**
     * Generate student progress report
     */
    public function generateStudentProgressReport($studentId, $batchId = null)
    {
        $student = User::find($studentId);
        
        $query = QuizAttempt::where('user_id', $studentId)->with('quiz');
        
        if ($batchId) {
            $query->whereHas('quiz', function ($q) use ($batchId) {
                $q->where('batch_id', $batchId);
            });
        }

        $attempts = $query->get();
        
        return [
            'student' => $student,
            'total_quizzes' => $attempts->count(),
            'average_score' => $attempts->avg('percentage'),
            'highest_score' => $attempts->max('percentage'),
            'lowest_score' => $attempts->min('percentage'),
            'completed_quizzes' => $attempts->where('is_completed', true)->count(),
            'attempts' => $attempts,
        ];
    }

    /**
     * Generate quiz statistics report
     */
    public function generateQuizReport($quizId)
    {
        $quiz = Quiz::with(['attempts.user', 'questions'])->find($quizId);
        $attempts = $quiz->attempts;

        return [
            'quiz' => $quiz,
            'total_attempts' => $attempts->count(),
            'completed_attempts' => $attempts->where('is_completed', true)->count(),
            'average_score' => $attempts->where('is_completed', true)->avg('percentage'),
            'highest_score' => $attempts->where('is_completed', true)->max('percentage'),
            'lowest_score' => $attempts->where('is_completed', true)->min('percentage'),
            'pass_rate' => $attempts->where('is_completed', true)->where('percentage', '>=', 50)->count() / max($attempts->where('is_completed', true)->count(), 1) * 100,
            'attempts_by_student' => $attempts,
        ];
    }

    /**
     * Generate attendance report
     */
    public function generateAttendanceReport($batchId, $dateFrom = null, $dateTo = null)
    {
        $batch = Batch::with(['students', 'classes'])->find($batchId);
        
        $query = Attendance::whereHas('class', function ($q) use ($batchId) {
            $q->where('batch_id', $batchId);
        });

        if ($dateFrom) {
            $query->whereHas('class', function ($q) use ($dateFrom) {
                $q->where('scheduled_at', '>=', $dateFrom);
            });
        }

        if ($dateTo) {
            $query->whereHas('class', function ($q) use ($dateTo) {
                $q->where('scheduled_at', '<=', $dateTo);
            });
        }

        $attendanceRecords = $query->with(['user', 'class'])->get();

        $summary = $batch->students->map(function ($student) use ($attendanceRecords) {
            $studentAttendance = $attendanceRecords->where('user_id', $student->id);
            $totalClasses = $attendanceRecords->pluck('class_id')->unique()->count();
            $presentCount = $studentAttendance->where('status', 'present')->count();
            
            return [
                'student' => $student,
                'total_classes' => $totalClasses,
                'present' => $presentCount,
                'absent' => $studentAttendance->where('status', 'absent')->count(),
                'late' => $studentAttendance->where('status', 'late')->count(),
                'attendance_percentage' => $totalClasses > 0 ? ($presentCount / $totalClasses) * 100 : 0,
            ];
        });

        return [
            'batch' => $batch,
            'summary' => $summary,
            'total_classes' => $attendanceRecords->pluck('class_id')->unique()->count(),
            'date_range' => ['from' => $dateFrom, 'to' => $dateTo],
        ];
    }

    /**
     * Generate teacher performance report
     */
    public function generateTeacherReport($teacherId)
    {
        $teacher = User::find($teacherId);
        $batches = Batch::where('teacher_id', $teacherId)->with(['students', 'classes', 'quizzes'])->get();

        $totalStudents = $batches->sum(function ($batch) {
            return $batch->students->count();
        });

        $totalClasses = $batches->sum(function ($batch) {
            return $batch->classes->count();
        });

        $totalQuizzes = $batches->sum(function ($batch) {
            return $batch->quizzes->count();
        });

        return [
            'teacher' => $teacher,
            'total_batches' => $batches->count(),
            'total_students' => $totalStudents,
            'total_classes' => $totalClasses,
            'total_quizzes' => $totalQuizzes,
            'batches' => $batches,
        ];
    }

    /**
     * Export report to CSV
     */
    public function exportToCsv($data, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            if (!empty($data)) {
                fputcsv($file, array_keys($data[0]));
            }
            
            // Add data rows
            foreach ($data as $row) {
                fputcsv($file, $row);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}