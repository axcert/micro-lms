// resources/js/types/index.ts

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'teacher' | 'student';
    created_at?: string;
    updated_at?: string;
}

export interface Batch {
    id: number;
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    max_students?: number;
    is_active: boolean;
    teacher_id: number;
    students_count?: number;
    student_count?: number; // Alternative naming
    created_at?: string;
    updated_at?: string;
    students?: Student[];
    teacher?: User;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Class {
    id: number;
    title: string;
    description?: string;
    scheduled_at: string;
    duration_minutes: number;
    zoom_link?: string;
    notes?: string;
    batch_id: number;
    teacher_id: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    created_at?: string;
    updated_at?: string;
    batch: Batch;
    teacher?: User;
    attendance_count?: number;
}

export interface Quiz {
    id: number;
    title: string;
    description?: string;
    instructions?: string;
    start_time?: string;
    end_time?: string;
    duration_minutes?: number;
    total_marks: number;
    pass_marks?: number;
    batch_id: number;
    teacher_id: number;
    status: 'draft' | 'active' | 'completed' | 'archived';
    is_randomized: boolean;
    show_results: boolean;
    allow_retake: boolean;
    created_at?: string;
    updated_at?: string;
    batch: Batch;
    teacher?: User;
    questions_count: number;
    attempts_count: number;
}

export interface Question {
    id: number;
    quiz_id: number;
    question_text: string;
    question_type: 'mcq' | 'short_answer' | 'essay' | 'true_false';
    marks: number;
    order: number;
    is_required: boolean;
    options?: QuestionOption[];
    correct_answer?: string;
    created_at?: string;
    updated_at?: string;
}

export interface QuestionOption {
    id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean;
    order: number;
}

export interface QuizAttempt {
    id: number;
    quiz_id: number;
    student_id: number;
    started_at: string;
    submitted_at?: string;
    total_marks: number;
    obtained_marks?: number;
    is_completed: boolean;
    time_taken?: number; // in minutes
    created_at?: string;
    updated_at?: string;
    quiz: Quiz;
    student: User;
    answers?: QuizAnswer[];
}

export interface QuizAnswer {
    id: number;
    quiz_attempt_id: number;
    question_id: number;
    answer_text?: string;
    selected_option_id?: number;
    marks_obtained?: number;
    is_correct?: boolean;
    created_at?: string;
    updated_at?: string;
    question: Question;
}

export interface Attendance {
    id: number;
    class_id: number;
    student_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    marked_at?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    class: Class;
    student: User;
}

export interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    description: string;
    model_type?: string;
    model_id?: number;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    user: User;
}

export interface Notification {
    id: number;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: Record<string, any>;
    read_at?: string;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    total_batches: number;
    total_students: number;
    active_quizzes: number;
    upcoming_classes: number;
    completed_classes?: number;
    total_quiz_attempts?: number;
    average_attendance?: number;
}

// Form Data Interfaces
export interface CreateBatchFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    max_students: number | '';
    is_active: boolean;
    student_ids: number[];
}

export interface CreateClassFormData {
    title: string;
    description: string;
    batch_id: string;
    scheduled_at: string;
    duration_minutes: number;
    zoom_link: string;
    notes: string;
    create_attendance: boolean;
}

export interface CreateQuizFormData {
    title: string;
    description: string;
    instructions: string;
    batch_id: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    total_marks: number;
    pass_marks: number;
    is_randomized: boolean;
    show_results: boolean;
    allow_retake: boolean;
}

export interface CreateQuestionFormData {
    quiz_id: number;
    question_text: string;
    question_type: 'mcq' | 'short_answer' | 'essay' | 'true_false';
    marks: number;
    is_required: boolean;
    options: Array<{
        option_text: string;
        is_correct: boolean;
    }>;
    correct_answer?: string;
}

// Page Props Interface
export interface PageProps<T = Record<string, unknown>> extends T {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
        message?: string;
        type?: 'success' | 'error' | 'info' | 'warning';
    };
    errors?: Record<string, string | string[]>;
    csrf_token?: string;
}

