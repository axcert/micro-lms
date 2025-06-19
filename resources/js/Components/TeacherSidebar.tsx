import React, { useState } from 'react';

// Head component for setting page title
const Head = ({ title }: { title: string }) => {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
    return null;
};

// Router object for navigation
const router = {
    visit: (url: string) => {
        window.location.href = url;
    },
    post: (url: string, options?: any) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
    }
};

// Form hook simulation
const useForm = <T,>(initialData: T) => {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);

    const post = (url: string, options?: any) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            if (options?.onSuccess) options.onSuccess();
        }, 1000);
    };

    return { data, setData, post, processing };
};

// Custom SVG Icons
const AcademicCapIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
    </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const ClipboardDocumentListIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
);

const CalendarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5m-6-10.125a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
    </svg>
);

const ChartBarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ArrowRightOnRectangleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const PlusIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ArrowLeftIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const VideoIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const ClockIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const FileTextIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const SettingsIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Bars3Icon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XMarkIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const BellIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const CheckCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AlertCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
);

interface Batch {
  id: number;
  name: string;
  student_count: number;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  batches: Batch[];
  auth: {
    user: User;
  };
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

interface FormData {
  title: string;
  description: string;
  batch_id: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_link: string;
  notes: string;
  create_attendance: boolean;
}

export default function CreateClass() {
  // Mock data for demonstration
  const mockBatches: Batch[] = [
    { id: 1, name: "Mathematics Grade 10 - Morning", student_count: 28 },
    { id: 2, name: "Physics Grade 11 - Afternoon", student_count: 25 },
    { id: 3, name: "Chemistry Grade 12 - Evening", student_count: 20 }
  ];

  const mockAuth = {
    user: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@microlms.com",
      role: "teacher"
    }
  };

