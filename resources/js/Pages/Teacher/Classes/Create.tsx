import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Video, 
  Calendar, 
  Clock, 
  Users,
  FileText,
  Settings,
  BookOpen,
  Bell,
  LogOut,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  student_count: number;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  batches: Batch[];
  auth: {
    user: User;
  };
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

interface FormData {
  title: string;
  description: string;
  batch_id: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_link: string;
  notes: string;
  create_attendance: boolean;
}

export default function CreateClass({ batches, auth, errors = {}, flash }: Props) {
  const { data, setData, post, processing, reset } = useForm<FormData>({
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Head title="Schedule New Class" />
      
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">MicroLMS</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">{auth.user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <button 
                  onClick={() => router.visit('/teacher/dashboard')} 
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
                >
                  <Users className="text-gray-500 mr-3 h-5 w-5" />
                  Dashboard
                </button>
                <button 
                  onClick={() => router.visit('/teacher/batches')} 
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
                >
                  <BookOpen className="text-gray-500 mr-3 h-5 w-5" />
                  Batches
                </button>
                <button 
                  onClick={() => router.visit('/teacher/classes')} 
                  className="bg-green-100 text-green-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
                >
                  <Video className="text-green-500 mr-3 h-5 w-5" />
                  Classes
                </button>
                <button 
                  onClick={() => router.visit('/teacher/quizzes')} 
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
                >
                  <FileText className="text-gray-500 mr-3 h-5 w-5" />
                  Quizzes
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => router.visit('/teacher/classes')}
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Classes
                    </button>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold text-gray-900">Schedule New Class</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a new online class session for your students
                  </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          {flash.success}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {flash?.error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {flash.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Batches Warning */}
                {batches.length === 0 && (
                  <div className="mb-6 rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          No Batches Available
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            You need to create at least one batch before you can schedule classes.
                          </p>
                          <div className="mt-3">
                            <button
                              onClick={() => router.visit('/teacher/batches/create')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Create Your First Batch
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                {batches.length > 0 && (
                  <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
                    <div className="space-y-6 p-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-green-600" />
                          Class Information
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                          {/* Class Title */}
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Class Title *
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={data.title}
                              onChange={(e) => setData('title', e.target.value)}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                                allErrors.title ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Quadratic Equations - Advanced Problems"
                              required
                            />
                            {allErrors.title && (
                              <p className="mt-1 text-sm text-red-600">{allErrors.title}</p>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              rows={3}
                              value={data.description}
                              onChange={(e) => setData('description', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              placeholder="Brief description of what will be covered in this class..."
                            />
                          </div>

                          {/* Batch Selection */}
                          <div>
                            <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
                              Select Batch *
                            </label>
                            <select
                              id="batch_id"
                              value={data.batch_id}
                              onChange={(e) => setData('batch_id', e.target.value)}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                                allErrors.batch_id ? 'border-red-300' : 'border-gray-300'
                              }`}
                              required
                            >
                              <option value="">Choose a batch...</option>
                              {batches.map(batch => (
                                <option key={batch.id} value={batch.id.toString()}>
                                  {batch.name} ({batch.student_count} students)
                                </option>
                              ))}
                            </select>
                            {allErrors.batch_id && (
                              <p className="mt-1 text-sm text-red-600">{allErrors.batch_id}</p>
                            )}
                            
                            {selectedBatch && (
                              <div className="mt-2 p-3 bg-green-50 rounded-md">
                                <p className="text-sm text-green-700">
                                  <Users className="inline h-4 w-4 mr-1" />
                                  {selectedBatch.student_count} students will be invited to this class
                                </p>
                                {selectedBatch.description && (
                                  <p className="text-xs text-green-600 mt-1">
                                    {selectedBatch.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Schedule Information */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-green-600" />
                          Schedule
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Date and Time */}
                          <div>
                            <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700">
                              Date & Time *
                            </label>
                            <input
                              type="datetime-local"
                              id="scheduled_at"
                              value={data.scheduled_at}
                              onChange={(e) => setData('scheduled_at', e.target.value)}
                              min={getTomorrowDate()}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                                allErrors.scheduled_at ? 'border-red-300' : 'border-gray-300'
                              }`}
                              required
                            />
                            {allErrors.scheduled_at && (
                              <p className="mt-1 text-sm text-red-600">{allErrors.scheduled_at}</p>
                            )}
                          </div>

                          {/* Duration */}
                          <div>
                            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                              Duration (minutes) *
                            </label>
                            <select
                              id="duration_minutes"
                              value={data.duration_minutes}
                              onChange={(e) => setData('duration_minutes', parseInt(e.target.value))}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                                allErrors.duration_minutes ? 'border-red-300' : 'border-gray-300'
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
                              <p className="mt-1 text-sm text-red-600">{allErrors.duration_minutes}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meeting Information */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Video className="h-5 w-5 mr-2 text-green-600" />
                          Meeting Details
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                          {/* Zoom Link */}
                          <div>
                            <label htmlFor="zoom_link" className="block text-sm font-medium text-gray-700">
                              Zoom Meeting Link (Optional)
                            </label>
                            <input
                              type="url"
                              id="zoom_link"
                              value={data.zoom_link}
                              onChange={(e) => setData('zoom_link', e.target.value)}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                                allErrors.zoom_link ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="https://zoom.us/j/123456789"
                            />
                            {allErrors.zoom_link && (
                              <p className="mt-1 text-sm text-red-600">{allErrors.zoom_link}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                              Students will access the class through this link
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Settings */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-green-600" />
                          Additional Settings
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Notes */}
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Class Notes
                            </label>
                            <textarea
                              id="notes"
                              rows={3}
                              value={data.notes}
                              onChange={(e) => setData('notes', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              placeholder="Any additional notes or instructions for this class..."
                            />
                          </div>

                          {/* Create Attendance */}
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={data.create_attendance}
                                onChange={(e) => setData('create_attendance', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Create attendance records for all students
                              </span>
                            </label>
                            <p className="mt-1 ml-6 text-sm text-gray-500">
                              This will create attendance records that you can mark during or after the class
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => router.visit('/teacher/classes')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={processing}
                            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                              processing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {processing ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Scheduling...
                              </>
                            ) : (
                              'Schedule Class'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}