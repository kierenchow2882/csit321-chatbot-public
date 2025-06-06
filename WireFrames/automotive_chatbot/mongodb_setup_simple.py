#!/usr/bin/env python3
"""
Simple MongoDB Setup Script for Automotive Chatbot
"""

import os
import sys

def create_env_file():
    """Create a basic .env file for the backend and root."""
    try:
        # Create backend .env file
        backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
        backend_env_file = os.path.join(backend_dir, '.env')
        
        # Create root .env file
        root_env_file = os.path.join(os.path.dirname(__file__), '.env')
        
        env_content = """# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/automotive_chatbot

# FastAPI Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Rasa Configuration
RASA_URL=http://localhost:5005

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Optional: Authentication settings
AUTH_ENABLED=false

# Optional: Logging level
LOG_LEVEL=INFO
"""
        
        # Create backend directory if it doesn't exist
        os.makedirs(backend_dir, exist_ok=True)
        
        # Write backend .env file
        with open(backend_env_file, 'w') as f:
            f.write(env_content)
        print(f"+ Created backend environment file: {backend_env_file}")
        
        # Write root .env file
        with open(root_env_file, 'w') as f:
            f.write(env_content)
        print(f"+ Created root environment file: {root_env_file}")
        
        return True
        
    except Exception as e:
        print(f"- Error creating environment file: {e}")
        return False

def install_pymongo():
    """Install PyMongo if not already installed."""
    try:
        import pymongo
        print("+ PyMongo is already installed")
        return True
    except ImportError:
        print("- Installing PyMongo...")
        try:
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo"])
            print("+ PyMongo installed successfully")
            return True
        except Exception as e:
            print(f"- Failed to install PyMongo: {e}")
            return False

def main():
    """Main setup function."""
    print("Simple MongoDB Setup for Automotive Chatbot")
    print("=" * 50)
    
    # Create environment file
    print("Creating environment file...")
    create_env_file()
    
    # Install PyMongo
    print("Setting up PyMongo...")
    install_pymongo()
    
    print("\nSetup completed!")
    print("Note: This is a basic setup. You may need to:")
    print("1. Install and start MongoDB locally")
    print("2. Or configure MongoDB Atlas connection in backend/.env")
    print("3. Run 'npm run dev:all' to start the application")

if __name__ == "__main__":
    main() 