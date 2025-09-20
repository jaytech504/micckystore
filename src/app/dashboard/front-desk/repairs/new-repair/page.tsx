'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { frontdeskApi } from '../../../../../api/frontdeskApi';

export default function RepairRequestForm() {
  // Helper to safely extract arrays from API responses
  const extractArray = <T,>(data: unknown, key?: string): T[] => {
    if (!data) return [];
    if (key && typeof data === 'object' && data !== null && key in (data as Record<string, unknown>)) {
      const maybe = (data as Record<string, unknown>)[key];
      return Array.isArray(maybe) ? (maybe as T[]) : [];
    }
    return Array.isArray(data) ? (data as T[]) : [];
  };
  // const [activeTab, setActiveTab] = useState('new-repair');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fault, setFault] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [tagEngineer, setTagEngineer] = useState('');
  const [engineers, setEngineers] = useState<Array<{ _id: string; firstName?: string; lastName?: string }>>([]);
  const [priorityLevel, setPriorityLevel] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        device: deviceName,
        issueReported: fault,
        diagnosis: diagnosisNotes,
        imei: serialNumber,
        assignedEngineer: tagEngineer,
        priorityLevel: priorityLevel,
        customerName: fullName,
        customerPhoneNumber: phoneNumber,
        customerEmail: email,
        customerAddress: '',
        expectedCompletionDate: estimatedDate,
        price: ''
      };

      await frontdeskApi.createRepair(payload);
      // redirect to repairs list after successful creation
      window.location.href = '/dashboard/front-desk/repairs';
    } catch (err) {
      console.error('Failed to create repair', err);
      alert('Failed to create repair ticket. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
  const res = await frontdeskApi.getUsers({ role: 'Engineer', limit: 100 });
  const data: unknown = res?.data;
  const list = extractArray<{ _id: string; firstName?: string; lastName?: string }>(data, 'users');
  setEngineers(list);
      } catch (err) {
        console.error('Failed to load engineers', err);
      }
    };

    fetchEngineers();
  }, []);

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span>New Repair</span>
          <span>›</span>
          <span>Repair ID</span>
          <span>›</span>
          <span className="text-gray-900">MSR-00086532</span>
        </nav>

        <div className="flex space-x-8 mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">
            New Repair Request
          </h3>
          <h3 className="text-lg font-medium text-green-500">
            Log a new customer repair ticket
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Full Name and Phone */}
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-red-600 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-red-600 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Column - Fault and Email */}
            <div className="space-y-6">
              <div>
                <label htmlFor="fault" className="block text-sm font-medium text-red-600 mb-2">
                  Fault
                </label>
                <div className="relative">
                  <textarea
                    id="fault"
                    value={fault}
                    onChange={(e) => setFault(e.target.value)}
                    placeholder="State the issue of the device here"
                    rows={4}
                    className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-red-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Item Details and IMEI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Item Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
              <div>
                <label htmlFor="deviceName" className="block text-sm font-medium text-red-600 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Device Name"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* IMEI */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imei</h2>
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number / IMEI (optional)
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Serial Number / IMEI (optional)"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Assignment and Priority */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assignment */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h2>
              <div>
                <label htmlFor="tagEngineer" className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Engineer
                </label>
                <div className="relative">
                  <select
                    id="tagEngineer"
                    value={tagEngineer}
                    onChange={(e) => setTagEngineer(e.target.value)}
                    className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-400">Select Engineer</option>
                    {engineers.map((eng) => (
                      <option key={eng._id} value={eng._id}>
                        {`${eng.firstName ?? 'Unknown'} ${eng.lastName ?? ''}`.trim()}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority</h2>
              <div>
                <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    id="priorityLevel"
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-400">Priority Level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis/Notes and Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Diagnosis/Notes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis/Notes</h2>
              <div className="relative">
                <textarea
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Add any note of the item while receiving it"
                  rows={4}
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Date */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Date</h2>
              <div>
                <label htmlFor="estimatedDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated completion date
                </label>
                <input
                  type="date"
                  id="estimatedDate"
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  placeholder="Date"
                  className="w-full px-3 py-3 text-gray-700 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <button
              type="submit"
              disabled={loading}
              className={`px-7 py-2.5 bg-[#E866B7] text-white font-medium rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-7 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}