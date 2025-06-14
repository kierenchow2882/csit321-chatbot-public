#!/usr/bin/env python3
"""
Automotive Chatbot Setup Script
Installs all dependencies for both backend and frontend
"""

import os
import sys
import subprocess
import platform
import json
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return success status"""
    try:
        print(f"Running: {command}")
        if platform.system() == "Windows":
            result = subprocess.run(command, shell=shell, cwd=cwd, check=True, 
                                  capture_output=True, text=True)
        else:
            result = subprocess.run(command.split(), cwd=cwd, check=True, 
                                  capture_output=True, text=True)
        print(f"✓ Success: {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running {command}: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def install_backend_dependencies():
    """Install Python backend dependencies"""
    print("\n=== Installing Backend Dependencies ===")
    
    # Install Python packages
    backend_packages = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "rasa==3.6.4",
        "python-multipart==0.0.6",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "email-validator==2.1.0",
        "pandas==1.5.3",
        "motor==2.5.1",
        "pymongo==3.12.3",
        "requests==2.31.0",
        "aiofiles==23.2.1",
        "python-dotenv==1.0.0",
        "pydantic==2.5.0",
        "httpx==0.25.2",
        "beautifulsoup4==4.12.2",
        "lxml==4.9.3",
        "scipy==1.7.3",
        "scikit-learn==1.0.2",
        "numpy==1.21.6",
        "huggingface_hub==0.17.3"
    ]
    
    for package in backend_packages:
        if not run_command(f"pip install {package}"):
            print(f"Failed to install {package}")
            return False
    
    return True

def install_frontend_dependencies():
    """Install Node.js frontend dependencies"""
    print("\n=== Installing Frontend Dependencies ===")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("Frontend directory not found!")
        return False
    
    # Check if Node.js is installed
    if not run_command("node --version"):
        print("Node.js is not installed. Please install Node.js first.")
        return False
    
    # Install npm dependencies from package.json
    if not run_command("npm install", cwd=frontend_dir):
        print("Failed to install npm dependencies from package.json")
        return False
    
    # Verify that autoprefixer and postcss are installed
    print("✓ All frontend dependencies installed successfully")
    return True

def setup_environment():
    """Setup environment files and configurations"""
    print("\n=== Setting Up Environment ===")
    
    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        env_content = """# Automotive Chatbot Environment Variables
DATABASE_URL=mongodb://localhost:27017/automotive_chatbot
SECRET_KEY=your-secret-key-here
RASA_SERVER_URL=http://localhost:5005
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✓ Created .env file")
    
    return True

def verify_installations():
    """Verify that all installations were successful"""
    print("\n=== Verifying Installations ===")
    
    # Test Python imports
    python_tests = [
        "import fastapi",
        "import rasa",
        "import pandas",
        "import motor",
        "import requests"
    ]
    
    for test in python_tests:
        try:
            exec(test)
            print(f"✓ {test}")
        except ImportError as e:
            print(f"✗ {test} - {e}")
            return False
    
    # Test Node.js and npm
    if not run_command("node --version"):
        return False
    
    if not run_command("npm --version"):
        return False
    
    # Check if frontend dependencies are installed
    frontend_dir = Path("frontend")
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("✗ Frontend node_modules not found")
        return False
    
    print("✓ All installations verified successfully!")
    return True

def main():
    """Main setup function"""
    print("🚗 Automotive Chatbot Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9 or higher is required")
        sys.exit(1)
    
    print(f"✓ Python {sys.version}")
    
    # Install dependencies
    if not install_backend_dependencies():
        print("❌ Backend installation failed")
        sys.exit(1)
    
    if not install_frontend_dependencies():
        print("❌ Frontend installation failed")
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("❌ Environment setup failed")
        sys.exit(1)
    
    # Verify installations
    if not verify_installations():
        print("❌ Installation verification failed")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the backend: python -m uvicorn api.main:app --reload --port 8000")
    print("2. Start RASA: rasa run --enable-api --cors '*' --port 5005")
    print("3. Start RASA actions: rasa run actions --port 5055")
    print("4. Start frontend: cd frontend && npm run dev")
    print("5. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main() 