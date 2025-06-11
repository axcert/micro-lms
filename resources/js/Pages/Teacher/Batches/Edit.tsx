import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Users, Calendar, FileText, Trash2, Save, X } from 'lucide-react';

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

interface EditBatchProps {
  batch: Batch;
  availableStudents: Student[];
  currentStudentIds: number[];
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
  errors: serverErrors = {}, 
  flash 
}: EditBatchProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>(currentStudentIds);
  
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
    <div className="min-h-screen bg-gray-50">
      <Head title={`Edit Batch - ${batch.name}`} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.visit('/teacher/batches')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Batches
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Batch</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Messages */}
      {flash && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className={`rounded-md p-4 ${
            flash.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex">
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  flash.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {flash.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Batch</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update batch information and manage student assignments
            </p>
          </div>

          {/* ✅ FIXED: Proper form with onSubmit handler */}
          <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
            <div className="space-y-6 p-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Batch Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Batch Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Mathematics Grade 10 - Morning"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Brief description of this batch..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Batch is active
                      </span>
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      Inactive batches won't appear in class/quiz assignments
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Schedule Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      value={data.start_date}
                      onChange={(e) => setData('start_date', e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        errors.start_date ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      value={data.end_date}
                      onChange={(e) => setData('end_date', e.target.value)}
                      min={data.start_date}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        errors.end_date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                    )}
                  </div>

                  {/* Max Students */}
                  <div className="md:col-span-2">
                    <label htmlFor="max_students" className="block text-sm font-medium text-gray-700">
                      Maximum Students (Optional)
                    </label>
                    <input
                      type="number"
                      id="max_students"
                      value={data.max_students}
                      onChange={(e) => setData('max_students', e.target.value ? parseInt(e.target.value) : '')}
                      min="1"
                      max="100"
                      className={`mt-1 block w-full md:w-48 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        errors.max_students ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 30"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Currently {selectedStudents.length} students assigned
                    </p>
                    {errors.max_students && (
                      <p className="mt-1 text-sm text-red-600">{errors.max_students}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Management */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Manage Students
                </h3>
                
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Select students to assign to this batch. Currently enrolled students will remain selected.
                  </p>
                  
                  <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    {allStudents.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No students available
                      </div>
                    ) : (
                      allStudents.map((student) => {
                        const isCurrentlyEnrolled = batch.students.some(s => s.id === student.id);
                        const isSelected = selectedStudents.includes(student.id);
                        
                        return (
                          <div
                            key={student.id}
                            className={`flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                              isSelected ? 'bg-purple-50' : ''
                            }`}
                            onClick={() => toggleStudent(student.id)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleStudent(student.id)}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                  {student.name}
                                  {isCurrentlyEnrolled && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      Currently Enrolled
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                            
                            {isCurrentlyEnrolled && !isSelected && (
                              <span className="text-xs text-red-600 font-medium">
                                Will be removed
                              </span>
                            )}
                            {!isCurrentlyEnrolled && isSelected && (
                              <span className="text-xs text-green-600 font-medium">
                                Will be added
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                    </span>
                    {data.max_students && selectedStudents.length > data.max_students && (
                      <span className="text-red-600 font-medium">
                        Exceeds maximum limit ({data.max_students})
                      </span>
                    )}
                  </div>
                </div>
                
                {errors.student_ids && (
                  <p className="mt-1 text-sm text-red-600">{errors.student_ids}</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Batch
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                        processing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}