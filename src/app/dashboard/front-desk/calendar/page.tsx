'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // February 2025
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month');

  // Mock events data
  const events = [
    { id: 1, title: 'Office meeting', date: 3, type: 'meeting', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 2, title: 'Planned event', date: 16, type: 'planned', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 3, title: 'Planned event', date: 20, type: 'planned', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 4, title: 'Planned event', date: 25, type: 'planned', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];


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
  const currentYear = currentDate.getFullYear();

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
                  const dayEvents = events.filter(event => event.date === dayInfo.day && dayInfo.isCurrentMonth);
                  
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
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded border ${event.color} truncate`}
                          >
                            {event.title}
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