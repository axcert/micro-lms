import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    CalendarIcon,
    PlusIcon,
    UserGroupIcon,
    ClockIcon,
    ArrowLeftIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    TrashIcon,
    EyeIcon,
    PencilIcon,
    PlayIcon,
    StopIcon,
    VideoCameraIcon,
    LinkIcon,
    DocumentDuplicateIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface Batch {
    id: number;
    name: string;
    students_count: number;
}

interface Class {
    id: number;
    title: string;
    description: string;
    batch: {
        name: string;
    };
    scheduled_at: string;
    duration: number;
    zoom_link?: string;
    zoom_meeting_id?: string;
    zoom_passcode?: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    attendance_count?: number;
    created_at: string;
}

interface CreateClassProps {
    batches?: Batch[];
    classes?: Class[];
}

const Create: React.FC<CreateClassProps> = ({ batches = [], classes = [] }) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'manage'>('schedule');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        batch_id: '',
        scheduled_at: '',
        duration: 60,
        zoom_link: '',
        zoom_meeting_id: '',
        zoom_passcode: '',
        send_notifications: true,
        allow_recordings: false,
        auto_attendance: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/classes');
    };

    const navigateBack = () => {
        router.visit('/teacher/dashboard');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ongoing': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'scheduled': return <CalendarIcon className="w-4 h-4" />;
            case 'ongoing': return <PlayIcon className="w-4 h-4" />;
            case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
            case 'cancelled': return <XCircleIcon className="w-4 h-4" />;
            default: return <ClockIcon className="w-4 h-4" />;
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    const upcomingClasses = classes.filter(cls => isUpcoming(cls.scheduled_at));
    const pastClasses = classes.filter(cls => !isUpcoming(cls.scheduled_at));

    return (
        <div className="min-h-screen bg-white">
            <Head title="Class Management" />
            
            {/* Enhanced Header */}
            <div className="bg-white shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={navigateBack}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                            >
                                <ArrowLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-700" />
                            </button>
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center shadow-lg">
                                <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                    Class Management
                                </h1>
                                <p className="text-gray-600">Schedule and manage your online classes.</p>
                            </div>
                        </div>
                        
                        {/* Tab Navigation */}
                        <div className="flex bg-gray-50 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'schedule'
                                        ? 'bg-gray-700 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Schedule Class
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'manage'
                                        ? 'bg-gray-700 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Manage Classes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'schedule' ? (
                    /* Schedule Class Section */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Class Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-gradient-to-br from-gray-700 to-black rounded-lg mr-3">
                                        <PlusIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                        Schedule New Class
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Class Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                                placeholder="Enter class title..."
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Select Batch
                                            </label>
                                            <select
                                                value={data.batch_id}
                                                onChange={(e) => setData('batch_id', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                            >
                                                <option value="">Choose a batch...</option>
                                                {batches.map((batch) => (
                                                    <option key={batch.id} value={batch.id}>
                                                        {batch.name} ({batch.students_count} students)
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.batch_id && <p className="text-red-500 text-sm mt-1">{errors.batch_id}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                            placeholder="Brief description of the class..."
                                        />
                                    </div>

                                    {/* Scheduling */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Class Date & Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.scheduled_at}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                min={new Date().toISOString().slice(0, 16)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                            />
                                            {errors.scheduled_at && <p className="text-red-500 text-sm mt-1">{errors.scheduled_at}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Duration (minutes)
                                            </label>
                                            <select
                                                value={data.duration}
                                                onChange={(e) => setData('duration', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                            >
                                                <option value={30}>30 minutes</option>
                                                <option value={45}>45 minutes</option>
                                                <option value={60}>1 hour</option>
                                                <option value={90}>1.5 hours</option>
                                                <option value={120}>2 hours</option>
                                                <option value={180}>3 hours</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Zoom Integration */}
                                    <div className="border-t pt-6">
                                        <div className="flex items-center mb-4">
                                            <VideoCameraIcon className="w-5 h-5 text-blue-600 mr-2" />
                                            <h3 className="text-lg font-semibold text-gray-900">Zoom Meeting Details</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Zoom Meeting Link
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.zoom_link}
                                                    onChange={(e) => setData('zoom_link', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="https://zoom.us/j/1234567890"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Meeting ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.zoom_meeting_id}
                                                    onChange={(e) => setData('zoom_meeting_id', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="123 456 7890"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Passcode (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.zoom_passcode}
                                                onChange={(e) => setData('zoom_passcode', e.target.value)}
                                                className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                placeholder="Meeting passcode"
                                            />
                                        </div>
                                    </div>

                                    {/* Advanced Settings Toggle */}
                                    <div className="border-t pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            className="flex items-center text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                                        >
                                            <Cog6ToothIcon className="w-5 h-5 mr-2" />
                                            Advanced Settings
                                            <div className={`ml-2 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        </button>

                                        {showAdvanced && (
                                            <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.send_notifications}
                                                            onChange={(e) => setData('send_notifications', e.target.checked)}
                                                            className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Send Notifications</span>
                                                    </label>

                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.allow_recordings}
                                                            onChange={(e) => setData('allow_recordings', e.target.checked)}
                                                            className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Allow Recordings</span>
                                                    </label>

                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.auto_attendance}
                                                            onChange={(e) => setData('auto_attendance', e.target.checked)}
                                                            className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Auto Attendance</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Scheduling...
                                                </>
                                            ) : (
                                                <>
                                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                                    Schedule Class
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-700">Total Classes</span>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600">{classes.length}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <PlayIcon className="w-5 h-5 text-green-600 mr-2" />
                                            <span className="text-sm font-medium text-green-700">Upcoming</span>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">{upcomingClasses.length}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center">
                                            <UserGroupIcon className="w-5 h-5 text-purple-600 mr-2" />
                                            <span className="text-sm font-medium text-purple-700">Active Batches</span>
                                        </div>
                                        <span className="text-xl font-bold text-purple-600">{batches.length}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <div className="flex items-center">
                                            <ChartBarIcon className="w-5 h-5 text-orange-600 mr-2" />
                                            <span className="text-sm font-medium text-orange-700">Avg Duration</span>
                                        </div>
                                        <span className="text-xl font-bold text-orange-600">
                                            {classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + cls.duration, 0) / classes.length) : 0}m
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-xl shadow-lg text-white p-6">
                                <h3 className="text-lg font-bold mb-3">💡 Quick Tips</h3>
                                <ul className="space-y-2 text-sm text-gray-200">
                                    <li>• Schedule classes at least 24h in advance</li>
                                    <li>• Test your Zoom link before the class</li>
                                    <li>• Send notifications to keep students informed</li>
                                    <li>• Record important sessions for review</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Manage Classes Section */
                    <div className="space-y-6">
                        {/* Class Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                        <CalendarIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
                                        <p className="text-sm text-gray-600">Total Classes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                        <PlayIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-green-600">{upcomingClasses.length}</p>
                                        <p className="text-sm text-gray-600">Upcoming</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
                                        <CheckCircleIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-600">{pastClasses.length}</p>
                                        <p className="text-sm text-gray-600">Completed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                        <UserGroupIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {classes.reduce((total, cls) => total + (cls.attendance_count || 0), 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Attendance</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Classes */}
                        {upcomingClasses.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                                    <h3 className="text-lg font-bold text-green-800 flex items-center">
                                        <PlayIcon className="w-5 h-5 mr-2" />
                                        Upcoming Classes
                                    </h3>
                                </div>
                                
                                <div className="divide-y divide-gray-200">
                                    {upcomingClasses.map((classItem) => {
                                        const { date, time } = formatDateTime(classItem.scheduled_at);
                                        return (
                                            <div key={classItem.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="text-lg font-semibold text-gray-900">{classItem.title}</h4>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(classItem.status)}`}>
                                                                {getStatusIcon(classItem.status)}
                                                                <span className="ml-1 capitalize">{classItem.status}</span>
                                                            </span>
                                                        </div>
                                                        
                                                        {classItem.description && (
                                                            <p className="text-gray-600 mb-3">{classItem.description}</p>
                                                        )}
                                                        
                                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <UserGroupIcon className="w-4 h-4 mr-1" />
                                                                {classItem.batch.name}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                                {date} at {time}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <ClockIcon className="w-4 h-4 mr-1" />
                                                                {classItem.duration} min
                                                            </div>
                                                            {classItem.zoom_link && (
                                                                <div className="flex items-center">
                                                                    <VideoCameraIcon className="w-4 h-4 mr-1" />
                                                                    Zoom Ready
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2 ml-6">
                                                        {classItem.zoom_link && (
                                                            <a 
                                                                href={classItem.zoom_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                                title="Join Zoom Meeting"
                                                            >
                                                                <LinkIcon className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                                                            <DocumentDuplicateIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* All Classes List */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-900">All Classes</h3>
                            </div>
                            
                            {classes.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {classes.map((classItem) => {
                                        const { date, time } = formatDateTime(classItem.scheduled_at);
                                        const upcoming = isUpcoming(classItem.scheduled_at);
                                        
                                        return (
                                            <div key={classItem.id} className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${upcoming ? 'bg-green-50/30' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="text-lg font-semibold text-gray-900">{classItem.title}</h4>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(classItem.status)}`}>
                                                                {getStatusIcon(classItem.status)}
                                                                <span className="ml-1 capitalize">{classItem.status}</span>
                                                            </span>
                                                            {upcoming && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Upcoming
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {classItem.description && (
                                                            <p className="text-gray-600 mb-3">{classItem.description}</p>
                                                        )}
                                                        
                                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <UserGroupIcon className="w-4 h-4 mr-1" />
                                                                {classItem.batch.name}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                                {date} at {time}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <ClockIcon className="w-4 h-4 mr-1" />
                                                                {classItem.duration} min
                                                            </div>
                                                            {classItem.attendance_count !== undefined && (
                                                                <div className="flex items-center">
                                                                    <ChartBarIcon className="w-4 h-4 mr-1" />
                                                                    {classItem.attendance_count} attended
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2 ml-6">
                                                        {classItem.zoom_link && upcoming && (
                                                            <a 
                                                                href={classItem.zoom_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                                title="Join Zoom Meeting"
                                                            >
                                                                <LinkIcon className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                                                            <DocumentDuplicateIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h3>
                                    <p className="text-gray-500 mb-6">Schedule your first class to get started with online teaching.</p>
                                    <button
                                        onClick={() => setActiveTab('schedule')}
                                        className="bg-gradient-to-r from-gray-700 to-black text-white px-6 py-3 rounded-lg font-medium hover:from-black hover:to-gray-900 transition-all duration-200"
                                    >
                                        <PlusIcon className="w-5 h-5 inline mr-2" />
                                        Schedule Your First Class
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Create;