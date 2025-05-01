import React from 'react';
import {
  MessageCircle,
  Clock,
  Users,
  Car,
  Calendar,
  Calculator,
  Settings,
  Shield,
  Link as LinkIcon,
} from 'lucide-react';

const features = [
  {
    icon: <MessageCircle className="h-6 w-6 text-[#0A74DA]" />,
    title: 'Smart Customer Engagement',
    description:
      'Instant car recommendations based on preferences, 24/7 automated support, and seamless live agent handoff.',
  },
  {
    icon: <Users className="h-6 w-6 text-[#0A74DA]" />,
    title: 'Sales & Lead Generation',
    description:
      'Schedule test drives, receive real-time notifications, and calculate loans instantly.',
  },
  {
    icon: <Settings className="h-6 w-6 text-[#0A74DA]" />,
    title: 'Dealer & Admin Tools',
    description:
      'Manage users, customize chatbot responses, and access comprehensive chat analytics.',
  },
  {
    icon: <Shield className="h-6 w-6 text-[#0A74DA]" />,
    title: 'Trust & Security',
    description:
      'Enhanced credibility with verified accounts and secure data handling compliant with privacy regulations.',
  },
  {
    icon: <LinkIcon className="h-6 w-6 text-[#0A74DA]" />,
    title: 'Integration & Scalability',
    description:
      'Seamless integration with your existing CRM and dealership systems for inventory and lead management.',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600">
            Discover how CleverCompanion's AI-powered features can revolutionize
            your dealership's operations and customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
