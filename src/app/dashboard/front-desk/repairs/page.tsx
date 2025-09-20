'use client';

import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, X, Download, Plus } from 'lucide-react';
import { frontdeskApi } from '../../../../api/frontdeskApi';

// API response interfaces
interface RepairApi {
  _id: string;
  ticketId: string;
  device: string;
  issueReported: string;
  diagnosis: string;
  imei: string;
  assignedEngineer: {
    _id: string;
    firstName: string;
    lastName: string;
    staffId: string;
  };
  status: 'Pending' | 'In progress' | 'Repaired' | 'Repaired and sent back' | 'Completed' | 'Completed and ready for pick up';
  priorityLevel: string;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerAddress: string;
  expectedCompletionDate: string;
  price: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    staffId: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface RepairLog {
  ticketId: string;
  device: string;
  issue: string;
  branch: string;
  engineerAssigned: string;
  tagDate: string;
  dueDate: string;
  status: 'In Progress' | 'Completed' | 'Returned';
  customerName?: string;
  phoneNumber?: string;
  serialIMEI?: string;
  expectedCompletionDate?: string;
  diagnosis?: string;
}


const RepairTrackingPage = () => {
  // Helper to extract arrays from unknown API responses
  const extractArray = <T,>(data: unknown, key?: string): T[] => {
    if (!data) return [];
    if (key && typeof data === 'object' && data !== null && key in (data as Record<string, unknown>)) {
      const maybe = (data as Record<string, unknown>)[key];
      return Array.isArray(maybe) ? (maybe as T[]) : [];
    }
    return Array.isArray(data) ? (data as T[]) : [];
  };
  const [selectedTicket, setSelectedTicket] = useState<RepairLog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [repairLogs, setRepairLogs] = useState<RepairLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchRepairs = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      
  // Removed dev-only auth check; allow fetch and let backend enforce auth if required.

  const response = await frontdeskApi.getRepairs({ status });
  const data: unknown = response?.data;
  const repairs = extractArray<RepairApi>(data, 'repairs');
      
      // Transform API data to match existing interface
      const transformedRepairs: RepairLog[] = repairs.map((repair: RepairApi) => ({
        ticketId: repair.ticketId,
        device: repair.device,
        issue: repair.issueReported,
        branch: 'Ikeja', // Default branch - could be enhanced with actual branch data
        engineerAssigned: `${repair.assignedEngineer?.firstName || ''} ${repair.assignedEngineer?.lastName || ''}`.trim() || 'Unassigned',
        tagDate: new Date(repair.createdAt).toLocaleDateString(),
        dueDate: repair.expectedCompletionDate ? new Date(repair.expectedCompletionDate).toLocaleDateString() : 'N/A',
        status: mapApiStatusToDisplayStatus(repair.status),
        customerName: repair.customerName,
        phoneNumber: repair.customerPhoneNumber,
        serialIMEI: repair.imei,
        expectedCompletionDate: repair.expectedCompletionDate ? new Date(repair.expectedCompletionDate).toLocaleDateString() : 'N/A',
        diagnosis: repair.diagnosis
      }));
      
      setRepairLogs(transformedRepairs);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load repairs';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(errorMessage);
      }
      setRepairLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepairs(statusFilter);
  }, [fetchRepairs, statusFilter]);

  const mapApiStatusToDisplayStatus = (apiStatus: string): 'In Progress' | 'Completed' | 'Returned' => {
    switch (apiStatus) {
      case 'Pending':
      case 'In progress':
        return 'In Progress';
      case 'Completed':
      case 'Completed and ready for pick up':
        return 'Completed';
      case 'Repaired and sent back':
        return 'Returned';
      default:
        return 'In Progress';
    }
  };




  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-600 border border-green-200';
      case 'Returned':
        return 'bg-red-100 text-red-600 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const handleTicketClick = (ticket: RepairLog) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Chineye</h2>
            <p className="text-gray-600 text-sm">Monitor all sales, repairs, and orders.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/front-desk/repairs/new-repair"
              className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              New Repair
            </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Download Report
          </button>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-gray-900">All Repair logs</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Date</span>
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-transparent text-sm text-gray-600 pr-6 focus:outline-none"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In progress">In Progress</option>
                  <option value="Repaired">Repaired</option>
                  <option value="Repaired and sent back">Repaired and sent back</option>
                  <option value="Completed">Completed</option>
                  <option value="Completed and ready for pick up">Completed and ready for pick up</option>
                </select>
                <ChevronDown className="absolute right-0 top-0 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Engineer</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchRepairs(statusFilter)}
                className="px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600"
              >
                Retry
              </button>
            </div>
          ) : repairLogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No repairs found</p>
            </div>
          ) : (
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
                {repairLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTicketClick(log)}>
                    <td className="px-4 py-4">
                      <span className="text-blue-600 text-xs font-medium">{log.ticketId}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.device}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.issue}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.branch}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.engineerAssigned}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.tagDate}</td>
                    <td className="px-4 py-4 text-xs text-gray-900">{log.dueDate}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
                <span className="text-sm text-gray-900">{selectedTicket.phoneNumber || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Device:</label>
                <span className="text-sm text-gray-900">{selectedTicket.device}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Serial/IMEI:</label>
                <span className="text-sm text-gray-900">{selectedTicket.serialIMEI || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Issue Logged:</label>
                <span className="text-sm text-gray-900">{selectedTicket.issue}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Engineer:</label>
                <span className="text-sm text-gray-900">{selectedTicket.engineerAssigned}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status:</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Tagged:</label>
                <span className="text-sm text-gray-900">{selectedTicket.tagDate}</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expected Completion Date:</label>
                <span className="text-sm text-gray-900">{selectedTicket.expectedCompletionDate || 'N/A'}</span>
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
  );
};

export default RepairTrackingPage;