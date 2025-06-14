"""
COE Service - Business Logic Layer
Fetches real-time COE (Certificate of Entitlement) pricing data from Singapore's LTA website
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio
import aiohttp
from dataclasses import dataclass
from bs4 import BeautifulSoup
import re

@dataclass
class COEBidResult:
    category: str
    quota_premium: float
    bids_received: int
    bids_successful: int
    bidding_date: str
    
@dataclass
class COEData:
    bidding_date: str
    results: List[COEBidResult]
    source: str = "LTA Singapore"

class COEController:
    """
    Business service for COE data management
    Implements BCE framework - Business Layer
    """
    
    def __init__(self):
        self.lta_api_base = "https://datamall2.mytransport.sg/ltaodataservice"
        self.lta_coe_url = f"{self.lta_api_base}/COEBiddingResult"
        self.backup_data_url = "https://www.lta.gov.sg/content/ltagov/en/roads-and-motoring/owning-a-vehicle/vehicle-quota-system/coe-bidding-results.html"
        
        # COE Categories mapping
        self.coe_categories = {
            "A": "Cars up to 1600cc & 130bhp",
            "B": "Cars above 1600cc or 130bhp",
            "C": "Goods vehicles & buses",
            "D": "Motorcycles",
            "E": "Open category"
        }
    
    async def get_latest_coe_prices(self, api_key: Optional[str] = None) -> COEData:
        """
        Fetch the latest COE bidding results
        """
        try:
            # Try LTA API first (requires API key)
            if api_key:
                data = await self._fetch_from_lta_api(api_key)
                if data:
                    return data
            
            # Fallback to web scraping
            data = await self._fetch_from_web_scraping()
            if data:
                return data
                
            # Ultimate fallback to mock data
            return self._get_mock_coe_data()
            
        except Exception as e:
            print(f"Error fetching COE data: {str(e)}")
            return self._get_mock_coe_data()
    
    async def _fetch_from_lta_api(self, api_key: str) -> Optional[COEData]:
        """
        Fetch COE data from official LTA API
        """
        try:
            headers = {
                'AccountKey': api_key,
                'accept': 'application/json'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(self.lta_coe_url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_lta_api_response(data)
                        
        except Exception as e:
            print(f"LTA API error: {str(e)}")
            return None
    
    async def _fetch_from_web_scraping(self) -> Optional[COEData]:
        """
        Fetch COE data via web scraping as fallback
        """
        try:
            # Alternative data sources for COE prices
            sources = [
                "https://www.motorist.sg/coe-prices/",
                "https://www.sgcarmart.com/coe/"
            ]
            
            for source_url in sources:
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(source_url) as response:
                            if response.status == 200:
                                html = await response.text()
                                data = self._parse_web_data(html, source_url)
                                if data:
                                    return data
                except:
                    continue
                    
        except Exception as e:
            print(f"Web scraping error: {str(e)}")
            return None
    
    def _parse_lta_api_response(self, data: dict) -> COEData:
        """
        Parse LTA API response into COEData
        """
        results = []
        bidding_date = ""
        
        for item in data.get('value', []):
            if not bidding_date:
                bidding_date = item.get('BiddingDate', '')
            
            result = COEBidResult(
                category=f"{item.get('Category', '')} - {self.coe_categories.get(item.get('Category', ''), 'Unknown')}",
                quota_premium=float(item.get('Premium', 0)),
                bids_received=int(item.get('BidsReceived', 0)),
                bids_successful=int(item.get('BidsSuccessful', 0)),
                bidding_date=item.get('BiddingDate', '')
            )
            results.append(result)
        
        return COEData(
            bidding_date=bidding_date,
            results=results
        )
    
    def _parse_web_data(self, html: str, source_url: str) -> Optional[COEData]:
        """
        Parse scraped web data into COEData
        """
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # This would need to be customized based on the actual website structure
            # For now, return None to use mock data
            return None
            
        except Exception as e:
            print(f"Parse error for {source_url}: {str(e)}")
            return None
    
    def _get_mock_coe_data(self) -> COEData:
        """
        Provide mock COE data when real data is unavailable
        """
        # Get current date for realistic mock data
        current_date = datetime.now()
        # COE bidding is typically on the first and third Wednesday of each month
        mock_date = current_date.strftime("%Y-%m-%d")
        
        mock_results = [
            COEBidResult(
                category="A - Cars up to 1600cc & 130bhp",
                quota_premium=95000.00,
                bids_received=1250,
                bids_successful=920,
                bidding_date=mock_date
            ),
            COEBidResult(
                category="B - Cars above 1600cc or 130bhp", 
                quota_premium=105000.00,
                bids_received=1800,
                bids_successful=1100,
                bidding_date=mock_date
            ),
            COEBidResult(
                category="C - Goods vehicles & buses",
                quota_premium=78000.00,
                bids_received=450,
                bids_successful=280,
                bidding_date=mock_date
            ),
            COEBidResult(
                category="D - Motorcycles",
                quota_premium=8500.00,
                bids_received=320,
                bids_successful=180,
                bidding_date=mock_date
            ),
            COEBidResult(
                category="E - Open category",
                quota_premium=106000.00,
                bids_received=980,
                bids_successful=650,
                bidding_date=mock_date
            )
        ]
        
        return COEData(
            bidding_date=mock_date,
            results=mock_results,
            source="Mock Data (Real API unavailable)"
        )
    
    def format_coe_response(self, coe_data: COEData) -> str:
        """
        Format COE data for chatbot response - single clean message
        """
        response = f"📊 Latest COE Prices (Singapore) — {coe_data.bidding_date}\n\n"
        
        for result in coe_data.results:
            response += f"🚗 {result.category}: ${result.quota_premium:,.0f}\n"
        
        response += f"""
💡 Total Cost Planning: Car Price + COE + Registration ($140) + Insurance + Road Tax

Smart Tips: Monitor trends for 2-3 months before buying, consider financing pre-approval, factor in total ownership costs.

Source: {coe_data.source}

Would you like vehicle recommendations or financing options?"""
        
        return response
    
    def get_sync_coe_prices(self) -> COEData:
        """
        Synchronous version for RASA actions
        Returns mock data since actions can't handle async
        """
        return self._get_mock_coe_data()
    
    async def get_coe_trends(self, months: int = 6) -> Dict:
        """
        Get COE price trends over specified months
        Future enhancement for trend analysis
        """
        # This would fetch historical data and analyze trends
        # For now, return placeholder
        return {
            "trend": "increasing",
            "average_cat_a": 92000,
            "average_cat_b": 102000,
            "period": f"Last {months} months"
        } 