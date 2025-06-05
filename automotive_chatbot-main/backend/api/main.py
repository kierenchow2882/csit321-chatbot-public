from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    app.mongodb = app.mongodb_client[os.getenv("MONGODB_DB", "chatbot_platform")]
    yield
    # Shutdown: Close MongoDB connection
    app.mongodb_client.close()

app = FastAPI(
    title="Automotive Chatbot Platform",
    description="Advanced AI-powered automotive assistant with RAG capabilities",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the Automotive Chatbot API v2.0",
        "features": [
            "Real-time COE pricing from LTA",
            "RAG-enhanced AI responses",
            "Embeddable widget API",
            "VectorDB knowledge base",
            "LangChain integration"
        ],
        "documentation": "/docs",
        "health": "/health",
        "widget_demo": "/api/widget/embed.js?widget_id=demo"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "services": {
            "api": "running",
            "mongodb": "connected" if app.mongodb else "disconnected",
            "coe_service": "available",
            "rag_service": "available" if os.getenv("OPENAI_API_KEY") else "limited"
        }
    }

# Import and include routers
try:
    from api.routes import chatbots, users, analytics, widget_api, admin
    
    # Main chatbot routes
    app.include_router(chatbots.router, prefix="/api/chatbots", tags=["chatbots"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])  
    app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
    
    # Widget API routes
    app.include_router(widget_api.router, prefix="/api", tags=["widget"])
    
    # Admin routes for managing chatbot configuration
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
    
except ImportError as e:
    print(f"Warning: Could not import some routes: {e}")
    # Create placeholder routers if modules don't exist yet
    from fastapi import APIRouter
    
    class PlaceholderRouter:
        def __init__(self):
            self.router = APIRouter()
            
            @self.router.get("/")
            def placeholder():
                return {"message": "Placeholder route - implement this module"}
    
    chatbots = PlaceholderRouter()
    users = PlaceholderRouter()
    analytics = PlaceholderRouter()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000) 