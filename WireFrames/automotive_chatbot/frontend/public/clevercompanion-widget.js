/**
 * CleverCompanion Chatbot Widget
 * Production-ready automotive chatbot for any website
 * Zero dependencies, pure vanilla JavaScript
 * Matches React page design and functionality
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        WIDGET_ID: 'cc-chatbot-container',
        TOGGLE_ID: 'cc-toggle',
        CLOSE_ID: 'cc-close-btn',
        MESSAGES_ID: 'cc-messages',
        INPUT_ID: 'cc-input',
        SEND_BTN_ID: 'cc-send-btn',
        MENU_BTN_ID: 'cc-menu-btn',
        API_URL: 'http://127.0.0.1:5005/webhooks/rest/webhook'
    };

    // Widget configuration
    const currentConfig = {
        title: 'CleverCompanion',
        subtitle: 'Your automotive assistant',
        welcomeMessage: "Hello! I'm your automotive assistant. How can I help you today?"
    };

    // Comprehensive CSS - Fixed positioning and styling
    const WIDGET_CSS = `
        /* Widget Container - Shifted left with close button */
        #cc-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 80px;
            width: 450px;
            max-width: calc(100vw - 120px);
            height: 600px;
            max-height: calc(100vh - 40px);
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(79, 70, 229, 0.1);
        }

        #cc-chatbot-container.cc-open {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }

        /* Toggle button - Same size as close button */
        #cc-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            border: none;
            cursor: pointer;
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
            transition: all 0.3s ease;
            outline: none;
            font-size: 24px;
            overflow: hidden;
        }

        #cc-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(79, 70, 229, 0.5);
        }

        #cc-toggle img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        /* Close button - Same size as toggle button */
        #cc-close-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.9);
            border: none;
            cursor: pointer;
            z-index: 1000000;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
            transition: all 0.2s ease;
            outline: none;
            color: white;
        }

        #cc-close-btn:hover {
            background: rgba(239, 68, 68, 1);
            transform: scale(1.1);
        }

        #cc-close-btn.cc-visible {
            display: flex;
        }

        /* Header - User's logo */
        .cc-header {
            background: linear-gradient(to right, #4F46E5, #7C3AED);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            flex-shrink: 0;
            position: relative;
        }

        .cc-header h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cc-header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .cc-logo {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .cc-logo img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        /* Messages area - Hidden scrollbar */
        #cc-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #cc-messages::-webkit-scrollbar {
            display: none;
        }

        /* Message bubbles */
        .cc-message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            animation: fadeInUp 0.3s ease;
        }

        .cc-message.cc-user {
            flex-direction: row-reverse;
        }

        .cc-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .cc-avatar.cc-bot {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
        }

        .cc-avatar.cc-bot img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .cc-avatar.cc-user {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .cc-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .cc-message.cc-bot .cc-bubble {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-radius: 18px 18px 18px 4px;
        }

        .cc-message.cc-user .cc-bubble {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border-radius: 18px 18px 4px 18px;
        }

        /* Timestamp */
        .cc-timestamp {
            font-size: 11px;
            margin-top: 4px;
            opacity: 0.7;
        }

        /* Input area - Menu button on LEFT of typing box with improved spacing */
        .cc-input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e5e7eb;
            flex-shrink: 0;
            display: flex;
            gap: 20px;
            align-items: flex-end;
        }

        /* Menu button - LEFT of input container with better spacing */
        #cc-menu-btn {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            outline: none;
            color: #6b7280;
            flex-shrink: 0;
            margin-right: 8px;
        }

        #cc-menu-btn:hover {
            background: #e5e7eb;
            color: #374151;
        }

        .cc-input-container {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: #f8fafc;
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 8px;
            transition: border-color 0.2s ease;
            flex: 1;
            min-height: 52px;
        }

        .cc-input-container:focus-within {
            border-color: #4F46E5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        #cc-input {
            flex: 1;
            border: none;
            background: transparent;
            padding: 14px 18px;
            font-size: 14px;
            resize: none;
            outline: none;
            font-family: inherit;
            max-height: 100px;
            color: #374151;
            min-height: 22px;
            line-height: 1.4;
        }

        #cc-input::placeholder {
            color: #9ca3af;
        }

        #cc-send-btn {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 18px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            outline: none;
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 48px;
            height: 48px;
        }

        #cc-send-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        #cc-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Menu dropdown */
        .cc-menu-dropdown {
            position: absolute;
            bottom: 60px;
            left: 20px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 8px;
            min-width: 200px;
            z-index: 1000001;
            display: none;
        }

        .cc-menu-dropdown.cc-show {
            display: block;
        }

        .cc-menu-item {
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 14px;
            color: #374151;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cc-menu-item:hover {
            background: #f3f4f6;
            color: #4F46E5;
        }

        /* Action buttons for questions/recommendations */
        .cc-action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .cc-action-btn {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border: 1px solid #cbd5e1;
            border-radius: 20px;
            padding: 8px 14px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #475569;
            font-weight: 500;
        }

        .cc-action-btn:hover {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border-color: #4F46E5;
            transform: translateY(-1px);
        }

        /* Contact links with hover effects */
        .cc-contact-link {
            color: inherit;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-block;
            padding: 2px 4px;
            border-radius: 4px;
        }

        .cc-contact-link:hover {
            background: rgba(79, 70, 229, 0.1);
            color: #4F46E5;
            transform: translateY(-1px);
        }

        .cc-whatsapp-link:hover {
            background: rgba(37, 211, 102, 0.1);
            color: #25D366;
        }

        .cc-email-link:hover {
            background: rgba(234, 67, 53, 0.1);
            color: #EA4335;
        }

        /* Google Maps button styling */
        .cc-maps-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 10px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            text-decoration: none;
        }

        .cc-maps-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Embedded Google Map */
        .cc-embedded-map {
            width: 100%;
            height: 200px;
            border: none;
            border-radius: 8px;
            margin: 10px 0;
        }

        /* Typing indicator */
        .cc-typing {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
        }

        .cc-typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typing 1.4s infinite ease-in-out;
        }

        .cc-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .cc-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        /* Enhanced formatting for COE data - Fixed to match image 2 */
        .coe-category {
            font-weight: bold;
            color: #4F46E5;
        }

        .price-highlight {
            font-weight: bold;
            color: #059669;
        }

        .trend-down {
            color: #10b981;
            font-weight: bold;
        }

        .trend-up {
            color: #ef4444;
            font-weight: bold;
        }

        .emoji-highlight {
            font-size: 16px;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            #cc-chatbot-container {
                width: calc(100vw - 40px);
                height: calc(100vh - 40px);
                bottom: 10px;
                right: 60px;
                border-radius: 15px;
            }

            #cc-toggle, #cc-close-btn {
                bottom: 15px;
                right: 15px;
                width: 55px;
                height: 55px;
            }

            .cc-header {
                padding: 15px;
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            #cc-chatbot-container,
            #cc-toggle,
            .cc-message {
                transition: none;
                animation: none;
            }
        }
    `;

    // User's chatbot logo (from image 2)
    const CHATBOT_LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM0Rjc2RkYiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjQiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjI2IiBjeT0iMjgiIHI9IjMiIGZpbGw9IiM0Rjc2RkYiLz4KPGNpcmNsZSBjeD0iMzgiIGN5PSIyOCIgcj0iMyIgZmlsbD0iIzRGNzZGRiIvPgo8cGF0aCBkPSJNMjQgMzhDMjQgMzggMjggNDIgMzIgNDJDMzYgNDIgNDAgMzggNDAgMzgiIHN0cm9rZT0iIzRGNzZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
    const BOT_AVATAR = CHATBOT_LOGO_BASE64;
    const USER_AVATAR = '👤';

    // Menu options
    const MENU_OPTIONS = [
        { icon: '💰', text: 'COE Prices', action: 'COE Prices' },
        { icon: '🚗', text: 'Vehicle Info', action: 'Vehicle recommendations' },
        { icon: '📅', text: 'Test Drive', action: 'Test Drive' },
        { icon: '🔧', text: 'Maintenance', action: 'Maintenance' },
        { icon: '💳', text: 'Loan Calculator', action: 'Loan calculator' },
        { icon: '📞', text: 'Contact Us', action: 'Contact Us' }
    ];

    // Inject CSS
    function injectCSS() {
        if (document.getElementById('cc-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cc-widget-styles';
        style.textContent = WIDGET_CSS;
        document.head.appendChild(style);
    }

    // Create widget HTML - Updated layout with user's logo
    function createWidget() {
        const widgetHTML = `
            <!-- Toggle Button -->
            <button id="${CONFIG.TOGGLE_ID}" aria-label="Open chat">
                <img src="${CHATBOT_LOGO_BASE64}" alt="CleverCompanion" />
            </button>

            <!-- Close Button -->
            <button id="${CONFIG.CLOSE_ID}" aria-label="Close chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <!-- Chat Container -->
            <div id="${CONFIG.WIDGET_ID}" role="dialog" aria-labelledby="cc-title" aria-describedby="cc-subtitle">
                <div class="cc-header">
                    <h3 id="cc-title">
                        <span class="cc-logo">
                            <img src="${CHATBOT_LOGO_BASE64}" alt="CleverCompanion" />
                        </span>
                        ${currentConfig.title}
                    </h3>
                    <p id="cc-subtitle">${currentConfig.subtitle}</p>
                </div>
                
                <div id="${CONFIG.MESSAGES_ID}" role="log" aria-live="polite" aria-label="Chat messages">
                    <div class="cc-message cc-bot">
                        <div class="cc-avatar cc-bot">
                            <img src="${CHATBOT_LOGO_BASE64}" alt="Bot" />
                        </div>
                        <div class="cc-bubble">
                            ${currentConfig.welcomeMessage}
                            <div class="cc-timestamp">${new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        </div>
                    </div>
                </div>
                
                <div class="cc-input-area">
                    <!-- Menu Button - LEFT of input container -->
                    <button id="${CONFIG.MENU_BTN_ID}" aria-label="Menu">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    
                    <div class="cc-input-container">
                        <textarea 
                            id="${CONFIG.INPUT_ID}" 
                            placeholder="Type your message..." 
                            rows="1"
                            aria-label="Type your message"
                        ></textarea>
                        <button id="${CONFIG.SEND_BTN_ID}" aria-label="Send message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Menu Dropdown -->
                    <div class="cc-menu-dropdown" id="cc-menu-dropdown">
                        ${MENU_OPTIONS.map(option => 
                            `<div class="cc-menu-item" data-action="${option.action}">
                                <span>${option.icon}</span>
                                <span>${option.text}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // Initialize widget
    function initWidget() {
        injectCSS();
        createWidget();
        attachEventListeners();
    }

    // Event listeners
    function attachEventListeners() {
        const toggle = document.getElementById(CONFIG.TOGGLE_ID);
        const closeBtn = document.getElementById(CONFIG.CLOSE_ID);
        const widget = document.getElementById(CONFIG.WIDGET_ID);
        const input = document.getElementById(CONFIG.INPUT_ID);
        const sendBtn = document.getElementById(CONFIG.SEND_BTN_ID);
        const menuBtn = document.getElementById(CONFIG.MENU_BTN_ID);
        const menuDropdown = document.getElementById('cc-menu-dropdown');

        if (toggle) {
            toggle.addEventListener('click', toggleWidget);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeWidget);
        }

        if (input) {
            input.addEventListener('keypress', handleKeyPress);
            input.addEventListener('input', autoResize);
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const message = input.value.trim();
                if (message) {
                    sendMessage(message);
                }
            });
        }

        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('cc-show');
            });

            // Menu item clicks
            menuDropdown.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.cc-menu-item');
                if (menuItem) {
                    const action = menuItem.dataset.action;
                    sendMessage(action);
                    menuDropdown.classList.remove('cc-show');
                }
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menuDropdown && !menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('cc-show');
            }
        });

        // Handle action button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cc-action-btn')) {
                const action = e.target.textContent;
                sendMessage(action);
            }
        });
    }

    function toggleWidget() {
        const widget = document.getElementById(CONFIG.WIDGET_ID);
        const toggle = document.getElementById(CONFIG.TOGGLE_ID);
        const closeBtn = document.getElementById(CONFIG.CLOSE_ID);
        
        if (widget && toggle && closeBtn) {
            if (widget.classList.contains('cc-open')) {
                closeWidget();
            } else {
                openWidget();
            }
        }
    }

    function openWidget() {
        const widget = document.getElementById(CONFIG.WIDGET_ID);
        const toggle = document.getElementById(CONFIG.TOGGLE_ID);
        const closeBtn = document.getElementById(CONFIG.CLOSE_ID);
        
        if (widget && toggle && closeBtn) {
            widget.classList.add('cc-open');
            toggle.style.display = 'none';
            closeBtn.classList.add('cc-visible');
            
            // Focus input
            setTimeout(() => {
                const input = document.getElementById(CONFIG.INPUT_ID);
                if (input) input.focus();
            }, 300);
        }
    }

    function closeWidget() {
        const widget = document.getElementById(CONFIG.WIDGET_ID);
        const toggle = document.getElementById(CONFIG.TOGGLE_ID);
        const closeBtn = document.getElementById(CONFIG.CLOSE_ID);
        
        if (widget && toggle && closeBtn) {
            widget.classList.remove('cc-open');
            toggle.style.display = 'flex';
            closeBtn.classList.remove('cc-visible');
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = document.getElementById(CONFIG.INPUT_ID);
            if (input) {
                const message = input.value.trim();
                if (message) {
                    sendMessage(message);
                }
            }
        }
    }

    function autoResize() {
        const input = document.getElementById(CONFIG.INPUT_ID);
        if (input) {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        }
    }

    async function sendMessage(text) {
        const input = document.getElementById(CONFIG.INPUT_ID);
        const sendBtn = document.getElementById(CONFIG.SEND_BTN_ID);
        
        if (!text.trim()) return;

        // Add user message
        addMessage(text, 'user');
        
        // Clear input and disable send button
        if (input) input.value = '';
        if (sendBtn) sendBtn.disabled = true;
        
        // Show typing indicator
        showTypingIndicator();

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: `user_${Date.now()}`,
                    message: text
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // COMBINE ALL RESPONSES INTO SINGLE MESSAGE
                if (data && data.length > 0) {
                    const combinedText = data
                        .filter(item => item.text)
                        .map(item => item.text)
                        .join('\n\n');
                    
                    if (combinedText) {
                        addMessage(combinedText, 'bot');
                    } else {
                        addMessage('I understand your message, but I\'m not sure how to respond right now.', 'bot');
                    }
                } else {
                    addMessage('I apologize, but I\'m having trouble understanding your request. Could you please try rephrasing?', 'bot');
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage('I\'m experiencing technical difficulties. Please try again in a moment.', 'bot');
        } finally {
            hideTypingIndicator();
            if (sendBtn) sendBtn.disabled = false;
            autoResize();
        }
    }

    function addMessage(text, sender) {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (!messagesContainer) return;

        const avatar = sender === 'bot' ? `<img src="${CHATBOT_LOGO_BASE64}" alt="Bot" />` : USER_AVATAR;
        const timestamp = new Date().toLocaleTimeString('en-SG', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        const formattedText = formatMessage(text);
        const actionButtons = extractActionButtons(text);

        const messageHTML = `
            <div class="cc-message cc-${sender}">
                <div class="cc-avatar cc-${sender}">${avatar}</div>
                <div class="cc-bubble">
                    ${formattedText}
                    ${actionButtons}
                    <div class="cc-timestamp">${timestamp}</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        scrollToBottom();
    }

    function formatMessage(text) {
        // Enhanced formatting with CORRECT trend arrows matching image 2
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/•/g, '&bull;')
            .replace(/\n/g, '<br>')
            .replace(/(CAT [ABCE]|Category [ABCE])/g, '<span class="coe-category">$1</span>')
            .replace(/\$([0-9,]+)/g, '<span class="price-highlight">$$$1</span>')
            .replace(/(⬇️|⬆️|📈|📊|💰|🚗|🔧|📞)/g, '<span class="emoji-highlight">$1</span>')
            // FIXED: Green down arrows for decreases (matching image 2)
            .replace(/🟢↘\s*-\$([0-9,]+)/g, '<span class="trend-down">🟢↘ -$$1</span>')
            .replace(/🔴↗\s*\+\$([0-9,]+)/g, '<span class="trend-up">🔴↗ +$$1</span>')
            // Fix Google Maps to embedded map + button format
            .replace(/GOOGLE_MAPS:([^\s]+)/g, (match, url) => {
                const embedUrl = url.replace('/maps/place/', '/maps/embed?pb=');
                return `<iframe src="${embedUrl}" class="cc-embedded-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a href="${url}" target="_blank" class="cc-maps-btn">📍 View on Google Maps</a>`;
            })
            // Format contact information with hover effects
            .replace(/WhatsApp:\s*\+65\s*([0-9\s]+)/g, '<a href="https://wa.me/65$1" target="_blank" class="cc-contact-link cc-whatsapp-link">📱 WhatsApp: +65 $1</a>')
            .replace(/Call:\s*\+65\s*([0-9\s]+)/g, '<a href="tel:+65$1" class="cc-contact-link">📞 Call: +65 $1</a>')
            .replace(/Email:\s*([^\s]+)/g, '<a href="mailto:$1" class="cc-contact-link cc-email-link">📧 Email: $1</a>');
    }

    function extractActionButtons(text) {
        const buttons = [];
        
        // Extract questions and recommendations for action buttons
        if (text.includes('Would you like') || text.includes('recommendations') || text.includes('financing options')) {
            if (text.includes('vehicle recommendations')) {
                buttons.push('Vehicle recommendations');
            }
            if (text.includes('financing options')) {
                buttons.push('Financing options');
            }
            if (text.includes('loan calculator')) {
                buttons.push('Loan calculator');
            }
        }
        
        if (text.includes('What would you like to know') || text.includes('How can I help')) {
            buttons.push('COE Prices', 'Test Drive', 'Vehicle Info');
        }

        if (buttons.length > 0) {
            return `<div class="cc-action-buttons">
                ${buttons.map(btn => `<button class="cc-action-btn">${btn}</button>`).join('')}
            </div>`;
        }
        
        return '';
    }

    function showTypingIndicator() {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (!messagesContainer) return;

        const typingHTML = `
            <div class="cc-message cc-bot cc-typing-message">
                <div class="cc-avatar cc-bot">
                    <img src="${CHATBOT_LOGO_BASE64}" alt="Bot" />
                </div>
                <div class="cc-bubble">
                    <div class="cc-typing">
                        <div class="cc-typing-dot"></div>
                        <div class="cc-typing-dot"></div>
                        <div class="cc-typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typingMessage = document.querySelector('.cc-typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    function scrollToBottom() {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Global functions for external access
    window.CleverCompanionWidget = {
        init: initWidget,
        open: openWidget,
        close: closeWidget,
        sendMessage: sendMessage
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})(); 