import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URI'))
db = client[os.getenv('MONGODB_NAME')]

# Vehicle Collection Schema
vehicles_collection = db.vehicles
vehicles_collection.create_index([("make", 1)])
vehicles_collection.create_index([("model", 1)])
vehicles_collection.create_index([("year", -1)])
vehicles_collection.create_index([("price", 1)])

# Test Drive Collection Schema
test_drives_collection = db.test_drives
test_drives_collection.create_index([("user_id", 1)])
test_drives_collection.create_index([("booking_date", 1)])
test_drives_collection.create_index([("status", 1)])

# Chat History Collection Schema
chat_history_collection = db.chat_history
chat_history_collection.create_index([("user_id", 1)])
chat_history_collection.create_index([("session_id", 1)])
chat_history_collection.create_index([("created_at", -1)])

# Feedback Collection Schema
feedback_collection = db.feedback
feedback_collection.create_index([("user_id", 1)])
feedback_collection.create_index([("created_at", -1)])

def create_vehicle(vehicle_data):
    vehicle_data['created_at'] = datetime.utcnow()
    return vehicles_collection.insert_one(vehicle_data)

def create_test_drive(test_drive_data):
    test_drive_data['created_at'] = datetime.utcnow()
    return test_drives_collection.insert_one(test_drive_data)

def save_chat_message(message_data):
    message_data['created_at'] = datetime.utcnow()
    return chat_history_collection.insert_one(message_data)

def save_feedback(feedback_data):
    feedback_data['created_at'] = datetime.utcnow()
    return feedback_collection.insert_one(feedback_data)