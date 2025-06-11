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

export default function Error404({ status, message, description, auth }: ErrorProps) {
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

    return (
        <GuestLayout>
            <Head title={`${status} - ${message}`} />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-md mx-auto text-center px-4">
                    {/* Error Code */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-purple-600 mb-4">
                            {status}
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full"></div>
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
                        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-700">
                                Logged in as <span className="font-semibold">{user.name}</span> ({user.role})
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-4">
                        {user ? (
                            <Link
                                href={getDashboardRoute(user.role)}
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                Go to My Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go Home
                            </Link>
                        )}
                        
                        <div>
                            <button
                                onClick={() => window.history.back()}
                                className="text-purple-600 hover:text-purple-800 font-medium underline"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>

                    {/* Role-specific help */}
                    {user && (
                        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-700">
                                {user.role === 'student' && 'The class or quiz you\'re looking for might not be available yet.'}
                                {user.role === 'teacher' && 'The resource might not be in your assigned batches.'}
                                {user.role === 'admin' && 'The administrative resource could not be found.'}
                            </p>
                        </div>
                    )}

                    {/* Decorative Elements */}
                    <div className="mt-12 opacity-50">
                        <div className="flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}