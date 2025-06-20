// resources/js/Pages/Teacher/Classes/Create.tsx

import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { CreateClassProps, CreateClassFormData } from '@/types';
import {
    ArrowLeftIcon,
    VideoIcon,
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    FileTextIcon,
    SettingsIcon,
    AlertCircleIcon,
    CheckCircleIcon
} from '@/Components/UI/Icons';

const CreateClass: React.FC<CreateClassProps> = ({ batches, auth, errors = {}, flash }) => {
    const { data, setData, post, processing, reset } = useForm<CreateClassFormData>({
        title: '',
        description: '',
        batch_id: '',
        scheduled_at: '',
        duration_minutes: 60,
        zoom_link: '',
        notes: '',
        create_attendance: true
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const selectedBatch = batches.find(batch => batch.id.toString() === data.batch_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous validation errors
        setValidationErrors({});
        
        // Client-side validation
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

        if (data.zoom_link && !isValidUrl(data.zoom_link)) {
            newErrors.zoom_link = 'Please enter a valid Zoom meeting URL.';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        // Submit form
        post('/teacher/classes', {
            onSuccess: () => {
                // Form submission successful - redirect handled by backend
            },
            onError: (errors) => {
                setValidationErrors(errors);
            }
        });
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    };

    // Combine server errors with client validation errors
    const allErrors = { ...errors, ...validationErrors };

    // Header content with back button
    const headerContent = (
        <div className="flex items-center space-x-3">
            <button
                onClick={() => router.visit('/teacher/classes')}
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Classes
            </button>
        </div>
    );

    return (
        <TeacherLayout 
            user={auth.user} 
            title="Schedule New Class"
            currentPage="classes"
            headerContent={headerContent}
            pageDescription="Create a new online class session for your students"
        >
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

                {/* No Batches Warning */}
                {batches.length === 0 && (
                    <div className="mb-8 rounded-2xl bg-yellow-50 p-6 border border-yellow-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircleIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-yellow-800 font-semibold mb-2">
                                    No Batches Available
                                </h3>
                                <p className="text-yellow-700 mb-4">
                                    You need to create at least one batch before you can schedule classes.
                                </p>
                                <button
                                    onClick={() => router.visit('/teacher/batches/create')}
                                    className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                                >
                                    Create Your First Batch
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Form */}
                {batches.length > 0 && (
                    <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="space-y-8 p-8">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <FileTextIcon className="h-6 w-6 mr-3 text-indigo-600" />
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
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                allErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                            }`}
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
                                            className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
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
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                allErrors.batch_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                            }`}
                                            required
                                        >
                                            <option value="">Choose a batch...</option>
                                            {batches.map(batch => (
                                                <option key={batch.id} value={batch.id.toString()}>
                                                    {batch.name} ({batch.students_count || batch.student_count} students)
                                                </option>
                                            ))}
                                        </select>
                                        {allErrors.batch_id && (
                                            <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.batch_id}</p>
                                        )}
                                        
                                        {selectedBatch && (
                                            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                                                <p className="text-indigo-700 font-medium flex items-center">
                                                    <UsersIcon className="inline h-5 w-5 mr-2" />
                                                    {selectedBatch.students_count || selectedBatch.student_count} students will be invited to this class
                                                </p>
                                                {selectedBatch.description && (
                                                    <p className="text-indigo-600 text-sm mt-2">
                                                        {selectedBatch.description}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <CalendarIcon className="h-6 w-6 mr-3 text-indigo-600" />
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
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
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
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
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

                            {/* Meeting Information */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <VideoIcon className="h-6 w-6 mr-3 text-indigo-600" />
                                    Meeting Details
                                </h3>
                                
                                <div>
                                    {/* Zoom Link */}
                                    <div>
                                        <label htmlFor="zoom_link" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Zoom Meeting Link (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            id="zoom_link"
                                            value={data.zoom_link}
                                            onChange={(e) => setData('zoom_link', e.target.value)}
                                            className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                allErrors.zoom_link ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                            }`}
                                            placeholder="https://zoom.us/j/123456789"
                                        />
                                        {allErrors.zoom_link && (
                                            <p className="mt-3 text-sm text-red-600 font-medium">{allErrors.zoom_link}</p>
                                        )}
                                        <p className="mt-3 text-gray-600">
                                            Students will access the class through this link
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Settings */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <SettingsIcon className="h-6 w-6 mr-3 text-indigo-600" />
                                    Additional Settings
                                </h3>
                                
                                <div className="space-y-6">
                                    {/* Notes */}
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-3">
                                            Class Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={4}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                                            placeholder="Any additional notes or instructions for this class..."
                                        />
                                    </div>

                                    {/* Create Attendance */}
                                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.create_attendance}
                                                onChange={(e) => setData('create_attendance', e.target.checked)}
                                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-4 text-gray-800 font-semibold">
                                                Create attendance records for all students
                                            </span>
                                        </label>
                                        <p className="mt-3 ml-9 text-gray-600">
                                            This will create attendance records that you can mark during or after the class
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t border-gray-200 pt-8">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/teacher/classes')}
                                        className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center ${
                                            processing ? 'opacity-50 cursor-not-allowed transform-none' : ''
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Scheduling...
                                            </>
                                        ) : (
                                            <>
                                                <CalendarIcon className="w-5 h-5 mr-2" />
                                                Schedule Class
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </TeacherLayout>
    );
};

export default CreateClass;