import React from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    UsersIcon, 
    ChartBarIcon, 
    AcademicCapIcon, 
    CogIcon,
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Stats {
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
    totalBatches: number;
    totalClasses: number;
    totalQuizzes: number;
}

interface AdminDashboardProps {
    stats: Stats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
    const handleLogout = () => {
        router.post('/logout');
    };

    const dashboardCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'from-green-400 via-green-500 to-emerald-600',
            description: 'All registered users',
            trend: '+12%'
        },
        {
            title: 'Teachers',
            value: stats.totalTeachers,
            icon: UserGroupIcon,
            color: 'from-gray-700 via-gray-800 to-black',
            description: 'Active instructors',
            trend: '+5%'
        },
        {
            title: 'Students',
            value: stats.totalStudents,
            icon: AcademicCapIcon,
            color: 'from-green-500 via-green-600 to-green-700',
            description: 'Enrolled learners',
            trend: '+18%'
        },
        {
            title: 'Active Batches',
            value: stats.totalBatches,
            icon: BookOpenIcon,
            color: 'from-gray-600 via-gray-700 to-gray-900',
            description: 'Running courses',
            trend: '+8%'
        },
        {
            title: 'Total Classes',
            value: stats.totalClasses,
            icon: ChartBarIcon,
            color: 'from-emerald-400 via-green-500 to-green-600',
            description: 'Scheduled sessions',
            trend: '+25%'
        },
        {
            title: 'Total Quizzes',
            value: stats.totalQuizzes,
            icon: ClipboardDocumentListIcon,
            color: 'from-black via-gray-800 to-gray-700',
            description: 'Assessment tests',
            trend: '+15%'
        }
    ];

    const quickActions = [
        { title: 'User Management', icon: UsersIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        { title: 'Analytics', icon: ChartBarIcon, color: 'text-black', bg: 'bg-gray-50', border: 'border-gray-200' },
        { title: 'System Config', icon: CogIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <Head title="Admin Dashboard" />
            
            {/* Modern Header with Glass Effect */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-green-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Section */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <AcademicCapIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                        Admin Portal
                                    </h1>
                                </div>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="hidden md:block relative">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-64 bg-white/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
                                <BellIcon className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            </button>
                            
                            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                <CogIcon className="w-4 h-4 inline mr-2" />
                                Settings
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h2>
                    <p className="text-gray-600">Here's an overview of your learning management system.</p>
                </div>

                {/* Stats Cards - New Vertical Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {dashboardCards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <div 
                                key={index} 
                                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                
                                {/* Content */}
                                <div className="relative p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            {card.trend}
                                        </span>
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                            {card.value.toLocaleString()}
                                        </h3>
                                        <p className="text-lg font-semibold text-gray-700">{card.title}</p>
                                        <p className="text-sm text-gray-500">{card.description}</p>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className={`h-full bg-gradient-to-r ${card.color} rounded-full transform transition-all duration-1000 group-hover:translate-x-0 -translate-x-full`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-6">
                                Quick Actions
                            </h3>
                            <div className="space-y-4">
                                {quickActions.map((action, index) => {
                                    const IconComponent = action.icon;
                                    return (
                                        <button 
                                            key={index}
                                            className={`w-full p-4 ${action.bg} ${action.border} border rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105 group`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <IconComponent className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform duration-300`} />
                                                <span className="font-medium text-gray-800 group-hover:text-gray-900">{action.title}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activity & System Status */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-6">
                                System Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all duration-300">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">System Health Check Completed</p>
                                        <p className="text-sm text-gray-600">All systems running optimally</p>
                                        <p className="text-xs text-green-600 mt-1">2 minutes ago</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-gray-600 hover:shadow-md transition-all duration-300">
                                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">New Student Registrations</p>
                                        <p className="text-sm text-gray-600">5 new students joined today</p>
                                        <p className="text-xs text-gray-600 mt-1">15 minutes ago</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-emerald-500 hover:shadow-md transition-all duration-300">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Quiz Submissions Processed</p>
                                        <p className="text-sm text-gray-600">45 quiz submissions reviewed</p>
                                        <p className="text-xs text-emerald-600 mt-1">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Performance */}
                        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                            
                            <div className="relative">
                                <h3 className="text-lg font-bold mb-4">System Performance</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-green-100 text-sm">Server Uptime</p>
                                        <p className="text-2xl font-bold">99.9%</p>
                                    </div>
                                    <div>
                                        <p className="text-green-100 text-sm">Active Sessions</p>
                                        <p className="text-2xl font-bold">127</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>CPU Usage</span>
                                            <span>45%</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div className="bg-white h-2 rounded-full" style={{width: '45%'}}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Memory Usage</span>
                                            <span>62%</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div className="bg-white h-2 rounded-full" style={{width: '62%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;