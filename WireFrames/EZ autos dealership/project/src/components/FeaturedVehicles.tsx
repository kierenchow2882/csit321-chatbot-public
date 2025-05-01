import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import VehicleCard from './VehicleCard';
import { vehicles } from '../data/vehicles';
import { Vehicle } from '../types';

const FeaturedVehicles: React.FC = () => {
  const [sortOption, setSortOption] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const featuredVehicles = vehicles.filter(vehicle => vehicle.featured);

  const sortVehicles = (vehicles: Vehicle[], option: string): Vehicle[] => {
    switch (option) {
      case 'price-low':
        return [...vehicles].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...vehicles].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...vehicles].sort((a, b) => b.year - a.year);
      case 'mileage':
        return [...vehicles].sort((a, b) => a.mileage - b.mileage);
      default:
        return vehicles;
    }
  };

  const sortedVehicles = sortVehicles(featuredVehicles, sortOption);

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
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 mb-2">Vehicle Type</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">SUV</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">Sedan</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">Electric</span>
                      </label>
                    </div>
                    
                    <h3 className="font-medium text-gray-800 mt-4 mb-2">Price Range</h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="100000" 
                      step="5000"
                      className="w-full text-blue-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>$100,000+</span>
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
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="mileage">Lowest Mileage</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200">
            View All Vehicles
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;