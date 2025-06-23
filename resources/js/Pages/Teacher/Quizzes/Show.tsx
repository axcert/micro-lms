import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  FileQuestion, 
  Calendar, 
  Clock, 
  Users,
  Plus,
  Edit3,
  Play,
  Eye,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Archive,
  Copy,
  Download,
  Trash2,
  BookOpen,
  Award,
  TrendingUp,
  AlertTriangle,
  GripVertical,
  Target,
  Timer,
  Activity
} from 'lucide-react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

interface Question {
  id: number;
  type: 'mcq' | 'short_answer';
  question_text: string;
  explanation: string | null;
  marks: number;
  order: number;
  options: Array<{ id: string; text: string }> | null;
  correct_answer: string[] | null;
  attempts_count?: number;
  correct_attempts_count?: number;
  correct_percentage?: number;
}

interface QuizAttempt {
  id: number;
  score: number;
  total_marks: number;
  percentage: number;
  has_passed: boolean;
  submitted_at: string;
  time_taken_minutes: number | null;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface Analytics {
  total_attempts: number;
  completion_rate: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  average_time_taken: number;
  score_distribution: Record<string, number>;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  instructions: string;
  status: 'draft' | 'active' | 'archived';
  total_marks: number;
  pass_marks: number;
  duration_minutes: number | null;
  questions_count: number;
  attempts_count: number;
  completed_attempts_count: number;
  average_score: number;
  pass_rate: number;
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
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
  questions?: Question[];
  is_available: boolean;
  can_edit: boolean;
  created_at: string;
}

interface ShowQuizProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  analytics: Analytics;
  recentAttempts: QuizAttempt[];
}

