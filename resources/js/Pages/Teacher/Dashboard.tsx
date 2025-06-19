import React from 'react';

// Head component for setting page title
const Head = ({ title }: { title: string }) => {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
    return null;
};

// Router object for navigation
const router = {
    visit: (url: string) => {
        window.location.href = url;
    },
    post: (url: string) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
    }
};

// Custom SVG Icons
const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
    </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const ClipboardDocumentListIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
);

const CalendarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5m-6-10.125a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
    </svg>
);

const ChartBarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ArrowRightOnRectangleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const PlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const EyeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Bars3Icon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XMarkIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface Batch {
    id: number;
    name: string;
    students_count: number;
    description?: string;
}

interface Class {
    id: number;
    title: string;
    scheduled_at: string;
    zoom_link?: string;
    batch: {
        id: number;
        name: string;
    };
}

interface Quiz {
    id: number;
    title: string;
    attempts_count: number;
    status: 'draft' | 'active' | 'archived';
    total_marks: number;
    questions_count: number;
    batch: {
        id: number;
        name: string;
    };
}

interface DashboardStats {
    total_batches: number;
    total_students: number;
    active_quizzes: number;
    upcoming_classes: number;
}

interface TeacherDashboardProps {
    myBatches?: Batch[];
    upcomingClasses?: Class[];
    recentQuizzes?: Quiz[];
    stats?: DashboardStats;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
    myBatches = [], 
    upcomingClasses = [], 
    recentQuizzes = [],
    stats = {
        total_batches: 0,
        total_students: 0,
        active_quizzes: 0,
        upcoming_classes: 0
    },
    auth
}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Early return if user data isn't loaded yet
    if (!auth?.user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <AcademicCapIcon className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-full w-32 mx-auto animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-24 mx-auto animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 mt-4 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        router.post('/logout');
    };

    // Navigation functions
    const navigateToBatches = () => {
        router.visit('/teacher/batches');
    };

    const navigateToCreateBatch = () => {
        router.visit('/teacher/batches/create');
    };

    const navigateToViewBatch = (batchId: number) => {
        router.visit(`/teacher/batches/${batchId}`);
    };

    const navigateToScheduleClass = () => {
        try {
            console.log('Navigating to schedule class...');
            router.visit('/teacher/classes/create');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const navigateToClassesIndex = () => {
        try {
            console.log('Navigating to classes index...');
            router.visit('/teacher/classes');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const navigateToCreateQuiz = () => {
        router.visit('/teacher/quizzes/create');
    };

    const navigateToClasses = () => {
        router.visit('/teacher/classes');
    };

    const navigateToQuizzes = () => {
        router.visit('/teacher/quizzes');
    };

    const navigateToViewQuiz = (quizId: number) => {
        router.visit(`/teacher/quizzes/${quizId}`);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getQuizStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'draft':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'archived':
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const sidebarItems = [
        {
            name: 'Batch Management',
            icon: UserGroupIcon,
            action: navigateToCreateBatch,
            description: 'Create & manage student batches',
            color: 'from-blue-500 to-blue-600'
        },
        {
            name: 'View Classes',
            icon: CalendarIcon,
            action: navigateToClassesIndex,
            description: 'View & manage all classes',
            color: 'from-purple-500 to-purple-600'
        },
        {
            name: 'Schedule Class',
            icon: PlusIcon,
            action: navigateToScheduleClass,
            description: 'Create new class session',
            color: 'from-indigo-500 to-indigo-600'
        },
        {
            name: 'Quiz Management',
            icon: ClipboardDocumentListIcon,
            action: navigateToCreateQuiz,
            description: 'Create & manage quizzes',
            color: 'from-emerald-500 to-emerald-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
            <Head title="Teacher Dashboard" />
            
            {/* Enhanced Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="relative h-20 px-6 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 overflow-hidden">
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
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <div className="space-y-3">
                        {sidebarItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={item.action}
                                    className="w-full group flex items-center px-4 py-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 transition-all duration-300 transform hover:scale-[1.02] border border-transparent hover:border-green-100 hover:shadow-md"
                                >
                                    <div className="flex items-center space-x-4 w-full">
                                        <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300 text-sm">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-300 mt-0.5 truncate">
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
                                {auth.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                            <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm font-medium"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Enhanced Main Content */}
            <div className="flex-1 lg:ml-0 min-h-screen">
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                                >
                                    <Bars3Icon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                                        <AcademicCapIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                                            Welcome back, {auth.user.name.split(' ')[0]}
                                        </h1>
                                        <p className="text-gray-600 text-sm lg:text-base">Ready to inspire and educate your students today?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-100">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-700 text-sm font-medium">Dashboard Active</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Enhanced Dashboard Content */}
                <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    
                    {/* Enhanced Quick Stats */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                        {[
                            { 
                                title: 'Active Batches', 
                                value: stats.total_batches, 
                                icon: UserGroupIcon, 
                                gradient: 'from-blue-500 to-blue-600',
                                bgGradient: 'from-blue-50 to-blue-100',
                                borderColor: 'border-blue-200'
                            },
                            { 
                                title: 'Upcoming Classes', 
                                value: stats.upcoming_classes, 
                                icon: CalendarIcon, 
                                gradient: 'from-purple-500 to-purple-600',
                                bgGradient: 'from-purple-50 to-purple-100',
                                borderColor: 'border-purple-200'
                            },
                            { 
                                title: 'Active Quizzes', 
                                value: stats.active_quizzes, 
                                icon: ClipboardDocumentListIcon, 
                                gradient: 'from-emerald-500 to-emerald-600',
                                bgGradient: 'from-emerald-50 to-emerald-100',
                                borderColor: 'border-emerald-200'
                            },
                            { 
                                title: 'Total Students', 
                                value: stats.total_students, 
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
                        
                        {/* Enhanced My Batches */}
                        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <UserGroupIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                                My Batches
                                            </h2>
                                            <p className="text-sm text-gray-500">Manage student groups</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {myBatches.length}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {myBatches && myBatches.length > 0 ? (
                                        myBatches.slice(0, 4).map((batch) => (
                                            <div 
                                                key={batch.id} 
                                                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-green-200"
                                                onClick={() => navigateToViewBatch(batch.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-green-800 group-hover/item:text-green-900 transition-colors duration-300 mb-1">
                                                            {batch.name}
                                                        </p>
                                                        <div className="flex items-center text-sm text-green-600">
                                                            <UserGroupIcon className="w-4 h-4 mr-1" />
                                                            <span>{batch.students_count} students</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors duration-300">
                                                            <EyeIcon className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <UserGroupIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-1">No batches yet</p>
                                            <p className="text-xs text-gray-400">Create your first batch to get started</p>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={navigateToBatches}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Manage Batches
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Upcoming Classes */}
                        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <CalendarIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                                                Upcoming Classes
                                            </h2>
                                            <p className="text-sm text-gray-500">Schedule overview</p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {upcomingClasses.length}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {upcomingClasses && upcomingClasses.length > 0 ? (
                                        upcomingClasses.slice(0, 4).map((classItem) => {
                                            const dateTime = formatDateTime(classItem.scheduled_at);
                                            return (
                                                <div 
                                                    key={classItem.id} 
                                                    className="p-4 border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-purple-500"
                                                    onClick={navigateToClasses}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-purple-800 group-hover/item:text-purple-900 transition-colors duration-300 mb-2">
                                                                {classItem.title}
                                                            </p>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center text-sm text-purple-600">
                                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                                    <span>{dateTime.date} • {dateTime.time}</span>
                                                                </div>
                                                                <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-purple-700 font-medium">
                                                                    {classItem.batch.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors duration-300 ml-3">
                                                            <EyeIcon className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CalendarIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-1">No upcoming classes</p>
                                            <p className="text-xs text-gray-400">Schedule your first class</p>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={navigateToScheduleClass}
                                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Schedule Class
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Recent Quizzes */}
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
                                                Recent Quizzes
                                            </h2>
                                            <p className="text-sm text-gray-500">Assessment overview</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {recentQuizzes.length}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {recentQuizzes && recentQuizzes.length > 0 ? (
                                        recentQuizzes.slice(0, 4).map((quiz) => (
                                            <div 
                                                key={quiz.id} 
                                                className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group/item cursor-pointer hover:border-emerald-200"
                                                onClick={() => navigateToViewQuiz(quiz.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <p className="font-semibold text-emerald-800 group-hover/item:text-emerald-900 transition-colors duration-300">
                                                                {quiz.title}
                                                            </p>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getQuizStatusBadge(quiz.status)}`}>
                                                                {quiz.status}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-emerald-600">
                                                                <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                                                                <span>{quiz.attempts_count} attempts • {quiz.questions_count} questions</span>
                                                            </div>
                                                            <div className="bg-white/80 inline-block px-2 py-1 rounded-lg text-xs text-emerald-700 font-medium">
                                                                {quiz.batch.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-200 transition-colors duration-300 ml-3">
                                                        <EyeIcon className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-1">No quizzes yet</p>
                                            <p className="text-xs text-gray-400">Create your first quiz</p>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={navigateToCreateQuiz}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Create Quiz
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
                                        <AcademicCapIcon className="w-8 h-8 mr-3" />
                                        Quick Actions
                                    </h3>
                                    <p className="text-green-100 max-w-2xl mx-auto">
                                        Access your most-used tools quickly and efficiently to streamline your teaching workflow.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            title: 'Create Batch',
                                            description: 'Organize new student groups',
                                            icon: UserGroupIcon,
                                            action: navigateToCreateBatch,
                                            color: 'from-blue-400 to-blue-500'
                                        },
                                        {
                                            title: 'View Classes',
                                            description: 'Manage all class sessions',
                                            icon: CalendarIcon,
                                            action: navigateToClassesIndex,
                                            color: 'from-purple-400 to-purple-500'
                                        },
                                        {
                                            title: 'New Quiz',
                                            description: 'Create assessments',
                                            icon: ClipboardDocumentListIcon,
                                            action: navigateToCreateQuiz,
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
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;