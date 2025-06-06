# Backend Structure

```
backend/
├── api/                    # FastAPI application
│   ├── main.py            # Main application entry point
│   ├── config.py          # Configuration settings
│   ├── routes/            # API endpoints
│   │   ├── chatbots.py    # Chatbot management
│   │   ├── users.py       # User management
│   │   └── analytics.py   # Analytics tracking
│   ├── models/            # Database models
│   │   ├── chatbot.py     # Chatbot model
│   │   ├── user.py        # User model
│   │   └── analytics.py   # Analytics model
│   └── services/          # Business logic
│       ├── rasa.py        # RASA integration
│       └── auth.py        # Authentication service
├── rasa/                  # RASA chatbot engine
│   ├── data/             # Training data
│   ├── models/           # Trained models
│   └── config.yml        # RASA configuration
├── tests/                # Test files
├── .env.example          # Environment variables example
└── requirements.txt      # Python dependencies
```

## Key Components

1. **API Layer** (`api/`)
   - FastAPI application
   - RESTful endpoints
   - Request/response models
   - Authentication middleware

2. **RASA Integration** (`rasa/`)
   - Chatbot training data
   - Model configuration
   - Custom actions

3. **Services** (`api/services/`)
   - Business logic
   - External service integration
   - Data processing

4. **Models** (`api/models/`)
   - Database schemas
   - Data validation
   - Type definitions

## Current Dependencies

The backend uses stable, compatible versions of all dependencies:

### Core Framework
- **FastAPI 0.88.0**: Compatible with Pydantic 1.x and Rasa 3.6.20
- **Uvicorn 0.20.0**: ASGI server compatible with older FastAPI
- **Pydantic 1.10.9**: Compatible with both FastAPI and Rasa

### Database
- **Motor 2.5.1**: Async MongoDB driver compatible with pymongo 3.x
- **PyMongo 3.13.0**: MongoDB driver compatible with Rasa requirements

### Chatbot Engine
- **Rasa 3.6.20**: Stable version with proven NLU and dialogue management
- **Rasa SDK 3.6.2**: Latest SDK compatible with Rasa 3.6.20

### Network & Communication
- **websockets 10.4**: Compatible with Rasa SDK
- **sanic 21.12.2**: Compatible with Rasa SDK
- **aiohttp 3.8.0-4.0.0**: Async HTTP client/server
- **packaging 20.9**: Compatible with Rasa (no LegacyVersion issues)

## Setup

1. **Create Virtual Environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB credentials and settings
   ```

4. **Start the Server**:
   ```bash
   # Development mode
   uvicorn api.main:app --reload --host localhost --port 8000
   
   # Production mode
   uvicorn api.main:app --host 0.0.0.0 --port 8000
   ```

## Environment Variables

Create a `.env` file in the backend directory with:

```env
# MongoDB Connection
MONGODB_URL=mongodb://admin:your_password@localhost:27017/automotive_chatbot?authSource=automotive_chatbot
MONGODB_DB=automotive_chatbot
MONGODB_USER=admin
MONGODB_PASSWORD=your_password

# Security
JWT_SECRET=automotive_chatbot_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=30

# API Settings
API_HOST=localhost
API_PORT=8000
DEBUG=true

# Rasa Integration
RASA_SERVER_URL=http://localhost:5005
```

## Development Guidelines

- **Code Style**: Follow PEP 8 style guide
- **Type Hints**: Use type hints for all functions and methods
- **Testing**: Write tests for new features using pytest
- **Documentation**: Update API documentation for new endpoints
- **Async/Await**: Use async/await for all database operations with Motor
- **Error Handling**: Implement proper error handling and logging

## API Documentation

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

Run tests using pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=api

# Run specific test file
pytest tests/test_chatbots.py
```

## Performance Considerations

- **Motor 3.7.1**: Provides improved async performance for MongoDB operations
- **FastAPI 0.109.2**: Enhanced request handling and validation
- **Connection Pooling**: MongoDB connections are automatically pooled by Motor
- **Async Operations**: All database operations use async/await for better concurrency 