import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Batch, Class, Quiz } from '@/types';

interface TeacherDashboardProps extends PageProps {
    batches: Batch[];
    upcomingClasses: Class[];
    recentQuizzes: Quiz[];
    stats: {
        total_batches: number;
        upcoming_classes: number;
        pending_quizzes: number;
    };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
    auth, 
    batches, 
    upcomingClasses, 
    recentQuizzes, 
    stats 
}) => {
    return (
        <AppLayout title="Teacher Dashboard" auth={auth}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {auth.user?.name}!</h1>
                    <p className="text-gray-600">Manage your classes, batches, and quizzes from here.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900">My Batches</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total_batches}</p>
                        <p className="text-sm text-gray-500 mt-1">Active batches</p>
                    </div>
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.upcoming_classes}</p>
                        <p className="text-sm text-gray-500 mt-1">This week</p>
                    </div>
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Quizzes</h3>
                        <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending_quizzes}</p>
                        <p className="text-sm text-gray-500 mt-1">To be reviewed</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* My Batches */}
                    <div className="card">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">My Batches</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {batches.map((batch) => (
                                    <div key={batch.id} className="border rounded-lg p-3">
                                        <h3 className="font-medium">{batch.name}</h3>
                                        <p className="text-sm text-gray-600">{batch.students_count} students</p>
                                    </div>
                                ))}
                                {batches.length === 0 && (
                                    <p className="text-gray-500 text-sm">No batches created yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="card">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Upcoming Classes</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {upcomingClasses.map((classItem) => (
                                    <div key={classItem.id} className="border rounded-lg p-3">
                                        <h3 className="font-medium">{classItem.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(classItem.scheduled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                                {upcomingClasses.length === 0 && (
                                    <p className="text-gray-500 text-sm">No upcoming classes.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/teacher/batches"
                                className="btn-primary text-center"
                            >
                                Manage Batches
                            </Link>
                            <Link
                                href="/teacher/classes"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-center"
                            >
                                Schedule Class
                            </Link>
                            <Link
                                href="/teacher/quiz/create"
                                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-center"
                            >
                                Create Quiz
                            </Link>
                            <Link
                                href="/teacher/quizzes"
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-center"
                            >
                                View Quizzes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};