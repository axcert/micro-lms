import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Clock, 
  FileQuestion,
  CheckCircle,
  Eye,
  Play,
  Target,
  Users,
  Calendar,
  AlertCircle,
  BookOpen,
  Timer
} from 'lucide-react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

interface Quiz {
  id: number;
  title: string;
  description: string;
  instructions: string;
  duration_minutes: number | null;
  total_marks: number;
  pass_marks: number;
  questions_count: number;
  max_attempts: number | null;
  start_time: string | null;
  end_time: string | null;
  batch: {
    id: number;
    name: string;
  };
}

interface Question {
  id: number;
  order: number;
  type: 'mcq' | 'short_answer';
  question_text: string;
  marks: number;
  explanation?: string;
  options?: Array<{ id: string; text: string }>;
  correct_answer_preview?: { id: string; text: string };
}

interface PreviewStats {
  total_questions: number;
  total_marks: number;
  estimated_time: number;
  question_types: {
    mcq: number;
    short_answer: number;
  };
}

interface QuizPreviewProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  questions: Question[];
  stats: PreviewStats;
}

export default function QuizPreview({ auth, quiz, questions, stats }: QuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'questions'>('overview');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const goBack = () => {
    router.visit(`/teacher/quizzes/${quiz.id}`);
  };

  const getQuestionTypeIcon = (type: string) => {
    return type === 'mcq' ? (
      <CheckCircle className="h-4 w-4 text-blue-500" />
    ) : (
      <FileQuestion className="h-4 w-4 text-purple-500" />
    );
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Header content with back button
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center px-4 py-2 border border-green-200 rounded-xl shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Quiz
      </button>
      <div className="flex items-center space-x-2">
        <Eye className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Preview Mode</span>
      </div>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title={`Preview: ${quiz.title}`}
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="See how students will experience this quiz"
    >
      <Head title={`Preview: ${quiz.title}`} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Preview Mode Toggle */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Teacher Preview Mode</h3>
              <p className="text-sm text-blue-700 mt-1">
                This is how students will see the quiz. Correct answers are highlighted for your reference.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setViewMode('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  viewMode === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quiz Overview
              </button>
              <button
                onClick={() => setViewMode('questions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  viewMode === 'questions'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Questions Preview
              </button>
            </nav>
          </div>

          <div className="p-6">
            {viewMode === 'overview' && (
              <div className="space-y-6">
                {/* Quiz Information */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">{quiz.batch.name}</p>
                  {quiz.description && (
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">{quiz.description}</p>
                  )}
                </div>

                {/* Quiz Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 text-center border border-gray-200">
                    <FileQuestion className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_questions}</p>
                    <p className="text-sm text-gray-500">Questions</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4 text-center border border-gray-200">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{quiz.total_marks}</p>
                    <p className="text-sm text-gray-500">Total Marks</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4 text-center border border-gray-200">
                    <Timer className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">
                      {quiz.duration_minutes || stats.estimated_time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quiz.duration_minutes ? 'Minutes' : 'Est. Minutes'}
                    </p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4 text-center border border-gray-200">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{quiz.pass_marks}</p>
                    <p className="text-sm text-gray-500">Pass Marks</p>
                  </div>
                </div>

                {/* Instructions */}
                {quiz.instructions && (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-800 mb-2">Instructions</h3>
                        <p className="text-sm text-amber-700 whitespace-pre-wrap">{quiz.instructions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quiz Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quiz Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Duration:</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.duration_minutes ? `${quiz.duration_minutes} minutes` : 'No time limit'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Attempts:</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.max_attempts ? `${quiz.max_attempts} allowed` : 'Unlimited'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Passing Score:</dt>
                        <dd className="text-sm text-gray-900">
                          {quiz.pass_marks}/{quiz.total_marks} ({Math.round((quiz.pass_marks / quiz.total_marks) * 100)}%)
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Question Breakdown</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Multiple Choice:</dt>
                        <dd className="text-sm text-gray-900">{stats.question_types.mcq} questions</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Short Answer:</dt>
                        <dd className="text-sm text-gray-900">{stats.question_types.short_answer} questions</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Estimated Time:</dt>
                        <dd className="text-sm text-gray-900">{stats.estimated_time} minutes</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Schedule Information */}
                {(quiz.start_time || quiz.end_time) && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Schedule</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                          {quiz.start_time && (
                            <p>Available from: {formatDateTime(quiz.start_time)}</p>
                          )}
                          {quiz.end_time && (
                            <p>Available until: {formatDateTime(quiz.end_time)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Start Quiz Button (Preview) */}
                <div className="text-center pt-6">
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gray-400 cursor-not-allowed"
                  >
                    <Play className="h-5 w-5 mr-3" />
                    Start Quiz (Preview Mode)
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Students would click here to begin the quiz
                  </p>
                </div>
              </div>
            )}

            {viewMode === 'questions' && (
              <div className="space-y-6">
                {questions.length > 0 ? (
                  <>
                    {/* Question Navigation */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                          disabled={currentQuestionIndex === questions.length - 1}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    {/* Current Question */}
                    <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {getQuestionTypeIcon(currentQuestion.type)}
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                          {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                        </span>
                      </div>

                      <h4 className="text-lg font-medium text-gray-900 mb-6">
                        {currentQuestion.question_text}
                      </h4>

                      {currentQuestion.type === 'mcq' && currentQuestion.options && (
                        <div className="space-y-3">
                          {currentQuestion.options.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                currentQuestion.correct_answer_preview?.id === option.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option.id}
                                disabled
                                checked={currentQuestion.correct_answer_preview?.id === option.id}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <span className="ml-3 text-sm text-gray-900">
                                {option.id}. {option.text}
                              </span>
                              {currentQuestion.correct_answer_preview?.id === option.id && (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'short_answer' && (
                        <div>
                          <textarea
                            disabled
                            rows={4}
                            className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-gray-50 text-gray-500"
                            placeholder="Students would type their answer here..."
                          />
                        </div>
                      )}

                      {/* Correct Answer Preview */}
                      {currentQuestion.correct_answer_preview && (
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <h5 className="text-sm font-medium text-green-800">Correct Answer (Teacher View)</h5>
                              <p className="text-sm text-green-700 mt-1">
                                {currentQuestion.correct_answer_preview.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {currentQuestion.explanation && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <h5 className="text-sm font-medium text-blue-800">Explanation</h5>
                              <p className="text-sm text-blue-700 mt-1">{currentQuestion.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Question Navigation Grid */}
                    <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Question Navigation</h4>
                      <div className="grid grid-cols-10 gap-2">
                        {questions.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                              index === currentQuestionIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
                    <p className="text-gray-500 mb-6">
                      Add questions to this quiz to see the preview.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                      className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      Add Questions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            Back to Quiz
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/edit`)}
              className="inline-flex items-center px-6 py-3 border border-blue-200 shadow-sm text-sm font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Edit Quiz
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}