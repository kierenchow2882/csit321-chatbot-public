/**
 * Business Layer: ChatService
 * Contains all business logic for chat operations
 */

import { ChatMessage, ChatSession, BotResponse } from '../entities/ChatMessage';

export class ChatService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Send a message to the chatbot and get response
   */
  async sendMessage(message: string, sessionId?: string): Promise<BotResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sessionId || this.generateSessionId(),
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatBotResponse(data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message to chatbot');
    }
  }

  /**
   * Format the bot response from RASA format to our entity format
   */
  private formatBotResponse(rasaResponse: any[]): BotResponse {
    if (!rasaResponse || rasaResponse.length === 0) {
      return { text: 'Sorry, I didn\'t understand that.' };
    }

    const firstResponse = rasaResponse[0];
    return {
      text: firstResponse.text || '',
      buttons: firstResponse.buttons || [],
      quick_replies: firstResponse.quick_replies || [],
      image: firstResponse.image,
      custom: firstResponse.custom,
    };
  }

  /**
   * Create a new chat message entity
   */
  createMessage(
    content: string,
    sender: 'user' | 'bot',
    type: 'text' | 'button' | 'image' | 'quick_reply' = 'text',
    metadata?: any
  ): ChatMessage {
    return {
      id: this.generateMessageId(),
      content,
      sender,
      timestamp: new Date(),
      type,
      metadata,
    };
  }

  /**
   * Validate message content
   */
  validateMessage(message: string): { isValid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 1000) {
      return { isValid: false, error: 'Message too long (max 1000 characters)' };
    }

    return { isValid: true };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get suggested automotive queries
   */
  getSuggestedQueries(): string[] {
    return [
      'What are the maintenance requirements for my car?',
      'How often should I change my oil?',
      'What does the check engine light mean?',
      'How do I check my tire pressure?',
      'When should I replace my brake pads?',
      'What are the signs of transmission problems?',
    ];
  }

  /**
   * Process button click
   */
  processButtonClick(payload: string): string {
    // Business logic for processing button payloads
    if (payload.startsWith('/')) {
      return payload; // Intent payload
    }
    return payload; // Regular text payload
  }
} 