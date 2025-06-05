import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileQuestion, 
  Calendar, 
  Clock, 
  Users,
  Plus,
  Edit,
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
  Bell,
  Award,
  TrendingUp
} from 'lucide-react';

interface Question {
  id: number;
  type: 'mcq' | 'multiple_choice' | 'true_false' | 'short_answer';
  question_text: string;
  explanation: string | null;
  marks: number;
  order: number;
  options: Array<{ id: string; text: string }> | null;
  correct_answer_text: string;
  attempts_count: number;
  correct_attempts_count: number;
  correct_percentage: number;
  difficulty_level: string;
}

interface Attempt {
  id: number;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  has_passed: boolean;
  submitted_at: string;
  time_taken: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
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
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
  questions: Question[];
  is_available: boolean;
  created_at: string;
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

export default function ShowQuiz() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'results' | 'analytics'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data
  const mockQuiz: Quiz = {
    id: 1,
    title: "Quadratic Equations Assessment",
    description: "Comprehensive test covering quadratic equations, graphing, and real-world applications including factoring, solving by different methods, and understanding parabolas.",
    instructions: "This quiz contains 15 questions about quadratic equations. You have 60 minutes to complete it. Make sure to show your work for partial credit where applicable. Calculator is allowed for computational questions.",
    status: "active",
    total_marks: 50,
    pass_marks: 30,
    duration_minutes: 60,
    questions_count: 15,
    attempts_count: 25,
    completed_attempts_count: 23,
    average_score: 38.5,
    pass_rate: 84.0,
    start_time: "2024-06-01T09:00:00Z",
    end_time: "2024-06-15T23:59:00Z",
    max_attempts: 2,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    allow_review: true,
    batch: {
      id: 1,
      name: "Mathematics Grade 10 - Morning",
      student_count: 28
    },
    questions: [
      {
        id: 1,
        type: "mcq",
        question_text: "What is the discriminant of the quadratic equation 2x² + 5x + 3 = 0?",
        explanation: "The discriminant is calculated using b² - 4ac. Here, a=2, b=5, c=3.",
        marks: 3,
        order: 1,
        options: [
          { id: "A", text: "1" },
          { id: "B", text: "5" },
          { id: "C", text: "25" },
          { id: "D", text: "-1" }
        ],
        correct_answer_text: "1",
        attempts_count: 23,
        correct_attempts_count: 19,
        correct_percentage: 82.6,
        difficulty_level: "Easy"
      },
      {
        id: 2,
        type: "short_answer",
        question_text: "Solve the equation x² - 6x + 9 = 0 and explain your method.",
        explanation: "This is a perfect square trinomial: (x-3)² = 0, so x = 3.",
        marks: 5,
        order: 2,
        options: null,
        correct_answer_text: "x = 3",
        attempts_count: 23,
        correct_attempts_count: 15,
        correct_percentage: 65.2,
        difficulty_level: "Medium"
      },
      {
        id: 3,
        type: "multiple_choice",
        question_text: "Which of the following are characteristics of a parabola? (Select all that apply)",
        explanation: "Parabolas have a vertex, axis of symmetry, and can open upward or downward.",
        marks: 4,
        order: 3,
        options: [
          { id: "A", text: "Has a vertex" },
          { id: "B", text: "Has an axis of symmetry" },
          { id: "C", text: "Always opens upward" },
          { id: "D", text: "Is a linear function" }
        ],
        correct_answer_text: "Has a vertex, Has an axis of symmetry",
        attempts_count: 23,
        correct_attempts_count: 12,
        correct_percentage: 52.2,
        difficulty_level: "Hard"
      }
    ],
    is_available: true,
    created_at: "2024-05-25T10:00:00Z"
  };

  const mockAnalytics: Analytics = {
    total_attempts: 25,
    completion_rate: 82.1,
    average_score: 38.5,
    highest_score: 48,
    lowest_score: 22,
    pass_rate: 84.0,
    average_time_taken: 45.2,
    score_distribution: {
      "0-20%": 1,
      "21-40%": 2,
      "41-60%": 4,
      "61-80%": 8,
      "81-100%": 10
    }
  };

