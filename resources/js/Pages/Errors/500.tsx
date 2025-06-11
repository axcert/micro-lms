import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

interface ErrorProps {
    status: number;
    message: string;
    description: string;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
}

export default function Error500({ status, message, description, auth }: ErrorProps) {
    const user = auth?.user;
    
    const handleRefresh = () => {
        window.location.reload();
    };

    // Role-specific dashboard routes
    const getDashboardRoute = (role: string) => {
        switch (role) {
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

    const getStatusColor = (status: number) => {
        if (status === 419) return 'yellow'; // Session expired
        if (status === 429) return 'orange'; // Rate limited
        return 'gray'; // Default server error
    };

    const statusColor = getStatusColor(status);
    const colorClasses = {
        gray: {
            bg: 'from-gray-50 to-blue-50',
            icon: 'bg-gray-100 text-gray-600',
            button: 'bg-blue-600 hover:bg-blue-700',
            text: 'text-gray-700',
            accent: 'from-gray-500 to-blue-500'
        },
        yellow: {
            bg: 'from-yellow-50 to-orange-50',
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700',
            text: 'text-yellow-700',
            accent: 'from-yellow-500 to-orange-500'
        },
        orange: {
            bg: 'from-orange-50 to-red-50',
            icon: 'bg-orange-100 text-orange-600',
            button: 'bg-orange-600 hover:bg-orange-700',
            text: 'text-orange-700',
            accent: 'from-orange-500 to-red-500'
        }
    };

    const colors = colorClasses[statusColor];

    return (
        <GuestLayout>
            <Head title={`${status} - ${message}`} />
            
            <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${colors.bg}`}>
                <div className="max-w-md mx-auto text-center px-4">
                    {/* Server Icon */}
                    <div className="mb-8">
                        <div className={`mx-auto w-24 h-24 ${colors.icon} rounded-full flex items-center justify-center mb-6`}>
                            {status === 419 ? (
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : status === 429 ? (
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                        </div>
                        <h1 className={`text-6xl font-bold ${colors.text} mb-4`}>
                            {status}
                        </h1>
                        <div className={`w-24 h-1 bg-gradient-to-r ${colors.accent} mx-auto rounded-full`}></div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {message}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className={`mb-6 p-4 ${colors.icon.split(' ')[0]} rounded-lg`}>
                            <p className={`text-sm ${colors.text}`}>
                                Logged in as <span className="font-semibold">{user.name}</span> ({user.role})
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-4">
                        {status === 419 ? (
                            // Session expired - refresh page
                            <button
                                onClick={handleRefresh}
                                className={`inline-flex items-center px-6 py-3 ${colors.button} text-white font-semibold rounded-lg transition-colors duration-200 mr-4`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh Page
                            </button>
                        ) : (
                            <button
                                onClick={handleRefresh}
                                className={`inline-flex items-center px-6 py-3 ${colors.button} text-white font-semibold rounded-lg transition-colors duration-200 mr-4`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Try Again
                            </button>
                        )}
                        
                        {user ? (
                            <Link
                                href={getDashboardRoute(user.role)}
                                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go Home
                            </Link>
                        )}
                    </div>

                    {/* Technical Details (only in debug mode) */}
                    {process.env.NODE_ENV === 'development' && status >= 500 && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
                            <p className="text-xs text-gray-600 font-mono break-words">
                                {description}
                            </p>
                        </div>
                    )}

                    {/* Contact Support */}
                    <div className={`mt-8 p-4 ${colors.icon.split(' ')[0]} rounded-lg`}>
                        <p className={`text-sm ${colors.text}`}>
                            {status === 419 
                                ? 'Your session expired for security. After refreshing, you\'ll need to log in again.'
                                : status === 429
                                ? 'You\'re making requests too quickly. Please wait a moment before trying again.'
                                : 'If this problem continues, please contact our support team with the error code above.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}