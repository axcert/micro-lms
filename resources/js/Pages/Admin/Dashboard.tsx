import React, { useState } from 'react';

// Simple SVG icons as components (replacing @heroicons/react)
const BookOpenIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const MagnifyingGlassIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const DocumentTextIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const Bars3Icon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XMarkIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

// REUSABLE COMPONENTS

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color: string;
    description?: string;
    trend?: string;
    action?: string;
    onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: IconComponent,
    color,
    description,
    trend,
    action,
    onClick
}) => {
    return (
        <div 
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
            onClick={onClick}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                            {trend}
                        </span>
                    )}
                </div>
                
                <div className="space-y-2 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                    <p className="text-lg font-semibold text-gray-700">{title}</p>
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
                
                {action && (
                    <button className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200">
                        {action}
                    </button>
                )}
            </div>
        </div>
    );
};

// Search and Filter Component
interface SearchFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    filters?: {
        label: string;
        value: string;
        options: { value: string; label: string }[];
        onChange: (value: string) => void;
    }[];
    actions?: React.ReactNode;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
    filters = [],
    actions
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MagnifyingGlassIcon />
                        </div>
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    {filters.map((filter, index) => (
                        <select
                            key={index}
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            {filter.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}
                    
                    {actions}
                </div>
            </div>
        </div>
    );
};

// Empty State Component
interface EmptyStateProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon: IconComponent,
    title,
    description,
    actionLabel,
    onAction
}) => {
    return (
        <div className="text-center py-12">
            <IconComponent className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            {actionLabel && onAction && (
                <div className="mt-6">
                    <button
                        onClick={onAction}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                        {actionLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

// Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ children, variant, size = 'md' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        neutral: 'bg-gray-100 text-gray-800'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs'
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: 'green' | 'gray' | 'white' }> = ({ 
    size = 'md', 
    color = 'green' 
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const colors = {
        green: 'text-green-600',
        gray: 'text-gray-600',
        white: 'text-white'
    };

    return (
        <div className={`animate-spin ${sizes[size]} ${colors[color]}`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                />
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

// Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
                    onClick={onClose}
                />
                
                <div className={`inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

// ADMIN LAYOUT COMPONENT
interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationItems = [
        { name: 'Dashboard', active: true },
        { name: 'User Management', active: false },
        { name: 'Teacher Management', active: false },
        { name: 'Subjects & Batches', active: false },
        { name: 'Class Management', active: false },
        { name: 'Attendance Monitor', active: false },
        { name: 'Exams & Results', active: false },
        { name: 'Performance Reports', active: false },
        { name: 'Document Manager', active: false },
        { name: 'Fee Management', active: false },
        { name: 'Announcements', active: false },
        { name: 'System Settings', active: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <BookOpenIcon />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                            MicroLMS
                        </span>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <XMarkIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigationItems.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                item.active
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <UsersIcon />
                            <span className="ml-3">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-green-100 shadow-sm">
                    <div className="px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    <Bars3Icon />
                                </button>
                                
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                    {subtitle && (
                                        <p className="text-sm text-gray-600">{subtitle}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="hidden md:block relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <MagnifyingGlassIcon />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 w-64 bg-white/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
                                    <BellIcon />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                </button>
                                
                                <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

// MAIN EXAMPLE: Course Management Page using reusable components
const CourseManagementExample: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Sample data
    const courses = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            subject: 'Mathematics',
            status: 'active',
            students: 45,
            lessons: 12
        },
        {
            id: 2,
            title: 'Physics Fundamentals',
            subject: 'Physics',
            status: 'draft',
            students: 0,
            lessons: 8
        },
        {
            id: 3,
            title: 'Chemistry Basics',
            subject: 'Chemistry',
            status: 'active',
            students: 32,
            lessons: 15
        }
    ];

    const stats = {
        totalCourses: 25,
        activeCourses: 18,
        totalStudents: 342,
        totalLessons: 156
    };

    // Filter courses based on search and filters
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
        
        return matchesSearch && matchesSubject && matchesStatus;
    });

    const handleCreateCourse = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setShowCreateModal(false);
        alert('Course created successfully!');
    };

    // Stats data for cards
    const statsData = [
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            icon: BookOpenIcon,
            color: 'from-green-400 via-green-500 to-emerald-600',
            description: 'All created courses',
            trend: '+8%'
        },
        {
            title: 'Active Courses',
            value: stats.activeCourses,
            icon: DocumentTextIcon,
            color: 'from-blue-400 via-blue-500 to-blue-600',
            description: 'Currently running',
            trend: '+12%'
        },
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: UsersIcon,
            color: 'from-purple-400 via-purple-500 to-purple-600',
            description: 'Enrolled learners',
            trend: '+18%'
        },
        {
            title: 'Total Lessons',
            value: stats.totalLessons,
            icon: DocumentTextIcon,
            color: 'from-yellow-400 via-yellow-500 to-yellow-600',
            description: 'Learning materials',
            trend: '+25%'
        }
    ];

    // Filter options
    const filterOptions = [
        {
            label: 'Subject',
            value: selectedSubject,
            options: [
                { value: 'all', label: 'All Subjects' },
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'Physics', label: 'Physics' },
                { value: 'Chemistry', label: 'Chemistry' }
            ],
            onChange: setSelectedSubject
        },
        {
            label: 'Status',
            value: selectedStatus,
            options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' }
            ],
            onChange: setSelectedStatus
        }
    ];

    // Header actions
    const headerActions = (
        <>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Import Courses
            </button>
            <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
            >
                <PlusIcon />
                <span className="ml-2">Create Course</span>
            </button>
        </>
    );

    const getBadgeVariant = (status: string) => {
        const variants = {
            active: 'success' as const,
            draft: 'warning' as const,
            archived: 'neutral' as const
        };
        return variants[status as keyof typeof variants] || 'neutral' as const;
    };

    return (
        <AdminLayout title="Course Management" subtitle="Create and manage your courses and learning materials">
            {/* Stats Cards using reusable component */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        description={stat.description}
                        trend={stat.trend}
                        onClick={() => console.log(`Clicked ${stat.title}`)}
                    />
                ))}
            </div>

            {/* Search and Filters using reusable component */}
            <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search courses by title or subject..."
                filters={filterOptions}
                actions={headerActions}
            />

            {/* Course List or Empty State */}
            {filteredCourses.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Students
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lessons
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {course.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getBadgeVariant(course.status)}>
                                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {course.students}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {course.lessons}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button 
                                                onClick={() => alert(`Viewing course: ${course.title}`)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={BookOpenIcon}
                    title="No courses found"
                    description="Get started by creating your first course or adjust your search filters."
                    actionLabel="Create Course"
                    onAction={() => setShowCreateModal(true)}
                />
            )}

            {/* Create Course Modal using reusable component */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Course"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter course title..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option value="">Choose a subject...</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter course description..."
                        />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateCourse}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" color="white" />
                                    <span className="ml-2">Creating...</span>
                                </>
                            ) : (
                                'Create Course'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Additional Features Section */}
            <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Course Management Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 text-left">
                        <DocumentTextIcon className="w-8 h-8 mb-2" />
                        <h4 className="font-medium">Bulk Upload</h4>
                        <p className="text-sm opacity-90">Upload multiple courses at once</p>
                    </button>
                    
                    <button className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 text-left">
                        <UsersIcon className="w-8 h-8 mb-2" />
                        <h4 className="font-medium">Course Analytics</h4>
                        <p className="text-sm opacity-90">View detailed course performance</p>
                    </button>
                    
                    <button className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 text-left">
                        <BookOpenIcon className="w-8 h-8 mb-2" />
                        <h4 className="font-medium">Course Templates</h4>
                        <p className="text-sm opacity-90">Use predefined course structures</p>
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CourseManagementExample;