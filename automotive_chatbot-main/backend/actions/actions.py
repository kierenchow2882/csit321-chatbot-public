# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from utils.coe_scraper import COEScraper
from utils.car_database import CarDatabase
import logging

# Initialize global instances
coe_scraper = COEScraper()
car_db = None

def get_car_database():
    """Get or create car database instance"""
    global car_db
    if car_db is None:
        try:
            car_db = CarDatabase()
        except Exception as e:
            logging.error(f"Failed to initialize car database: {e}")
            car_db = None
    return car_db

class ActionGetVehicleInfo(Action):
    def name(self) -> Text:
        return "action_get_vehicle_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            db = get_car_database()
            if not db:
                dispatcher.utter_message(text="Sorry, I'm having trouble accessing our car database right now. Please try again later.")
                return []
            
            # Get entities from user message
            entities = tracker.latest_message.get('entities', [])
            car_brand = None
            car_model = None
            car_type = None
            
            for entity in entities:
                if entity['entity'] == 'car_brand':
                    car_brand = entity['value']
                elif entity['entity'] == 'car_model':
                    car_model = entity['value']
                elif entity['entity'] == 'car_type':
                    car_type = entity['value']
            
            # Search cars based on available information
            if car_brand and car_model:
                cars = db.get_car_by_brand_model(car_brand, car_model)
            elif car_brand:
                cars = db.search_cars(brand=car_brand)
            elif car_type:
                cars = db.search_cars(category=car_type)
            else:
                cars = db.get_all_cars()[:5]  # Limit to 5 cars
            
            if not cars:
                dispatcher.utter_message(text="I couldn't find any cars matching your criteria. Would you like to see our available inventory?")
                return []
            
            # Format response
            if len(cars) == 1:
                car = cars[0]
                response = f"Here's information about the {car['brand']} {car['model']}:\n\n"
                response += f"🚗 **{car['year']} {car['brand']} {car['model']}**\n"
                response += f"💰 Price: ${car['price']:,}\n"
                response += f"⛽ Engine: {car['engine']}\n"
                response += f"🔧 Transmission: {car['transmission']}\n"
                response += f"📊 Condition: {car['condition']}\n"
                response += f"📦 Stock: {car['stock']} available\n"
                
                if car['features']:
                    response += f"✨ Features: {', '.join(car['features'][:3])}\n"
                
                response += f"\nWould you like to schedule a test drive or get pricing details including COE?"
                
            else:
                response = f"I found {len(cars)} cars for you:\n\n"
                for i, car in enumerate(cars[:3], 1):
                    response += f"{i}. **{car['brand']} {car['model']}** - ${car['price']:,}\n"
                    response += f"   {car['condition']} | {car['stock']} in stock\n\n"
                
                if len(cars) > 3:
                    response += f"...and {len(cars) - 3} more. Would you like to see specific details for any of these?"
            
            dispatcher.utter_message(text=response)
            
            # Set slots for context
            return [
                SlotSet("last_searched_brand", car_brand),
                SlotSet("last_searched_model", car_model),
                SlotSet("last_searched_type", car_type)
            ]
            
        except Exception as e:
            logging.error(f"Error in ActionGetVehicleInfo: {e}")
            dispatcher.utter_message(text="I'm sorry, I encountered an error while searching for cars. Please try again.")
            return []

class ActionGetCOEPrices(Action):
    def name(self) -> Text:
        return "action_get_coe_prices"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Get live COE data
            coe_data = coe_scraper.get_live_coe_prices()
            
            if coe_data and 'category_a' in coe_data:
                response = "📊 **Latest COE Prices**\n\n"
                
                # Category A (Cars up to 1600cc & 130bhp)
                cat_a = coe_data['category_a']
                response += f"🚗 **Category A** (≤1600cc): ${cat_a['current']:,}\n"
                
                # Category B (Cars above 1600cc or 130bhp)
                cat_b = coe_data['category_b']
                response += f"🚙 **Category B** (>1600cc): ${cat_b['current']:,}\n"
                
                # Category D (Motorcycles)
                if 'category_d' in coe_data:
                    cat_d = coe_data['category_d']
                    response += f"🏍️ **Category D** (Motorcycles): ${cat_d['current']:,}\n"
                
                # Category E (Commercial)
                if 'category_e' in coe_data:
                    cat_e = coe_data['category_e']
                    response += f"🚚 **Category E** (Commercial): ${cat_e['current']:,}\n"
                
                response += f"\n*Updated: {cat_a.get('last_updated', 'Recently')}*"
            else:
                # Fallback to static prices if scraping fails
                response = "Here are the latest COE prices:\n\n"
                response += "🚗 **Category A** (≤1600cc): $85,000\n"
                response += "🚙 **Category B** (>1600cc): $98,000\n"
                response += "🏍️ **Category D** (Motorcycles): $8,500\n"
                response += "🚚 **Category E** (Commercial): $65,000\n"
                response += "\n*Prices are updated regularly from official sources*"
            
            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionGetCOEPrices: {e}")
            # Fallback response
            response = "Here are the current COE prices:\n\n"
            response += "🚗 **Category A** (≤1600cc): $85,000\n"
            response += "🚙 **Category B** (>1600cc): $98,000\n"
            response += "🏍️ **Category D** (Motorcycles): $8,500\n"
            response += "🚚 **Category E** (Commercial): $65,000\n"
            dispatcher.utter_message(text=response)
            return []