  const { data, setData, post, processing } = useForm<FormData>({
    title: '',
    description: '',
    batch_id: '',
    scheduled_at: '',
    duration_minutes: 60,
    zoom_link: '',
    notes: '',
    create_attendance: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedBatch = mockBatches.find(batch => batch.id.toString() === data.batch_id);

  const handleSubmit = () => {
    console.log('Form submission started');
    console.log('Form data:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Check if data exists and has the required structure
    if (!data || typeof data !== 'object') {
      console.error('Form data is not properly initialized:', data);
      alert('Form data error. Please refresh the page and try again.');
      return;
    }
    
    // Client-side validation with null checks
    const newErrors: Record<string, string> = {};
    
    if (!data.title || !data.title.trim()) {
      newErrors.title = 'Class title is required.';
    }
    
    if (!data.batch_id) {
      newErrors.batch_id = 'Please select a batch for this class.';
    }
    
    if (!data.scheduled_at) {
      newErrors.scheduled_at = 'Class date and time is required.';
    } else {
      const scheduledDate = new Date(data.scheduled_at);
      if (scheduledDate <= new Date()) {
        newErrors.scheduled_at = 'Class must be scheduled for a future date and time.';
      }
    }
    
    if (!data.duration_minutes || data.duration_minutes < 15) {
      newErrors.duration_minutes = 'Class duration must be at least 15 minutes.';
    }

    if (data.zoom_link && data.zoom_link.trim() && !isValidUrl(data.zoom_link)) {
      newErrors.zoom_link = 'Please enter a valid Zoom meeting URL.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.log('Client-side validation errors:', newErrors);
      setValidationErrors(newErrors);
      return;
    }

    console.log('Submitting to /teacher/classes with data:', data);

    // Submit form
    post('/teacher/classes', {
      onSuccess: (response) => {
        console.log('Form submission successful:', response);
        alert('Class created successfully!');
        // Form submission successful - redirect handled by backend
      },
      onError: (errors: Record<string, string>) => {
        console.log('Form submission errors:', errors);
        setValidationErrors(errors);
        alert('Error creating class. Check console for details.');
      },
      onFinish: () => {
        console.log('Form submission finished');
      }
    });
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  // Navigation functions
  const navigateToDashboard = () => {
    router.visit('/teacher/dashboard');
  };

  const navigateToBatches = () => {
    router.visit('/teacher/batches');
  };

  const navigateToCreateBatch = () => {
    router.visit('/teacher/batches/create');
  };

  const navigateToScheduleClass = () => {
    router.visit('/teacher/classes/create');
  };

  const navigateToClassesIndex = () => {
    router.visit('/teacher/classes');
  };

  const navigateToCreateQuiz = () => {
    router.visit('/teacher/quizzes/create');
  };

  const navigateToQuizzes = () => {
    router.visit('/teacher/quizzes');
  };

  // Combine server errors with client validation errors
  const allErrors = { ...validationErrors };

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: ChartBarIcon,
      action: navigateToDashboard,
      description: 'Overview & analytics',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Batch Management',
      icon: UserGroupIcon,
      action: navigateToCreateBatch,
      description: 'Create & manage student batches',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'View Classes',
      icon: CalendarIcon,
      action: navigateToClassesIndex,
      description: 'View & manage all classes',
      color: 'from-purple-500 to-purple-600',
      current: true
    },
    {
      name: 'Quiz Management',
      icon: ClipboardDocumentListIcon,
      action: navigateToCreateQuiz,
      description: 'Create & manage quizzes',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex">
      <Head title="Schedule New Class" />
      
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="relative h-20 px-6 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-500/90"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">Teacher Panel</span>
                <p className="text-green-100 text-xs">Education Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-3">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full group flex items-center px-4 py-4 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] border ${
                    item.current 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md' 
                      : 'border-transparent hover:border-green-100 hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg ${
                      item.current ? 'scale-110' : ''
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold transition-colors duration-300 text-sm ${
                        item.current ? 'text-green-700' : 'text-gray-800 group-hover:text-green-700'
                      }`}>
                        {item.name}
                      </p>
                      <p className={`text-xs transition-colors duration-300 mt-0.5 truncate ${
                        item.current ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Enhanced User Info */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-green-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {mockAuth.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{mockAuth.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{mockAuth.user.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Enhanced Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={navigateToClassesIndex}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Classes
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Creating Class</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Schedule New Class
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new online class session for your students
                </p>
              </div>

              {/* No Batches Warning */}
              {mockBatches.length === 0 && (
                <div className="mb-6 rounded-xl bg-yellow-50 p-4 border border-yellow-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        No Batches Available
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          You need to create at least one batch before you can schedule classes.
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={navigateToCreateBatch}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Create Your First Batch
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {mockBatches.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50">
                  <div className="space-y-6 p-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileTextIcon className="h-5 w-5 mr-2 text-green-600" />
                        Class Information
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {/* Class Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Class Title *
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`mt-1 block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                              allErrors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Quadratic Equations - Advanced Problems"
                            required
                          />
                          {allErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{allErrors.title}</p>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200"
                            placeholder="Brief description of what will be covered in this class..."
                          />
                        </div>

                        {/* Batch Selection */}
                        <div>
                          <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
                            Select Batch *
                          </label>
                          <select
                            id="batch_id"
                            value={data.batch_id}
                            onChange={(e) => setData('batch_id', e.target.value)}
                            className={`mt-1 block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                              allErrors.batch_id ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          >
                            <option value="">Choose a batch...</option>
                            {mockBatches.map(batch => (
                              <option key={batch.id} value={batch.id.toString()}>
                                {batch.name} ({batch.student_count} students)
                              </option>
                            ))}
                          </select>
                          {allErrors.batch_id && (
                            <p className="mt-1 text-sm text-red-600">{allErrors.batch_id}</p>
                          )}
                          
                          {selectedBatch && (
                            <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
                              <p className="text-sm text-green-700">
                                <UserGroupIcon className="inline h-4 w-4 mr-1" />
                                {selectedBatch.student_count} students will be invited to this class
                              </p>
                              {selectedBatch.description && (
                                <p className="text-xs text-green-600 mt-1">
                                  {selectedBatch.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                        Schedule
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date and Time */}
                        <div>
                          <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700">
                            Date & Time *
                          </label>
                          <input
                            type="datetime-local"
                            id="scheduled_at"
                            value={data.scheduled_at}
                            onChange={(e) => setData('scheduled_at', e.target.value)}
                            min={getTomorrowDate()}
                            className={`mt-1 block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                              allErrors.scheduled_at ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          />
                          {allErrors.scheduled_at && (
                            <p className="mt-1 text-sm text-red-600">{allErrors.scheduled_at}</p>
                          )}
                        </div>

                        {/* Duration */}
                        <div>
                          <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
                            Duration (minutes) *
                          </label>
                          <select
                            id="duration_minutes"
                            value={data.duration_minutes}
                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value))}
                            className={`mt-1 block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                              allErrors.duration_minutes ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                            <option value={150}>2.5 hours</option>
                            <option value={180}>3 hours</option>
                          </select>
                          {allErrors.duration_minutes && (
                            <p className="mt-1 text-sm text-red-600">{allErrors.duration_minutes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meeting Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <VideoIcon className="h-5 w-5 mr-2 text-green-600" />
                        Meeting Details
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {/* Zoom Link */}
                        <div>
                          <label htmlFor="zoom_link" className="block text-sm font-medium text-gray-700">
                            Zoom Meeting Link (Optional)
                          </label>
                          <input
                            type="url"
                            id="zoom_link"
                            value={data.zoom_link}
                            onChange={(e) => setData('zoom_link', e.target.value)}
                            className={`mt-1 block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200 ${
                              allErrors.zoom_link ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="https://zoom.us/j/123456789"
                          />
                          {allErrors.zoom_link && (
                            <p className="mt-1 text-sm text-red-600">{allErrors.zoom_link}</p>
                          )}
                          <p className="mt-1 text-sm text-gray-500">
                            Students will access the class through this link
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <SettingsIcon className="h-5 w-5 mr-2 text-green-600" />
                        Additional Settings
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Class Notes
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200"
                            placeholder="Any additional notes or instructions for this class..."
                          />
                        </div>

                        {/* Create Attendance */}
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={data.create_attendance}
                              onChange={(e) => setData('create_attendance', e.target.checked)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Create attendance records for all students
                            </span>
                          </label>
                          <p className="mt-1 ml-6 text-sm text-gray-500">
                            This will create attendance records that you can mark during or after the class
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={navigateToClassesIndex}
                          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={processing}
                          className={`inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                            processing ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                          }`}
                        >
                          {processing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Scheduling...
                            </>
                          ) : (
                            'Schedule Class'
                          )}
                        </button>
                      </div>
                    </div>
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