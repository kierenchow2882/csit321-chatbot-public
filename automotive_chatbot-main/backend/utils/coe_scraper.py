import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import logging

class COEScraper:
    def __init__(self):
        self.base_url = "https://www.lta.gov.sg/content/ltagov/en/roads-and-motoring/owning-a-vehicle/costs-of-owning-a-vehicle/certificate-of-entitlement-coe.html"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def get_live_coe_prices(self):
        """
        Scrape live COE prices from LTA website
        Returns: dict with COE prices and metadata
        """
        try:
            # Alternative API endpoint (if available)
            api_url = "https://data.gov.sg/api/action/datastore_search"
            params = {
                'resource_id': 'coe-bidding-results',
                'limit': 10,
                'sort': 'month desc'
            }
            
            response = requests.get(api_url, params=params, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_api_data(data)
            else:
                # Fallback to web scraping
                return self._scrape_website()
                
        except Exception as e:
            logging.error(f"Error fetching COE data: {e}")
            return self._get_fallback_data()
    
    def _parse_api_data(self, data):
        """Parse data from Singapore government API"""
        try:
            records = data.get('result', {}).get('records', [])
            if not records:
                return self._get_fallback_data()
            
            latest_record = records[0]
            
            return {
                'category_a': {
                    'current': int(float(latest_record.get('premium_a', 0))),
                    'trend': self._calculate_trend(records, 'premium_a'),
                    'last_updated': latest_record.get('month', datetime.now().strftime('%Y-%m'))
                },
                'category_b': {
                    'current': int(float(latest_record.get('premium_b', 0))),
                    'trend': self._calculate_trend(records, 'premium_b'),
                    'last_updated': latest_record.get('month', datetime.now().strftime('%Y-%m'))
                },
                'category_e': {
                    'current': int(float(latest_record.get('premium_e', 0))),
                    'trend': self._calculate_trend(records, 'premium_e'),
                    'last_updated': latest_record.get('month', datetime.now().strftime('%Y-%m'))
                },
                'source': 'data.gov.sg',
                'fetched_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Error parsing API data: {e}")
            return self._get_fallback_data()
    
    def _calculate_trend(self, records, category):
        """Calculate price trend based on last 2 months"""
        try:
            if len(records) < 2:
                return 'stable'
            
            current = float(records[0].get(category, 0))
            previous = float(records[1].get(category, 0))
            
            if current > previous * 1.05:  # 5% increase
                return 'increasing'
            elif current < previous * 0.95:  # 5% decrease
                return 'decreasing'
            else:
                return 'stable'
                
        except:
            return 'stable'
    
    def _scrape_website(self):
        """Fallback web scraping method"""
        try:
            response = requests.get(self.base_url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # This would need to be customized based on LTA website structure
            # For now, return mock data with current date
            return self._get_fallback_data()
            
        except Exception as e:
            logging.error(f"Error scraping website: {e}")
            return self._get_fallback_data()
    
    def _get_fallback_data(self):
        """Return fallback data when live data is unavailable"""
        return {
            'category_a': {
                'current': 95000,
                'trend': 'stable',
                'last_updated': datetime.now().strftime('%Y-%m-%d')
            },
            'category_b': {
                'current': 110000,
                'trend': 'increasing',
                'last_updated': datetime.now().strftime('%Y-%m-%d')
            },
            'category_e': {
                'current': 85000,
                'trend': 'stable',
                'last_updated': datetime.now().strftime('%Y-%m-%d')
            },
            'source': 'fallback_data',
            'fetched_at': datetime.now().isoformat()
        }
    
    def save_coe_data(self, filepath='data/live_coe_data.json'):
        """Save COE data to file for caching"""
        try:
            coe_data = self.get_live_coe_prices()
            with open(filepath, 'w') as f:
                json.dump(coe_data, f, indent=2)
            return coe_data
        except Exception as e:
            logging.error(f"Error saving COE data: {e}")
            return None

# Usage example
if __name__ == "__main__":
    scraper = COEScraper()
    coe_data = scraper.get_live_coe_prices()
    print(json.dumps(coe_data, indent=2)) 