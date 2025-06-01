import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import GuestLayout from '@/Layouts/GuestLayout';
import toast from 'react-hot-toast';

interface LoginData {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<LoginData>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout title="Login">
            <Head title="Login" />

            <div className="mb-6 text-center">
                <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">M</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="label">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    {canResetPassword && (
                        <div className="text-sm">
                            <Link
                                href="/forgot-password"
                                className="font-medium text-primary-600 hover:text-primary-500"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
                <div className="text-xs text-blue-700 space-y-1">
                    <div>Admin: admin@mlms.com / password</div>
                    <div>Teacher: teacher@mlms.com / password</div>
                    <div>Student: student@mlms.com / password</div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Login;
