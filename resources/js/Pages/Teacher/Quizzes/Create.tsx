import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileQuestion, 
  Calendar, 
  Clock, 
  Users,
  Settings,
  BookOpen,
  Bell,
  LogOut,
  Shield,
  Eye,
  Shuffle
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  student_count: number;
}

interface FormData {
  title: string;
  description: string;
  instructions: string;
  batch_id: string;
  total_marks: number | '';
  pass_marks: number | '';
  duration_minutes: number | '';
  start_time: string;
  end_time: string;
  max_attempts: number | '';
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  auto_submit: boolean;
  require_webcam: boolean;
  prevent_copy_paste: boolean;
}

export default function CreateQuiz() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    instructions: '',
    batch_id: '',
    total_marks: '',
    pass_marks: '',
    duration_minutes: 60,
    start_time: '',
    end_time: '',
    max_attempts: 1,
    shuffle_questions: false,
    shuffle_options: false,
    show_results_immediately: true,
    allow_review: true,
    auto_submit: true,
    require_webcam: false,
    prevent_copy_paste: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  // Mock data
  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
    { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
    { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 },
    { id: 4, name: "Biology Grade 9 - Morning", student_count: 22 }
  ];

  const selectedBatch = mockBatches.find(batch => batch.id.toString() === formData.batch_id);

  const handleSubmit = () => {
    setProcessing(true);
    
    // Simulate validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required.';
    }
    
    if (!formData.batch_id) {
      newErrors.batch_id = 'Please select a batch for this quiz.';
    }
    
    if (formData.pass_marks && formData.total_marks && formData.pass_marks > formData.total_marks) {
      newErrors.pass_marks = 'Pass marks cannot be greater than total marks.';
    }
    
    if (formData.start_time && formData.end_time && new Date(formData.start_time) >= new Date(formData.end_time)) {
      newErrors.end_time = 'End time must be after start time.';
    }
    
    setErrors(newErrors);
    
    setTimeout(() => {
      setProcessing(false);
      if (Object.keys(newErrors).length === 0) {
        alert('Quiz created successfully! Add questions to complete your quiz.');
      }
    }, 1000);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

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
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-gray-400 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="#" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-purple-500 mr-3 h-5 w-5" />
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
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Quizzes
                    </button>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold text-gray-900">Create New Quiz</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Create an assessment for your students with questions and scoring
                  </p>
                </div>

                {/* Form */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                  <div className="space-y-6 p-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileQuestion className="h-5 w-5 mr-2 text-purple-600" />
                        Quiz Information
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {/* Quiz Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Quiz Title *
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Quadratic Equations Assessment"
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
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Brief description of what this quiz covers..."
                          />
                        </div>

                        {/* Instructions */}
                        <div>
                          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                            Instructions for Students
                          </label>
                          <textarea
                            id="instructions"
                            rows={4}
                            value={formData.instructions}
                            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Instructions that students will see before starting the quiz..."
                          />
                        </div>

                        {/* Batch Selection */}
                        <div>
                          <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
                            Select Batch *
                          </label>
                          <select
                            id="batch_id"
                            value={formData.batch_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, batch_id: e.target.value }))}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.batch_id ? 'border-red-300' : 'border-gray-300'
                            }`}
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
                                {selectedBatch.student_count} students will have access to this quiz
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scoring Settings */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileQuestion className="h-5 w-5 mr-2 text-purple-600" />
                        Scoring
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Marks */}
                        <div>
                          <label htmlFor="total_marks" className="block text-sm font-medium text-gray-700">
                            Total Marks
                          </label>
                          <input
                            type="number"
                            id="total_marks"
                            value={formData.total_marks}
                            onChange={(e) => setFormData(prev => ({ ...prev, total_marks: e.target.value ? parseFloat(e.target.value) : '' }))}
                            min="0"
                            step="0.5"
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.total_marks ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 100"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Will be calculated automatically based on questions
                          </p>
                        </div>

                        {/* Pass Marks */}
                        <div>
                          <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-700">
                            Pass Marks
                          </label>
                          <input
                            type="number"
                            id="pass_marks"
                            value={formData.pass_marks}
                            onChange={(e) => setFormData(prev => ({ ...prev, pass_marks: e.target.value ? parseFloat(e.target.value) : '' }))}
                            min="0"
                            step="0.5"
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.pass_marks ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 60"
                          />
                          {errors.pass_marks && (
                            <p className="mt-1 text-sm text-red-600">{errors.pass_marks}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timing Settings */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-purple-600" />
                        Timing & Schedule
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Duration */}
                        <div>
                          <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                            Duration (minutes)
                          </label>
                          <select
                            id="duration_minutes"
                            value={formData.duration_minutes}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value ? parseInt(e.target.value) : '' }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            <option value="">No time limit</option>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                            <option value={180}>3 hours</option>
                          </select>
                        </div>

                        {/* Max Attempts */}
                        <div>
                          <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700">
                            Maximum Attempts
                          </label>
                          <select
                            id="max_attempts"
                            value={formData.max_attempts}
                            onChange={(e) => setFormData(prev => ({ ...prev, max_attempts: e.target.value ? parseInt(e.target.value) : '' }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            <option value="">Unlimited</option>
                            <option value={1}>1 attempt</option>
                            <option value={2}>2 attempts</option>
                            <option value={3}>3 attempts</option>
                            <option value={5}>5 attempts</option>
                          </select>
                        </div>

                        {/* Start Time */}
                        <div>
                          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                            Start Time (Optional)
                          </label>
                          <input
                            type="datetime-local"
                            id="start_time"
                            value={formData.start_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                            min={getTomorrowDate()}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>

                        {/* End Time */}
                        <div>
                          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                            End Time (Optional)
                          </label>
                          <input
                            type="datetime-local"
                            id="end_time"
                            value={formData.end_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                            min={formData.start_time || getTomorrowDate()}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              errors.end_time ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.end_time && (
                            <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quiz Settings */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-purple-600" />
                        Quiz Settings
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Randomization */}
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <Shuffle className="h-4 w-4 mr-1" />
                            Randomization
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.shuffle_questions}
                                onChange={(e) => setFormData(prev => ({ ...prev, shuffle_questions: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Shuffle question order for each student
                              </span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.shuffle_options}
                                onChange={(e) => setFormData(prev => ({ ...prev, shuffle_options: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Shuffle answer options for multiple choice questions
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Results & Review */}
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            Results & Review
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.show_results_immediately}
                                onChange={(e) => setFormData(prev => ({ ...prev, show_results_immediately: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Show results immediately after submission
                              </span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.allow_review}
                                onChange={(e) => setFormData(prev => ({ ...prev, allow_review: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Allow students to review their answers after submission
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Security */}
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            Security Settings
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.auto_submit}
                                onChange={(e) => setFormData(prev => ({ ...prev, auto_submit: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Auto-submit when time expires
                              </span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.prevent_copy_paste}
                                onChange={(e) => setFormData(prev => ({ ...prev, prevent_copy_paste: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Prevent copy and paste
                              </span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.require_webcam}
                                onChange={(e) => setFormData(prev => ({ ...prev, require_webcam: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Require webcam monitoring (experimental)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-end space-x-3">
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
                          {processing ? 'Creating...' : 'Create Quiz'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}