'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, AlertTriangle, Calendar, CandlestickChart, Loader2 } from 'lucide-react';
import { useActivityLogs, useActivityLogsStats, formatActivityLogForAudit } from '../hooks/useActivityLogs';
import { useBranches } from '../hooks/useAnalytics';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const AuditLogsPage = () => {
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<'product' | 'repair' | 'notification' | ''>('');
  const [severityFilter, setSeverityFilter] = useState<'low' | 'medium' | 'high' | 'critical' | ''>('');

  // API Hooks
  const { 
    logs, 
    summary, 
    loading: logsLoading, 
    error: logsError,
    pagination,
    refetch: refetchLogs 
  } = useActivityLogs({
    page: currentPage,
    limit: pageSize,
    module: moduleFilter || undefined,
    action: actionTypeFilter || undefined,
    severity: severityFilter || undefined,
  });

  const { 
    stats: activityStats, 
    loading: statsLoading, 
    error: statsError 
  } = useActivityLogsStats();

  // Transform API data for display
  const auditData = logs.map(formatActivityLogForAudit);

  // Filter security events (high/critical severity)
  const securityEvents = logs
    .filter(log => log.severity === 'high' || log.severity === 'critical')
    .slice(0, 5)
    .map(log => ({
      time: new Date(log.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      event: log.description
    }));

  // Generate admin alerts from recent activity
  const adminAlerts = logs
    .filter(log => log.severity === 'medium' || log.severity === 'high')
    .slice(0, 3)
    .map(log => log.description);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 text-sm">View the system&apos;s Audit log</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex text-black items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Export
            <Download className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Branch:</span>
            <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Actions Logged</p>
              {statsLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats?.total_logs || summary?.total_logs || 0}
                </p>
              )}
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Product Activities</p>
              {statsLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats?.product_logs || summary?.product_logs || 0}
                </p>
              )}
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CandlestickChart className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Security Events</p>
              {statsLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {securityEvents.length} Events
                </p>
              )}
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Repair Activities</p>
              {statsLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats?.repair_logs || summary?.repair_logs || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
            <div className="flex flex-wrap gap-3">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value as any)}
                className="border rounded px-3 py-1.5 text-sm bg-white"
              >
                <option value="">All Modules</option>
                <option value="product">Product</option>
                <option value="repair">Repair</option>
                <option value="notification">Notification</option>
              </select>
              
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="border rounded px-3 py-1.5 text-sm bg-white"
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              
              <button 
                onClick={() => {
                  setModuleFilter('');
                  setSeverityFilter('');
                  setActionTypeFilter('');
                }}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border rounded"
              >
                Clear Filters
              </button>
              
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border rounded">
                Export
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logsLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mr-2" />
                      <span className="text-gray-600">Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logsError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-red-500">
                    Error loading audit logs: {logsError}
                  </td>
                </tr>
              ) : auditData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                auditData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.staff}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.actionType}
                      </span>
                    </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.branch}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.timestamp}</td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {pagination && (
              <>
                Showing {((pagination.current_page - 1) * pagination.items_per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of{' '}
                {pagination.total_items} results
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || logsLoading}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {pagination?.total_pages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= (pagination?.total_pages || 1) || logsLoading}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Admin Alerts</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#E866B7] mr-2" />
                  <span className="text-gray-600 text-sm">Loading alerts...</span>
                </div>
              ) : adminAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No recent alerts
                </div>
              ) : (
                adminAlerts.map((alert, index) => (
                <div key={index} className="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
                  {alert}
                </div>
                ))
              )}
            </div>
            {adminAlerts.length > 0 && (
            <div className="mt-4 text-center">
                <button 
                  onClick={() => refetchLogs()}
                  className="text-orange-500 text-sm hover:text-orange-600"
                >
                  Refresh Alerts
                </button>
            </div>
            )}
          </div>
        </div>

        {/* Security Event Log */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Security Event Log</h3>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              Export
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
                <div>Time</div>
                <div>Event</div>
              </div>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#E866B7] mr-2" />
                  <span className="text-gray-600 text-sm">Loading security events...</span>
                </div>
              ) : securityEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No security events found
                </div>
              ) : (
                securityEvents.map((event, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-900">{event.time}</div>
                  <div className="text-gray-700">{event.event}</div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedAuditLogsPage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <AuditLogsPage />
    </ProtectedRoute>
  );
};

export default ProtectedAuditLogsPage;