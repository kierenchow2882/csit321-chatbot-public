from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
import json
import os

# Import BCE services
from api.services.coe_service import COEService

# Import authentication dependency  
from api.auth import get_current_user

router = APIRouter()

# Pricing models
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

# Initialize COE Service
coe_service = COEService()

# Pricing endpoint
@router.get("/pricing", response_model=PricingResponse)
async def get_pricing():
    """Get pricing information including COE discounts"""
    
    # Define pricing tiers
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

# COE endpoint for real-time data
@router.get("/coe-prices")
async def get_coe_prices():
    """Get latest COE bidding results from LTA"""
    try:
        # Get LTA API key from environment
        lta_api_key = os.getenv("LTA_API_KEY")
        
        # Fetch latest COE data
        coe_data = await coe_service.get_latest_coe_prices(lta_api_key)
        
        return {
            "success": True,
            "data": {
                "bidding_date": coe_data.bidding_date,
                "results": [
                    {
                        "category": result.category,
                        "premium": result.quota_premium,
                        "bids_received": result.bids_received,
                        "bids_successful": result.bids_successful,
                        "bidding_date": result.bidding_date
                    }
                    for result in coe_data.results
                ],
                "source": coe_data.source
            },
            "formatted_response": coe_service.format_coe_response(coe_data)
        }
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
    """Create a new chatbot"""
    chatbot_data = chatbot.dict()
    chatbot_data.update({
        "owner_id": current_user["id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "draft",
        "embed_code": generate_embed_code(chatbot_data)
    })
    
    result = await request.app.mongodb["chatbots"].insert_one(chatbot_data)
    chatbot_data["id"] = str(result.inserted_id)
    
    return ChatbotResponse(**chatbot_data)

@router.get("/", response_model=List[ChatbotResponse])
async def list_chatbots(
    request: Request,
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """List all chatbots for the current user"""
    chatbots = await request.app.mongodb["chatbots"].find(
        {"owner_id": current_user["id"]}
    ).skip(skip).limit(limit).to_list(length=limit)
    
    return [ChatbotResponse(**chatbot) for chatbot in chatbots]

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