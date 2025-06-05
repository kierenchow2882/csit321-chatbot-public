# 🚗 Automotive Chatbot - Quick Start Guide

**Simple 3-step setup for anyone to run this project**

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Enter
```bash
git clone https://github.com/yeehauc/automotive_chatbot.git
cd automotive_chatbot
```

### 2. Run Setup Script
```bash
python setup.py
```
*That's it! The script handles everything automatically.*

### 3. Start the App
```bash
npm run dev:all
```

## 🌐 Access Your App
- **Main App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Docs**: http://localhost:8000/docs

---

## 📋 Prerequisites
- **Python 3.9+** → [Download](https://python.org/downloads)
- **Node.js 18+** → [Download](https://nodejs.org)

---

## 🔧 Manual Setup (if automatic fails)

### Step 1: Python Environment
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

### Step 2: Node.js Dependencies
```bash
npm install
cd frontend && npm install
```

### Step 3: Start Everything
```bash
# Start frontend
npm run dev:frontend

# In another terminal, start backend
npm run dev:backend
```

---

## 🛠️ Development Commands

```bash
# Start everything at once
npm run dev:all

# Start components separately
npm run dev:frontend    # Next.js frontend
npm run dev:backend     # FastAPI backend
npm run dev:rasa        # Rasa chatbot

# Install dependencies
npm run install:frontend
```

---

## 🌍 Embed in Your Website

Add this to any website:
```html
<script src="http://localhost:3000/embed.js" 
        data-title="Car Assistant"
        data-button-color="#007bff">
</script>
```

---

## 🐛 Troubleshooting

**"python not found"** → Install Python from python.org

**"npm not found"** → Install Node.js from nodejs.org

**"Module not found"** → Make sure virtual environment is activated

**Ports in use** → Change ports in package.json scripts

---

## 💡 That's It!

The project automatically:
- ✅ Creates Python virtual environment
- ✅ Installs all dependencies
- ✅ Sets up database configuration
- ✅ Configures environment files

**No complex setup needed!** 