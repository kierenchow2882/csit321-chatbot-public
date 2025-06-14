"""
Admin Dashboard Boundary - Chatbot Function Management
BCE Framework: Boundaries handle HTTP requests/responses only
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/dashboard", tags=["admin-dashboard"])

class ChatbotFunction(BaseModel):
    function_id: str
    name: str
    description: str
    intent: str
    action: str
    category: str
    status: str
    examples: List[str]

@router.get("/functions")
async def get_all_chatbot_functions():
    """Get all available chatbot functions organized by category"""
    try:
        functions = {
            "Core Functions": [
                {
                    "function_id": "coe_prices",
                    "name": "COE Prices",
                    "description": "Get latest Certificate of Entitlement prices for all categories",
                    "intent": "ask_coe_prices",
                    "action": "action_get_coe_prices",
                    "status": "active",
                    "examples": ["coe prices", "coe", "latest coe", "certificate of entitlement"]
                },
                {
                    "function_id": "vehicle_info",
                    "name": "Vehicle Information",
                    "description": "Get detailed information about specific vehicles",
                    "intent": "ask_vehicle_info",
                    "action": "action_get_vehicle_info", 
                    "status": "active",
                    "examples": ["toyota camry", "honda civic", "vehicle info", "car details"]
                },
                {
                    "function_id": "loan_info",
                    "name": "Car Loan Information",
                    "description": "Car financing options, interest rates, and loan calculator",
                    "intent": "ask_loan_financing",
                    "action": "action_get_loan_info",
                    "status": "active",
                    "examples": ["loan", "car loan", "financing", "interest rates"]
                }
            ]
        }
        
        total_functions = sum(len(category) for category in functions.values())
        active_functions = sum(
            len([f for f in category if f["status"] == "active"]) 
            for category in functions.values()
        )
        
        return {
            "success": True,
            "statistics": {
                "total_functions": total_functions,
                "active_functions": active_functions,
                "categories": len(functions)
            },
            "functions": functions
        }
        
    except Exception as e:
        logger.error(f"Error getting chatbot functions: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chatbot functions")

@router.get("/analytics")
async def get_chatbot_analytics():
    """Get chatbot usage analytics and performance metrics"""
    try:
        analytics = {
            "usage_stats": {
                "total_conversations": 1250,
                "successful_queries": 1125,
                "failed_queries": 125,
                "success_rate": "90%",
                "avg_response_time": "1.2s"
            },
            "popular_functions": [
                {"function": "COE Prices", "usage_count": 450, "percentage": "36%"},
                {"function": "Vehicle Information", "usage_count": 320, "percentage": "25.6%"},
                {"function": "Test Drive Booking", "usage_count": 180, "percentage": "14.4%"},
                {"function": "Maintenance Info", "usage_count": 150, "percentage": "12%"},
                {"function": "Loan Information", "usage_count": 125, "percentage": "10%"}
            ],
            "user_satisfaction": {
                "rating": "4.2/5",
                "total_ratings": 89,
                "positive_feedback": "78%"
            },
            "technical_metrics": {
                "rasa_model_accuracy": "85%",
                "rag_system_status": "operational",
                "api_uptime": "99.5%",
                "response_cache_hit_rate": "72%"
            }
        }
        
        return {
            "success": True,
            "analytics": analytics,
            "generated_at": "2024-06-11T15:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

@router.post("/functions/{function_id}/toggle")
async def toggle_function_status(function_id: str):
    """Toggle a chatbot function on/off"""
    try:
        # In a real implementation, this would update the database
        return {
            "success": True,
            "function_id": function_id,
            "message": f"Function {function_id} status toggled successfully",
            "new_status": "active" if function_id != "coe_prices" else "inactive"
        }
        
    except Exception as e:
        logger.error(f"Error toggling function {function_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to toggle function status")

@router.get("/health")
async def get_system_health():
    """Get overall system health status"""
    try:
        health_status = {
            "overall_status": "healthy",
            "components": {
                "rasa_core": {"status": "running", "response_time": "850ms"},
                "rasa_actions": {"status": "running", "response_time": "120ms"},
                "backend_api": {"status": "running", "response_time": "45ms"},
                "frontend": {"status": "running", "response_time": "200ms"},
                "rag_service": {"status": "running", "response_time": "300ms"},
                "database": {"status": "connected", "response_time": "25ms"}
            },
            "last_restart": "2024-06-11T14:00:00Z",
            "uptime": "2h 30m",
            "memory_usage": "65%",
            "cpu_usage": "32%"
        }
        
        return {
            "success": True,
            "health": health_status,
            "timestamp": "2024-06-11T16:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve system health") 