export default function ShowQuiz({ auth, quiz, analytics, recentAttempts }: ShowQuizProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'results' | 'analytics'>('overview');
  const [processing, setProcessing] = useState(false);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100', text: 'Active' };
      case 'draft':
        return { icon: Clock, color: 'text-yellow-600 bg-yellow-100', text: 'Draft' };
      case 'archived':
        return { icon: Archive, color: 'text-gray-600 bg-gray-100', text: 'Archived' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-100', text: status };
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'short_answer': return 'Short Answer';
      default: return type;
    }
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

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const activateQuiz = () => {
    if (quiz.questions_count === 0) {
      alert('❌ Cannot activate quiz without questions.\n\nPlease add at least one question before activating.');
      return;
    }

    const confirmMessage = `🚀 Activate Quiz: "${quiz.title}"?\n\n` +
      `📊 Questions: ${quiz.questions_count}\n` +
      `🎯 Total Marks: ${quiz.total_marks}\n` +
      `✅ Pass Marks: ${quiz.pass_marks}\n` +
      `👥 Students: ${quiz.batch?.student_count || 0}\n\n` +
      `Once activated, students will be able to take this quiz.`;

    if (!confirm(confirmMessage)) {
      return;
    }
    
    setProcessing(true);
    
    router.post(`/teacher/quizzes/${quiz.id}/activate`, {}, {
      onSuccess: () => {
        setProcessing(false);
        router.reload();
      },
      onError: (errors) => {
        setProcessing(false);
        const errorMessage = errors.error || 'Failed to activate quiz. Please try again.';
        alert(`❌ Activation Failed\n\n${errorMessage}`);
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

  const deleteQuiz = () => {
    if (quiz.attempts_count > 0) {
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

  const goBack = () => {
    router.visit('/teacher/quizzes');
  };

  const statusInfo = getStatusInfo(quiz.status);
  const StatusIcon = statusInfo.icon;

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.text}
        </span>
        <span className="text-sm text-gray-500">ID: #{quiz.id}</span>
      </div>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title={quiz.title}
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription={`${quiz.batch.name} • ${quiz.questions_count} questions • ${quiz.total_marks} marks`}
    >
      <Head title={`Quiz: ${quiz.title}`} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{quiz.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {quiz.batch.name} • Created {formatTimeAgo(quiz.created_at)}
              </p>
            </div>
            
            <div className="flex space-x-3">
              {quiz.status === 'draft' && quiz.questions_count > 0 && (
                <button
                  type="button"
                  onClick={activateQuiz}
                  disabled={processing}
                  className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    processing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {processing ? (
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
                type="button"
                onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/preview`)}
                className="inline-flex items-center px-4 py-2 border border-purple-200 shadow-sm text-sm font-medium rounded-xl text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              
              <button
                type="button"
                onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-blue-200 shadow-sm text-sm font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Quiz
              </button>
            </div>
          </div>

          {/* Description */}
          {quiz.description && (
            <p className="text-gray-600 mb-4">{quiz.description}</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Attempts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quiz.attempts_count}/{quiz.batch.student_count}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round((quiz.attempts_count / quiz.batch.student_count) * 100)}% participation
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quiz.average_score.toFixed(1)}/{quiz.total_marks}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round((quiz.average_score / quiz.total_marks) * 100)}% average
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quiz.pass_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">
                  Pass mark: {quiz.pass_marks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.average_time_taken.toFixed(0)}m
                </p>
                <p className="text-xs text-gray-400">
                  {quiz.duration_minutes ? `of ${quiz.duration_minutes}m` : 'no limit'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {quiz.status === 'draft' && quiz.questions_count === 0 && (
          <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Ready to Get Started?
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    📝 This quiz needs at least one question before activation.<br/>
                    🎯 Add questions to make it available to your {quiz.batch?.student_count || 0} students.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
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
                onClick={() => setActiveTab('results')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'results'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Results ({quiz.attempts_count})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'analytics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quiz Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h3>
                    <dl className="space-y-4">
                      {quiz.instructions && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Instructions</dt>
                          <dd className="text-sm text-gray-900 mt-1">{quiz.instructions}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Duration</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.duration_minutes ? `${quiz.duration_minutes} minutes` : 'No time limit'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Attempts Allowed</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.max_attempts ? `${quiz.max_attempts} attempts` : 'Unlimited'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Questions</dt>
                        <dd className="text-sm text-gray-900">{quiz.questions_count} questions</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total Marks</dt>
                        <dd className="text-sm text-gray-900">{quiz.total_marks} marks</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pass Marks</dt>
                        <dd className="text-sm text-gray-900">{quiz.pass_marks} marks</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Schedule & Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Settings</h3>
                    <dl className="space-y-4">
                      {quiz.start_time && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                          <dd className="text-sm text-gray-900">{formatDateTime(quiz.start_time)}</dd>
                        </div>
                      )}
                      {quiz.end_time && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Time</dt>
                          <dd className="text-sm text-gray-900">{formatDateTime(quiz.end_time)}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Randomization</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.shuffle_questions && "Questions shuffled"}
                          {quiz.shuffle_questions && quiz.shuffle_options && ", "}
                          {quiz.shuffle_options && "Options shuffled"}
                          {!quiz.shuffle_questions && !quiz.shuffle_options && "None"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Results</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.show_results_immediately ? "Shown immediately" : "Hidden until review"}
                          {quiz.allow_review && ", Review allowed"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Security</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.auto_submit && "Auto-submit enabled"}
                          {quiz.auto_submit && (quiz.require_webcam || quiz.prevent_copy_paste) && ", "}
                          {quiz.require_webcam && "Webcam required"}
                          {quiz.require_webcam && quiz.prevent_copy_paste && ", "}
                          {quiz.prevent_copy_paste && "Copy/paste disabled"}
                          {!quiz.auto_submit && !quiz.require_webcam && !quiz.prevent_copy_paste && "None"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {quiz.questions_count} questions • Total marks: {quiz.total_marks}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions`)}
                      className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Questions
                    </button>
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

                {quiz.questions && quiz.questions.length > 0 ? (
                  <div className="space-y-4">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="bg-white/50 rounded-xl border border-gray-200 p-6 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                                {index + 1}
                              </span>
                              {getQuestionTypeIcon(question.type)}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getQuestionTypeLabel(question.type)}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {question.marks} marks
                              </span>
                            </div>
                            
                            <h4 className="text-base font-medium text-gray-900 mb-3">
                              {question.question_text}
                            </h4>
                            
                            {question.options && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                                <ul className="space-y-1">
                                  {question.options.map((option) => (
                                    <li key={option.id} className="text-sm text-gray-600">
                                      {option.id}. {option.text}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                              <p className="text-sm text-green-600">{getCorrectAnswerDisplay(question)}</p>
                            </div>
                            
                            {question.explanation && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700">Explanation:</p>
                                <p className="text-sm text-gray-600">{question.explanation}</p>
                              </div>
                            )}
                            
                            {question.attempts_count !== undefined && (
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{question.attempts_count || 0} attempts</span>
                                <span>{question.correct_percentage?.toFixed(1) || 0}% correct</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              type="button"
                              onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/${question.id}/edit`)}
                              className="inline-flex items-center p-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Get started by creating your first question to make this quiz available to students.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Question
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Student Results</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {quiz.attempts_count} total attempts • {quiz.completed_attempts_count} completed
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/results`)}
                      className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View All Results
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </button>
                  </div>
                </div>

                {recentAttempts && recentAttempts.length > 0 ? (
                  <div className="bg-white/50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {recentAttempts.slice(0, 10).map((attempt) => (
                        <div key={attempt.id} className="px-6 py-4 hover:bg-white/80 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-green-600">
                                    {attempt.student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{attempt.student.name}</p>
                                <p className="text-sm text-gray-500">{attempt.student.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {attempt.score}/{attempt.total_marks} ({attempt.percentage.toFixed(1)}%)
                                </p>
                                <p className="text-sm text-gray-500">
                                  {attempt.time_taken_minutes ? `${attempt.time_taken_minutes}m` : 'No time recorded'}
                                </p>
                              </div>
                              
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                attempt.has_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {attempt.has_passed ? 'Passed' : 'Failed'}
                              </span>
                              
                              <div className="text-right text-sm text-gray-500">
                                <p>{formatDateTime(attempt.submitted_at)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Results will appear here once students start taking the quiz.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Analytics</h3>
                
                {analytics.total_attempts > 0 ? (
                  <>
                    {/* Score Distribution */}
                    <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Score Distribution</h4>
                      <div className="space-y-3">
                        {Object.entries(analytics.score_distribution).map(([range, count]) => (
                          <div key={range} className="flex items-center">
                            <div className="w-16 text-sm text-gray-600">{range}</div>
                            <div className="flex-1 mx-4">
                              <div className="bg-gray-200 rounded-full h-4">
                                <div
                                  className="bg-green-600 h-4 rounded-full transition-all duration-500"
                                  style={{ width: `${(count / analytics.total_attempts) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                          <Target className="h-8 w-8 text-blue-600 mr-4" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.completion_rate.toFixed(1)}%</p>
                            <p className="text-sm text-gray-500">{analytics.total_attempts} of {quiz.batch.student_count} students</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                          <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Score Range</h4>
                            <p className="text-2xl font-semibold text-gray-900">
                              {analytics.lowest_score} - {analytics.highest_score}
                            </p>
                            <p className="text-sm text-gray-500">out of {quiz.total_marks} marks</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                          <Timer className="h-8 w-8 text-purple-600 mr-4" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Avg. Time Taken</h4>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.average_time_taken.toFixed(0)}m</p>
                            <p className="text-sm text-gray-500">
                              {quiz.duration_minutes ? `of ${quiz.duration_minutes}m allowed` : 'no time limit'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Analytics will be available once students start taking the quiz.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={duplicateQuiz}
              className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Quiz
            </button>

            {quiz.status === 'active' && (
              <button
                type="button"
                onClick={archiveQuiz}
                className="inline-flex items-center px-4 py-2 border border-orange-200 rounded-xl shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Quiz
              </button>
            )}

            {quiz.attempts_count === 0 && (
              <button
                type="button"
                onClick={deleteQuiz}
                className="inline-flex items-center px-4 py-2 border border-red-200 rounded-xl shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Quiz
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Quiz created {formatTimeAgo(quiz.created_at)}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}