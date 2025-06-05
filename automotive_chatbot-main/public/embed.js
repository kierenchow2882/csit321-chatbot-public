(function() {
    'use strict';
    
    // Configuration
    const DEFAULT_CONFIG = {
        apiUrl: 'http://localhost:8000',
        title: 'Automotive Assistant',
        placeholder: 'Ask me about vehicles...',
        theme: 'light',
        position: 'bottom-right',
        buttonColor: '#007bff',
        headerColor: '#007bff',
        width: '350px',
        height: '500px',
        minimized: true
    };

    // Widget Class
    class AutomotiveChatWidget {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.isOpen = !this.config.minimized;
            this.messages = [];
            this.init();
        }

        init() {
            this.createStyles();
            this.createWidget();
            this.attachEventListeners();
        }

        createStyles() {
            const styles = `
                .automotive-chat-widget {
                    position: fixed;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    ${this.getPositionStyles()}
                }
                
                .automotive-chat-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${this.config.buttonColor};
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                
                .automotive-chat-button:hover {
                    transform: scale(1.1);
                }
                
                .automotive-chat-button svg {
                    width: 24px;
                    height: 24px;
                    fill: white;
                }
                
                .automotive-chat-window {
                    width: ${this.config.width};
                    height: ${this.config.height};
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 5px 40px rgba(0,0,0,0.16);
                    display: ${this.isOpen ? 'flex' : 'none'};
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                
                .automotive-chat-header {
                    background: ${this.config.headerColor};
                    color: white;
                    padding: 15px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .automotive-chat-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                }
                
                .automotive-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .automotive-chat-message {
                    max-width: 80%;
                    padding: 10px 12px;
                    border-radius: 18px;
                    word-wrap: break-word;
                }
                
                .automotive-chat-message.user {
                    background: ${this.config.buttonColor};
                    color: white;
                    align-self: flex-end;
                }
                
                .automotive-chat-message.bot {
                    background: #f1f3f5;
                    color: #333;
                    align-self: flex-start;
                }
                
                .automotive-chat-input-area {
                    padding: 15px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    gap: 10px;
                }
                
                .automotive-chat-input {
                    flex: 1;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    padding: 10px 15px;
                    outline: none;
                    resize: none;
                    font-family: inherit;
                }
                
                .automotive-chat-send {
                    background: ${this.config.buttonColor};
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .automotive-chat-send svg {
                    width: 16px;
                    height: 16px;
                    fill: white;
                }
                
                .automotive-chat-loading {
                    display: flex;
                    gap: 4px;
                    padding: 10px 12px;
                }
                
                .automotive-chat-loading span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ccc;
                    animation: bounce 1.4s ease-in-out infinite both;
                }
                
                .automotive-chat-loading span:nth-child(1) { animation-delay: -0.32s; }
                .automotive-chat-loading span:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { 
                        transform: scale(0);
                    } 40% { 
                        transform: scale(1);
                    }
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        getPositionStyles() {
            const positions = {
                'bottom-right': 'bottom: 20px; right: 20px;',
                'bottom-left': 'bottom: 20px; left: 20px;',
                'top-right': 'top: 20px; right: 20px;',
                'top-left': 'top: 20px; left: 20px;'
            };
            return positions[this.config.position] || positions['bottom-right'];
        }

        createWidget() {
            const widget = document.createElement('div');
            widget.className = 'automotive-chat-widget';
            widget.innerHTML = `
                <div class="automotive-chat-window">
                    <div class="automotive-chat-header">
                        <span>${this.config.title}</span>
                        <button class="automotive-chat-close">&times;</button>
                    </div>
                    <div class="automotive-chat-messages"></div>
                    <div class="automotive-chat-input-area">
                        <textarea class="automotive-chat-input" placeholder="${this.config.placeholder}" rows="1"></textarea>
                        <button class="automotive-chat-send">
                            <svg viewBox="0 0 24 24">
                                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <button class="automotive-chat-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                    </svg>
                </button>
            `;

            document.body.appendChild(widget);
            this.widget = widget;
            this.chatWindow = widget.querySelector('.automotive-chat-window');
            this.messagesContainer = widget.querySelector('.automotive-chat-messages');
            this.inputArea = widget.querySelector('.automotive-chat-input');
            this.sendButton = widget.querySelector('.automotive-chat-send');
            this.chatButton = widget.querySelector('.automotive-chat-button');
            this.closeButton = widget.querySelector('.automotive-chat-close');
        }

        attachEventListeners() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.closeButton.addEventListener('click', () => this.closeChat());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            
            this.inputArea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.inputArea.addEventListener('input', () => {
                this.adjustTextareaHeight();
            });
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.chatWindow.style.display = this.isOpen ? 'flex' : 'none';
            
            if (this.isOpen && this.messages.length === 0) {
                this.addMessage('Hello! I\'m your automotive assistant. How can I help you today?', 'bot');
            }
        }

        closeChat() {
            this.isOpen = false;
            this.chatWindow.style.display = 'none';
        }

        adjustTextareaHeight() {
            this.inputArea.style.height = 'auto';
            this.inputArea.style.height = Math.min(this.inputArea.scrollHeight, 100) + 'px';
        }

        async sendMessage() {
            const message = this.inputArea.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.inputArea.value = '';
            this.adjustTextareaHeight();

            this.showLoading();

            try {
                const response = await fetch(`${this.config.apiUrl}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                this.hideLoading();
                this.addMessage(data.response || 'Sorry, I couldn\'t process that request.', 'bot');
            } catch (error) {
                this.hideLoading();
                this.addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
            }
        }

        addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `automotive-chat-message ${sender}`;
            messageDiv.textContent = text;
            
            this.messagesContainer.appendChild(messageDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            
            this.messages.push({ text, sender, timestamp: new Date() });
        }

        showLoading() {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'automotive-chat-loading bot';
            loadingDiv.innerHTML = '<span></span><span></span><span></span>';
            loadingDiv.id = 'loading-indicator';
            
            this.messagesContainer.appendChild(loadingDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        hideLoading() {
            const loadingDiv = document.getElementById('loading-indicator');
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }

        // Public API
        open() {
            this.isOpen = true;
            this.chatWindow.style.display = 'flex';
        }

        close() {
            this.closeChat();
        }

        sendBotMessage(message) {
            this.addMessage(message, 'bot');
        }

        clearHistory() {
            this.messages = [];
            this.messagesContainer.innerHTML = '';
        }
    }

    // Auto-initialize if config is provided
    window.AutomotiveChatWidget = AutomotiveChatWidget;
    
    // Auto-initialize if data attributes are found
    const initializeFromScript = () => {
        const scripts = document.querySelectorAll('script[src*="embed.js"]');
        for (const script of scripts) {
            if (script.dataset.autoInit !== 'false') {
                const config = {};
                
                // Extract config from data attributes
                for (const attr of script.attributes) {
                    if (attr.name.startsWith('data-') && attr.name !== 'data-auto-init') {
                        const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        config[key] = attr.value;
                    }
                }
                
                new AutomotiveChatWidget(config);
                break;
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFromScript);
    } else {
        initializeFromScript();
    }
})(); 