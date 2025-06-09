import os
from pymongo import MongoClient, ASCENDING, DESCENDING
from bson import ObjectId
from datetime import datetime
import certifi

# Connect to MongoDB
try:
    client = MongoClient(
        os.getenv('MONGODB_URI'),
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000
    )
    
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    
    # Initialize database
    db = client[os.getenv('MONGODB_NAME')]
    
    # Collections
    vehicles_collection = db.vehicles
    test_drives_collection = db.test_drives
    chat_history_collection = db.chat_history
    feedback_collection = db.feedback

    # Create indexes in the background
    def ensure_indexes():
        try:
            # Vehicle indexes
            vehicles_collection.create_index([("make", ASCENDING)], background=True)
            vehicles_collection.create_index([("model", ASCENDING)], background=True)
            vehicles_collection.create_index([("year", DESCENDING)], background=True)
            vehicles_collection.create_index([("price", ASCENDING)], background=True)

            # Test drive indexes
            test_drives_collection.create_index([("user_id", ASCENDING)], background=True)
            test_drives_collection.create_index([("booking_date", ASCENDING)], background=True)
            test_drives_collection.create_index([("status", ASCENDING)], background=True)

            # Chat history indexes
            chat_history_collection.create_index([("user_id", ASCENDING)], background=True)
            chat_history_collection.create_index([("session_id", ASCENDING)], background=True)
            chat_history_collection.create_index([("created_at", DESCENDING)], background=True)

            # Feedback indexes
            feedback_collection.create_index([("user_id", ASCENDING)], background=True)
            feedback_collection.create_index([("created_at", DESCENDING)], background=True)

            print("Successfully created/verified all indexes")
        except Exception as e:
            print(f"Warning: Error managing indexes: {str(e)}")

    ensure_indexes()

except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")
    # Set collections to None if connection fails
    vehicles_collection = None
    test_drives_collection = None
    chat_history_collection = None
    feedback_collection = None

def create_vehicle(vehicle_data):
    if not vehicles_collection:
        raise Exception("MongoDB connection not available")
    try:
        vehicle_data['created_at'] = datetime.utcnow()
        return vehicles_collection.insert_one(vehicle_data)
    except Exception as e:
        raise Exception(f"Error creating vehicle: {str(e)}")

def create_test_drive(test_drive_data):
    if not test_drives_collection:
        raise Exception("MongoDB connection not available")
    try:
        test_drive_data['created_at'] = datetime.utcnow()
        return test_drives_collection.insert_one(test_drive_data)
    except Exception as e:
        raise Exception(f"Error creating test drive: {str(e)}")

def save_chat_message(message_data):
    if not chat_history_collection:
        raise Exception("MongoDB connection not available")
    try:
        message_data['created_at'] = datetime.utcnow()
        return chat_history_collection.insert_one(message_data)
    except Exception as e:
        raise Exception(f"Error saving chat message: {str(e)}")

def save_feedback(feedback_data):
    if not feedback_collection:
        raise Exception("MongoDB connection not available")
    try:
        feedback_data['created_at'] = datetime.utcnow()
        return feedback_collection.insert_one(feedback_data)
    except Exception as e:
        raise Exception(f"Error saving feedback: {str(e)}")