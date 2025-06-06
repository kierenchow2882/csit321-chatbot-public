/**
 * Controller Layer: ChatController
 * Handles UI interactions and coordinates between Business layer and Components
 */

import { useState, useCallback } from 'react';
import { ChatService } from '../business/ChatService';
import { ChatMessage } from '../entities/ChatMessage';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  /**
   * React hook for managing chat state
   */
  useChatState() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (messageText: string) => {
      // Validate message
      const validation = this.chatService.validateMessage(messageText);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid message');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create user message
        const userMessage = this.chatService.createMessage(messageText, 'user');
        setMessages(prev => [...prev, userMessage]);

        // Send to bot and get response
        const botResponse = await this.chatService.sendMessage(messageText, sessionId);
        
        // Create bot message
        const botMessage = this.chatService.createMessage(
          botResponse.text,
          'bot',
          'text',
          {
            buttons: botResponse.buttons,
            quick_replies: botResponse.quick_replies,
            image: botResponse.image,
            custom: botResponse.custom,
          }
        );

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to send message');
      } finally {
        setIsLoading(false);
      }
    }, [sessionId]);

    const handleButtonClick = useCallback(async (payload: string, title: string) => {
      const processedPayload = this.chatService.processButtonClick(payload);
      await sendMessage(processedPayload);
    }, [sendMessage]);

    const clearChat = useCallback(() => {
      setMessages([]);
      setError(null);
      setSessionId('');
    }, []);

    const getSuggestedQueries = useCallback(() => {
      return this.chatService.getSuggestedQueries();
    }, []);

    return {
      messages,
      isLoading,
      error,
      sendMessage,
      handleButtonClick,
      clearChat,
      getSuggestedQueries,
    };
  }
}

// Singleton instance for use across components
export const chatController = new ChatController(); 