from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
import yaml
import json
import os
from pathlib import Path
import shutil
from datetime import datetime
import logging
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models
class StoryModel(BaseModel):
    story_name: str
    steps: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]] = None

class RuleModel(BaseModel):
    rule_name: str
    steps: List[Dict[str, Any]]
    condition: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class IntentModel(BaseModel):
    intent_name: str
    examples: List[str]
    metadata: Optional[Dict[str, Any]] = None

class ResponseModel(BaseModel):
    response_name: str
    templates: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]] = None

class EntityModel(BaseModel):
    entity_name: str
    values: List[Dict[str, str]]
    metadata: Optional[Dict[str, Any]] = None

# Authentication dependency (placeholder - implement proper auth)
async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # TODO: Implement proper JWT token verification
    # For now, accept any token that starts with "admin_"
    if not credentials.credentials.startswith("admin_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token"
        )
    return credentials.credentials

# File paths
def get_data_paths():
    backend_dir = Path(__file__).parent.parent.parent
    return {
        'stories': backend_dir / 'data' / 'stories.yml',
        'rules': backend_dir / 'data' / 'rules.yml',
        'nlu': backend_dir / 'data' / 'nlu.yml',
        'domain': backend_dir / 'domain.yml',
        'config': backend_dir / 'config.yml',
        'endpoints': backend_dir / 'endpoints.yml'
    }

def backup_file(file_path: Path):
    """Create a backup of the file with timestamp"""
    if file_path.exists():
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = file_path.with_suffix(f'.backup_{timestamp}{file_path.suffix}')
        shutil.copy2(file_path, backup_path)
        return backup_path
    return None

def load_yaml_file(file_path: Path) -> Dict[str, Any]:
    """Load YAML file with error handling"""
    try:
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as file:
                return yaml.safe_load(file) or {}
        return {}
    except Exception as e:
        logger.error(f"Error loading {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading file: {str(e)}")

