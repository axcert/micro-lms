// resources/js/Components/Layout/TeacherSidebar.tsx

import React from 'react';
import { router } from '@inertiajs/react';
import { User } from '@/types';
import {
    AcademicCapIcon,
    HomeIcon,
    UsersIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon
} from '@/Components/UI/Icons';

interface SidebarItem {
    name: string;
    icon: React.ComponentType<{ className: string }>;
    route: string;
    description: string;
    color: string;
    isActive: boolean;
}

interface TeacherSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    user: User;
    currentPage?: string;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ 
    sidebarOpen, 
    setSidebarOpen, 
    user,
    currentPage = ''
}) => {
    const handleLogout = () => {
        router.post('/logout');
    };

    const sidebarItems: SidebarItem[] = [
        {
            name: 'Dashboard',
            icon: HomeIcon,
            route: '/teacher/dashboard',
            description: 'Overview and quick actions',
            color: 'from-blue-500 to-blue-600',
            isActive: currentPage === 'dashboard'
        },
        {
            name: 'Batch Management',
            icon: UsersIcon,
            route: '/teacher/batches',
            description: 'Create & manage student batches',
            color: 'from-purple-500 to-purple-600',
            isActive: currentPage === 'batches'
        },
        {
            name: 'Class Management',
            icon: CalendarIcon,
            route: '/teacher/classes',
            description: 'Schedule & manage classes',
            color: 'from-indigo-500 to-indigo-600',
            isActive: currentPage === 'classes'
        },
        {
            name: 'Quiz Management',
            icon: ClipboardDocumentListIcon,
            route: '/teacher/quizzes',
            description: 'Create & manage quizzes',
            color: 'from-emerald-500 to-emerald-600',
            isActive: currentPage === 'quizzes'
        },
        {
            name: 'Reports',
            icon: ChartBarIcon,
            route: '/teacher/reports',
            description: 'View analytics & reports',
            color: 'from-orange-500 to-orange-600',
            isActive: currentPage === 'reports'
        }
    ];

    const handleNavigation = (route: string) => {
        router.visit(route);
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            
            {/* Sidebar Header */}
            <div className="relative h-20 px-6 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-500/90"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative flex items-center justify-between h-full">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                            <AcademicCapIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg">Teacher Panel</span>
                            <p className="text-green-100 text-xs">Education Management</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        aria-label="Close sidebar"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-3">
                    {sidebarItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleNavigation(item.route)}
                                className={`w-full group flex items-center px-4 py-4 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] border ${
                                    item.isActive 
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md' 
                                        : 'border-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:border-green-100 hover:shadow-md'
                                }`}
                                aria-label={`Navigate to ${item.name}`}
                            >
                                <div className="flex items-center space-x-4 w-full">
                                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg ${
                                        item.isActive ? 'scale-110' : ''
                                    }`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold transition-colors duration-300 text-sm ${
                                            item.isActive 
                                                ? 'text-green-700' 
                                                : 'text-gray-800 group-hover:text-green-700'
                                        }`}>
                                            {item.name}
                                        </p>
                                        <p className={`text-xs transition-colors duration-300 mt-0.5 truncate ${
                                            item.isActive 
                                                ? 'text-green-600' 
                                                : 'text-gray-500 group-hover:text-green-600'
                                        }`}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Enhanced User Info */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-green-50">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm font-medium"
                    aria-label="Sign out"
                >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default TeacherSidebar;