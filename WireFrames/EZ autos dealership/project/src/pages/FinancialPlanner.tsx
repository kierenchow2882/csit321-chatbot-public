import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Search, Car } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getVehicles, getVehicleById } from '../lib/api';
import { Vehicle } from '../types';

const FinancialPlanner: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('3.99');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    fetchVehicles();

    // Check if vehicle ID is passed in URL
    const urlParams = new URLSearchParams(location.search);
    const vehicleId = urlParams.get('vehicle');
    if (vehicleId) {
      setSelectedVehicle(vehicleId);
    }
  }, [location.search]);

  useEffect(() => {
    // Filter vehicles based on search term
    if (vehicleSearch) {
      const filtered = vehicles.filter(vehicle =>
          `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(vehicleSearch.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles.slice(0, 10)); // Show first 10 vehicles by default
    }
  }, [vehicleSearch, vehicles]);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
      setFilteredVehicles(data.slice(0, 10)); // Show first 10 by default
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return 0;

    const principal = vehicle.price - Number(downPayment || 0);
    const rate = Number(interestRate) / 100 / 12;
    const numberOfPayments = Number(loanTerm);

    if (rate === 0) {
      return (principal / numberOfPayments).toFixed(2);
    }

    const monthlyPayment =
        (principal * rate * Math.pow(1 + rate, numberOfPayments)) /
        (Math.pow(1 + rate, numberOfPayments) - 1);

    return monthlyPayment.toFixed(2);
  };

  const calculateTotalInterest = () => {
    const monthlyPayment = Number(calculateMonthlyPayment());
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return 0;

    const principal = vehicle.price - Number(downPayment || 0);
    const totalPayments = monthlyPayment * Number(loanTerm);
    const totalInterest = totalPayments - principal;

    return Math.max(0, totalInterest).toFixed(2);
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle.id);
    setVehicleSearch(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowVehicleDropdown(false);
  };

  const handleSearchFocus = () => {
    setShowVehicleDropdown(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowVehicleDropdown(false), 200);
  };

  return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Planner</h1>
              <p className="text-gray-600 mb-8">Calculate your monthly payments and explore financing options for your dream vehicle.</p>

              {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vehicles...</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Vehicle Selection & Loan Terms */}
                    <div className="space-y-6">
                      {/* Vehicle Selection */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Selection</h2>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search & Select Vehicle
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by year, make, or model..."
                                value={vehicleSearch}
                                onChange={(e) => setVehicleSearch(e.target.value)}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Vehicle Dropdown */}
                          {showVehicleDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredVehicles.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-center">
                                      No vehicles found matching your search
                                    </div>
                                ) : (
                                    filteredVehicles.map(vehicle => (
                                        <button
                                            key={vehicle.id}
                                            onClick={() => handleVehicleSelect(vehicle)}
                                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div className="font-medium text-gray-900">
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {vehicle.mileage.toLocaleString()} mi • {vehicle.fuel_type || vehicle.fuelType}
                                              </div>
                                            </div>
                                            <div className="text-lg font-semibold text-blue-600">
                                              ${vehicle.price.toLocaleString()}
                                            </div>
                                          </div>
                                        </button>
                                    ))
                                )}

                                {vehicleSearch && filteredVehicles.length > 0 && vehicles.length > filteredVehicles.length && (
                                    <div className="p-3 text-center text-sm text-gray-500 border-t border-gray-200">
                                      Showing {filteredVehicles.length} of {vehicles.length} vehicles
                                    </div>
                                )}
                              </div>
                          )}
                        </div>

                        {/* Selected Vehicle Display */}
                        {selectedVehicleData && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3">
                                <Car className="text-blue-600" size={24} />
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {selectedVehicleData.year} {selectedVehicleData.make} {selectedVehicleData.model}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {selectedVehicleData.mileage.toLocaleString()} miles • {selectedVehicleData.fuel_type || selectedVehicleData.fuelType}
                                  </div>
                                </div>
                                <div className="ml-auto text-xl font-bold text-blue-600">
                                  ${selectedVehicleData.price.toLocaleString()}
                                </div>
                              </div>
                            </div>
                        )}

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Down Payment
                          </label>
                          <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(e.target.value)}
                                placeholder="Enter down payment"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {selectedVehicleData && (
                              <div className="mt-2 flex gap-2">
                                {[10, 15, 20].map(percentage => {
                                  const amount = Math.round(selectedVehicleData.price * (percentage / 100));
                                  return (
                                      <button
                                          key={percentage}
                                          onClick={() => setDownPayment(amount.toString())}
                                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                                      >
                                        {percentage}% (${amount.toLocaleString()})
                                      </button>
                                  );
                                })}
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Loan Terms */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Terms</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Loan Term
                            </label>
                            <div className="relative">
                              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <select
                                  value={loanTerm}
                                  onChange={(e) => setLoanTerm(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="36">36 months (3 years)</option>
                                <option value="48">48 months (4 years)</option>
                                <option value="60">60 months (5 years)</option>
                                <option value="72">72 months (6 years)</option>
                                <option value="84">84 months (7 years)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Interest Rate (APR)
                            </label>
                            <div className="relative">
                              <input
                                  type="number"
                                  step="0.01"
                                  value={interestRate}
                                  onChange={(e) => setInterestRate(e.target.value)}
                                  className="w-full pr-8 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Rates vary based on credit score and loan terms
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Payment Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Summary</h2>

                      {!selectedVehicleData ? (
                          <div className="text-center py-8">
                            <Car className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500">Select a vehicle to see payment calculations</p>
                          </div>
                      ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Vehicle Price</span>
                              <span className="font-semibold text-lg">
                          ${selectedVehicleData.price.toLocaleString()}
                        </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Down Payment</span>
                              <span className="font-semibold">
                          ${Number(downPayment || 0).toLocaleString()}
                        </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Loan Amount</span>
                              <span className="font-semibold">
                          ${(selectedVehicleData.price - Number(downPayment || 0)).toLocaleString()}
                        </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Loan Term</span>
                              <span className="font-semibold">{loanTerm} months</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Interest Rate</span>
                              <span className="font-semibold">{interestRate}% APR</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-600">Total Interest</span>
                              <span className="font-semibold">
                          ${Number(calculateTotalInterest()).toLocaleString()}
                        </span>
                            </div>

                            <div className="mt-6 p-4 bg-blue-600 text-white rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Estimated Monthly Payment</span>
                                <span className="text-2xl font-bold">
                            ${Number(calculateMonthlyPayment()).toLocaleString()}
                          </span>
                              </div>
                            </div>

                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> This is an estimate. Actual rates and terms may vary based on credit approval, down payment, and other factors.
                              </p>
                            </div>
                          </div>
                      )}

                      <button
                          disabled={!selectedVehicleData}
                          className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Calculator size={20} />
                        Get Pre-Approved
                      </button>

                      <p className="mt-3 text-xs text-gray-500 text-center">
                        Pre-approval does not guarantee final loan approval
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default FinancialPlanner;