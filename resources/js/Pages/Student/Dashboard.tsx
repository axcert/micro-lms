import React, { useState } from 'react';
import { 
    Users,
    BarChart3,
    GraduationCap,
    Settings,
    BookOpen,
    ClipboardList,
    LogOut,
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
    Trophy,
    Eye,
    X,
    Play,
    CheckCircle,
    AlertTriangle
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
                        id: 'my-classes',
                        title: 'My Classes',
                        icon: BookOpen,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('my-classes'),
                        submenu: [
                            { id: 'enrolled-classes', title: 'Enrolled Classes', onClick: () => handleSubmenuClick('enrolled-classes', 'my-classes') },
                            { id: 'class-schedule', title: 'Class Schedule', onClick: () => handleSubmenuClick('class-schedule', 'my-classes') },
                            { id: 'assignments', title: 'Assignments', onClick: () => handleSubmenuClick('assignments', 'my-classes') }
                        ]
                    },
                    {
                        id: 'quizzes',
                        title: 'Quizzes & Tests',
                        icon: ClipboardList,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('quizzes'),
                        submenu: [
                            { id: 'available-quizzes', title: 'Available Quizzes', onClick: () => handleSubmenuClick('available-quizzes', 'quizzes') },
                            { id: 'quiz-results', title: 'My Results', onClick: () => handleSubmenuClick('quiz-results', 'quizzes') },
                            { id: 'quiz-history', title: 'Quiz History', onClick: () => handleSubmenuClick('quiz-history', 'quizzes') }
                        ]
                    },
                    {
                        id: 'progress',
                        title: 'My Progress',
                        icon: Trophy,
                        color: 'text-yellow-600',
                        bg: 'bg-yellow-50',
                        onClick: () => handleSectionChange('progress')
                    },
                    {
                        id: 'order-numbers',
                        title: 'My Orders',
                        icon: Receipt,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('order-numbers'),
                        submenu: [
                            { id: 'current-orders', title: 'Current Orders', onClick: () => handleSubmenuClick('current-orders', 'order-numbers') },
                            { id: 'order-history', title: 'Order History', onClick: () => handleSubmenuClick('order-history', 'order-numbers') }
                        ]
                    },
                    {
                        id: 'payments',
                        title: 'Payments',
                        icon: History,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('payments'),
                        submenu: [
                            { id: 'payment-history', title: 'Payment History', onClick: () => handleSubmenuClick('payment-history', 'payments') },
                            { id: 'payment-methods', title: 'Payment Methods', onClick: () => handleSubmenuClick('payment-methods', 'payments') }
                        ]
                    },
                    {
                        id: 'profile',
                        title: 'My Profile',
                        icon: User,
                        color: 'text-gray-600',
                        bg: 'bg-gray-50',
                        onClick: () => handleSectionChange('profile')
                    },
                    {
                        id: 'support',
                        title: 'Help & Support',
                        icon: Phone,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        hasSubmenu: true,
                        onClick: () => toggleSubmenu('support'),
                        submenu: [
                            { id: 'contact', title: 'Contact Support', onClick: () => handleSubmenuClick('contact', 'support') },
                            { id: 'faq', title: 'FAQ', onClick: () => handleSubmenuClick('faq', 'support') },
                            { id: 'tutorials', title: 'Tutorials', onClick: () => handleSubmenuClick('tutorials', 'support') }
                        ]
                    }
                ];
            default:
                return [];
        }
    };

    const navigationItems = getNavigationItems();
    
    // Debug: Check what navigation items are being generated
    console.log('UnifiedSidebar - User Role:', userRole);
    console.log('Navigation Items:', navigationItems);
    console.log('Navigation Items Length:', navigationItems.length);
    
    const RoleIcon = BookOpen;
    const colors = {
        gradient: 'from-purple-50 to-pink-50',
        iconBg: 'from-purple-500 to-purple-600',
        supportBtn: 'bg-purple-600 hover:bg-purple-700'
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col ${
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${className}`}>
                <div className="flex flex-col h-full">
                    <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${colors.gradient}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <RoleIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Student Portal</h2>
                                    <p className="text-sm text-gray-600">Student Dashboard</p>
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
                        {navigationItems.length === 0 && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">
                                    Debug: No navigation items found. User role: {userRole}
                                </p>
                            </div>
                        )}
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

// Student Dashboard Component
interface Batch {
    id: number;
    name: string;
    teacher_name: string;
    students_count: number;
}

interface Class {
    id: number;
    title: string;
    scheduled_at: string;
    duration: number;
    zoom_link?: string;
    batch: {
        name: string;
    };
    teacher: {
        name: string;
    };
    status: 'upcoming' | 'ongoing' | 'completed';
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    batch: {
        name: string;
    };
    teacher: {
        name: string;
    };
    duration: number;
    questions_count: number;
    start_time: string;
    end_time: string;
    status: 'available' | 'completed' | 'missed' | 'upcoming';
    score?: number;
    total_points?: number;
}

interface StudentDashboardProps {
    user: {
        name: string;
        email: string;
        role: 'student';
    };
    myBatch?: Batch;
    upcomingClasses?: Class[];
    availableQuizzes?: Quiz[];
    recentResults?: Quiz[];
    stats?: {
        classes_attended: number;
        quizzes_completed: number;
        average_score: number;
        current_streak: number;
    };
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
    user = { name: 'Emma Wilson', email: 'emma@student.com', role: 'student' },
    myBatch = {
        id: 1,
        name: 'Mathematics Grade 10 - Section A',
        teacher_name: 'Dr. Sarah Johnson',
        students_count: 28
    },
    upcomingClasses = [
        {
            id: 1,
            title: 'Algebra Fundamentals',
            scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            zoom_link: 'https://zoom.us/j/1234567890',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            status: 'upcoming' as const
        },
        {
            id: 2,
            title: 'Geometry Workshop',
            scheduled_at: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
            duration: 90,
            zoom_link: 'https://zoom.us/j/0987654321',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            status: 'upcoming' as const
        }
    ],
    availableQuizzes = [
        {
            id: 1,
            title: 'Linear Equations Quiz',
            description: 'Test your understanding of linear equations',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            duration: 30,
            questions_count: 15,
            start_time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            status: 'available' as const
        },
        {
            id: 2,
            title: 'Trigonometry Basics',
            description: 'Introduction to trigonometric functions',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            duration: 40,
            questions_count: 18,
            start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            status: 'available' as const
        }
    ],
    recentResults = [
        {
            id: 1,
            title: 'Polynomials Quiz',
            description: '',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            duration: 30,
            questions_count: 10,
            start_time: '',
            end_time: '',
            status: 'completed' as const,
            score: 92,
            total_points: 100
        },
        {
            id: 2,
            title: 'Factorization Test',
            description: '',
            batch: { name: 'Mathematics Grade 10' },
            teacher: { name: 'Dr. Sarah Johnson' },
            duration: 45,
            questions_count: 15,
            start_time: '',
            end_time: '',
            status: 'completed' as const,
            score: 85,
            total_points: 100
        }
    ],
    stats = {
        classes_attended: 24,
        quizzes_completed: 12,
        average_score: 85.3,
        current_streak: 7
    }
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
        console.log(`Navigating to: ${section}`);
    };

    // Debug: Check if user role is correct
    console.log('User object:', user);
    console.log('User role:', user.role);
    console.log('Sidebar open:', sidebarOpen);
    console.log('Active section:', activeSection);

    const joinClass = (classItem: Class) => {
        if (classItem.zoom_link) {
            window.open(classItem.zoom_link, '_blank');
        }
    };

    const takeQuiz = (quiz: Quiz) => {
        alert(`Taking quiz: ${quiz.title}`);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getQuizStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'missed': return 'bg-red-100 text-red-700 border-red-200';
            case 'upcoming': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'enrolled-classes':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Classes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {['Mathematics Grade 10', 'Physics Advanced', 'Chemistry Fundamentals'].map((className, index) => (
                                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center mb-4">
                                        <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                                        <h3 className="font-semibold text-gray-900">{className}</h3>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>Instructor: Dr. Sarah Johnson</p>
                                        <p>Schedule: Mon, Wed, Fri - 2:00 PM</p>
                                        <p>Progress: 75% Complete</p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="h-2 bg-blue-600 rounded-full" style={{width: '75%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" value="Emma Wilson" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value="emma.wilson@email.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input type="tel" value="+1 (555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Grade 10</option>
                                    <option>Grade 11</option>
                                    <option>Grade 12</option>
                                </select>
                            </div>
                        </div>
                        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Update Profile
                        </button>
                    </div>
                );
            case 'contact':
                return (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                                <p className="text-gray-600">Phone: +1 (555) 987-6543</p>
                                <p className="text-gray-600">Email: support@microlms.com</p>
                                <p className="text-gray-600">Hours: Mon-Fri 9AM-6PM</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
                                <p className="text-gray-600">Phone: +1 (555) 987-6544</p>
                                <p className="text-gray-600">Email: tech@microlms.com</p>
                                <p className="text-gray-600">Hours: 24/7</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1">
                                    {stats.classes_attended}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Classes Attended</p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                                    {stats.quizzes_completed}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Quizzes Completed</p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1">
                                    {stats.average_score.toFixed(1)}%
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Average Score</p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-1">
                                    {stats.current_streak}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">Day Streak</p>
                            </div>
                        </div>

                        {/* Main Dashboard Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            
                            {/* Upcoming Classes */}
                            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                        Upcoming Classes
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {upcomingClasses.length > 0 ? (
                                        upcomingClasses.slice(0, 3).map((classItem) => {
                                            const { date, time } = formatDateTime(classItem.scheduled_at);
                                            return (
                                                <div 
                                                    key={classItem.id} 
                                                    className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-blue-700 group-hover/item:text-blue-800 transition-colors duration-300">
                                                                {classItem.title}
                                                            </p>
                                                            <p className="text-sm text-blue-600 flex items-center mt-1">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {date} at {time}
                                                            </p>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {classItem.teacher.name} • {classItem.duration} min
                                                            </p>
                                                        </div>
                                                        {classItem.zoom_link && (
                                                            <button
                                                                onClick={() => joinClass(classItem)}
                                                                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                                                            >
                                                                <Video className="w-4 h-4 mr-1" />
                                                                Join
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No upcoming classes</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('class-schedule')}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    View All Classes
                                </button>
                            </div>

                            {/* Available Quizzes */}
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <ClipboardList className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                        Available Quizzes
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {availableQuizzes.length > 0 ? (
                                        availableQuizzes.slice(0, 3).map((quiz) => {
                                            const { date, time } = formatDateTime(quiz.end_time);
                                            return (
                                                <div 
                                                    key={quiz.id} 
                                                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <p className="font-semibold text-green-700 group-hover/item:text-green-800 transition-colors duration-300">
                                                                    {quiz.title}
                                                                </p>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getQuizStatusColor(quiz.status)}`}>
                                                                    {quiz.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-green-600 flex items-center">
                                                                <ClipboardList className="w-4 h-4 mr-1" />
                                                                {quiz.questions_count} questions • {quiz.duration} min
                                                            </p>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                Due: {date} at {time}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => takeQuiz(quiz)}
                                                            disabled={quiz.status !== 'available'}
                                                            className="ml-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center disabled:cursor-not-allowed"
                                                        >
                                                            <Play className="w-4 h-4 mr-1" />
                                                            {quiz.status === 'available' ? 'Start' : 'Done'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No quizzes available</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('available-quizzes')}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold">
                                    <ClipboardList className="w-5 h-5 mr-2" />
                                    View All Quizzes
                                </button>
                            </div>

                            {/* Recent Results */}
                            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                                        Recent Results
                                    </h2>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {recentResults.length > 0 ? (
                                        recentResults.slice(0, 3).map((result) => (
                                            <div 
                                                key={result.id} 
                                                className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-purple-700 group-hover/item:text-purple-800 transition-colors duration-300">
                                                            {result.title}
                                                        </p>
                                                        <p className="text-sm text-purple-600 flex items-center mt-1">
                                                            <Trophy className="w-4 h-4 mr-1" />
                                                            Score: <span className={`ml-1 font-semibold ${getScoreColor(result.score || 0)}`}>
                                                                {result.score || 0}%
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {result.batch.name}
                                                        </p>
                                                    </div>
                                                    <div className="ml-3 flex items-center">
                                                        {(result.score || 0) >= 80 ? (
                                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                                        ) : (result.score || 0) >= 60 ? (
                                                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-6 h-6 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No results yet</p>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveSection('quiz-results')}
                                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    View All Results
                                </button>
                            </div>
                        </div>

                        {/* My Batch Info */}
                        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 flex items-center">
                                            <Users className="w-6 h-6 mr-2" />
                                            My Batch: {myBatch?.name || 'Not Assigned'}
                                        </h3>
                                        {myBatch && (
                                            <div className="flex items-center space-x-6 text-blue-100">
                                                <div className="flex items-center">
                                                    <BookOpen className="w-5 h-5 mr-2" />
                                                    <span>Teacher: {myBatch.teacher_name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-5 h-5 mr-2" />
                                                    <span>{myBatch.students_count} Students</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                            <p className="text-2xl font-bold">{stats.current_streak}</p>
                                            <p className="text-sm text-blue-100">Days Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <UnifiedSidebar
                userRole={user.role}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-lg border-b border-blue-100">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 lg:hidden"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                            Welcome back, {user.name.split(' ')[0]}!
                                        </h1>
                                        <p className="text-gray-600">Ready to learn something new today?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setActiveSection('profile')}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Profile
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;