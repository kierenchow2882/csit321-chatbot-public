import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  useEffect(() => {
    // Check if widget is already available
    if (window.CleverCompanionWidget) {
      setIsWidgetReady(true);
      setIsWidgetLoaded(true);
      return;
    }

    // Listen for widget ready event
    const handleWidgetReady = () => {
      console.log('CleverCompanion widget is ready!');
      setIsWidgetReady(true);
      setIsWidgetLoaded(true);
    };

    // Listen for widget load event
    const handleWidgetLoad = () => {
      console.log('CleverCompanion widget loaded!');
      setIsWidgetLoaded(true);
    };

    window.addEventListener('clevercompanion:ready', handleWidgetReady);
    window.addEventListener('clevercompanion:loaded', handleWidgetLoad);

    // Check periodically if widget becomes available
    const checkWidget = setInterval(() => {
      if (window.CleverCompanionWidget && !isWidgetReady) {
        setIsWidgetReady(true);
        setIsWidgetLoaded(true);
        clearInterval(checkWidget);
      }
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('clevercompanion:ready', handleWidgetReady);
      window.removeEventListener('clevercompanion:loaded', handleWidgetLoad);
      clearInterval(checkWidget);
    };
  }, [isWidgetReady]);

  // Fallback chat button if external widget is not available
  const handleFallbackChat = () => {
    // If external widget is not available, show a simple message
    alert('AI Assistant is currently unavailable. Please contact us at (555) 123-4567 or email info@ezautos.com');
  };

  // If external widget is loaded, it will handle the chat UI
  // This component serves as a fallback and integration helper
  if (isWidgetLoaded && window.CleverCompanionWidget) {
    return null; // External widget handles the UI
  }

  // Fallback UI if external widget is not available
  return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
            onClick={isWidgetReady ? window.startChat : handleFallbackChat}
            className="flex items-center justify-center p-4 rounded-full shadow-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label="Open chat assistant"
            title={isWidgetReady ? "Chat with AI Assistant" : "Contact Support"}
        >
          <MessageSquare size={24} />
        </button>

        {!isWidgetLoaded && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600 max-w-xs">
              <p>AI Assistant loading...</p>
            </div>
        )}
      </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    CleverCompanionWidget?: {
      open: () => void;
      close: () => void;
      sendMessage: (message: string) => void;
      isOpen: () => boolean;
      configure?: (config: any) => void;
      getHistory?: () => any[];
      clearHistory?: () => void;
    };
    startChat?: () => void;
    quickAction?: (action: string) => void;
    ezAutosChat?: {
      start: () => void;
      quickAction: (action: string) => void;
      findFamilyCar: () => void;
      getFinancing: () => void;
      scheduleTestDrive: () => void;
      checkTradeIn: () => void;
      businessHours: () => void;
      getDirections: () => void;
      askAboutVehicle: (make: string, model: string, year: number) => void;
      findInBudget: (budget: number) => void;
    };
  }
}

export default ChatBot;