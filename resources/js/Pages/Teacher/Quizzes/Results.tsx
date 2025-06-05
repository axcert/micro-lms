import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp,
  Users,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Eye,
  Search,
  Filter,
  Star,
  Target,
  BookOpen,
  Bell,
  Settings,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface QuizAttempt {
  id: number;
  student: Student;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  has_passed: boolean;
  time_taken_minutes: number;
  started_at: string;
  submitted_at: string;
  status: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  total_marks: number;
  pass_marks: number;
  duration_minutes: number | null;
  questions_count: number;
  attempts_count: number;
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
  created_at: string;
}

interface Analytics {
  total_attempts: number;
  completion_rate: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  average_time_taken: number;
  score_distribution: {
    [key: string]: number;
  };
}

export default function QuizResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'attempts' | 'analytics'>('overview');

  // Mock data
  const mockQuiz: Quiz = {
    id: 1,
    title: "Quadratic Equations Assessment",
    description: "Comprehensive test covering quadratic equations, graphing, and real-world applications",
    total_marks: 50,
    pass_marks: 30,
    duration_minutes: 60,
    questions_count: 15,
    attempts_count: 25,
    batch: {
      id: 1,
      name: "Mathematics Grade 10 - Morning",
      student_count: 28
    },
    created_at: "2024-05-25T10:00:00Z"
  };

  const mockAnalytics: Analytics = {
    total_attempts: 25,
    completion_rate: 89.3,
    average_score: 38.5,
    highest_score: 48,
    lowest_score: 22,
    pass_rate: 84.0,
    average_time_taken: 45.2,
    score_distribution: {
      '0-20%': 1,
      '21-40%': 2,
      '41-60%': 4,
      '61-80%': 12,
      '81-100%': 6
    }
  };

  const mockAttempts: QuizAttempt[] = [
    {
      id: 1,
      student: { id: 1, name: "Alice Johnson", email: "alice@example.com" },
      score: 48,
      total_marks: 50,
      percentage: 96.0,
      grade: "A+",
      has_passed: true,
      time_taken_minutes: 42,
      started_at: "2024-06-05T10:00:00Z",
      submitted_at: "2024-06-05T10:42:00Z",
      status: "completed"
    },
    {
      id: 2,
      student: { id: 2, name: "Bob Smith", email: "bob@example.com" },
      score: 35,
      total_marks: 50,
      percentage: 70.0,
      grade: "B",
      has_passed: true,
      time_taken_minutes: 58,
      started_at: "2024-06-05T10:00:00Z",
      submitted_at: "2024-06-05T10:58:00Z",
      status: "completed"
    },
    {
      id: 3,
      student: { id: 3, name: "Carol Davis", email: "carol@example.com" },
      score: 25,
      total_marks: 50,
      percentage: 50.0,
      grade: "F",
      has_passed: false,
      time_taken_minutes: 60,
      started_at: "2024-06-05T10:00:00Z",
      submitted_at: "2024-06-05T11:00:00Z",
      status: "completed"
    },
    {
      id: 4,
      student: { id: 4, name: "David Wilson", email: "david@example.com" },
      score: 42,
      total_marks: 50,
      percentage: 84.0,
      grade: "A-",
      has_passed: true,
      time_taken_minutes: 38,
      started_at: "2024-06-05T10:00:00Z",
      submitted_at: "2024-06-05T10:38:00Z",
      status: "completed"
    },
    {
      id: 5,
      student: { id: 5, name: "Emma Brown", email: "emma@example.com" },
      score: 39,
      total_marks: 50,
      percentage: 78.0,
      grade: "B+",
      has_passed: true,
      time_taken_minutes: 52,
      started_at: "2024-06-05T14:00:00Z",
      submitted_at: "2024-06-05T14:52:00Z",
      status: "completed"
    }
  ];

  const filteredAttempts = mockAttempts.filter(attempt => {
    const matchesSearch = attempt.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'passed' && attempt.has_passed) ||
                         (statusFilter === 'failed' && !attempt.has_passed);
    
    const matchesGrade = !gradeFilter || attempt.grade === gradeFilter;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });

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
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
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
                  <Calendar className="text-gray-400 mr-3 h-5 w-5" />
                  Classes
                </a>
                <a href="#" className="bg-purple-100 text-purple-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <FileText className="text-purple-500 mr-3 h-5 w-5" />
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
                      Back to Quizzes
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">{mockQuiz.title}</h1>
                      <p className="mt-1 text-sm text-gray-500">
                        {mockQuiz.batch.name} • {mockQuiz.questions_count} questions • {mockQuiz.total_marks} marks
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Quiz
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockAnalytics.completion_rate}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {mockAnalytics.total_attempts} of {mockQuiz.batch.student_count} students
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockAnalytics.average_score}
                        </p>
                        <p className="text-xs text-gray-500">
                          out of {mockQuiz.total_marks} marks
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Target className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {mockAnalytics.pass_rate}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Pass mark: {mockQuiz.pass_marks}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg. Time</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatDuration(mockAnalytics.average_time_taken)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Limit: {mockQuiz.duration_minutes ? formatDuration(mockQuiz.duration_minutes) : 'None'}
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
                      onClick={() => setActiveTab('attempts')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'attempts'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Student Results ({mockAnalytics.total_attempts})
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'analytics'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Analytics
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Score Distribution */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                          Score Distribution
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(mockAnalytics.score_distribution).map(([range, count]) => (
                            <div key={range} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{range}</span>
                              <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${(count / mockAnalytics.total_attempts) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Summary */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Star className="h-5 w-5 mr-2 text-purple-600" />
                          Performance Summary
                        </h3>
                        <dl className="space-y-4">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Highest Score</dt>
                            <dd className="text-sm text-gray-900">{mockAnalytics.highest_score} / {mockQuiz.total_marks}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Lowest Score</dt>
                            <dd className="text-sm text-gray-900">{mockAnalytics.lowest_score} / {mockQuiz.total_marks}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Students Passed</dt>
                            <dd className="text-sm text-gray-900">
                              {Math.round((mockAnalytics.pass_rate / 100) * mockAnalytics.total_attempts)} of {mockAnalytics.total_attempts}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Students Failed</dt>
                            <dd className="text-sm text-gray-900">
                              {mockAnalytics.total_attempts - Math.round((mockAnalytics.pass_rate / 100) * mockAnalytics.total_attempts)} of {mockAnalytics.total_attempts}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Top Performers */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-purple-600" />
                          Top Performers
                        </h3>
                        <div className="space-y-3">
                          {mockAttempts
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((attempt, index) => (
                              <div key={attempt.id} className="flex items-center space-x-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-800' :
                                  index === 2 ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {attempt.student.name}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {attempt.score}/{mockQuiz.total_marks}
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(attempt.grade)}`}>
                                  {attempt.grade}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Need Attention */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                          Need Attention
                        </h3>
                        <div className="space-y-3">
                          {mockAttempts
                            .filter(attempt => !attempt.has_passed)
                            .map((attempt) => (
                              <div key={attempt.id} className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {attempt.student.name}
                                  </p>
                                  <p className="text-xs text-gray-500">{attempt.student.email}</p>
                                </div>
                                <div className="text-sm text-red-600">
                                  {attempt.score}/{mockQuiz.total_marks}
                                </div>
                              </div>
                            ))}
                          {mockAttempts.filter(attempt => !attempt.has_passed).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              All students who attempted this quiz have passed! 🎉
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'attempts' && (
                    <div>
                      {/* Filters */}
                      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search students..."
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
                            <option value="">All Results</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                          </select>
                          
                          <select
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                          >
                            <option value="">All Grades</option>
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="F">F</option>
                          </select>
                        </div>
                      </div>

                      {/* Results Table */}
                      <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Percentage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Grade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Time Taken
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredAttempts.map((attempt) => (
                                <tr key={attempt.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                          <span className="text-xs font-medium text-purple-600">
                                            {attempt.student.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {attempt.student.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {attempt.student.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {attempt.score} / {attempt.total_marks}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {attempt.percentage}%
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(attempt.grade)}`}>
                                      {attempt.grade}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDuration(attempt.time_taken_minutes)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDateTime(attempt.submitted_at)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      type="button"
                                      className="text-purple-600 hover:text-purple-900"
                                    >
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Detailed Analytics */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Analytics</h3>
                        <dl className="space-y-4">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Total Students in Batch</dt>
                            <dd className="text-sm text-gray-900">{mockQuiz.batch.student_count}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Students Attempted</dt>
                            <dd className="text-sm text-gray-900">{mockAnalytics.total_attempts}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Students Not Attempted</dt>
                            <dd className="text-sm text-gray-900">{mockQuiz.batch.student_count - mockAnalytics.total_attempts}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Average Time Taken</dt>
                            <dd className="text-sm text-gray-900">{formatDuration(mockAnalytics.average_time_taken)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Quiz Created</dt>
                            <dd className="text-sm text-gray-900">{formatDateTime(mockQuiz.created_at)}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Grade Distribution */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Distribution</h3>
                        <div className="space-y-3">
                          {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F'].map(grade => {
                            const count = mockAttempts.filter(attempt => attempt.grade === grade).length;
                            const percentage = mockAttempts.length > 0 ? (count / mockAttempts.length) * 100 : 0;
                            
                            return (
                              <div key={grade} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                                    {grade}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        grade.startsWith('A') ? 'bg-green-600' :
                                        grade.startsWith('B') ? 'bg-blue-600' :
                                        grade.startsWith('C') ? 'bg-yellow-600' :
                                        'bg-red-600'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                                </div>
                              </div>
                            );
                          })}
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