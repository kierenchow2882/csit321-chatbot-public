import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "What documentation do I need to purchase a vehicle?",
    answer: "To purchase a vehicle, you'll need a valid government-issued ID, proof of insurance, and proof of income if financing. Additional documents may be required depending on your payment method.",
    category: "Purchasing"
  },
  {
    question: "Do you offer vehicle financing?",
    answer: "Yes, we offer competitive financing options through our trusted lending partners. You can use our Financial Planner tool to estimate payments and apply for pre-approval.",
    category: "Financing"
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day/500-mile money-back guarantee on all vehicle purchases, allowing you to return the vehicle for a full refund if you're not completely satisfied.",
    category: "Policies"
  },
  {
    question: "Do you accept trade-ins?",
    answer: "Yes, we accept trade-ins and offer fair market value for your vehicle. You can get an instant estimate using our online trade-in calculator.",
    category: "Trade-ins"
  },
  {
    question: "What warranty options are available?",
    answer: "We offer various warranty packages including basic, extended, and comprehensive coverage. All pre-owned vehicles come with a minimum 90-day warranty.",
    category: "Warranty"
  },
  {
    question: "Can I test drive a vehicle before purchasing?",
    answer: "Absolutely! We encourage test drives of any vehicle you're interested in. You can schedule a test drive online or visit our dealership during business hours.",
    category: "Test Drive"
  }
];

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
        prev.includes(index)
            ? prev.filter(i => i !== index)
            : [...prev, index]
    );
  };

  const handleChatClick = () => {
    if (window.CleverCompanionWidget) {
      window.CleverCompanionWidget.open();
    } else if (window.startChat) {
      window.startChat();
    } else {
      alert('Chat service is not available at the moment. Please try again later.');
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-8">Find answers to common questions about our vehicles and services</p>

            <div className="mb-8">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map(category => (
                  <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {category}
                  </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                  <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                        onClick={() => toggleItem(index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {openItems.includes(index) ? (
                          <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </button>

                    {openItems.includes(index) && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    )}
                  </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Feel free to reach out to our customer support team.
              </p>
              <div className="flex gap-4">
                <a
                    href="/contact"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
                >
                  Contact Us
                </a>
                <button
                    onClick={handleChatClick}
                    className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Chat with Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FAQ;