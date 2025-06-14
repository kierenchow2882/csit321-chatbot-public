"""
RAG Boundary - HTTP API Endpoints for RAG Operations
BCE Framework: Boundaries handle HTTP requests/responses only
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import logging
import pandas as pd
import os
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/rag", tags=["rag"])

class RAGQueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    top_k: Optional[int] = 5

class RAGSearchRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

class IntelligentResponseRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

class RAGResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    rag_enabled: bool = True

# Global vehicle data cache
vehicle_data_cache = None

def load_vehicle_data():
    """Load vehicle data from Excel files"""
    global vehicle_data_cache
    
    if vehicle_data_cache is not None:
        return vehicle_data_cache
    
    try:
        # Look for Excel files in common locations
        excel_paths = [
            "data/vehicles.xlsx",
            "data/vehicle_data.xlsx", 
            "data/cars.xlsx",
            "../data/vehicles.xlsx",
            "../../data/vehicles.xlsx"
        ]
        
        vehicle_data = []
        
        for path in excel_paths:
            if os.path.exists(path):
                try:
                    df = pd.read_excel(path)
                    vehicle_data.extend(df.to_dict('records'))
                    logger.info(f"Loaded {len(df)} vehicles from {path}")
                except Exception as e:
                    logger.warning(f"Could not read {path}: {e}")
        
        # If no Excel files found, create sample data
        if not vehicle_data:
            vehicle_data = [
                {
                    "brand": "Toyota",
                    "model": "Camry",
                    "year": 2024,
                    "price": 168000,
                    "coe_category": "A",
                    "engine_capacity": "2.0L",
                    "fuel_type": "Petrol",
                    "type": "Sedan",
                    "features": "Hybrid technology, Toyota Safety Sense, LED headlights",
                    "description": "Reliable family sedan with excellent fuel economy"
                },
                {
                    "brand": "Toyota", 
                    "model": "Alphard",
                    "year": 2024,
                    "price": 285000,
                    "coe_category": "B",
                    "engine_capacity": "2.5L",
                    "fuel_type": "Petrol",
                    "type": "MPV",
                    "features": "Premium interior, captain seats, sliding doors",
                    "description": "Luxury MPV perfect for families and executives"
                },
                {
                    "brand": "Honda",
                    "model": "Civic",
                    "year": 2024,
                    "price": 145000,
                    "coe_category": "A",
                    "engine_capacity": "1.5L",
                    "fuel_type": "Petrol",
                    "type": "Sedan",
                    "features": "Turbo engine, Honda Sensing, sporty design",
                    "description": "Sporty compact sedan with excellent performance"
                },
                {
                    "brand": "BMW",
                    "model": "3 Series",
                    "year": 2024,
                    "price": 295000,
                    "coe_category": "B",
                    "engine_capacity": "2.0L",
                    "fuel_type": "Petrol",
                    "type": "Sedan",
                    "features": "Luxury interior, BMW iDrive, sport suspension",
                    "description": "Premium sports sedan with exceptional driving dynamics"
                },
                {
                    "brand": "Honda",
                    "model": "CR-V",
                    "year": 2024,
                    "price": 225000,
                    "coe_category": "B",
                    "engine_capacity": "1.5L Turbo",
                    "fuel_type": "Petrol",
                    "type": "SUV",
                    "features": "Spacious interior, Honda Sensing, all-wheel drive",
                    "description": "Versatile family SUV with excellent practicality"
                }
            ]
            logger.info("Using sample vehicle data")
        
        vehicle_data_cache = vehicle_data
        return vehicle_data
        
    except Exception as e:
        logger.error(f"Error loading vehicle data: {e}")
        return []

def search_vehicles(query: str, context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Search for vehicles based on query"""
    try:
        vehicle_data = load_vehicle_data()
        query_lower = query.lower()
        
        # Extract search criteria from query and context
        brand = context.get("brand", "").lower() if context else ""
        model = context.get("model", "").lower() if context else ""
        
        # Extract brand/model from query if not in context
        if not brand:
            for vehicle in vehicle_data:
                if vehicle["brand"].lower() in query_lower:
                    brand = vehicle["brand"].lower()
                    break
        
        if not model:
            for vehicle in vehicle_data:
                if vehicle["model"].lower() in query_lower:
                    model = vehicle["model"].lower()
                    break
        
        # Search for matching vehicles
        matches = []
        
        for vehicle in vehicle_data:
            score = 0
            
            # Exact brand/model match gets highest score
            if brand and vehicle["brand"].lower() == brand:
                score += 10
            if model and vehicle["model"].lower() == model:
                score += 10
            
            # Partial matches
            if brand and brand in vehicle["brand"].lower():
                score += 5
            if model and model in vehicle["model"].lower():
                score += 5
            
            # Type matching (sedan, suv, etc.)
            if "sedan" in query_lower and vehicle.get("type", "").lower() == "sedan":
                score += 8
            elif "suv" in query_lower and vehicle.get("type", "").lower() == "suv":
                score += 8
            elif "mpv" in query_lower and vehicle.get("type", "").lower() == "mpv":
                score += 8
            
            # Feature matching
            features = vehicle.get("features", "").lower()
            description = vehicle.get("description", "").lower()
            
            for word in query_lower.split():
                if word in features or word in description:
                    score += 1
            
            if score > 0:
                vehicle_copy = vehicle.copy()
                vehicle_copy["relevance_score"] = score
                matches.append(vehicle_copy)
        
        # Sort by relevance score
        matches.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return matches[:5]  # Return top 5 matches
        
    except Exception as e:
        logger.error(f"Error searching vehicles: {e}")
        return []

