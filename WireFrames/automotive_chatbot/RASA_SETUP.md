# Rasa Setup and Training Guide

## 🤖 About Rasa in This Project

Rasa is the conversational AI engine that handles:
- Natural Language Understanding (NLU)
- Dialogue Management
- Response Generation
- Custom Actions for automotive queries

## 📋 Quick Setup

### 1. Install Rasa
```bash
# Activate virtual environment first
.venv\Scripts\activate

# Install Rasa
pip install rasa

# Install additional dependencies
pip install rasa-sdk
```

### 2. Train the Model
```bash
cd backend
rasa train
```

### 3. Start Rasa Server
```bash
# For development
rasa run --enable-api --cors "*" --port 5005

# Or use the npm script
npm run dev:rasa
```

## 📚 Training Data Overview

The project includes pre-configured training data:

### `backend/data/nlu.yml`
- Contains intents and example phrases
- Covers automotive topics: car prices, features, maintenance
- Includes greetings, goodbyes, and common queries

### `backend/data/stories.yml`
- Defines conversation flows
- Maps user intents to bot responses
- Handles multi-turn conversations

### `backend/data/rules.yml`
- Fixed response patterns
- Fallback handling
- Simple Q&A pairs

### `backend/domain.yml`
- Defines the chatbot's universe
- Lists all intents, entities, responses
- Configures actions and forms

### `backend/config.yml`
- Rasa pipeline configuration
- NLU and dialogue policies
- Language model settings

## 🔄 Retraining the Model

When you modify training data:

```bash
cd backend
rasa train --force
```

The trained model will be saved in `backend/models/`

## 📝 Should You Push Training Data to GitHub?

**YES, absolutely!** Here's what to include:

### ✅ Include in Git:
- `backend/data/*.yml` - Training data files
- `backend/domain.yml` - Domain configuration
- `backend/config.yml` - Pipeline configuration
- `backend/credentials.yml` - API credentials template
- `backend/endpoints.yml` - Endpoint configurations

### ❌ Exclude from Git:
- `backend/models/` - Trained models (large binary files)
- Add this to `.gitignore`:

```gitignore
# Rasa trained models
backend/models/
.rasa/
```

## 🚀 Production Deployment

For production, you can:

1. **Train once, deploy everywhere:**
   ```bash
   rasa train
   # Upload model to cloud storage
   # Download and load in production
   ```

2. **Auto-train in CI/CD:**
   ```yaml
   # GitHub Actions example
   - name: Train Rasa Model
     run: |
       cd backend
       rasa train
       # Deploy trained model
   ```

## 🛠️ Customizing Training Data

### Adding New Intents
1. Edit `backend/data/nlu.yml`
2. Add examples for your new intent
3. Update `backend/domain.yml` with the intent
4. Add responses in `backend/domain.yml`
5. Create stories in `backend/data/stories.yml`
6. Retrain: `rasa train`

### Example - Adding "book_test_drive" intent:

```yaml
# In nlu.yml
- intent: book_test_drive
  examples: |
    - I want to book a test drive
    - Can I schedule a test drive for tomorrow?
    - Book test drive for [Toyota Camry](car_model)

# In domain.yml
intents:
  - book_test_drive

responses:
  utter_book_test_drive:
  - text: "I'd be happy to help you book a test drive! Which car are you interested in?"

# In stories.yml
- story: test drive booking
  steps:
  - intent: book_test_drive
  - action: utter_book_test_drive
```

## 🔧 Troubleshooting

### Model Training Fails
```bash
# Check data validation
rasa data validate

# Train with debug output
rasa train --debug
```

### Server Won't Start
```bash
# Check if port is available
netstat -an | findstr :5005

# Try different port
rasa run --port 5006
```

### API Integration Issues
Make sure your backend FastAPI can connect to Rasa:
```python
# In backend/api/routes/chatbots.py
RASA_URL = "http://localhost:5005"
```

## 📊 Monitoring and Analytics

Rasa provides conversation tracking. Enable it in `endpoints.yml`:

```yaml
tracker_store:
  type: mongod
  url: mongodb://localhost:27017
  db: automotive_chatbot
  collection: conversations
```

This will store all conversations in MongoDB for analytics.

## 🎯 Next Steps

1. Install Rasa: `pip install rasa`
2. Train initial model: `cd backend && rasa train`
3. Test the chatbot: `rasa shell`
4. Start API server: `rasa run --enable-api`
5. Integrate with frontend via FastAPI backend

Your training data is ready to use - just install Rasa and train! 