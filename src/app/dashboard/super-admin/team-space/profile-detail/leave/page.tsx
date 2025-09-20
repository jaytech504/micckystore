'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Calendar, Clock } from 'lucide-react';
import { useUserLeaveRequests, useLeaveOperations, useLeaveStats } from '../../../hooks/useEmployeeOperations';
import { useAuth } from '../../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import { useSearchParams } from 'next/navigation';

function LeaveTable() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'sick' as 'sick' | 'vacation' | 'personal' | 'emergency'
  });

  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Get employee ID from URL params or use current user
  useEffect(() => {
    const empId = searchParams.get('employeeId');
    setEmployeeId(empId || user?.id || null);
  }, [searchParams, user]);

  // API hooks
  const { leaveRequests, loading: leaveLoading, error: leaveError, refetch: refetchLeaveRequests } = useUserLeaveRequests(employeeId || '');
  const { createLeaveRequest, updateLeaveStatus, loading: operationLoading } = useLeaveOperations();
  const { stats, loading: statsLoading } = useLeaveStats();

  const handleCreateLeaveRequest = async () => {
    if (!newLeaveData.startDate || !newLeaveData.endDate || !newLeaveData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createLeaveRequest({
        startDate: newLeaveData.startDate,
        endDate: newLeaveData.endDate,
        reason: newLeaveData.reason,
        leaveType: newLeaveData.leaveType,
        userId: employeeId || user?.id || ''
      });
      
      setNewLeaveData({
        startDate: '',
        endDate: '',
        reason: '',
        leaveType: 'sick'
      });
      setShowNewLeaveForm(false);
      refetchLeaveRequests();
      alert('Leave request submitted successfully');
    } catch (error) {
      console.error('Error creating leave request:', error);
      alert('Error creating leave request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  return (
    <div className="space-y-6">
      {/* Leave Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-[#FBB906]">{stats.totalRequests}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* New Leave Request Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNewLeaveForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600"
        >
          <Plus className="w-4 h-4" />
          New Leave Request
        </button>
      </div>

      {/* New Leave Request Form Modal */}
      {showNewLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Leave Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeaveData.leaveType}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, leaveType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation</option>
                  <option value="personal">Personal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newLeaveData.startDate}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={newLeaveData.endDate}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newLeaveData.reason}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter reason for leave..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewLeaveForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLeaveRequest}
                disabled={operationLoading}
                className="px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {operationLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mr-2" />
                      <span className="text-gray-600">Loading leave requests...</span>
                    </div>
                  </td>
                </tr>
              ) : leaveError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    Error loading leave requests: {leaveError}
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request, index) => (
                  <tr key={request._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateDays(request.startDate, request.endDate)} Days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {request.leaveType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                        request.status === 'approved' 
                        ? 'bg-green-500 text-white' 
                          : request.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const LeavePage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin', 'Staff']}>
      <LeaveTable />
    </ProtectedRoute>
  );
};

export default LeavePage;