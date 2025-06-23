import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2,
  Copy,
  FileQuestion,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Eye
} from 'lucide-react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

interface Quiz {
  id: number;
  title: string;
  total_marks: number;
  questions_count: number;
  status: string;
  batch: {
    id: number;
    name: string;
  };
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

interface QuestionsIndexProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  questions: Question[];
}

export default function QuestionsIndex({ auth, quiz, questions }: QuestionsIndexProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const goBack = () => {
    router.visit(`/teacher/quizzes/${quiz.id}/edit`);
  };

  const deleteQuestion = (question: Question) => {
    if (!confirm(`Delete question: "${question.question_text.substring(0, 50)}..."?\n\nThis action cannot be undone.`)) {
      return;
    }

    router.delete(`/teacher/quizzes/${quiz.id}/questions/${question.id}`, {
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to delete question.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const duplicateQuestion = (question: Question) => {
    router.post(`/teacher/quizzes/${quiz.id}/questions/${question.id}/duplicate`, {}, {
      onError: (errors) => {
        const errorMessage = errors.error || 'Failed to duplicate question.';
        alert(`❌ ${errorMessage}`);
      }
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <span className="text-sm text-gray-500">Quiz: {quiz.title}</span>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-500">{quiz.batch.name}</span>
      </div>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title="Manage Questions"
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Add, edit, and organize quiz questions"
    >
      <Head title={`Questions - ${quiz.title}`} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quiz Summary */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {quiz.questions_count} questions • {quiz.total_marks} total marks • Status: {quiz.status}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/questions/create`)}
                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </button>
              
              {questions.length > 0 && (
                <button
                  type="button"
                  onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/preview`)}
                  className="inline-flex items-center px-6 py-3 border border-blue-200 shadow-sm text-sm font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <p className="text-sm text-gray-500 mt-1">
                Drag questions to reorder • Click to edit
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div key={question.id} className="group hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex items-center px-6 py-4">
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
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by creating your first question. You can add Multiple Choice Questions (MCQs) or Short Answer questions.
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

        {/* Help Info */}
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Question Management Tips
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Questions are automatically numbered in the order they appear</li>
                  <li>MCQ questions are auto-graded, Short Answer questions require manual grading</li>
                  <li>Total quiz marks are calculated automatically from all questions</li>
                  <li>You can reorder questions by dragging them up or down</li>
                  <li>Preview the quiz to see how students will experience it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}