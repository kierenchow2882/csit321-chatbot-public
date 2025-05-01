import React from 'react';
import { ArrowRight, Settings, MessageCircle, BarChart3, PieChart, Users, Car, DollarSign } from 'lucide-react';

const FeatureSection: React.FC<{
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  reversed?: boolean;
}> = ({ title, description, imageSrc, imageAlt, features, reversed = false }) => (
  <div className={`py-16 ${reversed ? 'bg-gray-50' : 'bg-white'}`}>
    <div className="container mx-auto px-5">
      <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
        <div className="w-full lg:w-1/2">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full rounded-xl shadow-lg"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 mb-8">{description}</p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-[#0A74DA] text-white py-20">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Modern Dealerships</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Discover how SmartDealer's AI-powered tools can transform your customer interactions,
            streamline operations, and drive more sales.
          </p>
          <button className="bg-white text-[#0A74DA] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-2">
            Get Started Free
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Feature Sections */}
      <FeatureSection
        title="Conversational AI Chatbot"
        description="Our advanced AI chatbot engages customers in natural conversations, providing immediate responses to their queries about vehicle specifications, pricing, and availability."
        imageSrc="https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="AI Chatbot Interface"
        features={[
          {
            icon: <MessageCircle className="h-5 w-5 text-[#0A74DA]" />,
            title: "Natural Language Processing",
            description: "Understands customer queries regardless of how they're phrased."
          },
          {
            icon: <Settings className="h-5 w-5 text-[#0A74DA]" />,
            title: "Customizable Responses",
            description: "Tailor the chatbot's personality and responses to match your dealership's brand."
          },
          {
            icon: <Users className="h-5 w-5 text-[#0A74DA]" />,
            title: "Seamless Human Handoff",
            description: "Transfers complex conversations to your sales team when necessary."
          }
        ]}
      />

      <FeatureSection
        title="Inventory Management Integration"
        description="SmartDealer connects directly to your inventory management system, ensuring customers always receive up-to-date information about vehicle availability and specifications."
        imageSrc="https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Inventory Dashboard"
        features={[
          {
            icon: <Car className="h-5 w-5 text-[#0A74DA]" />,
            title: "Real-time Inventory Updates",
            description: "Always provides customers with current availability information."
          },
          {
            icon: <DollarSign className="h-5 w-5 text-[#0A74DA]" />,
            title: "Pricing Information",
            description: "Transparently communicates pricing, incentives, and special offers."
          },
          {
            icon: <Settings className="h-5 w-5 text-[#0A74DA]" />,
            title: "Specification Details",
            description: "Answers detailed questions about vehicle features and specifications."
          }
        ]}
        reversed
      />

      <FeatureSection
        title="Advanced Analytics Dashboard"
        description="Gain valuable insights into customer interactions, preferences, and conversion metrics with our comprehensive analytics dashboard."
        imageSrc="https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Analytics Dashboard"
        features={[
          {
            icon: <BarChart3 className="h-5 w-5 text-[#0A74DA]" />,
            title: "Conversation Analytics",
            description: "Track customer queries, popular topics, and satisfaction rates."
          },
          {
            icon: <PieChart className="h-5 w-5 text-[#0A74DA]" />,
            title: "Lead Quality Metrics",
            description: "Analyze lead sources, qualification rates, and conversion performance."
          },
          {
            icon: <Users className="h-5 w-5 text-[#0A74DA]" />,
            title: "Customer Behavior Insights",
            description: "Understand customer preferences and shopping patterns."
          }
        ]}
      />

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join hundreds of dealerships already benefiting from SmartDealer's powerful AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#0A74DA] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 inline-flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight size={18} />
            </button>
            <button className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300 inline-flex items-center justify-center">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;