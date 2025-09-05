'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Calendar, ChevronDown, X, Download, Plus } from 'lucide-react';

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
  const [selectedTicket, setSelectedTicket] = useState<RepairLog | null>(null);
  const [showModal, setShowModal] = useState(false);

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