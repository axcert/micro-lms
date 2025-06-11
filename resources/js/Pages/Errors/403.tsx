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

export default function Error403({ status, message, description, auth }: ErrorProps) {
    const user = auth?.user;
    
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

    // Role-specific quick actions
    const getQuickActions = (role: string) => {
        switch (role) {
            case 'student':
                return [
                    { label: 'My Classes', href: '/student/classes' },
                    { label: 'Take Quizzes', href: '/student/quizzes' },
                    { label: 'View Results', href: '/student/results' },
                ];
            case 'teacher':
                return [
                    { label: 'My Batches', href: '/teacher/batches' },
                    { label: 'Schedule Classes', href: '/teacher/classes' },
                    { label: 'Create Quizzes', href: '/teacher/quizzes' },
                ];
            case 'admin':
                return [
                    { label: 'Manage Teachers', href: '/admin/teachers' },
                    { label: 'View Students', href: '/admin/students' },
                    { label: 'System Reports', href: '/admin/reports' },
                ];
            default:
                return [];
        }
    };

    const quickActions = user ? getQuickActions(user.role) : [];

    return (
        <GuestLayout>
            <Head title={`${status} - ${message}`} />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <div className="max-w-lg mx-auto text-center px-4">
                    {/* Lock Icon */}
                    <div className="mb-8">
                        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-6xl font-bold text-red-600 mb-4">
                            {status}
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
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
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                Logged in as <span className="font-semibold">{user.name}</span> ({user.role})
                            </p>
                        </div>
                    )}

                    {/* Primary Actions */}
                    <div className="space-y-4 mb-6">
                        {user ? (
                            <Link
                                href={getDashboardRoute(user.role)}
                                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                Go to My Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login to Your Account
                            </Link>
                        )}
                        
                        <div>
                            <button
                                onClick={() => window.history.back()}
                                className="text-red-600 hover:text-red-800 font-medium underline"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions for logged-in users */}
                    {user && quickActions.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions:</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="px-4 py-2 text-sm bg-white border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors duration-200"
                                    >
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Help */}
                    <div className="mt-8 p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                            {user 
                                ? `Your ${user.role} account doesn't have permission for this action. Contact your administrator if you believe this is an error.`
                                : 'Need access? Please login with an account that has the required permissions.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}