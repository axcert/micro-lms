import React, { useEffect, useState } from 'react';

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const HeartIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const UserPlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    role: string;
}

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<RegisterData>>({});
    
    const [data, setData] = useState<RegisterData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
            setIsLoaded(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        // Simulate API call with validation
        setTimeout(() => {
            const newErrors: Partial<RegisterData> = {};
            
            if (!data.name) newErrors.name = 'Name is required';
            if (!data.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email format is invalid';
            if (!data.phone) newErrors.phone = 'Phone number is required';
            if (!data.password) newErrors.password = 'Password is required';
            else if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
            if (data.password !== data.password_confirmation) {
                newErrors.password_confirmation = 'Passwords do not match';
            }
            
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setProcessing(false);
                return;
            }
            
            // Success simulation
            alert('Account created successfully!');
            setProcessing(false);
        }, 2000);
    };

    const handleInputChange = (field: keyof RegisterData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const roles = [
        {
            value: 'student',
            label: 'Student',
            description: 'Access classes, take quizzes, view results',
            icon: UserIcon,
            gradient: 'from-emerald-100 to-green-100',
            hoverGradient: 'hover:from-emerald-200 hover:to-green-200',
            textColor: 'text-emerald-600',
            bgGradient: 'from-emerald-50 via-green-50 to-teal-50'
        },
        {
            value: 'teacher',
            label: 'Teacher',
            description: 'Manage batches, create quizzes, track progress',
            icon: UsersIcon,
            gradient: 'from-teal-100 to-cyan-100',
            hoverGradient: 'hover:from-teal-200 hover:to-cyan-200',
            textColor: 'text-teal-600',
            bgGradient: 'from-teal-50 via-cyan-50 to-emerald-50'
        },
        {
            value: 'admin',
            label: 'Administrator',
            description: 'Full system access and user management',
            icon: ShieldCheckIcon,
            gradient: 'from-green-100 to-emerald-100',
            hoverGradient: 'hover:from-green-200 hover:to-emerald-200',
            textColor: 'text-green-600',
            bgGradient: 'from-green-50 via-emerald-50 to-lime-50'
        }
    ];

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 via-teal-50 to-lime-50 flex items-center justify-center relative overflow-hidden">
                {/* Colorful background orbs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-2xl opacity-20 animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-xl opacity-25 animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-lime-400 to-green-500 rounded-full blur-3xl opacity-15 animate-float delay-500"></div>
                
                <div className="text-center relative z-10">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200/50 animate-float mx-auto relative">
                            <UserPlusIcon className="w-10 h-10 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-lime-400 to-green-400 rounded-full animate-rainbow-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent mb-4 animate-rainbow-text">
                        Preparing Registration
                    </h2>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-lime-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-lime-400 to-teal-400 rounded-full animate-bounce delay-200"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full animate-bounce delay-300"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-bounce delay-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 via-teal-50 to-lime-50 relative overflow-hidden">
            {/* Enhanced Colorful Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Colorful Background Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-emerald-300/30 to-green-400/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-300/25 to-cyan-400/25 rounded-full blur-2xl animate-float-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-lime-300/20 to-green-400/20 rounded-full blur-3xl animate-float-slow delay-500"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full blur-2xl animate-float delay-700"></div>
                
                {/* Colorful Icons */}
                <div className="absolute top-10 left-5 md:top-20 md:left-10 opacity-30">
                    <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12 text-emerald-500 animate-float-slow" />
                </div>
                <div className="absolute top-32 right-8 md:top-40 md:right-20 opacity-25">
                    <PencilIcon className="w-6 h-6 md:w-10 md:h-10 text-teal-500 animate-pencil-write delay-1000" />
                </div>
                <div className="absolute bottom-40 left-8 md:bottom-32 md:left-1/4 opacity-30">
                    <UserPlusIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500 animate-bounce-gentle" />
                </div>
                <div className="absolute top-60 right-4 md:right-16 opacity-25">
                    <StarIcon className="w-5 h-5 md:w-7 md:h-7 text-lime-500 animate-rainbow-pulse delay-500" />
                </div>
                <div className="absolute bottom-20 right-6 md:bottom-20 md:right-10 opacity-30">
                    <HeartIcon className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-heart-beat" />
                </div>
                
                {/* New Colorful Elements */}
                <div className="absolute top-1/4 left-20 opacity-20">
                    <StarIcon className="w-8 h-8 text-lime-400 animate-rainbow-pulse" />
                </div>
                <div className="absolute top-1/3 right-32 opacity-25">
                    <HeartIcon className="w-6 h-6 text-green-400 animate-heart-beat" />
                </div>
                <div className="absolute bottom-1/3 left-16 opacity-20">
                    <UsersIcon className="w-10 h-10 text-teal-400 animate-float-slow delay-700" />
                </div>
                
                {/* Floating colored papers */}
                <div className="absolute top-1/3 left-12 w-8 h-10 md:w-12 md:h-16 bg-gradient-to-br from-emerald-200 to-green-300 rounded-sm shadow-lg animate-paper-float opacity-40"></div>
                <div className="absolute bottom-1/3 right-12 w-6 h-8 md:w-10 md:h-12 bg-gradient-to-br from-teal-200 to-cyan-300 rounded-sm shadow-md animate-paper-float delay-700 opacity-35"></div>
                <div className="absolute top-1/2 left-1/3 w-7 h-9 bg-gradient-to-br from-lime-200 to-green-300 rounded-sm shadow-md animate-paper-float delay-1200 opacity-30"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col xl:flex-row">
                {/* Left Side - Welcome Section */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 order-2 xl:order-1 transform transition-all duration-1000 ease-out ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}>
                    <div className="max-w-lg w-full text-center animate-fade-in-up">
                        {/* Enhanced Logo */}
                        <div className="mb-8 md:mb-12 transform hover:scale-105 transition-transform duration-500">
                            <div className="mx-auto w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gradient-to-br from-emerald-500 via-green-500 via-teal-400 to-lime-400 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200/50 animate-float relative">
                                <AcademicCapIcon className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-white drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-lime-400 to-green-400 rounded-full animate-rainbow-pulse"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full animate-ping"></div>
                            </div>
                            <div className="mt-4 md:mt-6">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 via-teal-500 to-lime-500 bg-clip-text text-transparent mb-2 md:mb-3 animate-rainbow-text">
                                    Micro LMS
                                </h1>
                                <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 mx-auto rounded-full animate-gradient-shift"></div>
                            </div>
                        </div>
                        
                        {/* Enhanced Welcome Text */}
                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight animate-slide-in-left">
                                Join the<br />
                                <span className="bg-gradient-to-r from-emerald-600 via-green-500 via-teal-500 to-lime-500 bg-clip-text text-transparent animate-rainbow-text">
                                    Learning Revolution
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl animate-slide-in-right delay-200">
                                Create your account and<br />
                                <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">start your journey today</span>
                            </p>
                            <div className="pt-4 md:pt-6 animate-fade-in delay-400">
                                <p className="text-gray-600 text-sm mb-3 md:mb-4">
                                    Already have an account?
                                </p>
                                <button
                                    onClick={() => alert('Navigate to login')}
                                    className="inline-block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-semibold py-2.5 md:py-3 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer animate-rainbow-glow text-sm md:text-base relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                            </div>
                        </div>
                        
                        {/* Enhanced Features */}
                        <div className="hidden md:block backdrop-blur-sm bg-gradient-to-br from-white/80 to-white/60 border border-emerald-100/50 rounded-2xl md:rounded-3xl shadow-xl shadow-emerald-100/30 p-4 md:p-6 lg:p-8 transform hover:scale-105 transition-all duration-500 animate-slide-in-up delay-600">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 md:mb-6 flex items-center justify-center">
                                <UserPlusIcon className="w-4 h-4 mr-2 text-emerald-600 animate-bounce-gentle" />
                                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 rounded-full mr-3 ml-2 animate-rainbow-pulse"></div>
                                What You'll Get
                            </h3>
                            <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100">
                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="text-gray-800 font-medium">Access to all courses</span>
                                </div>
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-teal-100 hover:via-cyan-100 hover:to-emerald-100">
                                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse delay-200"></div>
                                    <span className="text-gray-800 font-medium">Interactive quizzes</span>
                                </div>
                                <div className="flex items-center p-3 md:p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-lime-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:from-green-100 hover:via-emerald-100 hover:to-lime-100">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-lime-500 rounded-full mr-3 animate-pulse delay-400"></div>
                                    <span className="text-gray-800 font-medium">Progress tracking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Enhanced Registration Form */}
                <div className={`flex-1 flex items-center justify-center p-4 md:p-6 lg:p-12 relative order-1 xl:order-2 transform transition-all duration-1000 ease-out delay-300 ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}>
                    <div className="w-full max-w-md relative">
                        <div className="backdrop-blur-lg bg-gradient-to-br from-white/90 to-white/70 border border-white/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-emerald-200/30 p-6 md:p-8 lg:p-10 animate-slide-in-right relative overflow-hidden">
                            {/* Colorful background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 rounded-2xl md:rounded-3xl"></div>
                            
                            <div className="relative z-10">
                                {/* Enhanced Form Header */}
                                <div className="text-center mb-6 md:mb-8">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent mb-2 animate-rainbow-text">
                                        Create Your Account
                                    </h3>
                                    <p className="text-gray-600 text-sm animate-fade-in delay-200">Fill in your details to get started</p>
                                    <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 mx-auto rounded-full animate-gradient-shift mt-2"></div>
                                </div>

                                <div className="space-y-4 md:space-y-5">
                                    {/* Enhanced Role Selection */}
                                    <div className="animate-slide-in-up delay-200">
                                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                                            Select Your Role *
                                        </label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {roles.map((role, index) => {
                                                const IconComponent = role.icon;
                                                return (
                                                    <label
                                                        key={role.value}
                                                        className={`relative flex items-center p-3 bg-gradient-to-r ${role.gradient} ${role.hoverGradient} border-2 border-white/40 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                                                            data.role === role.value ? 'border-emerald-300 shadow-lg shadow-emerald-100/50 scale-105' : 'hover:border-emerald-200'
                                                        } animate-fade-in`}
                                                        style={{ animationDelay: `${index * 100 + 300}ms` }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value={role.value}
                                                            checked={data.role === role.value}
                                                            onChange={(e) => handleInputChange('role', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center flex-1">
                                                            <div className={`w-10 h-10 bg-gradient-to-br ${role.bgGradient} rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                                                                <IconComponent className={`w-5 h-5 ${role.textColor}`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`${role.textColor} font-semibold text-sm`}>{role.label}</div>
                                                                <div className="text-gray-600 text-xs">{role.description}</div>
                                                            </div>
                                                            {data.role === role.value && (
                                                                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
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

                                    {/* Enhanced Full Name Field */}
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
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className={`w-full px-4 py-3 bg-gradient-to-r from-white/95 to-white/90 border-2 border-emerald-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-100/50 group-hover:border-emerald-300 group-hover:shadow-md text-sm ${
                                                    errors.name ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your full name"
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-200/10 via-green-200/10 to-teal-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-red-500 text-xs animate-shake">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Email Field */}
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
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className={`w-full px-4 py-3 bg-gradient-to-r from-white/95 to-white/90 border-2 border-emerald-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-100/50 group-hover:border-emerald-300 group-hover:shadow-md text-sm ${
                                                    errors.email ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your email address"
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-200/10 via-green-200/10 to-teal-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-red-500 text-xs animate-shake">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Phone Field */}
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
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`w-full px-4 py-3 bg-gradient-to-r from-white/95 to-white/90 border-2 border-emerald-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-100/50 group-hover:border-emerald-300 group-hover:shadow-md text-sm ${
                                                    errors.phone ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Enter your phone number"
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-200/10 via-green-200/10 to-teal-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-2 text-red-500 text-xs animate-shake">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Password Field */}
                                    <div className="animate-slide-in-up delay-700">
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
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className={`w-full px-4 py-3 pr-12 bg-gradient-to-r from-white/95 to-white/90 border-2 border-emerald-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-100/50 group-hover:border-emerald-300 group-hover:shadow-md text-sm ${
                                                    errors.password ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-200/10 via-green-200/10 to-teal-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-red-500 text-xs animate-shake">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Confirm Password Field */}
                                    <div className="animate-slide-in-up delay-800">
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
                                                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                                className={`w-full px-4 py-3 pr-12 bg-gradient-to-r from-white/95 to-white/90 border-2 border-emerald-200/50 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-100/50 group-hover:border-emerald-300 group-hover:shadow-md text-sm ${
                                                    errors.password_confirmation ? 'border-red-300 focus:border-red-400' : ''
                                                }`}
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-200/10 via-green-200/10 to-teal-200/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-red-500 text-xs animate-shake">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Enhanced Terms */}
                                    <div className="text-center animate-slide-in-up delay-900">
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            By creating an account, you agree to our<br />
                                            <span className="text-emerald-600 hover:text-green-500 hover:underline cursor-pointer font-medium transition-colors duration-200">Terms of Service</span> and{' '}
                                            <span className="text-emerald-600 hover:text-green-500 hover:underline cursor-pointer font-medium transition-colors duration-200">Privacy Policy</span>
                                        </p>
                                    </div>

                                    {/* Enhanced Register Button */}
                                    <button
                                        onClick={submit}
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group shadow-lg hover:shadow-xl animate-slide-in-up delay-1000 text-sm animate-rainbow-glow"
                                        style={{
                                            background: processing ? 'linear-gradient(135deg, #0c995c, #059669, #10b981)' : undefined
                                        }}
                                    >
                                        <span className="relative z-10">
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="animate-pulse">CREATING ACCOUNT...</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center space-x-2">
                                                    <span>CREATE ACCOUNT</span>
                                                    <UserPlusIcon className="w-4 h-4 animate-bounce-gentle delay-200" />
                                                </span>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    </button>

                                    {/* Enhanced Login Link */}
                                    <div className="text-center mt-6 pt-4 border-t border-emerald-100 animate-slide-in-up delay-1100">
                                        <p className="text-gray-600 text-xs mb-3">
                                            Already have an account?
                                        </p>
                                        <button
                                            onClick={() => alert('Navigate to login')}
                                            className="inline-block bg-gradient-to-r from-white/90 to-white/80 hover:from-white hover:to-white border-2 border-emerald-200 hover:border-emerald-400 text-emerald-600 hover:text-emerald-700 font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-lg text-xs relative overflow-hidden group"
                                        >
                                            <span className="relative z-10">Sign In</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-white/95 to-white/85 rounded-3xl p-8 shadow-2xl border border-white/20 text-center max-w-sm mx-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent mb-2">Creating Your Account</h3>
                            <p className="text-gray-600 text-sm">Please wait while we set up your profile...</p>
                            <div className="flex justify-center space-x-1 mt-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
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
                @keyframes paper-float {
                    0%, 100% {
                        transform: translateY(0px) rotate(2deg);
                    }
                    33% {
                        transform: translateY(-10px) rotate(-1deg);
                    }
                    66% {
                        transform: translateY(-5px) rotate(3deg);
                    }
                }
                @keyframes rainbow-pulse {
                    0% {
                        background: linear-gradient(45deg, #10b981, #059669);
                        transform: scale(1);
                    }
                    25% {
                        background: linear-gradient(45deg, #059669, #0c995c);
                        transform: scale(1.1);
                    }
                    50% {
                        background: linear-gradient(45deg, #0c995c, #047857);
                        transform: scale(1.2);
                    }
                    75% {
                        background: linear-gradient(45deg, #047857, #064e3b);
                        transform: scale(1.1);
                    }
                    100% {
                        background: linear-gradient(45deg, #064e3b, #10b981);
                        transform: scale(1);
                    }
                }
                @keyframes rainbow-text {
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
                @keyframes rainbow-glow {
                    0%, 100% {
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3), 0 0 20px rgba(5, 150, 105, 0.2);
                    }
                    25% {
                        box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4), 0 0 20px rgba(12, 153, 92, 0.3);
                    }
                    50% {
                        box-shadow: 0 4px 15px rgba(12, 153, 92, 0.4), 0 0 20px rgba(4, 120, 87, 0.3);
                    }
                    75% {
                        box-shadow: 0 4px 15px rgba(4, 120, 87, 0.4), 0 0 20px rgba(6, 78, 59, 0.3);
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
                @keyframes heart-beat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    75% {
                        transform: scale(1.1);
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
                .animate-paper-float {
                    animation: paper-float 5s ease-in-out infinite;
                }
                .animate-rainbow-pulse {
                    animation: rainbow-pulse 3s ease-in-out infinite;
                }
                .animate-rainbow-text {
                    background: linear-gradient(90deg, #059669, #0c995c, #10b981, #34d399, #6ee7b7, #059669);
                    background-size: 400% 100%;
                    animation: rainbow-text 4s ease-in-out infinite;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .animate-rainbow-glow {
                    animation: rainbow-glow 3s ease-in-out infinite;
                }
                .animate-gradient-shift {
                    background: linear-gradient(90deg, #059669, #0c995c, #10b981, #059669);
                    background-size: 300% 100%;
                    animation: gradient-shift 3s ease-in-out infinite;
                }
                .animate-heart-beat {
                    animation: heart-beat 2s ease-in-out infinite;
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
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .animate-slide-in-left,
                    .animate-slide-in-right,
                    .animate-slide-in-up {
                        animation-duration: 0.6s;
                    }
                }
                
                /* Reduced motion */
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

export default Register;