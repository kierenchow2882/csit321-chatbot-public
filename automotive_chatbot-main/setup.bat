@echo off
REM Automotive Chatbot Platform - Windows Setup Script
REM Run this in PyCharm terminal or Command Prompt

echo 🚀 Setting up Automotive Chatbot Platform on Windows...
echo ====================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.8+ first
    pause
    exit /b 1
)

REM Check if Node.js is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js/npm not found! Please install Node.js first
    pause
    exit /b 1
)

REM Run the Python setup script
echo 📦 Running unified setup script...
python setup.py

echo.
echo 🎉 Setup completed! 
echo 📝 For PyCharm:
echo    - File ^> Settings ^> Project ^> Python Interpreter
echo    - Add Interpreter ^> Existing Environment
echo    - Select: %CD%\.venv\Scripts\python.exe
echo.
echo 🚀 To start development:
echo    npm run dev:all
echo.
pause 