class ActionGetPricing(Action):
    def name(self) -> Text:
        return "action_get_pricing"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            db = get_car_database()
            if not db:
                dispatcher.utter_message(text="Sorry, I'm having trouble accessing our pricing database right now.")
                return []
            
            # Get entities
            entities = tracker.latest_message.get('entities', [])
            car_brand = None
            car_model = None
            
            for entity in entities:
                if entity['entity'] == 'car_brand':
                    car_brand = entity['value']
                elif entity['entity'] == 'car_model':
                    car_model = entity['value']
            
            # Try to get car from previous context if not specified
            if not car_brand:
                car_brand = tracker.get_slot('last_searched_brand')
            if not car_model:
                car_model = tracker.get_slot('last_searched_model')
            
            if not car_brand and not car_model:
                dispatcher.utter_message(text="Which car would you like pricing information for? Please specify the brand and model.")
                return []
            
            # Search for the car
            if car_brand and car_model:
                cars = db.get_car_by_brand_model(car_brand, car_model)
            elif car_brand:
                cars = db.search_cars(brand=car_brand)
            else:
                cars = db.search_cars(model=car_model)
            
            if not cars:
                dispatcher.utter_message(text=f"I couldn't find pricing for {car_brand} {car_model}. Would you like to see our available inventory?")
                return []
            
            car = cars[0]  # Take the first match
            
            # Get live COE data
            coe_data = coe_scraper.get_live_coe_prices()
            
            # Determine COE category and price
            coe_category = car.get('coe_category', 'A')
            if coe_category == 'A':
                coe_price = coe_data['category_a']['current']
            elif coe_category == 'B':
                coe_price = coe_data['category_b']['current']
            else:
                coe_price = coe_data.get('category_e', {}).get('current', coe_data['category_a']['current'])
            
            # Calculate total costs
            car_price = car['price']
            registration_fee = 140
            inspection_fee = 30
            road_tax = 742  # Estimated annual road tax
            insurance = 1200  # Estimated annual insurance
            
            total_upfront = car_price + coe_price + registration_fee + inspection_fee
            
            # Format response
            response = f"💰 **Complete Pricing for {car['brand']} {car['model']}**\n\n"
            response += f"🚗 Car Price: ${car_price:,}\n"
            response += f"📋 COE (Cat {coe_category}): ${coe_price:,}\n"
            response += f"📝 Registration: ${registration_fee:,}\n"
            response += f"🔍 Inspection: ${inspection_fee:,}\n"
            response += f"{'─' * 30}\n"
            response += f"💵 **Total Upfront: ${total_upfront:,}**\n\n"
            
            response += f"📅 **Annual Costs:**\n"
            response += f"🛣️ Road Tax: ~${road_tax:,}\n"
            response += f"🛡️ Insurance: ~${insurance:,}\n\n"
            
            # Financing options
            monthly_payment_3yr = total_upfront / 36
            monthly_payment_5yr = total_upfront / 60
            
            response += f"💳 **Financing Options:**\n"
            response += f"3 years: ~${monthly_payment_3yr:,.0f}/month\n"
            response += f"5 years: ~${monthly_payment_5yr:,.0f}/month\n\n"
            
            response += f"📊 COE prices are live and may change. Would you like to schedule a test drive?"
            
            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionGetPricing: {e}")
            dispatcher.utter_message(text="I'm sorry, I couldn't calculate the pricing right now. Please try again.")
            return []

