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
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

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
  auth: {
    user: User;
  };
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

export default function CreateQuiz({ auth, batches, errors = {}, old = {} }: CreateQuizProps) {
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

  // Header content with back button
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center px-4 py-2 border border-green-200 rounded-xl shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Quizzes
      </button>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title="Create New Quiz" 
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Set up a new assessment for your students"
    >
      <Head title="Create Quiz" />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200">
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'details'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Quiz Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'settings'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Quiz Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                          }`}
                          placeholder="e.g., Quadratic Equations Assessment"
                          required
                        />
                        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                          placeholder="Brief description of the quiz"
                        />
                      </div>

                      <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions for Students
                        </label>
                        <textarea
                          id="instructions"
                          rows={4}
                          value={formData.instructions}
                          onChange={(e) => handleInputChange('instructions', e.target.value)}
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                          placeholder="Detailed instructions for students taking the quiz"
                        />
                      </div>

                      <div>
                        <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700 mb-2">
                          Batch *
                        </label>
                        <select
                          id="batch_id"
                          value={formData.batch_id}
                          onChange={(e) => handleInputChange('batch_id', e.target.value)}
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            errors.batch_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
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
                        {errors.batch_id && <p className="mt-2 text-sm text-red-600">{errors.batch_id}</p>}
                        {selectedBatch && (
                          <p className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            This quiz will be available to {selectedBatch.student_count} students in {selectedBatch.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scoring */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-700 mb-2">
                          Pass Marks *
                        </label>
                        <input
                          type="number"
                          id="pass_marks"
                          value={formData.pass_marks}
                          onChange={(e) => handleInputChange('pass_marks', e.target.value === '' ? '' : parseInt(e.target.value))}
                          min="0"
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            errors.pass_marks ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                          }`}
                          placeholder="Minimum marks to pass"
                          required
                        />
                        {errors.pass_marks && <p className="mt-2 text-sm text-red-600">{errors.pass_marks}</p>}
                        <p className="mt-2 text-sm text-gray-500">
                          Total marks will be calculated based on questions added
                        </p>
                      </div>

                      <div>
                        <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="duration_minutes"
                          value={formData.duration_minutes}
                          onChange={(e) => handleInputChange('duration_minutes', e.target.value === '' ? '' : parseInt(e.target.value))}
                          min="1"
                          max="480"
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                          placeholder="Leave empty for no time limit"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Maximum 8 hours (480 minutes)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          id="start_time"
                          value={formData.start_time}
                          onChange={(e) => handleInputChange('start_time', e.target.value)}
                          min={getMinStartTime()}
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Leave empty to start immediately
                        </p>
                      </div>

                      <div>
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          id="end_time"
                          value={formData.end_time}
                          onChange={(e) => handleInputChange('end_time', e.target.value)}
                          min={getMinEndTime()}
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Leave empty for no end time
                        </p>
                      </div>

                      <div>
                        <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700 mb-2">
                          Max Attempts
                        </label>
                        <input
                          type="number"
                          id="max_attempts"
                          value={formData.max_attempts}
                          onChange={(e) => handleInputChange('max_attempts', e.target.value === '' ? '' : parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                          placeholder="Unlimited"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Leave empty for unlimited attempts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Randomization Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Randomization</h3>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.shuffle_questions}
                          onChange={(e) => handleInputChange('shuffle_questions', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Shuffle questions for each student</span>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.shuffle_options}
                          onChange={(e) => handleInputChange('shuffle_options', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Shuffle answer options for MCQ questions</span>
                      </label>
                    </div>
                  </div>

                  {/* Result Settings */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Results & Review</h3>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.show_results_immediately}
                          onChange={(e) => handleInputChange('show_results_immediately', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Show results immediately after submission</span>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allow_review}
                          onChange={(e) => handleInputChange('allow_review', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Allow students to review their answers</span>
                      </label>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Monitoring</h3>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.auto_submit}
                          onChange={(e) => handleInputChange('auto_submit', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Auto-submit when time limit is reached</span>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.require_webcam}
                          onChange={(e) => handleInputChange('require_webcam', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Require webcam monitoring (proctoring)</span>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.prevent_copy_paste}
                          onChange={(e) => handleInputChange('prevent_copy_paste', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Prevent copy/paste in quiz interface</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={processing}
              className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                processing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>

        {/* Information Box */}
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
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
    </TeacherLayout>
  );
}