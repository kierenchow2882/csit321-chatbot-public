"""
RASA Custom Actions - Enhanced with RAG and Context Awareness
BCE Framework Compliant - Actions call through BOUNDARY layer (HTTP APIs) only
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import logging
import requests
import os
import json

# BCE Framework: Actions should call through BOUNDARIES (HTTP APIs), not direct imports
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

def call_backend_api(endpoint: str, method: str = "GET", data: dict = None):
    """
    Call backend API through proper boundary layer
    Following BCE framework - Actions communicate through Boundaries only
    """
    try:
        url = f"{BACKEND_URL}{endpoint}"
        
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        else:
            return None
            
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(f"API call failed: {response.status_code}")
            return None
            
    except Exception as e:
        logging.error(f"Backend API call error: {e}")
        return None

def extract_entities(tracker: Tracker):
    """Extract entities from the current message"""
    entities = {}
    for entity in tracker.latest_message.get("entities", []):
        entities[entity["entity"]] = entity["value"]
    return entities

def format_greeting():
    """Standard greeting for all responses - removed to avoid repetitive greetings"""
    return ""

def get_trend_symbol(trend: str) -> str:
    """Get emoji for trend direction"""
    if trend == "increasing":
        return "📈"
    elif trend == "decreasing":
        return "📉"
    else:
        return "➡️"

def format_change(change: int) -> str:
    """Format price change with appropriate symbol"""
    if change > 0:
        return f"⬆️ +${change:,}"
    elif change < 0:
        return f"⬇️ ${change:,}"
    else:
        return "➡️ No change"

class ActionGetVehicleInfo(Action):
    def name(self) -> Text:
        return "action_get_vehicle_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extract entities from user message
        entities = extract_entities(tracker)
        car_brand = entities.get("car_brand")
        car_model = entities.get("car_model")
        
        # Also check slots for context
        if not car_brand:
            car_brand = tracker.get_slot("car_brand")
        if not car_model:
            car_model = tracker.get_slot("car_model")
        
        user_text = tracker.latest_message.get("text", "").lower()
        
        # Extract from current message if not found
        if not car_brand:
            if "toyota" in user_text:
                car_brand = "Toyota"
                if "camry" in user_text:
                    car_model = "Camry"
                elif "alphard" in user_text:
                    car_model = "Alphard"
            elif "honda" in user_text:
                car_brand = "Honda"
                if "civic" in user_text:
                    car_model = "Civic"
                elif "cr-v" in user_text or "crv" in user_text:
                    car_model = "CR-V"
            elif "bmw" in user_text:
                car_brand = "BMW"
                if "3 series" in user_text or "320i" in user_text:
                    car_model = "3 Series"
        
        if car_brand and car_model:
            # Try to get specific vehicle info from API
            try:
                api_response = call_backend_api("/api/vehicles/info", "POST", {
                    "brand": car_brand,
                    "model": car_model
                })
                
                if api_response and api_response.get("success"):
                    vehicle = api_response.get("vehicle_data", {})
                    response = format_greeting() + f"""🚗 {vehicle['brand']} {vehicle['model']} Details

💰 Pricing Information:
• Base Price: ${vehicle.get('base_price', 'Contact for pricing')}
• COE Category: {vehicle.get('coe_category', 'B')}
• Total Estimated Cost: ${vehicle.get('total_cost', 'Contact for quote')}

🔧 Vehicle Specifications:
• Engine: {vehicle.get('engine', 'Contact for specs')}
• Fuel Type: {vehicle.get('fuel_type', 'Petrol')}
• Transmission: {vehicle.get('transmission', 'Automatic')}

📋 Next Steps:
• Schedule test drive
• Get financing quote
• Compare with other models"""
                else:
                    # Fallback with general info
                    specific_vehicle = {"brand": car_brand, "model": car_model}
                    response = format_greeting() + f"""🚗 {specific_vehicle['brand']} {specific_vehicle.get('model', '')} Information

I'd be happy to help you with detailed information!

