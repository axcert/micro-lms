import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Save,
  FileQuestion,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

interface Quiz {
  id: number;
  title: string;
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
  options?: Array<{id: string, text: string}>;
  correct_answer?: string[];
  explanation?: string;
}

interface EditQuestionProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  question: Question;
  errors?: Record<string, string>;
}

interface QuestionFormData {
  question_text: string;
  question_type: 'mcq' | 'short_answer';
  marks: number | '';
  options: string[];
  correct_answer: string;
  explanation: string;
}

export default function EditQuestion({ auth, quiz, question, errors = {} }: EditQuestionProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: question.question_text || '',
    question_type: question.type || 'mcq',
    marks: question.marks || 1,
    options: question.options ? question.options.map(opt => opt.text) : ['', ''],
    correct_answer: question.options && question.correct_answer 
      ? question.options[parseInt(question.correct_answer[0] || '0')]?.text || ''
      : '',
    explanation: question.explanation || ''
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // If switching to MCQ and don't have enough options, add them
    if (formData.question_type === 'mcq' && formData.options.length < 2) {
      setFormData(prev => ({
        ...prev,
        options: ['', '']
      }));
    }
  }, [formData.question_type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const submitData = {
      ...formData,
      marks: formData.marks === '' ? 1 : Number(formData.marks),
      options: formData.question_type === 'mcq' ? formData.options.filter(opt => opt.trim() !== '') : []
    };

    router.put(`/teacher/quizzes/${quiz.id}/questions/${question.id}`, submitData, {
      onFinish: () => setProcessing(false),
      onError: () => setProcessing(false)
    });
  };

  const handleInputChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correct_answer: newOptions.includes(prev.correct_answer) ? prev.correct_answer : ''
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const goBack = () => {
    router.visit(`/teacher/quizzes/${quiz.id}/questions`);
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
        Back to Questions
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
      title="Edit Question"
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Modify question details and settings"
    >
      <Head title={`Edit Question - ${quiz.title}`} />
      
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-8">
              {/* Question Type Display (Read-only) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Type</h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    {formData.question_type === 'mcq' ? (
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                    ) : (
                      <FileQuestion className="h-5 w-5 text-purple-500 mr-3" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {formData.question_type === 'mcq' ? 'Multiple Choice Question (MCQ)' : 'Short Answer'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-8">
                    Question type cannot be changed after creation
                  </p>
                </div>
              </div>

              {/* Question Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      id="question_text"
                      rows={4}
                      value={formData.question_text}
                      onChange={(e) => handleInputChange('question_text', e.target.value)}
                      className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                        errors.question_text ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                      }`}
                      placeholder="Type your question here..."
                      required
                    />
                    {errors.question_text && <p className="mt-2 text-sm text-red-600">{errors.question_text}</p>}
                  </div>

                  <div>
                    <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-2">
                      Marks *
                    </label>
                    <input
                      type="number"
                      id="marks"
                      value={formData.marks}
                      onChange={(e) => handleInputChange('marks', e.target.value === '' ? '' : parseInt(e.target.value))}
                      min="1"
                      max="100"
                      className={`block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 ${
                        errors.marks ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                      }`}
                      placeholder="1"
                      required
                    />
                    {errors.marks && <p className="mt-2 text-sm text-red-600">{errors.marks}</p>}
                  </div>
                </div>
              </div>

              {/* MCQ Options */}
              {formData.question_type === 'mcq' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Answer Options</h3>
                    <button
                      type="button"
                      onClick={addOption}
                      disabled={formData.options.length >= 6}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 ${
                        formData.options.length >= 6
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                      }`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="correct_answer"
                            value={option}
                            checked={formData.correct_answer === option}
                            onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {errors.options && <p className="mt-2 text-sm text-red-600">{errors.options}</p>}
                  {errors.correct_answer && <p className="mt-2 text-sm text-red-600">{errors.correct_answer}</p>}
                </div>
              )}

              {/* Short Answer Instructions */}
              {formData.question_type === 'short_answer' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                    <div className="flex">
                      <BookOpen className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Short Answer Questions</h4>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            Short answer questions require manual grading by the teacher. 
                            Students will type their answers in a text box.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation (Optional)</h3>
                
                <div>
                  <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation or Teaching Note
                  </label>
                  <textarea
                    id="explanation"
                    rows={3}
                    value={formData.explanation}
                    onChange={(e) => handleInputChange('explanation', e.target.value)}
                    className="block w-full border border-gray-200 bg-white/50 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                    placeholder="Add an explanation that will be shown to students after they complete the quiz..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This will help students understand the correct answer and learn from their mistakes.
                  </p>
                </div>
              </div>
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
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                  processing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Updating...' : 'Update Question'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
}