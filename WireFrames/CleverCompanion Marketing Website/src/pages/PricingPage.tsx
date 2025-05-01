import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

const features = [
  "Smart Customer Engagement",
  "24/7 Automated Support",
  "Seamless Live Agent Handoff",
  "Test Drive Bookings",
  "Real-Time Notifications",
  "Loan Calculator",
  "Chatbot Customization",
  "Chat History & Analytics",
  "CRM Integration"
];

const PricingPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-[#0A74DA] text-white py-20">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl max-w-3xl mx-auto mb-6">
            One plan, all features included. Start your 14-day free trial today.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-5">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#0A74DA]">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Everything you need to transform your dealership</p>
                
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center gap-2 bg-[#0A74DA] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300">
                    Start Free Trial
                    <ArrowRight size={18} />
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white text-gray-800 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors duration-300">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you understand how CleverCompanion can work for your dealership.
          </p>
          <button className="bg-[#0A74DA] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;