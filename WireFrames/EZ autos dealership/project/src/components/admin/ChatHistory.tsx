import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Download } from 'lucide-react';
import { getChatHistory } from '../../lib/api';

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
      const data = await getChatHistory();
      setMessages(data);
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

  // Group messages by session and sort them properly
  const groupedMessages = React.useMemo(() => {
    const groups: { [sessionId: string]: ChatMessage[] } = {};

    filteredMessages.forEach(message => {
      if (!groups[message.session_id]) {
        groups[message.session_id] = [];
      }
      groups[message.session_id].push(message);
    });

    // Sort messages within each session by timestamp (oldest first for conversation flow)
    Object.keys(groups).forEach(sessionId => {
      groups[sessionId].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    return groups;
  }, [filteredMessages]);

  // Get all messages in chronological order for display
  const sortedMessages = React.useMemo(() => {
    if (selectedSession) {
      return groupedMessages[selectedSession] || [];
    }

    // If showing all sessions, sort by session and then by timestamp
    const allMessages: ChatMessage[] = [];
    Object.keys(groupedMessages)
        .sort((a, b) => {
          // Sort sessions by the timestamp of their first message (newest sessions first)
          const aFirstMessage = groupedMessages[a][0];
          const bFirstMessage = groupedMessages[b][0];
          return new Date(bFirstMessage.created_at).getTime() - new Date(aFirstMessage.created_at).getTime();
        })
        .forEach(sessionId => {
          allMessages.push(...groupedMessages[sessionId]);
        });

    return allMessages;
  }, [groupedMessages, selectedSession]);

  if (loading) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chat history...</p>
          </div>
        </div>
    );
  }

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
              <option value="">All Sessions ({sessions.length})</option>
              {sessions.map(session => (
                  <option key={session} value={session}>
                    Session {session.slice(-8)} ({groupedMessages[session]?.length || 0} messages)
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

        {sortedMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No chat messages found</p>
              <p className="text-gray-500 text-sm mt-2">
                Chat messages will appear here when customers use the chat widget
              </p>
            </div>
        ) : (
            <div className="space-y-6">
              {/* Session Headers and Messages */}
              {selectedSession ? (
                  // Single session view
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="font-medium text-gray-800">
                        Session: {selectedSession.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {groupedMessages[selectedSession]?.length || 0} messages
                      </p>
                    </div>
                    {sortedMessages
                        .filter(message =>
                            !searchTerm ||
                            message.message.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((message, index) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                  className={`max-w-lg rounded-lg px-4 py-3 ${
                                      message.sender === 'user'
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare size={16} />
                                  <span className="text-sm font-medium">
                        {message.sender === 'user' ? 'Customer' : 'Assistant'}
                      </span>
                                  <span className="text-xs opacity-75">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                                </div>
                                <p className="whitespace-pre-wrap">{message.message}</p>
                              </div>
                            </div>
                        ))}
                  </div>
              ) : (
                  // All sessions view - group by session
                  Object.keys(groupedMessages)
                      .sort((a, b) => {
                        const aFirstMessage = groupedMessages[a][0];
                        const bFirstMessage = groupedMessages[b][0];
                        return new Date(bFirstMessage.created_at).getTime() - new Date(aFirstMessage.created_at).getTime();
                      })
                      .map(sessionId => (
                          <div key={sessionId} className="border rounded-lg p-4">
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    Session: {sessionId.slice(-8)}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {groupedMessages[sessionId].length} messages • Started {new Date(groupedMessages[sessionId][0].created_at).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(sessionId)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View Full Session
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {groupedMessages[sessionId]
                                  .filter(message =>
                                      !searchTerm ||
                                      message.message.toLowerCase().includes(searchTerm.toLowerCase())
                                  )
                                  .slice(0, 4) // Show only first 4 messages in overview
                                  .map((message) => (
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
                                            <MessageSquare size={14} />
                                            <span className="text-xs font-medium">
                              {message.sender === 'user' ? 'Customer' : 'Assistant'}
                            </span>
                                            <span className="text-xs opacity-75">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                                          </div>
                                          <p className="text-sm whitespace-pre-wrap">
                                            {message.message.length > 100
                                                ? message.message.substring(0, 100) + '...'
                                                : message.message
                                            }
                                          </p>
                                        </div>
                                      </div>
                                  ))}

                              {groupedMessages[sessionId].length > 4 && (
                                  <div className="text-center">
                                    <button
                                        onClick={() => setSelectedSession(sessionId)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      View {groupedMessages[sessionId].length - 4} more messages...
                                    </button>
                                  </div>
                              )}
                            </div>
                          </div>
                      ))
              )}
            </div>
        )}
      </div>
  );
};

export default ChatHistory;