import React, { useState, useMemo, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    ArrowLeftIcon,
    VideoIcon,
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    PlayIcon,
    CheckCircleIcon,
    XCircleIcon,
    RefreshCwIcon,
    DownloadIcon,
    UserCheckIcon,
    UserXIcon,
    ExternalLinkIcon,
    FileTextIcon,
    AlertCircleIcon,
    EditIcon,
    EyeIcon,
    UserIcon,
    GlobeAltIcon,
    LockClosedIcon,
    SettingsIcon
} from '@/Components/UI/Icons';

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
    student_count?: number;
    description?: string;
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
    zoom_meeting_id?: string | null;
    zoom_join_url?: string | null;
    zoom_start_url?: string | null;
    zoom_password?: string | null;
    recording_url?: string | null;
    notes?: string | null;
    max_attendees?: number | null;
    batch: Batch;
    teacher?: Teacher;
    attendances?: Attendance[];
    can_start?: boolean;
    is_upcoming?: boolean;
    is_completed?: boolean;
    formatted_duration?: string;
    created_at?: string;
    updated_at?: string;
}

interface AttendanceStats {
    total_students: number;
    present_count: number;
    absent_count: number;
    late_count: number;
    attendance_rate: number;
}

interface PageProps {
    classData?: ClassDetail;
    students?: Student[];
    attendanceStats?: AttendanceStats;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const ShowClass: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { classData, students = [], attendanceStats, auth, flash } = props;

    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'details'>('overview');
    const [attendanceData, setAttendanceData] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Memoized calculations to improve performance
    const defaultAttendanceStats = useMemo<AttendanceStats>(() => ({
        total_students: students.length,
        present_count: 0,
        absent_count: students.length,
        late_count: 0,
        attendance_rate: 0
    }), [students.length]);

    const finalAttendanceStats = attendanceStats || defaultAttendanceStats;

    const statusInfo = useMemo(() => {
        const getStatusInfo = (status: string) => {
            switch (status) {
                case 'scheduled':
                    return { 
                        icon: CalendarIcon, 
                        color: 'text-blue-600 bg-blue-100 border-blue-200', 
                        text: 'Scheduled', 
                        badgeColor: 'bg-blue-500' 
                    };
                case 'live':
                    return { 
                        icon: PlayIcon, 
                        color: 'text-red-600 bg-red-100 border-red-200', 
                        text: 'Live Now', 
                        badgeColor: 'bg-red-500 animate-pulse' 
                    };
                case 'completed':
                    return { 
                        icon: CheckCircleIcon, 
                        color: 'text-green-600 bg-green-100 border-green-200', 
                        text: 'Completed', 
                        badgeColor: 'bg-green-500' 
                    };
                case 'cancelled':
                    return { 
                        icon: XCircleIcon, 
                        color: 'text-gray-600 bg-gray-100 border-gray-200', 
                        text: 'Cancelled', 
                        badgeColor: 'bg-gray-500' 
                    };
                case 'rescheduled':
                    return { 
                        icon: RefreshCwIcon, 
                        color: 'text-yellow-600 bg-yellow-100 border-yellow-200', 
                        text: 'Rescheduled', 
                        badgeColor: 'bg-yellow-500' 
                    };
                default:
                    return { 
                        icon: ClockIcon, 
                        color: 'text-gray-600 bg-gray-100 border-gray-200', 
                        text: status, 
                        badgeColor: 'bg-gray-500' 
                    };
            }
        };

        return getStatusInfo(classData?.status || 'scheduled');
    }, [classData?.status]);

