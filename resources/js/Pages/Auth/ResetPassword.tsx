import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from '@/Utils/routes';
import toast from 'react-hot-toast';

// Custom SVG Icons
const EnvelopeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ArrowLeftIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

const LockIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

interface ForgotPasswordProps {
    status?: string;
}

interface ForgotPasswordData {
    email: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ status }) => {
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<ForgotPasswordData>({
        email: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
            setIsLoaded(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (status) {
            toast.success(status, {
                duration: 6000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.4)',
                },
            });
        }
    }, [status]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
                <Head title="Loading..." />
                {/* Colorful background orbs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-2xl opacity-20 animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-xl opacity-25 animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl opacity-15 animate-float delay-500"></div>
                
                <div className="text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-200/50 animate-float mx-auto relative">
                            <LockIcon className="w-10 h-10 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-rainbow-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-4 animate-rainbow-text">
                        Password Recovery
                    </h2>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-bounce delay-200"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full animate-bounce delay-300"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce delay-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-yellow-50 relative overflow-hidden flex items-center justify-center p-4">
            <Head title="Forgot Password" />
            
            {/* Enhanced Colorful Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Colorful Background Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-rose-400/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-300/25 to-cyan-400/25 rounded-full blur-2xl animate-float-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-full blur-3xl animate-float-slow delay-500"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-300/30 to-yellow-400/30 rounded-full blur-2xl animate-float delay-700"></div>
                
                {/* Colorful Icons */}
                <div className="absolute top-10 left-5 md:top-20 md:left-10 opacity-30">
                    <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12 text-emerald-500 animate-float-slow" />
                </div>
                <div className="absolute top-32 right-8 md:top-40 md:right-20 opacity-25">
                    <PencilIcon className="w-6 h-6 md:w-10 md:h-10 text-cyan-500 animate-pencil-write delay-1000" />
                </div>
                <div className="absolute bottom-40 left-8 md:bottom-32 md:left-1/4 opacity-30">
                    <LockIcon className="w-6 h-6 md:w-8 md:h-8 text-pink-500 animate-bounce-gentle" />
                </div>
                <div className="absolute top-60 right-4 md:right-16 opacity-25">
                    <StarIcon className="w-5 h-5 md:w-7 md:h-7 text-orange-500 animate-rainbow-pulse delay-500" />
                </div>
                <div className="absolute bottom-20 right-6 md:bottom-20 md:right-10 opacity-30">
                    <HeartIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-heart-beat" />
                </div>
                
                {/* New Colorful Elements */}
                <div className="absolute top-1/4 left-20 opacity-20">
                    <StarIcon className="w-8 h-8 text-yellow-400 animate-rainbow-pulse" />
                </div>
                <div className="absolute top-1/3 right-32 opacity-25">
                    <HeartIcon className="w-6 h-6 text-pink-400 animate-heart-beat" />
                </div>
                <div className="absolute bottom-1/3 left-16 opacity-20">
                    <EnvelopeIcon className="w-10 h-10 text-blue-400 animate-float-slow delay-700" />
                </div>
                
                {/* Floating colored papers */}
                <div className="absolute top-1/3 left-12 w-8 h-10 md:w-12 md:h-16 bg-gradient-to-br from-pink-200 to-rose-300 rounded-sm shadow-lg animate-paper-float opacity-40"></div>
                <div className="absolute bottom-1/3 right-12 w-6 h-8 md:w-10 md:h-12 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-sm shadow-md animate-paper-float delay-700 opacity-35"></div>
                <div className="absolute top-1/2 left-1/3 w-7 h-9 bg-gradient-to-br from-emerald-200 to-green-300 rounded-sm shadow-md animate-paper-float delay-1200 opacity-30"></div>
            </div>

            <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
                <div className="backdrop-blur-lg bg-gradient-to-br from-white/90 to-white/70 border border-white/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-200/30 p-6 md:p-8 relative overflow-hidden">
                    {/* Colorful background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-yellow-50/50 rounded-2xl md:rounded-3xl"></div>
                    
                    <div className="relative z-10">
                        {/* Enhanced Header */}
                        <div className="text-center mb-8 animate-fade-in-up">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-200/50 mb-6 transform hover:scale-105 transition-transform duration-500 animate-float relative">
                                <LockIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-rainbow-pulse"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping"></div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-2 animate-rainbow-text">
                                Forgot Your Password?
                            </h2>
                            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mx-auto rounded-full animate-gradient-shift mb-4"></div>
                            <p className="text-gray-600 text-sm leading-relaxed animate-slide-in-up delay-200">
                                No problem! Just enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Enhanced Success Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200/50 rounded-xl shadow-lg shadow-emerald-100/30 animate-slide-in-up">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                            <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-semibold text-emerald-800 flex items-center">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                                            Email sent successfully!
                                        </h3>
                                        <div className="mt-2 text-sm text-emerald-700">
                                            <p>{status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Enhanced Email Field */}
                            <div className="animate-slide-in-up delay-400">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                    Email Address *
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white/95 to-white/90 border-2 border-purple-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-100/50 group-hover:border-purple-300 group-hover:shadow-md ${
                                            errors.email ? 'border-red-300 focus:border-red-400' : ''
                                        }`}
                                        placeholder="Enter your email address"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-200/10 via-pink-200/10 to-yellow-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-red-500 text-sm animate-shake">{errors.email}</p>
                                )}
                            </div>

                            {/* Enhanced Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group shadow-lg hover:shadow-xl animate-slide-in-up delay-500 animate-rainbow-glow"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                            <span className="animate-pulse">Sending Reset Link...</span>
                                        </>
                                    ) : (
                                        <>
                                            <EnvelopeIcon className="h-5 w-5 mr-3 animate-bounce-gentle delay-200" />
                                            Send Password Reset Link
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>
                        </form>

                        {/* Enhanced Navigation Links */}
                        <div className="mt-8 flex items-center justify-between animate-slide-in-up delay-600">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-pink-500 transition-all duration-300 hover:underline group"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                Back to Login
                            </Link>
                            
                            <Link
                                href={route('register')}
                                className="text-sm font-semibold text-purple-600 hover:text-pink-500 transition-all duration-300 hover:underline"
                            >
                                Create Account
                            </Link>
                        </div>

                        {/* Enhanced Help Section */}
                        <div className="mt-8 p-4 md:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/50 shadow-lg shadow-blue-100/30 animate-slide-in-up delay-700">
                            <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-3 animate-pulse"></div>
                                Need Help?
                            </h3>
                            <div className="text-xs text-blue-700 space-y-2">
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse delay-100"></div>
                                    <p>Make sure you enter the correct email address</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse delay-200"></div>
                                    <p>Check your spam/junk folder if you don't receive the email</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse delay-300"></div>
                                    <p>The reset link will expire in 60 minutes</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 animate-pulse delay-400"></div>
                                    <p>Contact support if you continue having issues</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-white/95 to-white/85 rounded-3xl p-8 shadow-2xl border border-white/20 text-center max-w-sm mx-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-yellow-50/50 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-2">Sending Reset Link</h3>
                            <p className="text-gray-600 text-sm">Please wait while we prepare your password reset email...</p>
                            <div className="flex justify-center space-x-1 mt-4">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
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
                @keyframes rainbow-pulse {
                    0% {
                        background: linear-gradient(45deg, #f59e0b, #ec4899);
                        transform: scale(1);
                    }
                    25% {
                        background: linear-gradient(45deg, #ec4899, #8b5cf6);
                        transform: scale(1.1);
                    }
                    50% {
                        background: linear-gradient(45deg, #8b5cf6, #06b6d4);
                        transform: scale(1.2);
                    }
                    75% {
                        background: linear-gradient(45deg, #06b6d4, #10b981);
                        transform: scale(1.1);
                    }
                    100% {
                        background: linear-gradient(45deg, #10b981, #f59e0b);
                        transform: scale(1);
                    }
                }
                @keyframes rainbow-text {
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
                @keyframes rainbow-glow {
                    0%, 100% {
                        box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3), 0 0 20px rgba(236, 72, 153, 0.2);
                    }
                    25% {
                        box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4), 0 0 20px rgba(6, 182, 212, 0.3);
                    }
                    50% {
                        box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4), 0 0 20px rgba(16, 185, 129, 0.3);
                    }
                    75% {
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4), 0 0 20px rgba(245, 158, 11, 0.3);
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
                .animate-paper-float {
                    animation: paper-float 5s ease-in-out infinite;
                }
                .animate-rainbow-pulse {
                    animation: rainbow-pulse 3s ease-in-out infinite;
                }
                .animate-rainbow-text {
                    background: linear-gradient(90deg, #9333ea, #ec4899, #06b6d4, #10b981, #f59e0b, #9333ea);
                    background-size: 400% 100%;
                    animation: rainbow-text 4s ease-in-out infinite;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .animate-rainbow-glow {
                    animation: rainbow-glow 3s ease-in-out infinite;
                }
                .animate-gradient-shift {
                    background: linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #9333ea);
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

export default ForgotPassword;