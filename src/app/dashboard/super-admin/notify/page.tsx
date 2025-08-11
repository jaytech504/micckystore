'use client';

import React from 'react';
import { User, MessageSquare, CheckCircle, Lock, Wrench } from 'lucide-react';
import Image from 'next/image';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'leave-request',
      icon: <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <Image src="/api/placeholder/48/48" alt="Samuel" className="w-12 h-12 rounded-full object-cover" />
      </div>,
      title: 'Leave Request',
      description: '@Samuel has applied for a one year leave',
      timestamp: 'Just Now',
      hasAvatar: true
    },
    {
      id: 2,
      type: 'clock-issue',
      icon: <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-orange-500" />
      </div>,
      title: 'Clock In Issue',
      description: '@Nifemi shared a message regarding Clock in issue',
      timestamp: '11:16 AM',
      hasAvatar: false
    },
    {
      id: 3,
      type: 'completed-task',
      icon: <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
        <User className="w-6 h-6 text-yellow-500" />
      </div>,
      title: 'Completed task',
      description: '@Dennis Watson has completed his task',
      timestamp: '09:00 AM',
      hasAvatar: false
    },
    {
      id: 4,
      type: 'feedback',
      icon: <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <Image src="/api/placeholder/48/48" alt="Shingami" className="w-12 h-12 rounded-full object-cover" />
      </div>,
      title: 'Shingami has share his feedback',
      description: '"It was an amazing experience with your organisation"',
      timestamp: 'Yesterday',
      hasAvatar: true
    },
    {
      id: 5,
      type: 'password-update',
      icon: <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
        <Lock className="w-6 h-6 text-yellow-500" />
      </div>,
      title: 'Password Update successfully',
      description: 'Your password has been updated successfully',
      timestamp: 'Yesterday',
      hasAvatar: false
    },
    {
      id: 6,
      type: 'repair-ticket',
      icon: <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
        <User className="w-6 h-6 text-yellow-500" />
      </div>,
      title: 'Repair Ticket created',
      description: 'Chineye created a repair ticket',
      timestamp: '',
      hasAvatar: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-600 text-sm">All Notifications</p>
        </div>

        {/* Notifications List */}
        <div className="bg-none rounded-lg shadow-sm border">
          <div className="divide-y divide-gray-100">
            {notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className={`p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === notifications.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon/Avatar */}
                  <div className="flex-shrink-0">
                    {notification.hasAvatar ? (
                      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                        <div className="w-full h-full bg-gray-400"></div>
                      </div>
                    ) : (
                      notification.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.description}
                        </p>
                      </div>
                      
                      {/* Timestamp */}
                      {notification.timestamp && (
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                            {notification.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;