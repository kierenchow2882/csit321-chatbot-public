# 📁 Project Structure Reference

## **🎯 Quick Navigation Guide**

### **🔧 Backend (Python)**
```
backend/
├── rasa/                    # All RASA configs (consolidated)
├── data/                    # Training data
├── tests/                   # RASA tests
├── actions/                 # RASA custom actions
├── models/                  # Trained models
└── api/                     # FastAPI (BCE pattern)
    ├── boundaries/          # 🌐 HTTP interfaces
    ├── controllers/         # 🎯 Business logic
    └── entities/            # 🗄️ Database access
```

### **🎨 Frontend (React)**
```
frontend/
└── src/
    ├── components/          # React components
    ├── pages/              # Page components
    ├── services/           # API calls
    ├── styles/             # CSS files
    └── config/             # Configuration
```

---

## **📋 File Purpose Explanation**

### **Backend Files**

#### **RASA Configuration (`/rasa/`)**
- `config.yml` - ML pipeline (tokenizer, classifiers, policies)
- `domain.yml` - Intents, entities, responses, actions
- `endpoints.yml` - Action server and tracker store configuration
- `credentials.yml` - Channel configuration (REST, Slack, etc.)

#### **Training Data (`/data/`)**
- `nlu.yml` - Natural Language Understanding examples
- `stories.yml` - Conversation training scenarios  
- `rules.yml` - Conversation rules and patterns
- `*.xlsx` - Business data (vehicles, schedules)

#### **API Layer (`/api/`)**

**🌐 Boundaries** (HTTP Interface):
- `chatbots.py` - Chatbot management endpoints
- `users.py` - User authentication endpoints
- `admin.py` - Admin management endpoints
- `analytics.py` - Analytics tracking endpoints
- `widget_api.py` - Chat widget endpoints

**🎯 Controllers** (Business Logic):
- `chatbot_controller.py` - Chatbot business rules
- `user_controller.py` - User management logic
- `admin_controller.py` - RASA training orchestration
- `analytics_controller.py` - Analytics processing
- `coe_controller.py` - COE data processing

**🗄️ Entities** (Data Access):
- `chatbot_entity.py` - Chatbot database operations
- `user_entity.py` - User database operations
- `admin_entity.py` - File operations for RASA
- `analytics_entity.py` - Analytics database operations

### **Frontend Files**

#### **Components (`/components/`)**
- `ChatInterface.tsx` - Main chat component
- `EmbeddableWidget.tsx` - Embeddable chat widget
- `DemoButton.tsx` - Demo functionality

#### **Pages (`/pages/`)**
- `page.tsx` - Homepage component
- `layout.tsx` - Layout wrapper

#### **Services (`/services/`)**
- `chatbot-api.ts` - Chatbot API communication
- `auth-api.ts` - Authentication API calls
- `analytics-api.ts` - Analytics API calls

#### **Configuration**
- `config.ts` - API endpoints and settings
- `constants.ts` - Application constants
- `types.ts` - TypeScript type definitions

---

## **🎯 Quick Development Reference**

### **Adding New Feature**

1. **Backend (BCE)**:
   - Create entity: `new_feature_entity.py`
   - Create controller: `new_feature_controller.py`
   - Create boundary: `new_feature.py`
   - Update `main.py` router includes

2. **Frontend**:
   - Create API service: `new-feature-api.ts`
   - Create component: `NewFeatureComponent.tsx`
   - Add to pages if needed

### **RASA Training**
- Edit training data in `/data/`
- Run: `python -m rasa train --force`
- New model appears in `/models/`

### **Database Operations**
- All MongoDB ops go in entities
- Business logic goes in controllers
- HTTP handling goes in boundaries

---

## **🔍 Key Principles**

### **Backend BCE Rules**:
- **Boundaries**: Only HTTP concerns, delegate everything
- **Controllers**: Only business logic, no DB/HTTP
- **Entities**: Only data access, no business logic

### **Frontend Rules**:
- **Components**: UI rendering and user interaction
- **Services**: API communication only
- **Pages**: Route-level components

### **RASA Integration**:
- Custom actions in `/actions/` (separate from API)
- Training data in `/data/` (separate from RASA configs)
- All configs consolidated in `/rasa/`

---

*📁 This structure ensures clear separation of concerns and maintainable code.* 