import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { 
  UsersIcon, 
  PlusIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationCircleIcon
} from '@/Components/UI/Icons';

interface Batch {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  max_students: number | null;
  students_count: number;
  is_full: boolean;
  classes_count: number;
  quizzes_count: number;
  created_at: string;
}

interface Stats {
  total_batches: number;
  active_batches: number;
  total_students: number;
  total_classes: number;
}

interface Props {
  batches: {
    data: Batch[];
    links: any[];
    meta: any;
  };
  stats: Stats;
  filters: {
    search?: string;
    status?: string;
  };
  flash?: {
    type: string;
    message: string;
  };
  // auth might come from props or global data
  auth?: {
    user: any;
  };
}

export default function BatchesIndex({ 
  batches = { data: [], links: [], meta: {} }, 
  stats = { total_batches: 0, active_batches: 0, total_students: 0, total_classes: 0 }, 
  filters = {}, 
  flash,
  auth: propsAuth
}: Props) {
  // Get all page props including global shared data
  const { props: pageProps } = usePage();
  
  // Try to get auth from multiple sources
  const globalAuth = (pageProps as any).auth;
  const authData = propsAuth || globalAuth;
  const user = authData?.user;

  // Enhanced debugging
  console.log('=== BATCH INDEX DEBUG ===');
  console.log('Props auth:', propsAuth);
  console.log('Global auth:', globalAuth);
  console.log('Final auth data:', authData);
  console.log('User:', user);
  console.log('All page props keys:', Object.keys(pageProps));
  console.log('Page props:', pageProps);

  // Safety check for auth with detailed error info
  if (!user) {
    console.error('=== AUTH ERROR DEBUG ===');
    console.error('Props auth:', propsAuth);
    console.error('Global auth:', globalAuth);
    console.error('Available page props:', Object.keys(pageProps));
    console.error('All page props:', pageProps);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h3>
          <p className="text-gray-600 mb-4">Unable to load user information. Please try logging in again.</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Debug info:</p>
            <p>Available props: {Object.keys(pageProps).join(', ')}</p>
            <p>Props auth: {propsAuth ? 'present' : 'missing'}</p>
            <p>Global auth: {globalAuth ? 'present' : 'missing'}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [isLoading, setIsLoading] = useState(false);

  const filteredBatches = (batches?.data || []).filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (batch.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || getStatusInfo(batch).text.toLowerCase() === statusFilter.replace('_', ' ');
    
    return matchesSearch && matchesStatus;
  });

  const handleSearch = () => {
    setIsLoading(true);
    router.get('/teacher/batches', {
      search: searchTerm,
      status: statusFilter
    }, {
      preserveState: true,
      replace: true,
      onFinish: () => setIsLoading(false),
      onError: (errors) => {
        console.error('Search error:', errors);
        setIsLoading(false);
      }
    });
  };

  const handleExport = () => {
    try {
      // Add current filters to export URL
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      
      const exportUrl = '/teacher/batches/export' + (params.toString() ? '?' + params.toString() : '');
      window.open(exportUrl, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleCreateBatch = () => {
    setIsLoading(true);
    router.visit('/teacher/batches/create', {
      onFinish: () => setIsLoading(false),
      onError: (errors) => {
        console.error('Navigation error:', errors);
        setIsLoading(false);
      }
    });
  };

  const handleViewBatch = (batchId: number) => {
    setIsLoading(true);
    router.visit(`/teacher/batches/${batchId}`, {
      onFinish: () => setIsLoading(false),
      onError: (errors) => {
        console.error('Navigation error:', errors);
        setIsLoading(false);
      }
    });
  };

  const handleEditBatch = (batchId: number) => {
    setIsLoading(true);
    router.visit(`/teacher/batches/${batchId}/edit`, {
      onFinish: () => setIsLoading(false),
      onError: (errors) => {
        console.error('Navigation error:', errors);
        setIsLoading(false);
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getStatusInfo = (batch: Batch) => {
    if (!batch.is_active) {
      return { text: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
    
    try {
      const today = new Date();
      const startDate = new Date(batch.start_date);
      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return { text: `Starts in ${diffDays} days`, color: 'bg-blue-100 text-blue-800' };
      } else if (diffDays === 0) {
        return { text: 'Starting Today', color: 'bg-green-100 text-green-800' };
      } else {
        return { text: 'Active', color: 'bg-green-100 text-green-800' };
      }
    } catch (error) {
      console.error('Status calculation error:', error);
      return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Header content with create button
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleExport}
        disabled={isLoading}
        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center disabled:opacity-50"
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export
      </button>
      <button
        onClick={handleCreateBatch}
        disabled={isLoading}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {isLoading ? 'Loading...' : 'Create Batch'}
      </button>
    </div>
  );

  return (
    <TeacherLayout 
      user={user} 
      title="Batch Management"
      currentPage="batches"
      headerContent={headerContent}
      pageDescription="Manage your student batches and track their progress"
    >
      <Head title="Batch Management" />

      <div className="space-y-8">
        {/* Flash Messages */}
        {flash && (
          <div className={`rounded-2xl p-4 border-2 ${
            flash.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${
                flash.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {flash.type === 'success' ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`font-semibold ${
                  flash.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {flash.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {stats.total_batches}
            </p>
            <p className="text-gray-600 font-semibold">Total Batches</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {stats.active_batches}
            </p>
            <p className="text-gray-600 font-semibold">Active Batches</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {stats.total_students}
            </p>
            <p className="text-gray-600 font-semibold">Total Students</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {stats.total_classes}
            </p>
            <p className="text-gray-600 font-semibold">Classes This Week</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Search Batches
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full border-2 rounded-2xl pl-12 pr-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 border-gray-200 bg-white"
                />
              </div>
            </div>
            
            <div className="lg:w-64">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 border-gray-200 bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="starting_soon">Starting Soon</option>
              </select>
            </div>
            
            <div className="lg:w-auto">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full lg:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                {isLoading ? 'Searching...' : 'Apply Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Batches List */}
        <div className="bg-white shadow-xl rounded-2xl border-2 border-gray-100 overflow-hidden">
          {filteredBatches.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No batches found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first batch."
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button
                  onClick={handleCreateBatch}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto disabled:opacity-50"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Batch
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBatches.map((batch) => {
                const statusInfo = getStatusInfo(batch);
                
                return (
                  <div key={batch.id} className="p-6 hover:bg-green-50 transition-all duration-200">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${
                            batch.is_active 
                              ? 'bg-gradient-to-br from-green-500 to-green-600' 
                              : 'bg-gray-100'
                          }`}>
                            <BookOpenIcon className={`h-7 w-7 ${
                              batch.is_active ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <button
                              onClick={() => handleViewBatch(batch.id)}
                              disabled={isLoading}
                              className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:to-green-800 text-left disabled:opacity-50"
                            >
                              {batch.name}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {batch.is_full && (
                              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-orange-100 text-orange-800">
                                Full
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {batch.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center space-x-3">
                          <UsersIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                          <span className="font-semibold text-gray-700">
                            {batch.students_count} student{batch.students_count !== 1 ? 's' : ''}
                            {batch.max_students && <span className="text-gray-400">/{batch.max_students}</span>}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CalendarIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">{formatDate(batch.start_date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="flex-shrink-0 h-5 w-5 text-blue-500" />
                          <span className="text-gray-600">{batch.classes_count} classes</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <BookOpenIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                          <span className="text-gray-600">{batch.quizzes_count} quizzes</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewBatch(batch.id)}
                          disabled={isLoading}
                          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditBatch(batch.id)}
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-center lg:justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            batch.is_active 
                              ? 'bg-gradient-to-br from-green-500 to-green-600' 
                              : 'bg-gray-100'
                          }`}>
                            <BookOpenIcon className={`h-8 w-8 ${
                              batch.is_active ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                        </div>
                        
                        <div className="ml-6 min-w-0 flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <button
                              onClick={() => handleViewBatch(batch.id)}
                              disabled={isLoading}
                              className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:to-green-800 text-left disabled:opacity-50"
                            >
                              {batch.name}
                            </button>
                            <span className={`inline-flex items-center px-4 py-1 rounded-xl text-sm font-semibold ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {batch.is_full && (
                              <span className="inline-flex items-center px-4 py-1 rounded-xl text-sm font-semibold bg-orange-100 text-orange-800">
                                Full
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4 max-w-2xl">
                            {batch.description || 'No description'}
                          </p>
                          
                          <div className="flex items-center space-x-8 text-sm">
                            <div className="flex items-center space-x-2">
                              <UsersIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                              <span className="font-semibold text-gray-700">
                                {batch.students_count} student{batch.students_count !== 1 ? 's' : ''}
                              </span>
                              {batch.max_students && (
                                <span className="text-gray-400">/{batch.max_students}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                              <span className="text-gray-600">Started {formatDate(batch.start_date)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <DocumentTextIcon className="flex-shrink-0 h-5 w-5 text-blue-500" />
                              <span className="text-gray-600">{batch.classes_count} classes</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <BookOpenIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                              <span className="text-gray-600">{batch.quizzes_count} quizzes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 ml-6">
                        <button
                          onClick={() => handleViewBatch(batch.id)}
                          disabled={isLoading}
                          className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center disabled:opacity-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        
                        <button
                          onClick={() => handleEditBatch(batch.id)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center disabled:opacity-50"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {batches.meta && batches.meta.last_page && batches.meta.last_page > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 px-6 py-4">
            <div className="sm:hidden">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.get(batches.links[0]?.url)}
                  disabled={!batches.links[0]?.url || isLoading}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 font-semibold">
                  Page {batches.meta.current_page} of {batches.meta.last_page}
                </span>
                <button
                  onClick={() => router.get(batches.links[batches.links.length - 1]?.url)}
                  disabled={!batches.links[batches.links.length - 1]?.url || isLoading}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{batches.meta.from}</span> to{' '}
                  <span className="font-semibold">{batches.meta.to}</span> of{' '}
                  <span className="font-semibold">{batches.meta.total}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                  {batches.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url || isLoading}
                      className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-semibold transition-all duration-200 ${
                        link.active
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      } ${
                        index === 0 ? 'rounded-l-xl' : ''
                      } ${
                        index === batches.links.length - 1 ? 'rounded-r-xl' : ''
                      } ${
                        !link.url || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}