    // Memoized date formatting functions
    const formatDateTime = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const formatTime = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    // Optimized attendance change handler
    const handleAttendanceChange = useCallback((studentId: number, status: 'present' | 'absent' | 'late') => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    }, []);

    // Navigation handlers
    const handleBackToClasses = useCallback(() => {
        router.visit('/teacher/classes');
    }, []);

    const handleEditClass = useCallback(() => {
        if (classData?.id) {
            router.visit(`/teacher/classes/${classData.id}/edit`);
        }
    }, [classData?.id]);

    const handleStartClass = useCallback(() => {
        if (classData?.zoom_start_url) {
            window.open(classData.zoom_start_url, '_blank');
        }
    }, [classData?.zoom_start_url]);

    const handleJoinClass = useCallback(() => {
        if (classData?.zoom_join_url) {
            window.open(classData.zoom_join_url, '_blank');
        }
    }, [classData?.zoom_join_url]);

    const handleMarkCompleted = useCallback(() => {
        if (classData?.id) {
            setIsLoading(true);
            router.put(`/teacher/classes/${classData.id}/complete`, {}, {
                onFinish: () => setIsLoading(false)
            });
        }
    }, [classData?.id]);

    const handleCancelClass = useCallback(() => {
        if (classData?.id) {
            setIsLoading(true);
            router.put(`/teacher/classes/${classData.id}/cancel`, {}, {
                onFinish: () => setIsLoading(false)
            });
        }
    }, [classData?.id]);

    // Show loading state if classData is not available
    if (!classData) {
        return (
            <TeacherLayout 
                user={auth.user} 
                title="Loading..."
                currentPage="classes"
                pageDescription="Loading class data..."
            >
                <Head title="Loading Class Details" />
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-green-600 rounded-full" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-4 text-gray-600">Loading class data...</p>
                        </div>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

    const StatusIcon = statusInfo.icon;

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
                <button
                    onClick={handleBackToClasses}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Classes
                </button>
            </div>
            
            <div className="flex items-center space-x-3">
                {classData.can_start && classData.zoom_start_url && (
                    <button
                        type="button"
                        onClick={handleStartClass}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50"
                    >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Start Class
                    </button>
                )}
                
                {classData.zoom_join_url && (
                    <button
                        type="button"
                        onClick={handleJoinClass}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        Join Class
                    </button>
                )}
                
                <button
                    type="button"
                    onClick={handleEditClass}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Class
                </button>
            </div>
        </div>
    );

    return (
        <TeacherLayout 
            user={auth.user} 
            title={classData.title}
            currentPage="classes"
            headerContent={headerContent}
            pageDescription={`${classData.batch.name} • ${formatDateTime(classData.scheduled_at)}`}
        >
            <Head title={`${classData.title} - Class Details`} />
            
            <div className="max-w-7xl mx-auto">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-2xl bg-green-50 p-6 border border-green-200">
                        <div className="flex">
                            <CheckCircleIcon className="h-6 w-6 text-green-400 mt-0.5" />
                            <div className="ml-3">
                                <p className="text-green-800 font-medium">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-2xl bg-red-50 p-6 border border-red-200">
                        <div className="flex">
                            <AlertCircleIcon className="h-6 w-6 text-red-400 mt-0.5" />
                            <div className="ml-3">
                                <p className="text-red-800 font-medium">{flash.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-4 mb-2">
                                    <h1 className="text-2xl font-bold text-white truncate">{classData.title}</h1>
                                    <div className={`px-4 py-2 rounded-xl border ${statusInfo.color} bg-white flex items-center`}>
                                        <div className={`w-2 h-2 rounded-full ${statusInfo.badgeColor} mr-2`}></div>
                                        <StatusIcon className="h-4 w-4 mr-2" />
                                        <span className="font-semibold">{statusInfo.text}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-green-100 space-x-6">
                                    <div className="flex items-center">
                                        <UsersIcon className="h-4 w-4 mr-2" />
                                        <span>{classData.batch.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                        <span>{formatDateTime(classData.scheduled_at)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-2" />
                                        <span>{classData.formatted_duration || `${classData.duration_minutes} minutes`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-6">
                                <span className="text-green-100 text-sm font-medium">Class ID: #{classData.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <UsersIcon className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Students</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {finalAttendanceStats.total_students}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <UserCheckIcon className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Present</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {finalAttendanceStats.present_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <UserXIcon className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Absent</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {finalAttendanceStats.absent_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Attendance Rate</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {finalAttendanceStats.attendance_rate}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-8" role="tablist">
                            {[
                                { id: 'overview', label: 'Overview', icon: EyeIcon },
                                { id: 'attendance', label: `Attendance (${students.length})`, icon: UserCheckIcon },
                                { id: 'details', label: 'Class Details', icon: FileTextIcon }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`py-4 px-1 border-b-3 font-semibold text-sm transition-all duration-200 ${
                                        activeTab === id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    role="tab"
                                    aria-selected={activeTab === id}
                                >
                                    <Icon className="w-4 h-4 mr-2 inline" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Class Information */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <FileTextIcon className="h-6 w-6 mr-3 text-green-600" />
                                        Class Information
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Description</dt>
                                            <dd className="text-gray-900 leading-relaxed">{classData.description || 'No description provided.'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Duration</dt>
                                            <dd className="text-gray-900">{classData.formatted_duration || `${classData.duration_minutes} minutes`}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Batch</dt>
                                            <dd className="text-gray-900">{classData.batch.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Teacher</dt>
                                            <dd className="text-gray-900 flex items-center">
                                                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {classData.teacher?.name || auth.user.name}
                                            </dd>
                                        </div>
                                        {classData.notes && (
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 mb-2">Notes</dt>
                                                <dd className="text-gray-900 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">{classData.notes}</dd>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Meeting Information */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <VideoIcon className="h-6 w-6 mr-3 text-green-600" />
                                        Meeting Information
                                    </h3>
                                    {classData.zoom_meeting_id ? (
                                        <div className="space-y-6">
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 mb-2">Meeting ID</dt>
                                                <dd className="text-gray-900 font-mono bg-white px-4 py-2 rounded-xl border border-gray-200">{classData.zoom_meeting_id}</dd>
                                            </div>
                                            {classData.zoom_password && (
                                                <div>
                                                    <dt className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                                                        <LockClosedIcon className="h-4 w-4 mr-2" />
                                                        Password
                                                    </dt>
                                                    <dd className="text-gray-900 font-mono bg-white px-4 py-2 rounded-xl border border-gray-200">{classData.zoom_password}</dd>
                                                </div>
                                            )}
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                                                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                                                    Join URL
                                                </dt>
                                                <dd className="text-sm">
                                                    <a 
                                                        href={classData.zoom_join_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-500 break-all bg-white p-4 rounded-xl border border-gray-200 block hover:border-blue-300 transition-colors duration-200"
                                                    >
                                                        {classData.zoom_join_url}
                                                    </a>
                                                </dd>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <VideoIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No Zoom meeting configured for this class.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <UserCheckIcon className="h-6 w-6 mr-3 text-green-600" />
                                        Student Attendance
                                    </h3>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <DownloadIcon className="h-4 w-4 mr-2" />
                                            Export
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                                
                                {students.length > 0 ? (
                                    <div className="grid gap-4">
                                        {students.map((student) => (
                                            <div key={student.id} className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {student.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                                                        <p className="text-sm text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex space-x-2">
                                                    {['present', 'late', 'absent'].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => handleAttendanceChange(student.id, status as any)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                                                                attendanceData[student.id] === status
                                                                    ? status === 'present' ? 'bg-green-100 border-green-300 text-green-700'
                                                                    : status === 'late' ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                                                    : 'bg-red-100 border-red-300 text-red-700'
                                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No students found in this batch.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <FileTextIcon className="h-6 w-6 mr-3 text-green-600" />
                                        Technical Details
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Class ID</dt>
                                            <dd className="text-gray-900 font-mono bg-white px-4 py-2 rounded-xl border border-gray-200">#{classData.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Created At</dt>
                                            <dd className="text-gray-900">{classData.created_at ? formatDateTime(classData.created_at) : 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Last Updated</dt>
                                            <dd className="text-gray-900">{classData.updated_at ? formatDateTime(classData.updated_at) : 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 mb-2">Status</dt>
                                            <dd>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border-2 ${statusInfo.color}`}>
                                                    <StatusIcon className="h-4 w-4 mr-2" />
                                                    {statusInfo.text}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <SettingsIcon className="h-6 w-6 mr-3 text-green-600" />
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-4">
                                        {classData.status === 'scheduled' && (
                                            <button
                                                type="button"
                                                onClick={handleCancelClass}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center px-6 py-3 border-2 border-red-200 rounded-2xl text-red-700 bg-red-50 hover:bg-red-100 font-semibold transition-all duration-200 disabled:opacity-50"
                                            >
                                                <XCircleIcon className="h-5 w-5 mr-3" />
                                                {isLoading ? 'Processing...' : 'Cancel Class'}
                                            </button>
                                        )}
                                        
                                        {classData.status === 'live' && (
                                            <button
                                                type="button"
                                                onClick={handleMarkCompleted}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center px-6 py-3 border-2 border-green-200 rounded-2xl text-green-700 bg-green-50 hover:bg-green-100 font-semibold transition-all duration-200 disabled:opacity-50"
                                            >
                                                <CheckCircleIcon className="h-5 w-5 mr-3" />
                                                {isLoading ? 'Processing...' : 'Mark as Completed'}
                                            </button>
                                        )}
                                        
                                        <button
                                            type="button"
                                            onClick={handleEditClass}
                                            className="w-full flex items-center justify-center px-6 py-3 border-2 border-blue-200 rounded-2xl text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold transition-all duration-200"
                                        >
                                            <EditIcon className="h-5 w-5 mr-3" />
                                            Edit Class Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default ShowClass;