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
  Trash2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  classes: {
    data: Class[];
    links: any;
    meta: any;
  };
  stats: Stats;
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function ClassesIndex() {
  // Mock data for demonstration
  const mockClasses = {
    data: [
      {
        id: 1,
        title: "Advanced React Concepts",
        description: "Deep dive into React hooks, context, and performance optimization",
        scheduled_at: "2025-06-18T10:00:00",
        duration_minutes: 90,
        status: 'scheduled' as const,
        zoom_link: "https://zoom.us/j/123456789",
        batch: { id: 1, name: "Frontend Batch A", student_count: 25 },
        created_at: "2025-06-15T08:00:00",
        updated_at: "2025-06-16T10:30:00"
      },
      {
        id: 2,
        title: "Database Design Principles",
        description: "Learn about normalization, indexing, and query optimization",
        scheduled_at: "2025-06-17T14:00:00",
        duration_minutes: 120,
        status: 'live' as const,
        zoom_link: "https://zoom.us/j/987654321",
        batch: { id: 2, name: "Backend Batch B", student_count: 18 },
        created_at: "2025-06-10T09:00:00",
        updated_at: "2025-06-17T13:45:00"
      },
      {
        id: 3,
        title: "Introduction to TypeScript",
        description: "Getting started with TypeScript for better code quality",
        scheduled_at: "2025-06-16T16:00:00",
        duration_minutes: 75,
        status: 'completed' as const,
        zoom_link: null,
        batch: { id: 1, name: "Frontend Batch A", student_count: 25 },
        created_at: "2025-06-12T11:00:00",
        updated_at: "2025-06-16T17:30:00"
      }
    ],
    links: [],
    meta: {}
  };

  const mockStats = {
    total_classes: 45,
    upcoming_classes: 12,
    completed_classes: 30,
    classes_today: 3
  };

  const mockAuth = {
    user: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@microlms.com",
      role: "teacher"
    }
  };

  const classes = mockClasses;
  const stats = mockStats;
  const auth = mockAuth;
  const flash = undefined;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        return { icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Scheduled' };
      case 'live':
        return { icon: Play, color: 'text-red-600 bg-red-50 border-red-200', text: 'Live' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', text: 'Completed' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-gray-600 bg-gray-50 border-gray-200', text: 'Cancelled' };
      case 'rescheduled':
        return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', text: 'Rescheduled' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-50 border-gray-200', text: status };
    }
  };

  const filteredClasses = classes.data.filter(class_item => {
    const matchesSearch = class_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         class_item.batch.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || class_item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (classId: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      alert(`Delete class ${classId} - Feature would be implemented with backend`);
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

  const handleLogout = () => {
    alert('Logout functionality would be implemented');
  };

  const handleNavigation = (path: string) => {
    alert(`Navigate to: ${path}`);
  };

  const navigationItems = [
    { name: 'Dashboard', icon: BarChart3, href: '/teacher/dashboard', current: false },
    { name: 'Batches', icon: Users, href: '/teacher/batches', current: false },
    { name: 'Classes', icon: Video, href: '/teacher/classes', current: true },
    { name: 'Quizzes', icon: FileText, href: '/teacher/quizzes', current: false },
    { name: 'Attendance', icon: CheckCircle, href: '/teacher/attendance', current: false },
    { name: 'Reports', icon: BarChart3, href: '/teacher/reports', current: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Flash Messages */}
      {flash?.success && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
            {flash.success}
          </div>
        </div>
      )}
      {flash?.error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-3 text-red-600" />
            {flash.error}
          </div>
        </div>
      )}
      
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">MicroLMS</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="md:hidden p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="hidden md:flex items-center space-x-4">
                <button className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-semibold text-green-700">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{auth.user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{auth.user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">MicroLMS</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${
                    item.current
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-lg w-full text-left transition-colors`}
                >
                  <item.icon className={`${item.current ? 'text-green-500' : 'text-gray-400'} mr-3 h-5 w-5`} />
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-4 left-0 right-0 px-2">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-green-700">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{auth.user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{auth.user.role}</p>
                </div>
                <button onClick={handleLogout} className="p-1 text-gray-400 hover:text-gray-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white/90 backdrop-blur-md border-r border-gray-200/50">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-3 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`${
                    item.current
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-lg w-full text-left transition-all duration-200`}
                >
                  <item.icon className={`${item.current ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-5 w-5 transition-colors`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Classes</h1>
                  <p className="mt-2 text-sm text-gray-600">Manage and schedule your classes with ease</p>
                </div>
                <button
                  onClick={() => handleNavigation('/teacher/classes/create')}
                  className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Class
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <Video className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500">Total Classes</dt>
                          <dd className="text-2xl font-bold text-gray-900">{stats.total_classes}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500">Upcoming</dt>
                          <dd className="text-2xl font-bold text-gray-900">{stats.upcoming_classes}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500">Completed</dt>
                          <dd className="text-2xl font-bold text-gray-900">{stats.completed_classes}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500">Today</dt>
                          <dd className="text-2xl font-bold text-gray-900">{stats.classes_today}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl mb-8 border border-gray-200/50">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search classes, descriptions, or batches..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200 min-w-[140px]"
                      >
                        <option value="">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                      <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 bg-gray-50/50 backdrop-blur-sm font-medium">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classes Table */}
              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-gray-200/50">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200/50">
                    <thead className="bg-gray-50/80 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Class Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                      {filteredClasses.map((class_item) => {
                        const StatusIcon = getStatusInfo(class_item.status).icon;
                        return (
                          <tr key={class_item.id} className="hover:bg-gray-50/80 transition-colors duration-200">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-semibold text-gray-900 mb-1">
                                  {class_item.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {class_item.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-3">
                                  <Users className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{class_item.batch.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {class_item.batch.student_count} students
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">
                                {formatDateTime(class_item.scheduled_at)}
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">
                                {formatDuration(class_item.duration_minutes)}
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusInfo(class_item.status).color}`}>
                                <StatusIcon className="h-3 w-3 mr-1.5" />
                                {getStatusInfo(class_item.status).text}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                {canStart(class_item) && class_item.zoom_link && (
                                  <button
                                    onClick={() => handleJoinClass(class_item.zoom_link!)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center font-medium shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Start
                                  </button>
                                )}
                                <button
                                  onClick={() => handleNavigation(`/teacher/classes/${class_item.id}`)}
                                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleNavigation(`/teacher/classes/${class_item.id}/edit`)}
                                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() => setShowDropdown(showDropdown === class_item.id ? null : class_item.id)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {showDropdown === class_item.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20 border border-gray-200/50 backdrop-blur-sm">
                                      <div className="py-2">
                                        {class_item.zoom_link && (
                                          <button
                                            onClick={() => handleJoinClass(class_item.zoom_link!)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                                          >
                                            Join Class
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleNavigation(`/teacher/attendance/${class_item.id}`)}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                                        >
                                          Mark Attendance
                                        </button>
                                        <button
                                          onClick={() => handleDelete(class_item.id)}
                                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                        >
                                          <Trash2 className="h-4 w-4 inline mr-2" />
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

                {filteredClasses.length === 0 && (
                  <div className="text-center py-16 px-6">
                    <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                      {searchTerm || statusFilter 
                        ? 'Try adjusting your search criteria or filter settings to find what you\'re looking for.' 
                        : 'Get started by creating your first class and begin engaging with your students.'}
                    </p>
                    {!searchTerm && !statusFilter && (
                      <button
                        onClick={() => handleNavigation('/teacher/classes/create')}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center mx-auto shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Class
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {classes.links && classes.links.length > 3 && (
                <div className="mt-8 flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm border border-gray-200/50 overflow-hidden backdrop-blur-sm">
                    {classes.links.map((link: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => link.url && handleNavigation(link.url)}
                        disabled={!link.url}
                        className={`relative inline-flex items-center px-4 py-3 border-r border-gray-200/50 text-sm font-medium transition-all duration-200 ${
                          link.active
                            ? 'z-10 bg-green-50 text-green-600 border-green-200'
                            : link.url
                            ? 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        } ${
                          index === classes.links.length - 1 ? 'border-r-0' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}