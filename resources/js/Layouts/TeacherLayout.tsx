// resources/js/Layouts/TeacherLayout.tsx

import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { User } from '@/types';
import TeacherSidebar from '@/Components/Layout/TeacherSidebar';
import { AcademicCapIcon, Bars3Icon } from '@/Components/UI/Icons';

interface TeacherLayoutProps {
    children: ReactNode;
    user: User;
    title: string;
    currentPage?: string;
    headerContent?: ReactNode;
    pageDescription?: string;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ 
    children, 
    user, 
    title, 
    currentPage = '',
    headerContent,
    pageDescription
}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        setSidebarOpen(false);
    };

    // Close sidebar on escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [sidebarOpen]);

    // Prevent body scroll when sidebar is open on mobile
    React.useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
            <Head title={title} />
            
            {/* Sidebar */}
            <TeacherSidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={user}
                currentPage={currentPage}
            />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-0 min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                                    aria-label="Open sidebar"
                                >
                                    <Bars3Icon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                                        <AcademicCapIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                                            {title}
                                        </h1>
                                        <p className="text-gray-600 text-sm lg:text-base">
                                            {pageDescription || 'Manage your educational content efficiently'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {headerContent && (
                                <div className="hidden sm:flex items-center">
                                    {headerContent}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>

                {/* Footer (optional) */}
                <footer className="bg-white/50 border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <AcademicCapIcon className="w-4 h-4" />
                            <span>MicroLMS Teacher Portal</span>
                        </div>
                        <div className="hidden sm:flex items-center space-x-4">
                            <span>Welcome, {user.name.split(' ')[0]}</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default TeacherLayout;