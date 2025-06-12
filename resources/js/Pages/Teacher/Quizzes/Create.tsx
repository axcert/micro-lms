import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    ClipboardDocumentListIcon,
    PlusIcon,
    UserGroupIcon,
    CalendarIcon,
    ClockIcon,
    ArrowLeftIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    TrashIcon,
    EyeIcon,
    PencilIcon,
    PlayIcon,
    StopIcon
} from '@heroicons/react/24/outline';

interface Batch {
    id: number;
    name: string;
    students_count: number;
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    batch: {
        name: string;
    };
    questions_count: number;
    attempts_count: number;
    duration: number;
    start_time: string;
    end_time: string;
    status: 'active' | 'inactive' | 'completed';
    created_at: string;
}

interface CreateQuizProps {
    batches?: Batch[];
    quizzes?: Quiz[];
}

const Create: React.FC<CreateQuizProps> = ({ batches = [], quizzes = [] }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        batch_id: '',
        start_time: '',
        end_time: '',
        duration: 60,
        randomize_questions: true,
        show_results_immediately: false,
        allow_review: true,
        max_attempts: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/quizzes');
    };

    const navigateBack = () => {
        router.visit('/teacher/dashboard');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <PlayIcon className="w-4 h-4" />;
            case 'inactive': return <StopIcon className="w-4 h-4" />;
            case 'completed': return <ClipboardDocumentListIcon className="w-4 h-4" />;
            default: return <ClockIcon className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Quiz Management" />
            
            {/* Enhanced Header */}
            <div className="bg-white shadow-lg border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={navigateBack}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
                            >
                                <ArrowLeftIcon className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                            </button>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                    Quiz Management
                                </h1>
                                <p className="text-gray-600">Create and manage quizzes for your students.</p>
                            </div>
                        </div>
                        
                        {/* Tab Navigation */}
                        <div className="flex bg-green-50 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'create'
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'text-green-600 hover:bg-green-100'
                                }`}
                            >
                                Create Quiz
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'manage'
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'text-green-600 hover:bg-green-100'
                                }`}
                            >
                                Manage Quizzes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'create' ? (
                    /* Create Quiz Section */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quiz Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3">
                                        <PlusIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                        Create New Quiz
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Quiz Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                                placeholder="Enter quiz title..."
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Select Batch
                                            </label>
                                            <select
                                                value={data.batch_id}
                                                onChange={(e) => setData('batch_id', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            >
                                                <option value="">Choose a batch...</option>
                                                {batches.map((batch) => (
                                                    <option key={batch.id} value={batch.id}>
                                                        {batch.name} ({batch.students_count} students)
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.batch_id && <p className="text-red-500 text-sm mt-1">{errors.batch_id}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            placeholder="Brief description of the quiz..."
                                        />
                                    </div>

                                    {/* Timing */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Start Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.start_time}
                                                onChange={(e) => setData('start_time', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                End Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', parseInt(e.target.value))}
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Advanced Settings Toggle */}
                                    <div className="border-t pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                                        >
                                            <Cog6ToothIcon className="w-5 h-5 mr-2" />
                                            Advanced Settings
                                            <div className={`ml-2 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        </button>

                                        {showAdvanced && (
                                            <div className="mt-4 space-y-4 bg-green-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.randomize_questions}
                                                            onChange={(e) => setData('randomize_questions', e.target.checked)}
                                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Randomize Questions</span>
                                                    </label>

                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.show_results_immediately}
                                                            onChange={(e) => setData('show_results_immediately', e.target.checked)}
                                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Show Results Immediately</span>
                                                    </label>

                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.allow_review}
                                                            onChange={(e) => setData('allow_review', e.target.checked)}
                                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Allow Answer Review</span>
                                                    </label>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Max Attempts
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={data.max_attempts}
                                                            onChange={(e) => setData('max_attempts', parseInt(e.target.value))}
                                                            min="1"
                                                            max="10"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <PlusIcon className="w-5 h-5 mr-2" />
                                                    Create Quiz
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <ClipboardDocumentListIcon className="w-5 h-5 text-green-600 mr-2" />
                                            <span className="text-sm font-medium text-green-700">Total Quizzes</span>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">{quizzes.length}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <UserGroupIcon className="w-5 h-5 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-700">Active Batches</span>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600">{batches.length}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center">
                                            <ChartBarIcon className="w-5 h-5 text-purple-600 mr-2" />
                                            <span className="text-sm font-medium text-purple-700">Total Students</span>
                                        </div>
                                        <span className="text-xl font-bold text-purple-600">
                                            {batches.reduce((total, batch) => total + batch.students_count, 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white p-6">
                                <h3 className="text-lg font-bold mb-3">💡 Quick Tips</h3>
                                <ul className="space-y-2 text-sm text-green-100">
                                    <li>• Set clear instructions in the description</li>
                                    <li>• Randomize questions to prevent cheating</li>
                                    <li>• Give appropriate time for each question</li>
                                    <li>• Test your quiz before publishing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Manage Quizzes Section */
                    <div className="space-y-6">
                        {/* Quiz Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                        <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-green-600">{quizzes.length}</p>
                                        <p className="text-sm text-gray-600">Total Quizzes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                        <PlayIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {quizzes.filter(q => q.status === 'active').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Active Quizzes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                        <ChartBarIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {quizzes.reduce((total, quiz) => total + quiz.attempts_count, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Attempts</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                                        <ClockIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {Math.round(quizzes.reduce((total, quiz) => total + quiz.duration, 0) / quizzes.length) || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">Avg Duration</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quiz List */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-900">Quiz List</h3>
                            </div>
                            
                            {quizzes.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {quizzes.map((quiz, index) => (
                                        <div key={quiz.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">{quiz.title}</h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(quiz.status)}`}>
                                                            {getStatusIcon(quiz.status)}
                                                            <span className="ml-1 capitalize">{quiz.status}</span>
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mb-3">{quiz.description}</p>
                                                    
                                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <UserGroupIcon className="w-4 h-4 mr-1" />
                                                            {quiz.batch.name}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <ClipboardDocumentListIcon className="w-4 h-4 mr-1" />
                                                            {quiz.questions_count} questions
                                                        </div>
                                                        <div className="flex items-center">
                                                            <ChartBarIcon className="w-4 h-4 mr-1" />
                                                            {quiz.attempts_count} attempts
                                                        </div>
                                                        <div className="flex items-center">
                                                            <ClockIcon className="w-4 h-4 mr-1" />
                                                            {quiz.duration} min
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2 ml-6">
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                                                        <DocumentDuplicateIcon className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                                    <p className="text-gray-500 mb-6">Create your first quiz to get started with assessments.</p>
                                    <button
                                        onClick={() => setActiveTab('create')}
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
                                    >
                                        <PlusIcon className="w-5 h-5 inline mr-2" />
                                        Create Your First Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Create;