import React, { useState, useEffect } from 'react';

// Define types for the props
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    status: string;
}

interface Teacher {
    id: number;
    name: string;
    email: string;
    batches_count: number;
    students_count: number;
    created_at: string;
    status: string;
}

interface ActivityLog {
    id: number;
    action: string;
    user_name: string;
    timestamp: string;
    type: string;
    details: string;
}

interface AdminDashboardProps {
    recentUsers?: User[];
    recentTeachers?: Teacher[];
    recentActivity?: ActivityLog[];
    stats?: {
        total_users: number;
        total_teachers: number;
        total_students: number;
        total_batches: number;
    };
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

interface SidebarItem {
    name: string;
    icon: React.ComponentType<{ className: string }>;
    route: string;
    description: string;
    color: string;
    isActive: boolean;
}

// Simple SVG icons
const UsersIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ClipboardDocumentListIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ChartBarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const PlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const EyeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const CogIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const HomeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const FolderIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25H11.69z" />
    </svg>
);

const QuestionMarkCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const Bars3Icon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XMarkIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const BellIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const MagnifyingGlassIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
    </svg>
);

const ArrowRightOnRectangleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

// Simulate router for navigation
const router = {
    visit: (url: string) => {
        console.log(`Navigating to: ${url}`);
        alert(`Would navigate to: ${url}`);
    },
    post: (url: string) => {
        console.log(`Posting to: ${url}`);
        alert(`Would logout`);
    }
};

