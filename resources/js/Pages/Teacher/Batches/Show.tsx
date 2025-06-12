import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock, 
  BookOpen, 
  Edit, 
  UserMinus,
  Video,
  FileQuestion,
  TrendingUp,
  Settings,
  Save,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  pivot?: {
    enrolled_at: string;
  };
}

interface Class {
  id: number;
  title: string;
  scheduled_at: string;
  zoom_link: string | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  students_attended?: number;
}

interface Quiz {
  id: number;
  title: string;
  questions_count: number;
  attempts_count: number;
  created_at: string;
  status: 'draft' | 'published' | 'completed';
}

interface Batch {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  max_students: number | null;
  is_active: boolean;
  students_count: number;
  classes_count: number;
  created_at: string;
}

interface ShowBatchProps {
  batch: Batch;
  students: Student[];
  recentClasses: Class[];
  recentQuizzes: Quiz[];
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
}

export default function ShowBatch({ batch, students, recentClasses, recentQuizzes, auth }: ShowBatchProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'activity'>('overview');

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

  const handleRemoveStudent = (studentId: number, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from this batch?`)) {
      router.delete(`/teacher/batches/${batch.id}/students/${studentId}`, {
        onSuccess: () => {
          // Handle success
        }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'ongoing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'published':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getDaysActive = () => {
    const startDate = new Date(batch.start_date);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <>
      <Head title={batch.name} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/teacher/batches"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Batches
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Batch Details</h1>
              </div>
              <div className="text-sm text-gray-500">
                Micro LMS - Teacher Dashboard
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">{batch.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      batch.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {batch.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {batch.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    href={`/teacher/classes/create?batch_id=${batch.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Class
                  </Link>
                  <Link
                    href={`/teacher/quizzes/create?batch_id=${batch.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Create Quiz
                  </Link>
                  <Link
                    href={`/teacher/batches/${batch.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Batch
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Students</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {batch.students_count}
                      {batch.max_students && (
                        <span className="text-sm text-gray-500 font-normal">
                          /{batch.max_students}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Classes</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {batch.classes_count}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileQuestion className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Quizzes</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {recentQuizzes.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Days Active</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {getDaysActive()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'students'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Students ({batch.students_count})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'activity'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Batch Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="text-sm text-gray-900">{formatDate(batch.start_date)}</dd>
                      </div>
                      {batch.end_date && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Date</dt>
                          <dd className="text-sm text-gray-900">{formatDate(batch.end_date)}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Maximum Students</dt>
                        <dd className="text-sm text-gray-900">
                          {batch.max_students || 'No limit'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                        <dd className="text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {batch.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href={`/teacher/classes/create?batch_id=${batch.id}`}
                        className="flex items-center w-full p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Video className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Schedule a Class</p>
                          <p className="text-xs text-gray-500">Create a new Zoom class for this batch</p>
                        </div>
                      </Link>
                      
                      <Link
                        href={`/teacher/quizzes/create?batch_id=${batch.id}`}
                        className="flex items-center w-full p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                      >
                        <FileQuestion className="h-5 w-5 text-yellow-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Create a Quiz</p>
                          <p className="text-xs text-gray-500">Add questions and assessments</p>
                        </div>
                      </Link>
                      
                      <Link
                        href={`/teacher/batches/${batch.id}/edit`}
                        className="flex items-center w-full p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Settings className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Manage Batch</p>
                          <p className="text-xs text-gray-500">Edit details and student assignments</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Students ({batch.students_count})
                      </h3>
                      <Link
                        href={`/teacher/batches/${batch.id}/students/create`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Students
                      </Link>
                    </div>
                  </div>
                  
                  {students.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No students assigned</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add students to this batch to get started.
                      </p>
                      <div className="mt-6">
                        <Link
                          href={`/teacher/batches/${batch.id}/students/create`}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Students
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {students.map((student) => (
                        <div key={student.id} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {student.pivot?.enrolled_at && (
                              <span className="text-xs text-gray-500">
                                Enrolled {formatDate(student.pivot.enrolled_at)}
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveStudent(student.id, student.name)}
                              className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Classes */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Recent Classes</h3>
                        <Link
                          href={`/teacher/classes?batch_id=${batch.id}`}
                          className="text-sm text-purple-600 hover:text-purple-500"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                    
                    {recentClasses.length === 0 ? (
                      <div className="text-center py-8">
                        <Video className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No classes scheduled yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {recentClasses.map((class_item) => (
                          <div key={class_item.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{class_item.title}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDateTime(class_item.scheduled_at)}
                                </p>
                                {class_item.students_attended !== undefined && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {class_item.students_attended} students attended
                                  </p>
                                )}
                              </div>
                              <span className={getStatusBadge(class_item.status)}>
                                {class_item.status.charAt(0).toUpperCase() + class_item.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Quizzes */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Recent Quizzes</h3>
                        <Link
                          href={`/teacher/quizzes?batch_id=${batch.id}`}
                          className="text-sm text-purple-600 hover:text-purple-500"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                    
                    {recentQuizzes.length === 0 ? (
                      <div className="text-center py-8">
                        <FileQuestion className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No quizzes created yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {recentQuizzes.map((quiz) => (
                          <div key={quiz.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                                <p className="text-xs text-gray-500">
                                  {quiz.questions_count} questions • {quiz.attempts_count} attempts
                                </p>
                              </div>
                              <span className={getStatusBadge(quiz.status)}>
                                {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}