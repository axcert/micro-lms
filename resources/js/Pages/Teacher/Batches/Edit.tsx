import React, { useState, useEffect } from 'react';
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
}

// Sample data for demonstration
const sampleBatch: Batch = {
  id: 1,
  name: "Mathematics Grade 10 - Morning",
  description: "Advanced mathematics course for Grade 10 students focusing on algebra and geometry",
  start_date: "2025-02-01",
  end_date: "2025-06-30",
  max_students: 30,
  is_active: true,
  students: [
    { id: 1, name: "John Smith", email: "john.smith@example.com" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@example.com" },
    { id: 3, name: "Michael Brown", email: "michael.brown@example.com" },
  ]
};

const sampleAvailableStudents: Student[] = [
  { id: 4, name: "Emma Wilson", email: "emma.wilson@example.com" },
  { id: 5, name: "David Lee", email: "david.lee@example.com" },
  { id: 6, name: "Lisa Chen", email: "lisa.chen@example.com" },
  { id: 7, name: "Alex Rodriguez", email: "alex.rodriguez@example.com" },
];

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  max_students: number | '';
  is_active: boolean;
  student_ids: number[];
}

export default function EditBatch() {
  const [batch] = useState<Batch>(sampleBatch);
  const [availableStudents] = useState<Student[]>(sampleAvailableStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>(
    batch.students.map(s => s.id)
  );
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [data, setData] = useState<FormData>({
    name: batch.name,
    description: batch.description || '',
    start_date: batch.start_date,
    end_date: batch.end_date || '',
    max_students: batch.max_students || '',
    is_active: batch.is_active,
    student_ids: batch.students.map(s => s.id)
  });

  useEffect(() => {
    setData(prev => ({ ...prev, student_ids: selectedStudents }));
  }, [selectedStudents]);

  const handleSubmit = async () => {
    setProcessing(true);
    setErrors({});

    // Simulate form validation
    const newErrors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Batch name is required';
    }
    
    if (!data.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (data.end_date && data.end_date <= data.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (data.max_students && selectedStudents.length > data.max_students) {
      newErrors.student_ids = `Cannot assign ${selectedStudents.length} students when maximum is ${data.max_students}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setProcessing(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      console.log('Batch updated:', data);
    }, 1500);
  };

  const toggleStudent = (studentId: number) => {
    const newSelected = selectedStudents.includes(studentId)
      ? selectedStudents.filter(id => id !== studentId)
      : [...selectedStudents, studentId];
    
    setSelectedStudents(newSelected);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      alert('Batch would be deleted (demo mode)');
    }
  };

  const allStudents = [
    ...batch.students,
    ...availableStudents.filter(student => 
      !batch.students.some(existing => existing.id === student.id)
    )
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Batches
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Batch</h1>
            </div>
            <div className="text-sm text-gray-500">
              Micro LMS - Teacher Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Save className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Batch updated successfully!
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

          {/* Form */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
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
                      onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
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
                      onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
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
                        onChange={(e) => setData(prev => ({ ...prev, is_active: e.target.checked }))}
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
                      onChange={(e) => setData(prev => ({ ...prev, start_date: e.target.value }))}
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
                      onChange={(e) => setData(prev => ({ ...prev, end_date: e.target.value }))}
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
                      onChange={(e) => setData(prev => ({ ...prev, max_students: e.target.value ? parseInt(e.target.value) : '' }))}
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
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <X className="h-4 w-4 mr-2" />
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
                      <Save className="h-4 w-4 mr-2" />
                      {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}