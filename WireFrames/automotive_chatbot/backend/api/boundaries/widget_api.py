"""
Widget API - Dedicated endpoints for embeddable chatbot widget
Implements BCE framework for easy integration into third-party websites
"""

from fastapi import APIRouter, HTTPException, Request, Query
from fastapi.responses import JSONResponse, HTMLResponse, Response
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import os

# NO DIRECT SERVICE IMPORTS IN BOUNDARIES! 
# Boundaries should only handle HTTP requests/responses
# All business logic goes through Controllers

router = APIRouter()

class WidgetMessage(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class WidgetConfig(BaseModel):
    widget_id: str
    title: Optional[str] = "Automotive Assistant"
    theme: Optional[Dict[str, str]] = {
        "primary_color": "#667eea",
        "secondary_color": "#764ba2",
        "font_family": "Arial"
    }
    welcome_message: Optional[str] = "Hi! I'm your automotive assistant. How can I help you today?"
    api_endpoint: Optional[str] = None

# Widget Chat API
@router.post("/widget/chat")
async def widget_chat(message_data: WidgetMessage):
    """
    🌐 BOUNDARY: Widget chat endpoint - Pure HTTP interface
    Delegates all logic to ChatController (BCE pattern)
    """
    try:
        # Input validation only
        if not message_data.message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Initialize controller (in production, use dependency injection)
        from api.controllers.chat_controller import ChatController
        chat_controller = ChatController()
        
        # Delegate to controller - NO business logic here
        response = await chat_controller.handle_widget_chat(
            message=message_data.message,
            user_id=message_data.user_id or "anonymous", 
            context=message_data.context
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        # Only HTTP error handling
        raise HTTPException(status_code=500, detail="Internal server error")

# Widget Configuration API
@router.get("/widget/config")
async def get_widget_config(widget_id: str = Query(..., description="Widget ID")):
    """Get widget configuration"""
    
    # In production, this would fetch from database
    default_config = WidgetConfig(
        widget_id=widget_id,
        title="🚗 Automotive Assistant",
        theme={
            "primary_color": "#667eea",
            "secondary_color": "#764ba2", 
            "font_family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            "border_radius": "12px"
        },
        welcome_message="👋 Hi! I'm your automotive assistant specializing in Singapore's vehicle market. I can help with COE prices, vehicle registration, and automotive advice. What would you like to know?",
        api_endpoint=f"/api/widget/chat"
    )
    
    return default_config

# Embeddable Widget Script
@router.get("/widget/embed.js")
async def get_widget_script(
    widget_id: str = Query(..., description="Widget ID"),
    api_url: str = Query(default="http://localhost:8000/api/widget", description="API base URL")
):
    """
    Generate embeddable JavaScript widget
    This creates a self-contained widget that can be embedded anywhere
    """
    
    widget_script = f"""
(function() {{
    // Automotive Chatbot Widget - v2.0
    // Embeddable widget for third-party websites
    
    const WIDGET_ID = '{widget_id}';
    const API_BASE = '{api_url}';
    
    class AutomotiveWidget {{
        constructor(config = {{}}) {{
            this.config = {{
                apiUrl: API_BASE,
                widgetId: WIDGET_ID,
                position: 'bottom-right',
                autoOpen: false,
                ...config
            }};
            
            this.isOpen = false;
            this.messages = [];
            this.sessionId = this.generateSessionId();
            
            this.init();
        }}
        
        async init() {{
            try {{
                // Fetch widget configuration
                const configResponse = await fetch(`${{this.config.apiUrl}}/config?widget_id=${{this.config.widgetId}}`);
                const widgetConfig = await configResponse.json();
                
                this.widgetConfig = widgetConfig;
                this.createWidget();
                this.attachEvents();
                
                console.log('Automotive Widget initialized successfully');
            }} catch (error) {{
                console.error('Failed to initialize widget:', error);
            }}
        }}
        
        createWidget() {{
            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'automotive-widget-container';
            widgetContainer.innerHTML = this.getWidgetHTML();
            
            // Add styles
            const styles = document.createElement('style');
            styles.textContent = this.getWidgetCSS();
            document.head.appendChild(styles);
            
            // Add to page
            document.body.appendChild(widgetContainer);
            
            // Cache DOM elements
            this.elements = {{
                container: document.getElementById('automotive-widget'),
                toggle: document.getElementById('automotive-widget-toggle'),
                messages: document.getElementById('automotive-widget-messages'),
                input: document.getElementById('automotive-widget-input'),
                sendBtn: document.getElementById('automotive-widget-send'),
                minimize: document.getElementById('automotive-widget-minimize')
            }};
            
            // Add welcome message
            this.addMessage(this.widgetConfig.welcome_message, 'bot');
        }}
        
        getWidgetHTML() {{
            return `
                <div id="automotive-widget" class="automotive-widget" style="display: none;">
                    <div class="automotive-widget-header">
                        <span class="automotive-widget-title">${{this.widgetConfig.title}}</span>
                        <button id="automotive-widget-minimize" class="automotive-widget-minimize">−</button>
                    </div>
                    <div id="automotive-widget-messages" class="automotive-widget-messages"></div>
                    <div class="automotive-widget-input-container">
                        <input id="automotive-widget-input" type="text" placeholder="Ask about COE prices, registration..." maxlength="500">
                        <button id="automotive-widget-send" class="automotive-widget-send">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <button id="automotive-widget-toggle" class="automotive-widget-toggle">🚗</button>
            `;
        }}
        
        getWidgetCSS() {{
            const theme = this.widgetConfig.theme;
            return `
                .automotive-widget {{
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: ${{theme.border_radius || '12px'}};
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    font-family: ${{theme.font_family}};
                    z-index: 10000;
                    transition: all 0.3s ease;
                }}
                
                .automotive-widget-header {{
                    background: linear-gradient(135deg, ${{theme.primary_color}} 0%, ${{theme.secondary_color}} 100%);
                    color: white;
                    padding: 16px;
                    border-radius: ${{theme.border_radius || '12px'}} ${{theme.border_radius || '12px'}} 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }}
                
                .automotive-widget-title {{
                    font-weight: 600;
                    font-size: 16px;
                }}
                
                .automotive-widget-minimize {{
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                }}
                
                .automotive-widget-minimize:hover {{
                    background: rgba(255,255,255,0.2);
                }}
                
                .automotive-widget-messages {{
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }}
                
                .automotive-widget-message {{
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    word-wrap: break-word;
                    animation: slideIn 0.3s ease;
                }}
                
                .automotive-widget-message.user {{
                    background: ${{theme.primary_color}};
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }}
                
                .automotive-widget-message.bot {{
                    background: #f1f3f4;
                    color: #333;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }}
                
                .automotive-widget-input-container {{
                    padding: 16px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 8px;
                }}
                
                .automotive-widget input {{
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 24px;
                    outline: none;
                    font-size: 14px;
                }}
                
                .automotive-widget input:focus {{
                    border-color: ${{theme.primary_color}};
                }}
                
                .automotive-widget-send {{
                    background: ${{theme.primary_color}};
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 44px;
                    height: 44px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }}
                
                .automotive-widget-send:hover {{
                    transform: scale(1.05);
                }}
                
                .automotive-widget-toggle {{
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, ${{theme.primary_color}} 0%, ${{theme.secondary_color}} 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                    z-index: 10001;
                    transition: all 0.3s ease;
                }}
                
                .automotive-widget-toggle:hover {{
                    transform: scale(1.05);
                }}
                
                @keyframes slideIn {{
                    from {{ opacity: 0; transform: translateY(10px); }}
                    to {{ opacity: 1; transform: translateY(0); }}
                }}
                
                @media (max-width: 480px) {{
                    .automotive-widget {{
                        width: 100vw;
                        height: 100vh;
                        bottom: 0;
                        right: 0;
                        border-radius: 0;
                    }}
                }}
            `;
        }}
        
        attachEvents() {{
            this.elements.toggle.addEventListener('click', () => this.toggleWidget());
            this.elements.minimize.addEventListener('click', () => this.closeWidget());
            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
            this.elements.input.addEventListener('keypress', (e) => {{
                if (e.key === 'Enter') {{
                    e.preventDefault();
                    this.sendMessage();
                }}
            }});
        }}
        
        toggleWidget() {{
            this.isOpen = !this.isOpen;
            if (this.isOpen) {{
                this.elements.container.style.display = 'flex';
                this.elements.toggle.style.display = 'none';
                this.elements.input.focus();
            }} else {{
                this.elements.container.style.display = 'none';
                this.elements.toggle.style.display = 'block';
            }}
        }}
        
        closeWidget() {{
            this.isOpen = false;
            this.elements.container.style.display = 'none';
            this.elements.toggle.style.display = 'block';
        }}
        
        async sendMessage() {{
            const message = this.elements.input.value.trim();
            if (!message) return;
            
            // Add user message
            this.addMessage(message, 'user');
            this.elements.input.value = '';
            
            // Show typing indicator
            const typingId = this.addTypingIndicator();
            
            try {{
                // Send to API
                const response = await fetch(`${{this.config.apiUrl}}/chat`, {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{
                        message: message,
                        user_id: this.getUserId(),
                        session_id: this.sessionId,
                        context: {{
                            widget_id: this.config.widgetId,
                            url: window.location.href
                        }}
                    }})
                }});
                
                const data = await response.json();
                
                // Remove typing indicator
                this.removeTypingIndicator(typingId);
                
                // Add bot response
                if (data.success) {{
                    this.addMessage(data.response, 'bot');
                }} else {{
                    this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }}
                
            }} catch (error) {{
                this.removeTypingIndicator(typingId);
                this.addMessage('Sorry, I\\'m having trouble connecting. Please try again.', 'bot');
            }}
        }}
        
        addMessage(text, sender) {{
            const messageDiv = document.createElement('div');
            messageDiv.className = `automotive-widget-message ${{sender}}`;
            messageDiv.textContent = text;
            
            this.elements.messages.appendChild(messageDiv);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            
            this.messages.push({{ text, sender, timestamp: new Date() }});
        }}
        
        addTypingIndicator() {{
            const typingDiv = document.createElement('div');
            const typingId = 'typing-' + Date.now();
            typingDiv.id = typingId;
            typingDiv.className = 'automotive-widget-message bot';
            typingDiv.innerHTML = 'Assistant is typing...';
            typingDiv.style.fontStyle = 'italic';
            typingDiv.style.opacity = '0.7';
            
            this.elements.messages.appendChild(typingDiv);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            
            return typingId;
        }}
        
        removeTypingIndicator(typingId) {{
            const typingElement = document.getElementById(typingId);
            if (typingElement) {{
                typingElement.remove();
            }}
        }}
        
        getUserId() {{
            let userId = localStorage.getItem('automotive_widget_user_id');
            if (!userId) {{
                userId = 'user_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('automotive_widget_user_id', userId);
            }}
            return userId;
        }}
        
        generateSessionId() {{
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }}
    }}
    
    // Auto-initialize or expose for manual initialization
    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', function() {{
            window.AutomotiveWidget = new AutomotiveWidget();
        }});
    }} else {{
        window.AutomotiveWidget = new AutomotiveWidget();
    }}
    
    // Expose constructor for custom configurations
    window.createAutomotiveWidget = function(config) {{
        return new AutomotiveWidget(config);
    }};
}})();
"""
    
    return Response(
        content=widget_script,
        media_type="application/javascript",
        headers={
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*"
        }
    )

# Widget Analytics
@router.get("/widget/analytics")
async def get_widget_analytics(widget_id: str = Query(...)):
    """Get widget usage analytics"""
    
    # Mock analytics data - in production, fetch from database
    return {
        "widget_id": widget_id,
        "period": "last_30_days",
        "metrics": {
            "total_conversations": 1247,
            "total_messages": 4891,
            "average_session_length": "3.2 minutes",
            "top_queries": [
                {"query": "COE prices", "count": 423},
                {"query": "vehicle registration", "count": 287},
                {"query": "car loan", "count": 198},
                {"query": "EV rebate", "count": 156}
            ],
            "user_satisfaction": 4.2,
            "response_accuracy": 0.87
        }
    }

async def process_widget_message(message: str, context: Dict) -> str:
    """
    Fallback message processing for widget
    """
    message_lower = message.lower()
    
    # COE-related queries
    if any(word in message_lower for word in ["coe", "certificate of entitlement", "coe price", "coe bidding"]):
        try:
            lta_api_key = os.getenv("LTA_API_KEY")
            coe_data = await coe_service.get_latest_coe_prices(lta_api_key)
            return coe_service.format_coe_response(coe_data)
        except Exception:
            return "I'm having trouble fetching the latest COE prices. Please try again later."
    
    # Quick responses for common queries
    elif any(word in message_lower for word in ["hello", "hi", "hey"]):
        return "Hello! I'm your automotive assistant for Singapore. I can help with COE prices, vehicle registration, financing, and more. What would you like to know?"
    
    elif any(word in message_lower for word in ["price", "cost", "financing", "loan"]):
        return "I can help with vehicle costs! Are you asking about:\n• COE bidding prices\n• Vehicle financing options\n• Registration fees\n• Insurance costs\n\nPlease be more specific!"
    
    else:
        return "I'm here to help with Singapore automotive matters! Try asking about:\n🚗 COE prices\n📋 Vehicle registration\n💰 Car financing\n🔧 Maintenance tips\n\nWhat interests you?" 