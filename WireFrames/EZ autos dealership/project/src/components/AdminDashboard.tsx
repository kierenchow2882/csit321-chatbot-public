import React, { useState, useEffect } from 'react';
import { getProfile } from '../lib/api';
import {
  Users, MessageSquare, DollarSign, Search, UserPlus,
  FileText, Calendar, Star, BookOpen, History, AlertCircle
} from 'lucide-react';
import KnowledgeBase from './admin/KnowledgeBase';
import TestDriveBookings from './admin/TestDriveBookings';
import Feedback from './admin/Feedback';
import ChatHistory from './admin/ChatHistory';
import Analytics from './admin/Analytics';
import TeamMembers from './admin/TeamMembers';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const profile = await getProfile();
      if (profile.role !== 'admin') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      window.location.href = '/';
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'team', label: 'Team Management', icon: UserPlus },
    { id: 'chatbot', label: 'Chatbot Settings', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'bookings', label: 'Test Drive Bookings', icon: Calendar },
    { id: 'feedback', label: 'Feedback & Reviews', icon: Star },
    { id: 'chat-history', label: 'Chat History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamMembers />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'bookings':
        return <TestDriveBookings />;
      case 'feedback':
        return <Feedback />;
      case 'chat-history':
        return <ChatHistory />;
      case 'analytics':
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