📞 For Specific Details:
• Call: +65 6234 5678
• WhatsApp: +65 9876 5432
• Visit: Our showroom for test drive

🔧 Popular {specific_vehicle['brand']} Features:
• Reliability and fuel efficiency
• Advanced safety features
• Comprehensive warranty coverage

What specific aspect would you like to know more about?"""
            except Exception as e:
                logging.error(f"Error calling vehicle API: {e}")
                # Fallback response
                specific_vehicle = {"brand": car_brand, "model": car_model}
                response = format_greeting() + f"""🚗 {specific_vehicle['brand']} {specific_vehicle.get('model', '')} Information

I'd be happy to help you with detailed information!

📞 For Specific Details:
• Call: +65 6234 5678
• WhatsApp: +65 9876 5432
• Visit: Our showroom for test drive

🔧 Popular {specific_vehicle['brand']} Features:
• Reliability and fuel efficiency
• Advanced safety features
• Comprehensive warranty coverage

What specific aspect would you like to know more about?"""
        
        elif car_brand:
            # Brand only - provide brand overview
            try:
                api_response = call_backend_api("/api/vehicles/brand", "POST", {
                    "brand": car_brand
                })
                
                if api_response and api_response.get("success"):
                    vehicle = api_response.get("vehicle_data", {})
                    response = format_greeting() + f"""🚗 {vehicle['brand']} {vehicle['model']} Details

💰 Pricing Information:
• Base Price: ${vehicle.get('base_price', 'Contact for pricing')}
• COE Category: {vehicle.get('coe_category', 'B')}
• Total Estimated Cost: ${vehicle.get('total_cost', 'Contact for quote')}

🔧 Vehicle Specifications:
• Engine: {vehicle.get('engine', 'Contact for specs')}
• Fuel Type: {vehicle.get('fuel_type', 'Petrol')}
• Transmission: {vehicle.get('transmission', 'Automatic')}

📋 Next Steps:
• Schedule test drive
• Get financing quote
• Compare with other models"""
                else:
                    specific_vehicle = {"brand": car_brand}
                    response = format_greeting() + f"""🚗 {specific_vehicle['brand']} {specific_vehicle.get('model', '')} Information

📞 For Specific Details:
• Call: +65 6234 5678
• WhatsApp: +65 9876 5432
• Visit: Our showroom for test drive

🔧 Popular {specific_vehicle['brand']} Features:
• Reliability and fuel efficiency
• Advanced safety features
• Comprehensive warranty coverage

What specific aspect would you like to know more about?"""
            except:
                specific_vehicle = {"brand": car_brand}
                response = format_greeting() + f"""🚗 {specific_vehicle['brand']} {specific_vehicle.get('model', '')} Information

📞 Contact Information:
• Phone: +65 6234 5678
• WhatsApp: +65 9876 5432
• Email: info@clevercompanion.sg

Which {car_brand} model interests you most?"""
        else:
            # No specific vehicle mentioned
            response = format_greeting() + """🚗 Vehicle Information Service

I'm here to help you find the perfect car!

🔍 What I need to know:
• Brand - Toyota, Honda, BMW, Mercedes?
• Model - Camry, Civic, 3 Series?
• Type - Sedan, SUV, Hatchback?

🌟 Popular Choices in Singapore:
• Toyota Camry - Reliable sedan, COE Category A
• Honda CR-V - Family SUV, COE Category B
• BMW 3 Series - Luxury sedan, COE Category B

💡 Quick Help:
Just tell me: "I'm interested in [Brand] [Model]" """
        
        dispatcher.utter_message(text=response)
        return [SlotSet("car_brand", car_brand), SlotSet("car_model", car_model)] if car_brand else []

class ActionCOEPrices(Action):
    def name(self) -> Text:
        return "action_coe_prices"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Fixed COE price format to match user's image 2 exactly
            coe_message = """📊 Latest COE Prices (Singapore)

🚗 Category A (Cars ≤1600cc & ≤130bhp)
💰 Current Price: $96,999 🟢↘ -$5,502

