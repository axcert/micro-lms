import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  FileQuestion, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Play,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Bell,
  Settings,
  Archive,
  Copy,
  Trash2
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
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
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
  is_available: boolean;
  can_edit: boolean;
  created_at: string;
}

interface Stats {
  total_quizzes: number;
  active_quizzes: number;
  draft_quizzes: number;
  total_attempts: number;
}

interface QuizIndexProps {
  quizzes: {
    data: Quiz[];
    links: any[];
    meta: any;
  };
  stats: Stats;
  batches: Batch[];
  filters: {
    status?: string;
    batch_id?: string;
    search?: string;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function QuizIndex({ 
  quizzes, 
  stats, 
  batches, 
  filters = {},
  flash = {}
}: QuizIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [batchFilter, setBatchFilter] = useState(filters.batch_id || '');
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  const handleSearch = () => {
    router.get('/teacher/quizzes', {
      search: searchTerm,
      status: statusFilter,
      batch_id: batchFilter
    }, {
      preserveState: true,
      replace: true
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = {
      search: searchTerm,
      status: statusFilter,
      batch_id: batchFilter,
      [filterType]: value
    };

    if (filterType === 'status') setStatusFilter(value);
    if (filterType === 'batch_id') setBatchFilter(value);

    router.get('/teacher/quizzes', newFilters, {
      preserveState: true,
      replace: true
    });
  };

  const handleQuizAction = (action: string, quizId: number) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        router.visit(`/teacher/quizzes/${quizId}`);
        break;
      case 'edit':
        router.visit(`/teacher/quizzes/${quizId}/edit`);
        break;
      case 'results':
        router.visit(`/teacher/quizzes/${quizId}/results`);
        break;
      case 'activate':
        router.post(`/teacher/quizzes/${quizId}/activate`);
        break;
      case 'archive':
        router.post(`/teacher/quizzes/${quizId}/archive`);
        break;
      case 'duplicate':
        router.post(`/teacher/quizzes/${quizId}/duplicate`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
          router.delete(`/teacher/quizzes/${quizId}`);
        }
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const getDurationText = (minutes: number | null) => {
    if (!minutes) return 'No time limit';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="My Quizzes" />
      
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
                <a href="/teacher/batches" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Batches
                </a>
                <a href="/teacher/classes" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-gray-400 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="/teacher/quizzes" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-purple-500 mr-3 h-5 w-5" />
                  Quizzes
                </a>
                <a href="/teacher/students" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
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
                <div className="md:flex md:items-center md:justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                      My Quizzes
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Create and manage assessments for your students
                    </p>
                  </div>
                  <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                    <button
                      type="button"
                      onClick={() => router.visit('/teacher/quizzes/create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Create Quiz
                    </button>
                  </div>
                </div>

                {/* Flash Messages */}
                {flash.success && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          {flash.success}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {flash.error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {flash.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileQuestion className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Quizzes
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.total_quizzes}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Active
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.active_quizzes}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Clock className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Drafts
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.draft_quizzes}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Attempts
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.total_attempts}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search quizzes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    
                    <select
                      value={batchFilter}
                      onChange={(e) => handleFilterChange('batch_id', e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Batches</option>
                      {batches.map(batch => (
                        <option key={batch.id} value={batch.id.toString()}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </button>
                  </div>
                </div>

                {/* Quizzes List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {quizzes.data.length === 0 ? (
                    <div className="text-center py-12">
                      <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {Object.values(filters).some(f => f) 
                          ? "Try adjusting your search or filter criteria."
                          : "Get started by creating your first quiz."
                        }
                      </p>
                      {!Object.values(filters).some(f => f) && (
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => router.visit('/teacher/quizzes/create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            Create Your First Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {quizzes.data.map((quiz) => {
                        const statusInfo = getStatusInfo(quiz.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <li key={quiz.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center min-w-0 flex-1">
                                  <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                      quiz.status === 'active' ? 'bg-green-100' :
                                      quiz.status === 'draft' ? 'bg-yellow-100' :
                                      'bg-gray-100'
                                    }`}>
                                      <StatusIcon className={`h-5 w-5 ${
                                        quiz.status === 'active' ? 'text-green-600' :
                                        quiz.status === 'draft' ? 'text-yellow-600' :
                                        'text-gray-400'
                                      }`} />
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4 min-w-0 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleQuizAction('view', quiz.id)}
                                        className="text-sm font-medium text-gray-900 hover:text-purple-600 truncate text-left"
                                      >
                                        {quiz.title}
                                      </button>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.text}
                                      </span>
                                      {!quiz.is_available && quiz.status === 'active' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                          Scheduled
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 truncate">
                                        {quiz.description}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {quiz.batch.name} • Created {formatDate(quiz.created_at)}
                                      </p>
                                    </div>
                                    
                                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <FileQuestion className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {quiz.questions_count} questions
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Award className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {quiz.total_marks} marks
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {getDurationText(quiz.duration_minutes)}
                                      </div>
                                      
                                      {quiz.completed_attempts_count > 0 && (
                                        <div className="flex items-center">
                                          <TrendingUp className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                          {quiz.completed_attempts_count} attempts ({quiz.pass_rate.toFixed(1)}% pass rate)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                  {quiz.status === 'draft' && quiz.questions_count > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuizAction('activate', quiz.id)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Activate
                                    </button>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleQuizAction('view', quiz.id)}
                                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  
                                  {quiz.can_edit && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuizAction('edit', quiz.id)}
                                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                  )}
                                  
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setShowActionMenu(showActionMenu === quiz.id ? null : quiz.id)}
                                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                    
                                    {showActionMenu === quiz.id && (
                                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1">
                                          {quiz.completed_attempts_count > 0 && (
                                            <button
                                              onClick={() => handleQuizAction('results', quiz.id)}
                                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                              <TrendingUp className="h-4 w-4 mr-2" />
                                              View Results
                                            </button>
                                          )}
                                          <button
                                            onClick={() => handleQuizAction('duplicate', quiz.id)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                          </button>
                                          {quiz.status === 'active' && (
                                            <button
                                              onClick={() => handleQuizAction('archive', quiz.id)}
                                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                              <Archive className="h-4 w-4 mr-2" />
                                              Archive
                                            </button>
                                          )}
                                          {quiz.attempts_count === 0 && (
                                            <button
                                              onClick={() => handleQuizAction('delete', quiz.id)}
                                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Pagination */}
                {quizzes.data.length > 0 && (
                  <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {quizzes.links.find(link => link.label === 'Previous') && (
                        <button
                          type="button"
                          onClick={() => router.visit(quizzes.links.find(link => link.label === 'Previous')?.url)}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          disabled={!quizzes.links.find(link => link.label === 'Previous')?.url}
                        >
                          Previous
                        </button>
                      )}
                      {quizzes.links.find(link => link.label === 'Next') && (
                        <button
                          type="button"
                          onClick={() => router.visit(quizzes.links.find(link => link.label === 'Next')?.url)}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          disabled={!quizzes.links.find(link => link.label === 'Next')?.url}
                        >
                          Next
                        </button>
                      )}
                    </div>
                    
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{quizzes.meta.from || 0}</span> to{' '}
                          <span className="font-medium">{quizzes.meta.to || 0}</span> of{' '}
                          <span className="font-medium">{quizzes.meta.total}</span> results
                        </p>
                      </div>
                      
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          {quizzes.links.map((link, index) => {
                            if (link.label === 'Previous' || link.label === 'Next') {
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => link.url && router.visit(link.url)}
                                  disabled={!link.url}
                                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                                    index === 0 ? 'rounded-l-md' : ''
                                  } ${
                                    index === quizzes.links.length - 1 ? 'rounded-r-md' : ''
                                  } ${
                                    !link.url ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {link.label}
                                </button>
                              );
                            }
                            
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => link.url && router.visit(link.url)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  link.active
                                    ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {link.label}
                              </button>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}