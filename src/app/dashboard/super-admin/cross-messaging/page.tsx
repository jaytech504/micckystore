'use client';

import React, {useState} from 'react';
import { ChevronDown, MessageSquare, AlertTriangle, Clock, Users, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface MessagingStats {
  totalMessages: {
    count: number;
    percentageChange: number;
    timeframe: string;
  };
  unreadMessages: {
    count: number;
    percentageChange: number;
    timeframe: string;
  };
  avgResponseTime: {
    time: string;
    percentageChange: number;
    timeframe: string;
  };
  onlineSalesRep: {
    active: number;
    total: number;
    percentageChange: number;
    timeframe: string;
  };
}

interface MessageActivity {
  id: string;
  customer: string;
  channel: string;
  assignedTo: string;
  firstMessage: string;
  lastReply: string;
  status: 'Active' | 'Closed';
}

interface StaffPerformance {
  id: string;
  name: string;
  messagesHandled: number;
  avgResponse: string;
  unread: number;
  chatsClosed: number;
}

interface IntegrationStatus {
  whatsapp: {
    status: 'Connected' | 'Error';
    message?: string;
  };
  instagram: {
    status: 'Connected' | 'Error';
    message?: string;
  };
  facebook: {
    status: 'Connected' | 'Error';
    message?: string;
  };
}

interface AdminAlert {
  id: string;
  message: string;
  type: 'error' | 'info' | 'warning';
}

interface PlatformStatus {
  isOffline: boolean;
  lastSync: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  percentageChange?: number;
  timeframe?: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface StatusBadgeProps {
  status: string;
}

const MetricCard = ({ title, value, description, percentageChange, timeframe, icon, bgColor }: MetricCardProps) => {
  const formatPercentageChange = (percentage?: number, timeframe?: string) => {
    if (percentage === undefined || timeframe === undefined) return null;
    
    const isNegative = percentage < 0;
    const arrow = isNegative ? '↘' : '↗';
    const color = isNegative ? 'text-red-500' : 'text-green-500';
    
    return (
      <p className={`text-xs ${color} mt-1 flex items-center gap-1`}>
        <span>{arrow}</span> {Math.abs(percentage)}% {timeframe}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {formatPercentageChange(percentageChange, timeframe)}
    </div>
  );
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

const CrossMessagingMain = () => {
  const [selectBranch, setSelectBranch] = useState("All Branches");

  // Define all data as local state or constants
  const messagingStats: MessagingStats = {
    totalMessages: { count: 128, percentageChange: 1.8, timeframe: 'than previous day' },
    unreadMessages: { count: 14, percentageChange: -4.3, timeframe: 'from yesterday' },
    avgResponseTime: { time: '3 mins', percentageChange: 3, timeframe: '45 secs' },
    onlineSalesRep: { active: 3, total: 4, percentageChange: 1.8, timeframe: 'than previous day' }
  };

  const messageActivities: MessageActivity[] = [
    { id: '1', customer: 'Adeleke Semiu', channel: 'WhatsApp', assignedTo: 'Nifemi', firstMessage: '10:02 AM', lastReply: '10:18 AM', status: 'Active' },
    { id: '2', customer: 'Osas Chibuzor', channel: 'Instagram', assignedTo: 'Dennis', firstMessage: '09:50 AM', lastReply: '11:18 AM', status: 'Closed' },
    { id: '3', customer: 'Osas Chibuzor', channel: 'Facebook', assignedTo: 'Dennis', firstMessage: '09:50 AM', lastReply: '11:18 AM', status: 'Active' }
  ];

  const staffPerformance: StaffPerformance[] = [
    { id: '1', name: 'Nifemi', messagesHandled: 48, avgResponse: '2m 12s', unread: 3, chatsClosed: 41 },
    { id: '2', name: 'Dennis', messagesHandled: 48, avgResponse: '2m 12s', unread: 3, chatsClosed: 41 }
  ];

  const integrationStatus: IntegrationStatus = {
    whatsapp: { status: 'Connected' },
    instagram: { status: 'Error', message: 'Error - re-authenticate' },
    facebook: { status: 'Connected' }
  };

  const adminAlerts: AdminAlert[] = [
    { id: '1', message: 'Instagram integration failed to sync', type: 'error' },
    { id: '2', message: 'Staff Nifemi has 5 Unread messages', type: 'info' },
    { id: '3', message: 'Dennis closed a chat', type: 'info' }
  ];

  const platformStatus: PlatformStatus = {
    isOffline: true,
    lastSync: '2 minutes ago'
  };

  const handleRefreshIntegrations = () => {
    // Handle refresh integrations
    console.log('Refreshing integrations...');
  };

  const handleExportData = () => {
    // Handle export data
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cross Messaging Overview</h1>
          <p className="text-gray-600">Here is an overview of your cross messaging system</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Branch:</span>
          <div className="flex items-center space-x-1 px-3 py-1 rounded">
            <select
              value={selectBranch}
              onChange={(e) => setSelectBranch(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm bg-white text-[#FBB906]"
            >
              <option>All Branches</option>
              <option>Gbagada</option>
              <option>Ikeja</option>
              <option>Lekki</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Messages today"
          value={messagingStats.totalMessages.count}
          percentageChange={messagingStats.totalMessages.percentageChange}
          timeframe={messagingStats.totalMessages.timeframe}
          bgColor="bg-orange-100"
          icon={<MessageSquare className="w-6 h-6 text-orange-600" />}
        />
        <MetricCard
          title="Unread messages"
          value={messagingStats.unreadMessages.count}
          percentageChange={messagingStats.unreadMessages.percentageChange}
          timeframe={messagingStats.unreadMessages.timeframe}
          bgColor="bg-pink-100"
          icon={<AlertTriangle className="w-6 h-6 text-pink-600" />}
        />
        <MetricCard
          title="Avg response time"
          value={messagingStats.avgResponseTime.time}
          percentageChange={messagingStats.avgResponseTime.percentageChange}
          timeframe={messagingStats.avgResponseTime.timeframe}
          bgColor="bg-purple-100"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
        />
        <MetricCard
          title="Online sales rep active"
          value={`${messagingStats.onlineSalesRep.active}/${messagingStats.onlineSalesRep.total}`}
          percentageChange={messagingStats.onlineSalesRep.percentageChange}
          timeframe={messagingStats.onlineSalesRep.timeframe}
          bgColor="bg-green-100"
          icon={<Users className="w-6 h-6 text-green-600" />}
        />
      </div>

      {/* Message Activity Log */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Message Activity Log</h2>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
              <span>Sales rep</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
              <span>Time</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded">
              <span>Status</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Customer</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Channel</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Assigned To</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">First Message</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Last Reply</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {messageActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{activity.customer}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.channel}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.assignedTo}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.firstMessage}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.lastReply}</td>
                  <td className="py-3">
                    <StatusBadge status={activity.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center pt-4">
          <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
            View More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Performance Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Staff Performance Panel</h2>
            <button 
              onClick={handleExportData}
              className="flex items-center space-x-1 text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded"
            >
              <span>Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Staff</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Messages Handled</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Avg Response</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Unread</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">Chats Closed</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff) => (
                  <tr key={staff.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{staff.name}</td>
                    <td className="py-3 text-sm text-gray-600">{staff.messagesHandled}</td>
                    <td className="py-3 text-sm text-gray-600">{staff.avgResponse}</td>
                    <td className="py-3 text-sm text-gray-600">{staff.unread}</td>
                    <td className="py-3 text-sm text-gray-600">{staff.chatsClosed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Alerts</h2>
          <div className="space-y-4">
            {adminAlerts.map((alert) => (
              <div key={alert.id} className="text-sm text-gray-700">
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Integration Settings</h2>
            <button 
              onClick={handleRefreshIntegrations}
              className="flex items-center space-x-2 text-sm text-gray-600 border border-orange-300 px-3 py-1 rounded hover:bg-orange-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">WhatsApp API status:</span>
              </div>
              <StatusBadge status="Connected" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900">Instagram API:</span>
              </div>
              <StatusBadge status="Error" />
            </div>
            {integrationStatus.instagram.message && (
              <p className="text-sm text-red-600 ml-7">{integrationStatus.instagram.message}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Facebook Messenger:</span>
              </div>
              <StatusBadge status="Connected" />
            </div>
          </div>

          {/* Platform Status */}
          {platformStatus.isOffline && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">A platform has gone offline</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Last sync: {platformStatus.lastSync}
              </p>
            </div>
          )}
        </div>

        {/* Empty Space for Future Content */}
        <div></div>
      </div>
    </div>
  );
};

export default CrossMessagingMain;