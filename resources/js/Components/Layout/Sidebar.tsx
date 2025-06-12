import React, { useState } from 'react';
import { 
    Users,
    BarChart3,
    GraduationCap,
    Settings,
    BookOpen,
    ClipboardList,
    Calendar,
    Receipt,
    History,
    User,
    Phone,
    ChevronRight,
    PieChart,
    FileText,
    X
} from 'lucide-react';

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
            case 'admin':
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
                        id: 'user-management',
                        title: 'User Management',
                        icon: Users,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                        onClick: () => handleSectionChange('user-management')
                    },
                    {
                        id: 'teachers',
                        title: 'Teachers',
                        icon: GraduationCap,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        onClick: () => handleSectionChange('teachers')
                    },
                    {
                        id: 'students',
                        title: 'Students',
                        icon: BookOpen,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-50',
                        onClick: () => handleSectionChange('students')
                    },
                    {
                        id: 'reports',
                        title: 'Reports & Analytics',
                        icon: PieChart,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('reports'),
                        submenu: [
                            { id: 'system-reports', title: 'System Reports', onClick: () => handleSubmenuClick('system-reports', 'reports') },
                            { id: 'user-analytics', title: 'User Analytics', onClick: () => handleSubmenuClick('user-analytics', 'reports') },
                            { id: 'financial-reports', title: 'Financial Reports', onClick: () => handleSubmenuClick('financial-reports', 'reports') }
                        ]
                    },
                    {
                        id: 'system-settings',
                        title: 'System Settings',
                        icon: Settings,
                        color: 'text-gray-600',
                        bg: 'bg-gray-50',
                        onClick: () => handleSectionChange('system-settings')
                    }
                ];

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

            case 'student':
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
                        id: 'enrolled-classes',
                        title: 'Enrolled Classes',
                        icon: BookOpen,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                        onClick: () => handleSectionChange('enrolled-classes')
                    },
                    {
                        id: 'order-numbers',
                        title: 'My Order Numbers',
                        icon: Receipt,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        onClick: () => handleSectionChange('order-numbers')
                    },
                    {
                        id: 'history',
                        title: 'History',
                        icon: History,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('history'),
                        submenu: [
                            { id: 'enrolled-history', title: 'Enrolled History', onClick: () => handleSubmenuClick('enrolled-history', 'history') },
                            { id: 'payment-history', title: 'Payment History', onClick: () => handleSubmenuClick('payment-history', 'history') }
                        ]
                    },
                    {
                        id: 'profile',
                        title: 'Profile',
                        icon: User,
                        color: 'text-gray-600',
                        bg: 'bg-gray-50',
                        onClick: () => handleSectionChange('profile')
                    },
                    {
                        id: 'contact',
                        title: 'Contact Details',
                        icon: Phone,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        onClick: () => handleSectionChange('contact')
                    }
                ];

            default:
                return [];
        }
    };

    const navigationItems = getNavigationItems();

    const getRoleTitle = () => {
        switch (userRole) {
            case 'admin': return 'Admin Portal';
            case 'teacher': return 'Teacher Portal';
            case 'student': return 'Student Portal';
            default: return 'Portal';
        }
    };

    const getRoleIcon = () => {
        switch (userRole) {
            case 'admin': return Settings;
            case 'teacher': return GraduationCap;
            case 'student': return BookOpen;
            default: return User;
        }
    };

    const getRoleColors = () => {
        switch (userRole) {
            case 'admin': return {
                gradient: 'from-blue-50 to-purple-50',
                iconBg: 'from-blue-500 to-blue-600',
                supportBtn: 'bg-blue-600 hover:bg-blue-700'
            };
            case 'teacher': return {
                gradient: 'from-green-50 to-blue-50',
                iconBg: 'from-green-500 to-green-600',
                supportBtn: 'bg-green-600 hover:bg-green-700'
            };
            case 'student': return {
                gradient: 'from-purple-50 to-pink-50',
                iconBg: 'from-purple-500 to-purple-600',
                supportBtn: 'bg-purple-600 hover:bg-purple-700'
            };
            default: return {
                gradient: 'from-gray-50 to-gray-100',
                iconBg: 'from-gray-500 to-gray-600',
                supportBtn: 'bg-gray-600 hover:bg-gray-700'
            };
        }
    };

    const RoleIcon = getRoleIcon();
    const colors = getRoleColors();

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
                                    <h2 className="text-lg font-bold text-gray-900">{getRoleTitle()}</h2>
                                    <p className="text-sm text-gray-600 capitalize">{userRole} Dashboard</p>
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

export default UnifiedSidebar;