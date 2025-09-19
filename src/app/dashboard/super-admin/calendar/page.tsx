'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Eye, Edit, Trash2, X } from 'lucide-react';
import { useEvents, useUpcomingEvents, useEventOperations } from '../hooks/useEvents';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../../../../hooks/useAuth';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Get current user
  const { user } = useAuth();

  // Get current month and year for API calls
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch events for current month
  const { events, loading: eventsLoading, error: eventsError, refetchEvents } = useEvents({
    month: currentMonth,
    year: currentYear
  });

  // Fetch upcoming events
  const { events: upcomingEvents, loading: upcomingLoading, error: upcomingError } = useUpcomingEvents();

  // Event operations
  const { deleteEvent, loading: operationLoading } = useEventOperations();

  // Fetch employees for attendee names
  const { employees } = useEmployees({ limit: 100 });

  // Event colors based on type or random
  const getEventColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200'
    ];
    return colors[index % colors.length];
  };

  // Get attendee names from IDs
  const getAttendeeNames = (attendeeIds: string[]) => {
    if (!employees || !attendeeIds) return [];
    return attendeeIds.map(id => {
      const employee = employees.find(emp => emp._id === id);
      return employee ? { id, name: `${employee.firstName} ${employee.lastName}` } : { id, name: 'Unknown' };
    });
  };

  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        refetchEvents();
        setShowEventModal(false);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isToday: false
      });
    }

    // Add next month's days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const currentMonthName = monthNames[currentDate.getMonth()];

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="xl:w-70 space-y-6 bg-white rounded-lg p-4 shadow-sm border">
          {/* Add New Event Button */}
          <a href='/dashboard/super-admin/calendar/add-task'>
            <button className="w-full bg-[#E866B7] text-sm hover:bg-pink-400 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
              <Plus className="w-4 h-4" />
              Add New Event
            </button>
          </a>

          {/* You are going to section */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            {upcomingLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#FBB906]" />
              </div>
            ) : upcomingError ? (
              <div className="text-red-500 text-sm text-center py-4">
                Error loading upcoming events
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-4">
                No upcoming events
              </div>
            ) : (
            <div className="space-y-4">
                {upcomingEvents.slice(0, 4).map((event, index) => {
                  const attendeeNames = getAttendeeNames(event.attendees);
                  return (
                    <div key={event._id} className="space-y-2">
                      <h4 className="font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleEventClick(event)}>
                        {event.name}
                      </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{event.time}</p>
                    <p>{event.location}</p>
                        {event.additionalInfo && <p>{event.additionalInfo}</p>}
                  </div>
                  <div className="flex items-center space-x-1">
                        {attendeeNames.slice(0, 3).map((attendee) => (
                          <div key={attendee.id} className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                            {attendee.name.charAt(0)}
                          </div>
                        ))}
                        {attendeeNames.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                            +{attendeeNames.length - 3}
                          </div>
                        )}
                      </div>
                      {index < Math.min(upcomingEvents.length, 4) - 1 && <hr className="border-gray-200" />}
                  </div>
                  );
                })}
                </div>
            )}
            {upcomingEvents.length > 4 && (
            <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4">
              See More
            </button>
            )}
          </div>
        </div>

        {/* Main Calendar */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button className=" text-sm text-gray-600 hover:text-gray-900">
                    Today
                  </button>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 min-w-0">
                      {currentMonthName} {currentYear}
                    </h2>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['Day', 'Week', 'Month'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === mode
                          ? mode === 'Month' 
                            ? 'bg-[#FBB906] text-white'
                            : 'bg-[#FBB906] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((dayInfo, index) => {
                  // Filter events for this day
                  const dayEvents = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === dayInfo.day && dayInfo.isCurrentMonth;
                  });
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-20 sm:min-h-24 p-1 sm:p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !dayInfo.isCurrentMonth ? 'text-gray-400 bg-gray-50/50' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        !dayInfo.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {dayInfo.day}
                      </div>
                      <div className="space-y-1">
                        {eventsLoading ? (
                          <div className="flex justify-center">
                            <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                          </div>
                        ) : dayEvents.length > 0 ? (
                          dayEvents.map((event, eventIndex) => (
                            <div
                              key={event._id}
                              onClick={() => handleEventClick(event)}
                              className={`text-xs px-1 py-0.5 rounded border ${getEventColor(eventIndex)} truncate cursor-pointer hover:opacity-80`}
                            >
                              {event.name}
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.name}</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Time:</span>
                <p className="text-gray-900">{selectedEvent.time}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <p className="text-gray-900">{selectedEvent.location}</p>
              </div>
              {selectedEvent.additionalInfo && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Additional Info:</span>
                  <p className="text-gray-900">{selectedEvent.additionalInfo}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-600">Attendees:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {getAttendeeNames(selectedEvent.attendees).map((attendee) => (
                    <span key={attendee.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {attendee.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Navigate to edit page or open edit modal
                  window.location.href = `/dashboard/super-admin/calendar/add-task?edit=${selectedEvent._id}`;
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedEvent._id)}
                disabled={operationLoading}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {operationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarPageWithAuth = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <CalendarPage />
    </ProtectedRoute>
  );
};

export default CalendarPageWithAuth;