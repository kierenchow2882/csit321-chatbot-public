import React, { useState, useEffect } from 'react';
import { getProfile } from '../lib/api';

const SessionStatus: React.FC = () => {
  const [sessionStatus, setSessionStatus] = useState<{
    isAuthenticated: boolean;
    user?: { email: string; id: string };
    role?: string;
  }>({
    isAuthenticated: false
  });

  const checkSession = async () => {
    try {
      const profile = await getProfile();
      setSessionStatus({
        isAuthenticated: true,
        user: profile.user,
        role: profile.role
      });
    } catch (error) {
      setSessionStatus({
        isAuthenticated: false
      });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Status</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 mr-2">Authentication Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm ${
            sessionStatus.isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {sessionStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        {sessionStatus.isAuthenticated && sessionStatus.user && (
          <>
            <div>
              <span className="font-medium text-gray-700">User Email:</span>
              <span className="ml-2 text-gray-600">{sessionStatus.user.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="ml-2 text-gray-600">{sessionStatus.user.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Role:</span>
              <span className="ml-2 text-gray-600">{sessionStatus.role}</span>
            </div>
          </>
        )}
        <button 
          onClick={checkSession}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh Session Status
        </button>
      </div>
    </div>
  );
};

export default SessionStatus;