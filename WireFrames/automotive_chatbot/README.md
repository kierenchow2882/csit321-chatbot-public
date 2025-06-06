# 🚗 Automotive Chatbot Platform

**An intelligent conversational AI platform for automotive services in Singapore**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org)
[![Rasa](https://img.shields.io/badge/Rasa-3.6+-purple.svg)](https://rasa.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://mongodb.com)

## 🎯 Overview

This platform provides an intelligent chatbot for automotive queries in Singapore, featuring:

- **🤖 Conversational AI** powered by Rasa
- **🔍 Real-time data** integration (COE prices, car information)
- **📱 Modern web interface** built with Next.js
- **🔧 RESTful API** backend with FastAPI
- **💾 MongoDB database** for data persistence
- **🇸🇬 Singapore-focused** automotive expertise

## ⚡ Quick Start

### **Core Platform** (Simplified - No Complex Dependencies!)
```bash
git clone <repository-url>
cd WireFrames/automotive_chatbot
python setup.py
npm run dev:all              # Frontend + Backend (stable)
```

**🎉 Your platform will be ready at:**
- **Frontend**: http://localhost:3000 ✅
- **Backend API**: http://localhost:8000 ✅
- **API Docs**: http://localhost:8000/docs ✅

### **🎉 STABLE PLATFORM - Clean Architecture!**

**✅ Production-Ready**: Using proven dependency configuration from working projects!

**Current Platform Status**: ✅ **CORE FEATURES FULLY WORKING** - Stable FastAPI backend with modern stack!

**🔥 Two-Tier Architecture**: 
```bash
# Core Platform (Always Works)
python setup.py
npm run dev:all              # Frontend + Backend (stable)

# Advanced AI Features (Optional)
pip install rasa>=3.6.0,<4.0.0
pip install rasa-sdk>=3.6.0,<4.0.0
npm run dev:all-with-rasa    # Includes Rasa (requires manual setup)
```

**✅ Perfect for Development**: Clean separation of stable core platform from advanced AI features!

## 🔧 Troubleshooting

### Common Issues and Fixes

**Problem 1: Core Platform Issues**
```bash
# Using stable, tested dependency versions
pip install -r backend/requirements.txt
# FastAPI 0.104.1 + Pydantic 2.x + Modern stack (proven working configuration)
```

**Problem 2: Database Connection**
- MongoDB: pymongo 4.6.x + motor 3.3.x (stable modern versions)
- Check MongoDB is running: `mongosh` or `mongo`

**Problem 3: Authentication Setup**
- Using python-jose[cryptography] 3.3.0 for stable JWT handling
- Includes bcrypt for password hashing

**Problem 4: Advanced AI Features (Rasa)**
```bash
# Install separately for AI features
pip install rasa>=3.6.0,<4.0.0
pip install rasa-sdk>=3.6.0,<4.0.0

# Note: May require additional cryptography setup on Windows
# See: https://cryptography.io/en/latest/installation/#windows
```

**Problem 5: spaCy Installation (for AI features)**
```bash
# Download spaCy model for NLP
python -m spacy download en_core_web_sm
```

## 📋 Prerequisites

- **Python 3.9+** installed
- **Node.js 18+** and npm installed
- **MongoDB** running locally (or MongoDB Atlas)
- **Git** for version control

## 🏗️ Architecture

```
automotive_chatbot/
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python backend
│   ├── api/          # API routes and endpoints
│   ├── data/         # Rasa training data
│   └── requirements.txt # Single dependency file
├── docs/             # Documentation
├── setup.py          # One-command setup script
└── package.json      # npm scripts and dependencies
```

## 🚀 Features

### For End Users
- **Natural Language Queries**: Ask about cars in plain English
- **Real-time COE Data**: Current Certificate of Entitlement prices
- **Car Information**: Specifications, pricing, comparisons
- **Loan Calculations**: Financing options and bank information
- **Singapore-specific**: Local automotive market expertise

### For Developers
- **RESTful API**: Well-documented endpoints
- **WebSocket Support**: Real-time chat capabilities  
- **Database Integration**: MongoDB for data persistence
- **AI Training Data**: Customizable Rasa conversation flows
- **Modern Stack**: FastAPI + Next.js + MongoDB + Rasa

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [**Quick Start**](docs/QUICK_START.md) | Get up and running in minutes |
| [**Usage Guide**](docs/USAGE.md) | Comprehensive platform usage |
| [**Rasa Setup**](docs/RASA_SETUP.md) | AI training and configuration |
| [**Integration Guide**](docs/INTEGRATION_GUIDE.md) | API integration examples |
| [**User Manual**](docs/USER_MANUAL.md) | End-user guide |
| [**MongoDB Setup**](docs/MONGODB_SETUP.md) | Database configuration |

## 🛠️ Development

### Available Scripts
```bash
# Development  
npm run dev:all              # Start all services (Frontend + Backend + Rasa)
npm run dev:frontend         # Frontend only
npm run dev:backend          # Backend only
npm run dev:rasa             # Rasa only

# Installation
npm run install:all          # Install all dependencies
npm run install:frontend     # Install frontend deps
npm run install:backend      # Install backend deps

# AI & Training
npm run rasa:train           # Train Rasa model
npm run spacy:download       # Download language model

# Database
npm run db:setup             # Setup MongoDB
npm run db:check             # Check connection

# Testing
npm run status               # Check all services
```

### Tech Stack
- **Backend**: FastAPI, Python 3.9+, Rasa 3.6+
- **Frontend**: Next.js 15+, React 19+, TypeScript
- **Database**: MongoDB 7.0+
- **AI/ML**: Rasa, spaCy, Transformers
- **Deployment**: Uvicorn, Gunicorn

## 🔧 Configuration

### Environment Variables
Create `.env` in project root:
```env
# API Keys
OPENAI_API_KEY=your_openai_key_here
LTA_API_KEY=your_singapore_lta_key

# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=automotive_chatbot

# Services
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
RASA_URL=http://localhost:5005
```

### Single Requirements File
All Python dependencies are in `backend/requirements.txt` - no multiple requirement files needed.

## 📱 API Endpoints

### Chat API
```bash
POST /api/chat
{
  "message": "What's the price of Toyota Camry?",
  "user_id": "user123",
  "session_id": "session456"
}
```

### Car Information
```bash
GET /api/cars                    # List all cars
GET /api/cars/toyota             # Toyota models
GET /api/cars?model=camry        # Specific model
```

### COE Data
```bash
GET /api/coe/current             # Current COE prices
GET /api/coe/history             # Historical data
```

### Service Health
```bash
GET /health                      # Backend health
GET /status                      # System status
```

## 🤖 AI Training

The platform uses Rasa for conversational AI:

```bash
# Train the model
npm run rasa:train

# Validate training data
cd backend && rasa data validate

# Test in interactive mode
cd backend && rasa shell
```

Training data is in `backend/data/`:
- `nlu.yml` - User intents and examples
- `stories.yml` - Conversation flows
- `domain.yml` - Bot responses and actions

## 🚀 Deployment

### Local Development
```bash
python setup.py
npm run dev:all
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start production backend
cd backend && uvicorn api.main:app --host 0.0.0.0 --port 8000

# Start Rasa server
cd backend && rasa run --enable-api --cors "*" --port 5005
```

## 🧪 Testing

### Quick Health Check
```bash
npm run status
```

### Individual Service Tests
```bash
# Backend API
curl http://localhost:8000/health

# Rasa API  
curl http://localhost:5005/status

# Frontend
curl http://localhost:3000
```

### Chat API Test
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "user_id": "test"}'
```

## 🚨 Troubleshooting

### Common Issues

#### "rasa: command not found"
```bash
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

#### MongoDB connection error
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Check connection
python -c "import pymongo; pymongo.MongoClient().server_info()"
```

#### Port conflicts
```bash
# Check what's using the ports
netstat -an | findstr :3000
netstat -an | findstr :8000
netstat -an | findstr :5005

# Kill processes if needed
taskkill /PID <process_id> /F
```

## 📊 Project Status

- ✅ **Core Platform**: Stable and functional
- ✅ **Single Requirements File**: Streamlined dependencies
- ✅ **Comprehensive setup.py**: One-command installation
- ✅ **API Endpoints**: Complete and documented
- ✅ **AI Training**: Automotive-focused model
- ✅ **Frontend Interface**: Responsive web app
- ✅ **Database Integration**: MongoDB setup
- ✅ **Documentation**: Comprehensive guides in docs/ folder
- ✅ **npm Scripts**: All development commands working
- 🔄 **Continuous Improvement**: Active development

## 🎯 IDE Support

The platform works seamlessly with popular IDEs:

### Visual Studio Code
- Open project folder
- Python extension will auto-detect `.venv`
- Use integrated terminal for npm commands

### JetBrains IDEs (PyCharm, WebStorm)
- Open project folder
- Configure Python interpreter: `.venv/Scripts/python.exe`
- Use built-in terminal for development

### Other IDEs
- Any IDE with Python and Node.js support
- Configure virtual environment path
- Use terminal for npm scripts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check [docs/](docs/) folder
- **Issues**: Create GitHub issues for bugs
- **Questions**: Use discussions for general questions

## 🎉 Acknowledgments

- **Rasa**: Conversational AI framework
- **FastAPI**: Modern Python web framework
- **Next.js**: React-based frontend framework
- **MongoDB**: Database solution
- **Singapore LTA**: Data source for automotive information

---

**🚗 Ready to build the future of automotive customer service in Singapore!**

## 🔄 Recent Updates

### v2.1.0 - Streamlined Setup
- ✅ **Single requirements.txt**: No more multiple requirement files
- ✅ **Comprehensive setup.py**: One-command installation
- ✅ **Updated documentation**: All guides moved to docs/ folder
- ✅ **Improved npm scripts**: Better Windows PowerShell support
- ✅ **Access points display**: Shows all URLs after startup
- ✅ **Enhanced error handling**: Better troubleshooting guides

### What's Working
- ✅ **setup.py**: Complete environment setup
- ✅ **npm run dev:all**: Starts all services
- ✅ **npm run rasa:train**: AI model training
- ✅ **npm run status**: Service health checks
- ✅ **Documentation**: Comprehensive guides
- ✅ **Requirements**: Single dependency file

### Next Steps for Users
1. Run `python setup.py` for initial setup
2. Edit `.env` file with your API keys
3. Start development with `npm run dev:all`
4. Train AI model with `npm run rasa:train`
5. Check documentation in `docs/` folder