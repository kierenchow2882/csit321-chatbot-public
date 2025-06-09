#!/bin/bash

# EZ Autos Setup Script
# This script sets up the development environment for new developers

echo "🚗 Welcome to EZ Autos Setup!"
echo "================================"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Backend Setup
echo ""
echo "🔧 Setting up Backend (Django)..."
echo "================================"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️ Setting up database..."
python manage.py migrate

# Create admin user
echo "👤 Creating admin user..."
python manage.py ensure_admin

echo "✅ Backend setup complete!"

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend (React)..."
echo "================================"

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the development servers:"
echo ""
echo "1. Backend (Django):"
echo "   source venv/bin/activate  # (if not already activated)"
echo "   python manage.py runserver"
echo ""
echo "2. Frontend (React) - in a new terminal:"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo ""
echo "4. Admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin"
echo ""
echo "Happy coding! 🚗💨"