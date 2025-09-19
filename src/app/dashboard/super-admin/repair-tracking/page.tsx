'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, X, Loader2 } from 'lucide-react';
import { useRepairs, useRepairStats, useRepairActivityLogs } from '../hooks/useRepairs';
import { useAuth } from '../../../../hooks/useAuth';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { branchesApi } from '../../../../api/branchesApi';

interface Branch {
  _id: string;
  name: string;
  address: string;
  state: string;
  country: string;
  zipCode?: string;
}

const RepairTrackingPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectBranch, setSelectBranch] = useState("All Branches");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [engineerFilter, setEngineerFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Get current user
  const { user, isLoading: userLoading } = useAuth();

  // Fetch repairs with filters
  const { 
    repairs, 
    loading: repairsLoading, 
    error: repairsError,
    pagination: repairsPagination 
  } = useRepairs({
    status: statusFilter as any || undefined,
    assignedEngineer: engineerFilter || undefined,
    start_date: dateFilter || undefined,
    limit: 50
  });

  // Fetch repair statistics
  const { 
    stats: repairStats, 
    loading: statsLoading, 
    error: statsError 
  } = useRepairStats({
    start_date: dateFilter || undefined
  });

  // Fetch activity logs for selected ticket
  const { 
    activityLogs, 
    loading: activityLogsLoading, 
    error: activityLogsError 
  } = useRepairActivityLogs(selectedTicket?._id || '');

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      setBranchesError('');
      const response = await branchesApi.getBranches();
      if (response.data && response.data.branches) {
        setBranches(response.data.branches);
      } else {
        setBranchesError('No branches data received');
      }
    } catch (error: any) {
      setBranchesError(error.message || 'Failed to fetch branches');
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600 border border-yellow-200';
      case 'In progress':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'Repaired':
        return 'bg-blue-100 text-blue-600 border border-blue-200';
      case 'Repaired and sent back':
        return 'bg-purple-100 text-purple-600 border border-purple-200';
      case 'Completed':
        return 'bg-green-100 text-green-600 border border-green-200';
      case 'Completed and ready for pick up':
        return 'bg-green-100 text-green-600 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'Super Admin']}>
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {userLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
              ) : (
                `All Repair Logs`
              )}
            </h1>
            <p className="text-gray-500">Repair tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Branch:</span>
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
            {branchesLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-gray-900">
              All Repair logs ({repairsPagination.total_items || 0})
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In progress">In Progress</option>
                  <option value="Repaired">Repaired</option>
                  <option value="Repaired and sent back">Repaired and sent back</option>
                  <option value="Completed">Completed</option>
                  <option value="Completed and ready for pick up">Ready for Pickup</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Engineer name"
                  value={engineerFilter}
                  onChange={(e) => setEngineerFilter(e.target.value)}
                  className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engineer Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repairsLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span className="text-gray-600">Loading repairs...</span>
                    </div>
                  </td>
                </tr>
              ) : repairsError ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-red-600">
                    Error: {repairsError}
                  </td>
                </tr>
              ) : repairs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No repairs found
                  </td>
                </tr>
              ) : (
                repairs.map((repair, index) => (
                  <tr key={repair._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTicketClick(repair)}>
                    <td className="px-4 py-4">
                      <span className="text-blue-600 text-xs font-medium">{repair.ticketId}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-900">{repair.device}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{repair.issueReported}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{selectBranch}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">
                      {repair.assignedEngineer ? `${repair.assignedEngineer.firstName} ${repair.assignedEngineer.lastName}` : 'Unassigned'}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-900">{formatDate(repair.createdAt)}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">
                      {repair.expectedCompletionDate ? formatDate(repair.expectedCompletionDate) : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repair.status)}`}>
                        {repair.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs - Full Width */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Activity Logs</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">
              {selectedTicket ? formatDate(selectedTicket.createdAt) : 'Select a repair'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activityLogsLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-gray-600">Loading activity logs...</span>
                    </div>
                  </td>
                </tr>
              ) : activityLogsError ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-600">
                    Error: {activityLogsError}
                  </td>
                </tr>
              ) : activityLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    {selectedTicket ? 'No activity logs found' : 'Select a repair to view activity logs'}
                  </td>
                </tr>
              ) : (
                activityLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-xs text-gray-900">{formatDateTime(log.timestamp)}</td>
                    <td className="px-4 py-3 text-xs text-gray-900 capitalize">{log.action.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-xs text-gray-900">{log.description}</td>
                    <td className="px-4 py-3 text-xs text-gray-900">
                      {log.performedBy ? `${log.performedBy.firstName} ${log.performedBy.lastName}` : 'System'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>

        {/* Repair Insights and Top Engineers - 50/50 Layout */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
        {/* Repair Insights */}
        {/* <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Repair insights</h3>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">
                {dateFilter ? formatDate(dateFilter) : 'All Time'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-gray-600">Loading stats...</span>
              </div>
            ) : statsError ? (
              <div className="text-center text-red-600 py-4">
                Error: {statsError}
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Average Completion time</span>
                    <span className="text-sm font-medium text-gray-900">
                      {repairStats?.averageCompletionTime || 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Repairs completed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {repairStats?.completedRepairs || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total repairs</span>
                    <span className="text-sm font-medium text-gray-900">
                      {repairStats?.totalRepairs || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Overdue repairs</span>
                    <span className="text-sm font-medium text-red-600">
                      {repairStats?.overdueRepairs || 0}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div> */}

        {/* Top Engineers */}
        {/* <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Top Engineers</h3>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">
                {dateFilter ? formatDate(dateFilter) : 'All Time'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Engineer</span>
              <div className="flex gap-8">
                <span className="text-sm text-gray-600">Repairs done</span>
                <span className="text-sm text-gray-600">Avg Time</span>
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-gray-600">Loading engineer stats...</span>
              </div>
            ) : statsError ? (
              <div className="text-center text-red-600 py-4">
                Error: {statsError}
              </div>
            ) : repairStats?.engineerStats && repairStats.engineerStats.length > 0 ? (
              repairStats.engineerStats.slice(0, 5).map((stat: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">{stat.engineerName}</span>
                  <div className="flex gap-12">
                    <span className="text-sm text-gray-900">{stat.repairsDone}</span>
                    <span className="text-sm text-gray-900">{stat.avgTime}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No engineer data available
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Delay Alert */}
      {/* <div className="mt-6 bg-white rounded-lg shadow-sm border border-red-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-red-600 font-medium">Delay Alerts</span>
          <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2">
            <span className="text-red-600 text-sm font-medium">
              {statsLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </div>
              ) : statsError ? (
                'Error loading alerts'
              ) : (
                `${repairStats?.overdueRepairs || 0} tickets exceeded due date`
              )}
            </span>
          </div>
        </div>
      </div> */}

      {/* Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Repair Detail</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-orange-500" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-140 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ticket ID:</label>
                <span className="text-sm text-gray-900">{selectedTicket.ticketId}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name:</label>
                <span className="text-sm text-gray-900">{selectedTicket.customerName || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number:</label>
                <span className="text-sm text-gray-900">{selectedTicket.customerPhoneNumber || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email:</label>
                <span className="text-sm text-gray-900">{selectedTicket.customerEmail || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Device:</label>
                <span className="text-sm text-gray-900">{selectedTicket.device}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Serial/IMEI:</label>
                <span className="text-sm text-gray-900">{selectedTicket.imei || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Issue Reported:</label>
                <span className="text-sm text-gray-900">{selectedTicket.issueReported}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Engineer:</label>
                <span className="text-sm text-gray-900">
                  {selectedTicket.assignedEngineer ? 
                    `${selectedTicket.assignedEngineer.firstName} ${selectedTicket.assignedEngineer.lastName}` : 
                    'Unassigned'
                  }
                </span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status:</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Priority Level:</label>
                <span className="text-sm text-gray-900">{selectedTicket.priorityLevel || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Created:</label>
                <span className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expected Completion Date:</label>
                <span className="text-sm text-gray-900">
                  {selectedTicket.expectedCompletionDate ? formatDate(selectedTicket.expectedCompletionDate) : 'N/A'}
                </span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price:</label>
                <span className="text-sm text-gray-900">{selectedTicket.price || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Diagnosis/Notes:</label>
                <div className="border rounded p-2 bg-gray-50 min-h-[60px] text-sm">
                  <span className="text-gray-600">{selectedTicket.diagnosis || 'No diagnosis available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default RepairTrackingPage;