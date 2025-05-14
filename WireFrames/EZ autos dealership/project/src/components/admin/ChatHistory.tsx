import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, MessageSquare, Download } from 'lucide-react';

interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  message: string;
  sender: string;
  created_at: string;
}

const ChatHistory: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sessions = Array.from(new Set(messages.map(m => m.session_id)));

  const filteredMessages = selectedSession
    ? messages.filter(m => m.session_id === selectedSession)
    : messages;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedSession || ''}
            onChange={(e) => setSelectedSession(e.target.value || null)}
          >
            <option value="">All Sessions</option>
            {sessions.map(session => (
              <option key={session} value={session}>
                Session {session.slice(0, 8)}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredMessages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} />
                <span className="text-sm font-medium">
                  {message.sender === 'user' ? 'User' : 'Bot'}
                </span>
                <span className="text-xs opacity-75">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;