// ADMIN SIDEBAR COMPONENT
interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    user: { id: number; name: string; email: string };
    currentPage?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
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
            route: '/admin/dashboard',
            description: 'Overview and system stats',
            color: 'from-blue-500 to-blue-600',
            isActive: currentPage === 'dashboard'
        },
        {
            name: 'User Management',
            icon: UsersIcon,
            route: '/admin/users',
            description: 'Manage all system users',
            color: 'from-purple-500 to-purple-600',
            isActive: currentPage === 'users'
        },
        {
            name: 'Teacher Management',
            icon: AcademicCapIcon,
            route: '/admin/teachers',
            description: 'Create & manage teachers',
            color: 'from-indigo-500 to-indigo-600',
            isActive: currentPage === 'teachers'
        },
        {
            name: 'Batch Management',
            icon: FolderIcon,
            route: '/admin/batches',
            description: 'Oversee student batches',
            color: 'from-emerald-500 to-emerald-600',
            isActive: currentPage === 'batches'
        },
        {
            name: 'Class Oversight',
            icon: CalendarIcon,
            route: '/admin/classes',
            description: 'Monitor all classes',
            color: 'from-orange-500 to-orange-600',
            isActive: currentPage === 'classes'
        },
        {
            name: 'Quiz Oversight',
            icon: QuestionMarkCircleIcon,
            route: '/admin/quizzes',
            description: 'Monitor all quizzes',
            color: 'from-pink-500 to-pink-600',
            isActive: currentPage === 'quizzes'
        },
        {
            name: 'Reports & Analytics',
            icon: ChartBarIcon,
            route: '/admin/reports',
            description: 'System reports & insights',
            color: 'from-cyan-500 to-cyan-600',
            isActive: currentPage === 'reports'
        },
        {
            name: 'System Settings',
            icon: CogIcon,
            route: '/admin/settings',
            description: 'Configure system settings',
            color: 'from-gray-500 to-gray-600',
            isActive: currentPage === 'settings'
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
                            <CogIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg">Admin Panel</span>
                            <p className="text-green-100 text-xs">System Management</p>
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

// ADMIN LAYOUT COMPONENT
interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    headerContent?: React.ReactNode;
    currentPage?: string;
    pageDescription?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
    children, 
    title, 
    subtitle, 
    headerContent, 
    currentPage = 'dashboard',
    pageDescription,
    user
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
            {/* Sidebar */}
            <AdminSidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen}
                user={user}
                currentPage={currentPage}
            />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top header */}
                <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
                    <div className="px-4 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                {/* Mobile menu button */}
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
                                >
                                    <Bars3Icon className="w-6 h-6" />
                                </button>
                                
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
                                    {(subtitle || pageDescription) && (
                                        <p className="text-sm text-gray-600 hidden sm:block">{subtitle || pageDescription}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {headerContent}
                                
                                <div className="hidden lg:block relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <button className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <BellIcon className="w-6 h-6" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                
                                <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 px-4 lg:px-8 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    recentUsers = [], 
    recentTeachers = [], 
    recentActivity = [],
    stats = {
        total_users: 0,
        total_teachers: 0,
        total_students: 0,
        total_batches: 0
    },
    auth = {
        user: { id: 1, name: 'Administrator', email: 'admin@microlms.com' }
    }
}) => {
    // Sample data for demonstration
    const sampleUsers = recentUsers.length ? recentUsers : [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', created_at: '2024-01-15T10:30:00Z', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student', created_at: '2024-01-14T09:15:00Z', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'student', created_at: '2024-01-13T14:20:00Z', status: 'pending' },
    ];

    const sampleTeachers = recentTeachers.length ? recentTeachers : [
        { id: 1, name: 'Dr. Sarah Wilson', email: 'sarah@example.com', batches_count: 3, students_count: 45, created_at: '2024-01-10T08:00:00Z', status: 'active' },
        { id: 2, name: 'Prof. David Brown', email: 'david@example.com', batches_count: 2, students_count: 32, created_at: '2024-01-08T11:30:00Z', status: 'active' },
    ];

    const sampleActivity = recentActivity.length ? recentActivity : [
        { id: 1, action: 'User Registration', user_name: 'John Doe', timestamp: '2024-01-15T10:30:00Z', type: 'user', details: 'New student registered' },
        { id: 2, action: 'Quiz Created', user_name: 'Dr. Sarah Wilson', timestamp: '2024-01-15T09:15:00Z', type: 'quiz', details: 'Mathematics Quiz #5' },
        { id: 3, action: 'Batch Created', user_name: 'Prof. David Brown', timestamp: '2024-01-14T16:45:00Z', type: 'batch', details: 'Physics Advanced Batch' },
    ];

    const sampleStats = {
        total_users: stats.total_users || 156,
        total_teachers: stats.total_teachers || 12,
        total_students: stats.total_students || 144,
        total_batches: stats.total_batches || 18
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user':
                return 'bg-blue-100 text-blue-600';
            case 'quiz':
                return 'bg-purple-100 text-purple-600';
            case 'batch':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // Header content with status indicator
    const headerContent = (
        <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">System Online</span>
            </div>
        </div>
    );

    return (
        <AdminLayout 
            user={auth.user} 
            title={`Welcome back, ${auth.user.name.split(' ')[0]}`}
            currentPage="dashboard"
            headerContent={headerContent}
            pageDescription="Manage your learning management system efficiently"
        >
            <div className="space-y-8">
                
                {/* Enhanced Quick Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                    {[
                        { 
                            title: 'Total Users', 
                            value: sampleStats.total_users, 
                            icon: UsersIcon, 
                            gradient: 'from-blue-500 to-blue-600',
                            bgGradient: 'from-blue-50 to-blue-100',
                            borderColor: 'border-blue-200'
                        },
                        { 
                            title: 'Active Teachers', 
                            value: sampleStats.total_teachers, 
                            icon: AcademicCapIcon, 
                            gradient: 'from-purple-500 to-purple-600',
                            bgGradient: 'from-purple-50 to-purple-100',
                            borderColor: 'border-purple-200'
                        },
                        { 
                            title: 'Total Students', 
                            value: sampleStats.total_students, 
                            icon: UserGroupIcon, 
                            gradient: 'from-emerald-500 to-emerald-600',
                            bgGradient: 'from-emerald-50 to-emerald-100',
                            borderColor: 'border-emerald-200'
                        },
                        { 
                            title: 'Active Batches', 
                            value: sampleStats.total_batches, 
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
                    
                    {/* Enhanced Recent Users */}
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
                                            Recent Users
                                        </h2>
                                        <p className="text-sm text-gray-500">Latest registrations</p>
                                    </div>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {sampleUsers.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {sampleUsers && sampleUsers.length > 0 ? (
                                    sampleUsers.slice(0, 4).map((user) => {
                                        const dateTime = formatDateTime(user.created_at);
                                        return (
                                            <div 
                                                key={user.id} 
                                                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-green-200"
                                                onClick={() => router.visit(`/admin/users/${user.id}`)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-green-800 group-hover/item:text-green-900 transition-colors duration-300 mb-1">
                                                            {user.name}
                                                        </p>
                                                        <div className="flex items-center text-sm text-green-600 mb-1">
                                                            <span>{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                                                                {user.status}
                                                            </span>
                                                            <span className="text-xs text-green-600">{dateTime.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors duration-300">
                                                            <EyeIcon className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UsersIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No users yet</p>
                                        <p className="text-xs text-gray-400">Users will appear here once they register</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/admin/users')}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Manage Users
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Teachers Management */}
                    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <AcademicCapIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                                            Teachers
                                        </h2>
                                        <p className="text-sm text-gray-500">Manage educators</p>
                                    </div>
                                </div>
                                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {sampleTeachers.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {sampleTeachers && sampleTeachers.length > 0 ? (
                                    sampleTeachers.slice(0, 4).map((teacher) => (
                                        <div 
                                            key={teacher.id} 
                                            className="p-4 border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-purple-500"
                                            onClick={() => router.visit(`/admin/teachers/${teacher.id}`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-purple-800 group-hover/item:text-purple-900 transition-colors duration-300 mb-2">
                                                        {teacher.name}
                                                    </p>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm text-purple-600">
                                                            <UserGroupIcon className="w-4 h-4 mr-2" />
                                                            <span>{teacher.batches_count} batches • {teacher.students_count} students</span>
                                                        </div>
                                                        <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-purple-700 font-medium">
                                                            {teacher.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors duration-300 ml-3">
                                                    <EyeIcon className="w-4 h-4 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AcademicCapIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No teachers yet</p>
                                        <p className="text-xs text-gray-400">Create teacher accounts to get started</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/admin/teachers/create')}
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Teacher
                            </button>
                        </div>
                    </div>

                    {/* Enhanced System Activity */}
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
                                            System Activity
                                        </h2>
                                        <p className="text-sm text-gray-500">Recent actions</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {sampleActivity.length}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {sampleActivity && sampleActivity.length > 0 ? (
                                    sampleActivity.slice(0, 4).map((activity) => {
                                        const dateTime = formatDateTime(activity.timestamp);
                                        return (
                                            <div 
                                                key={activity.id} 
                                                className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-emerald-200"
                                                onClick={() => router.visit('/admin/activity-logs')}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <p className="font-semibold text-emerald-800 group-hover/item:text-emerald-900 transition-colors duration-300">
                                                                {activity.action}
                                                            </p>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActivityIcon(activity.type)}`}>
                                                                {activity.type}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-emerald-600">
                                                                <span>by {activity.user_name}</span>
                                                            </div>
                                                            <div className="text-xs text-emerald-600">
                                                                {dateTime.date} • {dateTime.time}
                                                            </div>
                                                            <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-emerald-700 font-medium">
                                                                {activity.details}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-200 transition-colors duration-300 ml-3">
                                                        <EyeIcon className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-1">No activity yet</p>
                                        <p className="text-xs text-gray-400">System activity will appear here</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => router.visit('/admin/activity-logs')}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                View All Logs
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
                                    <CogIcon className="w-8 h-8 mr-3" />
                                    Admin Quick Actions
                                </h3>
                                <p className="text-green-100 max-w-2xl mx-auto">
                                    Access your most important administrative tools quickly and efficiently.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Add Teacher',
                                        description: 'Create new teacher accounts',
                                        icon: AcademicCapIcon,
                                        action: () => router.visit('/admin/teachers/create'),
                                        color: 'from-blue-400 to-blue-500'
                                    },
                                    {
                                        title: 'System Settings',
                                        description: 'Configure platform settings',
                                        icon: CogIcon,
                                        action: () => router.visit('/admin/settings'),
                                        color: 'from-purple-400 to-purple-500'
                                    },
                                    {
                                        title: 'View Reports',
                                        description: 'Analytics and insights',
                                        icon: ChartBarIcon,
                                        action: () => router.visit('/admin/reports'),
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
        </AdminLayout>
    );
};

export default AdminDashboard;