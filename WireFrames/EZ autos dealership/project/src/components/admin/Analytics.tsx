import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, DollarSign, Users, MessageSquare, Car, Star, TrendingUp, Activity } from 'lucide-react';
import { getAnalytics } from '../../lib/api';

interface AnalyticsData {
  overview_stats: {
    total_users: number;
    new_users: number;
    total_test_drives: number;
    total_chat_sessions: number;
    estimated_revenue: number;
    newsletter_subscribers: number;
    pending_inquiries: number;
  };
  user_activity: Array<{
    date: string;
    visits: number;
    signups: number;
  }>;
  mongodb_stats: {
    total_vehicles: number;
    featured_vehicles: number;
    available_vehicles: number;
    total_test_drives: number;
    pending_test_drives: number;
    approved_test_drives: number;
    completed_test_drives: number;
    total_chat_messages: number;
    user_messages: number;
    bot_messages: number;
    chat_interactions: Array<{
      name: string;
      value: number;
    }>;
    total_feedback: number;
    average_rating: number;
    rating_distribution: Array<{
      rating: number;
      count: number;
    }>;
    total_team_members: number;
    active_team_members: number;
  };
  time_range: string;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await getAnalytics(parseInt(timeRange));
      setData(analyticsData);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error || 'No data available'}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
          <div className="flex gap-4">
            {[
              { value: '7', label: '7 days' },
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
              { value: '365', label: '1 year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{data.time_range}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Total Users', 
            value: data.overview_stats.total_users.toLocaleString(), 
            change: `+${data.overview_stats.new_users} new`,
            icon: Users, 
            color: 'bg-blue-500' 
          },
          { 
            title: 'Test Drives', 
            value: data.overview_stats.total_test_drives.toLocaleString(), 
            change: `${data.mongodb_stats.pending_test_drives} pending`,
            icon: Calendar, 
            color: 'bg-green-500' 
          },
          { 
            title: 'Chat Sessions', 
            value: data.overview_stats.total_chat_sessions.toLocaleString(), 
            change: `${data.mongodb_stats.total_chat_messages} messages`,
            icon: MessageSquare, 
            color: 'bg-purple-500' 
          },
          { 
            title: 'Est. Revenue', 
            value: `$${data.overview_stats.estimated_revenue.toLocaleString()}`, 
            change: `${data.mongodb_stats.completed_test_drives} completed`,
            icon: DollarSign, 
            color: 'bg-yellow-500' 
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 p-3 rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Vehicle Inventory</p>
              <p className="text-xl font-semibold text-gray-800">
                {data.mongodb_stats.total_vehicles || 0}
              </p>
              <p className="text-xs text-gray-500">
                {data.mongodb_stats.featured_vehicles || 0} featured
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-pink-500 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Customer Rating</p>
              <p className="text-xl font-semibold text-gray-800">
                {data.mongodb_stats.average_rating || 0}/5
              </p>
              <p className="text-xs text-gray-500">
                {data.mongodb_stats.total_feedback || 0} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-teal-500 p-3 rounded-full">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-xl font-semibold text-gray-800">
                {data.mongodb_stats.active_team_members || 0}
              </p>
              <p className="text-xs text-gray-500">
                {data.mongodb_stats.total_team_members || 0} total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Activity Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.user_activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Visits"
              />
              <Line 
                type="monotone" 
                dataKey="signups" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Sign-ups"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chatbot Interactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Chat Interactions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.mongodb_stats.chat_interactions || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data.mongodb_stats.chat_interactions || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Drive Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Drive Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { status: 'Pending', count: data.mongodb_stats.pending_test_drives || 0 },
                { status: 'Approved', count: data.mongodb_stats.approved_test_drives || 0 },
                { status: 'Completed', count: data.mongodb_stats.completed_test_drives || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {data.mongodb_stats.rating_distribution && data.mongodb_stats.rating_distribution.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Rating Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.mongodb_stats.rating_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;