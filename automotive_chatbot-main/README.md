# CleverCompanion - Intelligent Chatbot Platform

**CleverCompanion** is a comprehensive AI-powered chatbot platform built with React (Next.js), FastAPI, Rasa, and MongoDB. It features an admin dashboard, embeddable widgets, and real-time chat capabilities.

## ✨ Features

### 🤖 **Core AI Engine**
- **Rasa-powered NLU/NLG** - Advanced natural language understanding
- **FastAPI Backend** - High-performance REST API with auto-documentation
- **Multi-model Support** - Handles automotive queries, COE pricing, vehicle information
- **Context Awareness** - Maintains conversation context and user preferences
- **Real-time Responses** - Low-latency chat experience

### 🎛️ **Admin Dashboard**
- **Story Management** - Create, edit, delete conversation flows
- **NLU Training** - Manage intents, entities, and training data
- **Rules Engine** - Define business logic and response rules
- **Analytics Dashboard** - Conversation metrics and user insights
- **Model Training** - One-click Rasa model training and deployment
- **Backup/Restore** - Complete system state management

### 🔗 **Embeddable Widgets**
- **Universal Embedding** - Drop-in JavaScript widget for any website
- **React Component** - Pre-built component for React applications
- **Customizable UI** - Themes, colors, positioning, and styling
- **Mobile Responsive** - Optimized for all device sizes
- **Cross-domain Support** - CORS-enabled for secure embedding

### 🚗 **Automotive Specialization**
- **COE Price Integration** - Real-time Singapore COE bidding results
- **Vehicle Database** - Comprehensive car specifications and pricing
- **Maintenance Scheduling** - Service reminders and recommendations
- **Test Drive Booking** - Integration with dealership systems
- **Insurance Guidance** - Policy recommendations and comparisons

### 🔧 Developer Experience
- **Unified Setup** - One-click installation for all dependencies
- **Cross-Platform** - Windows, macOS, Linux support
- **IDE Integration** - PyCharm, VSCode configurations
- **Hot Reload** - Development server with auto-refresh
- **Docker Support** - Containerized deployment

## 🚀 Quick Start

### 1. Unified Installation

Choose your platform and run the setup:

#### Windows (PyCharm/Command Prompt)
```bash
python setup.py
# OR
setup.bat
```

#### macOS/Linux (VSCode/Terminal)
```bash
python3 setup.py
# OR
chmod +x setup.sh && ./setup.sh
```

### 2. Environment Configuration

Update `.env` file with your API keys:
```env
OPENAI_API_KEY=your_openai_key_here
LTA_API_KEY=your_singapore_lta_key
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=automotive_chatbot
```

### 3. Start Development

```bash
# Start all services (Frontend + Backend + Rasa)
npm run dev:all

# Or start individually
npm run dev:frontend    # Next.js frontend (port 3000)
npm run dev:backend     # FastAPI backend (port 8000)
npm run dev:rasa        # Rasa server (port 5005)
```

## 🔗 Embedding CleverCompanion

### Quick Embed (Any Website)

```html
<!-- Add this to your website's HTML -->
<script src="https://your-domain.com/embed.js"></script>
<script>
  window.CleverCompanionConfig = {
    title: 'CleverCompanion',
    primaryColor: '#3B82F6',
    apiEndpoint: 'https://your-domain.com/api/chat'
  };
</script>
```

### Advanced Configuration

```javascript
window.CleverCompanionConfig = {
  title: 'CleverCompanion',
  subtitle: 'Your Intelligent Assistant',
  primaryColor: '#3B82F6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  position: 'bottom-right', // 'bottom-left', 'bottom-right'
  apiEndpoint: 'https://your-api-domain.com/api/chat',
  welcomeMessage: 'Hello! How can I help you today?',
  placeholder: 'Type your message...',
  height: '500px',
  width: '400px',
};

// Programmatic API
window.CleverCompanion.open();    // Open chat
window.CleverCompanion.close();   // Close chat
window.CleverCompanion.sendMessage('Hello'); // Send message
```

## 🎛️ Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin`

**Demo Credentials:** `admin_demo_token`

