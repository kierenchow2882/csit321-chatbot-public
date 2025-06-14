"""
RAG Service - Free Implementation using Sentence Transformers
No OpenAI API required - uses free Hugging Face models
"""

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import os
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class RAGController:
    """
    Free RAG implementation using:
    - sentence-transformers for embeddings (free)
    - FAISS for vector search (free)
    - Local data processing (free)
    """
    
    def __init__(self):
        # Use free sentence transformer model
        self.model_name = "all-MiniLM-L6-v2"  # Fast, good quality, free
        self.model = None
        self.embeddings = None
        self.index = None
        self.documents = []
        self.metadata = []
        
        # Paths for cached data
        self.embeddings_path = "data/rag_embeddings.pkl"
        self.index_path = "data/rag_index.faiss"
        self.docs_path = "data/rag_documents.pkl"
        
        self._initialize_model()
        self._load_or_create_knowledge_base()
    
    def _initialize_model(self):
        """Initialize the sentence transformer model"""
        try:
            logger.info(f"Loading sentence transformer model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info("✅ Model loaded successfully")
        except Exception as e:
            logger.error(f"❌ Error loading model: {str(e)}")
            raise e
    
    def _load_or_create_knowledge_base(self):
        """Load existing knowledge base or create new one"""
        if self._cached_data_exists():
            logger.info("📂 Loading cached RAG data...")
            self._load_cached_data()
        else:
            logger.info("🔨 Creating new knowledge base...")
            self._create_knowledge_base()
    
    def _cached_data_exists(self) -> bool:
        """Check if cached RAG data exists"""
        return (os.path.exists(self.embeddings_path) and 
                os.path.exists(self.index_path) and 
                os.path.exists(self.docs_path))
    
    def _create_knowledge_base(self):
        """Create knowledge base from available data sources"""
        documents = []
        metadata = []
        
        # 1. Vehicle inventory knowledge
        vehicle_docs, vehicle_meta = self._process_vehicle_data()
        documents.extend(vehicle_docs)
        metadata.extend(vehicle_meta)
        
        # 2. Maintenance knowledge  
        maintenance_docs, maintenance_meta = self._process_maintenance_data()
        documents.extend(maintenance_docs)
        metadata.extend(maintenance_meta)
        
        # 3. COE knowledge
        coe_docs, coe_meta = self._process_coe_data()
        documents.extend(coe_docs)
        metadata.extend(coe_meta)
        
        # 4. Singapore automotive knowledge
        sg_auto_docs, sg_auto_meta = self._process_singapore_automotive_data()
        documents.extend(sg_auto_docs)
        metadata.extend(sg_auto_meta)
        
        if not documents:
            logger.warning("⚠️ No documents found for knowledge base")
            return
        
        # Generate embeddings
        logger.info(f"🔄 Generating embeddings for {len(documents)} documents...")
        embeddings = self.model.encode(documents, show_progress_bar=True)
        
        # Create FAISS index
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)  # Inner product for similarity
        
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings.astype('float32'))
        index.add(embeddings.astype('float32'))
        
        # Store everything
        self.embeddings = embeddings
        self.index = index
        self.documents = documents
        self.metadata = metadata
        
        # Cache for faster loading
        self._save_cached_data()
        
        logger.info(f"✅ Knowledge base created with {len(documents)} documents")
    
    def _process_vehicle_data(self) -> tuple:
        """Process vehicle inventory for RAG"""
        documents = []
        metadata = []
        
        try:
            if os.path.exists("data/vehicle_inventory.xlsx"):
                df = pd.read_excel("data/vehicle_inventory.xlsx", sheet_name='Vehicle_Inventory')
                
                for _, row in df.iterrows():
                    # Create searchable document
                    doc = f"""
                    Vehicle: {row['Brand']} {row['Model']} {row['Year']}
                    Price: ${row['Price_SGD']:,} SGD
                    Engine: {row['Engine_Size_cc']}cc {row['Fuel_Type']}
                    Body Type: {row['Body_Type']}
                    COE Category: {row['COE_Category']} ({row['COE_Remaining_Months']} months remaining)
                    Transmission: {row['Transmission']}
                    Mileage: {row['Mileage_km']:,} km
                    Condition: {row['Condition']}
                    Location: {row['Location']}
                    Features: {row['Features']}
                    Notes: {row['Dealer_Notes']}
                    Stock ID: {row['Stock_ID']}
                    Status: {row['Status']}
                    """.strip()
                    
                    documents.append(doc)
                    metadata.append({
                        "type": "vehicle",
                        "stock_id": row['Stock_ID'],
                        "brand": row['Brand'],
                        "model": row['Model'],
                        "year": row['Year'],
                        "price": row['Price_SGD'],
                        "source": "inventory"
                    })
                
                logger.info(f"📊 Processed {len(documents)} vehicle documents")
        
        except Exception as e:
            logger.error(f"❌ Error processing vehicle data: {str(e)}")
        
        return documents, metadata
    
    def _process_maintenance_data(self) -> tuple:
        """Process maintenance schedules for RAG"""
        documents = []
        metadata = []
        
        try:
            if os.path.exists("data/maintenance_schedules.xlsx"):
                df = pd.read_excel("data/maintenance_schedules.xlsx", sheet_name='Maintenance_Schedule')
                
                for _, row in df.iterrows():
                    doc = f"""
                    Maintenance for {row['Brand']} vehicles:
                    Service Type: {row['Service_Type']}
                    Interval: Every {row['Interval_km']} km or {row['Interval_months']} months
                    Description: {row['Description']}
                    Estimated Cost: ${row['Estimated_Cost_SGD']} SGD
                    Singapore Climate Notes: {row['Singapore_Climate_Notes']}
                    """.strip()
                    
                    documents.append(doc)
                    metadata.append({
                        "type": "maintenance",
                        "brand": row['Brand'],
                        "service_type": row['Service_Type'],
                        "cost": row['Estimated_Cost_SGD'],
                        "source": "maintenance_schedule"
                    })
                
                logger.info(f"🔧 Processed {len(documents)} maintenance documents")
        
        except Exception as e:
            logger.error(f"❌ Error processing maintenance data: {str(e)}")
        
        return documents, metadata
    
    def _process_coe_data(self) -> tuple:
        """Process COE knowledge for RAG"""
        documents = []
        metadata = []
        
        coe_knowledge = [
            {
                "doc": """COE Category A: For cars with engine capacity up to 1600cc and maximum power output up to 130 bhp. 
                Current estimated price: $95,000. This category includes most compact cars and sedans like Toyota Vios, 
                Honda City, Hyundai Avante. Bidding happens twice monthly on first and third Wednesday.""",
                "meta": {"type": "coe", "category": "A", "topic": "category_info"}
            },
            {
                "doc": """COE Category B: For cars with engine capacity above 1600cc or maximum power output above 130 bhp. 
                Current estimated price: $110,000. Includes larger cars like Toyota Camry, Honda Accord, BMW 3 Series, 
                Mercedes C-Class. More expensive than Category A due to higher demand.""",
                "meta": {"type": "coe", "category": "B", "topic": "category_info"}
            },
            {
                "doc": """COE Category C: For goods vehicles and buses. Current estimated price: $75,000. 
                Used for commercial vehicles, trucks, and buses. Generally cheaper than passenger car categories.""",
                "meta": {"type": "coe", "category": "C", "topic": "category_info"}
            },
            {
                "doc": """COE Category D: For motorcycles. Current estimated price: $9,500. 
                Cheapest COE category, for all motorcycles and scooters. Very popular among young adults.""",
                "meta": {"type": "coe", "category": "D", "topic": "category_info"}
            },
            {
                "doc": """COE Category E: Open category that can be used for any vehicle type. 
                Current estimated price: $106,000. Usually similar to Category B prices. 
                Provides flexibility as it can be used for any category of vehicle.""",
                "meta": {"type": "coe", "category": "E", "topic": "category_info"}
            },
            {
                "doc": """COE bidding process: Conducted twice monthly on first and third Wednesday of each month. 
                Bidding starts at 12:00 PM and ends at 6:00 PM. Results announced same evening. 
                Successful bidders must pay within specified timeframe. Prices fluctuate based on demand and supply.""",
                "meta": {"type": "coe", "topic": "bidding_process"}
            },
            {
                "doc": """COE renewal vs PARF: When COE expires after 10 years, owners can choose to renew COE for another 
                5 or 10 years, or scrap vehicle for PARF (Preferential Additional Registration Fee) rebate. 
                PARF amount depends on vehicle age and ARF paid. Consider current COE prices vs PARF rebate.""",
                "meta": {"type": "coe", "topic": "renewal_parf"}
            }
        ]
        
        for item in coe_knowledge:
            documents.append(item["doc"])
            metadata.append({**item["meta"], "source": "coe_knowledge"})
        
        logger.info(f"📋 Processed {len(documents)} COE documents")
        return documents, metadata
    
    def _process_singapore_automotive_data(self) -> tuple:
        """Process Singapore-specific automotive knowledge"""
        documents = []
        metadata = []
        
        sg_knowledge = [
            {
                "doc": """Singapore vehicle registration with LTA: Required documents include NRIC/Passport, 
                insurance coverage letter, vehicle inspection report, import permit (for imported cars). 
                Process takes 1-3 working days. Fees include registration fee, road tax, and administrative charges.""",
                "meta": {"type": "registration", "topic": "lta_process"}
            },
            {
                "doc": """Road tax in Singapore: Annual payment required for all vehicles. Amount based on engine capacity. 
                Cars up to 1000cc: $372/year. 1001-1600cc: $742/year. 1601-3000cc: $1242/year. 
                Above 3000cc: higher rates apply. Can pay online via OneMotoring portal.""",
                "meta": {"type": "road_tax", "topic": "rates"}
            },
            {
                "doc": """Car insurance in Singapore: Compulsory for all vehicles. Minimum third-party coverage required. 
                Comprehensive insurance recommended. Factors affecting premiums: driver age, experience, vehicle value, 
                no-claim discount. Major insurers: AIG, NTUC Income, Great Eastern, AXA.""",
                "meta": {"type": "insurance", "topic": "requirements"}
            },
            {
                "doc": """Parking in Singapore: HDB parking $90-150/month depending on location. Shopping mall parking 
                $1-3/hour. Street parking via parking coupons or electronic payments. 
                Central area parking more expensive, especially during peak hours.""",
                "meta": {"type": "parking", "topic": "rates"}
            },
            {
                "doc": """EV charging in Singapore: Growing network of charging stations. SP Group, Tesla Superchargers, 
                Greenlots available. Home charging installation possible for landed properties. 
                Government rebates available for EV purchases. EV road tax calculated differently.""",
                "meta": {"type": "ev", "topic": "charging"}
            }
        ]
        
        for item in sg_knowledge:
            documents.append(item["doc"])
            metadata.append({**item["meta"], "source": "singapore_automotive"})
        
        logger.info(f"🇸🇬 Processed {len(documents)} Singapore automotive documents")
        return documents, metadata
    
    def _save_cached_data(self):
        """Save embeddings and index for faster loading"""
        try:
            os.makedirs("data", exist_ok=True)
            
            # Save embeddings and documents
            with open(self.embeddings_path, 'wb') as f:
                pickle.dump({
                    'embeddings': self.embeddings,
                    'documents': self.documents,
                    'metadata': self.metadata
                }, f)
            
            # Save FAISS index
            faiss.write_index(self.index, self.index_path)
            
            logger.info("💾 RAG data cached successfully")
            
        except Exception as e:
            logger.error(f"❌ Error caching RAG data: {str(e)}")
    
    def _load_cached_data(self):
        """Load cached embeddings and index"""
        try:
            # Load embeddings and documents
            with open(self.embeddings_path, 'rb') as f:
                data = pickle.load(f)
                self.embeddings = data['embeddings']
                self.documents = data['documents']
                self.metadata = data['metadata']
            
            # Load FAISS index
            self.index = faiss.read_index(self.index_path)
            
            logger.info(f"📂 Loaded cached RAG data: {len(self.documents)} documents")
            
        except Exception as e:
            logger.error(f"❌ Error loading cached RAG data: {str(e)}")
            self._create_knowledge_base()
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search knowledge base using RAG"""
        if not self.model or not self.index:
            logger.error("❌ RAG service not properly initialized")
            return []
        
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query])
            faiss.normalize_L2(query_embedding.astype('float32'))
            
            # Search similar documents
            scores, indices = self.index.search(query_embedding.astype('float32'), top_k)
            
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx < len(self.documents):  # Valid index
                    results.append({
                        "document": self.documents[idx],
                        "metadata": self.metadata[idx],
                        "score": float(score),
                        "rank": i + 1
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"❌ RAG search error: {str(e)}")
            return []
    
    def get_intelligent_response(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get intelligent response using RAG search"""
        try:
            # Search knowledge base
            search_results = self.search(query, top_k=3)
            
            if not search_results:
                return {
                    "response": "I don't have specific information about that. Could you rephrase your question?",
                    "confidence": 0.3,
                    "source": "rag_fallback"
                }
            
            # Get best result
            best_result = search_results[0]
            
            # Format response based on result type
            response = self._format_rag_response(query, best_result, search_results)
            
            return {
                "response": response,
                "confidence": min(0.9, best_result["score"] + 0.2),  # Boost confidence slightly
                "source": "rag_enhanced",
                "search_results": search_results[:2],  # Include top 2 for context
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ RAG response error: {str(e)}")
            return {
                "response": "I'm having trouble accessing my knowledge base. Please try again.",
                "confidence": 0.2,
                "source": "rag_error"
            }
    
    def _format_rag_response(self, query: str, best_result: Dict, all_results: List[Dict]) -> str:
        """Format RAG response based on result type and content"""
        metadata = best_result["metadata"]
        document = best_result["document"]
        result_type = metadata.get("type", "general")
        
        if result_type == "vehicle":
            return self._format_vehicle_rag_response(query, best_result, all_results)
        elif result_type == "coe":
            return self._format_coe_rag_response(document, metadata)
        elif result_type == "maintenance":
            return self._format_maintenance_rag_response(document, metadata)
        else:
            # General response formatting
            return f"""Based on my knowledge:

{document}

<br><br>💡 This information is specific to Singapore's automotive market. Would you like more details about any aspect?"""
    
    def _format_vehicle_rag_response(self, query: str, best_result: Dict, all_results: List[Dict]) -> str:
        """Format vehicle-specific RAG response"""
        # Extract vehicle info from document
        doc = best_result["document"]
        meta = best_result["metadata"]
        
        # If multiple vehicles found, show comparison
        vehicle_results = [r for r in all_results if r["metadata"].get("type") == "vehicle"]
        
        if len(vehicle_results) > 1:
            response = f"🚗 <strong>Found {len(vehicle_results)} matching vehicles:</strong><br><br>"
            for i, result in enumerate(vehicle_results[:3], 1):
                v_meta = result["metadata"]
                response += f"{i}. {v_meta['brand']} {v_meta['model']} ({v_meta['year']}) - ${v_meta['price']:,}<br>"
            response += "<br>Would you like detailed information about any of these vehicles?"
        else:
            # Single vehicle detailed response
            response = f"🚗 <strong>Vehicle Information</strong><br><br>{doc}<br><br>💡 Interested in this vehicle? I can help with financing calculations or arrange a test drive!"
        
        return response
    
    def _format_coe_rag_response(self, document: str, metadata: Dict) -> str:
        """Format COE-specific RAG response"""
        category = metadata.get("category", "")
        title = f"📋 <strong>COE Category {category} Information</strong>" if category else "📋 <strong>COE Information</strong>"
        
        return f"""{title}

{document}

<br><br>💡 <strong>Need more help?</strong>
<br>• Check current bidding results
<br>• Calculate total vehicle cost including COE
<br>• Compare different COE categories"""
    
    def _format_maintenance_rag_response(self, document: str, metadata: Dict) -> str:
        """Format maintenance-specific RAG response"""
        brand = metadata.get("brand", "")
        service_type = metadata.get("service_type", "")
        
        title = f"🔧 <strong>{brand} {service_type}</strong>" if brand and service_type else "🔧 <strong>Maintenance Information</strong>"
        
        return f"""{title}

{document}

<br><br>💡 <strong>Maintenance Tips:</strong>
<br>• Book service appointments in advance
<br>• Keep maintenance records for warranty
<br>• Consider authorized service centers for newer vehicles""" 