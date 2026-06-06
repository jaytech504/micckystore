'use client';

import React, {useState, useEffect} from 'react';
import { ChevronDown, MessageSquare, AlertTriangle, Clock, Users, RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { 
  useMessages,
  useMessageAnalytics,
  useWebhookTest,
  useMessageUtils
} from '../hooks/useMessaging';
import { branchesApi } from '../../../../api/branchesApi';
import { useAuth } from '../../../../hooks/useAuth';
import ProtectedRoute from '../../../../components/ProtectedRoute';

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
  const [branches, setBranches] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        setBranchesError(null);
        const response = await branchesApi.getBranches();
        if (response.data && response.data.branches) {
          setBranches(response.data.branches);
        } else {
          setBranchesError('Failed to load branches');
        }
      } catch (error) {
        setBranchesError('Error loading branches');
        console.error('Error fetching branches:', error);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch real data using hooks
  const { messages, loading: messagesLoading, error: messagesError } = useMessages({
    // Add branch filtering when API supports it
  });

  const { analytics, loading: analyticsLoading, error: analyticsError } = useMessageAnalytics();

  const { config: webhookConfig, loading: webhookLoading, error: webhookError, testWebhook } = useWebhookTest();

  const { formatTimestamp, getStatusColor, getChannelIcon } = useMessageUtils();

  

  // Transform messages to activities format
  const messageActivities = messages?.slice(0, 10).map(msg => ({
    id: msg._id || Math.random().toString(),
    customer: msg.from,
    channel: msg.channel,
    assignedTo: 'Auto-assigned', // This would come from assignment logic
    firstMessage: formatTimestamp(msg.timestamp),
    lastReply: formatTimestamp(msg.timestamp),
    status: msg.status === 'read' ? 'Closed' as const : 'Active' as const
  })) || [];

  // Mock staff performance data (would come from a dedicated API)
  const staffPerformance = [
    { id: '1', name: 'John Doe', messagesHandled: 25, avgResponse: '1.2 min', unread: 3, chatsClosed: 18 },
    { id: '2', name: 'Jane Smith', messagesHandled: 32, avgResponse: '2.1 min', unread: 5, chatsClosed: 24 },
    { id: '3', name: 'Mike Johnson', messagesHandled: 18, avgResponse: '1.8 min', unread: 2, chatsClosed: 15 }
  ];

  // Mock integration status (would come from webhook config)
  const integrationStatus: IntegrationStatus = {
    whatsapp: { status: 'Connected', message: undefined },
    instagram: { status: 'Connected', message: undefined },
    facebook: { status: 'Error', message: 'Token expired' }
  };

  // Mock admin alerts
  const adminAlerts = [
    { id: '1', message: 'WhatsApp integration healthy', type: 'info' as const },
    { id: '2', message: 'Instagram rate limit approaching', type: 'warning' as const },
    { id: '3', message: 'Facebook integration failed', type: 'error' as const }
  ];

  // Mock platform status
  const platformStatus = {
    isOffline: false,
    lastSync: new Date().toISOString()
  };

  // Loading and error states
  const statsLoading = messagesLoading || analyticsLoading;
  const statsError = messagesError || analyticsError;
  const activitiesLoading = messagesLoading;
  const activitiesError = messagesError;
  const staffLoading = false;
  const staffError = null;
  const integrationLoading = webhookLoading;
  const integrationError = webhookError;
  const alertsLoading = false;
  const alertsError = null;
  const platformLoading = false;
  const platformError = null;
  const refreshLoading = false;

  const handleRefreshIntegrations = async () => {
    try {
      await testWebhook();
      // The integration status will automatically refresh due to the hook
    } catch (error) {
      console.error('Failed to refresh integrations:', error);
    }
  };

  const handleExportData = () => {
    // Handle export data
    console.log('Exporting data...');
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'Super Admin']}>
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user ? `Hello ${user.name || 'User'}` : 'Cross Messaging Overview'}
            </h1>
          <p className="text-gray-600">Here is an overview of your cross messaging system</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Branch:</span>
          <div className="flex items-center space-x-1 px-3 py-1 rounded">
            <select
              value={selectBranch}
              onChange={(e) => setSelectBranch(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm bg-white text-[#FBB906]"
                disabled={branchesLoading}
            >
              <option>All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
            </select>
              {branchesLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              )}
              {branchesError && (
                <span className="text-xs text-red-500">{branchesError}</span>
              )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
              <p className="text-gray-600">Loading messaging stats...</p>
            </div>
          </div>
        ) : statsError ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <div className="text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-4" />
              <p>Error loading stats: {statsError}</p>
            </div>
          </div>
        ) : messagingStats ? (
          <>
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
          </>
        ) : (
          <div className="col-span-4 flex items-center justify-center py-8">
            <div className="text-center text-gray-500">
              <p>No messaging stats available</p>
            </div>
          </div>
        )}
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
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E866B7]" />
                <p className="text-gray-600">Loading message activities...</p>
              </div>
            </div>
          ) : activitiesError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-red-500">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p>Error loading activities: {activitiesError}</p>
              </div>
            </div>
          ) : messageActivities && messageActivities.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <p>No message activities found</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-4">
          <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
            View More
          </button>
        </div>
      </div>

      {/* Staff Performance Panel - Full Width */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
            {staffLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E866B7]" />
                  <p className="text-gray-600">Loading staff performance...</p>
                </div>
              </div>
            ) : staffError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-red-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  <p>Error loading staff performance: {staffError}</p>
                </div>
              </div>
            ) : staffPerformance && staffPerformance.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p>No staff performance data found</p>
                </div>
              </div>
            )}
          </div>
      </div>

      {/* Admin Alerts and Integration Settings - 50/50 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Alerts</h2>
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E866B7]" />
                <p className="text-gray-600">Loading admin alerts...</p>
              </div>
            </div>
          ) : alertsError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-red-500">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p>Error loading alerts: {alertsError}</p>
              </div>
            </div>
          ) : adminAlerts && adminAlerts.length > 0 ? (
          <div className="space-y-4">
            {adminAlerts.map((alert) => (
                <div key={alert.id} className={`text-sm p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                {alert.message}
              </div>
            ))}
          </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No admin alerts</p>
              </div>
            </div>
          )}
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Integration Settings</h2>
            <button 
              onClick={handleRefreshIntegrations}
              disabled={refreshLoading}
              className="flex items-center space-x-2 text-sm text-gray-600 border border-orange-300 px-3 py-1 rounded hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
              <RefreshCw className="w-4 h-4" />
              )}
              <span>{refreshLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          
          {integrationLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E866B7]" />
                <p className="text-gray-600">Loading integration status...</p>
              </div>
            </div>
          ) : integrationError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-red-500">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p>Error loading integration status: {integrationError}</p>
              </div>
            </div>
          ) : integrationStatus ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  {integrationStatus.whatsapp.status === 'Connected' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                <span className="text-sm font-medium text-gray-900">WhatsApp API status:</span>
              </div>
                <StatusBadge status={integrationStatus.whatsapp.status} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  {integrationStatus.instagram.status === 'Connected' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                <span className="text-sm font-medium text-gray-900">Instagram API:</span>
              </div>
                <StatusBadge status={integrationStatus.instagram.status} />
            </div>
            {integrationStatus.instagram.message && (
              <p className="text-sm text-red-600 ml-7">{integrationStatus.instagram.message}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  {integrationStatus.facebook.status === 'Connected' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                <span className="text-sm font-medium text-gray-900">Facebook Messenger:</span>
              </div>
                <StatusBadge status={integrationStatus.facebook.status} />
            </div>
            {integrationStatus.facebook.message && (
              <p className="text-sm text-red-600 ml-7">{integrationStatus.facebook.message}</p>
            )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No integration status available</p>
            </div>
          </div>
          )}

          {/* Platform Status */}
          {platformLoading ? (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Loading platform status...</span>
              </div>
            </div>
          ) : platformError ? (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error loading platform status</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{platformError}</p>
            </div>
          ) : platformStatus && platformStatus.isOffline ? (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">A platform has gone offline</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Last sync: {platformStatus.lastSync}
              </p>
            </div>
          ) : platformStatus && !platformStatus.isOffline ? (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">All platforms are online</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Last sync: {platformStatus.lastSync}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default CrossMessagingMain;
