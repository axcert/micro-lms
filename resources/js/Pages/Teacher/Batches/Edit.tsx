import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  ArrowLeftIcon, 
  UsersIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  TrashIcon, 
  SaveIcon, 
  XIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  PencilIcon, 
  Bars3Icon 
} from '@/Components/UI/Icons';
import TeacherSidebar from '@/Components/Layout/TeacherSidebar';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Batch {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  max_students: number | null;
  is_active: boolean;
  students: Student[];
  teacher: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Auth {
  user: User;
}

interface EditBatchProps {
  batch: Batch;
  availableStudents: Student[];
  currentStudentIds: number[];
  auth?: Auth;
  user?: User;
  errors?: Record<string, string>;
  flash?: {
    type: string;
    message: string;
  };
}

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  max_students: number | '';
  is_active: boolean;
  student_ids: number[];
}

export default function EditBatch({ 
  batch, 
  availableStudents = [], 
  currentStudentIds = [],
  auth,
  user,
  errors: serverErrors = {}, 
  flash 
}: EditBatchProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>(currentStudentIds);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ✅ FIXED: Extract user from auth or use direct user prop with fallback
  const currentUser = auth?.user || user || { 
    id: 0, 
    name: 'Unknown User', 
    email: 'unknown@example.com', 
    role: 'teacher' 
  };
  
  // ✅ FIXED: Use Inertia's useForm hook for proper form handling
  const { data, setData, put, processing, errors, reset } = useForm<FormData>({
    name: batch.name,
    description: batch.description || '',
    start_date: batch.start_date,
    end_date: batch.end_date || '',
    max_students: batch.max_students || '',
    is_active: batch.is_active,
    student_ids: currentStudentIds
  });

  // Update student_ids when selectedStudents changes
  useEffect(() => {
    setData('student_ids', selectedStudents);
  }, [selectedStudents]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // ✅ FIXED: Real form submission using Inertia
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    put(`/teacher/batches/${batch.id}`, {
      onSuccess: () => {
        // Redirect to batch show page on success
        router.visit(`/teacher/batches/${batch.id}`);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.visit(`/teacher/batches/${batch.id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      router.delete(`/teacher/batches/${batch.id}`, {
        onSuccess: () => {
          router.visit('/teacher/batches');
        }
      });
    }
  };

  const toggleStudent = (studentId: number) => {
    const newSelected = selectedStudents.includes(studentId)
      ? selectedStudents.filter(id => id !== studentId)
      : [...selectedStudents, studentId];
    
    setSelectedStudents(newSelected);
  };

  // Combine current students with available students
  const allStudents = [
    ...batch.students,
    ...availableStudents.filter(student => 
      !batch.students.some(existing => existing.id === student.id)
    )
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
      <Head title={`Edit Batch - ${batch.name}`} />
      
      {/* Sidebar */}
      <TeacherSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
        currentPage="batches"
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => router.visit('/teacher/batches')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <PencilIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-black">Edit Batch</h1>
                    <p className="text-gray-500 text-sm">{batch.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-100 rounded-lg px-4 py-2">
                <div className={`w-3 h-3 rounded-full ${data.is_active ? 'bg-green-600' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-medium text-gray-800">
                  {data.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Flash Messages */}
        {flash && (
          <div className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className={`border-l-4 rounded-lg p-4 ${
              flash.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-600' 
                : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center">
                {flash.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 mr-3" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 mr-3" />
                )}
                <p className="font-medium">{flash.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* ✅ FIXED: Proper form with onSubmit handler */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Batch Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                        Batch Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`w-full px-4 py-3 text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                          errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                        }`}
                        placeholder="Enter batch name"
                        required
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={`w-full px-4 py-3 text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none ${
                          errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                        }`}
                        placeholder="Describe this batch..."
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-800">Batch Status</h4>
                        <p className="text-sm text-gray-500">Control batch visibility</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.is_active}
                          onChange={(e) => setData('is_active', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Start Date */}
                      <div>
                        <label htmlFor="start_date" className="block text-sm font-semibold text-gray-800 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="start_date"
                          value={data.start_date}
                          onChange={(e) => setData('start_date', e.target.value)}
                          className={`w-full px-4 py-3 text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                            errors.start_date ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                          }`}
                          required
                        />
                        {errors.start_date && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            {errors.start_date}
                          </p>
                        )}
                      </div>

                      {/* End Date */}
                      <div>
                        <label htmlFor="end_date" className="block text-sm font-semibold text-gray-800 mb-2">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          id="end_date"
                          value={data.end_date}
                          onChange={(e) => setData('end_date', e.target.value)}
                          min={data.start_date}
                          className={`w-full px-4 py-3 text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                            errors.end_date ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                          }`}
                        />
                        {errors.end_date && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            {errors.end_date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Max Students */}
                    <div>
                      <label htmlFor="max_students" className="block text-sm font-semibold text-gray-800 mb-2">
                        Maximum Students
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          id="max_students"
                          value={data.max_students}
                          onChange={(e) => setData('max_students', e.target.value ? parseInt(e.target.value) : '')}
                          min="1"
                          max="100"
                          className={`w-32 px-4 py-3 text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                            errors.max_students ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                          }`}
                          placeholder="30"
                        />
                        <div className="flex-1 px-4 py-3 bg-green-100 text-green-600 rounded-xl text-sm font-medium">
                          {selectedStudents.length} students currently selected
                        </div>
                      </div>
                      {errors.max_students && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.max_students}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Student Management */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden h-fit">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UsersIcon className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                        {selectedStudents.length} selected
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {allStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No students available</p>
                        </div>
                      ) : (
                        allStudents.map((student) => {
                          const isCurrentlyEnrolled = batch.students.some(s => s.id === student.id);
                          const isSelected = selectedStudents.includes(student.id);
                          
                          return (
                            <div
                              key={student.id}
                              className={`p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:border-green-500 ${
                                isSelected ? 'border-green-500 bg-green-100' : 'border-gray-200'
                              }`}
                              onClick={() => toggleStudent(student.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleStudent(student.id)}
                                  className="mt-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {student.email}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {isCurrentlyEnrolled && (
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                                        Enrolled
                                      </span>
                                    )}
                                    {isCurrentlyEnrolled && !isSelected && (
                                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md">
                                        Removing
                                      </span>
                                    )}
                                    {!isCurrentlyEnrolled && isSelected && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md">
                                        Adding
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    {data.max_students && selectedStudents.length > data.max_students && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                          <p className="text-sm text-red-700 font-medium">
                            Exceeds limit by {selectedStudents.length - data.max_students}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {errors.student_ids && (
                      <p className="mt-4 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.student_ids}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-300 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="sm:order-1 inline-flex items-center justify-center px-6 py-3 border border-red-400 text-red-600 font-medium rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Batch
                </button>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className={`inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                      processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}