import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { route } from "@/Utils/routes";

// Custom SVG Icons
const EyeIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);

const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const UserIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UsersIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const ShieldCheckIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const UserPlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const BookOpenIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const PencilIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    role: string;
    specialization?: string; // For teachers
    department?: string; // For admins
}

const AdminTeacherRegister: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<RegisterData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'teacher', // Default to teacher
        specialization: '',
        department: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
            setIsLoaded(true);
        }, 1200);
        return () => {
            clearTimeout(timer);
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin-teacher.register'));
    };

    const roles = [
        {
            value: "teacher",
            label: "Teacher",
            description: "Manage classes, create quizzes, track student progress",
            icon: UsersIcon,
            gradient: 'from-blue-100 to-blue-200',
            hoverGradient: 'hover:from-blue-200 hover:to-blue-300',
            textColor: 'text-blue-600',
            bgGradient: 'from-blue-50 via-blue-100 to-blue-50'
        },
        {
            value: "admin",
            label: "Administrator",
            description: "Full system access, user management, system settings",
            icon: ShieldCheckIcon,
            gradient: 'from-purple-100 to-purple-200',
            hoverGradient: 'hover:from-purple-200 hover:to-purple-300',
            textColor: 'text-purple-600',
            bgGradient: 'from-purple-50 via-purple-100 to-purple-50'
        }
    ];

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
                <Head title="Loading..." />
                {/* Background orbs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full blur-2xl opacity-30 animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-black/10 to-black/20 rounded-full blur-xl opacity-20 animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full blur-3xl opacity-20 animate-float delay-500"></div>
                
                <div className="text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200/50 animate-float mx-auto relative">
                            <UserPlusIcon className="w-10 h-10 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-4 animate-green-text">
                        Preparing Registration
                    </h2>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-bounce delay-200"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce delay-300"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-700 rounded-full animate-bounce delay-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Head title="Staff Registration" />
            
            {/* Enhanced Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full blur-2xl animate-float-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-purple-100/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow delay-500"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-green-300/30 to-green-400/30 rounded-full blur-2xl animate-float delay-700"></div>
                
                {/* Icons */}
                <div className="absolute top-10 left-5 md:top-20 md:left-10 opacity-30">
                    <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12 text-green-500 animate-float-slow" />
                </div>
                <div className="absolute top-32 right-8 md:top-40 md:right-20 opacity-25">
                    <UsersIcon className="w-6 h-6 md:w-10 md:h-10 text-blue-500 animate-float-slow delay-1000" />
                </div>
                <div className="absolute bottom-40 left-8 md:bottom-32 md:left-1/4 opacity-30">
                    <PencilIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-600 animate-pencil-write" />
                </div>
                <div className="absolute top-60 right-4 md:right-16 opacity-25">
                    <ShieldCheckIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-800 animate-bounce-gentle delay-500" />
                </div>
                
                {/* New Elements */}
                <div className="absolute top-1/4 left-20 opacity-20">
                    <StarIcon className="w-8 h-8 text-blue-400 animate-star-twinkle" />
                </div>
                <div className="absolute bottom-1/3 left-16 opacity-20">
                    <StarIcon className="w-10 h-10 text-purple-500 animate-star-twinkle delay-700" />
                </div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col xl:flex-row">
                {/* Left Side - Welcome Section */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 order-2 xl:order-1 transform transition-all duration-1000 ease-out ${
                    isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                }`}>
                    <div className="max-w-lg w-full text-center animate-fade-in-up">
                        {/* Enhanced Logo */}
                        <div className="mb-8 md:mb-12 transform hover:scale-105 transition-transform duration-500">
                            <div className="mx-auto w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200/50 animate-float relative">
                                <AcademicCapIcon className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-white drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-gray-600 to-black rounded-full animate-ping"></div>
                            </div>
                            <div className="mt-4 md:mt-6">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2 md:mb-3 animate-green-text">
                                    Micro LMS
                                </h1>
                                <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-green-500 to-black mx-auto rounded-full animate-gradient-shift"></div>
                            </div>
                        </div>

                        {/* Enhanced Welcome Text */}
                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight animate-slide-in-left">
                                Join Our<br />
                                <span className="bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent animate-green-text">
                                    Teaching Team
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl animate-slide-in-right delay-200">
                                Become part of our
                                <br />
                                <span className="font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                    educational mission
                                </span>
                            </p>
                            <div className="pt-4 md:pt-6 animate-fade-in delay-400">
                                <p className="text-gray-600 text-sm mb-3 md:mb-4">
                                    Want to register as a student?
                                </p>
                                <Link
                                    href={route('register')}
                                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 md:py-3 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer text-sm md:text-base relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Student Registration</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </Link>
                            </div>
                        </div>

                        {/* Enhanced Features */}
                        <div className="hidden md:block backdrop-blur-sm bg-gradient-to-br from-white/90 to-gray-50/80 border border-green-100 rounded-2xl md:rounded-3xl shadow-xl shadow-green-100/30 p-4 md:p-6 lg:p-8 transform hover:scale-105 transition-all duration-500 animate-slide-in-up delay-600">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 md:mb-6 flex items-center justify-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 animate-green-pulse"></div>
                                Staff Benefits
                            </h3>
                            <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-blue-100 hover:to-blue-200">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="text-gray-800 font-medium">Advanced teaching tools</span>
                                </div>
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-purple-100 hover:to-purple-200">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full mr-3 animate-pulse delay-200"></div>
                                    <span className="text-gray-800 font-medium">Student analytics</span>
                                </div>
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-green-100 hover:to-green-200">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-3 animate-pulse delay-400"></div>
                                    <span className="text-gray-800 font-medium">Comprehensive reporting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Enhanced Registration Form */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 relative order-1 xl:order-2 transform transition-all duration-1000 ease-out delay-300 ${
                    isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}>
                    <div className="w-full max-w-md relative">
                        <div className="backdrop-blur-lg bg-gradient-to-br from-white/95 to-gray-50/90 border border-green-200 rounded-2xl md:rounded-3xl shadow-2xl shadow-green-200/30 p-6 md:p-8 lg:p-10 animate-slide-in-right relative overflow-hidden">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white to-gray-50/30 rounded-2xl md:rounded-3xl"></div>
                            
                            <div className="relative z-10">
                                {/* Enhanced Form Header */}
                                <div className="text-center mb-6 md:mb-8">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2 animate-green-text">
                                        Staff Registration
                                    </h3>
                                    <p className="text-gray-600 text-sm animate-fade-in delay-200">Join our teaching team</p>
                                    <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-green-500 to-black mx-auto rounded-full animate-gradient-shift mt-2"></div>
                                </div>

                                <form onSubmit={submit} className="space-y-4 md:space-y-5">
                                    {/* Role Selection */}
                                    <div className="animate-slide-in-up delay-200">
                                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                                            Select Your Role *
                                        </label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {roles.map((role, index) => {
                                                const IconComponent = role.icon;
                                                return (
                                                    <label
                                                        key={role.value}
                                                        className={`relative flex items-center p-4 bg-gradient-to-r ${role.gradient} ${role.hoverGradient} border-2 border-white/40 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                                                            data.role === role.value ? 'border-green-400 shadow-lg shadow-green-100/50 scale-105' : 'hover:border-green-300'
                                                        } animate-fade-in`}
                                                        style={{ animationDelay: `${index * 100 + 300}ms` }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value={role.value}
                                                            checked={data.role === role.value}
                                                            onChange={(e) => setData('role', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center flex-1">
                                                            <div className={`w-12 h-12 bg-gradient-to-br ${role.bgGradient} rounded-lg flex items-center justify-center mr-4 shadow-sm`}>
                                                                <IconComponent className={`w-6 h-6 ${role.textColor}`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`${role.textColor} font-semibold text-sm md:text-base`}>{role.label}</div>
                                                                <div className="text-gray-600 text-xs md:text-sm">{role.description}</div>
                                                            </div>
                                                            {data.role === role.value && (
                                                                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-green-pulse"></div>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.role && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.role}</p>
                                        )}
                                    </div>

                                    {/* Name Field */}
                                    <div className="animate-slide-in-up delay-400">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.name ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="animate-slide-in-up delay-500">
                                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.email ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Field */}
                                    <div className="animate-slide-in-up delay-600">
                                        <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.phone ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.phone}</p>
                                        )}
                                    </div>

                                   

                                    

                                    {/* Password Fields */}
                                    <div className="animate-slide-in-up delay-800">
                                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Password *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                required
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.password ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-all duration-300 hover:scale-110"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="animate-slide-in-up delay-900">
                                        <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Confirm Password *
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                required
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 bg-white border-2 border-green-200 rounded-xl md:rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-100/50 group-hover:border-green-400 group-hover:shadow-md text-sm md:text-base ${
                                                    errors.password_confirmation ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-all duration-300 hover:scale-110"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-red-500 text-xs md:text-sm animate-shake">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Terms */}
                                    <div className="text-center animate-slide-in-up delay-1000">
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            By registering, you agree to our<br />
                                            <span className="text-green-600 hover:text-black hover:underline cursor-pointer font-medium transition-colors duration-200">Terms of Service</span> and{' '}
                                            <span className="text-green-600 hover:text-black hover:underline cursor-pointer font-medium transition-colors duration-200">Privacy Policy</span>
                                        </p>
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group shadow-lg hover:shadow-xl animate-slide-in-up delay-1100 text-sm md:text-base animate-green-glow"
                                    >
                                        <span className="relative z-10">
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2 md:space-x-3">
                                                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 md:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="animate-pulse">CREATING ACCOUNT...</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center space-x-2">
                                                    <span>REGISTER AS {data.role.toUpperCase()}</span>
                                                    <UserPlusIcon className="w-4 h-4 md:w-5 md:h-5 animate-bounce-gentle delay-200" />
                                                </span>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    </button>
                                </form>

                                {/* Login Link */}
                                <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-green-100 animate-slide-in-up delay-1200">
                                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                        Already have an account?
                                    </p>
                                    <Link
                                        href={route('login')}
                                        className="inline-block bg-white hover:bg-gray-50 border-2 border-green-200 hover:border-green-400 text-green-600 hover:text-green-700 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-lg text-xs md:text-sm relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">Sign In</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/50 to-green-50/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    </Link>
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
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent mb-2">Creating Your Account</h3>
                            <p className="text-gray-600 text-sm">Please wait while we set up your {data.role} profile...</p>
                            <div className="flex justify-center space-x-1 mt-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
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
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
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
                @keyframes green-pulse {
                    0% {
                        background: linear-gradient(45deg, #22c55e, #16a34a);
                        transform: scale(1);
                    }
                    50% {
                        background: linear-gradient(45deg, #16a34a, #15803d);
                        transform: scale(1.2);
                    }
                    100% {
                        background: linear-gradient(45deg, #15803d, #22c55e);
                        transform: scale(1);
                    }
                }
                @keyframes star-twinkle {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.2) rotate(180deg);
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
                    50% {
                        box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4), 0 0 20px rgba(21, 128, 61, 0.3);
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
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
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
                .animate-green-pulse {
                    animation: green-pulse 3s ease-in-out infinite;
                }
                .animate-star-twinkle {
                    animation: star-twinkle 4s ease-in-out infinite;
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
                .delay-800 { animation-delay: 0.8s; }
                .delay-900 { animation-delay: 0.9s; }
                .delay-1000 { animation-delay: 1s; }
                .delay-1100 { animation-delay: 1.1s; }
                .delay-1200 { animation-delay: 1.2s; }

                @media (max-width: 768px) {
                    .animate-slide-in-left,
                    .animate-slide-in-right,
                    .animate-slide-in-up {
                        animation-duration: 0.6s;
                    }
                }

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

export default AdminTeacherRegister;