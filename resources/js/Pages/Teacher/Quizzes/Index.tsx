import React, { useState } from 'react';
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
  Copy
} from 'lucide-react';

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
  created_at: string;
}

interface Stats {
  total_quizzes: number;
  active_quizzes: number;
  draft_quizzes: number;
  total_attempts: number;
}

export default function TeacherQuizzesIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');

  // Mock data
  const stats: Stats = {
    total_quizzes: 15,
    active_quizzes: 8,
    draft_quizzes: 5,
    total_attempts: 142
  };

  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning" },
    { id: 2, name: "Physics Grade 11 - Afternoon" },
    { id: 3, name: "Chemistry Grade 12 - Evening" },
    { id: 4, name: "Biology Grade 9 - Morning" }
  ];

  const mockQuizzes: Quiz[] = [
    {
      id: 1,
      title: "Quadratic Equations Assessment",
      description: "Comprehensive test covering quadratic equations, graphing, and real-world applications",
      status: "active",
      total_marks: 50,
      pass_marks: 30,
      duration_minutes: 60,
      questions_count: 15,
      attempts_count: 25,
      average_score: 38.5,
      pass_rate: 84.0,
      start_time: "2024-06-01T09:00:00Z",
      end_time: "2024-06-15T23:59:00Z",
      batch: { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
      is_available: true,
      created_at: "2024-05-25T10:00:00Z"
    },
    {
      id: 2,
      title: "Newton's Laws Quiz",
      description: "Quick assessment on understanding of Newton's three laws of motion",
      status: "active",
      total_marks: 30,
      pass_marks: 18,
      duration_minutes: 30,
      questions_count: 10,
      attempts_count: 22,
      average_score: 24.2,
      pass_rate: 90.9,
      start_time: "2024-06-03T14:00:00Z",
      end_time: "2024-06-10T18:00:00Z",
      batch: { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
      is_available: true,
      created_at: "2024-05-28T14:30:00Z"
    },
    {
      id: 3,
      title: "Organic Chemistry Final",
      description: "Comprehensive final examination covering all organic chemistry topics",
      status: "draft",
      total_marks: 100,
      pass_marks: 60,
      duration_minutes: 120,
      questions_count: 8,
      attempts_count: 0,
      average_score: 0,
      pass_rate: 0,
      start_time: null,
      end_time: null,
      batch: { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 },
      is_available: false,
      created_at: "2024-06-02T18:00:00Z"
    },
    {
      id: 4,
      title: "Cell Biology Basics",
      description: "Introduction to cell structure and basic cellular processes",
      status: "archived",
      total_marks: 40,
      pass_marks: 24,
      duration_minutes: 45,
      questions_count: 12,
      attempts_count: 19,
      average_score: 32.1,
      pass_rate: 78.9,
      start_time: "2024-05-15T09:00:00Z",
      end_time: "2024-05-30T23:59:00Z",
      batch: { id: 4, name: "Biology Grade 9 - Morning", student_count: 22 },
      is_available: false,
      created_at: "2024-05-10T11:00:00Z"
    }
  ];

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.batch.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || quiz.status === statusFilter;
    const matchesBatch = !batchFilter || quiz.batch.id.toString() === batchFilter;
    
    return matchesSearch && matchesStatus && matchesBatch;
  });

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
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-gray-400 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="#" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileQuestion className="text-purple-500 mr-3 h-5 w-5" />
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
                      My Quizzes
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Create and manage assessments for your students
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
                      Create Quiz
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                <div className="mb-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Quiz "Quadratic Equations Assessment" created successfully!
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
                          <FileQuestion className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Quizzes
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.total_quizzes}
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
                              Active
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.active_quizzes}
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
                          <Clock className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Drafts
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.draft_quizzes}
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
                          <TrendingUp className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Attempts
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.total_attempts}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search quizzes..."
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
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
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
                  </div>
                </div>

                {/* Quizzes List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || statusFilter || batchFilter 
                          ? "Try adjusting your search or filter criteria."
                          : "Get started by creating your first quiz."
                        }
                      </p>
                      {!searchTerm && !statusFilter && !batchFilter && (
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            Create Your First Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredQuizzes.map((quiz) => {
                        const statusInfo = getStatusInfo(quiz.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <li key={quiz.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center min-w-0 flex-1">
                                  <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                      quiz.status === 'active' ? 'bg-green-100' :
                                      quiz.status === 'draft' ? 'bg-yellow-100' :
                                      'bg-gray-100'
                                    }`}>
                                      <StatusIcon className={`h-5 w-5 ${
                                        quiz.status === 'active' ? 'text-green-600' :
                                        quiz.status === 'draft' ? 'text-yellow-600' :
                                        'text-gray-400'
                                      }`} />
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4 min-w-0 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        className="text-sm font-medium text-gray-900 hover:text-purple-600 truncate text-left"
                                      >
                                        {quiz.title}
                                      </button>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.text}
                                      </span>
                                    </div>
                                    
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 truncate">
                                        {quiz.description}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {quiz.batch.name}
                                      </p>
                                    </div>
                                    
                                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <FileQuestion className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {quiz.questions_count} questions
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Award className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {quiz.total_marks} marks
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {getDurationText(quiz.duration_minutes)}
                                      </div>
                                      
                                      {quiz.attempts_count > 0 && (
                                        <div className="flex items-center">
                                          <TrendingUp className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                          {quiz.attempts_count} attempts ({quiz.pass_rate}% pass rate)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                  {quiz.status === 'draft' && quiz.questions_count > 0 && (
                                    <button
                                      type="button"
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Activate
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
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQuizzes.length}</span> of{' '}
                        <span className="font-medium">{filteredQuizzes.length}</span> results
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