import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, DashboardStats } from '@/types';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    CalendarIcon, 
    DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface AdminDashboardProps extends PageProps {
    stats: DashboardStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ auth, stats }) => {
    return (
        <AppLayout title="Admin Dashboard" auth={auth}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {auth.user?.name}!</h1>
                    <p className="text-gray-600">Here's what's happening in your learning management system.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.total_users}
                        icon={UsersIcon}
                        color="blue"
                    />
                    <StatCard
                        title="Total Batches"
                        value={stats.total_batches}
                        icon={AcademicCapIcon}
                        color="green"
                    />
                    <StatCard
                        title="Total Classes"
                        value={stats.total_classes}
                        icon={CalendarIcon}
                        color="purple"
                    />
                    <StatCard
                        title="Total Quizzes"
                        value={stats.total_quizzes}
                        icon={DocumentTextIcon}
                        color="orange"
                    />
                </div>

                {/* Recent Activities */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-500">No recent activities to display.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="btn-primary">
                                Manage Users
                            </button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                                View Reports
                            </button>
                            <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
                                System Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
