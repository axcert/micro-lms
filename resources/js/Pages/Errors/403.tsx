import React from 'react';
import { Link } from '@inertiajs/react';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

const Forbidden: React.FC = () => {
    return (
        <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="max-w-max mx-auto">
                <main className="sm:flex">
                    <div className="text-primary-600">
                        <ExclamationTriangleIcon className="w-16 h-16" />
                    </div>
                    <div className="sm:ml-6">
                        <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                                Access Forbidden
                            </h1>
                            <p className="mt-1 text-base text-gray-500">
                                You don't have permission to access this page.
                            </p>
                        </div>
                        <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center btn-primary"
                            >
                                <HomeIcon className="w-4 h-4 mr-2" />
                                Go back home
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Forbidden;