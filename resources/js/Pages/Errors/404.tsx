import React from 'react';
import { Home, Search, BookOpen, Users, Calendar, ArrowRight, Star } from 'lucide-react';

const Modern404Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full opacity-5 animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            {/* Large 404 with modern styling */}
            <div className="relative mb-8">
              <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 border border-white/20">
                  <Search className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Page Not Found
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                Looks like this lesson took a detour! Don't worry, we'll help you find your way back to learning.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3">
                <Home className="w-6 h-6" />
                <span className="text-lg">Back to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/20 hover:border-white/40 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3">
                <Search className="w-6 h-6" />
                <span className="text-lg">Search Content</span>
              </button>
            </div>

            {/* Quick navigation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">My Classes</h3>
                <p className="text-purple-200 text-sm">View your enrolled classes and upcoming sessions</p>
              </div>

              <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Study Groups</h3>
                <p className="text-purple-200 text-sm">Join your batch mates and collaborate</p>
              </div>

              <div className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Schedule</h3>
                <p className="text-purple-200 text-sm">Check your upcoming quizzes and classes</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-purple-200 mb-4">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Need help? Our support team is here for you</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <a href="#" className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
              <span className="text-sm font-medium">Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern404Page;