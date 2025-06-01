import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { 
    BellIcon, 
    UserCircleIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { PageProps } from '@/types';

interface NavbarProps {
    auth: PageProps['auth'];
}

const Navbar: React.FC<NavbarProps> = ({ auth }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
        setIsProfileOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Micro LMS</span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900">{auth.user?.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{auth.user?.role}</div>
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                                        Profile Settings
                                    </Link>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;