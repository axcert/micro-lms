import React from 'react';
import { Clock, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface PendingApprovalProps {
    user: {
        name: string;
        email: string;
        registered_at: string;
        days_pending: number;
    };
}

const PendingApproval: React.FC<PendingApprovalProps> = ({ user }) => {
    const getStatusColor = () => {
        if (user.days_pending <= 2) return 'text-blue-600';
        if (user.days_pending <= 7) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getStatusMessage = () => {
        if (user.days_pending <= 2) {
            return 'Your registration is being reviewed. This usually takes 24-48 hours.';
        }
        if (user.days_pending <= 7) {
            return 'Your registration is still under review. Please be patient as we verify your information.';
        }
        return 'Your registration is taking longer than usual. Please contact support if you have concerns.';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-md w-full">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-200/50 p-8 text-center">
                    {/* Status Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <Clock className="w-10 h-10 text-white animate-spin" style={{
                                animation: 'spin 3s linear infinite'
                            }} />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Account Pending Approval
                    </h1>

                    {/* User Info */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <p className="text-gray-700 font-medium">Welcome, {user.name}!</p>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>

                    {/* Status Message */}
                    <div className="mb-6">
                        <div className={`flex items-center justify-center mb-3 ${getStatusColor()}`}>
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span className="font-semibold">
                                Pending for {user.days_pending} day{user.days_pending !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            {getStatusMessage()}
                        </p>
                    </div>

                    {/* Registration Details */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Registration Submitted
                        </h3>
                        <p className="text-sm text-gray-600">
                            Registered on {user.registered_at}
                        </p>
                    </div>

                    {/* What's Being Reviewed */}
                    <div className="mb-8 text-left">
                        <h3 className="font-semibold text-gray-800 mb-4 text-center">What We're Reviewing:</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">Student information verification</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">Payment slip validation</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">Batch availability confirmation</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <div className="flex items-center justify-center mb-2">
                            <Mail className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-sm font-semibold text-green-800">Need Help?</span>
                        </div>
                        <p className="text-xs text-green-700 leading-relaxed">
                            If you have questions about your registration status, please contact us at 
                            <br />
                            <span className="font-medium">support@microlms.com</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <a
                            href="/"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </a>
                        
                        <button
                            onClick={() => {
                                // Handle logout - this would be implemented in your Laravel/Inertia setup
                                fetch('/logout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                                    }
                                }).then(() => {
                                    window.location.href = '/';
                                });
                            }}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            You will receive an email notification once your account is approved. 
                            Please check your spam folder if you don't see it in your inbox.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PendingApproval;