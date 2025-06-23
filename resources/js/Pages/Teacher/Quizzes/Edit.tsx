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
  XCircle,
  Eye,
  Play,
  Archive,
  Copy,
  Trash2,
  Edit3,
  GripVertical
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

interface Question {
  id: number;
  question_text: string;
  type: 'mcq' | 'short_answer';
  marks: number;
  order: number;
  options?: Array<{id: string, text: string}>;
  correct_answer?: string[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  instructions: string;
  batch_id: number;
  total_marks: number;
  pass_marks: number;
  duration_minutes: number | null;
  start_time: string | null;
  end_time: string | null;
  max_attempts: number | null;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  auto_submit: boolean;
  require_webcam: boolean;
  prevent_copy_paste: boolean;
  status: 'draft' | 'active' | 'archived';
  attempts_count: number;
  questions_count: number;
  can_edit: boolean;
  questions?: Question[];
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
}

interface EditQuizProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  batches: Batch[];
  errors?: Record<string, string>;
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

export default function EditQuiz({ auth, quiz, batches, errors = {} }: EditQuizProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    title: quiz.title || '',
    description: quiz.description || '',
    instructions: quiz.instructions || '',
    batch_id: quiz.batch_id?.toString() || '',
    pass_marks: quiz.pass_marks || '',
    duration_minutes: quiz.duration_minutes || '',
    start_time: quiz.start_time ? quiz.start_time.slice(0, 16) : '',
    end_time: quiz.end_time ? quiz.end_time.slice(0, 16) : '',
    max_attempts: quiz.max_attempts || '',
    shuffle_questions: quiz.shuffle_questions ?? true,
    shuffle_options: quiz.shuffle_options ?? true,
    show_results_immediately: quiz.show_results_immediately ?? true,
    allow_review: quiz.allow_review ?? true,
    auto_submit: quiz.auto_submit ?? true,
    require_webcam: quiz.require_webcam ?? false,
    prevent_copy_paste: quiz.prevent_copy_paste ?? true
  });

  const [processing, setProcessing] = useState(false);
  const [activating, setActivating] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'settings' | 'questions'>('details');

  // Check if quiz can be edited
  const canEdit = quiz.can_edit;
  const hasAttempts = quiz.attempts_count > 0;

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
      pass_marks: formData.pass_marks === '' ? 1 : Number(formData.pass_marks),
      duration_minutes: formData.duration_minutes === '' ? null : Number(formData.duration_minutes),
      max_attempts: formData.max_attempts === '' ? null : Number(formData.max_attempts),
      start_time: formData.start_time || null,
      end_time: formData.end_time || null
    };

    router.put(`/teacher/quizzes/${quiz.id}`, submitData, {
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
    if (quiz.status === 'draft') {
      now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now for draft
    }
    return now.toISOString().slice(0, 16);
  };

  const getMinEndTime = () => {
    if (!formData.start_time) return '';
    const startTime = new Date(formData.start_time);
    startTime.setHours(startTime.getHours() + 1); // Minimum 1 hour after start
    return startTime.toISOString().slice(0, 16);
  };

  // Enhanced activate function with better UX
  const activateQuiz = () => {
    // Pre-activation checks
    if (quiz.questions_count === 0) {
      alert('❌ Cannot activate quiz without questions.\n\nPlease add at least one question before activating.');
      return;
    }

    if (formData.pass_marks === '' || formData.pass_marks <= 0) {
      alert('❌ Please set valid pass marks before activating the quiz.');
      return;
    }

    // Show detailed confirmation dialog
    const confirmMessage = `🚀 Activate Quiz: "${quiz.title}"?\n\n` +
      `📊 Questions: ${quiz.questions_count}\n` +
      `🎯 Total Marks: ${quiz.total_marks}\n` +
      `✅ Pass Marks: ${formData.pass_marks}\n` +
      `👥 Students: ${quiz.batch?.student_count || 0}\n\n` +
      `Once activated, students will be able to take this quiz.`;

    if (!confirm(confirmMessage)) {
      return;
    }
    
    setActivating(true);
    
    // Make the activation request
    router.post(`/teacher/quizzes/${quiz.id}/activate`, {}, {
      onSuccess: () => {
        setActivating(false);
        // Refresh to show updated status
        router.reload();
      },
      onError: (errors) => {
        setActivating(false);
        console.error('Failed to activate quiz:', errors);
        
        // Show specific error message
        const errorMessage = errors.error || 'Failed to activate quiz. Please try again.';
        alert(`❌ Activation Failed\n\n${errorMessage}`);
      }
    });
  };

  const duplicateQuiz = () => {
    if (!confirm(`Create a copy of "${quiz.title}"?`)) {
      return;
    }

    router.post(`/teacher/quizzes/${quiz.id}/duplicate`, {}, {
      onSuccess: () => {
        // Will redirect to edit page of new quiz
      },
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to duplicate quiz.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const archiveQuiz = () => {
    if (!confirm(`Archive "${quiz.title}"? This will make it inactive but preserve all data.`)) {
      return;
    }

    router.post(`/teacher/quizzes/${quiz.id}/archive`, {}, {
      onSuccess: () => {
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to archive quiz.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const deleteQuiz = () => {
    if (hasAttempts) {
      alert('❌ Cannot delete quiz with student attempts.');
      return;
    }

    if (!confirm(`⚠️ Delete "${quiz.title}"?\n\nThis action cannot be undone. All questions will be permanently deleted.`)) {
      return;
    }

    router.delete(`/teacher/quizzes/${quiz.id}`, {
      onSuccess: () => {
        // Will redirect to quiz index
      },
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to delete quiz.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  // Question management functions
  const deleteQuestion = (question: Question) => {
    if (!confirm(`Delete question: "${question.question_text.substring(0, 50)}..."?\n\nThis action cannot be undone.`)) {
      return;
    }

    router.delete(`/teacher/quizzes/${quiz.id}/questions/${question.id}`, {
      onSuccess: () => {
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to delete question.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const duplicateQuestion = (question: Question) => {
    router.post(`/teacher/quizzes/${quiz.id}/questions/${question.id}/duplicate`, {}, {
      onSuccess: () => {
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to duplicate question.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const getQuestionTypeIcon = (type: string) => {
    return type === 'mcq' ? (
      <CheckCircle className="h-4 w-4 text-blue-500" />
    ) : (
      <FileQuestion className="h-4 w-4 text-purple-500" />
    );
  };

  const getCorrectAnswerDisplay = (question: Question) => {
    if (question.type === 'mcq' && question.options && question.correct_answer) {
      const correctIndex = parseInt(question.correct_answer[0] || '0');
      const correctOption = question.options[correctIndex];
      return correctOption ? correctOption.text : 'Not set';
    }
    return question.correct_answer ? question.correct_answer.join(', ') : 'Not set';
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
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          quiz.status === 'active' ? 'bg-green-100 text-green-800' :
          quiz.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
        </span>
        <span className="text-sm text-gray-500">ID: #{quiz.id}</span>
      </div>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title={`Edit Quiz: ${quiz.title}`}
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Modify quiz details and settings"
    >
      <Head title={`Edit Quiz: ${quiz.title}`} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Warning for Active Quiz */}
        {!canEdit && hasAttempts && (
          <div className="rounded-xl bg-yellow-50 p-4 border border-yellow-200">
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
                    This quiz is active with {quiz.attempts_count} student attempts. 
                    Only basic details can be modified to preserve data integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  onClick={() => setActiveTab('questions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'questions'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Questions ({quiz.questions_count})
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
                          disabled={!canEdit}
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            errors.batch_id ? 'border-red-300 bg-red-50' : 
                            !canEdit ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-200 bg-white/50'
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
                            This quiz is available to {selectedBatch.student_count} students in {selectedBatch.name}
                          </p>
                        )}
                        {!canEdit && (
                          <p className="mt-2 text-sm text-gray-500">
                            Batch cannot be changed after students have attempted the quiz
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scoring */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="total_marks" className="block text-sm font-medium text-gray-700 mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          id="total_marks"
                          value={quiz.total_marks}
                          readOnly
                          className="block w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl shadow-sm py-3 px-4 sm:text-sm"
                          placeholder="Auto-calculated"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Calculated from {quiz.questions_count} questions
                        </p>
                      </div>

                      <div>
                        <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-700 mb-2">
                          Pass Marks *
                        </label>
                        <input
                          type="number"
                          id="pass_marks"
                          value={formData.pass_marks}
                          onChange={(e) => handleInputChange('pass_marks', e.target.value === '' ? '' : parseInt(e.target.value))}
                          min="1"
                          max={quiz.total_marks > 0 ? quiz.total_marks : 1000} // Use 1000 when no questions exist
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            errors.pass_marks ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                          }`}
                          placeholder="Minimum marks to pass"
                          required
                        />
                        {errors.pass_marks && <p className="mt-2 text-sm text-red-600">{errors.pass_marks}</p>}
                        {quiz.total_marks === 0 && (
                          <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                            ⚠️ Pass marks will be validated against total marks once questions are added
                          </p>
                        )}
                        {quiz.total_marks > 0 && formData.pass_marks && formData.pass_marks > quiz.total_marks && (
                          <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            ❌ Pass marks cannot exceed total marks ({quiz.total_marks})
                          </p>
                        )}
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
                          disabled={!canEdit}
                          min="1"
                          max="480"
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            !canEdit ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-200 bg-white/50'
                          }`}
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
                          disabled={!canEdit}
                          min={getMinStartTime()}
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            !canEdit ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-200 bg-white/50'
                          }`}
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
                          disabled={!canEdit}
                          min={getMinEndTime()}
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            !canEdit ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-200 bg-white/50'
                          }`}
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
                          disabled={!canEdit}
                          min="1"
                          max="10"
                          className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                            !canEdit ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-200 bg-white/50'
                          }`}
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

              {activeTab === 'questions' && (
                <div className="space-y-6">
                  {/* Question Management Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Quiz Questions</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage questions and their order for this quiz
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          quiz.questions_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {quiz.questions_count} Questions
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          quiz.total_marks > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {quiz.total_marks} Total Marks
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </button>
                    </div>
                  </div>

                  {/* Questions List or Empty State */}
                  {quiz.questions && quiz.questions.length > 0 ? (
                    <div className="space-y-4">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="group bg-white/50 rounded-xl border border-gray-200 p-4 hover:bg-white/80 transition-all duration-200">
                          <div className="flex items-center">
                            {/* Drag Handle */}
                            <div className="mr-4 cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            
                            {/* Question Number */}
                            <div className="flex-shrink-0 mr-4">
                              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-green-800">{index + 1}</span>
                              </div>
                            </div>
                            
                            {/* Question Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                {getQuestionTypeIcon(question.type)}
                                <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                                  {question.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-900 line-clamp-2">
                                {question.question_text}
                              </p>
                              
                              {question.type === 'mcq' && question.options && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">
                                    {question.options.length} options • Correct: {getCorrectAnswerDisplay(question)}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex-shrink-0 ml-4">
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  type="button"
                                  onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/${question.id}/edit`)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                  title="Edit question"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => duplicateQuestion(question)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                  title="Duplicate question"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => deleteQuestion(question)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  title="Delete question"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Quick Actions */}
                      <div className="flex justify-center space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions`)}
                          className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <FileQuestion className="h-4 w-4 mr-2" />
                          Manage All Questions
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/preview`)}
                          className="inline-flex items-center px-4 py-2 border border-purple-200 rounded-xl shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Quiz
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                      <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Get started by creating your first question. You can add Multiple Choice Questions (MCQs) or Short Answer questions.
                      </p>
                      
                      <div className="flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Question
                        </button>
                      </div>

                      {/* Help Tips */}
                      <div className="mt-8 text-left max-w-md mx-auto">
                        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800">Getting Started</h4>
                              <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-4 space-y-1">
                                  <li>MCQ questions are auto-graded</li>
                                  <li>Short Answer questions require manual grading</li>
                                  <li>Total marks are calculated automatically</li>
                                  <li>You can reorder questions after creation</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Randomization Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Randomization</h3>
                    <div className="space-y-4">
                      <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        !canEdit ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200 hover:bg-white/80'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.shuffle_questions}
                          onChange={(e) => handleInputChange('shuffle_questions', e.target.checked)}
                          disabled={!canEdit}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className={`ml-3 text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>
                          Shuffle questions for each student
                        </span>
                      </label>
                      
                      <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        !canEdit ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200 hover:bg-white/80'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.shuffle_options}
                          onChange={(e) => handleInputChange('shuffle_options', e.target.checked)}
                          disabled={!canEdit}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className={`ml-3 text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>
                          Shuffle answer options for MCQ questions
                        </span>
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
                      <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        !canEdit ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200 hover:bg-white/80'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.auto_submit}
                          onChange={(e) => handleInputChange('auto_submit', e.target.checked)}
                          disabled={!canEdit}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className={`ml-3 text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>
                          Auto-submit when time limit is reached
                        </span>
                      </label>
                      
                      <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        !canEdit ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200 hover:bg-white/80'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.require_webcam}
                          onChange={(e) => handleInputChange('require_webcam', e.target.checked)}
                          disabled={!canEdit}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className={`ml-3 text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>
                          Require webcam monitoring (proctoring)
                        </span>
                      </label>
                      
                      <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        !canEdit ? 'bg-gray-50 border-gray-200' : 'bg-white/50 border-gray-200 hover:bg-white/80'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.prevent_copy_paste}
                          onChange={(e) => handleInputChange('prevent_copy_paste', e.target.checked)}
                          disabled={!canEdit}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className={`ml-3 text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>
                          Prevent copy/paste in quiz interface
                        </span>
                      </label>
                    </div>
                  </div>

                  {!canEdit && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                              Settings Locked
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>
                                Security and timing settings cannot be changed after students have attempted the quiz.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => router.visit(`/teacher/quizzes/${quiz.id}`)}
                className="inline-flex items-center px-6 py-3 border border-green-200 shadow-sm text-sm font-medium rounded-xl text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Quiz
              </button>

              {/* More Actions */}
              <button
                type="button"
                onClick={duplicateQuiz}
                className="inline-flex items-center px-6 py-3 border border-blue-200 shadow-sm text-sm font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </button>

              {quiz.status === 'active' && (
                <button
                  type="button"
                  onClick={archiveQuiz}
                  className="inline-flex items-center px-6 py-3 border border-orange-200 shadow-sm text-sm font-medium rounded-xl text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </button>
              )}

              {!hasAttempts && (
                <button
                  type="button"
                  onClick={deleteQuiz}
                  className="inline-flex items-center px-6 py-3 border border-red-200 shadow-sm text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {quiz.status === 'draft' && quiz.questions_count > 0 && (
                <button
                  type="button"
                  onClick={activateQuiz}
                  disabled={activating}
                  className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    activating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {activating ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Activating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Activate Quiz
                    </>
                  )}
                </button>
              )}
              
              <button
                type="submit"
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                  processing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

        {/* Status Information Boxes */}
        <div className="space-y-4">
          {quiz.status === 'draft' && quiz.questions_count === 0 && (
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Ready to Activate? Add Questions First!
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      📝 This quiz needs at least one question before activation.<br/>
                      🎯 After adding questions, you'll be able to activate it for your {quiz.batch?.student_count || 0} students.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('questions')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Go to Questions Tab
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {quiz.status === 'active' && (
            <div className="rounded-xl bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    🎉 Quiz is Active!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      This quiz is now available to {quiz.batch?.student_count || 0} students in {quiz.batch?.name}.
                      {quiz.attempts_count > 0 && ` ${quiz.attempts_count} students have already attempted it.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileQuestion className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Quiz Statistics
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Questions: {quiz.questions_count} • Total Marks: {quiz.total_marks} • 
                    Attempts: {quiz.attempts_count} • Status: {quiz.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}