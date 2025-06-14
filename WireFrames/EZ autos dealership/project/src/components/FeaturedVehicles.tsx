import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import { getVehicles } from '../lib/api';
import { Vehicle } from '../types';

const FeaturedVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    fuel_type: '',
    min_price: '',
    max_price: '',
    make: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const queryFilters = {
        featured: true,
        sort_by: sortOption,
        ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };
      const data = await getVehicles(queryFilters);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [sortOption, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      fuel_type: '',
      min_price: '',
      max_price: '',
      make: ''
    });
  };

  const handleViewAllVehicles = () => {
    navigate('/search');
  };

  if (loading) {
    return (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured vehicles...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Vehicles</h2>
              <p className="text-gray-600 mt-2">Explore our handpicked selection of premium vehicles</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <button
                    className="flex items-center space-x-2 bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                  <ChevronDown size={18} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filterOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h3 className="font-medium text-gray-800 mb-2">Make</h3>
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
                            </select>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-800 mb-2">Fuel Type</h3>
                            <select
                                value={filters.fuel_type}
                                onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">All Types</option>
                              <option value="Gasoline">Gasoline</option>
                              <option value="Electric">Electric</option>
                              <option value="Hybrid">Hybrid</option>
                              <option value="Diesel">Diesel</option>
                            </select>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-800 mb-2">Price Range</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                  type="number"
                                  placeholder="Min Price"
                                  value={filters.min_price}
                                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                  type="number"
                                  placeholder="Max Price"
                                  value={filters.max_price}
                                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <button
                              onClick={clearFilters}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>

              <select
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 appearance-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Newest First</option>
                <option value="mileage_asc">Lowest Mileage</option>
              </select>
            </div>
          </div>

          {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No featured vehicles available at the moment.</p>
                <button
                    onClick={handleViewAllVehicles}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200"
                >
                  View All Vehicles
                </button>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
          )}

          <div className="mt-12 text-center">
            <button
                onClick={handleViewAllVehicles}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200"
            >
              View All Vehicles
            </button>
          </div>
        </div>
      </section>
  );
};

export default FeaturedVehicles;