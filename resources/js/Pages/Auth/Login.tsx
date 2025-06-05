import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { route } from '@/Utils/routes';
import toast from 'react-hot-toast';

// Custom SVG Icons
const EyeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);

const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const BookOpenIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const PencilIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const BeakerIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428l-7.071-7.071V4h1a1 1 0 000-2h-4a1 1 0 000 2h1v4.357L3.286 15.428a2 2 0 001.414 3.414h14.6a2 2 0 001.414-3.414z" />
    </svg>
);

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const HeartIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

interface LoginData {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<LoginData>({
        email: '',
        password: '',
        remember: false,
    });

    const updateData = (key: keyof LoginData, value: string | boolean) => {
        setData(key, value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
            setIsLoaded(true);
        }, 1200);
        return () => {
            clearTimeout(timer);
            reset('password');
        };
    }, []);

    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    const setDemoCredentials = (email: string) => {
        setData(prev => ({
            ...prev,
            email: email,
            password: 'password'
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !processing) {
            submit(e);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('api.login'), {
            onSuccess: (response) => {
                // Get user role from response and redirect accordingly
                const user = response.props?.auth?.user || response.props?.user;
                const userRole = user?.role;
                
                if (userRole === 'admin') {
                    window.location.href = route('admin.dashboard');
                } else if (userRole === 'teacher') {
                    window.location.href = route('teacher.dashboard');
                } else if (userRole === 'student') {
                    window.location.href = route('student.dashboard');
                } else {
                    // Fallback to default dashboard
                    window.location.href = route('dashboard');
                }
            },
            onError: (errors) => {
                console.error('Login failed:', errors);
            }
        });
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
                <Head title="Loading..." />
                {/* Background orbs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full blur-2xl opacity-30 animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-black/10 to-black/20 rounded-full blur-xl opacity-20 animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full blur-3xl opacity-20 animate-float delay-500"></div>
                
                <div className="text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200/50 animate-float mx-auto relative">
                            <AcademicCapIcon className="w-10 h-10 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-4 animate-green-text">
                        Loading Micro LMS
                    </h2>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-black to-gray-700 rounded-full animate-bounce delay-200"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full animate-bounce delay-300"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-700 rounded-full animate-bounce delay-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Head title="Login" />
            
            {/* Enhanced Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-2xl animate-float-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-green-200/20 to-green-300/20 rounded-full blur-3xl animate-float-slow delay-500"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-green-300/30 to-green-400/30 rounded-full blur-2xl animate-float delay-700"></div>
                
                {/* Icons */}
                <div className="absolute top-10 left-5 md:top-20 md:left-10 opacity-30">
                    <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12 text-green-500 animate-float-slow" />
                </div>
                <div className="absolute top-32 right-8 md:top-40 md:right-20 opacity-25">
                    <BookOpenIcon className="w-6 h-6 md:w-10 md:h-10 text-black animate-float-slow delay-1000" />
                </div>
                <div className="absolute bottom-40 left-8 md:bottom-32 md:left-1/4 opacity-30">
                    <PencilIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600 animate-pencil-write" />
                </div>
                <div className="absolute top-60 right-4 md:right-16 opacity-25">
                    <PencilIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-800 animate-pencil-write delay-500" />
                </div>
                <div className="absolute bottom-20 right-6 md:bottom-20 md:right-10 opacity-30">
                    <BeakerIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500 animate-bubble" />
                </div>
                
                {/* New Elements */}
                <div className="absolute top-1/4 left-20 opacity-20">
                    <StarIcon className="w-8 h-8 text-green-400 animate-green-pulse" />
                </div>
                <div className="absolute top-1/3 right-32 opacity-25">
                    <HeartIcon className="w-6 h-6 text-black animate-heart-beat" />
                </div>
                <div className="absolute bottom-1/3 left-16 opacity-20">
                    <StarIcon className="w-10 h-10 text-green-500 animate-green-pulse delay-700" />
                </div>
                
                {/* Floating papers */}
                <div className="absolute top-1/3 left-12 w-8 h-10 md:w-12 md:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-sm shadow-lg animate-paper-float opacity-40"></div>
                <div className="absolute bottom-1/3 right-12 w-6 h-8 md:w-10 md:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm shadow-md animate-paper-float delay-700 opacity-35"></div>
                <div className="absolute top-1/2 left-1/3 w-7 h-9 bg-gradient-to-br from-green-200 to-green-300 rounded-sm shadow-md animate-paper-float delay-1200 opacity-30"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col xl:flex-row">
                {/* Left Side - Welcome Section */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 order-2 xl:order-1 transform transition-all duration-1000 ease-out ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}>
                    <div className="max-w-lg w-full text-center animate-fade-in-up">
                        {/* Enhanced Logo */}
                        <div className="mb-8 md:mb-12 transform hover:scale-105 transition-transform duration-500">
                            <div className="mx-auto w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200/50 animate-float relative">
                                <AcademicCapIcon className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-white drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                            </div>
                            <div className="mt-4 md:mt-6">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2 md:mb-3 animate-green-text">
                                    Micro LMS
                                </h1>
                                <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-green-500 to-black mx-auto rounded-full animate-gradient-shift"></div>
                            </div>
                        </div>
                        
                        {/* Enhanced Welcome Text */}
                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight animate-slide-in-left">
                                Welcome to the<br />
                                <span className="bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent animate-green-text">
                                    Learning Hub
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl animate-slide-in-right delay-200">
                                Sign in to continue your<br />
                                <span className="font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">educational journey</span>
                            </p>
                            <div className="pt-4 md:pt-6 animate-fade-in delay-400">
                                <p className="text-gray-600 text-sm mb-3 md:mb-4">
                                    New to our platform?
                                </p>
                                <Link
                                    href={route('register')}
                                    className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 md:py-3 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer animate-green-glow text-sm md:text-base relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Join Our Community</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Enhanced Demo Credentials */}
                        <div className="hidden md:block backdrop-blur-sm bg-gradient-to-br from-white/90 to-gray-50/80 border border-green-100 rounded-2xl md:rounded-3xl shadow-xl shadow-green-100/30 p-4 md:p-6 lg:p-8 transform hover:scale-105 transition-all duration-500 animate-slide-in-up delay-600">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 md:mb-6 flex items-center justify-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 animate-green-pulse"></div>
                                Demo Access
                            </h3>
                            <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                                <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-green-100 hover:to-green-200">
                                    <span className="font-medium text-gray-800">Admin:</span>
                                    <span className="text-green-600 font-mono text-xs bg-white/80 px-2 md:px-3 py-1 rounded-lg shadow-sm">admin@mlms.com</span>
                                </div>
                                <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-gray-100 hover:to-gray-200">
                                    <span className="font-medium text-gray-800">Teacher:</span>
                                    <span className="text-black font-mono text-xs bg-white/80 px-2 md:px-3 py-1 rounded-lg shadow-sm">teacher@mlms.com</span>
                                </div>
                                <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-green-100 hover:to-green-200">
                                    <span className="font-medium text-gray-800">Student:</span>
                                    <span className="text-green-700 font-mono text-xs bg-white/80 px-2 md:px-3 py-1 rounded-lg shadow-sm">student@mlms.com</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 md:mt-4 p-2 md:p-3 bg-white/80 rounded-lg">
                                    Password: <span className="font-mono font-semibold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">password</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Enhanced Login Form */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 relative order-1 xl:order-2 transform transition-all duration-1000 ease-out delay-300 ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}>
                    <div className="w-full max-w-md relative">
                        <div className="backdrop-blur-lg bg-gradient-to-br from-white/95 to-gray-50/90 border border-green-200 rounded-2xl md:rounded-3xl shadow-2xl shadow-green-200/30 p-6 md:p-8 lg:p-10 animate-slide-in-right relative overflow-hidden">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white to-gray-50/30 rounded-2xl md:rounded-3xl"></div>
                            
                            <div className="relative z-10">
                                {/* Enhanced Form Header */}
                                <div className="text-center mb-6 md:mb-8">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2 animate-green-text">
                                        Access Your Account
                                    </h3>
                                    <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-green-500 to-black mx-auto rounded-full animate-gradient-shift"></div>
                                </div>

                                <form onSubmit={submit} className="space-y-5 md:space-y-6">
                                    {/* Enhanced Email Field */}
                                    <div className="animate-slide-in-up delay-200">
                                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 md:mb-3">
                                            Email Address *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => updateData('email', e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.email ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your email"
                                            />
                                            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-200/10 to-green-300/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Password Field */}
                                    <div className="animate-slide-in-up delay-300">
                                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2 md:mb-3">
                                            Password *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                required
                                                value={data.password}
                                                onChange={(e) => updateData('password', e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.password ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-all duration-300 hover:scale-110"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                )}
                                            </button>
                                            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-200/10 to-green-300/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between animate-slide-in-up delay-400">
                                        <div className="flex items-center">
                                            <input
                                                id="remember"
                                                name="remember"
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => updateData('remember', e.target.checked)}
                                                className="w-4 h-4 md:w-5 md:h-5 text-green-500 bg-white border-2 border-green-200 rounded-lg focus:ring-green-400 focus:ring-2 transition-all duration-300"
                                            />
                                            <label htmlFor="remember" className="ml-2 md:ml-3 text-xs md:text-sm text-gray-600 font-medium">
                                                Keep me signed in
                                            </label>
                                        </div>
                                        {canResetPassword && (
                                            <Link
                                                href={route('forgotPassword')}
                                                className="text-green-600 hover:text-black text-xs md:text-sm font-semibold transition-all duration-300 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Enhanced Login Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group shadow-lg hover:shadow-xl animate-slide-in-up delay-500 text-sm md:text-base animate-green-glow"
                                    >
                                        <span className="relative z-10">
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2 md:space-x-3">
                                                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 md:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="animate-pulse">Signing In...</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center space-x-2">
                                                    <span>SIGN IN</span>
                                                    <AcademicCapIcon className="w-4 h-4 md:w-5 md:h-5 animate-bounce-gentle delay-200" />
                                                </span>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    </button>

                                    {/* Enhanced Mobile Demo Credentials */}
                                    <div className="md:hidden mt-6 p-4 bg-gradient-to-r from-green-50 to-gray-50 rounded-xl animate-slide-in-up delay-600 border border-green-100">
                                        <h4 className="text-xs font-semibold text-gray-800 mb-3 text-center">Quick Access</h4>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <button type="button" onClick={() => setDemoCredentials('admin@mlms.com')} className="p-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 rounded-lg text-green-700 font-medium transition-all duration-200 shadow-sm">Admin</button>
                                            <button type="button" onClick={() => setDemoCredentials('teacher@mlms.com')} className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg text-black font-medium transition-all duration-200 shadow-sm">Teacher</button>
                                            <button type="button" onClick={() => setDemoCredentials('student@mlms.com')} className="p-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 rounded-lg text-green-700 font-medium transition-all duration-200 shadow-sm">Student</button>
                                        </div>
                                        <p className="text-xs text-center text-gray-500 mt-2">Password: <span className="font-mono bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">password</span></p>
                                    </div>

                                    {/* Enhanced Register Link */}
                                    <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-green-100 animate-slide-in-up delay-700">
                                        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                            First time here?
                                        </p>
                                        <Link
                                            href={route('register')}
                                            className="inline-block bg-white hover:bg-gray-50 border-2 border-green-200 hover:border-green-400 text-green-600 hover:text-green-700 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-lg text-xs md:text-sm relative overflow-hidden group"
                                        >
                                            <span className="relative z-10">Create Account</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/50 to-green-50/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-green-200 text-center max-w-sm mx-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-gray-50/30 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2">Signing You In</h3>
                            <p className="text-gray-600 text-sm">Please wait while we verify your credentials...</p>
                            <div className="flex justify-center space-x-1 mt-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                @keyframes bounce-gentle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                @keyframes pencil-write {
                    0%, 100% {
                        transform: translateY(0px) rotate(-15deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(-10deg);
                    }
                }
                @keyframes bubble {
                    0%, 100% {
                        transform: scale(1) translateY(0);
                    }
                    50% {
                        transform: scale(1.1) translateY(-5px);
                    }
                }
                @keyframes paper-float {
                    0%, 100% {
                        transform: translateY(0px) rotate(2deg);
                    }
                    33% {
                        transform: translateY(-10px) rotate(-1deg);
                    }
                    66% {
                        transform: translateY(-5px) rotate(3deg);
                    }
                }
                @keyframes green-pulse {
                    0% {
                        background: linear-gradient(45deg, #22c55e, #16a34a);
                        transform: scale(1);
                    }
                    25% {
                        background: linear-gradient(45deg, #16a34a, #15803d);
                        transform: scale(1.1);
                    }
                    50% {
                        background: linear-gradient(45deg, #15803d, #166534);
                        transform: scale(1.2);
                    }
                    75% {
                        background: linear-gradient(45deg, #166534, #14532d);
                        transform: scale(1.1);
                    }
                    100% {
                        background: linear-gradient(45deg, #14532d, #22c55e);
                        transform: scale(1);
                    }
                }
                @keyframes green-text {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                @keyframes green-glow {
                    0%, 100% {
                        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3), 0 0 20px rgba(22, 163, 74, 0.2);
                    }
                    25% {
                        box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4), 0 0 20px rgba(21, 128, 61, 0.3);
                    }
                    50% {
                        box-shadow: 0 4px 15px rgba(21, 128, 61, 0.4), 0 0 20px rgba(22, 101, 52, 0.3);
                    }
                    75% {
                        box-shadow: 0 4px 15px rgba(22, 101, 52, 0.4), 0 0 20px rgba(20, 83, 45, 0.3);
                    }
                }
                @keyframes gradient-shift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                @keyframes heart-beat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    75% {
                        transform: scale(1.1);
                    }
                }
                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    75% {
                        transform: translateX(5px);
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
                .animate-bounce-gentle {
                    animation: bounce-gentle 2s ease-in-out infinite;
                }
                .animate-pencil-write {
                    animation: pencil-write 3s ease-in-out infinite;
                }
                .animate-bubble {
                    animation: bubble 2.5s ease-in-out infinite;
                }
                .animate-paper-float {
                    animation: paper-float 5s ease-in-out infinite;
                }
                .animate-green-pulse {
                    animation: green-pulse 3s ease-in-out infinite;
                }
                .animate-green-text {
                    background: linear-gradient(90deg, #22c55e, #16a34a, #000000, #374151, #22c55e);
                    background-size: 400% 100%;
                    animation: green-text 4s ease-in-out infinite;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .animate-green-glow {
                    animation: green-glow 3s ease-in-out infinite;
                }
                .animate-gradient-shift {
                    background: linear-gradient(90deg, #22c55e, #16a34a, #000000, #22c55e);
                    background-size: 300% 100%;
                    animation: gradient-shift 3s ease-in-out infinite;
                }
                .animate-heart-beat {
                    animation: heart-beat 2s ease-in-out infinite;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
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
                .delay-1200 { animation-delay: 1.2s; }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .animate-slide-in-left,
                    .animate-slide-in-right,
                    .animate-slide-in-up {
                        animation-duration: 0.6s;
                    }
                }
                
                /* Reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;