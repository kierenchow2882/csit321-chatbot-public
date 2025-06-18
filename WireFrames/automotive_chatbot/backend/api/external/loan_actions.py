"""
LOAN ACTIONS - Automotive Loan Calculator and Financing Options
Enhanced with professional styling and comprehensive loan calculations
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import logging
import re
import requests
import os
import json

logger = logging.getLogger(__name__)
import time
import pandas as pd
import re
from datetime import datetime, timedelta

class ActionCalculateLoan(Action):
    """Calculate loan amount for vehicle financing"""
    
    def name(self) -> Text:
        return "action_calculate_loan"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Extract latest user message
            latest_message = tracker.latest_message.get('text', '').lower()
            
            # Extract numbers from the message - FIXED REGEX PATTERN
            import re
            # Remove commas first, then find numbers
            clean_message = latest_message.replace(',', '')
            numbers = re.findall(r'\d+(?:\.\d+)?', clean_message)
            numbers = [float(num) for num in numbers if num.replace('.', '').isdigit()]
            
            # Default values
            car_price = 0
            down_payment = 0
            loan_years = 5
            interest_rate = 2.78  # Default rate
            
            # Parse the message for loan calculation
            if len(numbers) >= 2:
                car_price = numbers[0]
                down_payment = numbers[1]
                if len(numbers) >= 3:
                    loan_years = numbers[2]
                if len(numbers) >= 4:
                    interest_rate = numbers[3]
            elif len(numbers) == 1:
                car_price = numbers[0]
                down_payment = car_price * 0.2  # Default 20% down payment
            
            # If we have valid numbers, calculate the loan
            if car_price > 0:
                loan_amount = car_price - down_payment
                monthly_rate = interest_rate / 100 / 12
                num_payments = loan_years * 12
                
                # Calculate monthly payment using loan formula
                if monthly_rate > 0:
                    monthly_payment = (loan_amount * monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
                else:
                    monthly_payment = loan_amount / num_payments
                
                total_payment = monthly_payment * num_payments
                total_interest = total_payment - loan_amount
                
                response = f"""💳 **Loan Calculation Results** 🚗

📊 **Your Loan Details:**
• **Car Price:** ${car_price:,.0f}
• **Down Payment:** ${down_payment:,.0f} ({(down_payment/car_price)*100:.1f}%)
• **Loan Amount:** ${loan_amount:,.0f}
• **Loan Tenure:** {loan_years} years
• **Interest Rate:** {interest_rate}% p.a.

💰 **Monthly Payment:** ${monthly_payment:,.0f}
💵 **Total Interest:** ${total_interest:,.0f}
📋 **Total Amount Payable:** ${total_payment:,.0f}

🏦 **Estimated Monthly Costs:**
• **Loan Payment:** ${monthly_payment:,.0f}
• **Insurance:** $150 - $300
• **Road Tax:** $400 - $700 /year
• **Maintenance:** $200 - $400 /month

📞 **Ready to Apply?** Contact our finance team:
**Phone:** +65 6234 5678 | **WhatsApp:** +65 9876 5432"""

            else:
                response = """💳 **Vehicle Loan Calculator** 🚗

Please provide loan details in this format:
"Calculate loan for $150,000 car with $30,000 down payment for 5 years"

📊 **Required Information:**
• **Car Price:** Total vehicle cost
• **Down Payment:** Amount you can pay upfront  
• **Loan Tenure:** Number of years (1-7 years)

💡 **Examples:**
• "Loan for 200000 with 40000 down payment 4 years"
• "Calculate 180000 car 20000 down 6 years"
• "Loan calculator 250000 50000 5 years 2.5 rate"

🏦 **Current Rates:** 2.3% - 3.5% p.a."""

            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logger.error(f"Error in loan calculation: {e}")
            dispatcher.utter_message(text="I'm unable to process loan calculations right now. Please contact our finance team at +65 6234 5678 for personalized assistance.")
            return []


# class ActionLoanOptions(Action):
    """Provide loan and financing options"""
    
    def name(self) -> Text:
        return "action_loan_options"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # PROBLEM 6 FIX: Remove loan calculator completely
        message = """🏦 **Vehicle Financing Options**

We offer comprehensive financing solutions:

📊 **Loan Types Available:**
• New Car Loans (2.3% - 2.8% p.a.)
• Used Car Loans (2.8% - 3.5% p.a.)
• COE Loans (Special rates available)
• Hire Purchase Plans

💰 **Down Payment Options:**
• Standard: 20% minimum
• Flexible: 10% - 40%
• Zero down payment (T&C apply)

⏱️ **Loan Tenure:**
• 1 to 7 years available
• Flexible repayment terms

"""

        dispatcher.utter_message(text=message)
        return []


class ActionRecommendFamilyCars(Action):
    """Recommend family-friendly vehicles"""
    
    def name(self) -> Text:
        return "action_recommend_family_cars"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """👨‍👩‍👧‍👦 **Family Car Recommendations**

🚗 **Top Family Cars in Singapore:**

**Compact SUVs:**
• Honda Vezel - $140,000
• Mazda CX-5 - $155,000  
• Subaru XV - $145,000

**MPVs:**
• Honda Odyssey - $220,000
• Toyota Alphard - $380,000
• Mazda Biante - $165,000

**Sedans:**
• Honda Civic - $135,000
• Toyota Camry - $175,000
• Mazda 6 - $165,000

✨ **Key Features:**
• Safety ratings 5-star
• Spacious interiors
• Fuel efficient
• Reliable brands

📞 **Schedule Test Drive:**
Call: +65 6234 5678
WhatsApp: +65 9876 5432"""

        dispatcher.utter_message(text=message)
        return []


class ActionCarBuyingTips(Action):
    """Provide car buying tips and advice"""
    
    def name(self) -> Text:
        return "action_car_buying_tips"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """💡 **Car Buying Tips in Singapore**

📋 **Before You Buy:**
• Check COE prices and trends
• Compare insurance quotes
• Verify vehicle inspection reports
• Research resale values

💰 **Financial Planning:**
• Budget for COE, insurance, road tax
• Consider total cost of ownership
• Plan for maintenance costs
• Factor in depreciation

🔍 **What to Check:**
• Vehicle history and records
• Mileage and condition
• Service records
• Warranty coverage

📝 **Documentation:**
• IC and valid driving license
• Income statements
• Bank statements
• CPF statements (if using)

"""

        dispatcher.utter_message(text=message)
        return []

# class ActionGetLoanInfo(Action):
    def name(self) -> Text:
        return "action_get_loan_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """🏦 **Singapore Car Loan Information** 📋

📊 **Current Interest Rates:**
🏦 **DBS/POSB:** 2.88% - 3.88% p.a.
🏦 **OCBC:** 2.85% - 3.85% p.a.
🏦 **UOB:** 2.78% - 3.78% p.a.
🏦 **Maybank:** 2.68% - 3.68% p.a.

📋 **Loan Requirements:**
• Minimum age: 21 years
• Maximum age: 65 years at loan maturity
• Minimum income: $30,000 annually
• Singapore Citizen or PR

💰 **Loan Features:**
• **Max Loan Amount:** Up to 70% of car value
• **Loan Tenure:** 1 - 7 years
• **Processing Time:** 1 - 3 working days

📄 **Required Documents:**
• IC/Passport copy
• Latest 3 months payslips
• Latest CPF statement
• Bank statements (3 months)

💡 Ask me: "Calculate loan for $[amount] car with $[down_payment] for [years] years"
"""
        
        dispatcher.utter_message(text=response)
        return [] 
