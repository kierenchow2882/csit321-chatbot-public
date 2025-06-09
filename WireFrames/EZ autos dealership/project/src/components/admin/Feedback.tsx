import React, { useState, useEffect } from 'react';
import { Search, Star, Filter } from 'lucide-react';
import { getFeedback, createFeedback } from '../../lib/api';

interface FeedbackItem {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  category: string;
  status: string;
  created_at: string;
}

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await getFeedback();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await createFeedback({ id, status: 'archived' });
      fetchFeedback();
    } catch (error) {
      console.error('Error archiving feedback:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const categories = ['All', 'Service', 'Product', 'Website', 'Support'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Feedback & Reviews</h2>
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search feedback..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedback.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(item.rating)}
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                  {item.category}
                </span>
              </div>
              <button
                onClick={() => handleArchive(item.id)}
                className="text-gray-600 hover:text-gray-900"
              >
                Archive
              </button>
            </div>
            <p className="text-gray-600 mt-2">{item.comment}</p>
            <div className="mt-4 text-sm text-gray-500">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;