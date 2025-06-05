import React from 'react';
import { Lock, Shield, ArrowLeft, Mail, HelpCircle, AlertCircle, Key, User } from 'lucide-react';

const Modern403Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-purple-50 to-yellow-50 relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-32 w-16 h-16 bg-yellow-400 rotate-45 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-12 h-12 bg-purple-600 rotate-12 opacity-20 animate-bounce"></div>
        <div className="absolute top-1/3 left-20 w-8 h-8 bg-yellow-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Illustration */}
            <div className="order-2 md:order-1">
              <div className="relative">
                {/* Main lock illustration */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <Lock className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                    <div className="text-center">
                      <div className="text-6xl font-black text-yellow-400 mb-2">403</div>
                      <div className="text-white font-semibold">Access Restricted</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
                  <Shield className="w-6 h-6 text-purple-900" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-pulse">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-1 md:order-2 space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-purple-900 mb-6 leading-tight">
                  Access
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Denied
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  This classroom requires special permissions. Let's check your enrollment status and get you back on track!
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <User className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-1">Check Your Role</h3>
                      <p className="text-gray-600 text-sm">Make sure you have the right permissions for this content</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-600">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 rounded-full p-2">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-1">Batch Enrollment</h3>
                      <p className="text-gray-600 text-sm">You might not be enrolled in the required batch or course</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3">
                  <ArrowLeft className="w-6 h-6" />
                  <span className="text-lg">Go Back</span>
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105">
                    <Mail className="w-5 h-5" />
                    <span>Contact Teacher</span>
                  </button>
                  
                  <button className="bg-white hover:bg-gray-50 text-purple-900 font-semibold py-3 px-6 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105">
                    <HelpCircle className="w-5 h-5" />
                    <span>Get Help</span>
                  </button>
                </div>
              </div>

              {/* Help text */}
              <div className="bg-gradient-to-r from-purple-100 to-yellow-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-gradient-to-r from-purple-600 to-yellow-500 rounded-full p-2">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-900">Need Immediate Help?</h4>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  If you believe this is an error, please contact your administrator or teacher for assistance.
                </p>
                <a href="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                  <span>Contact Support Team</span>
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern403Page;