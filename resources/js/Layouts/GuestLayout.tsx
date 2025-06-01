import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface GuestLayoutProps {
    children: ReactNode;
    title?: string;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children, title }) => {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </>
    );
};

export default GuestLayout;