🚙 Category B (Cars >1600cc or >130bhp)  
💰 Current Price: $113,000 🟢↘ -$3,988

🏍️ Category D (Motorcycles)
💰 Current Price: $9,800 🔴↗ +$800

🚚 Category E (Open Category)
💰 Current Price: $113,900 🟢↘ -$4,110

💡 Smart Buying Tips:
📅 Timing Strategy: Consider bidding during off-peak months for better prices

Would you like vehicle recommendations or financing options?"""
            
            dispatcher.utter_message(text=coe_message)
            
        except Exception as e:
            logger.error(f"Error in COE prices action: {e}")
            dispatcher.utter_message(text="I'm having trouble getting the latest COE prices. Please try again in a moment.")
        
        return []

class ActionVehiclePricing(Action):
    def name(self) -> Text:
        return "action_vehicle_pricing"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Enhanced vehicle pricing service response matching image 3
            pricing_message = """💰 Complete Vehicle Pricing Service

What I can provide:
• Base car price + COE + Registration
• Total upfront cost calculation
• Financing options & monthly payments
• Insurance estimates & road tax

📋 To get accurate pricing, please specify:
• Brand (Toyota, Honda, BMW, etc.)
• Model (Camry, Civic, 3 Series, etc.)

Would you like vehicle recommendations or financing options?"""
            
            dispatcher.utter_message(text=pricing_message)
            
        except Exception as e:
            logging.error(f"Error in vehicle pricing action: {e}")
            dispatcher.utter_message(text="I can help you with vehicle pricing. Please specify the car brand and model you're interested in.")
        
        return []

class ActionContactInfo(Action):
    def name(self) -> Text:
        return "action_contact_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            contact_message = """📞 Contact CleverCompanion

📱 WhatsApp: +65 9876 5432
📞 Call: +65 6234 5678  
📧 Email: info@clevercompanion.sg

🕒 Hours:
Mon-Fri: 9AM-7PM
Sat: 9AM-6PM
Sun: 10AM-5PM

Ready to assist with all your automotive needs!
How can we help?"""
            
            dispatcher.utter_message(text=contact_message)
            
        except Exception as e:
            logger.error(f"Error in contact info action: {e}")
            dispatcher.utter_message(text="You can contact us at +65 6234 5678 or info@clevercompanion.sg")
        
        return []

class ActionLocationInfo(Action):
    def name(self) -> Text:
        return "action_location_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Location information with embedded map - Fixed for image 5 & 6
            location_message = """📍 Getting Here:
MRT Jurong East (CC22/NS1) 5min walk
Bus 335/187/143 Stop B4321
Car PIE Exit Jurong East 2min drive

🕒 Operating Hours:
Mon-Fri: 9AM-7PM
Sat: 9AM-6PM
Sun: 10AM-5PM

Visit us now!

GOOGLE_MAPS:https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7234567890123!2d103.7421542!3d1.3330736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da0fce1e2c8b85%3A0x6b5e1b0c5d5e5e5e!2sJurong%20East%20MRT%20Station!5e0!3m2!1sen!2ssg!4v1234567890123!5m2!1sen!2ssg"""
            
            dispatcher.utter_message(text=location_message)
            
        except Exception as e:
            logging.error(f"Error in location info action: {e}")
            dispatcher.utter_message(text="We're located at Jurong East, easily accessible by MRT and bus.")
        
        return []

class ActionOperatingHours(Action):
    def name(self) -> Text:
        return "action_operating_hours"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Simplified operating hours only - Fixed for image 7
            hours_message = """🕒 Operating Hours

🏢 Showroom Operating Hours:
• Monday - Friday : 9:00 AM - 7:00 PM
• Saturday : 9:00 AM - 6:00 PM
• Sunday : 10:00 AM - 5:00 PM
• Public Holidays : 10:00 AM - 4:00 PM

