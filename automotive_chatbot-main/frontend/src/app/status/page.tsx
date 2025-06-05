'use client';

import React, { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'checking' | 'online' | 'offline' | 'error';
  url: string;
  responseTime?: number;
  lastChecked?: Date;
  error?: string;
}

const StatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Backend API',
      status: 'checking',
      url: 'http://localhost:8000/health'
    },
    {
      name: 'MongoDB',
      status: 'checking',
      url: 'http://localhost:8000/api/chatbots/health'
    },
    {
      name: 'RASA Server',
      status: 'checking',
      url: 'http://localhost:5005/status'
    },
    {
      name: 'Frontend Server',
      status: 'online', // Always online if we can see this page
      url: 'http://localhost:3000'
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    checkAllServices();
    
    if (autoRefresh) {
      const interval = setInterval(checkAllServices, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const checkService = async (service: ServiceStatus): Promise<ServiceStatus> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(service.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          ...service,
          status: 'online',
          responseTime,
          lastChecked: new Date(),
          error: undefined
        };
      } else {
        return {
          ...service,
          status: 'error',
          responseTime,
          lastChecked: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        ...service,
        status: 'offline',
        responseTime,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkAllServices = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        if (service.name === 'Frontend Server') {
          return {
            ...service,
            status: 'online' as const,
            lastChecked: new Date(),
            responseTime: 0
          };
        }
        return await checkService(service);
      })
    );
    
    setServices(updatedServices);
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'error':
        return 'text-yellow-600 bg-yellow-100';
      case 'checking':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return '✅';
      case 'offline':
        return '❌';
      case 'error':
        return '⚠️';
      case 'checking':
        return '🔄';
      default:
        return '❓';
    }
  };

  const overallStatus = services.every(s => s.status === 'online') ? 'All Systems Operational' :
                       services.some(s => s.status === 'offline') ? 'Some Services Down' :
                       'Partial Outage';

  const overallColor = services.every(s => s.status === 'online') ? 'text-green-600' :
                       services.some(s => s.status === 'offline') ? 'text-red-600' :
                       'text-yellow-600';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
              <p className={`text-lg font-medium mt-2 ${overallColor}`}>
                {overallStatus}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg ${
                  autoRefresh 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              <button
                onClick={checkAllServices}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Service Status</h2>
          
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(service.status)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.url}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </span>
                    {service.responseTime !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">
                        {service.responseTime}ms
                      </p>
                    )}
                  </div>
                </div>
                
                {service.lastChecked && (
                  <div className="mt-3 text-sm text-gray-500">
                    Last checked: {service.lastChecked.toLocaleTimeString()}
                  </div>
                )}
                
                {service.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      <strong>Error:</strong> {service.error}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connection Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Connection Instructions</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">MongoDB Connection</h3>
              <p className="text-sm text-gray-600 mt-1">
                Make sure MongoDB is running on localhost:27017 or update the connection string in your .env file.
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                MONGODB_URL=mongodb://localhost:27017
              </code>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Backend Server</h3>
              <p className="text-sm text-gray-600 mt-1">
                Start the FastAPI backend server:
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                cd backend && python -m uvicorn api.main:app --reload --port 8000
              </code>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">RASA Server</h3>
              <p className="text-sm text-gray-600 mt-1">
                Start the RASA server:
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                cd backend && rasa run --enable-api --cors "*" --port 5005
              </code>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Frontend Server</h3>
              <p className="text-sm text-gray-600 mt-1">
                Start the Next.js frontend server:
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                cd frontend && npm run dev
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage; 