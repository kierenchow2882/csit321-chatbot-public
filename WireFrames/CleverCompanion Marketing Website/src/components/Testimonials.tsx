import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "SmartDealer has completely transformed how we engage with potential customers. Our lead conversion rate has increased by 35% since implementation.",
    author: "Michael Chen",
    position: "General Manager, Parkway Auto Group",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    quote: "The AI chatbot handles routine inquiries so well that our sales team can focus on high-value activities. It's like having a tireless employee working 24/7.",
    author: "Sarah Johnson",
    position: "Digital Marketing Director, Liberty Motors",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    quote: "Our customers love getting instant answers about vehicle specs and financing options. SmartDealer has significantly improved our customer satisfaction scores.",
    author: "David Rodriguez",
    position: "Customer Experience Manager, Horizon Automotive",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Dealerships
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what our partners have to say about SmartDealer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md relative"
            >
              <div className="absolute top-6 right-8 text-blue-100">
                <Quote size={56} />
              </div>
              
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-white text-[#0A74DA] border border-[#0A74DA] px-6 py-2 rounded-lg font-medium hover:bg-[#0A74DA] hover:text-white transition-colors duration-300">
            Read More Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};