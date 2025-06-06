/**
 * Entity: ChatMessage
 * Represents a chat message in the automotive chatbot system
 */

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'button' | 'image' | 'quick_reply';
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: Array<{
      entity: string;
      value: string;
      confidence: number;
    }>;
    buttons?: Array<{
      title: string;
      payload: string;
    }>;
    quick_replies?: Array<{
      title: string;
      payload: string;
    }>;
    image?: string;
    custom?: Record<string, any>;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  isActive: boolean;
  startedAt: Date;
  lastActivity: Date;
  context?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  chatHistory: string[]; // Array of session IDs
}

export interface BotResponse {
  text: string;
  buttons?: Array<{
    title: string;
    payload: string;
  }>;
  quick_replies?: Array<{
    title: string;
    payload: string;
  }>;
  image?: string;
  custom?: Record<string, any>;
} 