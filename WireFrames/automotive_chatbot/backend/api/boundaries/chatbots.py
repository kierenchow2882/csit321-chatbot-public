from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
import json
import os

# STRICT BCE: NO DIRECT SERVICE IMPORTS IN BOUNDARIES!
# Boundaries should only handle HTTP requests/responses
# All business logic goes through Controllers

# Import authentication dependency  
from api.auth import get_current_user

router = APIRouter()

# HTTP Request/Response models
class PricingTier(BaseModel):
    name: str
    price: float
    currency: str
    billing_period: str
    features: List[str]
    limits: dict

class PricingResponse(BaseModel):
    tiers: List[PricingTier]
    coe_discount: float
    coe_requirements: List[str]

class ChatMessage(BaseModel):
    message: str
    user_id: str = "anonymous"

class ChatbotBase(BaseModel):
    name: str
    description: Optional[str] = None
    domain: str
    welcome_message: str
    theme: dict = {
        "primary_color": "#007bff",
        "secondary_color": "#6c757d",
        "font_family": "Arial"
    }

class ChatbotCreate(ChatbotBase):
    pass

class ChatbotResponse(ChatbotBase):
    id: str
    created_at: datetime
    updated_at: datetime
    owner_id: str
    status: str
    embed_code: str

    class Config:
        json_encoders = {
            ObjectId: str
        }

# Pricing endpoint - delegate to controller for business logic
@router.get("/pricing", response_model=PricingResponse)
async def get_pricing():
    """🌐 BOUNDARY: Get pricing information including COE discounts"""
    try:
        # Delegate business logic to controller
        from api.controllers.chatbot_controller import ChatbotController
        controller = ChatbotController()
        
        pricing_data = await controller.get_pricing_information()
        return pricing_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy pricing data structure for backwards compatibility
def _get_pricing_tiers():
    """Legacy structure - moved to controller"""
    tiers = [
        PricingTier(
            name="Starter",
            price=29.99,
            currency="USD",
            billing_period="monthly",
            features=[
                "1 Chatbot",
                "1,000 messages/month",
                "Basic customization",
                "Email support",
                "Standard integrations"
            ],
            limits={
                "chatbots": 1,
                "messages_per_month": 1000,
                "custom_domains": 0,
                "api_calls": 5000
            }
        ),
        PricingTier(
            name="Professional",
            price=79.99,
            currency="USD",
            billing_period="monthly",
            features=[
                "5 Chatbots",
                "10,000 messages/month",
                "Advanced customization",
                "Priority support",
                "All integrations",
                "Custom domains",
                "Analytics dashboard"
            ],
            limits={
                "chatbots": 5,
                "messages_per_month": 10000,
                "custom_domains": 3,
                "api_calls": 50000
            }
        ),
        PricingTier(
            name="Enterprise",
            price=199.99,
            currency="USD",
            billing_period="monthly",
            features=[
                "Unlimited Chatbots",
                "100,000 messages/month",
                "White-label solution",
                "24/7 phone support",
                "Custom integrations",
                "Unlimited domains",
                "Advanced analytics",
                "SLA guarantee"
            ],
            limits={
                "chatbots": -1,  # -1 means unlimited
                "messages_per_month": 100000,
                "custom_domains": -1,
                "api_calls": 500000
            }
        )
    ]
    
    return PricingResponse(
        tiers=tiers,
        coe_discount=0.15,  # 15% COE discount
        coe_requirements=[
            "Valid Certificate of Entitlement (COE)",
            "Singapore vehicle registration",
            "Automotive industry verification",
            "Minimum 6-month subscription"
        ]
    )

# COE endpoint - delegate to controller
@router.get("/coe-prices")
async def get_coe_prices():
    """🌐 BOUNDARY: Get latest COE bidding results from LTA"""
    try:
        # Delegate business logic to COE controller
        from api.controllers.coe_controller import COEService as COEController
        controller = COEController()
        
        coe_data = await controller.get_latest_coe_prices()
        return coe_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch COE data: {str(e)}")

