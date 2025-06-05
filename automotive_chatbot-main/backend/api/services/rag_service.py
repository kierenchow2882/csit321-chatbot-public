"""
Retrieval-Augmented Generation (RAG) Service for Automotive Domain
Enhanced with Singapore automotive context and COE pricing
"""

import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

# Safe imports with fallbacks
try:
    from langchain_community.embeddings import OpenAIEmbeddings
except ImportError:
    try:
        from langchain.embeddings.openai import OpenAIEmbeddings
    except ImportError:
        OpenAIEmbeddings = None

try:
    from langchain_community.vectorstores import FAISS
except ImportError:
    try:
        from langchain.vectorstores import FAISS
    except ImportError:
        FAISS = None

try:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.schema import Document
except ImportError:
    RecursiveCharacterTextSplitter = None
    Document = None

# Import local services
from api.services.coe_service import COEService

logger = logging.getLogger(__name__)

class AutomotiveRAGService:
    """
    Enhanced RAG service for automotive domain with Singapore context
    """
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.coe_service = COEService()
        self.embeddings = None
        self.vectorstore = None
        self.is_initialized = False
        
        # Check if required dependencies are available
        self.rag_available = all([
            OpenAIEmbeddings is not None,
            FAISS is not None,
            RecursiveCharacterTextSplitter is not None,
            Document is not None
        ])
        
        if self.rag_available and self.openai_api_key:
            try:
                self._initialize()
            except Exception as e:
                logger.warning(f"RAG initialization failed: {e}")
                self.rag_available = False
    
    def _initialize(self):
        """Initialize embeddings and vector store"""
        if not self.rag_available or not self.openai_api_key:
            return
            
        try:
            # Initialize embeddings
            self.embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
            
            # Load or create knowledge base
            self._load_automotive_knowledge()
            self.is_initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize RAG service: {e}")
            self.rag_available = False
    
    def _load_automotive_knowledge(self):
        """Load automotive knowledge base"""
        if not self.rag_available:
            return
            
        # Singapore automotive knowledge base
        knowledge_texts = [
            # COE Information
            "Certificate of Entitlement (COE) is required to own a vehicle in Singapore for 10 years. COE prices vary by vehicle category and are determined through bidding.",
            
            # Vehicle Categories
            "COE Category A: Cars up to 1600cc and maximum power output of 97kW. Category B: Cars above 1600cc or maximum power output above 97kW. Category C: Goods vehicles and buses. Category D: Motorcycles. Category E: Open category for all vehicle types.",
            
            # Popular Car Brands in Singapore
            "Popular car brands in Singapore include Toyota, Honda, BMW, Mercedes-Benz, Audi, Volkswagen, Hyundai, Kia, Mazda, and Nissan. Japanese and European brands are particularly popular.",
            
            # Maintenance Tips
            "Regular car maintenance in Singapore's tropical climate includes checking air conditioning, battery condition, tire pressure, oil changes every 6 months or 10,000km, and brake inspections.",
            
            # Fuel Types
            "Singapore offers RON 95, RON 98 petrol, and diesel. Electric vehicle charging infrastructure is expanding with plans for 60,000 charging points by 2030.",
            
            # Road Tax and Insurance
            "Road tax in Singapore is based on engine capacity and vehicle type. All vehicles must have valid insurance coverage. Comprehensive insurance is recommended for new vehicles.",
            
            # Parking in Singapore
            "Parking in Singapore uses electronic parking system (EPS) and cash cards. HDB car parks, shopping mall parking, and street parking rates vary by location and time.",
            
            # Vehicle Inspection
            "All vehicles in Singapore must pass mandatory inspection before registration and periodically thereafter. LTA conducts vehicle inspections for safety and emissions compliance."
        ]
        
        try:
            # Create documents
            documents = [Document(page_content=text, metadata={"source": "automotive_kb"}) 
                        for text in knowledge_texts]
            
            # Create text splitter
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50
            )
            
            # Split documents
            split_docs = text_splitter.split_documents(documents)
            
            # Create vector store
            if split_docs and self.embeddings:
                self.vectorstore = FAISS.from_documents(split_docs, self.embeddings)
                
        except Exception as e:
            logger.error(f"Failed to load automotive knowledge: {e}")
    
    async def get_enhanced_response(self, user_message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Get enhanced response using RAG and real-time data
        Falls back to basic response if RAG is unavailable
        """
        try:
            # Always get COE data if relevant
            coe_data = None
            if any(keyword in user_message.lower() for keyword in ['coe', 'price', 'cost', 'certificate']):
                coe_data = await self.coe_service.get_latest_coe_prices()
            
            # If RAG is available, use it
            if self.is_initialized and self.vectorstore:
                return await self._rag_enhanced_response(user_message, context, coe_data)
            else:
                # Fallback to basic response
                return await self._basic_response(user_message, context, coe_data)
                
        except Exception as e:
            logger.error(f"Error in enhanced response generation: {e}")
            return await self._basic_response(user_message, context, coe_data)
    
    async def _rag_enhanced_response(self, user_message: str, context: Dict[str, Any], coe_data: Dict) -> Dict[str, Any]:
        """Generate RAG-enhanced response"""
        try:
            # Retrieve relevant documents
            relevant_docs = self.vectorstore.similarity_search(user_message, k=3)
            retrieved_context = "\n".join([doc.page_content for doc in relevant_docs])
            
            # Combine with real-time COE data
            enhanced_context = retrieved_context
            if coe_data:
                enhanced_context += f"\n\nLatest COE Prices: {coe_data}"
            
            # Generate response (placeholder - integrate with your LLM)
            response = self._generate_automotive_response(user_message, enhanced_context)
            
            return {
                "response": response,
                "enhanced": True,
                "sources": ["knowledge_base", "real_time_data"],
                "coe_data": coe_data,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"RAG enhancement failed: {e}")
            return await self._basic_response(user_message, context, coe_data)
    
    async def _basic_response(self, user_message: str, context: Dict[str, Any], coe_data: Dict) -> Dict[str, Any]:
        """Generate basic response without RAG"""
        response = self._generate_automotive_response(user_message, f"COE Data: {coe_data}" if coe_data else "")
        
        return {
            "response": response,
            "enhanced": False,
            "sources": ["basic_rules", "real_time_data"] if coe_data else ["basic_rules"],
            "coe_data": coe_data,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _generate_automotive_response(self, user_message: str, context: str = "") -> str:
        """
        Generate automotive-focused response based on message content
        This is a rule-based fallback when LLM is not available
        """
        message_lower = user_message.lower()
        
        # COE-related queries
        if any(keyword in message_lower for keyword in ['coe', 'certificate', 'entitlement']):
            return f"COE (Certificate of Entitlement) is required to register a vehicle in Singapore. Current COE prices vary by category. {context}"
        
        # Pricing queries
        if any(keyword in message_lower for keyword in ['price', 'cost', 'expensive', 'cheap']):
            return f"Vehicle costs in Singapore include COE, registration fees, insurance, road tax, and maintenance. COE is typically the largest cost component. {context}"
        
        # Maintenance queries
        if any(keyword in message_lower for keyword in ['maintenance', 'service', 'repair', 'oil change']):
            return "Regular maintenance in Singapore's tropical climate includes: oil changes every 6 months, air-con servicing, battery checks, and tire maintenance. Authorized service centers provide warranty coverage."
        
        # Insurance queries
        if any(keyword in message_lower for keyword in ['insurance', 'coverage', 'claim']):
            return "Vehicle insurance is mandatory in Singapore. Comprehensive coverage is recommended for new vehicles. Third-party coverage is the minimum requirement."
        
        # Electric vehicle queries
        if any(keyword in message_lower for keyword in ['electric', 'ev', 'hybrid', 'charging']):
            return "Singapore is promoting electric vehicles with expanding charging infrastructure. EV buyers may qualify for rebates and reduced road tax."
        
        # Default automotive response
        return f"I'm here to help with automotive questions about Singapore's vehicle market, including COE prices, maintenance, insurance, and regulations. {context}"
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get RAG service status"""
        return {
            "rag_available": self.rag_available,
            "initialized": self.is_initialized,
            "openai_configured": bool(self.openai_api_key),
            "dependencies": {
                "langchain": OpenAIEmbeddings is not None,
                "faiss": FAISS is not None,
                "text_splitter": RecursiveCharacterTextSplitter is not None
            }
        } 