🔧 Service Center:
• Monday - Friday : 8:00 AM - 6:00 PM
• Saturday : 8:00 AM - 5:00 PM"""
            
            dispatcher.utter_message(text=hours_message)
            
        except Exception as e:
            logging.error(f"Error in operating hours action: {e}")
            dispatcher.utter_message(text="We're open Mon-Fri 9AM-7PM, Sat 9AM-6PM, Sun 10AM-5PM")
        
        return []

class ActionStoreLocation(Action):
    def name(self) -> Text:
        return "action_store_location"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Store location response - Fixed for image 8
            store_message = """📍 CleverCompanion Store Location

🏢 Address:
123 Jurong East Street 13
Singapore 609123

🚇 Getting Here:
MRT Jurong East (CC22/NS1) 5min walk
Bus 335/187/143 Stop B4321
Car PIE Exit Jurong East 2min drive

🅿️ Parking Available
Free parking for customers

GOOGLE_MAPS:https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7234567890123!2d103.7421542!3d1.3330736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da0fce1e2c8b85%3A0x6b5e1b0c5d5e5e5e!2sJurong%20East%20MRT%20Station!5e0!3m2!1sen!2ssg!4v1234567890123!5m2!1sen!2ssg"""
            
            dispatcher.utter_message(text=store_message)
            
        except Exception as e:
            logging.error(f"Error in store location action: {e}")
            dispatcher.utter_message(text="We're located at Jurong East, easily accessible by MRT and bus.")
        
        return []

class ActionBookTestDrive(Action):
    def name(self) -> Text:
        return "action_book_test_drive"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Get current slots for context
            car_brand = tracker.get_slot("car_brand")
            car_model = tracker.get_slot("car_model")
            user_text = tracker.latest_message.get("text", "").lower()
            
            # Check for specific vehicle mentions
            if not car_brand and not car_model:
                if "toyota" in user_text:
                    car_brand = "Toyota"
                    if "camry" in user_text:
                        car_model = "Camry"
                    elif "alphard" in user_text:
                        car_model = "Alphard"
                elif "honda" in user_text:
                    car_brand = "Honda"
                    if "civic" in user_text:
                        car_model = "Civic"
                elif "bmw" in user_text:
                    car_brand = "BMW"
                    if "3 series" in user_text:
                        car_model = "3 Series"
            
            if car_brand and car_model:
                response = format_greeting() + f"""🚗 Test Drive Booking - {car_brand} {car_model}

📅 Available Slots This Week:
• Monday - Friday: 9:00 AM - 6:00 PM
• Saturday: 9:00 AM - 4:00 PM
• Sunday: 10:00 AM - 3:00 PM

📍 Test Drive Locations:
• Main Showroom: 123 Automotive Avenue, Singapore 123456
• East Branch: 456 East Coast Road, Singapore 234567
• West Branch: 789 Jurong West Street, Singapore 345678

📋 What to Bring:
• Valid Singapore Driving License
• NRIC or Passport
• Wear comfortable driving shoes

⏰ Booking Process:
1. Call: +65 6234 5678 (Preferred - Instant confirmation)
2. WhatsApp: +65 9876 5432
3. Online: www.autocompanion.sg/test-drive
4. Visit: Walk-in (subject to availability)

🚗 {car_brand} {car_model} Test Drive Includes:
• 30-minute guided test drive
• Feature demonstration
• Personalized consultation
• Immediate pricing quotation
• Financing options discussion

💡 Pro Tips:
• Test drive during different times (morning/evening)
• Try various driving conditions (highway/city)
• Bring family members for comfort assessment
• Ask about current promotions

📞 Quick Booking: Call +65 6234 5678 and mention "Test Drive {car_brand} {car_model}"

Would you like me to help you with anything else about the {car_brand} {car_model}?"""
            else:
                response = format_greeting() + """🚗 Test Drive Booking Service

🌟 Popular Test Drive Options:
• Toyota Camry - Reliable sedan experience
• Honda CR-V - Family SUV comfort
• BMW 3 Series - Luxury performance
• Mercedes C-Class - Premium driving

