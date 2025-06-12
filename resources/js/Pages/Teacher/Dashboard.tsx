import React, { useState } from 'react';
import { 
    Users,
    BarChart3,
    GraduationCap,
    LogOut,
    Menu,
    Calendar,
    ClipboardList,
    Plus,
    Eye,
    Clock,
    Video,
    Trophy,
    ChevronRight,
    Settings,
    BookOpen,
    FileText,
    User,
    X
} from 'lucide-react';

// Unified Sidebar Component (included directly)
interface SubMenuItem {
    id: string;
    title: string;
    onClick: () => void;
}

interface SidebarItem {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    onClick?: () => void;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

interface UnifiedSidebarProps {
    userRole: 'admin' | 'teacher' | 'student';
    isOpen: boolean;
    onClose: () => void;
    activeSection: string;
    onSectionChange: (section: string) => void;
    className?: string;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
    userRole,
    isOpen,
    onClose,
    activeSection,
    onSectionChange,
    className = ''
}) => {
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (itemId: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSectionChange = (section: string, closeSubmenu = true) => {
        onSectionChange(section);
        if (closeSubmenu) {
            setExpandedMenus({});
        }
    };

    const handleSubmenuClick = (section: string, parentId: string) => {
        onSectionChange(section);
        setExpandedMenus(prev => ({
            ...prev,
            [parentId]: true
        }));
    };

    const getNavigationItems = (): SidebarItem[] => {
        switch (userRole) {
            case 'teacher':
                return [
                    {
                        id: 'dashboard',
                        title: 'Dashboard',
                        icon: BarChart3,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        onClick: () => handleSectionChange('dashboard')
                    },
                    {
                        id: 'my-batches',
                        title: 'My Batches',
                        icon: Users,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                        onClick: () => handleSectionChange('my-batches')
                    },
                    {
                        id: 'classes',
                        title: 'Classes',
                        icon: Calendar,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('classes'),
                        submenu: [
                            { id: 'schedule-class', title: 'Schedule Class', onClick: () => handleSubmenuClick('schedule-class', 'classes') },
                            { id: 'manage-classes', title: 'Manage Classes', onClick: () => handleSubmenuClick('manage-classes', 'classes') },
                            { id: 'attendance', title: 'Attendance', onClick: () => handleSubmenuClick('attendance', 'classes') }
                        ]
                    },
                    {
                        id: 'quizzes',
                        title: 'Quizzes & Assessments',
                        icon: ClipboardList,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('quizzes'),
                        submenu: [
                            { id: 'create-quiz', title: 'Create Quiz', onClick: () => handleSubmenuClick('create-quiz', 'quizzes') },
                            { id: 'manage-quizzes', title: 'Manage Quizzes', onClick: () => handleSubmenuClick('manage-quizzes', 'quizzes') },
                            { id: 'quiz-results', title: 'Quiz Results', onClick: () => handleSubmenuClick('quiz-results', 'quizzes') }
                        ]
                    },
                    {
                        id: 'reports',
                        title: 'Reports',
                        icon: FileText,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-50',
                        onClick: () => handleSectionChange('reports')
                    },
                    {
                        id: 'profile',
                        title: 'Profile',
                        icon: User,
                        color: 'text-gray-600',
                        bg: 'bg-gray-50',
                        onClick: () => handleSectionChange('profile')
                    }
                ];
            default:
                return [];
        }
    };

    const navigationItems = getNavigationItems();
    const RoleIcon = GraduationCap;
    const colors = {
        gradient: 'from-green-50 to-blue-50',
        iconBg: 'from-green-500 to-green-600',
        supportBtn: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${className}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${colors.gradient}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <RoleIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Teacher Portal</h2>
                                    <p className="text-sm text-gray-600 capitalize">Teacher Dashboard</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeSection === item.id || 
                                           (item.hasSubmenu && item.submenu?.some(sub => activeSection === sub.id));
                            const isExpanded = expandedMenus[item.id] || 
                                             (item.hasSubmenu && item.submenu?.some(sub => activeSection === sub.id));

                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={item.onClick}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                                            isActive
                                                ? `${item.bg} ${item.color} shadow-md`
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <IconComponent className="w-5 h-5 mr-3" />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        {item.hasSubmenu && (
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                isExpanded ? 'rotate-90' : ''
                                            }`} />
                                        )}
                                    </button>

                                    {item.hasSubmenu && isExpanded && (
                                        <div className="ml-8 mt-2 space-y-1">
                                            {item.submenu?.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={subItem.onClick}
                                                    className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                                                        activeSection === subItem.id
                                                            ? `${item.bg} ${item.color}`
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                >
                                                    {subItem.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <div className={`p-4 bg-gradient-to-r ${colors.gradient} rounded-lg`}>
                            <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
                            <button className={`w-full px-3 py-2 ${colors.supportBtn} text-white rounded-lg text-sm font-medium transition-colors`}>
                                Get Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

// Teacher Dashboard Component
interface Batch {
    id: number;
    name: string;
    students_count: number;
}

interface Class {
    id: number;
    title: string;
    scheduled_at: string;
    batch: {
        name: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    attempts_count: number;
    batch: {
        name: string;
    };
}

interface TeacherDashboardProps {
    myBatches: Batch[];
    upcomingClasses: Class[];
    recentQuizzes: Quiz[];
    user: {
        name: string;
        role: 'teacher';
    };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
    myBatches,
    upcomingClasses,
    recentQuizzes,
    user
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/logout';
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }
            
            document.body.appendChild(form);
            form.submit();
        }
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        // Add any routing logic here if needed
        console.log(`Navigating to: ${section}`);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'my-batches':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Batches</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myBatches.map((batch) => (
                                <div key={batch.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">{batch.name}</h3>
                                    <p className="text-sm text-gray-600 flex items-center mb-4">
                                        <Users className="w-4 h-4 mr-1" />
                                        {batch.students_count} students
                                    </p>
                                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                                        Manage Batch
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'schedule-class':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Class</h2>
                        <div className="max-w-md">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter class title..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Select a batch...</option>
                                        {myBatches.map((batch) => (
                                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                                    <input type="datetime-local" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                </div>
                                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    Schedule Class
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'create-quiz':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Quiz</h2>
                        <div className="max-w-md">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter quiz title..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={3} placeholder="Quiz description..."></textarea>
                                </div>
                                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    Create Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* My Batches */}
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                        My Batches
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {myBatches.length > 0 ? (
                                        myBatches.slice(0, 3).map((batch) => (
                                            <div
                                                key={batch.id}
                                                className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-green-700 group-hover/item:text-green-800 transition-colors duration-300">
                                                            {batch.name}
                                                        </p>
                                                        <p className="text-sm text-green-600 flex items-center mt-1">
                                                            <Users className="w-4 h-4 mr-1" />
                                                            {batch.students_count} students
                                                        </p>
                                                    </div>
                                                    <Eye className="w-5 h-5 text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No batches yet</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('my-batches')}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Manage Batches
                                </button>
                            </div>

                            {/* Upcoming Classes */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-gray-700 to-black rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                        Upcoming Classes
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {upcomingClasses.length > 0 ? (
                                        upcomingClasses.slice(0, 3).map((classItem) => (
                                            <div
                                                key={classItem.id}
                                                className="p-4 border-l-4 border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800 group-hover/item:text-black transition-colors duration-300">
                                                            {classItem.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {new Date(classItem.scheduled_at).toLocaleDateString()} at{" "}
                                                            {new Date(classItem.scheduled_at).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                            {classItem.batch.name}
                                                        </p>
                                                    </div>
                                                    <Eye className="w-5 h-5 text-gray-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No upcoming classes</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('schedule-class')}
                                    className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Schedule Class
                                </button>
                            </div>

                            {/* Recent Quizzes */}
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <ClipboardList className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                        Recent Quizzes
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {recentQuizzes.length > 0 ? (
                                        recentQuizzes.slice(0, 3).map((quiz) => (
                                            <div
                                                key={quiz.id}
                                                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-green-700 group-hover/item:text-green-800 transition-colors duration-300">
                                                            {quiz.title}
                                                        </p>
                                                        <p className="text-sm text-green-600 flex items-center mt-1">
                                                            <ClipboardList className="w-4 h-4 mr-1" />
                                                            {quiz.attempts_count} submissions
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 bg-white/80 inline-block px-2 py-1 rounded-full">
                                                            {quiz.batch.name}
                                                        </p>
                                                    </div>
                                                    <Eye className="w-5 h-5 text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No quizzes yet</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('create-quiz')}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Quiz
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                                    {myBatches.length}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Active Batches</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent mb-1">
                                    {upcomingClasses.length}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Upcoming Classes</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                                    {recentQuizzes.length}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Active Quizzes</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                                    {myBatches.reduce((total, batch) => total + batch.students_count, 0)}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Total Students</p>
                            </div>
                        </div>

                        {/* Quick Tools Section */}
                        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                            <div className="relative">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <GraduationCap className="w-6 h-6 mr-2" />
                                    Quick Tools
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setActiveSection('my-batches')}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                                    >
                                        <Users className="w-6 h-6 mb-2" />
                                        <p className="font-semibold">Create Batch</p>
                                        <p className="text-sm text-green-100">Organize new student groups</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('schedule-class')}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                                    >
                                        <Calendar className="w-6 h-6 mb-2" />
                                        <p className="font-semibold">Schedule Class</p>
                                        <p className="text-sm text-green-100">Plan upcoming sessions</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('create-quiz')}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-left"
                                    >
                                        <ClipboardList className="w-6 h-6 mb-2" />
                                        <p className="font-semibold">New Quiz</p>
                                        <p className="text-sm text-green-100">Create assessments</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-green-100 lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50 lg:hidden"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                        Teacher Dashboard
                                    </h1>
                                    <p className="text-gray-600">Welcome back, {user.name}!</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Unified Sidebar */}
                <UnifiedSidebar
                    userRole={user.role}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Default export with sample data for testing
export default () => {
    const sampleData = {
        user: {
            name: 'Dr. Sarah Johnson',
            role: 'teacher' as const
        },
        myBatches: [
            { id: 1, name: 'Mathematics Grade 10 - Section A', students_count: 28 },
            { id: 2, name: 'Physics Advanced Level', students_count: 22 },
            { id: 3, name: 'Chemistry Fundamentals', students_count: 25 }
        ],
        upcomingClasses: [
            {
                id: 1,
                title: 'Algebra Fundamentals',
                scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                batch: { name: 'Mathematics Grade 10' }
            },
            {
                id: 2,
                title: 'Geometry Workshop',
                scheduled_at: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
                batch: { name: 'Mathematics Grade 10' }
            }
        ],
        recentQuizzes: [
            {
                id: 1,
                title: 'Linear Equations Quiz',
                attempts_count: 24,
                batch: { name: 'Mathematics Grade 10' }
            },
            {
                id: 2,
                title: 'Trigonometry Test',
                attempts_count: 18,
                batch: { name: 'Mathematics Grade 10' }
            }
        ]
    };

    return <TeacherDashboard {...sampleData} />;
};