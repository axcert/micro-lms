import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    AcademicCapIcon, 
    ClipboardDocumentListIcon,
    CalendarIcon,
    ChartBarIcon,
    TrophyIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    ArrowTopRightOnSquareIcon,
    StarIcon,
    PlayIcon
} from '@heroicons/react/24/outline';

interface Class {
    id: number;
    title: string;
    scheduled_at: string;
    zoom_link?: string;
    batch: {
        name: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    end_time: string;
    batch: {
        name: string;
    };
}

interface Stats {
    averageScore: number;
    quizzesCompleted: number;
    attendance: number;
}

interface StudentDashboardProps {
    myClasses: Class[];
    pendingQuizzes: Quiz[];
    stats: Stats;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
    myClasses = [], 
    pendingQuizzes = [], 
    stats = { averageScore: 0, quizzesCompleted: 0, attendance: 0 }
}) => {
    const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

    const setLoading = (key: string, value: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    };

    const handleLogout = () => {
        setLoading('logout', true);
        router.post('/logout', {}, {
            onFinish: () => setLoading('logout', false)
        });
    };

    const handleJoinClass = (classItem: Class) => {
        try {
            if (classItem.zoom_link) {
                // Open Zoom link in new tab
                window.open(classItem.zoom_link, '_blank', 'noopener,noreferrer');
            } else {
                // Navigate to class details page
                router.visit(`/student/classes/${classItem.id}`);
            }
        } catch (error) {
            console.error('Error joining class:', error);
            // You could show a toast notification here
        }
    };

    const handleStartQuiz = (quiz: Quiz) => {
        setLoading(`quiz-${quiz.id}`, true);
        router.visit(`/student/quizzes/${quiz.id}/take`, {
            onFinish: () => setLoading(`quiz-${quiz.id}`, false),
            onError: (errors) => {
                console.error('Error starting quiz:', errors);
                setLoading(`quiz-${quiz.id}`, false);
            }
        });
    };

    const navigateToSchedule = () => {
        setLoading('schedule', true);
        router.visit('/student/classes', {
            onFinish: () => setLoading('schedule', false),
            onError: () => setLoading('schedule', false)
        });
    };

    const navigateToQuizzes = () => {
        setLoading('quizzes', true);
        router.visit('/student/quizzes', {
            onFinish: () => setLoading('quizzes', false),
            onError: () => setLoading('quizzes', false)
        });
    };

    const navigateToResults = () => {
        setLoading('results', true);
        router.visit('/student/results', {
            onFinish: () => setLoading('results', false),
            onError: () => setLoading('results', false)
        });
    };

    const navigateToProfile = () => {
        setLoading('profile', true);
        router.visit('/student/profile', {
            onFinish: () => setLoading('profile', false),
            onError: () => setLoading('profile', false)
        });
    };

    const isUpcomingClass = (scheduledAt: string) => {
        try {
            const classTime = new Date(scheduledAt);
            const now = new Date();
            
            // Check if date is valid
            if (isNaN(classTime.getTime())) return false;
            
            const timeDiff = classTime.getTime() - now.getTime();
            return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // Next 30 minutes
        } catch (error) {
            console.error('Error checking upcoming class:', error);
            return false;
        }
    };

    const isQuizUrgent = (endTime: string) => {
        try {
            const quizEnd = new Date(endTime);
            const now = new Date();
            
            // Check if date is valid
            if (isNaN(quizEnd.getTime())) return false;
            
            const timeDiff = quizEnd.getTime() - now.getTime();
            return timeDiff <= 24 * 60 * 60 * 1000; // Due within 24 hours
        } catch (error) {
            console.error('Error checking quiz urgency:', error);
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Student Dashboard" />
            
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
                                    Student Dashboard
                                </h1>
                                <p className="text-gray-600">Track your progress and access your classes.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleLogout}
                                disabled={loadingStates.logout}
                                className="bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                {loadingStates.logout ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Enhanced Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div 
                        className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
                        onClick={navigateToResults}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <TrophyIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                            {stats?.averageScore ?? 0}%
                        </p>
                        <p className="text-sm font-medium text-gray-900">Average Score</p>
                        <div className="mt-3 w-full bg-green-100 rounded-full h-2">
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(stats?.averageScore ?? 0, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div 
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={navigateToQuizzes}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <ClipboardDocumentListIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent mb-2">
                            {stats?.quizzesCompleted ?? 0}
                        </p>
                        <p className="text-sm font-medium text-gray-900">Quizzes Completed</p>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                            <div className="h-full bg-gradient-to-r from-gray-700 to-black rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full"></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <ChartBarIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                            {stats?.attendance ?? 0}%
                        </p>
                        <p className="text-sm font-medium text-gray-900">Attendance</p>
                        <div className="mt-3 w-full bg-green-100 rounded-full h-2">
                            <div 
                                className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(stats?.attendance ?? 0, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Enhanced My Classes */}
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3">
                                    <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                    My Classes
                                </h2>
                            </div>
                            {myClasses.length > 0 && (
                                <button
                                    onClick={navigateToSchedule}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                                >
                                    View All
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {myClasses.length > 0 ? (
                                myClasses.map((classItem) => (
                                    <div 
                                        key={classItem.id} 
                                        className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] group/class ${
                                            isUpcomingClass(classItem.scheduled_at) 
                                                ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-400 shadow-lg' 
                                                : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <p className="font-semibold text-green-700 group-hover/class:text-green-800 transition-colors duration-300">
                                                        {classItem.title}
                                                    </p>
                                                    {isUpcomingClass(classItem.scheduled_at) && (
                                                        <span className="ml-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse shadow-md">
                                                            <PlayIcon className="w-3 h-3 inline mr-1" />
                                                            Starting Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                                    <ClockIcon className="w-4 h-4 mr-1" />
                                                    {new Date(classItem.scheduled_at).toLocaleDateString()} at{' '}
                                                    {new Date(classItem.scheduled_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                    {classItem.batch.name}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleJoinClass(classItem)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center shadow-md ${
                                                    isUpcomingClass(classItem.scheduled_at)
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'text-green-600 hover:bg-green-100 border border-green-300'
                                                }`}
                                            >
                                                Join
                                                {classItem.zoom_link && (
                                                    <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No upcoming classes</p>
                                    <button
                                        onClick={navigateToSchedule}
                                        disabled={loadingStates.schedule}
                                        className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {loadingStates.schedule ? 'Loading...' : 'View full schedule'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Pending Quizzes */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-gradient-to-br from-gray-700 to-black rounded-lg mr-3">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                    Pending Quizzes
                                </h2>
                            </div>
                            {pendingQuizzes.length > 0 && (
                                <button
                                    onClick={navigateToQuizzes}
                                    className="text-sm text-gray-700 hover:text-black font-medium transition-colors duration-200"
                                >
                                    View All
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {pendingQuizzes.length > 0 ? (
                                pendingQuizzes.map((quiz) => (
                                    <div 
                                        key={quiz.id} 
                                        className={`p-4 border-l-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] group/quiz ${
                                            isQuizUrgent(quiz.end_time)
                                                ? 'border-red-600 bg-gradient-to-r from-red-50 to-red-100 shadow-lg'
                                                : 'border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <p className={`font-semibold transition-colors duration-300 ${
                                                        isQuizUrgent(quiz.end_time) 
                                                            ? 'text-red-800 group-hover/quiz:text-red-900' 
                                                            : 'text-gray-800 group-hover/quiz:text-black'
                                                    }`}>
                                                        {quiz.title}
                                                    </p>
                                                    {isQuizUrgent(quiz.end_time) && (
                                                        <span className="ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse shadow-md">
                                                            <ClockIcon className="w-3 h-3 inline mr-1" />
                                                            Urgent
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm mt-1 flex items-center ${
                                                    isQuizUrgent(quiz.end_time) ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    <ClockIcon className="w-4 h-4 mr-1" />
                                                    Due: {new Date(quiz.end_time).toLocaleDateString()} at{' '}
                                                    {new Date(quiz.end_time).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                    {quiz.batch.name}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleStartQuiz(quiz)}
                                                disabled={loadingStates[`quiz-${quiz.id}`]}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md ${
                                                    isQuizUrgent(quiz.end_time)
                                                        ? 'bg-red-600 hover:bg-red-700'
                                                        : 'bg-gray-700 hover:bg-black'
                                                }`}
                                            >
                                                {loadingStates[`quiz-${quiz.id}`] ? 'Loading...' : 'Start'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No pending quizzes</p>
                                    <button
                                        onClick={navigateToQuizzes}
                                        disabled={loadingStates.quizzes}
                                        className="text-gray-700 hover:text-black text-sm font-medium disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {loadingStates.quizzes ? 'Loading...' : 'View all quizzes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Quick Links */}
                <div className="mt-8 bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-6 flex items-center">
                        <StarIcon className="w-5 h-5 text-green-600 mr-2" />
                        Quick Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button 
                            onClick={navigateToSchedule}
                            disabled={loadingStates.schedule}
                            className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-center group"
                        >
                            <CalendarIcon className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                {loadingStates.schedule ? 'Loading...' : 'View Schedule'}
                            </p>
                            <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto transition-all duration-300"></div>
                        </button>
                        <button 
                            onClick={navigateToQuizzes}
                            disabled={loadingStates.quizzes}
                            className="p-6 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-center group"
                        >
                            <ClipboardDocumentListIcon className="w-8 h-8 text-black mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-sm font-medium text-gray-800 group-hover:text-black transition-colors duration-300">
                                {loadingStates.quizzes ? 'Loading...' : 'All Quizzes'}
                            </p>
                            <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-gray-700 to-black mx-auto transition-all duration-300"></div>
                        </button>
                        <button 
                            onClick={navigateToResults}
                            disabled={loadingStates.results}
                            className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-center group"
                        >
                            <TrophyIcon className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                {loadingStates.results ? 'Loading...' : 'My Results'}
                            </p>
                            <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto transition-all duration-300"></div>
                        </button>
                        <button 
                            onClick={navigateToProfile}
                            disabled={loadingStates.profile}
                            className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-center group"
                        >
                            <AcademicCapIcon className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                {loadingStates.profile ? 'Loading...' : 'My Profile'}
                            </p>
                            <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto transition-all duration-300"></div>
                        </button>
                    </div>
                </div>

                {/* Learning Progress Section */}
                <div className="mt-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <TrophyIcon className="w-6 h-6 mr-2" />
                            Your Learning Journey
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">{stats?.averageScore ?? 0}%</div>
                                <div className="text-green-100 text-sm">Average Performance</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">{stats?.quizzesCompleted ?? 0}</div>
                                <div className="text-green-100 text-sm">Assessments Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">{stats?.attendance ?? 0}%</div>
                                <div className="text-green-100 text-sm">Class Attendance</div>
                            </div>
                        </div>
                        <div className="mt-6 bg-white/20 rounded-full h-2">
                            <div 
                                className="h-2 bg-white rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min((stats?.averageScore ?? 0), 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-green-100 text-sm mt-2">Keep up the great work! 🌟</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;