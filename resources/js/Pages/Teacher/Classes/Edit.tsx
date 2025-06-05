import React, { useState } from 'react';
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
  Lock,
  Globe,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  student_count: number;
}

interface ClassData {
  id: number;
  title: string;
  description: string;
  batch_id: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_password: string;
  max_attendees: number | '';
  notes: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
  zoom_meeting_id: string | null;
  zoom_join_url: string | null;
  zoom_start_url: string | null;
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
}

interface FormData {
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

export default function EditClass() {
  // Mock existing class data
  const existingClass: ClassData = {
    id: 1,
    title: "Quadratic Equations - Advanced Problems",
    description: "In this session, we'll dive deep into solving complex quadratic equations and explore real-world applications.",
    batch_id: "1",
    scheduled_at: "2024-06-05T10:00",
    duration_minutes: 90,
    zoom_password: "123456",
    max_attendees: 50,
    notes: "Please bring calculators and notebooks. We'll be working through practice problems from chapter 5.",
    status: "scheduled",
    zoom_meeting_id: "123456789",
    zoom_join_url: "https://zoom.us/j/123456789?pwd=abc123",
    zoom_start_url: "https://zoom.us/s/123456789?zak=xyz789",
    batch: {
      id: 1,
      name: "Mathematics Grade 10 - Morning",
      student_count: 28
    }
  };

  const [formData, setFormData] = useState<FormData>({
    title: existingClass.title,
    description: existingClass.description,
    batch_id: existingClass.batch_id,
    scheduled_at: existingClass.scheduled_at,
    duration_minutes: existingClass.duration_minutes,
    zoom_password: existingClass.zoom_password,
    max_attendees: existingClass.max_attendees,
    notes: existingClass.notes,
    status: existingClass.status
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data
  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
    { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
    { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 }
  ];

  const selectedBatch = mockBatches.find(batch => batch.id.toString() === formData.batch_id);

  const handleSubmit = () => {
    setProcessing(true);
    
    // Simulate validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required.';
    }
    
    if (!formData.batch_id) {
      newErrors.batch_id = 'Please select a batch for this class.';
    }
    
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Class date and time is required.';
    }
    
    if (formData.duration_minutes < 15) {
      newErrors.duration_minutes = 'Class duration must be at least 15 minutes.';
    }
    
    setErrors(newErrors);
    
    setTimeout(() => {
      setProcessing(false);
      if (Object.keys(newErrors).length === 0) {
        alert('Class updated successfully!');
      }
    }, 1000);
  };

  const handleDelete = () => {
    alert('Class deleted successfully!');
    setShowDeleteModal(false);
  };

  const generateRandomPassword = () => {
    const chars = '0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, zoom_password: password }));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { color: 'text-blue-600 bg-blue-100', text: 'Scheduled' };
      case 'live':
        return { color: 'text-red-600 bg-red-100', text: 'Live' };
      case 'completed':
        return { color: 'text-green-600 bg-green-100', text: 'Completed' };
      case 'cancelled':
        return { color: 'text-gray-600 bg-gray-100', text: 'Cancelled' };
      case 'rescheduled':
        return { color: 'text-yellow-600 bg-yellow-100', text: 'Rescheduled' };
      default:
        return { color: 'text-gray-600 bg-gray-100', text: status };
    }
  };