# Chat endpoint for the widget
@router.post("/chat")
async def chat_with_bot(request: Request, message_data: ChatMessage):
    """Handle chat messages from the widget"""
    try:
        message = message_data.message
        user_id = message_data.user_id
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Process message with enhanced AI responses
        response = await process_message_enhanced(message, user_id)
        
        return {"response": response, "user_id": user_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_message_enhanced(message: str, user_id: str) -> str:
    """
    Enhanced message processing with real COE data and smarter responses
    Implements BCE framework - Controller Layer
    """
    
    message_lower = message.lower()
    
    # COE-related queries
    if any(word in message_lower for word in ["coe", "certificate of entitlement", "coe price", "coe bidding"]):
        try:
            lta_api_key = os.getenv("LTA_API_KEY")
            coe_data = await coe_service.get_latest_coe_prices(lta_api_key)
            return coe_service.format_coe_response(coe_data)
        except Exception as e:
            return "I'm having trouble fetching the latest COE prices. Please try again later. In the meantime, I can help you with other automotive queries!"
    
    # Pricing queries
    elif any(word in message_lower for word in ["price", "cost", "pricing", "subscription"]):
        return "Our chatbot platform pricing starts at $29.99/month. We offer special COE discounts for Singapore automotive businesses! Would you like to know more about our pricing tiers?"
    
    # Greetings
    elif any(word in message_lower for word in ["hello", "hi", "hey", "good morning", "good evening"]):
        return "Hello! I'm CleverCompanion, your intelligent assistant. I can help you with:\n• Latest COE prices\n• Vehicle information\n• Service recommendations\n• Platform pricing\n\nWhat would you like to know?"
    
    # Vehicle-related queries
    elif any(word in message_lower for word in ["car", "vehicle", "auto", "motorcycle", "bike"]):
        return "I can help you with automotive information! Are you looking for:\n• Latest COE prices for vehicle categories\n• Vehicle specifications\n• Maintenance tips\n• Registration guidance\n\nJust let me know what specific information you need!"
    
    # Help requests
    elif any(word in message_lower for word in ["help", "support", "assist"]):
        return "I'm here to help! I can assist with:\n• 🚗 Latest COE bidding results\n• 💰 Vehicle financing information\n• 📋 Registration procedures\n• 🔧 Maintenance guidance\n• 💼 Platform pricing and features\n\nWhat do you need help with?"
    
    # Registration/documentation queries
    elif any(word in message_lower for word in ["register", "registration", "paperwork", "documents"]):
        return "For vehicle registration in Singapore, you'll need:\n• Valid COE (Certificate of Entitlement)\n• Insurance coverage\n• Vehicle inspection report\n• Identification documents\n\nWould you like me to check the latest COE prices for your vehicle category?"
    
    # Default response with suggestions
    else:
        return "Thank you for your message! I'm CleverCompanion, your intelligent assistant specialized in Singapore's vehicle market. I can help with:\n\n🚗 **Latest COE Prices** - Real-time bidding results\n💰 **Vehicle Costs** - Pricing and financing\n📋 **Registration** - Documentation guidance\n🔧 **Maintenance** - Service recommendations\n\nCould you please be more specific about what you're looking for?"

@router.post("/", response_model=ChatbotResponse)
async def create_chatbot(request: Request, chatbot: ChatbotCreate, current_user: dict = Depends(get_current_user)):
    """🌐 BOUNDARY: Create a new chatbot - delegates to controller"""
    try:
        # Delegate business logic to controller
        from api.controllers.chatbot_controller import ChatbotController
        controller = ChatbotController()
        
        result = await controller.create_chatbot(
            name=chatbot.name,
            description=chatbot.description or "",
            owner_id=current_user["id"],
            config={
                "domain": chatbot.domain,
                "welcome_message": chatbot.welcome_message,
                "theme": chatbot.theme
            }
        )
        
        # Transform controller response to HTTP response model
        return ChatbotResponse(
            id=result["chatbot_id"],
            name=result["name"],
            description=chatbot.description or "",
            domain=chatbot.domain,
            welcome_message=chatbot.welcome_message,
            theme=chatbot.theme,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            owner_id=current_user["id"],
            status="active",
            embed_code=f"<script src='/widget/{result['chatbot_id']}.js'></script>"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ChatbotResponse])
