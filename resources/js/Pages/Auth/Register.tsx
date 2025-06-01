import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import GuestLayout from '@/Layouts/GuestLayout';

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<RegisterData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout title="Register">
            <Head title="Register" />

            <div className="mb-6 text-center">
                <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">M</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="label">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your full name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

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
                    <label htmlFor="phone" className="label">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={`input-field ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                            autoComplete="new-password"
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

                <div>
                    <label htmlFor="password_confirmation" className="label">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`input-field pr-10 ${errors.password_confirmation ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
            </form>
        </GuestLayout>
    );
};

export default Register;