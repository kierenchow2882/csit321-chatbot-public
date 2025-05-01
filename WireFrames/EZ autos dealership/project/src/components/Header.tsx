import React, { useState, useEffect } from 'react';
import { SearchIcon, DollarSign, HelpCircle, PhoneCall, Car, Menu, X, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavigationLink } from '../types';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavigationLink[] = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Search', path: '/search', icon: 'search' },
    { name: 'Financial Planner', path: '/finance', icon: 'dollar' },
    { name: 'FAQ', path: '/faq', icon: 'help' },
    { name: 'Contact Us', path: '/contact', icon: 'phone' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home size={18} />;
      case 'search':
        return <SearchIcon size={18} />;
      case 'dollar':
        return <DollarSign size={18} />;
      case 'help':
        return <HelpCircle size={18} />;
      case 'phone':
        return <PhoneCall size={18} />;
      default:
        return null;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-b from-black/70 to-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Car size={28} className={`${isScrolled ? 'text-blue-600' : 'text-white'} mr-2`} />
          <h1 className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
            EZ Autos
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-gray-100 hover:text-white'
              }`}
            >
              {renderIcon(link.icon || '')}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen 
            ? <X size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} /> 
            : <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
          }
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center space-x-2 py-3 border-b border-gray-200 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {renderIcon(link.icon || '')}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;