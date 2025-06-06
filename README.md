# CSIT321 FYP - Chatbot for Customer Support

## 🚀 Project Overview
This is a Final Year Project for an Automotive Chatbot Platform with customer support capabilities.

## 🛠️ Development Environment Setup

### Prerequisites
- Python 3.9+ installed
- PyCharm IDE
- Git

### 🐍 Python Environment Setup

#### 1. Virtual Environment
The project uses a virtual environment located at `.\.venv\` with Python 3.9.13.

#### 2. PyCharm Configuration
To fix the "invalid Python interpreter" issue in PyCharm:

1. **Open PyCharm Settings:**
   - Press `Ctrl + Alt + S` or go to `File > Settings`

2. **Configure Python Interpreter:**
   - Navigate to: `Project: CSIT321-FYP-Chatbot-for-Customer-Support > Python Interpreter`
   - Click the gear icon ⚙️ next to the Python Interpreter dropdown
   - Select "Add..." → "Existing Environment"
   - Set interpreter path to:
     ```
     C:\CSIT321-FYP-Chatbot-for-Customer-Support\.venv\Scripts\python.exe
     ```
   - Click "OK"

#### 3. Install Dependencies
```powershell
# Activate virtual environment
.\.venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Install project dependencies
pip install -r "WireFrames\automotive_chatbot-main\backend\requirements.txt"
```

### 🔧 Quick Commands

#### Check Python Version
```powershell
.\.venv\Scripts\python.exe --version
```

#### Verify Installation
```powershell
.\.venv\Scripts\pip.exe list
```

## 📂 Project Structure
```
CSIT321-FYP-Chatbot-for-Customer-Support/
├── .venv/                          # Virtual environment
├── .idea/                          # PyCharm configuration
├── WireFrames/                     # Project wireframes and main code
│   └── automotive_chatbot-main/    # Main application
│       ├── backend/                # Backend API
│       └── docs/                   # Documentation
└── README.md                       # This file
```

## 🚨 Common Issues & Solutions

### Invalid Python Interpreter in PyCharm
- **Issue:** PyCharm shows "invalid python interpreter"
- **Solution:** Follow the PyCharm Configuration steps above

### Missing Dependencies
- **Issue:** Import errors when running the application
- **Solution:** Install dependencies using the commands in step 3 above

## 📝 Development Notes
- Always use the virtual environment for development
- Update this README when making significant changes
- Ensure PyCharm is configured with the correct interpreter

## 🔗 Related Documentation
- [Main Project README](WireFrames/automotive_chatbot-main/README.md)
- [Backend Setup](WireFrames/automotive_chatbot-main/backend/README.md)
- [MongoDB Setup](WireFrames/automotive_chatbot-main/docs/MONGODB_SETUP.md)

---
**Last Updated:** January 2025 - PyCharm Environment Configuration 