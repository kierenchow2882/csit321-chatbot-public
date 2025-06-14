"""
🌐 BOUNDARY: Loan Calculator API
Handles HTTP requests for loan calculations and delegates to controller
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/loan", tags=["loan"])

# Request/Response Models
class LoanCalculationRequest(BaseModel):
    car_price: float
    coe_category: str = "B"
    down_payment_percent: Optional[float] = 20
    loan_tenure_years: Optional[int] = 7
    engine_cc: Optional[int] = 1600
    condition: Optional[str] = "used"
    year: Optional[int] = 2020

class LoanCalculationResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/calculate", response_model=LoanCalculationResponse)
async def calculate_loan(request: LoanCalculationRequest):
    """🌐 BOUNDARY: Calculate comprehensive loan details"""
    try:
        # Import controller (BCE pattern - boundary calls controller)
        from api.controllers.loan_controller import LoanController
        
        controller = LoanController()
        
        # Prepare vehicle data for controller
        vehicle_data = {
            'price': request.car_price,
            'coe_category': request.coe_category,
            'engine_cc': request.engine_cc,
            'condition': request.condition,
            'year': request.year
        }
        
        loan_params = {
            'down_payment_percent': request.down_payment_percent,
            'loan_tenure_years': request.loan_tenure_years
        }
        
        # Delegate to controller for business logic
        cost_breakdown = controller._calculate_total_cost(vehicle_data)
        loan_details = controller._calculate_loan_details(cost_breakdown, loan_params, vehicle_data)
        monthly_costs = controller._calculate_monthly_costs(vehicle_data, loan_details)
        
        # Format response for frontend
        response_data = {
            'cost_breakdown': cost_breakdown,
            'loan_details': loan_details,
            'monthly_costs': monthly_costs,
            'summary': {
                'vehicle_price': f"${request.car_price:,.0f}",
                'total_cost': f"${cost_breakdown['total_upfront_cost']:,.0f}",
                'down_payment': loan_details['formatted']['down_payment'],
                'monthly_payment': loan_details['formatted']['monthly_payment'],
                'total_monthly_cost': monthly_costs['formatted']['Total Monthly Cost']
            }
        }
        
        return LoanCalculationResponse(success=True, data=response_data)
        
    except Exception as e:
        logger.error(f"❌ Loan calculation error: {str(e)}")
        return LoanCalculationResponse(success=False, error=str(e))

@router.get("/quick-estimate")
async def get_quick_estimate(price: float, coe_category: str = "B"):
    """🌐 BOUNDARY: Get quick loan estimate for chat responses"""
    try:
        from api.controllers.loan_controller import LoanController
        
        controller = LoanController()
        estimate = controller.get_quick_estimate(price, coe_category)
        
        return {"success": True, "data": estimate}
        
    except Exception as e:
        logger.error(f"❌ Quick estimate error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.get("/rates")
async def get_current_rates():
    """🌐 BOUNDARY: Get current loan rates and COE prices"""
    try:
        from api.controllers.loan_controller import LoanController
        
        controller = LoanController()
        
        rates_data = {
            'coe_prices': controller.current_coe_prices,
            'loan_rates': controller.loan_rates,
            'insurance_rates': controller.insurance_rates,
            'additional_fees': {
                'registration': controller.registration_fee,
                'inspection': controller.inspection_fee,
                'number_plate': controller.number_plate_fee
            }
        }
        
        return {"success": True, "data": rates_data}
        
    except Exception as e:
        logger.error(f"❌ Rates fetch error: {str(e)}")
        return {"success": False, "error": str(e)} 