import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    AcademicCapIcon, 
    UserGroupIcon, 
    ClipboardDocumentListIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

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
        router.post('/logout');
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
            <Head title="Welcome to Micro LMS" />
            
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 bg-green-100/30 rounded-full -translate-x-32 -translate-y-32"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-gray-100/20 rounded-full translate-x-48"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-50/40 rounded-full translate-y-32"></div>
            </div>
            
            {/* Header */}
            <header className="relative z-10 bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                <AcademicCapIcon className="w-7 h-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                    Micro LMS
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">Learning Management System</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-green-200">
                                        Welcome, <span className="font-semibold text-gray-900">{auth.user.name}</span>
                                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full capitalize font-medium shadow-sm">
                                            {auth.user.role}
                                        </span>
                                    </div>
                                    <Link
                                        href={getDashboardRoute()}
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-600 hover:text-black font-medium transition-colors duration-200 flex items-center p-2 rounded-lg hover:bg-gray-50"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href="/login"
                                            className="text-gray-600 hover:text-green-600 font-semibold transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-green-50"
                                        >
                                            Login
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Split into 2 columns */}
            <section className="relative z-10 bg-white text-gray-900 py-24 overflow-hidden">
                {/* Hero Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border border-green-200 rounded-full"></div>
                    <div className="absolute top-32 right-20 w-24 h-24 border border-green-200 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-green-200 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-20 h-20 border border-green-200 rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
                        {/* Left Column - Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="mb-8 animate-pulse">
                                <div className="inline-flex items-center px-6 py-2 bg-green-100 backdrop-blur-sm rounded-full border border-green-200">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-green-700">Modern Learning Platform</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                                Modern Learning
                                <br />
                                <span className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl mb-12 text-gray-600 leading-relaxed font-light">
                                A comprehensive Learning Management System designed for teachers and students. 
                                Manage classes, create quizzes, track progress, and enhance the learning experience.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                                {isLoggedIn ? (
                                    <Link
                                        href={getDashboardRoute()}
                                        className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-2xl hover:shadow-green-500/25"
                                    >
                                        Continue to Dashboard
                                        <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link
                                                href="/register"
                                                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-2xl hover:shadow-green-500/25"
                                            >
                                                Start Your Journey
                                                <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        )}
                                        {canLogin && (
                                            <Link
                                                href="/login"
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Sign In
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Hero Image */}
                        <div className="flex items-center justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg">
                                {/* Main Image Container */}
                                <div className="relative group">
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                                        <img 
                                            src="/images/image3.jpeg"
                                            alt="Micro LMS - Modern Learning Platform"
                                            className="w-full h-auto object-cover rounded-3xl"
                                            loading="eager"
                                        />
                                        
                                        {/* Image Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>
                                        
                                        {/* Floating Stats Overlay */}
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">100+</div>
                                                        <div className="text-xs text-gray-600 font-medium">Students</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">50+</div>
                                                        <div className="text-xs text-gray-600 font-medium">Classes</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">200+</div>
                                                        <div className="text-xs text-gray-600 font-medium">Quizzes</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Decorative Elements */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gray-300 rounded-full animate-pulse shadow-lg"></div>
                                    <div className="absolute top-1/2 -left-6 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                                    <div className="absolute top-1/4 -right-6 w-5 h-5 bg-gray-400 rounded-full animate-pulse shadow-lg"></div>
                                </div>
                                
                                {/* Background Decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-3xl -rotate-6 -z-10 scale-105"></div>
                                <div className="absolute inset-0 bg-gradient-to-tl from-green-100/30 to-transparent rounded-3xl rotate-3 -z-20 scale-110"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                            ✨ Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need for
                            <br />
                            <span className="bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                Online Learning
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Micro LMS provides all the tools necessary for effective online education management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
                                    <div className={`w-16 h-16 ${isEven ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700' : 'bg-gradient-to-br from-gray-700 via-gray-800 to-black'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:${isEven ? 'text-green-600' : 'text-black'} transition-colors duration-300`}>
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
            <section className="relative z-10 py-24 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-6">
                                🚀 Benefits
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Why Choose
                                <br />
                                <span className="bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                    Micro LMS?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                Built specifically for educational institutions that need a reliable, 
                                feature-rich learning management system without the complexity.
                            </p>
                            
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start group">
                                        <div className={`flex-shrink-0 w-8 h-8 ${index % 2 === 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-700 to-black'} rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <CheckIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className={`text-gray-700 font-semibold text-lg leading-relaxed group-hover:${index % 2 === 0 ? 'text-green-600' : 'text-black'} transition-colors duration-300`}>
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!isLoggedIn && canRegister && (
                                <div className="mt-10">
                                    <Link
                                        href="/register"
                                        className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-xl hover:shadow-2xl"
                                    >
                                        Get Started Today
                                        <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="lg:pl-8">
                            <div className="bg-gradient-to-br from-green-50 via-white to-gray-50 rounded-3xl p-10 border border-green-100 shadow-xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center group">
                                        <div className="text-5xl font-black bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                                            3
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 mb-2">User Roles</div>
                                        <div className="text-sm text-gray-500 font-medium">Admin, Teacher, Student</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-5xl font-black bg-gradient-to-br from-gray-700 to-black bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <section className="relative z-10 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 border border-white/30 rounded-full -translate-y-32"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 border border-white/20 rounded-full translate-y-48"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {isLoggedIn ? 'Welcome Back!' : 'Ready to Transform Your Teaching?'}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-light">
                        {isLoggedIn 
                            ? 'Continue your learning journey with Micro LMS.' 
                            : 'Join thousands of educators who are already using Micro LMS to enhance their teaching experience.'
                        }
                    </p>
                    
                    {isLoggedIn ? (
                        <Link
                            href={getDashboardRoute()}
                            className="group bg-white text-green-600 hover:bg-gray-50 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl"
                        >
                            Go to Dashboard
                            <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    ) : canRegister && (
                        <Link
                            href="/register"
                            className="group bg-white text-green-600 hover:bg-gray-50 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl"
                        >
                            Start Free Today
                            <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-6 md:mb-0 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <AcademicCapIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                                    Micro LMS
                                </div>
                                <div className="text-sm text-gray-400 font-medium">Learning Management System</div>
                            </div>
                        </div>
                        
                        <div className="text-center md:text-right">
                            <p className="text-gray-400 font-medium">
                                © 2025 Micro LMS. Built with <span className="text-green-400">Laravel</span> & <span className="text-green-500">React</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;