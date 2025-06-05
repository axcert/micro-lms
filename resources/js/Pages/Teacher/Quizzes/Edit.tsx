import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileQuestion, 
  Calendar, 
  Clock, 
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Bell,
  Save,
  Eye
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  student_count: number;
}

interface Question {
  id: number;
  type: 'mcq' | 'multiple_choice' | 'true_false' | 'short_answer';
  question_text: string;
  explanation: string;
  marks: number;
  order: number;
  is_required: boolean;
  options?: Array<{ id: string; text: string }>;
  correct_answer: string[];
  case_sensitive?: boolean;
  partial_credit?: boolean;
}

interface QuizData {
  id: number;
  title: string;
  description: string;
  instructions: string;
  batch_id: string;
  total_marks: number;
  pass_marks: number;
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
  status: 'draft' | 'active' | 'archived';
  questions: Question[];
  attempts_count: number;
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
}

export default function EditQuiz() {
  const [activeTab, setActiveTab] = useState<'details' | 'questions' | 'settings'>('details');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Mock existing quiz data
  const existingQuiz: QuizData = {
    id: 1,
    title: "Quadratic Equations Assessment",
    description: "Comprehensive test covering quadratic equations, graphing, and real-world applications",
    instructions: "Answer all questions to the best of your ability. Show your work for calculation problems.",
    batch_id: "1",
    total_marks: 50,
    pass_marks: 30,
    duration_minutes: 60,
    start_time: "2024-06-01T09:00",
    end_time: "2024-06-15T23:59",
    max_attempts: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    allow_review: true,
    auto_submit: true,
    require_webcam: false,
    prevent_copy_paste: true,
    status: "active",
    attempts_count: 25,
    batch: { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
    questions: [
      {
        id: 1,
        type: "mcq",
        question_text: "What is the discriminant of the quadratic equation x² + 5x + 6 = 0?",
        explanation: "The discriminant is calculated using b² - 4ac formula.",
        marks: 2,
        order: 1,
        is_required: true,
        options: [
          { id: "A", text: "1" },
          { id: "B", text: "5" },
          { id: "C", text: "25" },
          { id: "D", text: "-1" }
        ],
        correct_answer: ["A"],
        case_sensitive: false,
        partial_credit: false
      },
      {
        id: 2,
        type: "short_answer",
        question_text: "Solve the quadratic equation: x² - 7x + 12 = 0",
        explanation: "Factor the equation or use the quadratic formula.",
        marks: 4,
        order: 2,
        is_required: true,
        correct_answer: ["x = 3, x = 4", "3, 4", "x = 4, x = 3"],
        case_sensitive: false,
        partial_credit: true
      },
      {
        id: 3,
        type: "true_false",
        question_text: "The graph of a quadratic function is always a parabola.",
        explanation: "Quadratic functions always form parabolic curves.",
        marks: 1,
        order: 3,
        is_required: true,
        options: [
          { id: "true", text: "True" },
          { id: "false", text: "False" }
        ],
        correct_answer: ["true"],
        case_sensitive: false,
        partial_credit: false
      }
    ]
  };

  const [formData, setFormData] = useState(existingQuiz);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
    { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
    { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 }
  ];

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Quiz updated successfully!');
    }, 1000);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq':
        return '🔘';
      case 'multiple_choice':
        return '☑️';
      case 'true_false':
        return '✅';
      case 'short_answer':
        return '📝';
      default:
        return '❓';
    }
  };

  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'mcq':
        return 'Multiple Choice (Single)';
      case 'multiple_choice':
        return 'Multiple Choice (Multiple)';
      case 'true_false':
        return 'True/False';
      case 'short_answer':
        return 'Short Answer';
      default:
        return type;
    }
  };

  const canEdit = formData.status === 'draft' || (formData.status === 'active' && formData.attempts_count === 0);

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
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
                      <p className="mt-1 text-sm text-gray-500">
                        Modify quiz details, questions, and settings
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData.status === 'active' ? 'bg-green-100 text-green-800' :
                        formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">ID: #{formData.id}</span>
                    </div>
                  </div>
                </div>

                {/* Warning for Active Quiz */}
                {!canEdit && (
                  <div className="mb-6 rounded-md bg-yellow-50 p-4">
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
                            This quiz is active with {formData.attempts_count} student attempts. 
                            Only basic details can be modified to preserve data integrity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
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
                      onClick={() => setActiveTab('questions')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'questions'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Questions ({formData.questions.length})
                    </button>
                    <button
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
                <div className="mt-6">
                  {activeTab === 'details' && (
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                      <div className="space-y-6">
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
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="e.g., Quadratic Equations Assessment"
                              />
                            </div>

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
                                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
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
                                onChange={(e) => setFormData(prev => ({ ...prev, batch_id: e.target.value }))}
                                disabled={!canEdit}
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  !canEdit ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                              >
                                {mockBatches.map(batch => (
                                  <option key={batch.id} value={batch.id.toString()}>
                                    {batch.name} ({batch.student_count} students)
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Scoring */}
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label htmlFor="total_marks" className="block text-sm font-medium text-gray-700">
                                Total Marks
                              </label>
                              <input
                                type="number"
                                id="total_marks"
                                value={formData.total_marks}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                                placeholder="Auto-calculated"
                              />
                              <p className="mt-1 text-sm text-gray-500">
                                Calculated from questions: {formData.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                              </p>
                            </div>

                            <div>
                              <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-700">
                                Pass Marks *
                              </label>
                              <input
                                type="number"
                                id="pass_marks"
                                value={formData.pass_marks}
                                onChange={(e) => setFormData(prev => ({ ...prev, pass_marks: parseInt(e.target.value) || 0 }))}
                                min="0"
                                max={formData.total_marks}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              />
                            </div>

                            <div>
                              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                id="duration_minutes"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value ? parseInt(e.target.value) : '' }))}
                                disabled={!canEdit}
                                min="1"
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  !canEdit ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                                placeholder="No time limit"
                              />
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
                                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                                disabled={!canEdit}
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  !canEdit ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                              />
                            </div>

                            <div>
                              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                                End Time
                              </label>
                              <input
                                type="datetime-local"
                                id="end_time"
                                value={formData.end_time}
                                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                                disabled={!canEdit}
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  !canEdit ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                              />
                            </div>

                            <div>
                              <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700">
                                Max Attempts
                              </label>
                              <input
                                type="number"
                                id="max_attempts"
                                value={formData.max_attempts}
                                onChange={(e) => setFormData(prev => ({ ...prev, max_attempts: e.target.value ? parseInt(e.target.value) : '' }))}
                                disabled={!canEdit}
                                min="1"
                                max="10"
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                                  !canEdit ? 'bg-gray-50 text-gray-500' : ''
                                }`}
                                placeholder="Unlimited"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'questions' && (
                    <div className="space-y-6">
                      {/* Questions Header */}
                      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                            <p className="text-sm text-gray-500">
                              {formData.questions.length} questions • Total marks: {formData.questions.reduce((sum, q) => sum + q.marks, 0)}
                            </p>
                          </div>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => setShowQuestionModal(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Questions List */}
                      {formData.questions.length === 0 ? (
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-12 text-center">
                          <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Get started by adding your first question to this quiz.
                          </p>
                          {canEdit && (
                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={() => setShowQuestionModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Question
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formData.questions.map((question, index) => (
                            <div key={question.id} className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                                    <span className="text-sm font-medium text-gray-900">Q{index + 1}</span>
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="text-sm text-gray-500">{getQuestionTypeText(question.type)}</span>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                        {question.marks} mark{question.marks !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-900 mb-3">{question.question_text}</p>
                                    
                                    {question.options && (
                                      <div className="space-y-1">
                                        {question.options.map((option, optIndex) => (
                                          <div key={optIndex} className={`text-sm px-3 py-1 rounded ${
                                            question.correct_answer.includes(option.id) 
                                              ? 'bg-green-50 text-green-800 border border-green-200' 
                                              : 'bg-gray-50 text-gray-600'
                                          }`}>
                                            {option.id}. {option.text}
                                            {question.correct_answer.includes(option.id) && (
                                              <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {question.type === 'short_answer' && (
                                      <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded border border-green-200">
                                        Correct answer(s): {question.correct_answer.join(', ')}
                                      </div>
                                    )}
                                    
                                    {question.explanation && (
                                      <div className="mt-2 text-sm text-gray-500 italic">
                                        Explanation: {question.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {canEdit && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingQuestion(question)}
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      className="p-1 text-red-400 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                      <div className="space-y-6">
                        {/* Randomization Settings */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Randomization</h3>
                          <div className="space-y-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.shuffle_questions}
                                onChange={(e) => setFormData(prev => ({ ...prev, shuffle_questions: e.target.checked }))}
                                disabled={!canEdit}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Shuffle questions for each student</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.shuffle_options}
                                onChange={(e) => setFormData(prev => ({ ...prev, shuffle_options: e.target.checked }))}
                                disabled={!canEdit}
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
                                onChange={(e) => setFormData(prev => ({ ...prev, show_results_immediately: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Show results immediately after submission</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.allow_review}
                                onChange={(e) => setFormData(prev => ({ ...prev, allow_review: e.target.checked }))}
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
                                onChange={(e) => setFormData(prev => ({ ...prev, auto_submit: e.target.checked }))}
                                disabled={!canEdit}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Auto-submit when time limit is reached</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.require_webcam}
                                onChange={(e) => setFormData(prev => ({ ...prev, require_webcam: e.target.checked }))}
                                disabled={!canEdit}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Require webcam monitoring (proctoring)</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.prevent_copy_paste}
                                onChange={(e) => setFormData(prev => ({ ...prev, prevent_copy_paste: e.target.checked }))}
                                disabled={!canEdit}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Prevent copy/paste in quiz interface</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-between">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Quiz
                    </button>
                    
                    {formData.status === 'draft' && formData.questions.length > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate Quiz
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
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
                      <Save className="h-4 w-4 mr-2" />
                      {processing ? 'Saving...' : 'Save Changes'}
                    </button>
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