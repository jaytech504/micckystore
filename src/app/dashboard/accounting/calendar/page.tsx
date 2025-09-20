'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { eventsApi, Event } from '@/api/eventsApi';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Fetch events for the current month
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsApi.getEvents({
        month: currentDate.getMonth() + 1, // API expects 1-12, Date.getMonth() returns 0-11
        year: currentDate.getFullYear()
      });
      setEvents(response.data?.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when component mounts or month changes
  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

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

  // Helper function to get event color based on event data
  const getEventColor = (event: Event) => {
    // You can customize this logic based on your needs
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-red-100 text-red-800 border-red-200'
    ];
    const index = event.name.length % colors.length;
    return colors[index];
  };

  const days = getDaysInMonth(currentDate);
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Helper function to get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Calendar */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentDate(new Date())}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
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
              {/* Loading and Error States */}
              {loading && (
                <div className="text-center py-4 text-gray-500">
                  Loading events...
                </div>
              )}
              {error && (
                <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
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
                  const dayEvents = dayInfo.isCurrentMonth ? getEventsForDay(dayInfo.day) : [];
                  
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
                        {dayEvents.map((event) => (
                          <div
                            key={event._id}
                            className={`text-xs px-1 py-0.5 rounded border ${getEventColor(event)} truncate`}
                            title={`${event.name} - ${event.time} - ${event.location}`}
                          >
                            {event.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;