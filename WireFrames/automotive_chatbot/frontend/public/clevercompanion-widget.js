/**
 * CleverCompanion Chatbot Widget - FIXED ALL ISSUES
 * PROBLEM 1 FIX: Using PNG logo instead of SVG
 * PROBLEM 2 FIX: Fixed double-click issue with proper debouncing
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

    // PROBLEM 1 & 2 FIX: Using PNG logo with proper path and styling
    const CHATBOT_LOGO_URL = './media/images/CleverCompanion-logo.png';

    // User avatar - Using boy.png as requested
    const USER_AVATAR = `<img src="./media/images/boy.png" alt="User" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">`;

    // Menu options
    const MENU_OPTIONS = [
        { icon: '💰', text: 'COE Prices', action: 'COE Prices' },
        { icon: '🚗', text: 'Vehicle Info', action: 'Vehicle Info' },
        { icon: '📅', text: 'Test Drive', action: 'Test Drive' },
        { icon: '🔧', text: 'Maintenance', action: 'Maintenance' },
        { icon: '💳', text: 'Loan Calculator', action: 'Loan Calculator' },
        { icon: '📞', text: 'Contact Us', action: 'Contact Us' }
    ];

    // PROBLEM 3 FIX: Simplified event management - removed cooldown
    let isProcessing = false;

    // Comprehensive CSS - Fixed positioning and styling
    const WIDGET_CSS = `
        /* Widget Container - Shifted more left with close button */
        #cc-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 90px;
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
            background: white;
            border: 3px solid #4F46E5;
            cursor: pointer;
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
            transition: all 0.3s ease;
            outline: none;
            font-size: 24px;
            color: white;
            overflow: hidden;
        }

        #cc-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(79, 70, 229, 0.5);
        }

        #cc-toggle img {
            width: 50px;
            height: 50px;
            border-radius: 6px;
            object-fit: contain;
            padding: 2px;
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

        /* Header - PROBLEM 2 FIX: Improved header design */
        .cc-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            width: 50px;
            height: 50px;
            border-radius: 6px;
            background: white;
            border: 2px solid #4F46E5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2px;
        }

        .cc-logo img {
            width: 90%;
            height: 90%;
            border-radius: 6px;
            object-fit: contain;
        }

        /* Messages area - Hidden scrollbar */
        #cc-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
            display: flex;
            flex-direction: column;
            gap: 16px;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #cc-messages::-webkit-scrollbar {
            display: none;
        }

        /* Message bubbles */
        .cc-message {
            display: flex;
            gap: 12px;
            animation: messageSlideIn 0.3s ease-out;
            align-items: flex-end;
        }

        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
            border: 2px solid #E5E7EB;
        }

        .cc-avatar.cc-bot {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border-color: #4F46E5;
        }

        .cc-avatar.cc-bot img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            background-color: #FFFFFF;
        }

        .cc-avatar.cc-user {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-color: #10b981;
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
            color: #9CA3AF;
            font-weight: 500;
        }

        /* PROBLEM 6 FIX: Make user timestamp more visible */
        .cc-message.cc-user .cc-timestamp {
            text-align: right;
            color: #E5E7EB;
            font-weight: 600;
            opacity: 0.9;
        }

        /* Input area - PROBLEM 4 FIX: Add proper form field IDs and names */
        .cc-input-area {
            padding: 12px 16px;
            background: white;
            border-top: 1px solid #e5e7eb;
            flex-shrink: 0;
            display: flex;
            gap: 8px;
            align-items: center;
            min-height: 56px;
        }

        /* Menu button - PROBLEM 1 FIX: Smaller size and reduced spacing */
        #cc-menu-btn {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            outline: none;
            color: #6b7280;
            flex-shrink: 0;
        }

        #cc-menu-btn:hover {
            background: #e5e7eb;
            color: #374151;
        }

        .cc-input-container {
            display: flex;
            gap: 8px;
            align-items: center;
            background: #f8fafc;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 4px 6px;
            transition: border-color 0.2s ease;
            flex: 1;
            min-height: 36px;
        }

        .cc-input-container:focus-within {
            border-color: #4F46E5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        #cc-input {
            flex: 1;
            border: none;
            background: transparent;
            padding: 8px 12px;
            font-size: 14px;
            resize: none;
            outline: none;
            font-family: inherit;
            max-height: 80px;
            color: #374151;
            min-height: 20px;
            line-height: 1.4;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #cc-input::-webkit-scrollbar {
            display: none;
        }

        #cc-input::placeholder {
            color: #9ca3af;
        }

        /* PROBLEM 2 FIX: New arrow style matching Image 3 */
        #cc-send-btn {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.2s ease;
            outline: none;
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            height: 36px;
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

        /* Action buttons for questions/recommendations - FIXED */
        .cc-action-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 12px;
        }

        .cc-action-btn {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #475569;
            font-weight: 500;
            text-align: left;
            width: 100%;
            display: block;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .cc-action-btn:hover {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            border-color: #4F46E5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        /* Typing indicator with animation */
        .cc-typing-indicator {
            display: none;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: white;
            border-radius: 18px 18px 18px 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            margin-bottom: 15px;
            animation: fadeInUp 0.3s ease;
            width: fit-content;
        }

        .cc-typing-indicator.cc-show {
            display: flex;
        }

        .cc-typing {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .cc-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #94a3b8;
            animation: typing 1.4s infinite ease-in-out;
        }

        .cc-typing-dot:nth-child(1) { animation-delay: 0s; }
        .cc-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .cc-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            #cc-chatbot-container {
                right: 10px;
                width: calc(100vw - 100px);
                height: calc(100vh - 40px);
            }

            #cc-toggle, #cc-close-btn {
                right: 10px;
            }
        }

        /* Professional contact layout - PROBLEM 4 FIX */
        .cc-contact-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 16px;
            margin: 12px 0;
            }

        .cc-contact-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        .cc-contact-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
        }

        .cc-contact-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }

        .cc-contact-info {
            display: grid;
            gap: 12px;
        }

        .cc-contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #f1f5f9;
            transition: all 0.2s ease;
            }

        .cc-contact-item:hover {
            background: #f8fafc;
            border-color: #4F46E5;
            transform: translateX(4px);
        }

        .cc-contact-item-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            flex-shrink: 0;
        }

        .cc-contact-item-text {
            flex: 1;
            font-size: 14px;
            color: #374151;
            font-weight: 500;
        }

        .cc-hours-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 12px;
        }

        .cc-hours-item {
            display: flex;
            justify-content: space-between;
            padding: 6px 8px;
            background: white;
            border-radius: 6px;
            font-size: 12px;
        }

        .cc-hours-day {
            font-weight: 600;
            color: #1e293b;
        }

        .cc-hours-time {
            color: #64748b;
        }

        /* PROBLEM 6 FIX: Loan calculator DISABLED - Hidden completely */
        .cc-loan-calculator {
            display: none !important; /* Calculator completely disabled */
        }

        .cc-loan-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .cc-loan-title {
            font-size: 18px;
            font-weight: 700;
            color: #0c4a6e;
            margin: 0 0 8px 0;
        }

        .cc-loan-subtitle {
            font-size: 14px;
            color: #0369a1;
            margin: 0;
        }

        .cc-loan-form {
            display: grid;
            gap: 16px;
        }

        .cc-form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .cc-form-label {
            font-size: 13px;
            font-weight: 600;
            color: #0c4a6e;
        }

        .cc-form-input {
            padding: 12px;
            border: 2px solid #bae6fd;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            transition: border-color 0.2s ease;
        }

        .cc-form-input:focus {
            border-color: #0ea5e9;
            outline: none;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .cc-form-select {
            padding: 12px;
            border: 2px solid #bae6fd;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
        }

        .cc-calculate-btn {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 8px;
        }

        .cc-calculate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
        }

        .cc-loan-result {
            background: white;
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 16px;
            margin-top: 16px;
            text-align: center;
        }

        .cc-result-amount {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 8px;
        }

        .cc-result-details {
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
        }
    `;



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
                <img src="${CHATBOT_LOGO_URL}" alt="CleverCompanion" />
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
                            <img src="${CHATBOT_LOGO_URL}" alt="CleverCompanion" />
                        </span>
                        ${currentConfig.title}
                    </h3>
                    <p id="cc-subtitle">${currentConfig.subtitle}</p>
                </div>
                
                <div id="${CONFIG.MESSAGES_ID}" role="log" aria-live="polite" aria-label="Chat messages">
                    <div class="cc-message cc-bot">
                        <div class="cc-avatar cc-bot">
                            <img src="${CHATBOT_LOGO_URL}" alt="Bot" />
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
                            name="chatInput"
                            placeholder="Type your message..." 
                            rows="1"
                            aria-label="Type your message"
                            autocomplete="off"
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

        // PROBLEM 3 FIX: Handle action button clicks without double processing
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cc-action-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                if (isProcessing) return; // Simple processing check
                
                const action = e.target.textContent;
                handleActionButton(action);
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
            // PROBLEM 8 FIX: Enhanced fetch with timeout and better error handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    sender: `user_${Date.now()}`,
                    message: text
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                
                // PROBLEM 4 FIX: COMBINE ALL RESPONSES INTO SINGLE MESSAGE  
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            // PROBLEM 6 FIX: Remove console logs
            
            if (error.name === 'AbortError') {
                addMessage('Request timed out. Please check your connection and try again.', 'bot');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                // PROBLEM 2 FIX: Professional connection error message
                addMessage('🔧 **Service Temporarily Unavailable**\n\nOur chat service is currently undergoing maintenance. Please try one of these alternatives:\n\n📞 **Call us directly:** +65 6234 5678\n📧 **Email us:** info@clevercompanion.sg\n📱 **WhatsApp:** +65 9876 5432\n\n⏰ **Service hours:** Mon-Fri 9AM-7PM, Sat 9AM-6PM\n\nWe apologize for the inconvenience and will be back online shortly.', 'bot');
            } else {
                addMessage('I\'m experiencing technical difficulties. Please try again in a moment.', 'bot');
            }
        } finally {
            hideTypingIndicator();
            if (sendBtn) sendBtn.disabled = false;
            autoResize();
        }
    }

    function addMessage(text, sender) {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (!messagesContainer) return;

        const avatar = sender === 'bot' ? `<img src="${CHATBOT_LOGO_URL}" alt="Bot" />` : USER_AVATAR;
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
        
        // PROBLEM 5 FIX: Auto-scroll to show latest bot response at the top of visible area
        if (sender === 'bot') {
            // Small delay to ensure content is rendered before scrolling
            setTimeout(() => {
                scrollToLatestBotMessage();
            }, 100);
        } else {
            scrollToBottom();
        }
    }

    function formatMessage(text) {
        // PROBLEM 1 FIX: Remove number formatting - show clean numbers
        let formattedText = text
            .replace(/LOAN_CALCULATOR_START/g, '')
            .replace(/LOAN_CALCULATOR_END/g, '')
            .replace(/BUTTON_OPTIONS_START[\s\S]*?BUTTON_OPTIONS_END/g, '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/•/g, '&bull;')
            .replace(/\n/g, '<br>')
            .replace(/(CAT [ABCE]|Category [ABCE])/g, '<span class="coe-category">$1</span>')
            // PROBLEM 1 FIX: Keep clean numbers without dollar signs and commas
            .replace(/\$([0-9,]+)/g, '$1')
            .replace(/(⬇️|⬆️|📈|📊|💰|🚗|🔧|📞)/g, '<span class="emoji-highlight">$1</span>')
            // Fixed: Green down arrows for decreases (matching image 2)
            .replace(/🟢↘\s*-\$([0-9,]+)/g, '<span class="trend-down">🟢↘ -$1</span>')
            .replace(/🔴↗\s*\+\$([0-9,]+)/g, '<span class="trend-up">🔴↗ +$1</span>')
            // Fix Google Maps to embedded map + button format
            .replace(/GOOGLE_MAPS:([^\s]+)/g, (match, url) => {
                const embedUrl = url.replace('/maps/place/', '/maps/embed?pb=');
                return `<iframe src="${embedUrl}" class="cc-embedded-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a href="${url}" target="_blank" class="cc-maps-btn">📍 View on Google Maps</a>`;
            })
            // Format contact information with hover effects
            .replace(/WhatsApp:\s*\+65\s*([0-9\s]+)/g, '<a href="https://wa.me/65$1" target="_blank" class="cc-contact-link cc-whatsapp-link">📱 WhatsApp: +65 $1</a>')
            .replace(/Call:\s*\+65\s*([0-9\s]+)/g, '<a href="tel:+65$1" class="cc-contact-link">📞 Call: +65 $1</a>')
            .replace(/Email:\s*([^\s]+)/g, '<a href="mailto:$1" class="cc-contact-link cc-email-link">📧 Email: $1</a>');
        
        return formattedText;
    }

    function extractActionButtons(text) {
        let buttonsHTML = '';
        
        // PROBLEM 5&6 FIX: Enhanced button extraction for new pipe-separated format
        
        // Extract pipe-separated buttons (new format)
        const pipePattern = /([🔧🚗💰📞🛠️🚙🚛🚚📅💳📍📧🗺️💬🧽🔋]+\s*[^|]+)/g;
        const buttons = [];
        let match;
        
        while ((match = pipePattern.exec(text)) !== null) {
            const buttonText = match[1].trim();
            if (buttonText && !buttonText.includes('\n') && buttonText.length < 50) {
                buttons.push(buttonText);
            }
        }
        
        // Old BUTTON_OPTIONS format
        const buttonMatch = text.match(/BUTTON_OPTIONS_START([\s\S]*?)BUTTON_OPTIONS_END/);
        if (buttonMatch) {
            const buttonSection = buttonMatch[1];
            const buttonLines = buttonSection.split('\n').filter(line => line.trim() && line.includes('|'));
            
            buttonLines.forEach(line => {
                const [label, action] = line.split('|').map(s => s.trim());
                if (label && action) {
                    buttons.push(label);
                }
            });
        }
        
        // Legacy support for simple buttons
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

        // PROBLEM 5 FIX: Create enhanced buttons with shadows and borders
        if (buttons.length > 0) {
            const uniqueButtons = [...new Set(buttons)]; // Remove duplicates
            const buttonElements = uniqueButtons.map(btn => 
                `<button class="cc-action-btn" onclick="handleActionButton('${btn.replace(/'/g, "\\\'")}')">${btn}</button>`
            ).join('');
            
            buttonsHTML = `<div class="cc-action-buttons">${buttonElements}</div>`;
        }
        
        return buttonsHTML;
    }

    function showTypingIndicator() {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (!messagesContainer) return;

        // Remove existing typing indicator
        hideTypingIndicator();

        // PROBLEM 3 FIX: Create proper typing indicator structure
        const typingHTML = `
            <div class="cc-message cc-bot cc-typing-message">
                <div class="cc-avatar cc-bot">
                    <img src="${CHATBOT_LOGO_URL}" alt="Bot" />
                </div>
                <div class="cc-typing-indicator cc-show">
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

    // PROBLEM 2 FIX: Comprehensive double-click prevention system
    function handleActionButton(action) {
        // PROBLEM 6 FIX: Remove console logs
        
        // PROBLEM 3 & 4 FIX: Simplified processing with direct actions
        if (isProcessing) {
            return;
        }
        
        isProcessing = true;
        
        try {
            // PROBLEM 4 FIX: Handle direct actions without sending messages
            switch (action.toLowerCase()) {
                case 'whatsapp':
                    window.open('https://wa.me/6598765432', '_blank');
                    break;
                case 'call':
                    window.open('tel:+6562345678', '_self');
                    break;
                case 'email':
                    window.open('mailto:info@clevercompanion.sg', '_blank');
                    break;
                case 'google.com':
                case 'maps.google.com':
                case '🗺️ get directions':
                case '📍 view on google maps':
                case 'view on google maps':
                    window.open('https://www.google.com/maps/search/CleverCompanion+Auto+Showroom+Singapore/@1.3521,103.8198,17z', '_blank');
                    break;
                default:
                    sendMessage(action).finally(() => {
                        isProcessing = false;
                    });
            }
            
        } catch (error) {
            console.error('Error in action button handler:', error);
            isProcessing = false;
        }
    }
    
    // Helper function to reset button states
    function resetButtonState() {
        setTimeout(() => {
            isProcessing = false;
            const actionButtons = document.querySelectorAll('.cc-action-btn');
            actionButtons.forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
                btn.style.transform = 'scale(1)';
                btn.textContent = btn.textContent.replace(' ⏳', '');
            });
        }, ACTION_COOLDOWN);
    }

    // PROBLEM 2 FIX: Enhanced scroll behavior - show typing at visible area
    function scrollToBottom() {
        // Always scroll for user messages
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (messagesContainer) {
            const messages = messagesContainer.querySelectorAll('.cc-message');
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.classList.contains('cc-user')) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    // PROBLEM 5 FIX: New function to scroll to latest bot message top
    function scrollToLatestBotMessage() {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (messagesContainer) {
            const botMessages = messagesContainer.querySelectorAll('.cc-message.cc-bot');
            const latestBotMessage = botMessages[botMessages.length - 1];
            if (latestBotMessage) {
                const containerTop = messagesContainer.scrollTop;
                const messageTop = latestBotMessage.offsetTop;
                const containerHeight = messagesContainer.clientHeight;
                
                // Scroll to show the latest bot message at the top of visible area
                messagesContainer.scrollTop = messageTop - 20; // 20px padding from top
            }
        }
    }

    function scrollToTop() {
        const messagesContainer = document.getElementById(CONFIG.MESSAGES_ID);
        if (messagesContainer) {
            messagesContainer.scrollTop = 0;
        }
    }

    // PROBLEM 3 FIX: Add calculateLoan function globally
    function calculateLoan() {
        // Create unique IDs to avoid duplicates
        const timestamp = Date.now();
        const carPrice = parseFloat(document.getElementById('carPrice')?.value || document.querySelector(`input[placeholder*="80000"]`)?.value) || 0;
        const downPaymentPercent = parseFloat(document.getElementById('downPayment')?.value || document.querySelector('select option:checked')?.value) || 20;
        const loanTenure = parseFloat(document.getElementById('loanTenure')?.value || 4);
        const interestRate = parseFloat(document.getElementById('interestRate')?.value || 2.78);
        
        if (carPrice <= 0) {
            alert('Please enter a valid car price');
            return;
        }
        
        const downPayment = (carPrice * downPaymentPercent) / 100;
        const loanAmount = carPrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTenure * 12;
        
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        const totalPayment = monthlyPayment * numPayments;
        const totalInterest = totalPayment - loanAmount;
        
        const resultElement = document.getElementById('loanResult') || document.querySelector('[id*="loanResult"]');
        const monthlyElement = document.getElementById('monthlyPayment') || document.querySelector('[id*="monthlyPayment"]');
        const detailsElement = document.getElementById('loanDetails') || document.querySelector('[id*="loanDetails"]');
        
        if (monthlyElement) {
            monthlyElement.textContent = 'SGD $' + monthlyPayment.toFixed(2) + '/month';
        }
        if (detailsElement) {
            detailsElement.innerHTML = 
                'Car Price: SGD $' + carPrice.toLocaleString() + '<br>' +
                'Down Payment: SGD $' + downPayment.toLocaleString() + ' (' + downPaymentPercent + '%)<br>' +
                'Loan Amount: SGD $' + loanAmount.toLocaleString() + '<br>' +
                'Total Interest: SGD $' + totalInterest.toLocaleString() + '<br>' +
                'Total Payment: SGD $' + totalPayment.toLocaleString();
        }
        if (resultElement) {
            resultElement.style.display = 'block';
        }
    }
    
    // PROBLEM 12 FIX: Add missing calculateLoanSpecific function
    function calculateLoanSpecific(timestamp) {
        const carPrice = parseFloat(document.getElementById('carPrice_' + timestamp).value) || 0;
        const downPaymentPercent = parseFloat(document.getElementById('downPayment_' + timestamp).value) || 20;
        const loanTenure = parseFloat(document.getElementById('loanTenure_' + timestamp).value) || 4;
        const interestRateSelect = document.getElementById('interestRate_' + timestamp);
        
        let interestRate;
        if (interestRateSelect && interestRateSelect.value === 'custom') {
            const customRate = parseFloat(document.getElementById('customRateInput_' + timestamp).value);
            if (!customRate || customRate <= 0) {
                alert('Please enter a valid custom interest rate');
                return;
            }
            interestRate = customRate;
        } else {
            interestRate = parseFloat(interestRateSelect?.value) || 2.78;
        }
        
        if (carPrice <= 0) {
            alert('Please enter a valid car price');
            return;
        }
        
        const downPayment = (carPrice * downPaymentPercent) / 100;
        const loanAmount = carPrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTenure * 12;
        
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        const totalPayment = monthlyPayment * numPayments;
        const totalInterest = totalPayment - loanAmount;
        
        const monthlyElement = document.getElementById('monthlyPayment_' + timestamp);
        const detailsElement = document.getElementById('loanDetails_' + timestamp);
        const resultElement = document.getElementById('loanResult_' + timestamp);
        
        if (monthlyElement) {
            monthlyElement.textContent = 'SGD $' + monthlyPayment.toFixed(2) + '/month';
        }
        if (detailsElement) {
            detailsElement.innerHTML = 
                'Car Price: SGD $' + carPrice.toLocaleString() + '<br>' +
                'Down Payment: SGD $' + downPayment.toLocaleString() + ' (' + downPaymentPercent + '%)<br>' +
                'Loan Amount: SGD $' + loanAmount.toLocaleString() + '<br>' +
                'Total Interest: SGD $' + totalInterest.toLocaleString() + '<br>' +
                'Total Payment: SGD $' + totalPayment.toLocaleString();
        }
        if (resultElement) {
            resultElement.style.display = 'block';
        }
    }

    function toggleCustomRate(timestamp) {
        const select = document.getElementById('interestRate_' + timestamp);
        const customInput = document.getElementById('customRateInput_' + timestamp);
        
        if (select && customInput) {
            if (select.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        }
    }

    // Make functions globally accessible for onclick handlers
    window.handleActionButton = handleActionButton;
    window.calculateLoan = calculateLoan;
    window.calculateLoanSpecific = calculateLoanSpecific;
    window.toggleCustomRate = toggleCustomRate;

    // Global functions for external access
    window.CleverCompanionWidget = {
        init: initWidget,
        open: openWidget,
        close: closeWidget,
        sendMessage: sendMessage,
        calculateLoan: calculateLoan,
        calculateLoanSpecific: calculateLoanSpecific
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})(); 