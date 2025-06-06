import React from 'react';

// Custom SVG Icons (same as used in other components for consistency)
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

const CheckIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ArrowRightOnRectangleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
}

const Welcome: React.FC<WelcomeProps> = ({ canLogin, canRegister, auth }) => {
    const isLoggedIn = auth?.user !== null;

    const handleLogout = () => {
        // In a real implementation, this would be: router.post('/logout');
        window.location.href = '/logout';
    };

    const getDashboardRoute = () => {
        if (!auth?.user) return '/login';
        
        switch (auth.user.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'teacher':
                return '/teacher/dashboard';
            case 'student':
                return '/student/dashboard';
            default:
                return '/dashboard';
        }
    };

    const features = [
        {
            icon: UserGroupIcon,
            title: 'Batch Management',
            description: 'Organize students into batches and manage classes efficiently'
        },
        {
            icon: ClipboardDocumentListIcon,
            title: 'Interactive Quizzes',
            description: 'Create and manage quizzes with MCQ and short answer questions'
        },
        {
            icon: ChartBarIcon,
            title: 'Progress Tracking',
            description: 'Monitor student progress and generate detailed reports'
        },
        {
            icon: AcademicCapIcon,
            title: 'Online Classes',
            description: 'Seamless integration with Zoom for virtual learning'
        }
    ];

    const benefits = [
        'Easy student enrollment and management',
        'Automated attendance tracking',
        'Real-time quiz and assessment tools',
        'WhatsApp notifications for reminders',
        'Secure payment processing',
        'Comprehensive reporting system'
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/30 rounded-full -translate-x-32 -translate-y-32"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-100/20 rounded-full translate-x-48"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-50/40 rounded-full translate-y-32"></div>
            </div>
            
            {/* Header */}
            <header className="relative z-10 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center group">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative">
                                <AcademicCapIcon className="w-7 h-7 text-white" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-lime-400 to-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                                    Micro LMS
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">Learning Management System</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <div className="text-sm text-gray-600 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200">
                                        Welcome, <span className="font-semibold text-gray-900">{auth?.user?.name}</span>
                                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-full capitalize font-medium shadow-sm">
                                            {auth?.user?.role}
                                        </span>
                                    </div>
                                    <a
                                        href={getDashboardRoute()}
                                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        Dashboard
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 flex items-center p-2 rounded-lg hover:bg-emerald-50"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {canLogin && (
                                        <a
                                            href="/login"
                                            className="text-gray-600 hover:text-emerald-600 font-semibold transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-emerald-50"
                                        >
                                            Login
                                        </a>
                                    )}
                                    {canRegister && (
                                        <a
                                            href="/register"
                                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Get Started
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Split into 2 columns */}
            <section className="relative z-10 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white py-24 overflow-hidden">
                {/* Hero Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-float-slow"></div>
                    <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full animate-float-slow delay-1000"></div>
                    <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-white/20 rounded-full animate-float-slow delay-500"></div>
                    <div className="absolute bottom-10 right-10 w-20 h-20 border border-white/20 rounded-full animate-float-slow delay-700"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
                        {/* Left Column - Text Content */}
                        <div className="text-center lg:text-left animate-fade-in-up">
                            <div className="mb-8">
                                <div className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-pulse">
                                    <div className="w-2 h-2 bg-lime-300 rounded-full mr-2 animate-ping"></div>
                                    <span className="text-sm font-medium">Modern Learning Platform</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight animate-slide-in-left">
                                Modern Learning
                                <br />
                                <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl mb-12 text-white/90 leading-relaxed font-light animate-slide-in-right delay-200">
                                A comprehensive Learning Management System designed for teachers and students. 
                                Manage classes, create quizzes, track progress, and enhance the learning experience.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in delay-400">
                                {isLoggedIn ? (
                                    <a
                                        href={getDashboardRoute()}
                                        className="group bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-2xl hover:shadow-black/25"
                                    >
                                        Continue to Dashboard
                                        <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </a>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <a
                                                href="/register"
                                                className="group bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-2xl hover:shadow-black/25"
                                            >
                                                Start Your Journey
                                                <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </a>
                                        )}
                                        {canLogin && (
                                            <a
                                                href="/login"
                                                className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                                            >
                                                Sign In
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Image/Illustration */}
                        <div className="flex items-center justify-center lg:justify-end animate-slide-in-right delay-300">
                            <div className="relative w-full max-w-lg">
                                {/* Image Container with decorative elements */}
                                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                                    {/* Placeholder illustration */}
                                    <div className="bg-white/20 rounded-2xl p-12 text-center">
                                        <div className="w-full h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex flex-col items-center justify-center border border-white/30">
                                            <AcademicCapIcon className="w-24 h-24 text-white/80 mb-6 animate-float" />
                                            <p className="text-white/90 font-semibold text-lg">Your Learning Platform</p>
                                            <p className="text-white/70 text-sm mt-2">Comprehensive LMS Solution</p>
                                        </div>
                                        
                                        {/* Stats overlay */}
                                        <div className="grid grid-cols-3 gap-4 mt-6">
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                                                <div className="text-2xl font-bold text-white">100+</div>
                                                <div className="text-xs text-white/80">Students</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                                                <div className="text-2xl font-bold text-white">50+</div>
                                                <div className="text-xs text-white/80">Classes</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                                                <div className="text-2xl font-bold text-white">200+</div>
                                                <div className="text-xs text-white/80">Quizzes</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating elements for decoration */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-lime-400 to-green-400 rounded-full animate-bounce"></div>
                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
                                    <div className="absolute top-1/2 -left-6 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping"></div>
                                </div>
                                
                                {/* Background decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl -rotate-6 -z-10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
                            ✨ Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-slide-in-up">
                            Everything You Need for
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                                Online Learning
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
                            Micro LMS provides all the tools necessary for effective online education management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            const isEven = index % 2 === 0;
                            return (
                                <div 
                                    key={index} 
                                    className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2 animate-slide-in-up"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <div className={`w-16 h-16 ${isEven ? 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600' : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:${isEven ? 'text-emerald-600' : 'text-gray-800'} transition-colors duration-300`}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="relative z-10 py-24 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-slide-in-left">
                            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                                🚀 Benefits
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Why Choose
                                <br />
                                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                                    Micro LMS?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                Built specifically for educational institutions that need a reliable, 
                                feature-rich learning management system without the complexity.
                            </p>
                            
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                        <div className={`flex-shrink-0 w-8 h-8 ${index % 2 === 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-gray-700 to-gray-900'} rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <CheckIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className={`text-gray-700 font-semibold text-lg leading-relaxed group-hover:${index % 2 === 0 ? 'text-emerald-600' : 'text-gray-800'} transition-colors duration-300`}>
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!isLoggedIn && canRegister && (
                                <div className="mt-10 animate-fade-in delay-600">
                                    <a
                                        href="/register"
                                        className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-xl hover:shadow-2xl"
                                    >
                                        Get Started Today
                                        <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="lg:pl-8 animate-slide-in-right delay-300">
                            <div className="bg-gradient-to-br from-white via-emerald-50/50 to-green-50 rounded-3xl p-10 border border-emerald-100 shadow-xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center group">
                                        <div className="text-5xl font-black bg-gradient-to-br from-emerald-500 to-green-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                                            3
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 mb-2">User Roles</div>
                                        <div className="text-sm text-gray-500 font-medium">Admin, Teacher, Student</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-5xl font-black bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                                            ∞
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 mb-2">Classes</div>
                                        <div className="text-sm text-gray-500 font-medium">Unlimited batches</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                                        <div className="text-lg font-bold text-gray-900 mb-2">Analytics</div>
                                        <div className="text-sm text-gray-500 font-medium">Detailed reports</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔔</div>
                                        <div className="text-lg font-bold text-gray-900 mb-2">Notifications</div>
                                        <div className="text-sm text-gray-500 font-medium">WhatsApp & Email</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/10"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 border border-white/30 rounded-full -translate-y-32 animate-float-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 border border-white/20 rounded-full translate-y-48 animate-float-slow delay-1000"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-in-up">
                        {isLoggedIn ? 'Welcome Back!' : 'Ready to Transform Your Teaching?'}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-light animate-fade-in delay-200">
                        {isLoggedIn 
                            ? 'Continue your learning journey with Micro LMS.' 
                            : 'Join thousands of educators who are already using Micro LMS to enhance their teaching experience.'
                        }
                    </p>
                    
                    <div className="animate-fade-in delay-400">
                        {isLoggedIn ? (
                            <a
                                href={getDashboardRoute()}
                                className="group bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl"
                            >
                                Go to Dashboard
                                <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </a>
                        ) : canRegister && (
                            <a
                                href="/register"
                                className="group bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl"
                            >
                                Start Free Today
                                <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-6 md:mb-0 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <AcademicCapIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                    Micro LMS
                                </div>
                                <div className="text-sm text-gray-400 font-medium">Learning Management System</div>
                            </div>
                        </div>
                        
                        <div className="text-center md:text-right">
                            <p className="text-gray-400 font-medium">
                                © 2025 Micro LMS. Built with <span className="text-emerald-400">Axcertro (PVT) Ltd</span> 💙 <span className="text-green-500">All rights reserved.</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slide-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-15px) rotate(5deg);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
                }
                .animate-slide-in-up {
                    animation: slide-in-up 0.6s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 4s ease-in-out infinite;
                }
                
                /* Delays */
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }
                .delay-700 { animation-delay: 0.7s; }
                .delay-1000 { animation-delay: 1s; }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .animate-slide-in-left,
                    .animate-slide-in-right,
                    .animate-slide-in-up {
                        animation-duration: 0.6s;
                    }
                }
            `}</style>
        </div>
    );
};

export default Welcome;