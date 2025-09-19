'use client';

import React, { useState, useEffect } from 'react';
import { User, MessageSquare, CheckCircle, Lock, Wrench, Bell, Filter, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { systemFeaturesApi, Notification } from '@/api/systemFeaturesApi';

const NotificationsPage = () => {
  // State management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Calculate unread count from notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await systemFeaturesApi.getNotifications();
      
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      setError('Error loading notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await systemFeaturesApi.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read (client-side only since API doesn't support it)
  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read individually
      const unreadNotifications = notifications.filter(notification => !notification.read);
      const promises = unreadNotifications.map(notification => 
        systemFeaturesApi.markNotificationAsRead(notification._id)
      );
      
      await Promise.all(promises);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Refresh notifications
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Filter notifications client-side
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const categoryMatch = filterCategory === 'all' || notification.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  // Load data on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get notification icon based on type and category
  const getNotificationIcon = (notification: Notification) => {
    const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center";
    
    switch (notification.type) {
      case 'info':
        return <div className={`${baseClasses} bg-blue-100`}><Bell className="w-6 h-6 text-blue-500" /></div>;
      case 'warning':
        return <div className={`${baseClasses} bg-yellow-100`}><Wrench className="w-6 h-6 text-yellow-500" /></div>;
      case 'error':
        return <div className={`${baseClasses} bg-red-100`}><Lock className="w-6 h-6 text-red-500" /></div>;
      case 'success':
        return <div className={`${baseClasses} bg-green-100`}><CheckCircle className="w-6 h-6 text-green-500" /></div>;
      default:
        return <div className={`${baseClasses} bg-gray-100`}><MessageSquare className="w-6 h-6 text-gray-500" /></div>;
    }
  };

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just Now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
              <p className="text-gray-600 text-sm">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                  : 'All caught up!'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="system">System</option>
            <option value="user">User</option>
            <option value="transaction">Transaction</option>
            <option value="inventory">Inventory</option>
            <option value="repair">Repair</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-gray-600">Loading notifications...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-sm">You're all caught up! Check back later for new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
              <div 
                    key={notification._id} 
                    onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                className={`p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === filteredNotifications.length - 1 ? 'rounded-b-lg' : ''
                } ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                      {/* Icon */}
                  <div className="flex-shrink-0">
                        {getNotificationIcon(notification)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-semibold text-gray-900">
                                {notification.message}
                        </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {notification.category}
                              </span>
                              {notification.priority !== 'low' && (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                                  notification.priority === 'urgent' ? 'bg-red-200 text-red-700' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {notification.priority}
                                </span>
                              )}
                            </div>
                      </div>
                      
                      {/* Timestamp */}
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                              {formatTimestamp(notification.createdAt)}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;