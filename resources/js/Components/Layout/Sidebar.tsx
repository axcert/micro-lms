import React from 'react';
import { Link } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    BookOpenIcon,
    CalendarIcon,
    DocumentTextIcon,
    ChartBarIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    roles?: string[];
}

interface SidebarProps {
    userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const navigationItems: NavItem[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: HomeIcon,
        },
        // Admin Navigation
        {
            name: 'User Management',
            href: '/admin/users',
            icon: UsersIcon,
            roles: ['admin'],
        },
        {
            name: 'Reports',
            href: '/admin/reports',
            icon: ChartBarIcon,
            roles: ['admin'],
        },
        // Teacher Navigation
        {
            name: 'Batches',
            href: '/teacher/batches',
            icon: AcademicCapIcon,
            roles: ['teacher'],
        },
        {
            name: 'Classes',
            href: '/teacher/classes',
            icon: CalendarIcon,
            roles: ['teacher'],
        },
        {
            name: 'Quizzes',
            href: '/teacher/quizzes',
            icon: ClipboardDocumentListIcon,
            roles: ['teacher'],
        },
        {
            name: 'Create Quiz',
            href: '/teacher/quiz/create',
            icon: DocumentTextIcon,
            roles: ['teacher'],
        },
        // Student Navigation
        {
            name: 'My Classes',
            href: '/student/classes',
            icon: CalendarIcon,
            roles: ['student'],
        },
        {
            name: 'My Results',
            href: '/student/results',
            icon: ChartBarIcon,
            roles: ['student'],
        },
    ];

    const filteredNavigation = navigationItems.filter(
        (item) => !item.roles || (userRole && item.roles.includes(userRole))
    );

    return (
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
            <nav className="mt-6 px-3">
                <div className="space-y-1">
                    {filteredNavigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;