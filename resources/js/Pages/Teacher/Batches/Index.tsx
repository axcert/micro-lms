import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
  BarChart3,
  Clock,
  Trash2
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
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
}

export default function BatchesIndex({ batches, stats, filters, flash, auth }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

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
    router.get('/teacher/batches/export');
  };

  const handleDeleteBatch = (batchId: number, batchName: string) => {
    if (confirm(`Are you sure you want to delete the batch "${batchName}"? This action cannot be undone.`)) {
      router.delete(`/teacher/batches/${batchId}`);
    }
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
    <>
      <Head title="Batch Management" />
      
      <div className="min-h-screen bg-white">
        {/* Enhanced Header */}
        <div className="bg-white shadow-lg border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/teacher/dashboard"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
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
                <Link
                  href="/teacher/batches/create"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Batch
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Flash Messages */}
          {flash && (
            <div className={`mb-6 rounded-md p-4 ${
              flash.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
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

          {/* Enhanced Stats Cards */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                {stats.total_batches}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Batches</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent mb-1">
                {stats.active_batches}
              </p>
              <p className="text-sm text-gray-600 font-medium">Active Batches</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                {stats.total_students}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                {stats.total_classes}
              </p>
              <p className="text-sm text-gray-600 font-medium">Classes This Week</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search batches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="starting_soon">Starting Soon</option>
                </select>
                
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Batches List */}
          <div className="bg-white shadow-xl rounded-xl border border-green-100 overflow-hidden">
            {batches.data.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No batches found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter 
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first batch."
                  }
                </p>
                {!searchTerm && !statusFilter && (
                  <div className="mt-6">
                    <Link
                      href="/teacher/batches/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Create Your First Batch
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {batches.data.map((batch) => {
                  const statusInfo = getStatusInfo(batch);
                  
                  return (
                    <li key={batch.id} className="hover:bg-green-50 transition-colors">
                      <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
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
                                <Link
                                  href={`/teacher/batches/${batch.id}`}
                                  className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:from-green-700 hover:to-green-800 truncate"
                                >
                                  {batch.name}
                                </Link>
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
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-3 ml-6">
                            <Link
                              href={`/teacher/batches/${batch.id}`}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                            
                            <Link
                              href={`/teacher/batches/${batch.id}/edit`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDeleteBatch(batch.id, batch.name)}
                              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Pagination */}
          {batches.meta && batches.meta.last_page > 1 && (
            <div className="mt-6 bg-white px-6 py-4 flex items-center justify-between border border-green-100 rounded-xl shadow-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => batches.links[0]?.url && router.get(batches.links[0].url)}
                  disabled={!batches.links[0]?.url}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => batches.links[batches.links.length - 1]?.url && router.get(batches.links[batches.links.length - 1].url)}
                  disabled={!batches.links[batches.links.length - 1]?.url}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          link.active
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } ${
                          index === 0 ? 'rounded-l-lg' : ''
                        } ${
                          index === batches.links.length - 1 ? 'rounded-r-lg' : ''
                        } disabled:opacity-50`}
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
    </>
  );
}