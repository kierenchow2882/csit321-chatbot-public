"""
Vehicle Boundary - HTTP API Endpoints for Vehicle Operations
BCE Framework: Boundaries handle HTTP requests/responses only
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

class VehicleSearchRequest(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price_min: Optional[int] = None
    price_max: Optional[int] = None

@router.get("/")
async def get_vehicles(limit: int = 10):
    """Get all vehicles with limit"""
    try:
        # Mock data for now - would call entities through controllers
        vehicles = [
            {
                "id": "1",
                "brand": "Toyota",
                "model": "Camry", 
                "year": 2024,
                "price": 45000,
                "condition": "New",
                "stock": 5,
                "coe_category": "A"
            },
            {
                "id": "2", 
                "brand": "BMW",
                "model": "3 Series",
                "year": 2024,
                "price": 180000,
                "condition": "New", 
                "stock": 2,
                "coe_category": "B"
            }
        ]
        
        return {
            "success": True,
            "vehicles": vehicles[:limit],
            "total": len(vehicles)
        }
        
    except Exception as e:
        logger.error(f"Error getting vehicles: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve vehicles")

@router.post("/search")
async def search_vehicles(search_request: VehicleSearchRequest):
    """Search vehicles based on criteria"""
    try:
        # Mock search logic - would call through controllers to entities
        all_vehicles = [
            {"id": "1", "brand": "Toyota", "model": "Camry", "price": 45000, "condition": "New", "stock": 5},
            {"id": "2", "brand": "BMW", "model": "3 Series", "price": 180000, "condition": "New", "stock": 2},
            {"id": "3", "brand": "Honda", "model": "CR-V", "price": 75000, "condition": "New", "stock": 3}
        ]
        
        # Filter based on search criteria
        filtered_vehicles = []
        for vehicle in all_vehicles:
            match = True
            
            if search_request.brand and search_request.brand.lower() not in vehicle["brand"].lower():
                match = False
            if search_request.model and search_request.model.lower() not in vehicle["model"].lower():
                match = False
            if search_request.price_min and vehicle["price"] < search_request.price_min:
                match = False
            if search_request.price_max and vehicle["price"] > search_request.price_max:
                match = False
                
            if match:
                filtered_vehicles.append(vehicle)
        
        return {
            "success": True,
            "vehicles": filtered_vehicles,
            "total": len(filtered_vehicles),
            "search_criteria": search_request.dict()
        }
        
    except Exception as e:
        logger.error(f"Error searching vehicles: {e}")
        raise HTTPException(status_code=500, detail="Failed to search vehicles")

@router.post("/pricing")
async def get_vehicle_pricing(pricing_request: Dict[str, Any]):
    """Get complete pricing for a vehicle including COE"""
    try:
        brand = pricing_request.get("brand", "")
        model = pricing_request.get("model", "")
        
        # Mock pricing data - would call through controllers
        mock_pricing = {
            "car_price": 45000,
            "coe_price": 95000,
            "registration_fee": 140,
            "gst": 9800,
            "total_upfront": 150000
        }
        
        formatted_response = f"""💰 **Complete Pricing for {brand} {model}**

🚗 Car Price: ${mock_pricing['car_price']:,}
📋 COE (Cat A): ${mock_pricing['coe_price']:,}
📝 Registration: ${mock_pricing['registration_fee']:,}
💸 GST (7%): ${mock_pricing['gst']:,}
{'─' * 30}
💵 **Total Upfront: ${mock_pricing['total_upfront']:,}**

Would you like to explore financing options or schedule a test drive?"""
        
        return {
            "success": True,
            "data": mock_pricing,
            "formatted_response": formatted_response
        }
        
    except Exception as e:
        logger.error(f"Error getting pricing: {e}")
        raise HTTPException(status_code=500, detail="Failed to get pricing") 