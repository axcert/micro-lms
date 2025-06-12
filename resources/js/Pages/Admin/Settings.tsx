import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CogIcon,
    BellIcon,
    ShieldCheckIcon,
    ServerIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SettingsData {
    system_name: string;
    system_email: string;
    timezone: string;
    maintenance_mode: boolean;
    notifications_enabled: boolean;
    backup_enabled: boolean;
    max_students_per_batch: number;
}

interface AdminSettingsProps {
    settings: SettingsData;
    flash: {
        success?: string;
        error?: string;
    };
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, flash }) => {
    const { data, setData, post, processing, errors, reset, isDirty } = useForm(settings);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            onSuccess: () => {
                // Handle success
            },
            onError: () => {
                // Handle error
            }
        });
    };

    const handleReset = () => {
        post('/admin/settings/reset', {
            onSuccess: () => {
                setShowResetConfirm(false);
                reset();
            }
        });
    };

    const goBack = () => {
        router.get('/admin/dashboard');
    };

    // Toast notification component
    const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
        const [show, setShow] = useState(true);

        useEffect(() => {
            const timer = setTimeout(() => setShow(false), 5000);
            return () => clearTimeout(timer);
        }, []);

        if (!show) return null;

        return (
            <div className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${
                type === 'success' ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
            }`}>
                <div className="flex items-center space-x-3">
                    {type === 'success' ? (
                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : (
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    )}
                    <span className={`font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {message}
                    </span>
                    <button 
                        onClick={() => setShow(false)}
                        className={`text-sm ${type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    };

    const settingSections = [
        {
            title: 'System Configuration',
            icon: CogIcon,
            color: 'from-green-500 to-green-600',
            settings: [
                {
                    key: 'system_name',
                    label: 'System Name',
                    type: 'text',
                    description: 'The name of your LMS application displayed throughout the system'
                },
                {
                    key: 'system_email',
                    label: 'System Email',
                    type: 'email',
                    description: 'Default email address used for system notifications and communications'
                },
                {
                    key: 'timezone',
                    label: 'System Timezone',
                    type: 'select',
                    options: [
                        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                        { value: 'Asia/Colombo', label: 'Asia/Colombo (Sri Lanka)' },
                        { value: 'America/New_York', label: 'America/New_York (Eastern Time)' },
                        { value: 'Europe/London', label: 'Europe/London (Greenwich Mean Time)' },
                        { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time)' },
                        { value: 'Australia/Sydney', label: 'Australia/Sydney (Australian Eastern Time)' }
                    ],
                    description: 'Default timezone for scheduling classes and displaying timestamps'
                }
            ]
        },
        {
            title: 'User Management',
            icon: UserGroupIcon,
            color: 'from-gray-600 to-gray-700',
            settings: [
                {
                    key: 'max_students_per_batch',
                    label: 'Maximum Students per Batch',
                    type: 'number',
                    description: 'Maximum number of students that can be enrolled in a single batch',
                    min: 1,
                    max: 500
                }
            ]
        },
        {
            title: 'System Controls',
            icon: ShieldCheckIcon,
            color: 'from-purple-500 to-purple-600',
            settings: [
                {
                    key: 'maintenance_mode',
                    label: 'Maintenance Mode',
                    type: 'toggle',
                    description: 'Enable maintenance mode to prevent user access during system updates',
                    warning: 'This will make the site inaccessible to all users except administrators'
                },
                {
                    key: 'notifications_enabled',
                    label: 'System Notifications',
                    type: 'toggle',
                    description: 'Enable email and SMS notifications for important system events'
                },
                {
                    key: 'backup_enabled',
                    label: 'Automatic Backups',
                    type: 'toggle',
                    description: 'Enable daily automatic database backups to ensure data safety'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <Head title="Admin Settings" />
            
            {/* Toast Notifications */}
            {flash.success && <Toast message={flash.success} type="success" />}
            {flash.error && <Toast message={flash.error} type="error" />}
            
            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-green-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={goBack}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <CogIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                                        System Settings
                                    </h1>
                                    <p className="text-sm text-gray-500">Configure your LMS settings</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Save Status */}
                        {isDirty && (
                            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <span>Unsaved changes</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {settingSections.map((section, sectionIndex) => {
                        const SectionIcon = section.icon;
                        return (
                            <div key={sectionIndex} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                {/* Section Header */}
                                <div className={`bg-gradient-to-r ${section.color} p-6`}>
                                    <div className="flex items-center space-x-3">
                                        <SectionIcon className="w-6 h-6 text-white" />
                                        <h2 className="text-lg font-bold text-white">{section.title}</h2>
                                    </div>
                                </div>

                                {/* Section Content */}
                                <div className="p-6 space-y-8">
                                    {section.settings.map((setting, settingIndex) => (
                                        <div key={settingIndex} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-semibold text-gray-800">
                                                    {setting.label}
                                                </label>
                                                {setting.warning && data[setting.key as keyof SettingsData] && (
                                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center space-x-1">
                                                        <ExclamationTriangleIcon className="w-3 h-3" />
                                                        <span>Warning</span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{setting.description}</p>
                                            {setting.warning && (
                                                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                    ⚠️ {setting.warning}
                                                </p>
                                            )}
                                            
                                            {setting.type === 'text' || setting.type === 'email' || setting.type === 'number' ? (
                                                <input
                                                    type={setting.type}
                                                    value={data[setting.key as keyof SettingsData] as string | number}
                                                    onChange={(e) => setData(setting.key as keyof SettingsData, 
                                                        setting.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                                                    )}
                                                    min={setting.min}
                                                    max={setting.max}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : setting.type === 'select' ? (
                                                <select
                                                    value={data[setting.key as keyof SettingsData] as string}
                                                    onChange={(e) => setData(setting.key as keyof SettingsData, e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                >
                                                    {setting.options?.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : setting.type === 'toggle' ? (
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData(setting.key as keyof SettingsData, !data[setting.key as keyof SettingsData])}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                                                            data[setting.key as keyof SettingsData] ? 'bg-green-600' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                                data[setting.key as keyof SettingsData] ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                        />
                                                    </button>
                                                    <span className={`text-sm font-medium ${
                                                        data[setting.key as keyof SettingsData] ? 'text-green-700' : 'text-gray-500'
                                                    }`}>
                                                        {data[setting.key as keyof SettingsData] ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </div>
                                            ) : null}
                                            
                                            {errors[setting.key as keyof typeof errors] && (
                                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                                    <span>{errors[setting.key as keyof typeof errors]}</span>
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setShowResetConfirm(true)}
                            className="px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center space-x-2"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            <span>Reset to Defaults</span>
                        </button>
                        
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel Changes
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !isDirty}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{processing ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">Reset Settings</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to reset all settings to their default values? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;