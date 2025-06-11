import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  FileQuestion, 
  Calendar, 
  Clock, 
  Users,
  Settings,
  Plus,
  Save,
  AlertTriangle,
  BookOpen,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  student_count: number;
  students: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

interface CreateQuizProps {
  batches: Batch[];
  errors?: Record<string, string>;
  old?: Record<string, any>;
}

interface QuizFormData {
  title: string;
  description: string;
  instructions: string;
  batch_id: string;
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

export default function CreateQuiz({ batches, errors = {}, old = {} }: CreateQuizProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    title: old.title || '',
    description: old.description || '',
    instructions: old.instructions || '',
    batch_id: old.batch_id || '',
    pass_marks: old.pass_marks || '',
    duration_minutes: old.duration_minutes || '',
    start_time: old.start_time || '',
    end_time: old.end_time || '',
    max_attempts: old.max_attempts || '',
    shuffle_questions: old.shuffle_questions ?? true,
    shuffle_options: old.shuffle_options ?? true,
    show_results_immediately: old.show_results_immediately ?? true,
    allow_review: old.allow_review ?? true,
    auto_submit: old.auto_submit ?? true,
    require_webcam: old.require_webcam ?? false,
    prevent_copy_paste: old.prevent_copy_paste ?? true
  });

  const [processing, setProcessing] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'settings'>('details');

  useEffect(() => {
    if (formData.batch_id) {
      const batch = batches.find(b => b.id.toString() === formData.batch_id);
      setSelectedBatch(batch || null);
    }
  }, [formData.batch_id, batches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const submitData = {
      ...formData,
      pass_marks: formData.pass_marks === '' ? 0 : Number(formData.pass_marks),
      duration_minutes: formData.duration_minutes === '' ? null : Number(formData.duration_minutes),
      max_attempts: formData.max_attempts === '' ? null : Number(formData.max_attempts),
      start_time: formData.start_time || null,
      end_time: formData.end_time || null
    };

    router.post('/teacher/quizzes', submitData, {
      onFinish: () => setProcessing(false),
      onError: () => setProcessing(false)
    });
  };

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goBack = () => {
    router.visit('/teacher/quizzes');
  };

  const getMinStartTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMinEndTime = () => {
    if (!formData.start_time) return '';
    const startTime = new Date(formData.start_time);
    startTime.setHours(startTime.getHours() + 1); // Minimum 1 hour after start
    return startTime.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Create Quiz" />
      
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

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <a href="/teacher/batches" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Batches
                </a>
                <a href="/teacher/classes" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-gray-400 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="/teacher/quizzes" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-purple-500 mr-3 h-5 w-5" />
                  Quizzes
                </a>
                <a href="/teacher/students" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Users className="text-gray-400 mr-3 h-5 w-5" />
                  Students
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Quizzes
                    </button>
                  </div>
                  <div className="mt-2">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Set up a new assessment for your students
                    </p>
                  </div>
                </div>

                {/* Error Messages */}
                {Object.keys(errors).length > 0 && (
                  <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Please correct the following errors:
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            {Object.entries(errors).map(([field, message]) => (
                              <li key={field}>{message}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'details'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Quiz Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'settings'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Settings
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'details' && (
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6 space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Quiz Title *
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={formData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Quadratic Equations Assessment"
                              required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                          </div>

                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              rows={3}
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              placeholder="Brief description of the quiz"
                            />
                          </div>

                          <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                              Instructions for Students
                            </label>
                            <textarea
                              id="instructions"
                              rows={4}
                              value={formData.instructions}
                              onChange={(e) => handleInputChange('instructions', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              placeholder="Detailed instructions for students taking the quiz"
                            />
                          </div>

                          <div>
                            <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
                              Batch *
                            </label>
                            <select
                              id="batch_id"
                              value={formData.batch_id}
                              onChange={(e) => handleInputChange('batch_id', e.target.value)}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                errors.batch_id ? 'border-red-300' : 'border-gray-300'
                              }`}
                              required
                            >
                              <option value="">Select a batch</option>
                              {batches.map(batch => (
                                <option key={batch.id} value={batch.id.toString()}>
                                  {batch.name} ({batch.student_count} students)
                                </option>
                              ))}
                            </select>
                            {errors.batch_id && <p className="mt-1 text-sm text-red-600">{errors.batch_id}</p>}
                            {selectedBatch && (
                              <p className="mt-1 text-sm text-gray-500">
                                This quiz will be available to {selectedBatch.student_count} students in {selectedBatch.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Scoring */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-700">
                              Pass Marks *
                            </label>
                            <input
                              type="number"
                              id="pass_marks"
                              value={formData.pass_marks}
                              onChange={(e) => handleInputChange('pass_marks', e.target.value === '' ? '' : parseInt(e.target.value))}
                              min="0"
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                errors.pass_marks ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Minimum marks to pass"
                              required
                            />
                            {errors.pass_marks && <p className="mt-1 text-sm text-red-600">{errors.pass_marks}</p>}
                            <p className="mt-1 text-sm text-gray-500">
                              Total marks will be calculated based on questions added
                            </p>
                          </div>

                          <div>
                            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                              Duration (minutes)
                            </label>
                            <input
                              type="number"
                              id="duration_minutes"
                              value={formData.duration_minutes}
                              onChange={(e) => handleInputChange('duration_minutes', e.target.value === '' ? '' : parseInt(e.target.value))}
                              min="1"
                              max="480"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              placeholder="Leave empty for no time limit"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Maximum 8 hours (480 minutes)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                              Start Time
                            </label>
                            <input
                              type="datetime-local"
                              id="start_time"
                              value={formData.start_time}
                              onChange={(e) => handleInputChange('start_time', e.target.value)}
                              min={getMinStartTime()}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Leave empty to start immediately
                            </p>
                          </div>

                          <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                              End Time
                            </label>
                            <input
                              type="datetime-local"
                              id="end_time"
                              value={formData.end_time}
                              onChange={(e) => handleInputChange('end_time', e.target.value)}
                              min={getMinEndTime()}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Leave empty for no end time
                            </p>
                          </div>

                          <div>
                            <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700">
                              Max Attempts
                            </label>
                            <input
                              type="number"
                              id="max_attempts"
                              value={formData.max_attempts}
                              onChange={(e) => handleInputChange('max_attempts', e.target.value === '' ? '' : parseInt(e.target.value))}
                              min="1"
                              max="10"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              placeholder="Unlimited"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Leave empty for unlimited attempts
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6 space-y-6">
                      {/* Randomization Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Randomization</h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.shuffle_questions}
                              onChange={(e) => handleInputChange('shuffle_questions', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Shuffle questions for each student</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.shuffle_options}
                              onChange={(e) => handleInputChange('shuffle_options', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Shuffle answer options for MCQ questions</span>
                          </label>
                        </div>
                      </div>

                      {/* Result Settings */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Results & Review</h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.show_results_immediately}
                              onChange={(e) => handleInputChange('show_results_immediately', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show results immediately after submission</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.allow_review}
                              onChange={(e) => handleInputChange('allow_review', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Allow students to review their answers</span>
                          </label>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security & Monitoring</h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.auto_submit}
                              onChange={(e) => handleInputChange('auto_submit', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Auto-submit when time limit is reached</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.require_webcam}
                              onChange={(e) => handleInputChange('require_webcam', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Require webcam monitoring (proctoring)</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.prevent_copy_paste}
                              onChange={(e) => handleInputChange('prevent_copy_paste', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Prevent copy/paste in quiz interface</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
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
                      {processing ? 'Creating...' : 'Create Quiz'}
                    </button>
                  </div>
                </form>

                {/* Information Box */}
                <div className="mt-6 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Next Steps
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          After creating this quiz, you'll be able to add questions, preview the quiz, and activate it for your students.
                          The quiz will be saved as a draft until you add questions and activate it.
                        </p>
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