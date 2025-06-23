import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Download, 
  Search,
  Filter,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3
} from 'lucide-react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { User } from '@/types';

interface Quiz {
  id: number;
  title: string;
  total_marks: number;
  pass_marks: number;
  batch: {
    id: number;
    name: string;
    student_count: number;
  };
}

interface QuizAttempt {
  id: number;
  score: number;
  total_marks: number;
  percentage: number;
  has_passed: boolean;
  submitted_at: string;
  time_taken_minutes: number | null;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface Analytics {
  total_attempts: number;
  completion_rate: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  average_time_taken: number;
}

interface QuizResultsProps {
  auth: {
    user: User;
  };
  quiz: Quiz;
  attempts: {
    data: QuizAttempt[];
    links: any;
    meta: any;
  };
  analytics: Analytics;
  filters?: {
    search?: string;
    status?: string;
    sort?: string;
  };
}

export default function QuizResults({ auth, quiz, attempts, analytics, filters = {} }: QuizResultsProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'submitted_at');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleSearch = () => {
    router.get(`/teacher/quizzes/${quiz.id}/results`, {
      search: searchTerm,
      status: statusFilter,
      sort: sortBy
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const exportResults = () => {
    window.open(`/teacher/quizzes/${quiz.id}/results/export?format=csv`, '_blank');
  };

  const goBack = () => {
    router.visit(`/teacher/quizzes/${quiz.id}`);
  };

  // Header content with back button
  const headerContent = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center px-4 py-2 border border-green-200 rounded-xl shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Quiz
      </button>
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Results & Analytics</span>
      </div>
    </div>
  );

  return (
    <TeacherLayout 
      user={auth.user} 
      title={`Results: ${quiz.title}`}
      currentPage="quizzes"
      headerContent={headerContent}
      pageDescription={`${quiz.batch.name} • ${analytics.total_attempts} attempts`}
    >
      <Head title={`Results: ${quiz.title}`} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{quiz.batch.name}</p>
            </div>
            
            <button
              type="button"
              onClick={exportResults}
              className="inline-flex items-center px-4 py-2 border border-green-200 rounded-xl shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Participation</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.completion_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">
                  {analytics.total_attempts} of {quiz.batch.student_count} students
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.average_score.toFixed(1)}/{quiz.total_marks}
                </p>
                <p className="text-xs text-gray-400">
                  {((analytics.average_score / quiz.total_marks) * 100).toFixed(1)}% average
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.pass_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">
                  Pass mark: {quiz.pass_marks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.average_time_taken.toFixed(0)}m
                </p>
                <p className="text-xs text-gray-400">
                  Range: {analytics.lowest_score} - {analytics.highest_score}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Students</option>
                <option value="passed">Passed Only</option>
                <option value="failed">Failed Only</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="submitted_at">Latest First</option>
                <option value="score_desc">Highest Score</option>
                <option value="score_asc">Lowest Score</option>
                <option value="name">Name (A-Z)</option>
              </select>
              
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Results</h3>
            <p className="text-sm text-gray-500 mt-1">
              {attempts.meta.total} total attempts
            </p>
          </div>

          {attempts.data.length > 0 ? (
            <>
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
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
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
                    {attempts.data.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-600">
                                  {attempt.student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
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
                            {attempt.score}/{attempt.total_marks}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.percentage.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(attempt.percentage)}`}>
                            {getGradeText(attempt.percentage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attempt.has_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.has_passed ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Passed
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attempt.time_taken_minutes ? `${attempt.time_taken_minutes}m` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(attempt.submitted_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => router.visit(`/teacher/quizzes/${quiz.id}/attempts/${attempt.id}`)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {attempts.meta.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {attempts.meta.from} to {attempts.meta.to} of {attempts.meta.total} results
                    </div>
                    
                    <div className="flex space-x-2">
                      {attempts.links.map((link: any, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => link.url && router.get(link.url)}
                          disabled={!link.url}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            link.active
                              ? 'bg-green-600 text-white'
                              : link.url
                              ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                {analytics.total_attempts === 0 
                  ? 'No students have taken this quiz yet.'
                  : 'No results match your search criteria.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}