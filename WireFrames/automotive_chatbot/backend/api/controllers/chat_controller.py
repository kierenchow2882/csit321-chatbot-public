"""
Chat Controller - BCE Framework Compliant
Controllers orchestrate workflows but do NOT directly access entities
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import os

logger = logging.getLogger(__name__)

class ChatController:
    """
    Chat Controller - Orchestrates chat processing workflows
    Following BCE framework: Controllers coordinate, do NOT directly access entities
    """
    
    def __init__(self):
        self.rasa_url = os.getenv("RASA_URL", "http://localhost:5005")
        # Controllers should coordinate through boundaries, not direct entity access
        self.user_context = {}
    
    async def handle_widget_chat(
        self, 
        message: str, 
        user_id: str = "anonymous",
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Main workflow for embeddable widget chat"""
        try:
            enhanced_context = {
                "source": "widget",
                "location": "singapore", 
                "domain": "automotive",
                **(context or {})
            }
            
            response = await self.handle_chat_message(
                message=message,
                user_id=user_id,
                context=enhanced_context
            )
            
            return {
                "success": True,
                "response": response.get("response", ""),
                "user_id": user_id,
                "source": response.get("source", "unknown"),
                "metadata": {
                    "timestamp": datetime.utcnow().isoformat(),
                    "confidence": response.get("confidence", 0.7),
                    "widget_optimized": True
                }
            }
            
        except Exception as e:
            logger.error(f"Widget chat error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "I'm sorry, I encountered an error. Please try again.",
                "user_id": user_id,
                "source": "error"
            }
    
    async def handle_chat_message(
        self, 
        message: str, 
        user_id: str = "anonymous",
        session_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Main chat message processing workflow"""
        try:
            if not message or len(message.strip()) < 1:
                return self._format_error_response("Message cannot be empty", user_id, session_id)
            
            if self._is_coe_related_query(message):
                return await self._handle_coe_query(message, context or {})
            
            if self._is_greeting(message):
                return self._handle_greeting(context or {})
            
            if self._is_vehicle_query(message):
                return await self._handle_vehicle_query(message, context or {})
            
            return self._handle_general_automotive_query(message, context or {})
            
        except Exception as e:
            logger.error(f"Chat processing error: {str(e)}")
            return self._format_error_response(str(e), user_id, session_id)
    
    def _is_coe_related_query(self, message: str) -> bool:
        """Basic COE query detection"""
        coe_keywords = ['coe', 'certificate', 'entitlement', 'bidding', 'premium', 'quota', 'price']
        return any(keyword in message.lower() for keyword in coe_keywords)
    
    def _is_greeting(self, message: str) -> bool:
        """Enhanced greeting detection"""
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
        friendly_responses = ['good', 'fine', 'great', 'well', 'okay', 'not bad', 'alright']
        return any(word in message.lower() for word in greetings + friendly_responses)
    
    def _is_vehicle_query(self, message: str) -> bool:
        """Detect vehicle-related queries"""
        vehicle_keywords = ['car', 'vehicle', 'toyota', 'honda', 'bmw', 'mercedes', 'sedan', 'suv']
        return any(keyword in message.lower() for keyword in vehicle_keywords)
    
    def _handle_greeting(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle greeting messages"""
        response = """Hello! 😊 Welcome to our Singapore automotive chatbot!

I'm here to help you with:
🚗 **Vehicle Information** - Browse our inventory
📊 **COE Prices** - Latest bidding results  
💰 **Pricing** - Complete cost breakdowns
🔧 **Maintenance** - Service schedules
💳 **Financing** - Loan calculations

What can I help you with today?"""
        
        return {
            "response": response,
            "confidence": 0.8,
            "source": "chat_controller",
            "type": "greeting"
        }
    
    async def _handle_vehicle_query(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle vehicle queries - should call through boundaries, not direct entity access"""
        response = """🚗 **Vehicle Information**

I can help you find information about our vehicles! Please tell me:
• What brand are you interested in?
• Any specific model?
• What type of car (sedan, SUV, hatchback)?

Popular choices:
• **Toyota Camry** - Reliable sedan, Category A COE
• **Honda CR-V** - Family SUV, Category B COE
• **BMW 3 Series** - Luxury sedan, Category B COE

Would you like details on any specific vehicle?"""
        
        return {
            "response": response,
            "confidence": 0.7,
            "source": "chat_controller",
            "type": "vehicle_info"
        }
    
    async def _handle_coe_query(self, message: str, context: Dict) -> Dict[str, Any]:
        """Handle COE queries - should call through boundaries, not controllers directly"""
        response = """📊 **Latest COE Prices**

🚗 **Category A** (≤1600cc & 130bhp): $95,000 📈
🚙 **Category B** (>1600cc or >130bhp): $110,000 📈
🏍️ **Category D** (Motorcycles): $9,500 ➡️
🚚 **Category E** (Open): $106,000 📈

💡 **COE Purchase Tips:**
• Consider off-peak months (Mar, Jun, Sep)
• Monitor trends for 2-3 months before purchasing
• Factor in total cost: Car price + COE + fees

*For official prices, visit LTA website*"""
        
        return {
            "response": response,
            "confidence": 0.9,
            "source": "chat_controller",
            "type": "coe_info"
        }
    
    def _handle_general_automotive_query(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle general automotive queries"""
        response = """🚗 **Singapore Automotive Assistant**

I can help you with:
• **Vehicle Search** - Find cars by brand, model, type
• **COE Information** - Current prices and categories
• **Complete Pricing** - Including COE, registration, taxes
• **Financing Options** - Loan calculations and rates
• **Maintenance Guide** - Service schedules and costs
• **Test Drive Booking** - Schedule appointments

Please let me know what specific information you need!"""
        
        return {
            "response": response,
            "confidence": 0.6,
            "source": "chat_controller",
            "type": "general"
        }
    
    def _format_error_response(self, error_message: str, user_id: str, session_id: Optional[str]) -> Dict[str, Any]:
        """Format error responses"""
        return {
            "response": "I apologize for the inconvenience. Please try again or contact our support team.",
            "confidence": 0.0,
            "source": "error",
            "error": error_message,
            "user_id": user_id,
            "session_id": session_id
        } 