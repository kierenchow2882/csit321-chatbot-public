import React, { useState, useEffect } from 'react';
import { Heart, Info, DollarSign, ArrowRight, Calendar } from 'lucide-react';
import { Vehicle } from '../types';
import { useNavigate } from 'react-router-dom';
import { createTestDrive, getProfile } from '../lib/api';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [testDriveForm, setTestDriveForm] = useState({
    booking_date: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      // User not authenticated
      setUser(null);
    }
  };

  const handleViewDetails = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  const handleFinanceCalculator = () => {
    navigate(`/finance?vehicle=${vehicle.id}`);
  };

  const handleTestDriveClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    setShowTestDriveModal(true);
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || !user) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting test drive booking...');

      const testDriveData = {
        vehicle_id: vehicle.id,
        customer_name: `${user.user.first_name || ''} ${user.user.last_name || ''}`.trim() || user.user.email,
        customer_email: user.user.email,
        customer_phone: user.phone || '',
        booking_date: testDriveForm.booking_date,
        notes: testDriveForm.notes
      };

      console.log('Test drive data:', testDriveData);

      const response = await createTestDrive(testDriveData);
      console.log('Test drive booking response:', response);

      // Show success message
      alert('Test drive booked successfully! We will contact you soon to confirm the details.');

      // Close modal and reset form
      setShowTestDriveModal(false);
      setTestDriveForm({
        booking_date: '',
        notes: ''
      });

    } catch (error: any) {
      console.error('Error booking test drive:', error);

      let errorMessage = 'Failed to book test drive. Please try again.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would normally save to favorites in the backend
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    const firstName = user.user.first_name || '';
    const lastName = user.user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.user.email;
  };

  return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div className="relative">
            <div className="h-56 overflow-hidden">
              <img
                  src={vehicle.image_url || vehicle.imageUrl}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <button
                onClick={toggleFavorite}
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                aria-label="Add to favorites"
            >
              <Heart
                  size={20}
                  className={`transition-colors ${
                      isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                  }`}
              />
            </button>

            {vehicle.featured && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-800">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <span className="text-xl font-bold text-blue-600">
              ${vehicle.price.toLocaleString()}
            </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
              {vehicle.mileage.toLocaleString()} mi
            </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
              {vehicle.transmission}
            </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
              {vehicle.fuel_type || vehicle.fuelType}
            </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
              {vehicle.color}
            </span>
            </div>

            <p className="mt-3 text-gray-600 line-clamp-2">{vehicle.description}</p>

            <div className="mt-4 flex gap-2">
              <button
                  onClick={handleViewDetails}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
              >
                View Details <ArrowRight size={16} className="ml-1" />
              </button>
              <button
                  onClick={handleTestDriveClick}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center justify-center"
                  title="Book Test Drive"
              >
                <Calendar size={18} />
              </button>
              <button
                  onClick={handleFinanceCalculator}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center justify-center"
                  title="Finance Calculator"
              >
                <DollarSign size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Test Drive Modal */}
        {showTestDriveModal && user && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Book Test Drive</h3>
                <p className="text-gray-600 mb-4">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>

                <form onSubmit={handleTestDriveSubmit}>
                  <div className="space-y-4">
                    {/* User Information (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                          type="text"
                          value={getUserDisplayName()}
                          disabled
                          className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Update your name in your <button
                          type="button"
                          onClick={() => navigate('/profile')}
                          className="text-blue-600 hover:underline"
                      >
                        profile settings
                      </button>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                          type="email"
                          value={user.user.email}
                          disabled
                          className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Phone Number
                      </label>
                      <input
                          type="tel"
                          value={user.phone || 'Not provided'}
                          disabled
                          className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      {!user.phone && (
                          <p className="text-xs text-gray-500 mt-1">
                            Add your phone number in your <button
                              type="button"
                              onClick={() => navigate('/profile')}
                              className="text-blue-600 hover:underline"
                          >
                            profile settings
                          </button>
                          </p>
                      )}
                    </div>

                    {/* Editable Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date & Time *
                      </label>
                      <input
                          type="datetime-local"
                          required
                          value={testDriveForm.booking_date}
                          onChange={(e) => setTestDriveForm({...testDriveForm, booking_date: e.target.value})}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          min={new Date().toISOString().slice(0, 16)}
                          disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                          value={testDriveForm.notes}
                          onChange={(e) => setTestDriveForm({...testDriveForm, notes: e.target.value})}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Any special requests or questions?"
                          disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowTestDriveModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Booking...' : 'Book Test Drive'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </>
  );
};

export default VehicleCard;