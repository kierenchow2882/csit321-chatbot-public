'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ConfigStatus {
  [key: string]: {
    exists: boolean;
    valid?: boolean;
    size?: number;
    modified?: string;
    error?: string;
    summary?: any;
  };
}

const AdminDashboard = () => {
  const router = useRouter();
  const [status, setStatus] = useState<ConfigStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check if admin token exists in localStorage
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadStatus(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (adminToken: string) => {
    try {
      // Test the token with a simple API call
      const response = await fetch('/api/admin/status', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        setToken(adminToken);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', adminToken);
        loadStatus(adminToken);
      } else {
        alert('Invalid admin token');
      }
    } catch (error) {
      alert('Error validating token');
    }
  };

  const loadStatus = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/status', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setToken('');
    setStatus({});
  };

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}?token=${encodeURIComponent(token)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const getStatusColor = (fileStatus: any) => {
    if (!fileStatus.exists) return 'text-red-500';
    if (fileStatus.valid === false) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusIcon = (fileStatus: any) => {
    if (!fileStatus.exists) return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
    if (fileStatus.valid === false) return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
    return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Chatbot Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin Panel</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            title="Stories"
            description="Manage conversation flows"
            icon={<BookOpenIcon className="w-8 h-8" />}
            onClick={() => navigateTo('stories')}
            status={status.stories}
          />
          <QuickActionCard
            title="Intents & NLU"
            description="Manage training data"
            icon={<DocumentTextIcon className="w-8 h-8" />}
            onClick={() => navigateTo('nlu')}
            status={status.nlu}
          />
          <QuickActionCard
            title="Configuration"
            description="System settings"
            icon={<Cog6ToothIcon className="w-8 h-8" />}
            onClick={() => navigateTo('config')}
            status={status.domain}
          />
          <QuickActionCard
            title="Analytics"
            description="Usage statistics"
            icon={<ChartBarIcon className="w-8 h-8" />}
            onClick={() => navigateTo('analytics')}
          />
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(status).map(([key, fileStatus]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                    {getStatusIcon(fileStatus)}
                  </div>
                  <p className={`text-sm ${getStatusColor(fileStatus)}`}>
                    {!fileStatus.exists ? 'File missing' :
                     fileStatus.valid === false ? `Error: ${fileStatus.error}` :
                     'Active'}
                  </p>
                  {fileStatus.summary && (
                    <div className="mt-2 text-xs text-gray-500">
                      {key === 'stories' && `${fileStatus.summary.total_stories} stories`}
                      {key === 'nlu' && `${fileStatus.summary.total_intents} intents, ${fileStatus.summary.total_examples} examples`}
                      {key === 'rules' && `${fileStatus.summary.total_rules} rules`}
                      {key === 'domain' && `${fileStatus.summary.intents} intents, ${fileStatus.summary.responses} responses`}
                    </div>
                  )}
                  {fileStatus.modified && (
                    <div className="mt-1 text-xs text-gray-400 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(fileStatus.modified).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training & Deployment */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Training & Deployment</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigateTo('training')}
                className="flex items-center justify-center px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Train Model
              </button>
              <button
                onClick={() => navigateTo('models')}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                View Models
              </button>
              <button
                onClick={() => navigateTo('backup')}
                className="flex items-center justify-center px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                Backup Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon, onClick, status }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  status?: any;
}) => {
  const isHealthy = status?.exists && status?.valid !== false;
  
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow cursor-pointer transition-all hover:shadow-lg border-l-4 ${
        isHealthy ? 'border-green-500' : 'border-red-500'
      }`}
    >
      <div className="flex items-center">
        <div className={`${isHealthy ? 'text-blue-600' : 'text-red-600'} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          {status && (
            <div className="mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isHealthy ? 'Healthy' : 'Needs Attention'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onLogin(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your admin token to access the dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token" className="sr-only">
              Admin Token
            </label>
            <input
              id="token"
              name="token"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Admin token (starts with admin_)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              For demo purposes, use: <code className="bg-gray-100 px-1 rounded">admin_demo_token</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard; 