import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const Cta: React.FC = () => {
  return (
    <section className="py-20 bg-[#0A74DA] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Dealership?
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of successful dealerships already using SmartDealer to increase sales and improve customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Why Start Today?
              </h3>
              <ul className="space-y-3">
                {[
                  'Quick 15-minute setup process',
                  'Free 14-day trial with full features',
                  'No credit card required to start',
                  'Dedicated onboarding specialist',
                  'Cancel anytime with no penalties'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What You'll Get
              </h3>
              <ul className="space-y-3">
                {[
                  'AI chatbot customized for your dealership',
                  'Integration with your inventory system',
                  'Lead qualification and routing',
                  'Performance analytics dashboard',
                  '24/7 technical support'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 bg-[#0A74DA] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Start Free Trial
              <ArrowRight size={18} />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-gray-800 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};