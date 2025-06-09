@echo off
REM EZ Autos Setup Script for Windows
REM This script sets up the development environment for new developers

echo 🚗 Welcome to EZ Autos Setup!
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Backend Setup
echo.
echo 🔧 Setting up Backend (Django)...
echo ================================

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Run migrations
echo 🗄️ Setting up database...
python manage.py migrate

REM Create admin user
echo 👤 Creating admin user...
python manage.py ensure_admin

echo ✅ Backend setup complete!

REM Frontend Setup
echo.
echo 🎨 Setting up Frontend (React)...
echo ================================

REM Install Node.js dependencies
echo 📥 Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!

REM Final instructions
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the development servers:
echo.
echo 1. Backend (Django):
echo    venv\Scripts\activate.bat
echo    python manage.py runserver
echo.
echo 2. Frontend (React) - in a new terminal:
echo    npm run dev
echo.
echo 3. Open your browser and go to:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo.
echo 4. Admin credentials:
echo    Email: admin@example.com
echo    Password: admin
echo.
echo Happy coding! 🚗💨
pause