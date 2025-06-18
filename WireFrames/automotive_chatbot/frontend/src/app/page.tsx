'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface RasaResponse {
  text?: string;
  buttons?: Array<{
    title: string;
    payload: string;
  }>;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hello! Welcome to CleverCompanion, your Singapore Automotive Assistant. I can help you with:
      
• COE prices and trends
• Vehicle recommendations 
• Test drive bookings
• Maintenance guides
• Financing options

How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: `user_${Date.now()}`,
          message: messageText
        })
      });

      if (response.ok) {
        const data: RasaResponse[] = await response.json();
        
        if (data && data.length > 0) {
          data.forEach((botResponse, index) => {
            setTimeout(() => {
              const botMessage: Message = {
                id: `${Date.now()}_${index}`,
                text: botResponse.text || 'I understand your message, but I\'m not sure how to respond right now.',
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botMessage]);
            }, index * 500);
          });
        } else {
          const fallbackMessage: Message = {
            id: Date.now().toString(),
            text: 'I apologize, but I\'m having trouble understanding your request. Could you please try rephrasing?',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, fallbackMessage]);
        }
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'I\'m experiencing technical difficulties. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const formatMessage = (text: string) => {
    // Enhanced formatting for COE data and other structured content
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/•/g, '&bull;')
      .replace(/\n/g, '<br>')
      .replace(/(CAT [ABCE])/g, '<span class="coe-category">$1</span>')
      .replace(/\$([0-9,]+)/g, '<span class="price-highlight">$$$1</span>')
      .replace(/(⬇️|⬆️|📈|📊|💰)/g, '<span class="emoji-highlight">$1</span>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🚗</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CleverCompanion
                </h1>
                <p className="text-sm text-gray-600">Singapore Automotive Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard" 
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Admin Dashboard
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['COE Prices', 'Test Drive', 'Maintenance', 'Contact Us'].map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {action === 'COE Prices' && '💰'}
                  {action === 'Test Drive' && '🚗'}
                  {action === 'Maintenance' && '🔧'}
                  {action === 'Contact Us' && '📞'}
                </div>
                <span className="text-sm font-medium text-gray-700">{action}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h3 className="text-white font-semibold text-lg">Chat with CleverCompanion</h3>
            <p className="text-indigo-100 text-sm">Get instant help with your automotive needs</p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  <div 
                    className={`text-sm leading-relaxed ${message.sender === 'bot' ? 'formatted-content' : ''}`}
                    dangerouslySetInnerHTML={{ 
                      __html: message.sender === 'bot' ? formatMessage(message.text) : message.text 
                    }}
                  />
                  <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('en-SG', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">CleverCompanion is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                  }}
                />
              </div>
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">➤</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .formatted-content .coe-category {
          color: #1e40af;
          font-weight: 600;
        }
        .formatted-content .price-highlight {
          color: #059669;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        .formatted-content .emoji-highlight {
          font-size: 1.1em;
        }
        .formatted-content strong {
          color: #1f2937;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}