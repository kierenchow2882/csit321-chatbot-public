#!/usr/bin/env python3
"""
MongoDB Setup Script for Automotive Chatbot
This script sets up MongoDB connection and creates initial collections and data.
"""

import os
import sys
import json
import subprocess
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

class MongoDBSetup:
    def __init__(self):
        self.connection_string = None
        self.client = None
        self.db = None
        self.db_name = "automotive_chatbot"
        
    def get_connection_string(self):
        """Get MongoDB connection string from user input or environment."""
        # Try environment variable first
        env_connection = os.getenv('MONGODB_CONNECTION_STRING')
        if env_connection:
            print(f"Found MongoDB connection string in environment variable.")
            return env_connection
            
        print("\nMongoDB Connection Setup")
        print("=" * 40)
        print("Choose your MongoDB setup:")
        print("1. Local MongoDB (localhost:27017)")
        print("2. MongoDB Atlas (cloud)")
        print("3. Custom connection string")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            return "mongodb://localhost:27017/"
        elif choice == "2":
            print("\nMongoDB Atlas Setup:")
            username = input("Enter username: ").strip()
            password = input("Enter password: ").strip()
            cluster = input("Enter cluster URL (e.g., cluster0.xxxxx.mongodb.net): ").strip()
            return f"mongodb+srv://{username}:{password}@{cluster}/"
        elif choice == "3":
            return input("Enter custom connection string: ").strip()
        else:
            print("Invalid choice. Using local MongoDB.")
            return "mongodb://localhost:27017/"
    
    def test_connection(self, connection_string):
        """Test MongoDB connection."""
        try:
            client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
            # Force connection
            client.admin.command('ping')
            print("+ MongoDB connection successful!")
            return client
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"[ERROR] MongoDB connection failed: {e}")
            return None
    
    def setup_database(self):
        """Set up the database and collections."""
        try:
            self.db = self.client[self.db_name]
            
            # Create collections
            collections_to_create = [
                'conversations',
                'users', 
                'chatbot_configs',
                'analytics',
                'stories',
                'nlu_data',
                'rules'
            ]
            
            existing_collections = self.db.list_collection_names()
            
            for collection_name in collections_to_create:
                if collection_name not in existing_collections:
                    self.db.create_collection(collection_name)
                    print(f"[SUCCESS] Created collection: {collection_name}")
                else:
                    print(f"- Collection already exists: {collection_name}")
            
            return True
            
        except Exception as e:
            print(f"[ERROR] Error setting up database: {e}")
            return False
    
    def insert_sample_data(self):
        """Insert sample data for testing."""
        try:
            # Sample chatbot configuration
            sample_config = {
                "name": "Automotive Assistant",
                "description": "AI assistant for automotive queries",
                "settings": {
                    "theme": "light",
                    "welcome_message": "Hello! I'm your automotive assistant. How can I help you today?",
                    "fallback_message": "I'm sorry, I didn't understand that. Could you please rephrase?",
                    "language": "en"
                },
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
            
            # Check if config already exists
            if self.db.chatbot_configs.count_documents({}) == 0:
                self.db.chatbot_configs.insert_one(sample_config)
                print("[SUCCESS] Inserted sample chatbot configuration")
            else:
                print("- Chatbot configuration already exists")
            
            # Sample NLU data
            sample_nlu = [
                {
                    "intent": "greet",
                    "examples": [
                        "hello", "hi", "hey", "good morning", "good afternoon"
                    ]
                },
                {
                    "intent": "goodbye", 
                    "examples": [
                        "bye", "goodbye", "see you later", "farewell"
                    ]
                },
                {
                    "intent": "ask_car_price",
                    "examples": [
                        "What's the price of [Toyota Camry](car_model)?",
                        "How much does a [Honda Civic](car_model) cost?",
                        "Price of [BMW X5](car_model)"
                    ]
                },
                {
                    "intent": "ask_car_features",
                    "examples": [
                        "What features does [Toyota Prius](car_model) have?",
                        "Tell me about [Mercedes C-Class](car_model) features",
                        "Features of [Audi A4](car_model)"
                    ]
                }
            ]
            
            if self.db.nlu_data.count_documents({}) == 0:
                self.db.nlu_data.insert_many(sample_nlu)
                print("[SUCCESS] Inserted sample NLU data")
            else:
                print("- NLU data already exists")
            
            # Sample stories
            sample_stories = [
                {
                    "story_name": "greet_and_ask_price",
                    "steps": [
                        {"intent": "greet"},
                        {"action": "utter_greet"},
                        {"intent": "ask_car_price"},
                        {"action": "action_get_car_price"}
                    ]
                },
                {
                    "story_name": "ask_features",
                    "steps": [
                        {"intent": "ask_car_features"},
                        {"action": "action_get_car_features"}
                    ]
                }
            ]
            
            if self.db.stories.count_documents({}) == 0:
                self.db.stories.insert_many(sample_stories)
                print("[SUCCESS] Inserted sample stories")
            else:
                print("- Stories already exist")
                
            return True
            
        except Exception as e:
            print(f"[ERROR] Error inserting sample data: {e}")
            return False
    
    def create_indexes(self):
        """Create database indexes for better performance."""
        try:
            # Create indexes
            self.db.conversations.create_index("user_id")
            self.db.conversations.create_index("timestamp")
            self.db.users.create_index("email", unique=True)
            self.db.analytics.create_index("timestamp")
            
            print("[SUCCESS] Created database indexes")
            return True
            
        except Exception as e:
            print(f"[ERROR] Error creating indexes: {e}")
            return False
    
    def save_connection_to_env(self):
        """Save connection string to .env file."""
        try:
            env_file = os.path.join(os.path.dirname(__file__), 'backend', '.env')
            
            # Read existing .env or create new
            env_content = ""
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    env_content = f.read()
            
            # Update or add MongoDB connection
            lines = env_content.split('\n')
            updated = False
            
            for i, line in enumerate(lines):
                if line.startswith('MONGODB_CONNECTION_STRING='):
                    lines[i] = f'MONGODB_CONNECTION_STRING={self.connection_string}'
                    updated = True
                    break
            
            if not updated:
                lines.append(f'MONGODB_CONNECTION_STRING={self.connection_string}')
            
            # Write back to file
            with open(env_file, 'w') as f:
                f.write('\n'.join(lines))
            
            print(f"[SUCCESS] Saved connection string to {env_file}")
            return True
            
        except Exception as e:
            print(f"[ERROR] Error saving to .env file: {e}")
            return False
    
    def run_setup(self):
        """Run the complete setup process."""
        print("Automotive Chatbot - MongoDB Setup")
        print("=" * 50)
        
        # Get connection string
        self.connection_string = self.get_connection_string()
        
        # Test connection
        print("\nTesting MongoDB connection...")
        self.client = self.test_connection(self.connection_string)
        
        if not self.client:
            print("\nSetup failed due to connection issues.")
            print("Please check your MongoDB installation and connection details.")
            return False
        
        # Setup database
        print(f"\nSetting up database: {self.db_name}")
        if not self.setup_database():
            return False
        
        # Insert sample data
        print("\nInserting sample data...")
        if not self.insert_sample_data():
            return False
        
        # Create indexes
        print("\nCreating database indexes...")
        if not self.create_indexes():
            return False
        
        # Save to .env
        print("\nSaving configuration...")
        if not self.save_connection_to_env():
            return False
        
        print("\n" + "=" * 50)
        print("[SUCCESS] MongoDB setup completed successfully!")
        print(f"[SUCCESS] Database: {self.db_name}")
        print(f"[SUCCESS] Connection: {self.connection_string}")
        print("\nYou can now start the application with:")
        print("  npm run dev:all")
        
        return True

def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        import pymongo
        print("+ PyMongo is installed")
        return True
    except ImportError:
        print("- PyMongo not found. Installing...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo"])
            print("+ PyMongo installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("- Failed to install PyMongo")
            return False

def main():
    """Main function."""
    print("Starting MongoDB setup...")
    
    # Check dependencies
    if not check_dependencies():
        print("Please install PyMongo manually: pip install pymongo")
        sys.exit(1)
    
    # Run setup
    setup = MongoDBSetup()
    success = setup.run_setup()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main() 