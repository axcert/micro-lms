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
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

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
  auth?: {
    user: User;
  };
  quizzes?: {
    data: Quiz[];
    links: any[];
    meta: any;
  };
  stats?: Stats;
  batches?: Batch[];
  filters?: {
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
  auth = { user: { id: 0, name: 'Teacher', email: 'teacher@example.com' } },
  quizzes = { data: [], meta: { from: 0, to: 0, total: 0 }, links: [] }, 
  stats = { total_quizzes: 0, active_quizzes: 0, draft_quizzes: 0, total_attempts: 0 }, 
  batches = [], 
  filters = {},
  flash = {}
}: QuizIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [batchFilter, setBatchFilter] = useState(filters.batch_id || '');
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Ensure we have safe data structures
  const safeQuizzes = quizzes || { data: [], meta: { from: 0, to: 0, total: 0 }, links: [] };
  const safeStats = stats || { total_quizzes: 0, active_quizzes: 0, draft_quizzes: 0, total_attempts: 0 };
  const safeBatches = batches || [];

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

  // Header content with action buttons
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-green-200 rounded-xl shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </button>
      <button
        type="button"
        onClick={() => router.visit('/teacher/quizzes/create')}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Create Quiz
      </button>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title="Quiz Management" 
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription="Create and manage assessments for your students"
    >
      <Head title="Quiz Management" />
      
      <div className="space-y-6">
        {/* Flash Messages */}
        {flash?.success && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-200">
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

        {flash?.error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200">
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileQuestion className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Quizzes
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {safeStats.total_quizzes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {safeStats.active_quizzes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Drafts
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {safeStats.draft_quizzes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Attempts
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {safeStats.total_attempts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-xl transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={batchFilter}
              onChange={(e) => handleFilterChange('batch_id', e.target.value)}
              className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-xl transition-all duration-200"
            >
              <option value="">All Batches</option>
              {safeBatches.map(batch => (
                <option key={batch.id} value={batch.id.toString()}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </button>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden rounded-2xl border border-gray-100">
          {(!safeQuizzes.data || safeQuizzes.data.length === 0) ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No quizzes found</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                {Object.values(filters).some(f => f) 
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "Get started by creating your first quiz to assess your students."
                }
              </p>
              {!Object.values(filters).some(f => f) && (
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => router.visit('/teacher/quizzes/create')}
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create Your First Quiz
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {safeQuizzes.data.map((quiz) => {
                const statusInfo = getStatusInfo(quiz.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <li key={quiz.id} className="hover:bg-green-50/50 transition-colors duration-200">
                    <div className="px-6 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${
                              quiz.status === 'active' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                              quiz.status === 'draft' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' :
                              'bg-gradient-to-br from-gray-100 to-gray-200'
                            }`}>
                              <StatusIcon className={`h-6 w-6 ${
                                quiz.status === 'active' ? 'text-green-600' :
                                quiz.status === 'draft' ? 'text-yellow-600' :
                                'text-gray-400'
                              }`} />
                            </div>
                          </div>
                          
                          <div className="ml-6 min-w-0 flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <button
                                type="button"
                                onClick={() => handleQuizAction('view', quiz.id)}
                                className="text-lg font-semibold text-gray-900 hover:text-green-600 truncate text-left transition-colors duration-200"
                              >
                                {quiz.title}
                              </button>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                              {!quiz.is_available && quiz.status === 'active' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Scheduled
                                </span>
                              )}
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 truncate">
                                {quiz.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {quiz.batch?.name || 'No batch'} • Created {formatDate(quiz.created_at)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FileQuestion className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {quiz.questions_count || 0} questions
                              </div>
                              
                              <div className="flex items-center">
                                <Award className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {quiz.total_marks || 0} marks
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {getDurationText(quiz.duration_minutes)}
                              </div>
                              
                              {quiz.completed_attempts_count > 0 && (
                                <div className="flex items-center">
                                  <TrendingUp className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                  {quiz.completed_attempts_count} attempts ({(quiz.pass_rate || 0).toFixed(1)}% pass rate)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-6">
                          {quiz.status === 'draft' && (quiz.questions_count || 0) > 0 && (
                            <button
                              type="button"
                              onClick={() => handleQuizAction('activate', quiz.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Activate
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => handleQuizAction('view', quiz.id)}
                            className="inline-flex items-center p-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {quiz.can_edit && (
                            <button
                              type="button"
                              onClick={() => handleQuizAction('edit', quiz.id)}
                              className="inline-flex items-center p-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowActionMenu(showActionMenu === quiz.id ? null : quiz.id)}
                              className="inline-flex items-center p-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {showActionMenu === quiz.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  {(quiz.completed_attempts_count || 0) > 0 && (
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
                                  {(quiz.attempts_count || 0) === 0 && (
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
        {safeQuizzes.data && safeQuizzes.data.length > 0 && safeQuizzes.links && (
          <div className="bg-white/70 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-t border-gray-100 rounded-2xl shadow-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              {safeQuizzes.links.find && safeQuizzes.links.find(link => link.label === 'Previous') && (
                <button
                  type="button"
                  onClick={() => {
                    const prevLink = safeQuizzes.links.find(link => link.label === 'Previous');
                    if (prevLink?.url) router.visit(prevLink.url);
                  }}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  disabled={!safeQuizzes.links.find(link => link.label === 'Previous')?.url}
                >
                  Previous
                </button>
              )}
              {safeQuizzes.links.find && safeQuizzes.links.find(link => link.label === 'Next') && (
                <button
                  type="button"
                  onClick={() => {
                    const nextLink = safeQuizzes.links.find(link => link.label === 'Next');
                    if (nextLink?.url) router.visit(nextLink.url);
                  }}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  disabled={!safeQuizzes.links.find(link => link.label === 'Next')?.url}
                >
                  Next
                </button>
              )}
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{safeQuizzes.meta?.from || 0}</span> to{' '}
                  <span className="font-medium">{safeQuizzes.meta?.to || 0}</span> of{' '}
                  <span className="font-medium">{safeQuizzes.meta?.total || 0}</span> results
                </p>
              </div>
              
              {safeQuizzes.links && safeQuizzes.links.length > 0 && (
                <div>
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    {safeQuizzes.links.map((link, index) => {
                      if (link.label === 'Previous' || link.label === 'Next') {
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`relative inline-flex items-center px-2 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200 ${
                              index === 0 ? 'rounded-l-xl' : ''
                            } ${
                              index === safeQuizzes.links.length - 1 ? 'rounded-r-xl' : ''
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                            link.active
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}