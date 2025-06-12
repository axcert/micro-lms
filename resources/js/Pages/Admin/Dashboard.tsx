import React, { useState, useRef, useEffect } from 'react';
import { 
    Users,
    BarChart3,
    GraduationCap,
    Settings,
    BookOpen,
    ClipboardList,
    LogOut,
    Bell,
    Search,
    CheckCircle,
    AlertTriangle,
    Info,
    X,
    Eye,
    Menu,
    Calendar,
    Receipt,
    History,
    User,
    Phone,
    ChevronRight,
    Star,
    PieChart,
    FileText,
    Plus,
    Clock,
    Video,
    Trophy
} from 'lucide-react';

// Unified Sidebar Component
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
            default:
                return [];
        }
    };

    const navigationItems = getNavigationItems();
    const RoleIcon = Settings;
    const colors = {
        gradient: 'from-blue-50 to-purple-50',
        iconBg: 'from-blue-500 to-blue-600',
        supportBtn: 'bg-blue-600 hover:bg-blue-700'
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${className}`}>
                <div className="flex flex-col h-full">
                    <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${colors.gradient}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <RoleIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Admin Portal</h2>
                                    <p className="text-sm text-gray-600">Admin Dashboard</p>
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

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

// Admin Dashboard Component
interface AdminStats {
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
    totalBatches: number;
    totalClasses: number;
    totalQuizzes: number;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    time: string;
    read: boolean;
}

interface AdminDashboardProps {
    user: {
        name: string;
        role: 'admin';
    };
    stats: AdminStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, stats }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: 'System Update',
            message: 'System maintenance scheduled for tonight at 11 PM',
            type: 'info',
            time: '5 minutes ago',
            read: false
        },
        {
            id: 2,
            title: 'New Student Registration',
            message: '3 new students have registered and are awaiting approval',
            type: 'success',
            time: '15 minutes ago',
            read: false
        },
        {
            id: 3,
            title: 'Storage Warning',
            message: 'Database storage is at 85% capacity',
            type: 'warning',
            time: '1 hour ago',
            read: false
        }
    ]);
    
    const notificationRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        console.log(`Navigating to: ${section}`);
    };

    const markAsRead = (notificationId: number) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const removeNotification = (notificationId: number) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getNotificationStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-l-green-500 bg-green-50';
            case 'warning':
                return 'border-l-amber-500 bg-amber-50';
            case 'error':
                return 'border-l-red-500 bg-red-50';
            default:
                return 'border-l-blue-500 bg-blue-50';
        }
    };

    const dashboardCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-green-400 via-green-500 to-emerald-600',
            description: 'All registered users',
            trend: '+12%'
        },
        {
            title: 'Teachers',
            value: stats.totalTeachers,
            icon: Users,
            color: 'from-gray-700 via-gray-800 to-black',
            description: 'Active instructors',
            trend: '+5%'
        },
        {
            title: 'Students',
            value: stats.totalStudents,
            icon: GraduationCap,
            color: 'from-green-500 via-green-600 to-green-700',
            description: 'Enrolled learners',
            trend: '+18%'
        },
        {
            title: 'Active Batches',
            value: stats.totalBatches,
            icon: BookOpen,
            color: 'from-gray-600 via-gray-700 to-gray-900',
            description: 'Running courses',
            trend: '+8%'
        },
        {
            title: 'Total Classes',
            value: stats.totalClasses,
            icon: BarChart3,
            color: 'from-emerald-400 via-green-500 to-green-600',
            description: 'Scheduled sessions',
            trend: '+25%'
        },
        {
            title: 'Total Quizzes',
            value: stats.totalQuizzes,
            icon: ClipboardList,
            color: 'from-black via-gray-800 to-gray-700',
            description: 'Assessment tests',
            trend: '+15%'
        }
    ];

    const renderContent = () => {
        if (activeSection !== 'dashboard') {
            return (
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {activeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                    <p className="text-gray-600">Content for {activeSection} section will be displayed here.</p>
                    
                    {activeSection === 'user-management' && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800 mb-2">Manage Users</h3>
                                <p className="text-blue-700 text-sm">Add, edit, or remove user accounts</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-green-800 mb-2">Role Management</h3>
                                <p className="text-green-700 text-sm">Assign and modify user roles</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h3 className="font-semibold text-purple-800 mb-2">Access Control</h3>
                                <p className="text-purple-700 text-sm">Set permissions and access levels</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
                    <p className="text-gray-600">Here's an overview of your learning management system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {dashboardCards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <div 
                                key={index} 
                                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                
                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            {card.trend}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                            {card.value.toLocaleString()}
                                        </h3>
                                        <p className="text-lg font-semibold text-gray-700">{card.title}</p>
                                        <p className="text-sm text-gray-500">{card.description}</p>
                                    </div>
                                    
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        </div>
                    </div>

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
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-green-100 shadow-sm lg:ml-64">
                <div className="px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50 lg:hidden"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                        Admin Portal
                                    </h1>
                                </div>
                            </div>
                            
                            <div className="hidden md:block relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-64 bg-white/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
                                >
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                                                <div className="flex items-center space-x-2">
                                                    {unreadCount > 0 && (
                                                        <button 
                                                            onClick={markAllAsRead}
                                                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                    <span className="text-sm text-gray-500">
                                                        {unreadCount} unread
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500">
                                                    <Bell className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                                    <p>No notifications</p>
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div 
                                                        key={notification.id}
                                                        className={`p-4 border-l-4 ${getNotificationStyles(notification.type)} ${
                                                            !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                                                        } border-b border-gray-50 last:border-b-0 hover:bg-opacity-75 transition-all duration-200`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            {getNotificationIcon(notification.type)}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className={`text-sm font-semibold ${
                                                                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                                                                        }`}>
                                                                            {notification.title}
                                                                        </p>
                                                                        <p className={`text-sm mt-1 ${
                                                                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                                                                        }`}>
                                                                            {notification.message}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                            {notification.time}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 ml-2">
                                                                        {!notification.read && (
                                                                            <button
                                                                                onClick={() => markAsRead(notification.id)}
                                                                                className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                                                                                title="Mark as read"
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => removeNotification(notification.id)}
                                                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                                                            title="Remove notification"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                                            <button className="w-full text-sm text-center text-green-600 hover:text-green-700 font-medium">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                                <Settings className="w-4 h-4 inline mr-2" />
                                Settings
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                <UnifiedSidebar
                    userRole="admin"
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />

                <div className="flex-1 p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Default export with sample data
export default () => {
    const sampleData = {
        user: {
            name: 'Administrator',
            role: 'admin' as const
        },
        stats: {
            totalUsers: 156,
            totalTeachers: 12,
            totalStudents: 144,
            totalBatches: 8,
            totalClasses: 45,
            totalQuizzes: 23
        }
    };

    return <AdminDashboard {...sampleData} />;
};