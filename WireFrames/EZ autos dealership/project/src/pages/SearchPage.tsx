import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVehicles } from '../lib/api';
import VehicleCard from '../components/VehicleCard';
import { Vehicle } from '../types';

const SearchPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    min_price: '',
    max_price: '',
    fuel_type: '',
    mileage: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('featured');
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    
    // Handle search parameter
    if (urlParams.get('search')) {
      newFilters.search = urlParams.get('search') || '';
    }
    
    // Handle category parameter (map to appropriate filters)
    if (urlParams.get('category')) {
      const category = urlParams.get('category');
      switch (category) {
        case 'SUV':
          newFilters.search = 'SUV';
          break;
        case 'Sedan':
          newFilters.search = 'Sedan';
          break;
        case 'Electric':
          newFilters.fuel_type = 'Electric';
          break;
        case 'Luxury':
          newFilters.search = 'BMW Mercedes Audi Porsche Lexus';
          break;
        default:
          newFilters.search = category;
      }
    }
    
    // Handle other URL parameters
    ['make', 'model', 'year', 'min_price', 'max_price', 'fuel_type'].forEach(param => {
      if (urlParams.get(param)) {
        newFilters[param as keyof typeof filters] = urlParams.get(param) || '';
      }
    });
    
    setFilters(newFilters);
  }, [location.search]);

  useEffect(() => {
    fetchVehicles();
  }, [filters, sortBy]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const queryFilters = {
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
        sort_by: sortBy
      };
      
      const data = await getVehicles(queryFilters);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    fetchVehicles();
    
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    }
    
    const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      min_price: '',
      max_price: '',
      fuel_type: '',
      mileage: '',
      search: ''
    });
    setSortBy('featured');
    navigate(location.pathname, { replace: true });
  };

  const removeFilter = (key: string) => {
    handleFilterChange(key, '');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Perfect Vehicle</h1>
          
          {/* Quick Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <select
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Makes</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Tesla">Tesla</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Porsche">Porsche</option>
                <option value="Lexus">Lexus</option>
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Nissan">Nissan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                placeholder="Enter model"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select 
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select 
                value={filters.fuel_type}
                onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Minimum price"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Maximum price"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage</label>
              <input
                type="number"
                placeholder="Maximum mileage"
                value={filters.mileage}
                onChange={(e) => handleFilterChange('mileage', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Newest First</option>
                <option value="mileage_asc">Lowest Mileage</option>
              </select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              <Search size={20} />
              Search Vehicles
            </button>
            
            {getActiveFiltersCount() > 0 && (
              <button 
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md transition-colors"
              >
                <SlidersHorizontal size={20} />
                Clear All Filters ({getActiveFiltersCount()})
              </button>
            )}
          </div>
          
          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {key.replace('_', ' ')}: {value}
                    <button
                      onClick={() => removeFilter(key)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-4">No vehicles found matching your criteria.</p>
            <button 
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Clear Filters & View All
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Found {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;