// resources/js/Pages/Teacher/Dashboard.tsx

import React from 'react';
import { Head, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { TeacherDashboardProps } from '@/types';
import {
    PlusIcon,
    EyeIcon,
    UsersIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    AcademicCapIcon
} from '@/Components/UI/Icons';

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
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'draft':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'archived':
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    // Header content with quick action buttons
    const headerContent = (
        <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Dashboard Active</span>
            </div>
        </div>
    );

    return (
        <TeacherLayout 
            user={auth.user} 
            title={`Welcome back, ${auth.user.name.split(' ')[0]}`}
            currentPage="dashboard"
            headerContent={headerContent}
            pageDescription="Ready to inspire and educate your students today?"
        >
            <div className="space-y-8">
                
                {/* Enhanced Quick Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                    {[
                        { 
                            title: 'Active Batches', 
                            value: stats.total_batches, 
                            icon: UsersIcon, 
                            gradient: 'from-blue-500 to-blue-600',
                            bgGradient: 'from-blue-50 to-blue-100',
                            borderColor: 'border-blue-200'
                        },
                        { 
                            title: 'Upcoming Classes', 
                            value: stats.upcoming_classes, 
                            icon: CalendarIcon, 
                            gradient: 'from-purple-500 to-purple-600',
                            bgGradient: 'from-purple-50 to-purple-100',
                            borderColor: 'border-purple-200'
                        },
                        { 
                            title: 'Active Quizzes', 
                            value: stats.active_quizzes, 
                            icon: ClipboardDocumentListIcon, 
                            gradient: 'from-emerald-500 to-emerald-600',
                            bgGradient: 'from-emerald-50 to-emerald-100',
                            borderColor: 'border-emerald-200'
                        },
                        { 
                            title: 'Total Students', 
                            value: stats.total_students, 
                            icon: ChartBarIcon, 
                            gradient: 'from-green-500 to-green-600',
                            bgGradient: 'from-green-50 to-green-100',
                            borderColor: 'border-green-200'
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className={`bg-white rounded-2xl shadow-lg border ${stat.borderColor} p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}>
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.bgGradient} rounded-full -mr-10 -mt-10 opacity-50`}></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`w-8 h-1 bg-gradient-to-r ${stat.gradient} rounded-full`}></div>
                                    </div>
                                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-gray-600 font-medium text-sm">{stat.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Enhanced Main Dashboard Grid */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Enhanced My Batches */}
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <UsersIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                            My Batches
                                        </h2>
                                        <p className="text-sm text-gray-500">Manage student groups</p>
                                    </div>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {myBatches.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {myBatches && myBatches.length > 0 ? (
                                    myBatches.slice(0, 4).map((batch) => (
                                        <div 
                                            key={batch.id} 
                                            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-green-200"
                                            onClick={() => router.visit(`/teacher/batches/${batch.id}`)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-green-800 group-hover/item:text-green-900 transition-colors duration-300 mb-1">
                                                        {batch.name}
                                                    </p>
                                                    <div className="flex items-center text-sm text-green-600">
                                                        <UsersIcon className="w-4 h-4 mr-1" />
                                                        <span>{batch.students_count || batch.student_count} students</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors duration-300">
                                                        <EyeIcon className="w-4 h-4 text-green-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UsersIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No batches yet</p>
                                        <p className="text-xs text-gray-400">Create your first batch to get started</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/teacher/batches')}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Manage Batches
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Upcoming Classes */}
                    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <CalendarIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                                            Upcoming Classes
                                        </h2>
                                        <p className="text-sm text-gray-500">Schedule overview</p>
                                    </div>
                                </div>
                                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {upcomingClasses.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {upcomingClasses && upcomingClasses.length > 0 ? (
                                    upcomingClasses.slice(0, 4).map((classItem) => {
                                        const dateTime = formatDateTime(classItem.scheduled_at);
                                        return (
                                            <div 
                                                key={classItem.id} 
                                                className="p-4 border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-purple-500"
                                                onClick={() => router.visit('/teacher/classes')}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-purple-800 group-hover/item:text-purple-900 transition-colors duration-300 mb-2">
                                                            {classItem.title}
                                                        </p>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-purple-600">
                                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                                <span>{dateTime.date} • {dateTime.time}</span>
                                                            </div>
                                                            <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-purple-700 font-medium">
                                                                {classItem.batch.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors duration-300 ml-3">
                                                        <EyeIcon className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CalendarIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No upcoming classes</p>
                                        <p className="text-xs text-gray-400">Schedule your first class</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/teacher/classes/create')}
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Schedule Class
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Recent Quizzes */}
                    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                                            Recent Quizzes
                                        </h2>
                                        <p className="text-sm text-gray-500">Assessment overview</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {recentQuizzes.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {recentQuizzes && recentQuizzes.length > 0 ? (
                                    recentQuizzes.slice(0, 4).map((quiz) => (
                                        <div 
                                            key={quiz.id} 
                                            className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-emerald-200"
                                            onClick={() => router.visit(`/teacher/quizzes/${quiz.id}`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <p className="font-semibold text-emerald-800 group-hover/item:text-emerald-900 transition-colors duration-300">
                                                            {quiz.title}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getQuizStatusBadge(quiz.status)}`}>
                                                            {quiz.status}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm text-emerald-600">
                                                            <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                                                            <span>{quiz.attempts_count} attempts • {quiz.questions_count} questions</span>
                                                        </div>
                                                        <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-emerald-700 font-medium">
                                                            {quiz.batch.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-200 transition-colors duration-300 ml-3">
                                                    <EyeIcon className="w-4 h-4 text-emerald-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No quizzes yet</p>
                                        <p className="text-xs text-gray-400">Create your first quiz</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/teacher/quizzes/create')}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Create Quiz
                            </button>
                        </div>
                    </div>
                </section>

                {/* Enhanced Quick Actions Section */}
                <section className="relative">
                    <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-3xl shadow-2xl p-8 lg:p-10 text-white relative overflow-hidden">
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
                        
                        <div className="relative">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center justify-center">
                                    <AcademicCapIcon className="w-8 h-8 mr-3" />
                                    Quick Actions
                                </h3>
                                <p className="text-green-100 max-w-2xl mx-auto">
                                    Access your most-used tools quickly and efficiently to streamline your teaching workflow.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Create Batch',
                                        description: 'Organize new student groups',
                                        icon: UsersIcon,
                                        action: () => router.visit('/teacher/batches/create'),
                                        color: 'from-blue-400 to-blue-500'
                                    },
                                    {
                                        title: 'Schedule Class',
                                        description: 'Plan your next lesson',
                                        icon: CalendarIcon,
                                        action: () => router.visit('/teacher/classes/create'),
                                        color: 'from-purple-400 to-purple-500'
                                    },
                                    {
                                        title: 'New Quiz',
                                        description: 'Create assessments',
                                        icon: ClipboardDocumentListIcon,
                                        action: () => router.visit('/teacher/quizzes/create'),
                                        color: 'from-emerald-400 to-emerald-500'
                                    }
                                ].map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <button 
                                            key={index}
                                            onClick={action.action}
                                            className="bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 text-left border border-white/20 hover:border-white/30 group"
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2 group-hover:text-green-100 transition-colors duration-300">
                                                {action.title}
                                            </h4>
                                            <p className="text-sm text-green-100 group-hover:text-white transition-colors duration-300">
                                                {action.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </TeacherLayout>
    );
};

export default TeacherDashboard;