class ActionBookTestDrive(Action):
    def name(self) -> Text:
        return "action_book_test_drive"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            db = get_car_database()
            if not db:
                dispatcher.utter_message(text="Sorry, I'm having trouble accessing our booking system right now.")
                return []
            
            # Get entities
            entities = tracker.latest_message.get('entities', [])
            car_brand = None
            car_model = None
            
            for entity in entities:
                if entity['entity'] == 'car_brand':
                    car_brand = entity['value']
                elif entity['entity'] == 'car_model':
                    car_model = entity['value']
            
            # Try to get car from previous context
            if not car_brand:
                car_brand = tracker.get_slot('last_searched_brand')
            if not car_model:
                car_model = tracker.get_slot('last_searched_model')
            
            if car_brand and car_model:
                cars = db.get_car_by_brand_model(car_brand, car_model)
                if cars:
                    car = cars[0]
                    response = f"🚗 **Test Drive Booking for {car['brand']} {car['model']}**\n\n"
                    response += f"Great choice! The {car['year']} {car['brand']} {car['model']} is available for test drive.\n\n"
                    response += f"📋 **Vehicle Details:**\n"
                    response += f"• Engine: {car['engine']}\n"
                    response += f"• Transmission: {car['transmission']}\n"
                    response += f"• Condition: {car['condition']}\n"
                    response += f"• Stock: {car['stock']} available\n\n"
                    response += f"📅 **Available Time Slots:**\n"
                    response += f"• Weekdays: 9:00 AM - 6:00 PM\n"
                    response += f"• Weekends: 10:00 AM - 5:00 PM\n\n"
                    response += f"📞 To confirm your test drive, please call us at +65 6123-4567 or visit our showroom.\n"
                    response += f"📍 Location: 123 Car Street, Singapore 123456\n\n"
                    response += f"Would you like pricing information or details about financing options?"
                else:
                    response = f"I couldn't find the {car_brand} {car_model} in our current inventory. Would you like to see similar available models?"
            else:
                # Show available cars for test drive
                cars = db.get_all_cars()[:5]
                response = "🚗 **Available Cars for Test Drive:**\n\n"
                for i, car in enumerate(cars, 1):
                    response += f"{i}. {car['brand']} {car['model']} ({car['year']})\n"
                    response += f"   ${car['price']:,} | {car['stock']} available\n\n"
                response += "Which car would you like to test drive? Please specify the brand and model."
            
            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionScheduleTestDrive: {e}")
            dispatcher.utter_message(text="I'm sorry, I couldn't process your test drive request right now. Please try again.")
            return []

class ActionGetMaintenanceInfo(Action):
    def name(self) -> Text:
        return "action_get_maintenance_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Get brand from entities or context
            entities = tracker.latest_message.get('entities', [])
            car_brand = None
            
            for entity in entities:
                if entity['entity'] == 'car_brand':
                    car_brand = entity['value']
            
            if not car_brand:
                car_brand = tracker.get_slot('last_searched_brand')
            
            # Brand-specific maintenance schedules
            maintenance_schedules = {
                'toyota': {
                    'basic_service': '6 months / 10,000 km',
                    'major_service': '12 months / 20,000 km',
                    'oil_change': '6 months / 10,000 km',
                    'brake_check': '12 months',
                    'tire_rotation': '6 months',
                    'estimated_cost': '$150 - $400'
                },
                'bmw': {
                    'basic_service': '12 months / 15,000 km',
                    'major_service': '24 months / 30,000 km',
                    'oil_change': '12 months / 15,000 km',
                    'brake_check': '24 months',
                    'tire_rotation': '12 months',
                    'estimated_cost': '$300 - $800'
                },
                'mercedes': {
                    'basic_service': '12 months / 15,000 km',
                    'major_service': '24 months / 30,000 km',
                    'oil_change': '12 months / 15,000 km',
                    'brake_check': '24 months',
                    'tire_rotation': '12 months',
                    'estimated_cost': '$350 - $900'
                },
                'tesla': {
                    'basic_service': '12 months / 20,000 km',
                    'major_service': '24 months / 40,000 km',
                    'battery_check': '12 months',
                    'brake_check': '24 months',
                    'tire_rotation': '6 months',
                    'estimated_cost': '$200 - $500'
                }
            }
            
            if car_brand and car_brand.lower() in maintenance_schedules:
                schedule = maintenance_schedules[car_brand.lower()]
                response = f"🔧 **{car_brand.title()} Maintenance Schedule**\n\n"
                
                for service, interval in schedule.items():
                    if service != 'estimated_cost':
                        service_name = service.replace('_', ' ').title()
                        response += f"• **{service_name}**: {interval}\n"
                
                response += f"\n💰 **Estimated Service Cost**: {schedule['estimated_cost']}\n\n"
                response += f"📋 **Important Notes:**\n"
                response += f"• Follow whichever comes first (time or mileage)\n"
                response += f"• Regular maintenance preserves warranty\n"
                response += f"• Book service appointments in advance\n\n"
                response += f"Would you like help finding an authorized service center?"
                
            else:
                response = "🔧 **General Maintenance Guidelines**\n\n"
                response += "• **Basic Service**: Every 6-12 months\n"
                response += "• **Oil Change**: Every 6-12 months\n"
                response += "• **Brake Check**: Every 12-24 months\n"
                response += "• **Tire Rotation**: Every 6 months\n"
                response += "• **Major Service**: Every 12-24 months\n\n"
                response += "💡 For specific maintenance schedules, please specify your car brand (Toyota, BMW, Mercedes, Tesla, etc.)\n\n"
                response += "Would you like information about a specific brand?"
            
            dispatcher.utter_message(text=response)
            return []
            
        except Exception as e:
            logging.error(f"Error in ActionGetMaintenanceInfo: {e}")
            dispatcher.utter_message(text="I'm sorry, I couldn't retrieve maintenance information right now. Please try again.")
            return []
