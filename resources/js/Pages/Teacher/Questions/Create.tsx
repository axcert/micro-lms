import React, { useState } from 'react';
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
  questions_count: number;
  total_marks: number;
}

interface CreateQuestionProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
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

export default function CreateQuestion({ auth, quiz, errors = {} }: CreateQuestionProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: '',
    question_type: 'mcq',
    marks: 1,
    options: ['', ''],
    correct_answer: '',
    explanation: ''
  });

  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const submitData = {
      ...formData,
      marks: formData.marks === '' ? 1 : Number(formData.marks),
      options: formData.question_type === 'mcq' ? formData.options.filter(opt => opt.trim() !== '') : []
    };

    router.post(`/teacher/quizzes/${quiz.id}/questions`, submitData, {
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
    router.visit(`/teacher/quizzes/${quiz.id}/edit`);
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
      title="Create Question"
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Add a new question to your quiz"
    >
      <Head title={`Create Question - ${quiz.title}`} />
      
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
              {/* Question Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all duration-200 ${
                    formData.question_type === 'mcq' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white/50 hover:bg-white/80'
                  }`}>
                    <input
                      type="radio"
                      name="question_type"
                      value="mcq"
                      checked={formData.question_type === 'mcq'}
                      onChange={(e) => handleInputChange('question_type', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.question_type === 'mcq' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.question_type === 'mcq' && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">
                          Multiple Choice Question (MCQ)
                        </span>
                        <span className="block text-sm text-gray-500">
                          Students choose from predefined options
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all duration-200 ${
                    formData.question_type === 'short_answer' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white/50 hover:bg-white/80'
                  }`}>
                    <input
                      type="radio"
                      name="question_type"
                      value="short_answer"
                      checked={formData.question_type === 'short_answer'}
                      onChange={(e) => handleInputChange('question_type', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.question_type === 'short_answer' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.question_type === 'short_answer' && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">
                          Short Answer
                        </span>
                        <span className="block text-sm text-gray-500">
                          Students type their own answer
                        </span>
                      </div>
                    </div>
                  </label>
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

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex">
                      <HelpCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Tips for MCQ Questions</h4>
                        <ul className="mt-2 text-sm text-blue-700 list-disc pl-4 space-y-1">
                          <li>Make sure only one option is clearly correct</li>
                          <li>Avoid options like "All of the above" or "None of the above"</li>
                          <li>Keep options roughly the same length</li>
                          <li>Select the correct answer by clicking the radio button</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                          <ul className="mt-2 list-disc pl-4 space-y-1">
                            <li>Be specific about the expected answer length</li>
                            <li>Include keywords or key points in your explanation below</li>
                            <li>Consider the time needed for students to formulate their answers</li>
                          </ul>
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
                {processing ? 'Creating...' : 'Create Question'}
              </button>
            </div>
          </div>
        </form>

        {/* Help Box */}
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <FileQuestion className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                Creating Quality Questions
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  After creating this question, you can add more questions, reorder them, 
                  and preview the entire quiz before activating it for students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}