// Teacher Dashboard Props
export interface TeacherDashboardProps extends PageProps {
    myBatches: Batch[];
    upcomingClasses: Class[];
    recentQuizzes: Quiz[];
    stats: DashboardStats;
}

// Teacher Pages Props
export interface CreateClassProps extends PageProps {
    batches: Batch[];
}

export interface CreateBatchProps extends PageProps {
    availableStudents: Student[];
}

export interface CreateQuizProps extends PageProps {
    batches: Batch[];
}

export interface BatchIndexProps extends PageProps {
    batches: Batch[];
    filters?: {
        search?: string;
        status?: 'active' | 'inactive';
    };
}

export interface ClassIndexProps extends PageProps {
    classes: Class[];
    batches: Batch[];
    filters?: {
        search?: string;
        batch_id?: number;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export interface QuizIndexProps extends PageProps {
    quizzes: Quiz[];
    batches: Batch[];
    filters?: {
        search?: string;
        batch_id?: number;
        status?: string;
    };
}

// Student Dashboard Props
export interface StudentDashboardProps extends PageProps {
    upcomingClasses: Class[];
    availableQuizzes: Quiz[];
    recentAttempts: QuizAttempt[];
    batch?: Batch;
    stats: {
        total_classes: number;
        attended_classes: number;
        available_quizzes: number;
        completed_quizzes: number;
        average_score: number;
    };
}

// Admin Dashboard Props
export interface AdminDashboardProps extends PageProps {
    stats: {
        total_teachers: number;
        total_students: number;
        total_batches: number;
        total_classes: number;
        total_quizzes: number;
        system_health: 'good' | 'warning' | 'critical';
    };
    recentActivity: ActivityLog[];
    systemMetrics: {
        active_users: number;
        storage_used: number;
        bandwidth_used: number;
    };
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: {
        first: string;
        last: string;
        prev?: string;
        next?: string;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

// Filter and Search Types
export interface FilterOptions {
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

export interface BatchFilters extends FilterOptions {
    status?: 'active' | 'inactive';
    teacher_id?: number;
    start_date_from?: string;
    start_date_to?: string;
}

export interface ClassFilters extends FilterOptions {
    batch_id?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    date_from?: string;
    date_to?: string;
}

export interface QuizFilters extends FilterOptions {
    batch_id?: number;
    status?: 'draft' | 'active' | 'completed' | 'archived';
    teacher_id?: number;
}

// Utility Types
export type UserRole = 'admin' | 'teacher' | 'student';

export type QuestionType = 'mcq' | 'short_answer' | 'essay' | 'true_false';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type ClassStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type QuizStatus = 'draft' | 'active' | 'completed' | 'archived';

export type BatchStatus = 'active' | 'inactive';

// Form Validation Rules (for reference)
export interface ValidationRules {
    batch: {
        name: 'required|string|max:255';
        description: 'nullable|string|max:1000';
        start_date: 'required|date|after_or_equal:today';
        end_date: 'nullable|date|after:start_date';
        max_students: 'nullable|integer|min:1|max:100';
        is_active: 'boolean';
        student_ids: 'array';
    };
    class: {
        title: 'required|string|max:255';
        description: 'nullable|string|max:1000';
        batch_id: 'required|exists:batches,id';
        scheduled_at: 'required|date|after:now';
        duration_minutes: 'required|integer|min:15|max:480';
        zoom_link: 'nullable|url';
        notes: 'nullable|string|max:1000';
        create_attendance: 'boolean';
    };
    quiz: {
        title: 'required|string|max:255';
        description: 'nullable|string|max:1000';
        instructions: 'nullable|string|max:2000';
        batch_id: 'required|exists:batches,id';
        start_time: 'nullable|date';
        end_time: 'nullable|date|after:start_time';
        duration_minutes: 'nullable|integer|min:1|max:480';
        total_marks: 'required|integer|min:1';
        pass_marks: 'nullable|integer|min:0|lte:total_marks';
        is_randomized: 'boolean';
        show_results: 'boolean';
        allow_retake: 'boolean';
    };
}