📅 Available Time Slots:
• Weekdays: 9:00 AM - 6:00 PM
• Saturday: 9:00 AM - 4:00 PM  
• Sunday: 10:00 AM - 3:00 PM

📍 Multiple Locations:
• Central: Marina Bay area
• East: East Coast/Bedok
• West: Jurong/Clementi
• North: Ang Mo Kio/Woodlands

📋 Requirements:
• Valid Singapore driving license
• NRIC/Passport for identification
• Minimum age: 21 years old

⚡ Easy Booking Methods:
1. Phone: +65 6234 5678 (Fastest)
2. WhatsApp: +65 9876 5432
3. Online: www.autocompanion.sg/test-drive
4. Walk-in: Subject to availability

💡 What's Included:
• 30-minute test drive session
• Professional guidance
• Feature demonstrations
• Immediate pricing quotation
• Financing consultation

🚗 Which vehicle would you like to test drive?
Just tell me the car model, and I'll help you book it!"""
            
            dispatcher.utter_message(text=response)
            
            # Set slots if we found specific vehicle
            if car_brand and car_model:
                return [
                    SlotSet("car_brand", car_brand),
                    SlotSet("car_model", car_model)
                ]
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionBookTestDrive: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't process your test drive request right now. Please call +65 6234 5678 directly.")
            return []

class ActionGetMaintenanceInfo(Action):
    def name(self) -> Text:
        return "action_get_maintenance_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = format_greeting() + """🔧 Singapore Vehicle Maintenance Guide

📅 Service Schedule:
• 5,000km/6 months: Oil & filter change
• 10,000km: Complete inspection & service  
• 20,000km: Major service (plugs, filters)
• 40,000km: Transmission & brake fluid

💰 Typical Service Costs:
• Basic service: $150-$300
• Major service: $400-$800  
• Brake service: $200-$500
• Tire replacement: $400-$1,200 (set)
• Aircon service: $80-$150

⚠️ Singapore-Specific Checks:
• Aircon service: Every 6 months (tropical climate)
• Battery health: Humidity impact monitoring
• Tire pressure: Weekly checks (heat expansion)
• Brake inspection: ERP/traffic jam wear

💡 Smart Maintenance Tips:
• Keep detailed service records for COE renewal
• Use authorized workshops during warranty period
• Group multiple services to save costs
• Address warning signs early to prevent major repairs

📞 Schedule Service:
• Service Hotline: +65 6xxx-xxxx
• Online booking available
• Mobile service for basic maintenance

Need help with specific maintenance issues or booking?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionGetLoanInfo(Action):
    def name(self) -> Text:
        return "action_get_loan_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """🏦 Car Financing Solutions (Singapore)

📊 Loan Options Available:
• Hire Purchase: Most popular, own car after loan completion
• Personal Loan: Higher interest but more flexible
• Bank Loan: Competitive rates for good credit scores

💰 Interest Rates (Current):
• Best Rates: 2.58% - 2.98% per annum
• Standard Rates: 3.18% - 3.78% per annum
• Factors: Credit score, loan amount, tenure

📋 Required Documents:
• NRIC/Passport
• Latest 3 months payslips
• CPF contribution history
• Bank statements (6 months)

💡 Smart Tips:
• Compare rates from multiple banks
• Consider total interest cost, not just monthly payment
• Factor in insurance and road tax costs
• Pre-approval speeds up car buying process

