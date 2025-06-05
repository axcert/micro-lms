import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Video, 
  Calendar, 
  Clock, 
  Users,
  Edit,
  Play,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  UserCheck,
  UserX,
  ExternalLink,
  BookOpen,
  Bell,
  Settings,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Attendance {
  id: number;
  student_id: number;
  status: 'present' | 'absent' | 'late';
  marked_at: string | null;
  student: Student;
}

interface Batch {
  id: number;
  name: string;
  student_count: number;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface ClassDetail {
  id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';
  zoom_meeting_id: string | null;
  zoom_join_url: string | null;
  zoom_start_url: string | null;
  zoom_password: string | null;
  recording_url: string | null;
  notes: string | null;
  max_attendees: number | null;
  batch: Batch;
  teacher: Teacher;
  attendances: Attendance[];
  can_start: boolean;
  is_upcoming: boolean;
  is_completed: boolean;
  formatted_duration: string;
}

interface AttendanceStats {
  total_students: number;
  present_count: number;
  absent_count: number;
  attendance_rate: number;
}

export default function ClassShow() {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'details'>('overview');
  const [attendanceData, setAttendanceData] = useState<Record<number, 'present' | 'absent' | 'late'>>({});

  // Mock data
  const mockClass: ClassDetail = {
    id: 1,
    title: "Quadratic Equations - Advanced Problems",
    description: "In this session, we'll dive deep into solving complex quadratic equations and explore real-world applications. Students will learn advanced techniques and problem-solving strategies.",
    scheduled_at: "2024-06-05T10:00:00Z",
    duration_minutes: 90,
    status: "scheduled",
    zoom_meeting_id: "123456789",
    zoom_join_url: "https://zoom.us/j/123456789?pwd=abc123",
    zoom_start_url: "https://zoom.us/s/123456789?zak=xyz789",
    zoom_password: "123456",
    recording_url: null,
    notes: "Please bring calculators and notebooks. We'll be working through practice problems from chapter 5.",
    max_attendees: 50,
    batch: {
      id: 1,
      name: "Mathematics Grade 10 - Morning",
      student_count: 28
    },
    teacher: {
      id: 1,
      name: "John Doe",
      email: "john.doe@school.com"
    },
    attendances: [
      {
        id: 1,
        student_id: 1,
        status: "present",
        marked_at: "2024-06-05T10:05:00Z",
        student: { id: 1, name: "Alice Johnson", email: "alice@example.com" }
      },
      {
        id: 2,
        student_id: 2,
        status: "absent",
        marked_at: null,
        student: { id: 2, name: "Bob Smith", email: "bob@example.com" }
      },
      {
        id: 3,
        student_id: 3,
        status: "late",
        marked_at: "2024-06-05T10:15:00Z",
        student: { id: 3, name: "Carol Davis", email: "carol@example.com" }
      },
      {
        id: 4,
        student_id: 4,
        status: "present",
        marked_at: "2024-06-05T10:02:00Z",
        student: { id: 4, name: "David Wilson", email: "david@example.com" }
      }
    ],
    can_start: true,
    is_upcoming: true,
    is_completed: false,
    formatted_duration: "1h 30m"
  };

  const attendanceStats: AttendanceStats = {
    total_students: 28,
    present_count: 2,
    absent_count: 1,
    attendance_rate: 71.4
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: Clock, color: 'text-blue-600 bg-blue-100', text: 'Scheduled' };
      case 'live':
        return { icon: Play, color: 'text-red-600 bg-red-100', text: 'Live Now' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100', text: 'Completed' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-gray-600 bg-gray-100', text: 'Cancelled' };
      case 'rescheduled':
        return { icon: RefreshCw, color: 'text-yellow-600 bg-yellow-100', text: 'Rescheduled' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-100', text: status };
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAttendanceChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const statusInfo = getStatusInfo(mockClass.status);
  const StatusIcon = statusInfo.icon;

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
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Classes
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">{mockClass.title}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {mockClass.batch.name} • {formatDateTime(mockClass.scheduled_at)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {mockClass.can_start && mockClass.zoom_start_url && (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Class
                        </button>
                      )}
                      
                      {mockClass.zoom_join_url && (
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Class
                        </button>
                      )}
                      
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Class
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Students</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {attendanceStats.total_students}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserCheck className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Present</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {attendanceStats.present_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserX className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Absent</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {attendanceStats.absent_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {attendanceStats.attendance_rate}%
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
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'attendance'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Attendance ({mockClass.attendances.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'details'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Class Details
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Class Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Class Information</h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="text-sm text-gray-900 mt-1">{mockClass.description}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                            <dd className="text-sm text-gray-900">{mockClass.formatted_duration}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Batch</dt>
                            <dd className="text-sm text-gray-900">{mockClass.batch.name}</dd>
                          </div>
                          {mockClass.notes && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Notes</dt>
                              <dd className="text-sm text-gray-900">{mockClass.notes}</dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      {/* Zoom Meeting Info */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Information</h3>
                        {mockClass.zoom_meeting_id ? (
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Meeting ID</dt>
                              <dd className="text-sm text-gray-900 font-mono">{mockClass.zoom_meeting_id}</dd>
                            </div>
                            {mockClass.zoom_password && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Password</dt>
                                <dd className="text-sm text-gray-900 font-mono">{mockClass.zoom_password}</dd>
                              </div>
                            )}
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Join URL</dt>
                              <dd className="text-sm">
                                <a 
                                  href={mockClass.zoom_join_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-500 break-all"
                                >
                                  {mockClass.zoom_join_url}
                                </a>
                              </dd>
                            </div>
                            {mockClass.max_attendees && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Max Attendees</dt>
                                <dd className="text-sm text-gray-900">{mockClass.max_attendees}</dd>
                              </div>
                            )}
                          </dl>
                        ) : (
                          <p className="text-sm text-gray-500">No Zoom meeting configured for this class.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'attendance' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            Student Attendance
                          </h3>
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {mockClass.attendances.map((attendance) => (
                          <div key={attendance.id} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-purple-600">
                                    {attendance.student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{attendance.student.name}</p>
                                <p className="text-sm text-gray-500">{attendance.student.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              {attendance.marked_at && (
                                <span className="text-xs text-gray-500">
                                  Marked at {formatTime(attendance.marked_at)}
                                </span>
                              )}
                              
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(attendance.student_id, 'present')}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    attendance.status === 'present'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                  }`}
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(attendance.student_id, 'late')}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    attendance.status === 'late'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                  }`}
                                >
                                  Late
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(attendance.student_id, 'absent')}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    attendance.status === 'absent'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                                  }`}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Class ID</dt>
                            <dd className="text-sm text-gray-900 font-mono">#{mockClass.id}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created At</dt>
                            <dd className="text-sm text-gray-900">June 1, 2024 at 2:30 PM</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd className="text-sm text-gray-900">June 3, 2024 at 4:15 PM</dd>
                          </div>
                          {mockClass.recording_url && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Recording</dt>
                              <dd className="text-sm">
                                <a 
                                  href={mockClass.recording_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-500"
                                >
                                  View Recording
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                          {mockClass.status === 'scheduled' && (
                            <button
                              type="button"
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Class
                            </button>
                          )}
                          
                          {mockClass.status === 'live' && (
                            <button
                              type="button"
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </button>
                          )}
                          
                          <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reschedule Class
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}