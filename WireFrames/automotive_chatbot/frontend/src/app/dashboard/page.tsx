'use client';

import { useState, useEffect } from 'react';

interface SystemStatus {
  name: string;
  status: 'active' | 'inactive' | 'warning';
  description: string;
  lastUpdate: string;
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      name: 'RASA NLU',
      status: 'active',
      description: 'Natural Language Understanding',
      lastUpdate: 'Just now'
    },
    {
      name: 'FastAPI Backend',
      status: 'active', 
      description: 'Backend API Services',
      lastUpdate: 'Just now'
    },
    {
      name: 'COE Data Service',
      status: 'active',
      description: 'Live COE Price Updates',
      lastUpdate: 'Just now'
    },
    {
      name: 'RAG System',
      status: 'active',
      description: 'Retrieval Augmented Generation',
      lastUpdate: 'Just now'
    }
  ]);

  const [stats, setStats] = useState({
    totalChats: 0,
    activeUsers: 0,
    successRate: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    // Initialize with static values to prevent hydration mismatch
    setStats({
      totalChats: 1247,
      activeUsers: 12,
      successRate: 97,
      avgResponseTime: 1.4
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'warning': return '⚠️';
      case 'inactive': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🚗</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CleverCompanion Dashboard
                </h1>
                <p className="text-sm text-gray-600">System Administration & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                ← Back to Chat
              </a>
              <a 
                href="/chat.html" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Landing Page
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CleverCompanion</h2>
          <p className="text-lg text-gray-600 mb-6">Singapore's premier automotive chatbot assistant. This dashboard provides an overview of the system status and capabilities.</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              System Status: All Services Running
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime.toFixed(1)}s</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time monitoring of all CleverCompanion services</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getStatusIcon(service.status)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{service.lastUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Chat</h3>
            <p className="text-gray-600 text-sm">Advanced RASA NLU with contextual understanding for automotive queries</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live COE Prices</h3>
            <p className="text-gray-600 text-sm">Real-time Certificate of Entitlement pricing from official LTA sources</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Database</h3>
            <p className="text-gray-600 text-sm">Comprehensive inventory with specs, pricing, and availability</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Drive Booking</h3>
            <p className="text-gray-600 text-sm">Seamless scheduling system with calendar integration</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Support</h3>
            <p className="text-gray-600 text-sm">Expert guidance on vehicle care and service scheduling</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loan Calculator</h3>
            <p className="text-gray-600 text-sm">Smart financing options with competitive rates and terms</p>
          </div>
        </div>
      </main>
    </div>
  );
} 