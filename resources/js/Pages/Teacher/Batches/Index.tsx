import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Users, 
  Plus, 
  BookOpen, 
  Calendar, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  ArrowLeft,
  FileText,
  BarChart3
} from 'lucide-react';

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
}

export default function BatchesIndex({ batches, stats, filters, flash }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  // ✅ FIXED: Real navigation functions with Inertia router
  const handleSearch = () => {
    router.get('/teacher/batches', {
      search: searchTerm,
      status: statusFilter
    }, {
      preserveState: true,
      replace: true
    });
  };

  const handleExport = () => {
    window.open('/teacher/batches/export', '_blank');
  };

  const handleCreateBatch = () => {
    router.visit('/teacher/batches/create');  // ✅ REAL NAVIGATION
  };

  const handleViewBatch = (batchId: number) => {
    router.visit(`/teacher/batches/${batchId}`);  // ✅ REAL NAVIGATION
  };

  const handleEditBatch = (batchId: number) => {
    router.visit(`/teacher/batches/${batchId}/edit`);  // ✅ REAL NAVIGATION
  };

  const handleBackToDashboard = () => {
    router.visit('/teacher/dashboard');  // ✅ REAL NAVIGATION
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusInfo = (batch: Batch) => {
    if (!batch.is_active) {
      return { text: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
    
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
  };

  return (
    <div className="min-h-screen bg-white">
      <Head title="Batch Management" />
      
      {/* Enhanced Header - Better Alignment */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 lg:py-6">
            {/* Mobile and Tablet Layout */}
            <div className="flex flex-col space-y-4 lg:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <button 
                  onClick={handleBackToDashboard}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Back to Dashboard
                </button>
                
                <div className="flex space-x-3 sm:space-x-4">
                  <button
                    onClick={handleExport}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  <button
                    onClick={handleCreateBatch}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                    Batch Management
                  </h1>
                  <p className="text-sm text-gray-600 truncate">Manage your student batches</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={handleBackToDashboard}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <div className="h-6 border-l border-gray-300"></div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent">
                      Batch Management
                    </h1>
                    <p className="text-gray-600">Manage your student batches and track their progress</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleCreateBatch}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flash Messages - Better Alignment */}
        {flash && (
          <div className={`mb-6 rounded-xl p-4 border-2 ${
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
                <p className={`text-sm font-medium ${
                  flash.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {flash.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards - Fully Responsive */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
              {stats.total_batches}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Batches</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent mb-1">
              {stats.active_batches}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Active Batches</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
              {stats.total_students}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Students</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
              {stats.total_classes}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Classes This Week</p>
          </div>
        </div>

        {/* Search and Filters - Better Alignment */}
        <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-green-100">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Batches</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="starting_soon">Starting Soon</option>
              </select>
            </div>
            
            <div className="sm:w-auto">
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Batches List */}
        <div className="bg-white shadow-xl rounded-xl border border-green-100 overflow-hidden">
          {batches.data.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">No batches found</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                {searchTerm || statusFilter 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first batch."
                }
              </p>
              {!searchTerm && !statusFilter && (
                <div className="mt-4 sm:mt-6">
                  <button
                    onClick={handleCreateBatch}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Create Your First Batch
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {batches.data.map((batch) => {
                const statusInfo = getStatusInfo(batch);
                
                return (
                  <li key={batch.id} className="hover:bg-green-50 transition-colors">
                    <div className="px-4 sm:px-6 py-6">
                      {/* Mobile Layout */}
                      <div className="block lg:hidden">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                              batch.is_active ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-100'
                            }`}>
                              <BookOpen className={`h-6 w-6 ${
                                batch.is_active ? 'text-white' : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <button
                                onClick={() => handleViewBatch(batch.id)}
                                className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:to-green-800 text-left"
                              >
                                {batch.name}
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                              {batch.is_full && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Full
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {batch.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                          <div className="flex items-center">
                            <Users className="flex-shrink-0 mr-2 h-4 w-4 text-green-500" />
                            <span className="font-medium text-gray-700 truncate">
                              {batch.students_count} student{batch.students_count !== 1 ? 's' : ''}
                              {batch.max_students && <span className="text-gray-400">/{batch.max_students}</span>}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{formatDate(batch.start_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="flex-shrink-0 mr-2 h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">{batch.classes_count} classes</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="flex-shrink-0 mr-2 h-4 w-4 text-yellow-500" />
                            <span className="text-gray-600">{batch.quizzes_count} quizzes</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewBatch(batch.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditBatch(batch.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        </div>
                      </div>
                      
                      {/* Desktop Layout */}
                      <div className="hidden lg:flex lg:items-center lg:justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                              batch.is_active ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-100'
                            }`}>
                              <BookOpen className={`h-6 w-6 ${
                                batch.is_active ? 'text-white' : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                          
                          <div className="ml-6 min-w-0 flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <button
                                onClick={() => handleViewBatch(batch.id)}
                                className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:to-green-800 truncate text-left"
                              >
                                {batch.name}
                              </button>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                              {batch.is_full && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Full
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 max-w-2xl">
                              {batch.description || 'No description'}
                            </p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="flex-shrink-0 mr-2 h-4 w-4 text-green-500" />
                                <span className="font-medium text-gray-700">
                                  {batch.students_count} student{batch.students_count !== 1 ? 's' : ''}
                                </span>
                                {batch.max_students && (
                                  <span className="text-gray-400 ml-1">/{batch.max_students}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center">
                                <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                Started {formatDate(batch.start_date)}
                              </div>
                              
                              <div className="flex items-center">
                                <FileText className="flex-shrink-0 mr-2 h-4 w-4 text-blue-500" />
                                {batch.classes_count} classes
                              </div>
                              
                              <div className="flex items-center">
                                <BookOpen className="flex-shrink-0 mr-2 h-4 w-4 text-yellow-500" />
                                {batch.quizzes_count} quizzes
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-6">
                          <button
                            onClick={() => handleViewBatch(batch.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </button>
                          
                          <button
                            onClick={() => handleEditBatch(batch.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination - Better Alignment */}
        {batches.meta && batches.meta.last_page > 1 && (
          <div className="mt-6 bg-white px-4 sm:px-6 py-4 border border-green-100 rounded-xl shadow-lg">
            <div className="sm:hidden">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.get(batches.links[0]?.url)}
                  disabled={!batches.links[0]?.url}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {batches.meta.current_page} of {batches.meta.last_page}
                </span>
                <button
                  onClick={() => router.get(batches.links[batches.links.length - 1]?.url)}
                  disabled={!batches.links[batches.links.length - 1]?.url}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{batches.meta.from}</span> to{' '}
                  <span className="font-medium">{batches.meta.to}</span> of{' '}
                  <span className="font-medium">{batches.meta.total}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                  {batches.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                        link.active
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${
                        index === 0 ? 'rounded-l-lg' : ''
                      } ${
                        index === batches.links.length - 1 ? 'rounded-r-lg' : ''
                      } ${
                        !link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
    </div>
  );
}