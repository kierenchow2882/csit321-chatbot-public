"""
Singapore Car Loan Calculator Service
Integrated with COE prices and financing options
"""

import pandas as pd
from typing import Dict, List, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class LoanController:
    """
    Comprehensive car loan calculator for Singapore market
    Includes COE, insurance, road tax, and financing calculations
    """
    
    def __init__(self):
        # Singapore-specific rates and fees (as of 2024)
        self.current_coe_prices = {
            'A': 95000,  # Up to 1600cc
            'B': 110000,  # Above 1600cc
            'C': 75000,   # Goods vehicles
            'D': 9500,    # Motorcycles
            'E': 106000   # Open category
        }
        
        # Current loan rates (typical ranges)
        self.loan_rates = {
            'new_car': {'min': 2.68, 'max': 3.88, 'typical': 3.28},
            'used_car': {'min': 3.88, 'max': 4.88, 'typical': 4.38},
            'coe_car': {'min': 4.88, 'max': 6.88, 'typical': 5.88}
        }
        
        # Insurance rates (annual, as percentage of car value)
        self.insurance_rates = {
            'new_car': 0.025,      # 2.5% of car value
            'used_car': 0.020,     # 2.0% of car value
            'luxury_car': 0.035    # 3.5% for luxury cars
        }
        
        # Road tax rates (annual, per cc)
        self.road_tax_rates = [
            {'cc_min': 0, 'cc_max': 600, 'rate': 0.782},
            {'cc_min': 601, 'cc_max': 1000, 'rate': 0.782},
            {'cc_min': 1001, 'cc_max': 1600, 'rate': 1.242},
            {'cc_min': 1601, 'cc_max': 3000, 'rate': 2.0},
            {'cc_min': 3001, 'cc_max': float('inf'), 'rate': 2.5}
        ]
        
        # Additional fees
        self.registration_fee = 140
        self.inspection_fee = 30
        self.number_plate_fee = 20
    
    def get_quick_estimate(self, price: float, coe_category: str = 'B') -> Dict[str, Any]:
        """Get quick loan estimate for chat responses"""
        
        try:
            vehicle_data = {
                'price': price,
                'coe_category': coe_category,
                'engine_cc': 1600 if coe_category == 'A' else 2000,
                'condition': 'used',
                'year': 2020
            }
            
            loan_params = {
                'down_payment_percent': 20,
                'loan_tenure_years': 7
            }
            
            # Calculate costs
            cost_breakdown = self._calculate_total_cost(vehicle_data)
            loan_details = self._calculate_loan_details(cost_breakdown, loan_params, vehicle_data)
            monthly_costs = self._calculate_monthly_costs(vehicle_data, loan_details)
            
            # Format for chat display
            return {
                'quick_summary': {
                    'vehicle_price': f"${price:,.0f}",
                    'total_cost': f"${cost_breakdown['total_upfront_cost']:,.0f}",
                    'down_payment': loan_details['formatted']['down_payment'],
                    'monthly_loan': loan_details['formatted']['monthly_payment'],
                    'total_monthly': monthly_costs['formatted']['Total Monthly Cost']
                },
                'coe_info': {
                    'category': coe_category,
                    'price': f"${self.current_coe_prices[coe_category]:,.0f}"
                },
                'breakdown': cost_breakdown['breakdown_details']
            }
            
        except Exception as e:
            logger.error(f"❌ Quick estimate error: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_total_cost(self, vehicle_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate total cost breakdown including all fees"""
        
        base_price = float(vehicle_data.get('price', 0))
        coe_category = vehicle_data.get('coe_category', 'B')
        engine_cc = int(vehicle_data.get('engine_cc', 1600))
        condition = vehicle_data.get('condition', 'used')
        
        # COE cost
        coe_cost = self.current_coe_prices.get(coe_category, self.current_coe_prices['B'])
        
        # Additional Registration Fee (ARF) - 100% of OMV for first $20k, 140% thereafter
        omv = base_price * 0.7  # Estimate OMV as 70% of retail price
        if omv <= 20000:
            arf = omv
        else:
            arf = 20000 + (omv - 20000) * 1.4
        
        # Road tax (annual)
        road_tax = self._calculate_road_tax(engine_cc)
        
        # Insurance (annual)
        insurance_rate = self.insurance_rates.get(condition, self.insurance_rates['used_car'])
        if base_price > 100000:  # Luxury car threshold
            insurance_rate = self.insurance_rates['luxury_car']
        annual_insurance = base_price * insurance_rate
        
        # Registration and admin fees
        admin_fees = self.registration_fee + self.inspection_fee + self.number_plate_fee
        
        # Calculate totals
        total_upfront = base_price + coe_cost + arf + admin_fees
        
        return {
            'base_price': base_price,
            'coe_cost': coe_cost,
            'coe_category': coe_category,
            'arf': arf,
            'registration_fees': admin_fees,
            'total_upfront_cost': total_upfront,
            'annual_road_tax': road_tax,
            'annual_insurance': annual_insurance,
            'estimated_omv': omv,
            'breakdown_details': {
                'Base Vehicle Price': f"${base_price:,.0f}",
                'COE': f"${coe_cost:,.0f}",
                'ARF (Additional Registration Fee)': f"${arf:,.0f}",
                'Registration & Admin Fees': f"${admin_fees:,.0f}",
                'Total Upfront Cost': f"${total_upfront:,.0f}",
                'Annual Road Tax': f"${road_tax:,.0f}",
                'Annual Insurance (Est.)': f"${annual_insurance:,.0f}"
            }
        }
    
    def _calculate_road_tax(self, engine_cc: int) -> float:
        """Calculate annual road tax based on engine capacity"""
        for rate_info in self.road_tax_rates:
            if rate_info['cc_min'] <= engine_cc <= rate_info['cc_max']:
                return engine_cc * rate_info['rate']
        return engine_cc * 2.5  # Default highest rate
    
    def _calculate_loan_details(self, cost_breakdown: Dict, loan_params: Dict, vehicle_data: Dict) -> Dict[str, Any]:
        """Calculate detailed loan information"""
        
        total_cost = cost_breakdown['total_upfront_cost']
        down_payment_percent = loan_params.get('down_payment_percent', 20)
        loan_tenure_years = min(loan_params.get('loan_tenure_years', 7), 7)  # Max 7 years
        
        # Calculate down payment
        down_payment = total_cost * (down_payment_percent / 100)
        loan_amount = total_cost - down_payment
        
        # Determine interest rate
        condition = vehicle_data.get('condition', 'used')
        rate_info = self.loan_rates.get(f"{condition}_car", self.loan_rates['used_car'])
        interest_rate = rate_info['typical']
        
        # Calculate monthly payment using standard loan formula
        monthly_rate = interest_rate / 100 / 12
        num_payments = loan_tenure_years * 12
        
        if monthly_rate > 0:
            monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        else:
            monthly_payment = loan_amount / num_payments
        
        total_interest = (monthly_payment * num_payments) - loan_amount
        total_payment = loan_amount + total_interest
        
        return {
            'loan_amount': loan_amount,
            'down_payment': down_payment,
            'down_payment_percent': down_payment_percent,
            'interest_rate': interest_rate,
            'loan_tenure_years': loan_tenure_years,
            'monthly_payment': monthly_payment,
            'total_interest': total_interest,
            'total_payment': total_payment,
            'formatted': {
                'loan_amount': f"${loan_amount:,.0f}",
                'down_payment': f"${down_payment:,.0f}",
                'monthly_payment': f"${monthly_payment:,.0f}",
                'total_interest': f"${total_interest:,.0f}",
                'total_payment': f"${total_payment:,.0f}"
            }
        }
    
    def _calculate_monthly_costs(self, vehicle_data: Dict, loan_details: Dict) -> Dict[str, Any]:
        """Calculate total monthly ownership costs"""
        
        monthly_loan = loan_details['monthly_payment']
        
        # Monthly road tax (annual / 12)
        annual_road_tax = self._calculate_road_tax(int(vehicle_data.get('engine_cc', 1600)))
        monthly_road_tax = annual_road_tax / 12
        
        # Monthly insurance estimate
        base_price = float(vehicle_data.get('price', 0))
        condition = vehicle_data.get('condition', 'used')
        insurance_rate = self.insurance_rates.get(condition, self.insurance_rates['used_car'])
        monthly_insurance = (base_price * insurance_rate) / 12
        
        # Estimated monthly maintenance
        if condition == 'new':
            monthly_maintenance = 150  # New car maintenance
        else:
            age = 2024 - int(vehicle_data.get('year', 2020))
            monthly_maintenance = max(200, age * 20)
        
        # Estimated monthly fuel
        engine_cc = int(vehicle_data.get('engine_cc', 1600))
        if engine_cc <= 1000:
            monthly_fuel = 180
        elif engine_cc <= 1600:
            monthly_fuel = 220
        elif engine_cc <= 2500:
            monthly_fuel = 280
        else:
            monthly_fuel = 350
        
        # Estimated parking
        monthly_parking = 120  # Average HDB parking
        
        total_monthly = monthly_loan + monthly_road_tax + monthly_insurance + monthly_maintenance + monthly_fuel + monthly_parking
        
        return {
            'loan_payment': monthly_loan,
            'road_tax': monthly_road_tax,
            'insurance': monthly_insurance,
            'maintenance': monthly_maintenance,
            'fuel': monthly_fuel,
            'parking': monthly_parking,
            'total_monthly': total_monthly,
            'formatted': {
                'Loan Payment': f"${monthly_loan:,.0f}",
                'Road Tax': f"${monthly_road_tax:.0f}",
                'Insurance': f"${monthly_insurance:.0f}",
                'Maintenance': f"${monthly_maintenance:.0f}",
                'Fuel (Est.)': f"${monthly_fuel:.0f}",
                'Parking (Est.)': f"${monthly_parking:.0f}",
                'Total Monthly Cost': f"${total_monthly:,.0f}"
            }
        }
    
    def update_coe_prices(self, new_prices: Dict[str, float]):
        """Update COE prices with latest market data"""
        self.current_coe_prices.update(new_prices)
        logger.info(f"Updated COE prices: {self.current_coe_prices}") 