### Features:
- **📚 Stories Management** - Visual editor for conversation flows
- **🧠 NLU Training** - Intent and entity management
- **⚙️ Configuration** - Domain and response templates
- **🏋️ Model Training** - One-click Rasa training
- **📊 Analytics** - Usage statistics and insights
- **💾 Backup/Restore** - Automated data protection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Rasa Server   │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Port 5005)   │
│   Port 3000     │    │   Port 8000     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Widget Embed   │    │    MongoDB      │    │   Vector DB     │
│  (embed.js)     │    │   (Database)    │    │  (ChromaDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Development Setup

### IDE Configuration

#### PyCharm
1. Open project in PyCharm
2. File → Settings → Project → Python Interpreter
3. Add Interpreter → Existing Environment
4. Select: `.venv/Scripts/python.exe` (Windows) or `.venv/bin/python` (macOS/Linux)

#### VSCode
1. Open project in VSCode
2. Ctrl+Shift+P → "Python: Select Interpreter"
3. Select: `.venv/bin/python` or `.venv/Scripts/python.exe`

### Available Scripts

```bash
# Development
npm run dev              # Frontend only
npm run dev:backend      # Backend only  
npm run dev:rasa         # Rasa only
npm run dev:all          # All services

# Database
npm run db:setup         # Setup MongoDB
npm run db:check         # Check DB connection

# Utilities
npm run status           # Check all services
```

## 📂 Project Structure

```
automotive_chatbot/
├── 📁 frontend/                 # Next.js frontend
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 admin/        # Admin dashboard
│   │   │   │   ├── page.tsx     # Main dashboard
│   │   │   │   └── stories/     # Stories management
│   │   │   └── page.tsx         # Main chat interface
│   │   └── 📁 components/
│   │       └── EmbeddableWidget.tsx
│   └── 📄 package.json
├── 📁 backend/                  # FastAPI backend
│   ├── 📁 api/
│   │   ├── 📁 routes/
│   │   │   ├── admin.py         # Admin API routes
│   │   │   ├── chatbots.py      # Chat endpoints
│   │   │   └── widget_api.py    # Widget API
│   │   └── main.py
│   ├── 📁 data/                 # Rasa training data
│   │   ├── stories.yml          # Conversation flows
│   │   ├── nlu.yml              # Training examples
│   │   └── rules.yml            # Conversation rules
│   ├── domain.yml               # Chatbot domain
│   ├── config.yml               # Rasa configuration
│   └── requirements.txt
├── 📁 public/
│   └── embed.js                 # Embeddable widget script
├── 📁 docs/
│   └── embedding-guide.md       # Widget integration guide
├── setup.py                     # Unified setup script
├── setup.bat                    # Windows setup
├── setup.sh                     # Unix setup
└── package.json                 # Root package configuration
```

## 🌟 Key Features

### Real-time COE Integration
- Live Certificate of Entitlement pricing from Singapore LTA
- Automated data updates every 15 minutes
- Historical trend analysis

### RAG-Enhanced Responses
- Vector similarity search for relevant context
- OpenAI GPT integration for natural responses
- Automotive knowledge base with 10,000+ entries

### Production Ready
- Docker containerization
- Environment-based configuration
- Comprehensive error handling
- Rate limiting and security

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t automotive-chatbot .
docker run -p 3000:3000 -p 8000:8000 automotive-chatbot
```

### Production Environment
```bash
# Frontend build
cd frontend && npm run build

# Backend with Gunicorn
cd backend && gunicorn api.main:app --host 0.0.0.0 --port 8000

# Rasa production server
cd backend && rasa run --enable-api --cors "*" --port 5005
```

## 📊 API Documentation

- **Main API**: `http://localhost:8000/docs`
- **Admin API**: `http://localhost:8000/docs#/admin`
- **Widget API**: `http://localhost:8000/docs#/widget`
- **Rasa API**: `http://localhost:5005/docs`

## 🔒 Security

- JWT token authentication for admin routes
- CORS configuration for production
- Input validation and sanitization
- Rate limiting on all endpoints
- Secure environment variable handling

## 📈 Analytics & Monitoring

The admin dashboard provides:
- Real-time usage statistics
- Conversation flow analytics
- User interaction patterns
- Model performance metrics
- Error rate monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full Documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- [Rasa](https://rasa.com/) - Conversational AI framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React production framework
- [LangChain](https://langchain.com/) - RAG implementation
- [Singapore LTA](https://datamall.lta.gov.sg/) - COE data API

---

⭐ **Star this repository if you find it helpful!**

## 🔧 Troubleshooting

### Windows-Specific Quick Fix

If you encounter setup issues on Windows, run the Windows-specific fix script first:

```bash
python windows-fix.py
```

This script will:
- Fix Windows path issues in npm scripts
- Resolve ESLint dependency conflicts  
- Install dependencies with proper Windows commands
- Clean and reinstall problematic packages

**PowerShell Execution Policy Issue:**
If you get "running scripts is disabled" error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use the PowerShell fix script:
```powershell
.\windows-powershell-fix.ps1
```

### Quick Fix Script

If you encounter setup issues, run the quick fix script first:

```bash
python quick-fix.py
```

### Common Issues

#### 1. Windows: `'..' is not recognized as an internal or external command`
```bash
# Solution: Use the Windows-specific scripts
npm run dev:all        # Uses Windows paths
npm run dev:all-unix   # For WSL/Linux users

# Or run individually:
npm run dev:frontend
npm run dev:backend  
npm run dev:rasa
```

#### 2. `npm run dev:all` fails with "concurrently not found"
```bash
# Solution: Install concurrently
npm install concurrently

# Or run services individually
npm run dev:frontend    # Terminal 1
npm run dev:backend     # Terminal 2  
npm run dev:rasa        # Terminal 3
```

#### 3. ESLint dependency conflicts in frontend
```bash
# Solution: Install with legacy peer deps
cd frontend
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s /q node_modules & del package-lock.json  # Windows
npm install --legacy-peer-deps
```

#### 4. Python dependency installation fails
```bash
# Solution 1: Use basic requirements first
cd backend
pip install -r requirements-basic.txt

# Solution 2: Remove problematic packages and retry
pip install -r requirements.txt

# Solution 3: Manual installation
pip install fastapi uvicorn python-multipart pymongo motor
```

#### 5. `python-cors` package not found
This has been fixed in the latest requirements.txt. FastAPI has built-in CORS support. If you see this error:
```bash
# Update your requirements file or reinstall:
pip install --upgrade -r backend/requirements.txt
```

#### 6. Node.js/npm not found (Windows)
```bash
# Download and install Node.js from https://nodejs.org/
# Or add to PATH temporarily:
set PATH=%PATH%;C:\Program Files\nodejs

# Verify installation:
npm --version
```

#### 7. Python version compatibility issues
```bash
# Check your Python version
python --version

# For Python 3.9+, use updated requirements
pip install --upgrade pip
pip install -r backend/requirements.txt
```

#### 8. MongoDB connection issues
```bash
# Option 1: Install MongoDB locally
# Download from https://www.mongodb.com/try/download/community

# Option 2: Use Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Option 3: Skip MongoDB for basic testing
# The app will work with limited functionality
```

#### 9. Unicode encoding errors (Windows)
```bash
# Run commands in PowerShell or Command Prompt with UTF-8
chcp 65001
python setup.py
```

### Progressive Setup Approach

If full setup fails, try this progressive approach:

1. **Run Windows fix script:**
   ```bash
   python windows-fix.py
   ```

2. **Install Node.js dependencies only:**
   ```bash
   npm install
   cd frontend && npm install --legacy-peer-deps
   ```

3. **Install basic Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements-basic.txt
   ```

4. **Start frontend only:**
   ```bash
   npm run dev:frontend
   ```

5. **Start backend only:**
   ```bash
   npm run dev:backend
   ```

6. **Add advanced features gradually:**
   ```bash
   # Install Rasa when ready
   pip install rasa>=3.6.0
   
   # Install RAG features when ready  
   pip install langchain chromadb sentence-transformers
   ```

### Platform-Specific Commands

#### Windows (Command Prompt/PowerShell)
```bash
# Setup
python setup.py
# OR
setup.bat

# Development
npm run dev:all          # All services
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Virtual environment activation
.venv\Scripts\activate
```

#### Windows (WSL) / Linux / macOS
```bash
# Setup  
python3 setup.py
# OR
chmod +x setup.sh && ./setup.sh

# Development
npm run dev:all-unix     # All services (Unix paths)
npm run dev:frontend     # Frontend only
npm run dev:backend-unix # Backend only (Unix paths)

# Virtual environment activation
source .venv/bin/activate
```

## 🛠️ Development Setup