async def list_chatbots(
    request: Request,
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """🌐 BOUNDARY: List all chatbots for the current user"""
    try:
        # Delegate business logic to controller
        from api.controllers.chatbot_controller import ChatbotController
        controller = ChatbotController()
        
        result = await controller.get_user_chatbots(
            owner_id=current_user["id"],
            skip=skip,
            limit=limit
        )
        
        # Transform controller response to HTTP response models
        return [
            ChatbotResponse(
                id=chatbot["id"],
                name=chatbot["name"],
                description=chatbot["description"],
                domain="automotive",  # Default domain
                welcome_message="Hello! How can I help you?",  # Default
                theme={"primary_color": "#007bff"},  # Default
                created_at=datetime.fromisoformat(chatbot["created_at"]),
                updated_at=datetime.fromisoformat(chatbot["updated_at"]),
                owner_id=current_user["id"],
                status=chatbot["status"],
                embed_code=f"<script src='/widget/{chatbot['id']}.js'></script>"
            )
            for chatbot in result["chatbots"]
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{chatbot_id}", response_model=ChatbotResponse)
async def get_chatbot(request: Request, chatbot_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific chatbot"""
    chatbot = await request.app.mongodb["chatbots"].find_one({
        "_id": ObjectId(chatbot_id),
        "owner_id": current_user["id"]
    })
    
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    chatbot["id"] = str(chatbot["_id"])
    return ChatbotResponse(**chatbot)

@router.put("/{chatbot_id}", response_model=ChatbotResponse)
async def update_chatbot(
    request: Request,
    chatbot_id: str,
    chatbot: ChatbotBase,
    current_user: dict = Depends(get_current_user)
):
    """Update a chatbot"""
    update_data = chatbot.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    result = await request.app.mongodb["chatbots"].update_one(
        {"_id": ObjectId(chatbot_id), "owner_id": current_user["id"]},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    updated_chatbot = await get_chatbot(request, chatbot_id, current_user)
    return updated_chatbot

@router.delete("/{chatbot_id}")
async def delete_chatbot(request: Request, chatbot_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a chatbot"""
    result = await request.app.mongodb["chatbots"].delete_one({
        "_id": ObjectId(chatbot_id),
        "owner_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    return {"status": "success"}

@router.post("/{chatbot_id}/train")
async def train_chatbot(request: Request, chatbot_id: str, current_user: dict = Depends(get_current_user)):
    """Start training a chatbot"""
    chatbot = await get_chatbot(request, chatbot_id, current_user)
    
    # Update status to training
    await request.app.mongodb["chatbots"].update_one(
        {"_id": ObjectId(chatbot_id)},
        {"$set": {"status": "training"}}
    )
    
    # Start training process in background
    # This would typically involve calling RASA training
    # and updating the status when complete
    
    return {"status": "training_started"}

@router.get("/{chatbot_id}/embed")
async def get_embed_code(request: Request, chatbot_id: str, current_user: dict = Depends(get_current_user)):
    """Get the embed code for a chatbot"""
    chatbot = await get_chatbot(request, chatbot_id, current_user)
    return {"embed_code": chatbot.embed_code}

def generate_embed_code(chatbot_data: dict) -> str:
    """Generate embed code for the chatbot"""
    # This would generate the actual embed code with the chatbot's configuration
    return f"""
    <script src="https://your-domain.com/embed.js"></script>
    <div id="chatbot-widget" 
         data-chatbot-id="{chatbot_data.get('id', 'temp')}"
         data-theme='{json.dumps(chatbot_data["theme"])}'>
    </div>
    """ 