import React from 'react';
import { RecentActivity as RecentActivityType } from '../types';

interface RecentActivityProps {
  activities: RecentActivityType[];
  isLoading?: boolean;
}

export default function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex flex-col">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.userName}</span> {activity.action}
              </p>
              <span className="text-xs text-gray-500">{activity.timeAgo}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 