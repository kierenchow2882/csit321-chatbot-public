#!/bin/bash
# Automotive Chatbot Platform - Unix/Linux Setup Script
# Run this in VSCode terminal or any Unix terminal

echo "🚀 Setting up Automotive Chatbot Platform on Unix/Linux..."
echo "=========================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found! Please install Python 3.8+ first"
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm not found! Please install Node.js first"
    exit 1
fi

# Make setup script executable
chmod +x setup.py

# Run the Python setup script
echo "📦 Running unified setup script..."
python3 setup.py

echo ""
echo "🎉 Setup completed!"
echo "📝 For VSCode:"
echo "   - Ctrl+Shift+P > Python: Select Interpreter"
echo "   - Select: $(pwd)/.venv/bin/python"
echo ""
echo "🚀 To start development:"
echo "   npm run dev:all" 