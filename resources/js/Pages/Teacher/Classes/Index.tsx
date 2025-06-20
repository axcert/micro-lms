import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { 
  VideoIcon, 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  PlayIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  ChartBarIcon
} from '@/Components/UI/Icons';

interface Batch {
  id: number;
  name: string;
  student_count: number;
}

interface Class {
  id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
  zoom_link: string | null;
  batch: Batch;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total_classes: number;
  upcoming_classes: number;
  completed_classes: number;
  classes_today: number;
}

interface Props {
  classes: {
    data: Class[];
    links: any;
    meta: any;
  };
  stats: Stats;
  auth?: {
    user: any;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function ClassesIndex({ 
  classes = { data: [], links: [], meta: {} }, 
  stats = { total_classes: 0, upcoming_classes: 0, completed_classes: 0, classes_today: 0 }, 
  auth, 
  flash 
}: Props) {
  // Safety check for auth
  if (!auth || !auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h3>
          <p className="text-gray-600 mb-4">Unable to load user information. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: ClockIcon, color: 'bg-blue-100 text-blue-800', text: 'Scheduled' };
      case 'live':
        return { icon: PlayIcon, color: 'bg-red-100 text-red-800', text: 'Live' };
      case 'completed':
        return { icon: CheckCircleIcon, color: 'bg-green-100 text-green-800', text: 'Completed' };
      case 'cancelled':
        return { icon: XCircleIcon, color: 'bg-gray-100 text-gray-800', text: 'Cancelled' };
      case 'rescheduled':
        return { icon: ExclamationCircleIcon, color: 'bg-yellow-100 text-yellow-800', text: 'Rescheduled' };
      default:
        return { icon: ClockIcon, color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  const filteredClasses = (classes?.data || []).filter(class_item => {
    const matchesSearch = class_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.batch.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || class_item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (classId: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      router.delete(`/teacher/classes/${classId}`);
    }
  };

  const canStart = (class_item: Class) => {
    const now = new Date();
    const scheduledTime = new Date(class_item.scheduled_at);
    const timeDiff = scheduledTime.getTime() - now.getTime();
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -30 * 60 * 1000 && class_item.status === 'scheduled';
  };

  const handleJoinClass = (zoomLink: string) => {
    if (zoomLink) {
      window.open(zoomLink, '_blank');
    }
  };

  const handleSearch = () => {
    router.get('/teacher/classes', {
      search: searchTerm,
      status: statusFilter
    }, {
      preserveState: true,
      replace: true
    });
  };

  const handleExport = () => {
    window.open('/teacher/classes/export', '_blank');
  };

  const handleCreateClass = () => {
    router.visit('/teacher/classes/create');
  };

  const handleViewClass = (classId: number) => {
    router.visit(`/teacher/classes/${classId}`);
  };

  const handleEditClass = (classId: number) => {
    router.visit(`/teacher/classes/${classId}/edit`);
  };

  // Header content with create button
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleExport}
        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export
      </button>
      <button
        onClick={handleCreateClass}
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        New Class
      </button>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title="Class Management"
      currentPage="classes"
      headerContent={headerContent}
      pageDescription="Manage and schedule your classes with ease"
    >
      <Head title="Class Management" />

      <div className="space-y-8">
        {/* Flash Messages */}
        {flash?.success && (
          <div className="rounded-2xl bg-green-50 p-6 border-2 border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-semibold">{flash.success}</p>
              </div>
            </div>
          </div>
        )}

        {flash?.error && (
          <div className="rounded-2xl bg-red-50 p-6 border-2 border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-semibold">{flash.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <VideoIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent mb-2">
              {stats.total_classes}
            </p>
            <p className="text-gray-600 font-semibold">Total Classes</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-2">
              {stats.upcoming_classes}
            </p>
            <p className="text-gray-600 font-semibold">Upcoming</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {stats.completed_classes}
            </p>
            <p className="text-gray-600 font-semibold">Completed</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
              {stats.classes_today}
            </p>
            <p className="text-gray-600 font-semibold">Today</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Search Classes
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes, descriptions, or batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full border-2 rounded-2xl pl-12 pr-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 border-gray-200 bg-white"
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
                className="w-full border-2 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 border-gray-200 bg-white"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            
            <div className="lg:w-auto">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white shadow-xl rounded-2xl border-2 border-gray-100 overflow-hidden">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <VideoIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No classes found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first class."
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button
                  onClick={handleCreateClass}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Class
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Class Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredClasses.map((class_item) => {
                    const StatusIcon = getStatusInfo(class_item.status).icon;
                    return (
                      <tr key={class_item.id} className="hover:bg-indigo-50 transition-all duration-200">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">
                              {class_item.title}
                            </div>
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {class_item.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-4">
                              <UsersIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{class_item.batch.name}</div>
                              <div className="text-xs text-gray-500">
                                {class_item.batch.student_count} students
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">
                            {formatDateTime(class_item.scheduled_at)}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">
                            {formatDuration(class_item.duration_minutes)}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getStatusInfo(class_item.status).color}`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {getStatusInfo(class_item.status).text}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            {canStart(class_item) && class_item.zoom_link && (
                              <button
                                onClick={() => handleJoinClass(class_item.zoom_link!)}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm flex items-center font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <PlayIcon className="h-4 w-4 mr-1" />
                                Start
                              </button>
                            )}
                            <button
                              onClick={() => handleViewClass(class_item.id)}
                              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditClass(class_item.id)}
                              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setShowDropdown(showDropdown === class_item.id ? null : class_item.id)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                              >
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </button>
                              {showDropdown === class_item.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl z-20 border-2 border-gray-100">
                                  <div className="py-2">
                                    {class_item.zoom_link && (
                                      <button
                                        onClick={() => handleJoinClass(class_item.zoom_link!)}
                                        className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors font-medium"
                                      >
                                        Join Class
                                      </button>
                                    )}
                                    <button
                                      onClick={() => router.visit(`/teacher/attendance/${class_item.id}`)}
                                      className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors font-medium"
                                    >
                                      Mark Attendance
                                    </button>
                                    <button
                                      onClick={() => handleDelete(class_item.id)}
                                      className="block px-6 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors font-medium"
                                    >
                                      <TrashIcon className="h-4 w-4 inline mr-2" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {classes?.meta && classes.meta.last_page > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 px-6 py-4">
            <div className="sm:hidden">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => classes.links?.[0]?.url && router.get(classes.links[0].url)}
                  disabled={!classes.links?.[0]?.url}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 font-semibold">
                  Page {classes.meta.current_page} of {classes.meta.last_page}
                </span>
                <button
                  onClick={() => classes.links?.[classes.links.length - 1]?.url && router.get(classes.links[classes.links.length - 1].url)}
                  disabled={!classes.links?.[classes.links.length - 1]?.url}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{classes.meta.from}</span> to{' '}
                  <span className="font-semibold">{classes.meta.to}</span> of{' '}
                  <span className="font-semibold">{classes.meta.total}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                  {(classes.links || []).map((link: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url}
                      className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-semibold transition-all duration-200 ${
                        link.active
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      } ${
                        index === 0 ? 'rounded-l-xl' : ''
                      } ${
                        index === (classes.links?.length || 0) - 1 ? 'rounded-r-xl' : ''
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
    </TeacherLayout>
  );
}