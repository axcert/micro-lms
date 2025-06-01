export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'teacher' | 'student';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    csrf_token: string;
}

export interface Batch {
    id: number;
    name: string;
    description: string;
    teacher_id: number;
    teacher?: User;
    students?: User[];
    students_count: number;
    created_at: string;
    updated_at: string;
}

export interface Class {
    id: number;
    title: string;
    description?: string;
    batch_id: number;
    batch?: Batch;
    teacher_id: number;
    teacher?: User;
    scheduled_at: string;
    zoom_link: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: number;
    quiz_id: number;
    type: 'mcq' | 'short_answer';
    question: string;
    options?: string[];
    correct_answer: string;
    points: number;
    order: number;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    batch_id: number;
    batch?: Batch;
    teacher_id: number;
    teacher?: User;
    questions?: Question[];
    questions_count: number;
    start_time: string;
    end_time: string;
    duration: number; // in minutes
    shuffle_questions: boolean;
    shuffle_options: boolean;
    max_attempts: number;
    pass_percentage: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface QuizAttempt {
    id: number;
    quiz_id: number;
    quiz?: Quiz;
    student_id: number;
    student?: User;
    answers: Record<string, string>;
    score: number;
    percentage: number;
    time_spent: number; // in seconds
    started_at: string;
    submitted_at?: string;
    is_completed: boolean;
}

export interface DashboardStats {
    total_users: number;
    total_students: number;
    total_teachers: number;
    total_batches: number;
    total_classes: number;
    total_quizzes: number;
    active_students: number;
}

// Global type declarations
declare global {
    interface Window {
        axios: any;
    }
}