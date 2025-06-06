from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from bson import ObjectId

# Import authentication dependency
from api.auth import get_current_user

router = APIRouter()

class AnalyticsBase(BaseModel):
    chatbot_id: str
    timestamp: datetime
    event_type: str
    event_data: dict

class AnalyticsResponse(AnalyticsBase):
    id: str

    class Config:
        json_encoders = {
            ObjectId: str
        }

@router.post("/events")
async def track_event(
    request: Request,
    event: AnalyticsBase,
    current_user: dict = Depends(get_current_user)
):
    """Track a chatbot event"""
    # Verify chatbot ownership
    chatbot = await request.app.mongodb["chatbots"].find_one({
        "_id": ObjectId(event.chatbot_id),
        "owner_id": current_user["id"]
    })
    
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Store event
    event_data = event.dict()
    result = await request.app.mongodb["analytics"].insert_one(event_data)
    event_data["id"] = str(result.inserted_id)
    
    return AnalyticsResponse(**event_data)

@router.get("/chatbots/{chatbot_id}/stats")
async def get_chatbot_stats(
    request: Request,
    chatbot_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get chatbot statistics"""
    # Verify chatbot ownership
    chatbot = await request.app.mongodb["chatbots"].find_one({
        "_id": ObjectId(chatbot_id),
        "owner_id": current_user["id"]
    })
    
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Set default date range if not provided
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Build query
    query = {
        "chatbot_id": chatbot_id,
        "timestamp": {
            "$gte": start_date,
            "$lte": end_date
        }
    }
    
    # Get total conversations
    total_conversations = await request.app.mongodb["analytics"].count_documents({
        **query,
        "event_type": "conversation_start"
    })
    
    # Get total messages
    total_messages = await request.app.mongodb["analytics"].count_documents({
        **query,
        "event_type": "message"
    })
    
    # Get average conversation length
    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": "$conversation_id",
            "message_count": {"$sum": 1}
        }},
        {"$group": {
            "_id": None,
            "avg_length": {"$avg": "$message_count"}
        }}
    ]
    
    avg_length_result = await request.app.mongodb["analytics"].aggregate(pipeline).to_list(length=1)
    avg_conversation_length = avg_length_result[0]["avg_length"] if avg_length_result else 0
    
    # Get top intents
    intent_pipeline = [
        {"$match": {
            **query,
            "event_type": "intent_detected"
        }},
        {"$group": {
            "_id": "$event_data.intent",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    
    top_intents = await request.app.mongodb["analytics"].aggregate(intent_pipeline).to_list(length=10)
    
    return {
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "avg_conversation_length": avg_conversation_length,
        "top_intents": top_intents,
        "period": {
            "start": start_date,
            "end": end_date
        }
    }

@router.get("/chatbots/{chatbot_id}/conversations")
async def get_chatbot_conversations(
    request: Request,
    chatbot_id: str,
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """Get recent conversations for a chatbot"""
    # Verify chatbot ownership
    chatbot = await request.app.mongodb["chatbots"].find_one({
        "_id": ObjectId(chatbot_id),
        "owner_id": current_user["id"]
    })
    
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Get conversations
    pipeline = [
        {"$match": {
            "chatbot_id": chatbot_id,
            "event_type": "message"
        }},
        {"$sort": {"timestamp": -1}},
        {"$group": {
            "_id": "$conversation_id",
            "messages": {"$push": {
                "timestamp": "$timestamp",
                "content": "$event_data.content",
                "sender": "$event_data.sender"
            }},
            "last_message": {"$first": "$timestamp"}
        }},
        {"$sort": {"last_message": -1}},
        {"$skip": skip},
        {"$limit": limit}
    ]
    
    conversations = await request.app.mongodb["analytics"].aggregate(pipeline).to_list(length=limit)
    
    return conversations 