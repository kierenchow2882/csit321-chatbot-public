import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, DollarSign, Heart, Share2,
    Fuel, Gauge, Palette, Settings, Car, MapPin,
    Phone, Mail, Star, CheckCircle, Info
} from 'lucide-react';
import { getVehicleById } from '../lib/api';
import { Vehicle } from '../types';

const VehicleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showTestDriveModal, setShowTestDriveModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [testDriveForm, setTestDriveForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: '',
        notes: ''
    });

    useEffect(() => {
        if (id) {
            fetchVehicleDetails();
        }
    }, [id]);

    const fetchVehicleDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getVehicleById(id!);
            if (data) {
                setVehicle(data);
            } else {
                setError('Vehicle not found');
            }
        } catch (err: any) {
            console.error('Error fetching vehicle details:', err);
            setError('Failed to load vehicle details');
        } finally {
            setLoading(false);
        }
    };

    const handleTestDriveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Here you would call the API to book a test drive
            console.log('Test drive booking:', {
                vehicle_id: vehicle?.id,
                ...testDriveForm
            });

            alert('Test drive booked successfully! We will contact you soon to confirm the details.');
            setShowTestDriveModal(false);
            setTestDriveForm({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                booking_date: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error booking test drive:', error);
            alert('Failed to book test drive. Please try again.');
        }
    };

    const handleFinanceCalculator = () => {
        navigate(`/finance?vehicle=${vehicle?.id}`);
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`,
                text: `Check out this ${vehicle?.year} ${vehicle?.make} ${vehicle?.model} for $${vehicle?.price.toLocaleString()}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Sample images for demonstration
    const vehicleImages = [
        vehicle?.image_url || vehicle?.imageUrl || '',
        'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ].filter(Boolean);

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || 'Vehicle not found'}</p>
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Main Image */}
                            <div className="relative h-96 bg-gray-200">
                                <img
                                    src={vehicleImages[selectedImageIndex]}
                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={toggleFavorite}
                                        className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm"
                                    >
                                        <Heart
                                            size={20}
                                            className={`${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                                        />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm"
                                    >
                                        <Share2 size={20} className="text-gray-600" />
                                    </button>
                                </div>
                                {vehicle.featured && (
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            <div className="p-4">
                                <div className="flex gap-2 overflow-x-auto">
                                    {vehicleImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${
                                                selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Car className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Make & Model</p>
                                            <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Year</p>
                                            <p className="font-semibold">{vehicle.year}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Gauge className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Mileage</p>
                                            <p className="font-semibold">{vehicle.mileage.toLocaleString()} miles</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Settings className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Transmission</p>
                                            <p className="font-semibold">{vehicle.transmission}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Fuel className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Fuel Type</p>
                                            <p className="font-semibold">{vehicle.fuel_type || vehicle.fuelType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Palette className="text-blue-600" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Color</p>
                                            <p className="font-semibold">{vehicle.color}</p>
                                        </div>
                                    </div>

                                    {vehicle.vin && (
                                        <div className="flex items-center gap-3">
                                            <Info className="text-blue-600" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">VIN</p>
                                                <p className="font-semibold font-mono text-sm">{vehicle.vin}</p>
                                            </div>
                                        </div>
                                    )}

                                    {vehicle.engine && (
                                        <div className="flex items-center gap-3">
                                            <Settings className="text-blue-600" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Engine</p>
                                                <p className="font-semibold">{vehicle.engine}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            {vehicle.features && vehicle.features.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {vehicle.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className="text-green-500" size={16} />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                            </div>

                            {/* Fuel Economy */}
                            {(vehicle.mpg_city || vehicle.mpg_highway || vehicle.range) && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Fuel Economy</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {vehicle.mpg_city && (
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">{vehicle.mpg_city}</p>
                                                <p className="text-sm text-gray-600">City MPG</p>
                                            </div>
                                        )}
                                        {vehicle.mpg_highway && (
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">{vehicle.mpg_highway}</p>
                                                <p className="text-sm text-gray-600">Highway MPG</p>
                                            </div>
                                        )}
                                        {vehicle.range && (
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">{vehicle.range}</p>
                                                <p className="text-sm text-gray-600">Range (miles)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Price & Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>
                                <div className="text-3xl font-bold text-blue-600">
                                    ${vehicle.price.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {vehicle.mileage.toLocaleString()} miles
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowTestDriveModal(true)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <Calendar size={20} />
                                    Schedule Test Drive
                                </button>

                                <button
                                    onClick={handleFinanceCalculator}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <DollarSign size={20} />
                                    Calculate Financing
                                </button>

                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors">
                                    Get Trade-In Value
                                </button>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-600" />
                                        <span className="text-sm text-gray-700">(555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-600" />
                                        <span className="text-sm text-gray-700">sales@ezautos.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-600" />
                                        <span className="text-sm text-gray-700">123 Auto Boulevard</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Customer Rating</span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className="text-yellow-400 fill-current"
                                            />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Drive Modal */}
            {showTestDriveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Schedule Test Drive</h3>
                        <p className="text-gray-600 mb-4">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>

                        <form onSubmit={handleTestDriveSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={testDriveForm.customer_name}
                                        onChange={(e) => setTestDriveForm({...testDriveForm, customer_name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={testDriveForm.customer_email}
                                        onChange={(e) => setTestDriveForm({...testDriveForm, customer_email: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={testDriveForm.customer_phone}
                                        onChange={(e) => setTestDriveForm({...testDriveForm, customer_phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

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
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTestDriveModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Schedule Test Drive
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;