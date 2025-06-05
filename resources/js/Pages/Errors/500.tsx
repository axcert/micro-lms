import React, { useState, useEffect } from 'react';
import { RefreshCw, Home, AlertTriangle, Clock, Wifi, Server, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Modern500Page = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState([
    { name: 'Database', status: 'error', icon: Server },
    { name: 'API Services', status: 'warning', icon: Wifi },
    { name: 'File Storage', status: 'ok', icon: CheckCircle },
  ]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsRetrying(false);
      // Simulate some improvement in system status
      if (retryCount >= 2) {
        setSystemStatus(prev => prev.map(service => 
          service.name === 'API Services' ? { ...service, status: 'ok' } : service
        ));
      }
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return CheckCircle;
      case 'warning': return Clock;
      case 'error': return XCircle;
      default: return XCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-40 animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-100 rounded-full opacity-20 animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            {/* Error illustration */}
            <div className="relative mb-8">
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border border-gray-100">
                <div className="relative">
                  {/* Glitchy 500 effect */}
                  <div className="relative">
                    <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-yellow-500 to-purple-600 animate-pulse">
                      500
                    </div>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500 opacity-20 transform translate-x-1 translate-y-1">
                      500
                    </div>
                  </div>
                  
                  {/* Central server icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
                      <Server className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Floating warning icons */}
                  <div className="absolute top-0 right-0 bg-red-500 rounded-full p-2 animate-bounce">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 bg-yellow-500 rounded-full p-2 animate-pulse">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Server is Taking a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-500">
                  Study Break
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our servers are having a moment of reflection. Don't worry, your progress is safe and we're working hard to get everything back online!
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">System Status</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {systemStatus.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                const ServiceIcon = service.icon;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-purple-100 rounded-full p-3">
                        <ServiceIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <StatusIcon className={`w-6 h-6 ${getStatusColor(service.status)}`} />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{service.name}</h4>
                    <div className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                      {service.status === 'ok' ? 'Operational' : service.status === 'warning' ? 'Degraded' : 'Down'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-400 disabled:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <RefreshCw className={`w-6 h-6 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="text-lg">
                {isRetrying ? `Retrying... (${retryCount})` : 'Try Again'}
              </span>
            </button>
            
            <button className="group bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3">
              <Home className="w-6 h-6" />
              <span className="text-lg">Return Home</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Progress indicator */}
          {isRetrying && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="text-gray-700 font-medium">Attempting to reconnect...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {/* Help section */}
          <div className="bg-gradient-to-r from-purple-100 to-yellow-100 rounded-3xl p-8 text-center border border-purple-200">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Still Having Issues?</h4>
            <p className="text-gray-600 mb-6">
              Our technical team has been notified and is working on a solution. In the meantime, here are some helpful resources:
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-purple-600 font-semibold py-3 px-6 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200">
                <span>System Status</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <a href="#" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <a href="#" className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern500Page;