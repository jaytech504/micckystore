'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

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

interface AuditLog {
  time: string;
  assigned: string;
  received: string;
  date: string;
  lastUpdated: string;
  edited: string;
}

interface EngineerStats {
  engineer: string;
  repairsDone: number;
  avgTime: string;
}

const RepairTrackingPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<RepairLog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectBranch, setSelectBranch] = useState("All Branches");

  const repairLogs: RepairLog[] = [
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro 64gb',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'In Progress',
      customerName: 'Testify Olokor',
      phoneNumber: '0802 063 1277',
      serialIMEI: '843848428238',
      expectedCompletionDate: '28/04/2025',
      diagnosis: 'Not responding'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Osas',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'Completed'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'In Progress'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'Completed'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'Returned'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'Completed'
    },
    {
      ticketId: 'MSR-8249001',
      device: 'iPhone 13pro',
      issue: 'Not turning on',
      branch: 'Ikeja',
      engineerAssigned: 'Semiu',
      tagDate: '24/04/2025',
      dueDate: '29/04/2025',
      status: 'In Progress'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      time: '09:45',
      assigned: 'Chineye',
      received: 'Semiu',
      date: '24/04/25',
      lastUpdated: '26/04/25',
      edited: 'Nifemi'
    },
    {
      time: '09:45',
      assigned: 'Chineye',
      received: 'Semiu',
      date: '24/04/25',
      lastUpdated: '26/04/25',
      edited: 'Nil'
    },
    {
      time: '09:45',
      assigned: 'Dennis',
      received: 'Damola',
      date: '24/04/25',
      lastUpdated: '26/04/25',
      edited: 'Dennis'
    },
    {
      time: '09:45',
      assigned: 'Dennis',
      received: 'Osas',
      date: '24/04/25',
      lastUpdated: '26/04/25',
      edited: 'Nil'
    }
  ];

  const engineerStats: EngineerStats[] = [
    { engineer: 'Semiu', repairsDone: 46, avgTime: '1d 22h' },
    { engineer: 'Osas', repairsDone: 40, avgTime: '2d 4h' }
  ];

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Repair Logs</h1>
            <p className="text-gray-500">Repair tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Branch:</span>
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
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Status</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
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
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Audit Logs</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">24 Apr 2025</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.time}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.assigned}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.received}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.date}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.lastUpdated}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{log.edited}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Repair Insights */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Repair insights</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">24 Apr 2025</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Average Completion time.</span>
                  <span className="text-sm font-medium text-gray-900">2 days 4 hours</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Repairs completed</span>
                  <span className="text-sm font-medium text-gray-900">164</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Top 2 Engineers</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Monthly</span>
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
              {engineerStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">{stat.engineer}</span>
                  <div className="flex gap-12">
                    <span className="text-sm text-gray-900">{stat.repairsDone}</span>
                    <span className="text-sm text-gray-900">{stat.avgTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delay Alert */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-red-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-red-600 font-medium">Delay Alerts</span>
          <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2">
            <span className="text-red-600 text-sm font-medium">7 tickets exceeded due date</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Repair Detail</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
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