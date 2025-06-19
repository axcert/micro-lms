import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Users, Calendar, FileText, Save, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface CreateBatchProps {
  availableStudents?: Student[];
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

function CreateBatch({ availableStudents = [], errors: serverErrors = {}, flash }: CreateBatchProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // ✅ FIXED: Use Inertia's useForm hook for proper form handling
  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    max_students: '',
    is_active: true,
    student_ids: []
  });

  // Update student_ids when selectedStudents changes
  useEffect(() => {
    setData('student_ids', selectedStudents);
  }, [selectedStudents]);

  // ✅ FIXED: Real form submission using Inertia
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/teacher/batches', {
      onSuccess: () => {
        // Redirect to batches index on success
        router.visit('/teacher/batches');
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.visit('/teacher/batches');
    }
  };

  const toggleStudent = (studentId: number) => {
    const newSelected = selectedStudents.includes(studentId)
      ? selectedStudents.filter(id => id !== studentId)
      : [...selectedStudents, studentId];
    
    setSelectedStudents(newSelected);
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(availableStudents.map(student => student.id));
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Step validation
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return data.name.trim() !== '';
      case 2:
        return data.start_date !== '';
      case 3:
        return true; // Student selection is optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(step - 1)) {
      setCurrentStep(step);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText, description: 'Name and description' },
    { number: 2, title: 'Schedule', icon: Calendar, description: 'Dates and capacity' },
    { number: 3, title: 'Students', icon: Users, description: 'Assign students' },
    { number: 4, title: 'Review', icon: Check, description: 'Confirm details' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with the essential details for your batch</p>
            </div>

            <div className="space-y-6">
              {/* Batch Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                  Batch Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="e.g., Mathematics Grade 10 - Morning"
                  required
                />
                {errors.name && (
                  <p className="mt-3 text-sm text-red-600 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="Brief description of this batch and its objectives..."
                />
                {errors.description && (
                  <p className="mt-3 text-sm text-red-600 font-medium">{errors.description}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="h-5 w-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-4 text-gray-800 font-semibold text-lg">
                    Batch is active
                  </span>
                </label>
                <p className="mt-3 ml-9 text-gray-600">
                  Active batches can be used for class and quiz assignments
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule & Capacity</h2>
              <p className="text-gray-600">Set the duration and student limits for this batch</p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Start Date */}
                <div>
                  <label htmlFor="start_date" className="block text-sm font-semibold text-gray-800 mb-3">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    min={today}
                    className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    required
                  />
                  {errors.start_date && (
                    <p className="mt-3 text-sm text-red-600 font-medium">{errors.start_date}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="end_date" className="block text-sm font-semibold text-gray-800 mb-3">
                    End Date <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                    min={data.start_date || today}
                    className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.end_date ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  />
                  {errors.end_date && (
                    <p className="mt-3 text-sm text-red-600 font-medium">{errors.end_date}</p>
                  )}
                </div>
              </div>

              {/* Max Students */}
              <div>
                <label htmlFor="max_students" className="block text-sm font-semibold text-gray-800 mb-3">
                  Maximum Students <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="w-full lg:w-80">
                  <input
                    type="number"
                    id="max_students"
                    value={data.max_students}
                    onChange={(e) => setData('max_students', e.target.value ? parseInt(e.target.value) : '')}
                    min="1"
                    max="100"
                    className={`w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.max_students ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="e.g., 30"
                  />
                </div>
                <p className="mt-3 text-gray-600">
                  Leave empty for unlimited students
                </p>
                {errors.max_students && (
                  <p className="mt-3 text-sm text-red-600 font-medium">{errors.max_students}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assign Students</h2>
              <p className="text-gray-600">Select students to add to this batch (you can add more later)</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={toggleAllStudents}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    {selectedStudents.length === availableStudents.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">
                    {selectedStudents.length} selected
                  </span>
                </div>
                {data.max_students && selectedStudents.length > data.max_students && (
                  <span className="text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                    Exceeds limit ({data.max_students})
                  </span>
                )}
              </div>
              
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                {availableStudents.length === 0 ? (
                  <div className="p-16 text-center">
                    <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No students available</h3>
                    <p className="text-gray-500">There are no students to assign to this batch</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {availableStudents.map((student, index) => {
                      const isSelected = selectedStudents.includes(student.id);
                      
                      return (
                        <div
                          key={student.id}
                          className={`flex items-center justify-between p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                            index !== availableStudents.length - 1 ? 'border-b border-gray-100' : ''
                          } ${isSelected ? 'bg-green-50 border-green-200' : ''}`}
                          onClick={() => toggleStudent(student.id)}
                        >
                          <div className="flex items-center space-x-6">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleStudent(student.id)}
                              className="h-6 w-6 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">
                                {student.name}
                              </p>
                              <p className="text-gray-600">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {errors.student_ids && (
                <p className="text-sm text-red-600 font-medium">{errors.student_ids}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h2>
              <p className="text-gray-600">Please review all the details before creating your batch</p>
            </div>

            <div className="space-y-6">
              {/* Basic Information Summary */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch Name:</span>
                    <span className="font-semibold text-gray-800">{data.name || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-semibold text-gray-800 text-right max-w-md">
                      {data.description || 'No description'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      data.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {data.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule Summary */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Schedule & Capacity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-semibold text-gray-800">
                      {data.start_date || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-semibold text-gray-800">
                      {data.end_date || 'No end date'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Students:</span>
                    <span className="font-semibold text-gray-800">
                      {data.max_students || 'Unlimited'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Students Summary */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Selected Students
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Selected:</span>
                    <span className="font-semibold text-gray-800">{selectedStudents.length} students</span>
                  </div>
                  {selectedStudents.length > 0 && (
                    <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-xl p-4">
                      {selectedStudents.map(studentId => {
                        const student = availableStudents.find(s => s.id === studentId);
                        return student ? (
                          <div key={student.id} className="flex items-center space-x-3 py-2">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-gray-800 font-medium">{student.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Create New Batch" />
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Create New Batch</h1>
              <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
          
          <button 
            onClick={() => router.visit('/teacher/batches')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Batches
          </button>
        </div>
      </nav>

      {/* Flash Messages */}
      {flash && (
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className={`rounded-2xl p-4 border ${
            flash.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{flash.message}</p>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const isClickable = step.number <= currentStep || validateStep(step.number - 1);
                
                return (
                  <div key={step.number} className="flex items-center">
                    <button
                      onClick={() => isClickable && goToStep(step.number)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-200 ${
                        isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                      }`}
                      disabled={!isClickable}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isActive 
                            ? 'bg-green-100 border-green-500 text-green-600' 
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-8 h-8" />
                        ) : (
                          <Icon className="w-8 h-8" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${
                          isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 rounded-full transition-colors duration-200 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 lg:p-12 mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                      validateStep(currentStep)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processing}
                    className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center ${
                      processing ? 'opacity-50 cursor-not-allowed transform-none' : ''
                    }`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {processing ? 'Creating Batch...' : 'Create Batch'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBatch;