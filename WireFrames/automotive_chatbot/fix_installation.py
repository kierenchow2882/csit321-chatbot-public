#!/usr/bin/env python3
"""
Fix Installation Script for Automotive Chatbot Platform
Resolves dependency conflicts and ensures proper installation
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return success status"""
    try:
        print(f"🔧 Running: {command}")
        result = subprocess.run(command, shell=shell, cwd=cwd, 
                              capture_output=True, text=True, check=True)
        print(f"✅ Success: {command}")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed: {command}")
        print(f"Error: {e.stderr}")
        return False, e.stderr

def fix_dependencies():
    """Fix dependency conflicts by installing packages in correct order"""
    print("🔧 Fixing Python dependencies...")
    
    # Get the backend directory
    backend_dir = Path(__file__).parent / "backend"
    
    # First, upgrade pip
    success, _ = run_command("pip install --upgrade pip")
    if not success:
        return False
    
    # Uninstall conflicting packages first
    conflicting_packages = [
        "uvicorn", "cryptography", "jax", "jaxlib", 
        "pydantic", "sqlalchemy", "rasa", "rasa-sdk"
    ]
    
    for package in conflicting_packages:
        print(f"🗑️ Uninstalling {package}...")
        run_command(f"pip uninstall -y {package}")
    
    # Install packages in specific order to avoid conflicts
    installation_order = [
        # Core dependencies first
        "cryptography==41.0.7",
        "cffi==1.16.0", 
        "pycparser==2.21",
        "sqlalchemy>=1.4.0,<2.0.0",
        "pydantic>=1.10.0,<2.0.0",
        
        # Math libraries
        "jax==0.4.30",
        "jaxlib==0.4.30",
        
        # Web framework
        "fastapi==0.104.1",
        "python-multipart==0.0.6",
        
        # Install uvicorn without standard extras first, then with
        "uvicorn==0.24.0",
        
        # Database
        "pymongo>=3.8.0,<4.4.0",
        "motor>=2.5.0,<3.0.0",
        
        # Other dependencies
        "python-dotenv>=1.0.0,<2.0.0",
        "requests>=2.28.0,<3.0.0",
        "aiohttp>=3.8.0,<4.0.0",
        "websockets>=10.0,<12.0",
        "rich>=13.0.0,<14.0.0",
        "packaging>=20.0,<24.0",
        "pytest>=7.0.0,<8.0.0",
        "httpx>=0.24.0,<0.26.0",
        "numpy>=1.21.0,<1.25.0",
        "pandas>=1.5.0,<2.2.0",
        "beautifulsoup4==4.12.3",
        "lxml>=4.9.0,<5.0.0",
        "holidays>=0.30,<1.0",
        
        # Authentication
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "bcrypt>=4.0.0,<5.0.0",
    ]
    
    # Install each package individually
    for package in installation_order:
        success, _ = run_command(f"pip install {package}")
        if not success:
            print(f"⚠️ Warning: Failed to install {package}, continuing...")
    
    # Now install uvicorn with standard extras separately
    print("🔧 Installing uvicorn with standard extras...")
    success, _ = run_command("pip install 'uvicorn[standard]==0.24.0' --force-reinstall")
    
    # Finally install Rasa
    print("🔧 Installing Rasa...")
    success, _ = run_command("pip install 'rasa>=3.6.0,<4.0.0'")
    success, _ = run_command("pip install 'rasa-sdk>=3.6.0,<4.0.0'")
    
    return True

def main():
    """Main installation fix function"""
    print("🚀 Automotive Chatbot Platform - Installation Fixer")
    print("=" * 60)
    
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️ Warning: Not in a virtual environment!")
        print("It's recommended to run this in a virtual environment.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            return
    
    # Fix dependencies
    if fix_dependencies():
        print("\n✅ Installation fix completed!")
        print("\n📝 Next steps:")
        print("1. Try running 'python setup.py' again")
        print("2. Start the action server: npm run rasa:actions")
        print("3. Train Rasa: npm run rasa:train")
        print("4. Start all services: npm run dev:all")
    else:
        print("\n❌ Installation fix failed!")
        print("Please check the error messages above.")

if __name__ == "__main__":
    main() 