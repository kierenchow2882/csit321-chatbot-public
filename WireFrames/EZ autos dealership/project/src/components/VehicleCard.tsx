import React from 'react';
import { Heart, Info, DollarSign, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative">
        <div className="h-56 overflow-hidden">
          <img 
            src={vehicle.imageUrl} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Add to favorites"
        >
          <Heart size={20} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        
        {vehicle.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h2>
          <span className="text-xl font-bold text-blue-600">
            ${vehicle.price.toLocaleString()}
          </span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {vehicle.mileage.toLocaleString()} mi
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {vehicle.transmission}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {vehicle.fuelType}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {vehicle.color}
          </span>
        </div>
        
        <p className="mt-3 text-gray-600 line-clamp-2">{vehicle.description}</p>
        
        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center">
            View Details <ArrowRight size={16} className="ml-1" />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center justify-center">
            <Info size={18} />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center justify-center">
            <DollarSign size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;