'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface FormData {
  // Customer Information
  customerName: string;
  phoneNumber: string;
  emailAddress: string;
  
  // Device Information
  device: string;
  deviceDetails: string;
  devicePrice: string;
  
  // Delivery Information
  country: string;
  state: string;
  city: string;
  street: string;
  deliveryFee: string;
}

export default function PlaceOrder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phoneNumber: '+234 802 063 1277',
    emailAddress: 'customer@example.com',
    device: '',
    deviceDetails: 'Storage, color, condition, accessories included...',
    devicePrice: 'N150,000.00',
    country: '',
    state: '',
    city: '',
    street: '',
    deliveryFee: 'N20,000.00'
  });

  const steps = [
    {
      number: 1,
      title: 'Customer Information',
      fields: ['Customer Name', 'Phone Number', 'Email Address']
    },
    {
      number: 2,
      title: 'Device Information',
      fields: ['Device', 'Device Details', 'Device Price']
    },
    {
      number: 3,
      title: 'Delivery Information',
      fields: ['Delivery Address', 'Delivery Fee']
    },
    {
      number: 4,
      title: 'Order Summary',
      fields: []
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmitOrder = () => {
    console.log('Order submitted:', formData);
    // Handle order submission logic here
  };

  const handleClearForm = () => {
    setFormData({
      customerName: '',
      phoneNumber: '+234 802 063 1277',
      emailAddress: 'customer@example.com',
      device: '',
      deviceDetails: 'Storage, color, condition, accessories included...',
      devicePrice: 'N150,000.00',
      country: '',
      state: '',
      city: '',
      street: '',
      deliveryFee: 'N20,000.00'
    });
    setCurrentStep(1);
  };

  const calculateTotal = () => {
    const devicePrice = parseFloat(formData.devicePrice.replace(/[N,]/g, '')) || 0;
    const deliveryFee = parseFloat(formData.deliveryFee.replace(/[N,]/g, '')) || 0;
    return (devicePrice + deliveryFee).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="border-b border-gray-200 mb-6 p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-xl lg:text-xl font-bold text-gray-900">Place Order</h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentStep === 4 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {currentStep === 4 ? 'Success' : 'In progress'}
            </span>
          </div>
          <p className="text-gray-600 text-sm lg:text-sm">Place a new order for your customer</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Progress Steps - Left Sidebar */}
          <div className="lg:w-80 xl:w-96">
            <div className="p-4 lg:p-4">
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number === currentStep 
                        ? 'bg-pink-500 text-white' 
                        : step.number < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm lg:text-base ${
                        step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <div className="mt-1 space-y-1">
                        {step.fields.map((field, index) => (
                          <div key={index} className={`w-2 h-2 rounded-full ${
                            step.number < currentStep ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-4 lg:p-4">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter customer's full name"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleContinue}
                    className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Device Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device
                    </label>
                    <select
                      value={formData.device}
                      onChange={(e) => handleInputChange('device', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select the device</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                      <option value="iPhone 14">iPhone 14</option>
                      <option value="Samsung Galaxy S23">Samsung Galaxy S23</option>
                      <option value="iPad Pro">iPad Pro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Details
                    </label>
                    <textarea
                      rows={4}
                      value={formData.deviceDetails}
                      onChange={(e) => handleInputChange('deviceDetails', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Price
                    </label>
                    <input
                      type="text"
                      value={formData.devicePrice}
                      onChange={(e) => handleInputChange('devicePrice', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleContinue}
                    className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 3: Delivery Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Enter State"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee
                    </label>
                    <input
                      type="text"
                      placeholder="Enter delivery fee"
                      value={formData.deliveryFee}
                      onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleContinue}
                    className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 4: Order Summary */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Price
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {formData.devicePrice}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      {formData.deliveryFee}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold text-orange-600 mb-2">
                      Total Amount
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-semibold">
                      N{calculateTotal()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleSubmitOrder}
                      className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    >
                      Submit Order 🛒
                    </button>
                    
                    <button
                      onClick={handleClearForm}
                      className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}