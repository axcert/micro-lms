import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Layout/Navbar';
import Sidebar from '@/Components/Layout/Sidebar';
import { PageProps } from '@/types';

interface AppLayoutProps extends PageProps {
    children: ReactNode;
    title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, auth }) => {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50">
                <Navbar auth={auth} />
                <div className="flex h-screen pt-16">
                    <Sidebar userRole={auth.user?.role} />
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AppLayout;