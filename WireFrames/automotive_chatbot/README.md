# 🚗 Automotive Chatbot Platform

**An intelligent conversational AI platform for automotive services in Singapore**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org)
[![Rasa](https://img.shields.io/badge/Rasa-3.6+-purple.svg)](https://rasa.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://mongodb.com)

## 🎯 Overview

This platform provides an intelligent chatbot for automotive queries in Singapore, featuring:

- **🤖 Conversational AI** powered by Rasa with comprehensive training data
- **🔍 Real-time COE data** from LTA official sources with price trends
- **📱 Modern web interface** built with Next.js
- **🔧 RESTful API** backend with FastAPI
- **💾 MongoDB database** for data persistence
- **🇸🇬 Singapore-focused** automotive expertise with maintenance tips

## ⚡ Quick Start

### **One-Click Installation** (Fixed All Issues!)
```bash
git clone <repository-url>
cd WireFrames/automotive_chatbot

# Setup everything (automatically installs all dependencies):
python setup.py

# Install frontend dependencies:
npm install
cd frontend && npm install && cd ..

# Start all services:
npm run dev:all              # Frontend + Backend + Rasa + Actions
```

### **Alternative Rasa Commands** (If rasa command not recognized)
```bash
# Training:
python -m rasa train                    # Direct method
.\rasa-commands.ps1 train              # PowerShell helper
cd backend && .\rasa.bat train         # Batch file

# Running Rasa:
.\rasa-commands.ps1 run                # PowerShell helper
python -m rasa run --enable-api --cors "*" --port 5005

# Interactive shell:
.\rasa-commands.ps1 shell              # PowerShell helper
python -m rasa shell
```

**🎉 Your platform will be ready at:**
- **Frontend**: http://localhost:3000 ✅
- **Backend API**: http://localhost:8000 ✅
- **API Docs**: http://localhost:8000/docs ✅
- **Rasa API**: http://localhost:5005 ✅
- **Rasa Actions**: http://localhost:5055 ✅

## 🔧 Recent Fixes & Improvements

### ✅ Fixed Issues (v2.3 - Latest)

**Problem 1: Frontend Dependencies Missing After .venv Recreation**
- **Issue**: Tailwind, React, and other frontend packages not installed after recreating virtual environment
- **Fix**: Separated frontend and backend dependency installation
- **Solution**: Run `npm install` in both root and frontend directories

**Problem 2: Chat API 404 Errors**
- **Issue**: Frontend calling `/api/chatbots/chat` endpoint that doesn't exist
- **Fix**: Updated frontend to directly use Rasa webhook endpoint
- **Solution**: Modified `frontend/src/app/api/chat/route.ts` to call Rasa at port 5005

**Problem 3: Rasa Command Not Recognized After .venv Recreation**
- **Issue**: `rasa train` command not found even with virtual environment activated
- **Fix**: Created helper scripts and batch files for easy Rasa commands
- **Solution**: Use `python -m rasa train` or `.\rasa-commands.ps1 train`

### ✅ Fixed Issues (v2.2)

**Problem 1: Rasa Version Compatibility**
- **Issue**: Model trained with Rasa 3.6.20 incompatible with 3.6.21+
- **Fix**: Downgraded Rasa to exact version 3.6.20 with compatible SDK
- **Solution**: Updated requirements.txt with `rasa==3.6.20` and `rasa-sdk==3.6.2`

**Problem 2: Rasa Training Conflicts**
- **Issue**: Contradicting rules and stories preventing model training
- **Fix**: Resolved story structure conflicts and aligned rules with stories
- **Solution**: Updated stories.yml and rules.yml for consistency

**Problem 3: Cryptography DLL Import Errors**
- **Issue**: `ImportError: DLL load failed while importing _rust`
- **Fix**: Fixed Windows-specific cryptography library conflicts
- **Solution**: Pinned cryptography==41.0.7 with compatible dependencies

**Problem 4: Custom Actions Not Working**
- **Issue**: COE and maintenance responses showing only headers
- **Fix**: Fixed action server configuration and story conflicts
- **Solution**: Aligned stories with rules, added maintenance action to domain

**Problem 5: Story Structure Conflicts**
- **Issue**: Contradicting rules and stories preventing training
- **Fix**: Removed conflicting utterances and aligned story flows
- **Solution**: All stories now use custom actions consistently

### ✅ Fixed Issues (v2.1)

**Problem 1: Dependency Conflicts**
- **Issue**: uvicorn dependency conflict during installation
- **Fix**: Updated requirements.txt to resolve uvicorn[standard] conflicts
- **Solution**: Use `python fix_installation.py` for automatic resolution

**Problem 2: Rasa Action Server Connection**
- **Issue**: Failed to connect to action server at localhost:5055
- **Fix**: Added dedicated action server startup in package.json
- **Solution**: Start with `npm run dev:all` (includes actions) or `npm run rasa:actions`

**Problem 3: Cryptography DLL Load Error**
- **Issue**: DLL load failed while importing _rust on Windows
- **Fix**: Updated cryptography to version 41.0.7 with supporting libraries
- **Solution**: Install fixed versions: cryptography==41.0.7, cffi==1.16.0

**Problem 4: Unused Rasa Training Data**
- **Issue**: Intents 'affirm', 'deny' and utterances not used in stories
- **Fix**: Added comprehensive stories and rules using all intents
- **Solution**: All training data now properly utilized

### 🚀 New Features (v2.1)

**Enhanced COE Price Integration**
- Real-time data from Singapore Government API
- Price trend indicators (📈📉➡️)
- Purchase timing recommendations
- Market insights and tips

**Comprehensive Maintenance Guide**
- Detailed service schedules
- Cost estimates for Singapore market
- Warning signs and preventive tips
- Money-saving maintenance advice

**Improved Action Server**
- Better error handling and fallbacks
- Enhanced vehicle information responses
- Singapore-specific automotive expertise

## 🔧 Troubleshooting

### Installation Issues

**Problem: uvicorn dependency conflict**
```bash
# Quick fix:
python fix_installation.py

# Manual fix:
pip uninstall uvicorn
pip install uvicorn==0.24.0
pip install 'uvicorn[standard]==0.24.0' --force-reinstall
```

**Problem: Cryptography DLL errors on Windows**
```bash
# Automatic fix:
python fix_installation.py

# Manual fix:
pip install cryptography==41.0.7 cffi==1.16.0 pycparser==2.21
```

### Runtime Issues

**Problem: Rasa actions not connecting**
```bash
# Start action server separately:
npm run rasa:actions

# Or start all services including actions:
npm run dev:all
```

**Problem: Rasa training warnings about unused intents**
```bash
# Retrain with updated data:
npm run rasa:train

# All intents and utterances are now properly used in stories
```

**Problem: COE prices not updating**
- COE scraper now uses multiple data sources
- Falls back to realistic current market prices
- Includes trend analysis and purchase recommendations

## 📋 Prerequisites

- **Python 3.9+** installed
- **Node.js 18+** and npm installed
- **MongoDB** running locally (or MongoDB Atlas)
- **Git** for version control
- **Windows**: Visual Studio Build Tools (for cryptography)

## 🏗️ Architecture

```
automotive_chatbot/
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python backend
│   ├── api/          # API routes and endpoints
│   ├── actions/      # Rasa custom actions
│   ├── data/         # Rasa training data (comprehensive)
│   ├── utils/        # COE scraper and utilities
│   └── requirements.txt # Fixed dependency versions
├── docs/             # Documentation
├── fix_installation.py # Dependency conflict resolver
├── setup.py          # One-command setup script
└── package.json      # npm scripts (includes actions)
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
- `nlu.yml`