def save_yaml_file(file_path: Path, data: Dict[str, Any]):
    """Save data to YAML file with backup"""
    try:
        # Create backup first
        backup_file(file_path)
        
        # Ensure directory exists
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save file
        with open(file_path, 'w', encoding='utf-8') as file:
            yaml.dump(data, file, default_flow_style=False, allow_unicode=True, indent=2)
        
        logger.info(f"Saved {file_path}")
    except Exception as e:
        logger.error(f"Error saving {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

# ============ STORIES MANAGEMENT ============

@router.get("/stories", response_model=Dict[str, Any])
async def get_stories(token: str = Depends(verify_admin_token)):
    """Get all training stories"""
    paths = get_data_paths()
    data = load_yaml_file(paths['stories'])
    return {
        "version": data.get("version", "3.1"),
        "stories": data.get("stories", []),
        "total_stories": len(data.get("stories", []))
    }

@router.post("/stories")
async def create_story(story: StoryModel, token: str = Depends(verify_admin_token)):
    """Create a new training story"""
    paths = get_data_paths()
    data = load_yaml_file(paths['stories'])
    
    # Check if story already exists
    existing_stories = data.get("stories", [])
    if any(s.get("story") == story.story_name for s in existing_stories):
        raise HTTPException(status_code=400, detail="Story already exists")
    
    # Add new story
    new_story = {
        "story": story.story_name,
        "steps": story.steps
    }
    if story.metadata:
        new_story["metadata"] = story.metadata
    
    existing_stories.append(new_story)
    data["stories"] = existing_stories
    
    save_yaml_file(paths['stories'], data)
    return {"message": "Story created successfully", "story": new_story}

@router.put("/stories/{story_name}")
async def update_story(story_name: str, story: StoryModel, token: str = Depends(verify_admin_token)):
    """Update an existing training story"""
    paths = get_data_paths()
    data = load_yaml_file(paths['stories'])
    
    existing_stories = data.get("stories", [])
    
    # Find and update story
    for i, s in enumerate(existing_stories):
        if s.get("story") == story_name:
            existing_stories[i] = {
                "story": story.story_name,
                "steps": story.steps
            }
            if story.metadata:
                existing_stories[i]["metadata"] = story.metadata
            
            data["stories"] = existing_stories
            save_yaml_file(paths['stories'], data)
            return {"message": "Story updated successfully"}
    
    raise HTTPException(status_code=404, detail="Story not found")

@router.delete("/stories/{story_name}")
async def delete_story(story_name: str, token: str = Depends(verify_admin_token)):
    """Delete a training story"""
    paths = get_data_paths()
    data = load_yaml_file(paths['stories'])
    
    existing_stories = data.get("stories", [])
    original_count = len(existing_stories)
    
    # Remove story
    data["stories"] = [s for s in existing_stories if s.get("story") != story_name]
    
    if len(data["stories"]) == original_count:
        raise HTTPException(status_code=404, detail="Story not found")
    
    save_yaml_file(paths['stories'], data)
    return {"message": "Story deleted successfully"}

# ============ RULES MANAGEMENT ============

@router.get("/rules", response_model=Dict[str, Any])
async def get_rules(token: str = Depends(verify_admin_token)):
    """Get all training rules"""
    paths = get_data_paths()
    data = load_yaml_file(paths['rules'])
    return {
        "version": data.get("version", "3.1"),
        "rules": data.get("rules", []),
        "total_rules": len(data.get("rules", []))
    }

@router.post("/rules")
async def create_rule(rule: RuleModel, token: str = Depends(verify_admin_token)):
    """Create a new training rule"""
    paths = get_data_paths()
    data = load_yaml_file(paths['rules'])
    
    # Check if rule already exists
    existing_rules = data.get("rules", [])
    if any(r.get("rule") == rule.rule_name for r in existing_rules):
        raise HTTPException(status_code=400, detail="Rule already exists")
    
    # Add new rule
    new_rule = {
        "rule": rule.rule_name,
        "steps": rule.steps
    }
    if rule.condition:
        new_rule["condition"] = rule.condition
    if rule.metadata:
        new_rule["metadata"] = rule.metadata
    
    existing_rules.append(new_rule)
    data["rules"] = existing_rules
    
    save_yaml_file(paths['rules'], data)
    return {"message": "Rule created successfully", "rule": new_rule}

# ============ NLU MANAGEMENT ============

@router.get("/nlu", response_model=Dict[str, Any])
async def get_nlu_data(token: str = Depends(verify_admin_token)):
    """Get all NLU training data"""
    paths = get_data_paths()
    data = load_yaml_file(paths['nlu'])
    return {
        "version": data.get("version", "3.1"),
        "nlu": data.get("nlu", []),
        "total_intents": len([item for item in data.get("nlu", []) if item.get("intent")]),
        "total_examples": sum(len(item.get("examples", [])) for item in data.get("nlu", []) if item.get("intent"))
    }

@router.post("/nlu/intents")
async def create_intent(intent: IntentModel, token: str = Depends(verify_admin_token)):
    """Create a new intent with examples"""
    paths = get_data_paths()
    data = load_yaml_file(paths['nlu'])
    
    nlu_data = data.get("nlu", [])
    
    # Check if intent already exists
    if any(item.get("intent") == intent.intent_name for item in nlu_data):
        raise HTTPException(status_code=400, detail="Intent already exists")
    
    # Add new intent
    new_intent = {
        "intent": intent.intent_name,
        "examples": [{"text": example} for example in intent.examples]
    }
    if intent.metadata:
        new_intent["metadata"] = intent.metadata
    
    nlu_data.append(new_intent)
    data["nlu"] = nlu_data
    
    save_yaml_file(paths['nlu'], data)
    return {"message": "Intent created successfully", "intent": new_intent}

@router.put("/nlu/intents/{intent_name}")
async def update_intent(intent_name: str, intent: IntentModel, token: str = Depends(verify_admin_token)):
    """Update an existing intent"""
    paths = get_data_paths()
    data = load_yaml_file(paths['nlu'])
    
    nlu_data = data.get("nlu", [])
    
    # Find and update intent
    for i, item in enumerate(nlu_data):
        if item.get("intent") == intent_name:
            nlu_data[i] = {
                "intent": intent.intent_name,
                "examples": [{"text": example} for example in intent.examples]
            }
            if intent.metadata:
                nlu_data[i]["metadata"] = intent.metadata
            
            data["nlu"] = nlu_data
            save_yaml_file(paths['nlu'], data)
            return {"message": "Intent updated successfully"}
    
    raise HTTPException(status_code=404, detail="Intent not found")

@router.delete("/nlu/intents/{intent_name}")
async def delete_intent(intent_name: str, token: str = Depends(verify_admin_token)):
    """Delete an intent"""
    paths = get_data_paths()
    data = load_yaml_file(paths['nlu'])
    
    nlu_data = data.get("nlu", [])
    original_count = len(nlu_data)
    
    # Remove intent
    data["nlu"] = [item for item in nlu_data if item.get("intent") != intent_name]
    
    if len(data["nlu"]) == original_count:
        raise HTTPException(status_code=404, detail="Intent not found")
    
    save_yaml_file(paths['nlu'], data)
    return {"message": "Intent deleted successfully"}

# ============ DOMAIN MANAGEMENT ============

@router.get("/domain", response_model=Dict[str, Any])
async def get_domain(token: str = Depends(verify_admin_token)):
    """Get domain configuration"""
    paths = get_data_paths()
    return load_yaml_file(paths['domain'])

@router.put("/domain")
async def update_domain(domain_data: Dict[str, Any], token: str = Depends(verify_admin_token)):
    """Update domain configuration"""
    paths = get_data_paths()
    save_yaml_file(paths['domain'], domain_data)
    return {"message": "Domain updated successfully"}

@router.post("/domain/responses")
async def create_response(response: ResponseModel, token: str = Depends(verify_admin_token)):
    """Create a new response template"""
    paths = get_data_paths()
    data = load_yaml_file(paths['domain'])
    
    responses = data.get("responses", {})
    
    if response.response_name in responses:
        raise HTTPException(status_code=400, detail="Response already exists")
    
    responses[response.response_name] = response.templates
    data["responses"] = responses
    
    save_yaml_file(paths['domain'], data)
    return {"message": "Response created successfully"}

# ============ TRAINING & DEPLOYMENT ============

@router.post("/train")
async def train_model(token: str = Depends(verify_admin_token)):
    """Train the Rasa model with current data"""
    try:
        import subprocess
        backend_dir = Path(__file__).parent.parent.parent
        
        # Run Rasa training
        result = subprocess.run([
            "python", "-m", "rasa", "train",
            "--config", "config.yml",
            "--domain", "domain.yml",
            "--data", "data"
        ], cwd=backend_dir, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            return {
                "message": "Model trained successfully",
                "output": result.stdout,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"Training failed: {result.stderr}"
            )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Training timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

@router.get("/models")
async def list_models(token: str = Depends(verify_admin_token)):
    """List available trained models"""
    backend_dir = Path(__file__).parent.parent.parent
    models_dir = backend_dir / "models"
    
    if not models_dir.exists():
        return {"models": []}
    
    models = []
    for model_file in models_dir.glob("*.tar.gz"):
        stat = model_file.stat()
        models.append({
            "name": model_file.name,
            "path": str(model_file),
            "size": stat.st_size,
            "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
        })
    
    return {"models": sorted(models, key=lambda x: x["modified"], reverse=True)}

# ============ BACKUP & RESTORE ============

@router.post("/backup")
async def create_backup(token: str = Depends(verify_admin_token)):
    """Create a backup of all configuration files"""
    try:
        backup_dir = Path(__file__).parent.parent.parent / "backups"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = backup_dir / f"chatbot_backup_{timestamp}"
        backup_path.mkdir(parents=True, exist_ok=True)
        
        paths = get_data_paths()
        backed_up_files = []
        
        for name, path in paths.items():
            if path.exists():
                dest = backup_path / f"{name}.yml"
                shutil.copy2(path, dest)
                backed_up_files.append(name)
        
        return {
            "message": "Backup created successfully",
            "backup_path": str(backup_path),
            "files_backed_up": backed_up_files,
            "timestamp": timestamp
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.get("/backups")
async def list_backups(token: str = Depends(verify_admin_token)):
    """List all available backups"""
    backup_dir = Path(__file__).parent.parent.parent / "backups"
    
    if not backup_dir.exists():
        return {"backups": []}
    
    backups = []
    for backup_path in backup_dir.iterdir():
        if backup_path.is_dir() and backup_path.name.startswith("chatbot_backup_"):
            stat = backup_path.stat()
            files = [f.name for f in backup_path.iterdir() if f.is_file()]
            backups.append({
                "name": backup_path.name,
                "path": str(backup_path),
                "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "files": files
            })
    
    return {"backups": sorted(backups, key=lambda x: x["created"], reverse=True)}

# ============ CONFIGURATION STATUS ============

@router.get("/status")
async def get_configuration_status(token: str = Depends(verify_admin_token)):
    """Get overall configuration status"""
    paths = get_data_paths()
    status_info = {}
    
    for name, path in paths.items():
        if path.exists():
            try:
                data = load_yaml_file(path)
                status_info[name] = {
                    "exists": True,
                    "size": path.stat().st_size,
                    "modified": datetime.fromtimestamp(path.stat().st_mtime).isoformat(),
                    "valid": True,
                    "summary": get_file_summary(name, data)
                }
            except Exception as e:
                status_info[name] = {
                    "exists": True,
                    "valid": False,
                    "error": str(e)
                }
        else:
            status_info[name] = {"exists": False}
    
    return status_info

def get_file_summary(file_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Get summary information for different file types"""
    if file_type == "stories":
        return {"total_stories": len(data.get("stories", []))}
    elif file_type == "rules":
        return {"total_rules": len(data.get("rules", []))}
    elif file_type == "nlu":
        nlu_data = data.get("nlu", [])
        return {
            "total_intents": len([item for item in nlu_data if item.get("intent")]),
            "total_examples": sum(len(item.get("examples", [])) for item in nlu_data if item.get("intent"))
        }
    elif file_type == "domain":
        return {
            "intents": len(data.get("intents", [])),
            "entities": len(data.get("entities", [])),
            "responses": len(data.get("responses", {})),
            "actions": len(data.get("actions", []))
        }
    else:
        return {"keys": list(data.keys()) if isinstance(data, dict) else "non-dict"} 