import pymongo
from pymongo import MongoClient
from typing import List, Dict, Optional
import logging
from datetime import datetime
import os

class CarDatabase:
    def __init__(self, connection_string=None):
        """
        Initialize MongoDB connection for car inventory
        """
        if connection_string is None:
            # Default local MongoDB connection
            connection_string = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        
        try:
            self.client = MongoClient(connection_string)
            self.db = self.client['automotive_chatbot']
            self.cars_collection = self.db['cars']
            self.brands_collection = self.db['brands']
            
            # Test connection
            self.client.admin.command('ping')
            logging.info("Connected to MongoDB successfully")
            
            # Create indexes for better performance
            self._create_indexes()
            
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def _create_indexes(self):
        """Create database indexes for better query performance"""
        try:
            # Create indexes on commonly queried fields
            self.cars_collection.create_index("brand")
            self.cars_collection.create_index("model")
            self.cars_collection.create_index("category")
            self.cars_collection.create_index("price")
            self.cars_collection.create_index("available")
            self.cars_collection.create_index([("brand", 1), ("model", 1)])
            
            logging.info("Database indexes created successfully")
        except Exception as e:
            logging.warning(f"Could not create indexes: {e}")
    
    def insert_sample_data(self):
        """Insert sample car data for testing"""
        sample_cars = [
            {
                "brand": "Toyota",
                "model": "Camry",
                "year": 2024,
                "type": "Sedan",
                "category": "Family",
                "price": 45000,
                "coe_category": "A",
                "engine": "2.5L Hybrid",
                "fuel_type": "Hybrid",
                "transmission": "CVT",
                "features": ["Safety Sense 2.0", "Apple CarPlay", "LED Headlights"],
                "available": True,
                "stock": 5,
                "mileage": 0,
                "condition": "New",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "brand": "BMW",
                "model": "M3",
                "year": 2024,
                "type": "Sports Sedan",
                "category": "Sports",
                "price": 180000,
                "coe_category": "B",
                "engine": "3.0L Twin-Turbo",
                "fuel_type": "Petrol",
                "transmission": "8-Speed Automatic",
                "features": ["M Performance", "Carbon Fiber Trim", "Harman Kardon Audio"],
                "available": True,
                "stock": 2,
                "mileage": 0,
                "condition": "New",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "brand": "Mercedes-Benz",
                "model": "C-Class",
                "year": 2023,
                "type": "Luxury Sedan",
                "category": "Luxury",
                "price": 75000,
                "coe_category": "A",
                "engine": "1.5L Turbo",
                "fuel_type": "Petrol",
                "transmission": "9-Speed Automatic",
                "features": ["MBUX Infotainment", "LED High Performance", "Active Brake Assist"],
                "available": True,
                "stock": 3,
                "mileage": 15000,
                "condition": "Used",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "brand": "Porsche",
                "model": "911 Carrera",
                "year": 2024,
                "type": "Sports Car",
                "category": "Sports",
                "price": 350000,
                "coe_category": "B",
                "engine": "3.0L Twin-Turbo",
                "fuel_type": "Petrol",
                "transmission": "8-Speed PDK",
                "features": ["Sport Chrono Package", "PASM", "Porsche Communication Management"],
                "available": True,
                "stock": 1,
                "mileage": 0,
                "condition": "New",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "brand": "Tesla",
                "model": "Model 3",
                "year": 2024,
                "type": "Electric Sedan",
                "category": "Electric",
                "price": 120000,
                "coe_category": "A",
                "engine": "Electric Motor",
                "fuel_type": "Electric",
                "transmission": "Single-Speed",
                "features": ["Autopilot", "Supercharging", "Over-the-air Updates"],
                "available": True,
                "stock": 4,
                "mileage": 0,
                "condition": "New",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
        ]
        
        try:
            # Clear existing data
            self.cars_collection.delete_many({})
            
            # Insert sample data
            result = self.cars_collection.insert_many(sample_cars)
            logging.info(f"Inserted {len(result.inserted_ids)} sample cars")
            return True
        except Exception as e:
            logging.error(f"Error inserting sample data: {e}")
            return False
    
    def get_all_cars(self, available_only=True) -> List[Dict]:
        """Get all cars from database"""
        try:
            query = {"available": True} if available_only else {}
            cars = list(self.cars_collection.find(query))
            
            # Convert ObjectId to string for JSON serialization
            for car in cars:
                car['_id'] = str(car['_id'])
            
            return cars
        except Exception as e:
            logging.error(f"Error fetching cars: {e}")
            return []
    
    def search_cars(self, **filters) -> List[Dict]:
        """
        Search cars with various filters
        
        Args:
            brand: str - Car brand
            category: str - Car category (Sports, Luxury, Family, Electric)
            price_min: int - Minimum price
            price_max: int - Maximum price
            fuel_type: str - Fuel type
            condition: str - New/Used
            available: bool - Availability status
        """
        try:
            query = {}
            
            # Build query based on filters
            if 'brand' in filters:
                query['brand'] = {'$regex': filters['brand'], '$options': 'i'}
            
            if 'category' in filters:
                query['category'] = filters['category']
            
            if 'price_min' in filters or 'price_max' in filters:
                price_query = {}
                if 'price_min' in filters:
                    price_query['$gte'] = filters['price_min']
                if 'price_max' in filters:
                    price_query['$lte'] = filters['price_max']
                query['price'] = price_query
            
            if 'fuel_type' in filters:
                query['fuel_type'] = filters['fuel_type']
            
            if 'condition' in filters:
                query['condition'] = filters['condition']
            
            if 'available' in filters:
                query['available'] = filters['available']
            else:
                query['available'] = True  # Default to available cars
            
            cars = list(self.cars_collection.find(query))
            
            # Convert ObjectId to string
            for car in cars:
                car['_id'] = str(car['_id'])
            
            return cars
            
        except Exception as e:
            logging.error(f"Error searching cars: {e}")
            return []
    
    def get_car_by_id(self, car_id: str) -> Optional[Dict]:
        """Get specific car by ID"""
        try:
            from bson import ObjectId
            car = self.cars_collection.find_one({"_id": ObjectId(car_id)})
            if car:
                car['_id'] = str(car['_id'])
            return car
        except Exception as e:
            logging.error(f"Error fetching car by ID: {e}")
            return None
    
    def get_car_by_brand_model(self, brand: str, model: str) -> List[Dict]:
        """Get cars by brand and model"""
        try:
            query = {
                "brand": {"$regex": brand, "$options": "i"},
                "model": {"$regex": model, "$options": "i"},
                "available": True
            }
            cars = list(self.cars_collection.find(query))
            
            for car in cars:
                car['_id'] = str(car['_id'])
            
            return cars
        except Exception as e:
            logging.error(f"Error fetching car by brand/model: {e}")
            return []
    
    def get_brands(self) -> List[str]:
        """Get all unique car brands"""
        try:
            brands = self.cars_collection.distinct("brand", {"available": True})
            return sorted(brands)
        except Exception as e:
            logging.error(f"Error fetching brands: {e}")
            return []
    
    def get_categories(self) -> List[str]:
        """Get all unique car categories"""
        try:
            categories = self.cars_collection.distinct("category", {"available": True})
            return sorted(categories)
        except Exception as e:
            logging.error(f"Error fetching categories: {e}")
            return []
    
    def update_car_stock(self, car_id: str, new_stock: int) -> bool:
        """Update car stock quantity"""
        try:
            from bson import ObjectId
            result = self.cars_collection.update_one(
                {"_id": ObjectId(car_id)},
                {
                    "$set": {
                        "stock": new_stock,
                        "available": new_stock > 0,
                        "updated_at": datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logging.error(f"Error updating car stock: {e}")
            return False
    
    def add_car(self, car_data: Dict) -> Optional[str]:
        """Add new car to database"""
        try:
            car_data['created_at'] = datetime.now()
            car_data['updated_at'] = datetime.now()
            
            result = self.cars_collection.insert_one(car_data)
            return str(result.inserted_id)
        except Exception as e:
            logging.error(f"Error adding car: {e}")
            return None
    
    def close_connection(self):
        """Close database connection"""
        try:
            self.client.close()
            logging.info("MongoDB connection closed")
        except Exception as e:
            logging.error(f"Error closing connection: {e}")

# Usage example
if __name__ == "__main__":
    # Initialize database
    db = CarDatabase()
    
    # Insert sample data
    db.insert_sample_data()
    
    # Test queries
    print("All cars:", len(db.get_all_cars()))
    print("Sports cars:", len(db.search_cars(category="Sports")))
    print("BMW cars:", len(db.search_cars(brand="BMW")))
    print("Cars under $100k:", len(db.search_cars(price_max=100000)))
    
    # Close connection
    db.close_connection() 