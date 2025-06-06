@echo off
echo 🚀 Starting Automotive Chatbot Development Environment
echo ======================================================

echo 🔧 Activating virtual environment...
call .venv\Scripts\activate.bat

echo 📦 Installing/updating dependencies...
pip install uvicorn fastapi python-multipart motor pymongo python-dotenv

echo 🗄️ Setting up environment...
if not exist .env (
    copy env_template.txt .env
    echo ✅ Created .env file
)

if not exist backend\.env (
    copy env_template.txt backend\.env
    echo ✅ Created backend .env file
)

echo 🌐 Starting development servers...
echo.
echo ⏳ Please wait while services start up...
echo.

start "Backend API" cmd /k "cd /d %~dp0backend && python -m uvicorn api.main:app --reload --host localhost --port 8000"
timeout /t 3

start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3

echo.
echo 🎉 Development environment is starting!
echo ======================================================
echo.
echo 🌐 Access Points:
echo   📱 Frontend:        http://localhost:3000
echo   🔧 Backend API:     http://localhost:8000
echo   📚 API Docs:        http://localhost:8000/docs
echo   ❤️  Health Check:   http://localhost:8000/health
echo.
echo 💡 Tips:
echo   - Wait 10-15 seconds for all services to fully start
echo   - Check the opened terminal windows for any errors
echo   - Press Ctrl+C in any terminal to stop that service
echo.
echo 📝 To install Rasa (optional):
echo   pip install rasa
echo   cd backend && rasa train
echo.
pause 