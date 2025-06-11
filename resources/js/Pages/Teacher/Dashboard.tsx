import React from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    AcademicCapIcon, 
    UserGroupIcon, 
    ClipboardDocumentListIcon,
    CalendarIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface Batch {
    id: number;
    name: string;
    students_count: number;
    description?: string;
}

interface Class {
    id: number;
    title: string;
    scheduled_at: string;
    zoom_link?: string;
    batch: {
        id: number;
        name: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    attempts_count: number;
    status: 'draft' | 'active' | 'archived';
    total_marks: number;
    questions_count: number;
    batch: {
        id: number;
        name: string;
    };
}

interface DashboardStats {
    total_batches: number;
    total_students: number;
    active_quizzes: number;
    upcoming_classes: number;
}

interface TeacherDashboardProps {
    myBatches?: Batch[];
    upcomingClasses?: Class[];
    recentQuizzes?: Quiz[];
    stats?: DashboardStats;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
    myBatches = [], 
    upcomingClasses = [], 
    recentQuizzes = [],
    stats = {
        total_batches: 0,
        total_students: 0,
        active_quizzes: 0,
        upcoming_classes: 0
    },
    auth
}) => {
    // Early return if user data isn't loaded yet
    if (!auth?.user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <AcademicCapIcon className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        router.post('/logout');
    };

    // Navigation functions
    const navigateToBatches = () => {
        router.visit('/teacher/batches');
    };

    const navigateToCreateBatch = () => {
        router.visit('/teacher/batches/create');
    };

    const navigateToViewBatch = (batchId: number) => {
        router.visit(`/teacher/batches/${batchId}`);
    };

    const navigateToScheduleClass = () => {
        router.visit('/teacher/classes/create');
    };

    const navigateToCreateQuiz = () => {
        router.visit('/teacher/quizzes/create');
    };

    const navigateToClasses = () => {
        router.visit('/teacher/classes');
    };

    const navigateToQuizzes = () => {
        router.visit('/teacher/quizzes');
    };

    const navigateToViewQuiz = (quizId: number) => {
        router.visit(`/teacher/quizzes/${quizId}`);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getQuizStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Teacher Dashboard" />
            
            {/* Enhanced Header */}
            <div className="bg-white shadow-lg border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <AcademicCapIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                    Welcome, {auth.user.name}
                                </h1>
                                <p className="text-gray-600">Manage your classes, students, and assessments.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Logged in as</p>
                                <p className="font-medium text-gray-900">{auth.user.email}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* My Batches */}
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                <UserGroupIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                My Batches
                            </h2>
                        </div>
                        <div className="space-y-3 mb-6">
                            {myBatches && myBatches.length > 0 ? (
                                myBatches.slice(0, 3).map((batch) => (
                                    <div 
                                        key={batch.id} 
                                        className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                        onClick={() => navigateToViewBatch(batch.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-green-700 group-hover/item:text-green-800 transition-colors duration-300">
                                                    {batch.name}
                                                </p>
                                                <p className="text-sm text-green-600 flex items-center mt-1">
                                                    <UserGroupIcon className="w-4 h-4 mr-1" />
                                                    {batch.students_count} students
                                                </p>
                                            </div>
                                            <EyeIcon className="w-5 h-5 text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No batches yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Create your first batch to get started</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={navigateToBatches}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Manage Batches
                        </button>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-gradient-to-br from-gray-700 to-black rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                Upcoming Classes
                            </h2>
                        </div>
                        <div className="space-y-3 mb-6">
                            {upcomingClasses && upcomingClasses.length > 0 ? (
                                upcomingClasses.slice(0, 3).map((classItem) => {
                                    const dateTime = formatDateTime(classItem.scheduled_at);
                                    return (
                                        <div 
                                            key={classItem.id} 
                                            className="p-4 border-l-4 border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                            onClick={navigateToClasses}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 group-hover/item:text-black transition-colors duration-300">
                                                        {classItem.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                        <CalendarIcon className="w-4 h-4 mr-1" />
                                                        {dateTime.date} at {dateTime.time}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                        {classItem.batch.name}
                                                    </p>
                                                </div>
                                                <EyeIcon className="w-5 h-5 text-gray-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No upcoming classes</p>
                                    <p className="text-xs text-gray-400 mt-1">Schedule your first class</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={navigateToScheduleClass}
                            className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Schedule Class
                        </button>
                    </div>

                    {/* Recent Quizzes */}
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                Recent Quizzes
                            </h2>
                        </div>
                        <div className="space-y-3 mb-6">
                            {recentQuizzes && recentQuizzes.length > 0 ? (
                                recentQuizzes.slice(0, 3).map((quiz) => (
                                    <div 
                                        key={quiz.id} 
                                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                        onClick={() => navigateToViewQuiz(quiz.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <p className="font-semibold text-green-700 group-hover/item:text-green-800 transition-colors duration-300">
                                                        {quiz.title}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getQuizStatusBadge(quiz.status)}`}>
                                                        {quiz.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-green-600 flex items-center mt-1">
                                                    <ClipboardDocumentListIcon className="w-4 h-4 mr-1" />
                                                    {quiz.attempts_count} attempts • {quiz.questions_count} questions
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                    {quiz.batch.name}
                                                </p>
                                            </div>
                                            <EyeIcon className="w-5 h-5 text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No quizzes yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Create your first quiz</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={navigateToCreateQuiz}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Quiz
                        </button>
                    </div>
                </div>

                {/* Enhanced Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                            {stats.total_batches}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">Active Batches</p>
                        <div className="mt-3 w-full bg-green-100 rounded-full h-1">
                            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full"></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent mb-1">
                            {stats.upcoming_classes}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">Upcoming Classes</p>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-1">
                            <div className="h-full bg-gradient-to-r from-gray-700 to-black rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full"></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                            {stats.active_quizzes}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">Active Quizzes</p>
                        <div className="mt-3 w-full bg-green-100 rounded-full h-1">
                            <div className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full"></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                            {stats.total_students}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">Total Students</p>
                        <div className="mt-3 w-full bg-green-100 rounded-full h-1">
                            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full"></div>
                        </div>
                    </div>
                </div>

                {/* Additional Teacher Tools Section */}
                <div className="mt-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <AcademicCapIcon className="w-6 h-6 mr-2" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                                onClick={navigateToCreateBatch}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                            >
                                <UserGroupIcon className="w-6 h-6 mb-2" />
                                <p className="font-semibold">Create Batch</p>
                                <p className="text-sm text-green-100">Organize new student groups</p>
                            </button>
                            <button 
                                onClick={navigateToScheduleClass}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                            >
                                <CalendarIcon className="w-6 h-6 mb-2" />
                                <p className="font-semibold">Schedule Class</p>
                                <p className="text-sm text-green-100">Plan upcoming sessions</p>
                            </button>
                            <button 
                                onClick={navigateToCreateQuiz}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                            >
                                <ClipboardDocumentListIcon className="w-6 h-6 mb-2" />
                                <p className="font-semibold">New Quiz</p>
                                <p className="text-sm text-green-100">Create Assessments</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;