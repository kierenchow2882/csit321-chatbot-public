import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

// Extend the Window interface to include CleverCompanion
declare global {
  interface Window {
    CleverCompanionWidget?: {
      open: () => void;
      close: () => void;
      sendMessage?: (message: string) => void;
    };
    startChat?: () => void;
  }
}

const ChatBot: React.FC = () => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if CleverCompanion widget is available
    const checkWidget = () => {
      if (window.CleverCompanionWidget) {
        console.log('✅ CleverCompanion Widget detected and ready!');
        setIsWidgetReady(true);
        setIsChecking(false);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkWidget()) return;

    // Load the CleverCompanion script if not already loaded
    const existingScript = document.querySelector('script[src*="clevercompanion-widget.js"]');

    if (!existingScript) {
      console.log('Loading CleverCompanion widget script...');
      const script = document.createElement('script');
      script.src = 'http://localhost:3000/clevercompanion-widget.js';
      script.async = true;

      script.onload = () => {
        console.log('CleverCompanion script loaded successfully');
        // Give it a moment to initialize
        setTimeout(() => {
          if (checkWidget()) return;

          // Keep checking for widget availability
          const interval = setInterval(() => {
            if (checkWidget()) {
              clearInterval(interval);
            }
          }, 100);

          // Stop checking after 10 seconds
          setTimeout(() => {
            clearInterval(interval);
            if (!window.CleverCompanionWidget) {
              console.log('❌ CleverCompanion Widget not available after timeout');
              setIsChecking(false);
            }
          }, 10000);
        }, 500);
      };

      script.onerror = () => {
        console.error('❌ Failed to load CleverCompanion script. Make sure the service is running on http://localhost:3000');
        setIsChecking(false);
      };

      document.head.appendChild(script);
    } else {
      console.log('CleverCompanion script already exists, checking widget...');
      // Script already exists, just check for widget
      const interval = setInterval(() => {
        if (checkWidget()) {
          clearInterval(interval);
        }
      }, 100);

      // Stop checking after 5 seconds if script already exists
      setTimeout(() => {
        clearInterval(interval);
        if (!window.CleverCompanionWidget) {
          console.log('❌ CleverCompanion Widget not available');
          setIsChecking(false);
        }
      }, 5000);
    }
  }, []);

  const handleChatClick = () => {
    console.log('Chat button clicked');
    console.log('Widget ready:', isWidgetReady);
    console.log('CleverCompanionWidget available:', !!window.CleverCompanionWidget);

    if (window.CleverCompanionWidget) {
      try {
        console.log('Opening CleverCompanion widget...');
        window.CleverCompanionWidget.open();
      } catch (error) {
        console.error('Error opening CleverCompanion widget:', error);
        alert('Error opening chat. Please try again.');
      }
    } else if (window.startChat) {
      console.log('Using fallback startChat function...');
      window.startChat();
    } else {
      console.log('No chat methods available');
      alert('Chat service is not available at the moment. Please make sure the CleverCompanion service is running on http://localhost:3000');
    }
  };

  // Don't render if we're still checking and no widget is ready
  if (isChecking && !isWidgetReady) {
    return (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="flex items-center justify-center p-4 rounded-full bg-gray-400 text-white shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        </div>
    );
  }

  return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
            onClick={handleChatClick}
            disabled={!isWidgetReady}
            className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-200 ${
                isWidgetReady
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transform hover:scale-105'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            aria-label="Open chat"
            title={isWidgetReady ? "Chat with us" : "Chat service loading..."}
        >
          <MessageSquare size={24} />
        </button>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
            <div className="absolute bottom-16 right-0 bg-black text-white text-xs p-2 rounded opacity-75 pointer-events-none">
              Widget: {isWidgetReady ? '✅' : '❌'}<br/>
              Checking: {isChecking ? '🔄' : '✅'}
            </div>
        )}
      </div>
  );
};

export default ChatBot;