  const canEditSchedule = ['scheduled', 'rescheduled'].includes(formData.status);
  const canChangeStatus = existingClass.status !== 'completed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">MicroLMS</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">JD</span>
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
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
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Batches
                </a>
                <a href="#" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Video className="text-purple-500 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Quizzes
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Users className="text-gray-400 mr-3 h-5 w-5" />
                  Students
                </a>
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
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Classes
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Edit Class</h1>
                      <p className="mt-1 text-sm text-gray-500">
                        Modify class details and settings
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(formData.status).color}`}>
                        {getStatusInfo(formData.status).text}
                      </span>
                      <span className="text-sm text-gray-500">ID: #{existingClass.id}</span>
                    </div>
                  </div>
                </div>

                {/* Warning for Live/Completed Classes */}
                {(['live', 'completed'].includes(formData.status)) && (
                  <div className="mb-6 rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Limited Editing Available
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            {formData.status === 'live' 
                              ? 'This class is currently live. Only basic details can be modified.'
                              : 'This class has been completed. Only notes and status can be modified.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                  <div className="space-y-6 p-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-600" />
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
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            disabled={formData.status === 'completed'}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.title ? 'border-red-300' : 'border-gray-300'
                            } ${formData.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''}`}
                            placeholder="e.g., Quadratic Equations - Advanced Problems"
                            required
                          />
                          {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            disabled={formData.status === 'completed'}
                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              formData.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''
                            }`}
                            placeholder="Brief description of what will be covered in this class..."
                          />
                        </div>

                        {/* Batch Selection */}
                        <div>
                          <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
                            Batch *
                          </label>
                          <select
                            id="batch_id"
                            value={formData.batch_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, batch_id: e.target.value }))}
                            disabled={!canEditSchedule}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.batch_id ? 'border-red-300' : 'border-gray-300'
                            } ${!canEditSchedule ? 'bg-gray-50 text-gray-500' : ''}`}
                            required
                          >
                            <option value="">Choose a batch...</option>
                            {mockBatches.map(batch => (
                              <option key={batch.id} value={batch.id.toString()}>
                                {batch.name} ({batch.student_count} students)
                              </option>
                            ))}
                          </select>
                          {errors.batch_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.batch_id}</p>
                          )}
                          
                          {selectedBatch && (
                            <div className="mt-2 p-3 bg-purple-50 rounded-md">
                              <p className="text-sm text-purple-700">
                                <Users className="inline h-4 w-4 mr-1" />
                                {selectedBatch.student_count} students in this batch
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Status Selection */}
                        {canChangeStatus && (
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Class Status
                            </label>
                            <select
                              id="status"
                              value={formData.status}
                              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
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
                              value={formData.scheduled_at}
                              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                errors.scheduled_at ? 'border-red-300' : 'border-gray-300'
                              }`}
                              required
                            />
                            {errors.scheduled_at && (
                              <p className="mt-1 text-sm text-red-600">{errors.scheduled_at}</p>
                            )}
                          </div>

                          {/* Duration */}
                          <div>
                            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                              Duration (minutes) *
                            </label>
                            <select
                              id="duration_minutes"
                              value={formData.duration_minutes}
                              onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                errors.duration_minutes ? 'border-red-300' : 'border-gray-300'
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
                            {errors.duration_minutes && (
                              <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Zoom Settings */}
                    {existingClass.zoom_meeting_id && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Video className="h-5 w-5 mr-2 text-purple-600" />
                          Zoom Settings
                        </h3>
                        
                        <div className="bg-blue-50 p-4 rounded-md mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Video className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Zoom Meeting Configured
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>Meeting ID: <span className="font-mono">{existingClass.zoom_meeting_id}</span></p>
                                {existingClass.zoom_join_url && (
                                  <p className="mt-1">
                                    <a 
                                      href={existingClass.zoom_join_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="underline hover:no-underline"
                                    >
                                      Join URL
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Zoom Password */}
                          <div>
                            <label htmlFor="zoom_password" className="block text-sm font-medium text-gray-700">
                              Meeting Password
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                id="zoom_password"
                                value={formData.zoom_password}
                                onChange={(e) => setFormData(prev => ({ ...prev, zoom_password: e.target.value }))}
                                disabled={formData.status === 'completed'}
                                className={`flex-1 block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  formData.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                                placeholder="6-digit password"
                                maxLength={10}
                              />
                              <button
                                type="button"
                                onClick={generateRandomPassword}
                                disabled={formData.status === 'completed'}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Generate
                              </button>
                            </div>
                          </div>

                          {/* Max Attendees */}
                          <div>
                            <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700">
                              Maximum Attendees
                            </label>
                            <input
                              type="number"
                              id="max_attendees"
                              value={formData.max_attendees}
                              onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value ? parseInt(e.target.value) : '' }))}
                              disabled={formData.status === 'completed'}
                              min="1"
                              max="1000"
                              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                formData.status === 'completed' ? 'bg-gray-50 text-gray-500' : ''
                              }`}
                              placeholder="e.g., 100"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Settings */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-purple-600" />
                        Additional Settings
                      </h3>
                      
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Class Notes
                        </label>
                        <textarea
                          id="notes"
                          rows={4}
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Any additional notes or instructions for this class..."
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Class
                        </button>
                        
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                              processing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {processing ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Class</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this class? This action cannot be undone and will also cancel the Zoom meeting.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}