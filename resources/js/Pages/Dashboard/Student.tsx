import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Class, Quiz } from '@/types';

interface StudentDashboardProps extends PageProps {
    upcomingClasses: Class[];
    pendingQuizzes: Quiz[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
    auth, 
    upcomingClasses, 
    pendingQuizzes 
}) => {
    return (
        <AppLayout title="Student Dashboard" auth={auth}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {auth.user?.name}!</h1>
                    <p className="text-gray-600">Check your upcoming classes and pending quizzes.</p>
                </div>

                {/* Upcoming Classes */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Upcoming Classes</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingClasses.map((classItem) => (
                                <div key={classItem.id} className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">{classItem.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(classItem.scheduled_at).toLocaleDateString()} at{' '}
                                        {new Date(classItem.scheduled_at).toLocaleTimeString()}
                                    </p>
                                    {classItem.zoom_link && (
                                        <a
                                            href={classItem.zoom_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                        >
                                            Join Class
                                        </a>
                                    )}
                                </div>
                            ))}
                            {upcomingClasses.length === 0 && (
                                <p className="text-gray-500">No upcoming classes.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Quizzes */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Pending Quizzes</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {pendingQuizzes.map((quiz) => (
                                <div key={quiz.id} className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Due: {new Date(quiz.end_time).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Duration: {quiz.duration} minutes
                                    </p>
                                    <Link
                                        href={`/student/quiz/${quiz.id}`}
                                        className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                    >
                                        Take Quiz
                                    </Link>
                                </div>
                            ))}
                            {pendingQuizzes.length === 0 && (
                                <p className="text-gray-500">No pending quizzes.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

// Shared StatCard component
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100',
        purple: 'text-purple-600 bg-purple-100',
        orange: 'text-orange-600 bg-orange-100',
    };

    return (
        <div className="card p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-md ${colorClasses[color]} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-lg font-medium text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
export { TeacherDashboard, StudentDashboard };