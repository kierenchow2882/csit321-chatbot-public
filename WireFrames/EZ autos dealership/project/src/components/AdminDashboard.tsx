import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users, MessageSquare, DollarSign, Search, UserPlus,
  FileText, Calendar, Star, BookOpen, History, AlertCircle
} from 'lucide-react';
import KnowledgeBase from './admin/KnowledgeBase';
import TestDriveBookings from './admin/TestDriveBookings';
import Feedback from './admin/Feedback';
import ChatHistory from './admin/ChatHistory';
import Analytics from './admin/Analytics';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'users', label: 'User Management', icon: UserPlus },
    { id: 'chatbot', label: 'Chatbot Settings', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'bookings', label: 'Test Drive Bookings', icon: Calendar },
    { id: 'feedback', label: 'Feedback & Reviews', icon: Star },
    { id: 'chat-history', label: 'Chat History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'knowledge':
        return <KnowledgeBase />;

      case 'bookings':
        return <TestDriveBookings />;

      case 'feedback':
        return <Feedback />;

      case 'chat-history':
        return <ChatHistory />;

      case 'analytics':
        return <Analytics />;

      case 'users':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Add User
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'overview':
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)] fixed">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800 truncate">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;