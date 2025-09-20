'use client'; 

import React, { useState, useEffect } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { useEventOperations, useEvent } from '../../hooks/useEvents';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { useSearchParams, useRouter } from 'next/navigation';

const AddNewEventPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const isEditMode = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    date: '',
    location: '',
    additionalInfo: '',
    attendees: [] as string[]
  });

  const [timeInput, setTimeInput] = useState({
    hours: '12',
    minutes: '00',
    ampm: 'AM'
  });

  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  // Event operations
  const { createEvent, updateEvent, loading: operationLoading, error: operationError } = useEventOperations();
  
  // Fetch employees for attendee selection
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees({ limit: 100 });
  
  // Fetch event data if in edit mode
  const { event, loading: eventLoading, error: eventError } = useEvent(isEditMode || '');

  // Update form data when event is loaded (edit mode)
  useEffect(() => {
    if (event && isEditMode) {
      // Parse 12-hour format time (e.g., "2:30 PM")
      const parseTime12Hour = (time12: string) => {
        const [time, ampm] = time12.split(' ');
        const [hours, minutes] = time.split(':');
        return {
          hours: hours,
          minutes: minutes,
          ampm: ampm
        };
      };

      const parsedTime = parseTime12Hour(event.time);
      setTimeInput(parsedTime);

      setFormData({
        name: event.name,
        time: event.time,
        date: event.date,
        location: event.location,
        additionalInfo: event.additionalInfo || '',
        attendees: event.attendees
      });
      setSelectedAttendees(event.attendees);
    }
  }, [event, isEditMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (field: 'hours' | 'minutes' | 'ampm', value: string) => {
    const newTimeInput = {
      ...timeInput,
      [field]: value
    };
    setTimeInput(newTimeInput);
    
    // Update formData with the complete time string
    const timeString = `${newTimeInput.hours}:${newTimeInput.minutes} ${newTimeInput.ampm}`;
    setFormData(prev => ({
      ...prev,
      time: timeString
    }));
  };

  const handleAttendeeToggle = (employeeId: string) => {
    setSelectedAttendees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.time || !formData.date || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const eventData = {
      ...formData,
      attendees: selectedAttendees
    };

    try {
      if (isEditMode) {
        await updateEvent(isEditMode, eventData);
        alert('Event updated successfully!');
      } else {
        await createEvent(eventData);
        alert('Event created successfully!');
      }
      router.push('/dashboard/super-admin/calendar');
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(emp => emp._id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Event' : 'Add New Event'}
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          {eventLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#FBB906]" />
              <span className="ml-2">Loading event...</span>
            </div>
          ) : eventError ? (
            <div className="text-red-500 text-center py-8">
              Error loading event: {eventError}
            </div>
          ) : employeesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#FBB906]" />
              <span className="ml-2">Loading employees...</span>
            </div>
          ) : employeesError ? (
            <div className="text-red-500 text-center py-8">
              Error loading employees: {employeesError}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <div className="flex items-center space-x-2">
                    {/* Hours */}
                    <select
                      value={timeInput.hours}
                      onChange={(e) => handleTimeChange('hours', e.target.value)}
                      className="flex-1 text-gray-700 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 1;
                        return (
                          <option key={hour} value={hour.toString()}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                    
                    <span className="text-gray-500 font-medium">:</span>
                    
                    {/* Minutes */}
                    <select
                      value={timeInput.minutes}
                      onChange={(e) => handleTimeChange('minutes', e.target.value)}
                      className="flex-1 text-gray-700 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    >
                      {Array.from({ length: 60 }, (_, i) => {
                        const minute = i.toString().padStart(2, '0');
                        return (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        );
                      })}
                    </select>
                    
                    {/* AM/PM */}
                    <select
                      value={timeInput.ampm}
                      onChange={(e) => handleTimeChange('ampm', e.target.value)}
                      className="flex-1 text-gray-700 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date and Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  placeholder="Enter additional information about the event"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={3}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 resize-none"
                />
              </div>

              {/* Attendees Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendees
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setShowAttendeeModal(true)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Select Attendees ({selectedAttendees.length})
                  </button>
                  {selectedAttendees.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedAttendees([])}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                {/* Selected Attendees Display */}
                {selectedAttendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedAttendees.map(attendeeId => (
                      <span
                        key={attendeeId}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {getEmployeeName(attendeeId)}
                        <button
                          type="button"
                          onClick={() => handleAttendeeToggle(attendeeId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="bg-[#E866B7] hover:bg-pink-400 text-white px-12 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {operationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Event' : 'Create Event'
                  )}
                </button>
              </div>

              {operationError && (
                <div className="text-red-500 text-center text-sm">
                  {operationError}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Attendee Selection Modal */}
        {showAttendeeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Attendees</h3>
                <button
                  onClick={() => setShowAttendeeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {employeesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FBB906]" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {employees?.map(employee => (
                      <label key={employee._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(employee._id)}
                          onChange={() => handleAttendeeToggle(employee._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({employee.role})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowAttendeeModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAttendeeModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AddNewEventPageWithAuth = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <AddNewEventPage />
    </ProtectedRoute>
  );
};

export default AddNewEventPageWithAuth;