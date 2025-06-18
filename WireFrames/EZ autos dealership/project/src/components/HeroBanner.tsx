import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleChatAction = (action: string) => {
    // Use the global quickAction function to interact with CleverCompanion
    if (window.quickAction) {
      window.quickAction(action);
    } else {
      console.log('Chat action:', action);
    }
  };

  return (
      <div className="relative h-[70vh] bg-cover bg-center overflow-hidden"
           style={{ backgroundImage: "url('https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                Find Your Perfect Drive
              </h1>
              <p className="text-xl text-gray-200 mb-8 animate-fade-in-delay">
                Browse our premium selection of vehicles with confidence and ease
              </p>

              <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-grow">
                    <div className="relative">
                      <input
                          type="text"
                          placeholder="Search makes, models, or keywords"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                  >
                    Search <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-3 mt-6 animate-fade-in-delay-2">
                <button
                    onClick={() => handleCategoryClick('SUV')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  SUVs
                </button>
                <button
                    onClick={() => handleCategoryClick('Sedan')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  Sedans
                </button>
                <button
                    onClick={() => handleCategoryClick('Electric')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  Electric
                </button>
                <button
                    onClick={() => handleCategoryClick('Luxury')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  Luxury
                </button>
                <button
                    onClick={() => handleChatAction('I need help finding a vehicle')}
                    className="bg-green-500/80 hover:bg-green-600/80 text-white text-sm font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  💬 Ask Our Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HeroBanner;