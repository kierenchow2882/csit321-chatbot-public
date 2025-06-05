import { ChatService } from '../business/ChatService';

export interface RasaData {
  intents: Array<{
    name: string;
    examples: string[];
  }>;
  responses: Array<{
    name: string;
    text: string[];
  }>;
  stories: Array<{
    name: string;
    steps: Array<{
      intent?: string;
      action?: string;
      entities?: any[];
    }>;
  }>;
}

export class RasaController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  async loadRasaData(): Promise<RasaData> {
    try {
      // In a real implementation, this would fetch from your backend
      // For now, return sample data
      return {
        intents: [
          {
            name: 'greet',
            examples: [
              'hello',
              'hi',
              'hey there',
              'good morning',
              'good evening'
            ]
          },
          {
            name: 'ask_pricing',
            examples: [
              'what are your prices?',
              'how much does it cost?',
              'pricing information',
              'tell me about COE pricing'
            ]
          },
          {
            name: 'ask_vehicle_info',
            examples: [
              'tell me about cars',
              'vehicle specifications',
              'car features',
              'automotive information'
            ]
          }
        ],
        responses: [
          {
            name: 'utter_greet',
            text: [
              'Hello! I\'m your automotive assistant. How can I help you today?',
              'Hi there! Welcome to our automotive service. What can I do for you?',
              'Greetings! I\'m here to help with all your automotive needs.'
            ]
          },
          {
            name: 'utter_pricing',
            text: [
              'Our pricing starts at $29.99/month. We offer special COE discounts for Singapore automotive businesses!',
              'We have three tiers: Starter ($29.99), Professional ($79.99), and Enterprise ($199.99). All with COE discounts available!'
            ]
          },
          {
            name: 'utter_vehicle_info',
            text: [
              'I can help you with vehicle specifications, maintenance tips, and automotive services. What specific information do you need?',
              'Our automotive database includes comprehensive vehicle information. What would you like to know?'
            ]
          }
        ],
        stories: [
          {
            name: 'greet_and_ask_pricing',
            steps: [
              { intent: 'greet' },
              { action: 'utter_greet' },
              { intent: 'ask_pricing' },
              { action: 'utter_pricing' }
            ]
          },
          {
            name: 'vehicle_inquiry',
            steps: [
              { intent: 'ask_vehicle_info' },
              { action: 'utter_vehicle_info' }
            ]
          }
        ]
      };
    } catch (error) {
      console.error('Error loading RASA data:', error);
      throw new Error('Failed to load RASA data');
    }
  }

  async saveRasaData(data: RasaData): Promise<void> {
    try {
      // In a real implementation, this would save to your backend
      // For now, just log the data
      console.log('Saving RASA data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically:
      // 1. Convert the data to RASA format (YAML)
      // 2. Save to backend/data/ directory
      // 3. Trigger RASA model retraining
      
      console.log('RASA data saved successfully');
    } catch (error) {
      console.error('Error saving RASA data:', error);
      throw new Error('Failed to save RASA data');
    }
  }

  async trainModel(): Promise<void> {
    try {
      // In a real implementation, this would trigger RASA training
      console.log('Starting RASA model training...');
      
      // Simulate training process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('RASA model training completed');
    } catch (error) {
      console.error('Error training RASA model:', error);
      throw new Error('Failed to train RASA model');
    }
  }

  async getModelStatus(): Promise<{ status: string; lastTrained?: Date }> {
    try {
      // In a real implementation, this would check model status
      return {
        status: 'ready',
        lastTrained: new Date()
      };
    } catch (error) {
      console.error('Error getting model status:', error);
      throw new Error('Failed to get model status');
    }
  }
} 