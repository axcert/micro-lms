import React, { useEffect, useState } from 'react';

// Education-focused SVG Icons
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

const ClipboardIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ChartBarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const LockIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const PlayIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

interface ForgotPasswordProps {
    status?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ status }) => {
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{email?: string}>({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
            setIsLoaded(true);
        }, 1200);
        
        // Set document title
        document.title = "Forgot Password - MicroLMS";
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (status) {
            setShowSuccess(true);
        }
    }, [status]);

    const submit = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        
        // Basic email validation
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        
        if (!email.includes('@')) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }
        
        setErrors({});
        setProcessing(true);
        
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setShowSuccess(true);
            alert('Password reset email sent! Please check your inbox.');
        }, 2000);
    };

    if (pageLoading) {
        // Set loading title
        document.title = "Loading - MicroLMS";
        
        return (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
                {/* Educational background orbs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full blur-2xl opacity-30 animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-black/10 to-black/20 rounded-full blur-xl opacity-20 animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full blur-3xl opacity-20 animate-float delay-500"></div>
                
                <div className="text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200/50 animate-float mx-auto relative">
                            <AcademicCapIcon className="w-10 h-10 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse flex items-center justify-center">
                                <LockIcon className="w-3 h-3 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2">
                        MicroLMS Learning Portal
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">Secure Account Recovery</p>
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
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
            
            {/* Enhanced Educational Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-2xl animate-float-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-green-200/20 to-green-300/20 rounded-full blur-3xl animate-float-slow delay-500"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-green-300/30 to-green-400/30 rounded-full blur-2xl animate-float delay-700"></div>
                
                {/* Educational Icons */}
                <div className="absolute top-10 left-5 md:top-20 md:left-10 opacity-30">
                    <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12 text-green-500 animate-float-slow" />
                </div>
                <div className="absolute top-32 right-8 md:top-40 md:right-20 opacity-25">
                    <ClipboardIcon className="w-6 h-6 md:w-10 md:h-10 text-black animate-pencil-write delay-1000" />
                </div>
                <div className="absolute bottom-40 left-8 md:bottom-32 md:left-1/4 opacity-30">
                    <AcademicCapIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600 animate-bounce-gentle" />
                </div>
                <div className="absolute top-60 right-4 md:right-16 opacity-25">
                    <ChartBarIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-800 animate-green-pulse delay-500" />
                </div>
                <div className="absolute bottom-20 right-6 md:bottom-20 md:right-10 opacity-30">
                    <UserGroupIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500 animate-bubble" />
                </div>
                
                {/* Learning Elements */}
                <div className="absolute top-1/4 left-20 opacity-20">
                    <PlayIcon className="w-8 h-8 text-green-400 animate-green-pulse" />
                </div>
                <div className="absolute top-1/3 right-32 opacity-25">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded animate-heart-beat flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="absolute bottom-1/3 left-16 opacity-20">
                    <EnvelopeIcon className="w-10 h-10 text-green-500 animate-float-slow delay-700" />
                </div>
                
                {/* Educational papers/documents */}
                <div className="absolute top-1/3 left-12 w-8 h-10 md:w-12 md:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-sm shadow-lg animate-paper-float opacity-40 relative">
                    <div className="absolute top-1 left-1 right-1 h-0.5 bg-green-400 rounded"></div>
                    <div className="absolute top-3 left-1 right-2 h-0.5 bg-green-300 rounded"></div>
                    <div className="absolute top-5 left-1 right-3 h-0.5 bg-green-200 rounded"></div>
                </div>
                <div className="absolute bottom-1/3 right-12 w-6 h-8 md:w-10 md:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm shadow-md animate-paper-float delay-700 opacity-35 relative">
                    <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-gray-400 rounded"></div>
                    <div className="absolute top-2.5 left-0.5 right-1 h-0.5 bg-gray-300 rounded"></div>
                </div>
                <div className="absolute top-1/2 left-1/3 w-7 h-9 bg-gradient-to-br from-green-200 to-green-300 rounded-sm shadow-md animate-paper-float delay-1200 opacity-30 relative">
                    <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-green-500 rounded"></div>
                    <div className="absolute top-2.5 left-0.5 right-1 h-0.5 bg-green-400 rounded"></div>
                    <div className="absolute top-4 left-0.5 right-1.5 h-0.5 bg-green-300 rounded"></div>
                </div>
            </div>

            <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
                <div className="backdrop-blur-lg bg-gradient-to-br from-white/95 to-gray-50/90 border border-green-200 rounded-2xl md:rounded-3xl shadow-2xl shadow-green-200/30 p-6 md:p-8 relative overflow-hidden">
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white to-gray-50/30 rounded-2xl md:rounded-3xl"></div>
                    
                    <div className="relative z-10">
                        {/* Enhanced LMS Header */}
                        <div className="text-center mb-8 animate-fade-in-up">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-200/50 mb-6 transform hover:scale-105 transition-transform duration-500 animate-float relative">
                                <AcademicCapIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse flex items-center justify-center">
                                    <LockIcon className="w-2 h-2 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                            </div>
                            <div className="mb-4">
                                <h1 className="text-sm font-semibold text-green-600 mb-1 tracking-wide">MICROLMS LEARNING PORTAL</h1>
                                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2 animate-green-text">
                                    Account Recovery
                                </h2>
                            </div>
                            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-green-500 to-black mx-auto rounded-full animate-gradient-shift mb-4"></div>
                            <p className="text-gray-600 text-sm leading-relaxed animate-slide-in-up delay-200">
                                Can't access your learning account? Enter your registered email address and we'll send you a secure link to reset your password and get back to your courses.
                            </p>
                        </div>

                        {/* Enhanced Success Message */}
                        {showSuccess && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 via-green-50 to-gray-50 border-2 border-green-200/50 rounded-xl shadow-lg shadow-green-100/30 animate-slide-in-up">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                                            <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-semibold text-green-800 flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                            Password reset email sent!
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>We've sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Enhanced Email Field */}
                            <div className="animate-slide-in-up delay-400">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                    Student/Teacher Email Address *
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                submit();
                                            }
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 bg-white border-2 border-green-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md ${
                                            errors.email ? 'border-red-300 focus:border-red-400' : ''
                                        }`}
                                        placeholder="Enter your registered email address"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-200/10 to-green-300/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-red-500 text-sm animate-shake">{errors.email}</p>
                                )}
                            </div>

                            {/* Enhanced Submit Button */}
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group shadow-lg hover:shadow-xl animate-slide-in-up delay-500 animate-green-glow"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                            <span className="animate-pulse">Sending Recovery Email...</span>
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
                        </div>

                        {/* Enhanced Navigation Links */}
                        <div className="mt-8 flex items-center justify-between animate-slide-in-up delay-600">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Navigate to login page');
                                }}
                                className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-black transition-all duration-300 hover:underline group"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                Back to Portal Login
                            </a>
                            
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Navigate to registration page');
                                }}
                                className="text-sm font-semibold text-green-600 hover:text-black transition-all duration-300 hover:underline"
                            >
                                Join Our Platform
                            </a>
                        </div>

                        {/* Enhanced LMS Help Section */}
                        <div className="mt-8 p-4 md:p-6 bg-gradient-to-r from-green-50 via-green-50 to-gray-50 rounded-xl border border-green-200/50 shadow-lg shadow-green-100/30 animate-slide-in-up delay-700">
                            <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center">
                                <AcademicCapIcon className="w-4 h-4 mr-2" />
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 animate-pulse"></div>
                                Account Recovery Support
                            </h3>
                            <div className="text-xs text-green-700 space-y-2">
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse delay-100"></div>
                                    <p>Use the same email address you registered with as a student or teacher</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse delay-200"></div>
                                    <p>Check your spam/junk folder for the password reset email</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse delay-300"></div>
                                    <p>The secure reset link will expire in 60 minutes for your security</p>
                                </div>
                                <div className="flex items-center p-2 bg-gradient-to-r from-white/60 to-white/40 rounded-lg">
                                    <div className="w-2 h-2 bg-black rounded-full mr-3 animate-pulse delay-400"></div>
                                    <p>Contact your LMS administrator if you continue experiencing issues</p>
                                </div>
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
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float relative">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                    <AcademicCapIcon className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2">Sending Recovery Email</h3>
                            <p className="text-gray-600 text-sm">Preparing your secure password reset link for learning portal access...</p>
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