Would you like to use our loan calculator or get bank recommendations?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionProvideBusinessHours(Action):
    def name(self) -> Text:
        return "action_provide_business_hours"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = format_greeting() + """🕘 Operating Hours & Contact Information

🏢 Showroom Operating Hours:
• Monday - Friday    : 9:00 AM - 7:00 PM
• Saturday          : 9:00 AM - 6:00 PM  
• Sunday            : 10:00 AM - 5:00 PM
• Public Holidays   : 10:00 AM - 4:00 PM

🔧 Service Center:
• Monday - Friday    : 8:00 AM - 6:00 PM
• Saturday          : 8:00 AM - 5:00 PM
• Sunday            : 9:00 AM - 4:00 PM
• Emergency Service : 24/7 available

📞 Contact Information:
• Main Line         : +65 6xxx xxxx
• Service Hotline   : +65 6xxx xxxx
• Sales WhatsApp    : +65 9xxx xxxx
• Emergency         : +65 6xxx xxxx (24/7)

📍 Location:
123 Automotive Drive, Singapore 123456
Near Jurong East MRT (5 minutes walk)

🚗 Special Services:
• Extended Hours    : Available by appointment
• Home Delivery     : For selected models
• Mobile Service    : Basic maintenance at your location
• 24/7 Breakdown    : Island-wide coverage

🎯 Best Times to Visit:
• Weekday mornings  : Less crowded
• Saturday afternoons: Full staff available  
• Avoid Sunday evenings: Peak period

Need directions or want to schedule a visit?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionContactUs(Action):
    def name(self) -> Text:
        return "action_contact_us"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_text = tracker.latest_message.get("text", "").lower()
        
        if "location" in user_text or "address" in user_text or "where" in user_text:
            response = """📍 Our Showroom Location

209 Pandan Gardens, Level 3 Cycle & Carriage Auto Hub, Singapore 609339

🚇 Getting Here:
MRT Jurong East (CC22/NS1) 5min walk
Bus 335/187/143 Stop B4321
Car PIE Exit Jurong East 2min drive

🕒 Operating Hours:
Mon-Fri: 9AM-7PM
Sat: 9AM-6PM
Sun: 10AM-5PM

Visit us now!

GOOGLE_MAPS:https://maps.google.com/maps?q=209+Pandan+Gardens+Level+3+Cycle+Carriage+Auto+Hub+Singapore+609339"""
        else:
            response = """📞 Contact CleverCompanion

Call: +65 6234 5678
WhatsApp: +65 9876 5432
Email: info@clevercompanion.sg

🕒 Hours:
Mon-Fri: 9AM-7PM
Sat: 9AM-6PM
Sun: 10AM-5PM

Ready to assist with all your automotive needs! How can we help?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionCalculateLoan(Action):
    def name(self) -> Text:
        return "action_calculate_loan"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """🏦 Car Loan Calculator (Singapore)

LOAN_FORM_START
Car Price: INPUT_NUMBER:car_price:50000:500000:Car price in SGD
Down Payment %: INPUT_SELECT:down_payment:10,20,30,40,50:Down payment percentage
Loan Tenure: INPUT_SELECT:loan_tenure:1,2,3,4,5,6,7:Loan tenure in years
Bank Interest Rate: INPUT_SELECT:interest_rate:DBS 2.68%,OCBC 2.88%,UOB 2.78%,Maybank 3.18%,CIMB 2.98%:Choose your preferred bank
CALCULATE_BUTTON:Calculate Monthly Payment
LOAN_FORM_END

💡 Singapore Bank Rates (Current):
• DBS: 2.68% - 3.28%
• OCBC: 2.88% - 3.48% 
• UOB: 2.78% - 3.38%
• Maybank: 3.18% - 3.78%
• CIMB: 2.98% - 3.58%

Note: Rates vary based on credit score and loan amount. Final rates subject to bank approval."""
        
        dispatcher.utter_message(text=response)
        return []

class ActionGetMaintenanceCosts(Action):
    def name(self) -> Text:
        return "action_get_maintenance_costs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """🔧 Singapore Vehicle Maintenance Guide

📅 Service Schedule:
• 5,000km/6 months: Oil & filter change ($80-120)
• 10,000km: Complete inspection & service ($200-350)
• 20,000km: Major service + brake check ($400-600)
• 40,000km: Transmission service ($300-500)
• 60,000km: Timing belt replacement ($500-800)

💰 Annual Cost Estimates:
• Compact Car: $800-1,200/year
• Mid-size Sedan: $1,200-1,800/year
• SUV/MPV: $1,500-2,500/year
• Luxury Vehicle: $2,000-4,000/year