  const mockRecentAttempts: Attempt[] = [
    {
      id: 1,
      score: 45,
      total_marks: 50,
      percentage: 90,
      grade: "A-",
      has_passed: true,
      submitted_at: "2024-06-03T14:30:00Z",
      time_taken: "42m",
      student: { id: 1, name: "Alice Johnson", email: "alice@example.com" }
    },
    {
      id: 2,
      score: 32,
      total_marks: 50,
      percentage: 64,
      grade: "C+",
      has_passed: true,
      submitted_at: "2024-06-03T14:45:00Z",
      time_taken: "58m",
      student: { id: 2, name: "Bob Smith", email: "bob@example.com" }
    },
    {
      id: 3,
      score: 25,
      total_marks: 50,
      percentage: 50,
      grade: "F",
      has_passed: false,
      submitted_at: "2024-06-03T15:00:00Z",
      time_taken: "35m",
      student: { id: 3, name: "Carol Davis", email: "carol@example.com" }
    }
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      case 'mcq': return 'Multiple Choice (Single)';
      case 'multiple_choice': return 'Multiple Choice (Multiple)';
      case 'true_false': return 'True/False';
      case 'short_answer': return 'Short Answer';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const statusInfo = getStatusInfo(mockQuiz.status);
  const StatusIcon = statusInfo.icon;

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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Quizzes
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">{mockQuiz.title}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {mockQuiz.batch.name} • {mockQuiz.questions_count} questions • {mockQuiz.total_marks} marks
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {mockQuiz.status === 'draft' && mockQuiz.questions_count > 0 && (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Activate Quiz
                        </button>
                      )}
                      
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </button>
                      
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quiz
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Attempts</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockQuiz.attempts_count}/{mockQuiz.batch.student_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockQuiz.average_score}/{mockQuiz.total_marks}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockQuiz.pass_rate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg. Time</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockAnalytics.average_time_taken}m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'questions'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Questions ({mockQuiz.questions_count})
                    </button>
                    <button
                      onClick={() => setActiveTab('results')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'results'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Results ({mockQuiz.attempts_count})
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'analytics'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Analytics
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Quiz Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quiz Information</h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="text-sm text-gray-900 mt-1">{mockQuiz.description}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Instructions</dt>
                            <dd className="text-sm text-gray-900 mt-1">{mockQuiz.instructions}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                            <dd className="text-sm text-gray-900">
                              {mockQuiz.duration_minutes ? `${mockQuiz.duration_minutes} minutes` : 'No time limit'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Attempts Allowed</dt>
                            <dd className="text-sm text-gray-900">
                              {mockQuiz.max_attempts ? `${mockQuiz.max_attempts} attempts` : 'Unlimited'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Schedule & Settings */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule & Settings</h3>
                        <dl className="space-y-4">
                          {mockQuiz.start_time && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                              <dd className="text-sm text-gray-900">{formatDateTime(mockQuiz.start_time)}</dd>
                            </div>
                          )}
                          {mockQuiz.end_time && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">End Time</dt>
                              <dd className="text-sm text-gray-900">{formatDateTime(mockQuiz.end_time)}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Randomization</dt>
                            <dd className="text-sm text-gray-900">
                              {mockQuiz.shuffle_questions && "Questions shuffled"}
                              {mockQuiz.shuffle_questions && mockQuiz.shuffle_options && ", "}
                              {mockQuiz.shuffle_options && "Options shuffled"}
                              {!mockQuiz.shuffle_questions && !mockQuiz.shuffle_options && "None"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Results</dt>
                            <dd className="text-sm text-gray-900">
                              {mockQuiz.show_results_immediately ? "Shown immediately" : "Hidden until review"}
                              {mockQuiz.allow_review && ", Review allowed"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}

                  {activeTab === 'questions' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {mockQuiz.questions_count} questions • Total marks: {mockQuiz.total_marks}
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </button>
                      </div>

                      <div className="space-y-4">
                        {mockQuiz.questions.map((question, index) => (
                          <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getQuestionTypeLabel(question.type)}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {question.marks} marks
                                  </span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty_level)}`}>
                                    {question.difficulty_level}
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
                                  <p className="text-sm text-green-600">{question.correct_answer_text}</p>
                                </div>
                                
                                {question.explanation && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700">Explanation:</p>
                                    <p className="text-sm text-gray-600">{question.explanation}</p>
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>{question.attempts_count} attempts</span>
                                  <span>{question.correct_percentage}% correct</span>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 ml-4">
                                <button
                                  type="button"
                                  className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'results' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {mockQuiz.attempts_count} total attempts • {mockQuiz.completed_attempts_count} completed
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Results
                        </button>
                      </div>

                      <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                          {mockRecentAttempts.map((attempt) => (
                            <li key={attempt.id} className="px-6 py-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                      <span className="text-sm font-medium text-purple-600">
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
                                      {attempt.score}/{attempt.total_marks} ({attempt.percentage}%)
                                    </p>
                                    <p className="text-sm text-gray-500">Grade: {attempt.grade}</p>
                                  </div>
                                  
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    attempt.has_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {attempt.has_passed ? 'Passed' : 'Failed'}
                                  </span>
                                  
                                  <div className="text-right text-sm text-gray-500">
                                    <p>{formatDateTime(attempt.submitted_at)}</p>
                                    <p>Time: {attempt.time_taken}</p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      {/* Score Distribution */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
                        <div className="space-y-3">
                          {Object.entries(mockAnalytics.score_distribution).map(([range, count]) => (
                            <div key={range} className="flex items-center">
                              <div className="w-16 text-sm text-gray-600">{range}</div>
                              <div className="flex-1 mx-4">
                                <div className="bg-gray-200 rounded-full h-4">
                                  <div
                                    className="bg-purple-600 h-4 rounded-full"
                                    style={{ width: `${(count / mockAnalytics.total_attempts) * 100}%` }}
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.completion_rate}%</p>
                          <p className="text-sm text-gray-500">{mockAnalytics.total_attempts} of {mockQuiz.batch.student_count} students</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h4 className="text-sm font-medium text-gray-500">Score Range</h4>
                          <p className="text-2xl font-semibold text-gray-900">
                            {mockAnalytics.lowest_score} - {mockAnalytics.highest_score}
                          </p>
                          <p className="text-sm text-gray-500">out of {mockQuiz.total_marks} marks</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h4 className="text-sm font-medium text-gray-500">Avg. Time Taken</h4>
                          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.average_time_taken}m</p>
                          <p className="text-sm text-gray-500">
                            {mockQuiz.duration_minutes ? `of ${mockQuiz.duration_minutes}m allowed` : 'no time limit'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}