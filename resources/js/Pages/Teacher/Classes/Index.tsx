import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Play,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

interface Batch {
  id: number;
  name: string;
}

interface Class {
  id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
  zoom_join_url: string | null;
  zoom_start_url: string | null;
  attendance_count: number;
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
  is_upcoming: boolean;
  can_start: boolean;
  formatted_duration: string;
}

interface Stats {
  total_classes: number;
  upcoming_classes: number;
  completed_classes: number;
  classes_today: number;
}

export default function TeacherClassesIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Mock data
  const stats: Stats = {
    total_classes: 48,
    upcoming_classes: 12,
    completed_classes: 32,
    classes_today: 3
  };

  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning" },
    { id: 2, name: "Physics Grade 11 - Afternoon" },
    { id: 3, name: "Chemistry Grade 12 - Evening" },
    { id: 4, name: "Biology Grade 9 - Morning" }
  ];

  const mockClasses: Class[] = [
    {
      id: 1,
      title: "Quadratic Equations - Advanced Problems",
      description: "Solving complex quadratic equations and real-world applications",
      scheduled_at: "2024-06-05T10:00:00Z",
      duration_minutes: 90,
      status: "scheduled",
      zoom_join_url: "https://zoom.us/j/123456789",
      zoom_start_url: "https://zoom.us/s/123456789",
      attendance_count: 0,
      batch: { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
      is_upcoming: true,
      can_start: false,
      formatted_duration: "1h 30m"
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      description: "Understanding the three fundamental laws of motion",
      scheduled_at: "2024-06-04T14:30:00Z",
      duration_minutes: 60,
      status: "live",
      zoom_join_url: "https://zoom.us/j/987654321",
      zoom_start_url: "https://zoom.us/s/987654321",
      attendance_count: 23,
      batch: { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
      is_upcoming: false,
      can_start: false,
      formatted_duration: "1h"
    },
    {
      id: 3,
      title: "Organic Chemistry Basics",
      description: "Introduction to carbon compounds and functional groups",
      scheduled_at: "2024-06-03T18:00:00Z",
      duration_minutes: 75,
      status: "completed",
      zoom_join_url: null,
      zoom_start_url: null,
      attendance_count: 18,
      batch: { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 },
      is_upcoming: false,
      can_start: false,
      formatted_duration: "1h 15m"
    },
    {
      id: 4,
      title: "Cell Structure and Function",
      description: "Exploring the basic unit of life - the cell",
      scheduled_at: "2024-06-06T09:00:00Z",
      duration_minutes: 45,
      status: "scheduled",
      zoom_join_url: "https://zoom.us/j/456789123",
      zoom_start_url: "https://zoom.us/s/456789123",
      attendance_count: 0,
      batch: { id: 4, name: "Biology Grade 9 - Morning", student_count: 22 },
      is_upcoming: true,
      can_start: true,
      formatted_duration: "45m"
    },
    {
      id: 5,
      title: "Algebra Review Session",
      description: "Review of key algebraic concepts before the exam",
      scheduled_at: "2024-06-02T11:00:00Z",
      duration_minutes: 120,
      status: "cancelled",
      zoom_join_url: null,
      zoom_start_url: null,
      attendance_count: 0,
      batch: { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
      is_upcoming: false,
      can_start: false,
      formatted_duration: "2h"
    }
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: Clock, color: 'text-blue-600 bg-blue-100', text: 'Scheduled' };
      case 'live':
        return { icon: Play, color: 'text-red-600 bg-red-100', text: 'Live' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100', text: 'Completed' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-gray-600 bg-gray-100', text: 'Cancelled' };
      case 'rescheduled':
        return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100', text: 'Rescheduled' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-100', text: status };
    }
  };

  const filteredClasses = mockClasses.filter(class_item => {
    const matchesSearch = class_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.batch.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || class_item.status === statusFilter;
    const matchesBatch = !batchFilter || class_item.batch.id.toString() === batchFilter;
    
    return matchesSearch && matchesStatus && matchesBatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Batches
                </a>
                <a href="#" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Video className="text-purple-500 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <BookOpen className="text-gray-400 mr-3 h-5 w-5" />
                  Quizzes
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
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
                      My Classes
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Schedule and manage your online classes
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
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Schedule Class
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                <div className="mb-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Class "Quadratic Equations" scheduled successfully!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Video className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Classes
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.total_classes}
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
                          <Clock className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Upcoming
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.upcoming_classes}
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
                              Completed
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.completed_classes}
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
                          <Calendar className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Today
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.classes_today}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search classes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <select
                      value={batchFilter}
                      onChange={(e) => setBatchFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Batches</option>
                      {mockBatches.map(batch => (
                        <option key={batch.id} value={batch.id.toString()}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="From date"
                      />
                    </div>
                  </div>
                </div>

                {/* Classes List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {filteredClasses.length === 0 ? (
                    <div className="text-center py-12">
                      <Video className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || statusFilter || batchFilter 
                          ? "Try adjusting your search or filter criteria."
                          : "Get started by scheduling your first class."
                        }
                      </p>
                      {!searchTerm && !statusFilter && !batchFilter && (
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            Schedule Your First Class
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredClasses.map((class_item) => {
                        const statusInfo = getStatusInfo(class_item.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <li key={class_item.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center min-w-0 flex-1">
                                  <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                      class_item.status === 'live' ? 'bg-red-100' :
                                      class_item.status === 'completed' ? 'bg-green-100' :
                                      class_item.status === 'cancelled' ? 'bg-gray-100' :
                                      'bg-purple-100'
                                    }`}>
                                      <StatusIcon className={`h-5 w-5 ${
                                        class_item.status === 'live' ? 'text-red-600' :
                                        class_item.status === 'completed' ? 'text-green-600' :
                                        class_item.status === 'cancelled' ? 'text-gray-400' :
                                        'text-purple-600'
                                      }`} />
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4 min-w-0 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        className="text-sm font-medium text-gray-900 hover:text-purple-600 truncate text-left"
                                      >
                                        {class_item.title}
                                      </button>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.text}
                                      </span>
                                      {class_item.can_start && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Can Start
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 truncate">
                                        {class_item.description}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {class_item.batch.name}
                                      </p>
                                    </div>
                                    
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {formatDateTime(class_item.scheduled_at)}
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {class_item.formatted_duration}
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {class_item.attendance_count}/{class_item.batch.student_count} attended
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                  {class_item.can_start && class_item.zoom_start_url && (
                                    <button
                                      type="button"
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Start
                                    </button>
                                  )}
                                  
                                  <button
                                    type="button"
                                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  
                                  <button
                                    type="button"
                                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
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
                <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredClasses.length}</span> of{' '}
                        <span className="font-medium">{filteredClasses.length}</span> results
                      </p>
                    </div>
                    
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          className="z-10 bg-purple-50 border-purple-500 text-purple-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          1
                        </button>
                        <button
                          type="button"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}