🏪 Authorized Service Centers:
• Toyota: Island-wide network
• Honda: 8 locations
• BMW/Mercedes: Premium service centers

💡 Money-Saving Tips:
• Book during off-peak periods
• Compare authorized vs independent workshops
• Keep detailed service records for warranty
• Use genuine parts for critical components

Need specific brand maintenance info or service booking assistance?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionProvideHelp(Action):
    def name(self) -> Text:
        return "action_provide_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """🆘 CleverCompanion Help Center

I'm your Singapore automotive assistant! Here's what I can help you with:

BUTTON_OPTIONS_START
💰 COE Prices|Get latest Certificate of Entitlement prices for all categories
🚗 Vehicle Info|Car recommendations, specifications, and comparisons  
📅 Test Drives|Book test drives and schedule appointments
🔧 Maintenance|Service guidance with Singapore-specific schedules
💳 Loan Calculator|Calculate monthly payments with local bank rates
📞 Contact Us|Get our location, hours, and contact information
🏦 Financing Options|Explore car loan and financing solutions
🚙 Vehicle Comparison|Compare different car models and features
⚡ Quick Quote|Get instant pricing estimates
🛠️ Service Booking|Schedule maintenance appointments
BUTTON_OPTIONS_END

🎯 Quick Commands:
• "COE prices" - Current rates
• "Toyota Camry" - Vehicle details  
• "Test drive" - Book appointment
• "Maintenance" - Service guide
• "Loan calculator" - Finance tools
• "Contact us" - Our details

Just type your question naturally and I'll assist you! What would you like to know?"""
        
        dispatcher.utter_message(text=response)
        return []

