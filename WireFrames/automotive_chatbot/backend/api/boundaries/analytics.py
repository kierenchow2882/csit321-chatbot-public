"""
Analytics API - HTTP Boundary Layer
Handles analytics tracking and reporting endpoints
STRICT BCE: NO database access - delegates to controllers only
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import logging

# Import auth utilities
from api.auth import get_current_user, get_optional_user

router = APIRouter()

class AnalyticsEvent(BaseModel):
    event_type: str
    chatbot_id: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class AnalyticsQuery(BaseModel):
    chatbot_id: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    event_type: Optional[str] = None

@router.post("/track")
async def track_event(
    event: AnalyticsEvent,
    request: Request,
    current_user: Optional[Dict] = Depends(get_optional_user)
):
    """
    🌐 BOUNDARY: Track analytics event - Pure HTTP interface
    Delegates to AnalyticsController (BCE pattern)
    """
    try:
        # Input validation only
        if not event.event_type or not event.chatbot_id:
            raise HTTPException(status_code=400, detail="event_type and chatbot_id are required")
        
        # Delegate to controller - NO business logic here
        from api.controllers.analytics_controller import AnalyticsController
        analytics_controller = AnalyticsController()
        
        result = await analytics_controller.track_event(
            event_type=event.event_type,
            chatbot_id=event.chatbot_id,
            user_id=event.user_id or (current_user.get("id") if current_user else None),
            session_id=event.session_id,
            data=event.data
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Analytics tracking error: {e}")
        raise HTTPException(status_code=500, detail="Failed to track event")

@router.get("/dashboard/{chatbot_id}")
async def get_analytics_dashboard(
    chatbot_id: str,
    request: Request,
    current_user: Dict = Depends(get_current_user)
):
    """
    🌐 BOUNDARY: Get analytics dashboard - Pure HTTP interface
    Delegates to AnalyticsController (BCE pattern)
    """
    try:
        # Delegate to controller - NO business logic here
        from api.controllers.analytics_controller import AnalyticsController
        analytics_controller = AnalyticsController()
        
        dashboard_data = await analytics_controller.get_dashboard_data(
            chatbot_id=chatbot_id,
            user_id=current_user.get("id")
        )
        
        return dashboard_data
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Dashboard error: {e}")
        raise HTTPException(status_code=500, detail="Failed to load dashboard")

@router.get("/conversations/{chatbot_id}")
async def get_conversations(
    chatbot_id: str,
    request: Request,
    limit: int = 50,
    offset: int = 0,
    current_user: Dict = Depends(get_current_user)
):
    """
    🌐 BOUNDARY: Get conversation history - Pure HTTP interface
    Delegates to AnalyticsController (BCE pattern)
    """
    try:
        # Input validation only
        if limit > 100:
            limit = 100
        
        # Delegate to controller - NO business logic here
        from api.controllers.analytics_controller import AnalyticsController
        analytics_controller = AnalyticsController()
        
        conversations = await analytics_controller.get_conversations(
            chatbot_id=chatbot_id,
            user_id=current_user.get("id"),
            limit=limit,
            offset=offset
        )
        
        return conversations
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Conversations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to load conversations") 