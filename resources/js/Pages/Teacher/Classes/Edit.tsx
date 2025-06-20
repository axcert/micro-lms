import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    ArrowLeftIcon,
    VideoIcon,
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    FileTextIcon,
    SettingsIcon,
    AlertCircleIcon,
    CheckCircleIcon,
    TrashIcon,
    EyeIcon,
    LockClosedIcon,
    GlobeAltIcon
} from '@/Components/UI/Icons';

interface Batch {
    id: number;
    name: string;
    student_count: number;
    description?: string;
}

interface ClassData {
    id: number;
    title: string;
    description: string;
    batch_id: string;
    scheduled_at: string;
    duration_minutes: number;
    zoom_password?: string;
    max_attendees?: number;
    notes: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
    zoom_meeting_id?: string;
    zoom_join_url?: string;
    zoom_start_url?: string;
    batch?: Batch;
    teacher_id?: number;
    created_at?: string;
    updated_at?: string;
}

interface EditClassFormData {
    title: string;
    description: string;
    batch_id: string;
    scheduled_at: string;
    duration_minutes: number;
    zoom_password: string;
    max_attendees: number | '';
    notes: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
}

const EditClass = () => {
    const page = usePage();
    const props = page.props as any;
    
    // Get class data from props (Laravel sends it as 'class')
    const classData: ClassData = props.class || props.classData;
    const batches: Batch[] = props.batches || [];
    const auth = props.auth;
    const errors = props.errors || {};
    const flash = props.flash;

    const [isLoading, setIsLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Helper function to format datetime for HTML input
    const formatDateTimeForInput = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    // Check if we have valid class data
    useEffect(() => {
        if (classData && classData.id && classData.title) {
            setIsLoading(false);
        } else if (Object.keys(props).length > 2) {
            setIsLoading(false);
        }
    }, [classData, props]);

    // Initialize form data
    const { data, setData, put, processing } = useForm<EditClassFormData>({
        title: classData?.title || '',
        description: classData?.description || '',
        batch_id: classData?.batch_id?.toString() || '',
        scheduled_at: classData?.scheduled_at ? formatDateTimeForInput(classData.scheduled_at) : '',
        duration_minutes: classData?.duration_minutes || 60,
        zoom_password: classData?.zoom_password || '',
        max_attendees: classData?.max_attendees || '',
        notes: classData?.notes || '',
        status: classData?.status || 'scheduled'
    });

    // Show loading state
    if (isLoading) {
        return (
            <TeacherLayout 
                user={auth.user} 
                title="Loading..."
                currentPage="classes"
                pageDescription="Loading class data..."
            >
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-green-600 rounded-full" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-4 text-gray-600">Loading class data...</p>
                        </div>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

    // Show error if no valid class data
    if (!classData || !classData.id) {
        return (
            <TeacherLayout 
                user={auth.user} 
                title="Class Not Found"
                currentPage="classes"
                pageDescription="Unable to load class data"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-8 text-center">
                            <AlertCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Class Not Found</h2>
                            <p className="text-gray-600 mb-6">
                                The class data could not be loaded. Please check if the class exists or if you have permission to edit it.
                            </p>
                            
                            <button
                                onClick={() => router.visit('/teacher/classes')}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors duration-200"
                            >
                                Back to Classes
                            </button>
                        </div>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

    const selectedBatch = batches?.find(batch => batch.id.toString() === data.batch_id);

    const handleSubmit = () => {
        setValidationErrors({});
        
        const newErrors: Record<string, string> = {};
        
        if (!data.title.trim()) {
            newErrors.title = 'Class title is required.';
        }
        
        if (!data.batch_id) {
            newErrors.batch_id = 'Please select a batch for this class.';
        }
        
        if (!data.scheduled_at) {
            newErrors.scheduled_at = 'Class date and time is required.';
        } else {
            const scheduledDate = new Date(data.scheduled_at);
            if (scheduledDate <= new Date()) {
                newErrors.scheduled_at = 'Class must be scheduled for a future date and time.';
            }
        }
        
        if (data.duration_minutes < 15) {
            newErrors.duration_minutes = 'Class duration must be at least 15 minutes.';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        put(`/teacher/classes/${classData.id}`, {
            onSuccess: () => {
                // Update successful
            },
            onError: (errors) => {
                setValidationErrors(errors);
            }
        });
    };

    const handleDelete = () => {
        if (!classData?.id) return;
        router.delete(`/teacher/classes/${classData.id}`, {
            onSuccess: () => {
                // Deletion successful
            }
        });
    };

    const generateRandomPassword = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('zoom_password', password);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'scheduled':
                return { color: 'text-blue-600 bg-blue-100 border-blue-200', text: 'Scheduled', icon: CalendarIcon };
            case 'live':
                return { color: 'text-red-600 bg-red-100 border-red-200', text: 'Live Now', icon: VideoIcon };
            case 'completed':
                return { color: 'text-green-600 bg-green-100 border-green-200', text: 'Completed', icon: CheckCircleIcon };
            case 'cancelled':
                return { color: 'text-gray-600 bg-gray-100 border-gray-200', text: 'Cancelled', icon: AlertCircleIcon };
            case 'rescheduled':
                return { color: 'text-yellow-600 bg-yellow-100 border-yellow-200', text: 'Rescheduled', icon: ClockIcon };
            default:
                return { color: 'text-gray-600 bg-gray-100 border-gray-200', text: status, icon: AlertCircleIcon };
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    };

    const canEditSchedule = ['scheduled', 'rescheduled'].includes(data.status);
    const canChangeStatus = classData?.status !== 'completed';
    const statusInfo = getStatusInfo(data.status);
    const StatusIcon = statusInfo.icon;
    const allErrors = { ...errors, ...validationErrors };

    // Header content with back button and status
    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => router.visit('/teacher/classes')}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Classes
                </button>
            </div>
            <div className="flex items-center space-x-3">
                <div className={`px-4 py-2 rounded-xl border ${statusInfo.color} flex items-center`}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{statusInfo.text}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">ID: #{classData.id}</span>
            </div>
        </div>
    );

    return (
        <TeacherLayout 
            user={auth.user} 
            title="Edit Class"
            currentPage="classes"
            headerContent={headerContent}
            pageDescription={`Edit "${classData.title}" details and settings`}
        >
            <Head title={`Edit Class - ${classData.title}`} />
            
            <div className="max-w-4xl mx-auto">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-2xl bg-green-50 p-6 border border-green-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-green-800 font-medium">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-2xl bg-red-50 p-6 border border-red-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircleIcon className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-red-800 font-medium">{flash.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Warning for Live/Completed Classes */}
                {(['live', 'completed'].includes(data.status)) && (
                    <div className="mb-6 rounded-2xl bg-yellow-50 p-6 border border-yellow-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircleIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-yellow-800 font-semibold mb-2">
                                    Limited Editing Available
                                </h3>
                                <p className="text-yellow-700">
                                    {data.status === 'live' 
                                        ? 'This class is currently live. Only basic details can be modified.'
                                        : 'This class has been completed. Only notes and status can be modified.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Form */}
                <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                    <div className="space-y-8 p-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <FileTextIcon className="h-6 w-6 mr-3 text-green-600" />
                                Class Information
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {/* Class Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                                        Class Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        disabled={data.status === 'completed'}
                                        className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                            allErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                        } ${data.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''}`}
                                        placeholder="e.g., Quadratic Equations - Advanced Problems"
                                        required
                                    />
                                    {allErrors.title && (
                                        <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={data.status === 'completed'}
                                        className={`w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none ${
                                            data.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''
                                        }`}
                                        placeholder="Brief description of what will be covered in this class..."
                                    />
                                </div>

                                {/* Batch Selection */}
                                <div>
                                    <label htmlFor="batch_id" className="block text-sm font-semibold text-gray-800 mb-3">
                                        Select Batch *
                                    </label>
                                    <select
                                        id="batch_id"
                                        value={data.batch_id}
                                        onChange={(e) => setData('batch_id', e.target.value)}
                                        disabled={!canEditSchedule}
                                        className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                            allErrors.batch_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                        } ${!canEditSchedule ? 'bg-gray-50 text-gray-500' : ''}`}
                                        required
                                    >
                                        <option value="">Choose a batch...</option>
                                        {(batches || []).map(batch => (
                                            <option key={batch.id} value={batch.id.toString()}>
                                                {batch.name} ({batch.student_count} students)
                                            </option>
                                        ))}
                                    </select>
                                    {allErrors.batch_id && (
                                        <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.batch_id}</p>
                                    )}
                                    
                                    {selectedBatch && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                                            <p className="text-green-700 font-medium flex items-center">
                                                <UsersIcon className="inline h-5 w-5 mr-2" />
                                                {selectedBatch.student_count} students will be affected by changes
                                            </p>
                                            {selectedBatch.description && (
                                                <p className="text-green-600 text-sm mt-2">
                                                    {selectedBatch.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status Selection */}
                                {canChangeStatus && (
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Class Status
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as any)}
                                            className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="live">Live</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="rescheduled">Rescheduled</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Schedule Information */}
                        {canEditSchedule && (
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <CalendarIcon className="h-6 w-6 mr-3 text-green-600" />
                                    Schedule
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Date and Time */}
                                    <div>
                                        <label htmlFor="scheduled_at" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="scheduled_at"
                                            value={data.scheduled_at}
                                            onChange={(e) => setData('scheduled_at', e.target.value)}
                                            min={getTomorrowDate()}
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                                allErrors.scheduled_at ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                            }`}
                                            required
                                        />
                                        {allErrors.scheduled_at && (
                                            <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.scheduled_at}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label htmlFor="duration_minutes" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Duration (minutes) *
                                        </label>
                                        <select
                                            id="duration_minutes"
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value))}
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                                allErrors.duration_minutes ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                            }`}
                                            required
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={45}>45 minutes</option>
                                            <option value={60}>1 hour</option>
                                            <option value={90}>1.5 hours</option>
                                            <option value={120}>2 hours</option>
                                            <option value={150}>2.5 hours</option>
                                            <option value={180}>3 hours</option>
                                        </select>
                                        {allErrors.duration_minutes && (
                                            <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.duration_minutes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zoom Settings */}
                        {classData?.zoom_meeting_id && (
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <VideoIcon className="h-6 w-6 mr-3 text-green-600" />
                                    Zoom Settings
                                </h3>
                                
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <VideoIcon className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-blue-800 font-semibold mb-2">
                                                Zoom Meeting Configured
                                            </h3>
                                            <div className="text-blue-700">
                                                <p className="mb-1">Meeting ID: <span className="font-mono bg-white px-2 py-1 rounded">{classData?.zoom_meeting_id}</span></p>
                                                {classData?.zoom_join_url && (
                                                    <p>
                                                        <a 
                                                            href={classData?.zoom_join_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-500 underline font-medium"
                                                        >
                                                            Join Meeting Link
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Zoom Password */}
                                    <div>
                                        <label htmlFor="zoom_password" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Meeting Password
                                        </label>
                                        <div className="flex rounded-2xl border-2 border-gray-200 overflow-hidden">
                                            <input
                                                type="text"
                                                id="zoom_password"
                                                value={data.zoom_password}
                                                onChange={(e) => setData('zoom_password', e.target.value)}
                                                disabled={data.status === 'completed'}
                                                className={`flex-1 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-0 ${
                                                    data.status === 'completed' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                                                }`}
                                                placeholder="Meeting password"
                                                maxLength={10}
                                            />
                                            <button
                                                type="button"
                                                onClick={generateRandomPassword}
                                                disabled={data.status === 'completed'}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>

                                    {/* Max Attendees */}
                                    <div>
                                        <label htmlFor="max_attendees" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Maximum Attendees
                                        </label>
                                        <input
                                            type="number"
                                            id="max_attendees"
                                            value={data.max_attendees}
                                            onChange={(e) => setData('max_attendees', e.target.value ? parseInt(e.target.value) : '')}
                                            disabled={data.status === 'completed'}
                                            min="1"
                                            max="1000"
                                            className={`w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                                data.status === 'completed' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                                            }`}
                                            placeholder="e.g., 100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Settings */}
                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <SettingsIcon className="h-6 w-6 mr-3 text-green-600" />
                                Additional Settings
                            </h3>
                            
                            <div>
                                <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-3">
                                    Class Notes
                                </label>
                                <textarea
                                    id="notes"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                                    placeholder="Any additional notes or instructions for this class..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200 pt-8">
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 px-6 py-3 rounded-2xl font-semibold border-2 border-red-200 hover:border-red-300 transition-all duration-200 flex items-center"
                                >
                                    <TrashIcon className="h-5 w-5 mr-2" />
                                    Delete Class
                                </button>
                                
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/teacher/classes')}
                                        className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center ${
                                            processing ? 'opacity-50 cursor-not-allowed transform-none' : ''
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 mb-6">
                                    <TrashIcon className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Class</h3>
                                <p className="text-gray-600 mb-8">
                                    Are you sure you want to delete this class? This action cannot be undone and will also cancel any associated Zoom meeting.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
};

export default EditClass;