class ActionExplainCoeCategories(Action):
    def name(self) -> Text:
        return "action_explain_coe_categories"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            user_text = tracker.latest_message.get("text", "").lower()
            
            # Check if user asked about specific category
            if "category a" in user_text or "cat a" in user_text:
                response = """🚗 COE Category A - Cars with engine ≤1600cc AND power ≤130bhp - Current Price: $80,000-$120,000 - Popular Models: Toyota Camry, Honda Civic, Toyota Prius, Mazda 3, Nissan Almera - Best For: Daily commuting, first-time buyers, budget-conscious families - Advantages: Lower COE prices, better fuel economy, lower road tax, easier parking - Perfect For: City driving, small to medium families, new drivers - Need help choosing a specific Category A vehicle?"""
                
            elif "category b" in user_text or "cat b" in user_text:
                response = format_greeting() + """🚙 COE Category B Explained

📋 Definition:
Cars with engine capacity >1600cc OR power >130bhp (brake horsepower)

💰 Current Information:
• Price Range: $100,000 - $150,000 (varies by bidding)
• Typical Buyers: Families, performance enthusiasts, luxury seekers
• Market Share: ~35% of all car COEs

🏎️ Popular Category B Vehicles:
• BMW 3 Series - Premium sports sedan
• Mercedes C-Class - Luxury comfort
• Honda CR-V - Family SUV champion
• Toyota Harrier - Stylish crossover
• Mazda CX-5 - Sporty SUV

✅ Advantages:
• More powerful engines
• Better highway performance
• Luxurious features
• Stronger acceleration
• Higher status appeal

❌ Considerations:
• Generally higher COE prices
• Higher fuel consumption
• More expensive maintenance
• Higher insurance premiums

💡 Perfect for:
• Large families
• Highway frequent users
• Performance enthusiasts
• Status-conscious buyers
• Those who need towing capacity

🎯 Smart Buying Tip:
Category B gives you more power and luxury, but budget for the higher running costs!

Interested in specific Category B models?"""
                
            elif "category d" in user_text or "cat d" in user_text:
                response = format_greeting() + """🏍️ COE Category D Explained

📋 Definition:
All motorcycles and scooters regardless of engine capacity

💰 Current Information:
• Price Range: $8,000 - $15,000 (most stable category)
• Typical Buyers: Commuters, delivery riders, motorcycle enthusiasts
• Market Share: ~15% of all COEs

🛵 Vehicle Types Covered:
• Scooters - 50cc to 250cc urban mobility
• Sport Bikes - High-performance motorcycles
• Cruisers - Comfort touring bikes
• Adventure Bikes - Off-road capable
• Electric Bikes - Eco-friendly options

✅ Advantages:
• Lowest COE category price
• Excellent fuel economy
• Easy parking anywhere
• Quick urban navigation
• Lower maintenance costs
• No ERP during off-peak

❌ Considerations:
• Weather dependency
• Limited passenger/cargo capacity
• Higher accident risk
• Requires motorcycle license
• No air conditioning

💡 Perfect for:
• Daily commuters
• Delivery professionals
• Urban mobility
• Recreational riding
• Cost-effective transport

🎯 Smart Buying Tip:
Category D offers the most affordable personal transport in Singapore!

Want help choosing the right motorcycle?"""
                
            elif "category e" in user_text or "cat e" in user_text:
                response = format_greeting() + """🚚 COE Category E (Open) Explained

📋 Definition:
Open category that can be used for ANY vehicle type - cars, motorcycles, commercial vehicles

💰 Current Information:
• Price Range: $90,000 - $140,000 (most flexible but often expensive)
• Typical Buyers: Flexibility seekers, when preferred category is too expensive
• Market Share: ~10% of all COEs

🔄 Flexibility Benefits:
• Can buy ANY vehicle type
• Use when Category A/B prices are high
• Convert between vehicle types
• Strategic bidding option
• Future-proof investment

🚗 Common Uses:
• Luxury Cars - When Category B is expensive  
• Commercial Vehicles - Vans, trucks, taxis
• Motorcycles - When Category D is high
• Electric Vehicles - Future technology
• Specialty Vehicles - Unique requirements

✅ Advantages:
• Ultimate flexibility
• Strategic pricing option
• Can switch vehicle types
• Good for business use
• Hedge against category spikes

❌ Considerations:
• Often most expensive option
• Requires careful market timing
• May pay premium for flexibility
• Limited quantity available

💡 Perfect for:
• Business owners
• Flexible buyers
• When other categories are expensive
• Multiple vehicle needs
• Investment strategy

🎯 Smart Buying Tip:
Use Category E strategically when your preferred category prices are unusually high!

Need help with COE strategy planning?"""
                
            else:
                # General explanation of all categories
                response = format_greeting() + """📊 COE Categories Explained (Singapore)

🚗 Category A (≤1600cc & ≤130bhp)
• Purpose: Smaller, more economical cars
• Examples: Toyota Camry, Honda Civic, Toyota Prius
                • Great for: Daily commuting, first-time buyers
• Typical Price: $80,000 - $120,000

🚙 Category B (>1600cc or >130bhp)
• Purpose: Larger, more powerful cars
• Examples: BMW 3 Series, Mercedes C-Class, Honda CR-V
                • Great for: Families, performance seekers
• Typical Price: $100,000 - $150,000

🏍️ Category D (Motorcycles)
• Purpose: All motorcycles and scooters
• Examples: Honda PCX, Yamaha R1, Harley Davidson
                • Great for: Urban commuting, cost-effective transport
• Typical Price: $8,000 - $15,000

🚚 Category E (Open)
• Purpose: Flexible - can be used for any vehicle
• Examples: Any car, motorcycle, or commercial vehicle
                • Great for: Strategic buyers, business use
• Typical Price: $90,000 - $140,000

💡 Choosing the Right Category:
• Budget-conscious: Category A or D
• Family needs: Category B
• Flexibility: Category E
• Business use: Category E

🎯 Pro Tips:
• Monitor trends for 2-3 months before buying
• Consider total cost (car + COE + insurance)
• Category E can be strategic when others are expensive

Which category interests you most? I can provide detailed information!"""
            
            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionExplainCoeCategories: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't explain COE categories right now. Please try again later.")
            return []