def format_vehicle_response(vehicles: List[Dict[str, Any]], query: str) -> str:
    """Format vehicle search results into a response"""
    if not vehicles:
        return """🚗 **Vehicle Search Results**

I couldn't find specific vehicles matching your search. Here are some ways I can help:

**🔍 Try These Searches:**
• "Toyota Camry" for specific model info
• "sedan car" for body type recommendations  
• "family SUV" for family-friendly options
• "budget car under 200k" for price range

**💡 Popular Recommendations:**
• **Toyota Camry** - Reliable family sedan
• **Honda CR-V** - Versatile family SUV
• **BMW 3 Series** - Premium sports sedan

Please specify the brand, model, or type you're interested in!"""
    
    if len(vehicles) == 1:
        # Single vehicle detailed response
        vehicle = vehicles[0]
        return f"""🚗 **{vehicle['brand']} {vehicle['model']} ({vehicle['year']}) - Detailed Information**

**💰 Pricing & Category:**
• **Price**: ${vehicle['price']:,} (excluding COE)
• **COE Category**: {vehicle['coe_category']}
• **Estimated Total**: ${vehicle['price'] + (95000 if vehicle['coe_category'] == 'A' else 110000):,} (with current COE)

**🔧 Technical Specifications:**
• **Engine**: {vehicle.get('engine_capacity', 'N/A')}
• **Fuel Type**: {vehicle.get('fuel_type', 'Petrol')}
• **Vehicle Type**: {vehicle.get('type', 'Car')}

**✨ Key Features:**
{vehicle.get('features', 'Standard features included')}

**📝 Description:**
{vehicle.get('description', 'Great vehicle for Singapore roads')}

**🎯 Perfect For:**
• {"Daily commuting and family use" if vehicle['coe_category'] == 'A' else "Family adventures and luxury driving"}
• {"First-time car buyers" if vehicle['price'] < 200000 else "Premium car enthusiasts"}

**📞 Next Steps:**
• Schedule a test drive
• Get detailed quotation  
• Explore financing options
• Compare with other models

Would you like to book a test drive or get financing information?"""
    
    else:
        # Multiple vehicles comparison
        response = f"""🚗 **Vehicle Search Results ({len(vehicles)} matches found)**

"""
        
        for i, vehicle in enumerate(vehicles[:3], 1):
            total_price = vehicle['price'] + (95000 if vehicle['coe_category'] == 'A' else 110000)
            response += f"""**{i}. {vehicle['brand']} {vehicle['model']}**
💰 From ${total_price:,} (with COE)
🏷️ Category {vehicle['coe_category']} • {vehicle.get('type', 'Car')}
✨ {vehicle.get('description', 'Quality vehicle')}

"""
        
        response += """**🔍 Need More Specific Information?**
• Ask about a specific model for detailed specs
• Type "compare [model1] vs [model2]" for comparison
• Request test drive booking

**💡 Popular Choices:**
• **Budget-friendly**: Toyota Camry, Honda Civic
• **Family SUV**: Honda CR-V, Toyota Harrier  
• **Luxury**: BMW 3 Series, Mercedes C-Class

Which vehicle interests you most?"""
        
        return response

@router.post("/search")
async def rag_search(request: RAGSearchRequest):
    """Search for vehicle information using RAG"""
    try:
        # Search vehicles
        vehicles = search_vehicles(request.query, request.context)
        
        return RAGResponse(
            success=True,
            data={
                "query": request.query,
                "vehicles": vehicles,
                "count": len(vehicles)
            }
        )
        
    except Exception as e:
        logger.error(f"Error in RAG search: {e}")
        raise HTTPException(status_code=500, detail="RAG search failed")

@router.post("/intelligent-response")
async def intelligent_response(request: IntelligentResponseRequest):
    """Generate intelligent response using RAG"""
    try:
        # Search for relevant vehicles
        vehicles = search_vehicles(request.query, request.context)
        
        # Format response
        formatted_response = format_vehicle_response(vehicles, request.query)
        
        return RAGResponse(
            success=True,
            data={
                "query": request.query,
                "vehicles": vehicles,
                "formatted_response": formatted_response,
                "rag_enabled": True
            }
        )
        
    except Exception as e:
        logger.error(f"Error in intelligent response: {e}")
        return RAGResponse(
            success=False,
            data={"error": str(e)},
            rag_enabled=False
        )

@router.get("/status")
async def get_rag_status():
    """Get RAG service status"""
    try:
        from api.controllers.rag_controller import RAGController
        
        # Try to initialize to check status
        rag_controller = RAGController()
        
        return {
            "success": True,
            "status": "operational",
            "model_loaded": rag_controller.model is not None,
            "knowledge_base_loaded": rag_controller.index is not None,
            "total_documents": len(rag_controller.documents) if rag_controller.documents else 0
        }
        
    except Exception as e:
        logger.error(f"RAG status check failed: {e}")
        return {
            "success": False,
            "status": "error",
            "error": str(e),
            "model_loaded": False,
            "knowledge_base_loaded": False,
            "total_documents": 0
        } 