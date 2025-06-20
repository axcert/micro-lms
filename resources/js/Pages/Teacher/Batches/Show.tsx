import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeftIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon, 
  BookOpenIcon, 
  PencilIcon, 
  VideoIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  Bars3Icon,
  ChartBarIcon,
  DocumentTextIcon,
  XCircleIcon
} from '@/Components/UI/Icons';
import TeacherSidebar from '@/Components/Layout/TeacherSidebar';

interface Student {
  id: number;
  name: string;
  email: string;
  enrolled_at?: string;
}

interface Class {
  id: number;
  title: string;
  scheduled_at: string;
  zoom_link: string | null;
  status: string;
}

interface Quiz {
  id: number;
  title: string;
  questions_count: number;
  attempts_count: number;
  created_at: string;
  status: string;
}

interface Batch {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  max_students: number | null;
  is_active: boolean;
  students_count?: number;
  students: Student[];
  teacher: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Auth {
  user: User;
}

interface BatchShowProps {
  batch: Batch;
  recentClasses?: Class[];
  recentQuizzes?: Quiz[];
  auth?: Auth;
  user?: User;
  stats: {
    students_count: number;
    classes_count: number;
    quizzes_count: number;
  };
  flash?: {
    type: string;
    message: string;
  };
}

export default function BatchShow({ 
  batch, 
  recentClasses = [], 
  recentQuizzes = [], 
  auth,
  user,
  stats,
  flash 
}: BatchShowProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'activity'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ FIXED: Extract user from auth or use direct user prop with fallback
  const currentUser = auth?.user || user || { 
    id: 0, 
    name: 'Unknown User', 
    email: 'unknown@example.com', 
    role: 'teacher' 
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // ✅ FIXED: Real navigation functions
  const handleEdit = () => {
    router.visit(`/teacher/batches/${batch.id}/edit`);
  };

  const handleBackToBatches = () => {
    router.visit('/teacher/batches');
  };

  const handleScheduleClass = () => {
    router.visit('/teacher/classes/create', {
      data: { batch_id: batch.id }
    });
  };

  const handleCreateQuiz = () => {
    router.visit('/teacher/quizzes/create', {
      data: { batch_id: batch.id }
    });
  };

  const handleRemoveStudent = (studentId: number, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from this batch?`)) {
      router.delete(`/teacher/batches/${batch.id}/students/${studentId}`, {
        onSuccess: () => {
          // Page will reload with updated data
        }
      });
    }
  };

  const handleManageStudents = () => {
    router.visit(`/teacher/batches/${batch.id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium";
    
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-500`;
      case 'active':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-500`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-500`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
      <Head title={`${batch.name} - Batch Details`} />
      
      {/* Sidebar */}
      <TeacherSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
        currentPage="batches"
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleBackToBatches}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Back to Batches
                </button>
                <div className="h-6 w-px bg-gray-100"></div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-black">{batch.name}</h1>
                  <p className="text-gray-500 mt-1">{batch.description || 'No description provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  batch.is_active 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {batch.is_active ? 'Active' : 'Inactive'}
                </div>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-100 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Flash Messages */}
        {flash && (
          <div className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className={`border-l-4 p-4 rounded ${
              flash.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-600' 
                : 'bg-gray-100 border-gray-500 text-gray-800'
            }`}>
              <div className="flex items-center">
                {flash.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                )}
                <p className="font-medium">{flash.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Stats & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <div className="bg-gray-100 rounded-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-500 rounded">
                        <UsersIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-500">Students</span>
                    </div>
                    <span className="text-lg font-bold text-black">
                      {stats.students_count}
                      {batch.max_students && (
                        <span className="text-sm text-gray-500 font-normal">/{batch.max_students}</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-600 rounded">
                        <VideoIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-500">Classes</span>
                    </div>
                    <span className="text-lg font-bold text-black">{stats.classes_count}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-400 rounded">
                        <ClipboardDocumentListIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-500">Quizzes</span>
                    </div>
                    <span className="text-lg font-bold text-black">{stats.quizzes_count}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Duration</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatDate(batch.start_date)}
                      {batch.end_date && (
                        <div className="text-xs text-gray-500 mt-1">
                          to {formatDate(batch.end_date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleScheduleClass}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <VideoIcon className="h-5 w-5 mr-2" />
                  Schedule Class
                </button>
                
                <button
                  onClick={handleCreateQuiz}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  Create Quiz
                </button>
                
                <button
                  onClick={handleManageStudents}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors font-medium"
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Manage Students
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Simple Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Information</span>
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'students'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Students</span>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                    {stats.students_count}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'activity'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ChartBarIcon className="h-4 w-4" />
                  <span>Activity</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Batch Details */}
                  <div className="bg-white border border-gray-100 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800">Batch Details</h3>
                    </div>
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                          <p className="text-gray-800 font-medium">{formatDate(batch.start_date)}</p>
                        </div>
                        {batch.end_date && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">End Date</label>
                            <p className="text-gray-800 font-medium">{formatDate(batch.end_date)}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Maximum Students</label>
                          <p className="text-gray-800 font-medium">{batch.max_students || 'No limit'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            batch.is_active 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {batch.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Information */}
                  <div className="bg-white border border-gray-100 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800">Teacher</h3>
                    </div>
                    <div className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {batch.teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{batch.teacher.name}</p>
                          <p className="text-sm text-gray-500">Primary Teacher</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Students ({stats.students_count})
                    </h3>
                    <button
                      onClick={handleManageStudents}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-100 rounded-lg hover:bg-gray-100"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Students
                    </button>
                  </div>
                  
                  {batch.students.length === 0 ? (
                    <div className="text-center py-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-100">
                      <UsersIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No students enrolled</h3>
                      <p className="text-gray-500 mb-6">Get started by adding students to this batch.</p>
                      <button
                        onClick={handleManageStudents}
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Students
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100">
                      {batch.students.map((student) => (
                        <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                              {student.enrolled_at && (
                                <p className="text-xs text-green-600">
                                  Enrolled {formatDate(student.enrolled_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveStudent(student.id, student.name)}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  {/* Recent Classes */}
                  <div className="bg-white border border-gray-100 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <VideoIcon className="h-5 w-5 mr-2 text-green-500" />
                        Recent Classes
                      </h3>
                    </div>
                    
                    {recentClasses.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <VideoIcon className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">No classes scheduled yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {recentClasses.map((classItem) => (
                          <div key={classItem.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-100">
                            <div>
                              <p className="font-medium text-gray-800">{classItem.title}</p>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(classItem.scheduled_at)}
                              </p>
                            </div>
                            <span className={getStatusBadge(classItem.status)}>
                              {classItem.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Quizzes */}
                  <div className="bg-white border border-gray-100 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-green-500" />
                        Recent Quizzes
                      </h3>
                    </div>
                    
                    {recentQuizzes.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <ClipboardDocumentListIcon className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">No quizzes created yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {recentQuizzes.map((quiz) => (
                          <div key={quiz.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-100">
                            <div>
                              <p className="font-medium text-gray-800">{quiz.title}</p>
                              <p className="text-sm text-gray-500">
                                {quiz.questions_count} questions • {quiz.attempts_count} attempts
                              </p>
                            </div>
                            <span className={getStatusBadge(quiz.status)}>
                              {quiz.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}