import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturedVehicles from './components/FeaturedVehicles';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import FinancialPlanner from './pages/FinancialPlanner';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={
            <main className="flex-grow">
              <HeroBanner />
              <FeaturedVehicles />
            </main>
          } />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/finance" element={<FinancialPlanner />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <ChatBot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;