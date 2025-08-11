'use client';

import React, { useState } from 'react';
import { ChevronDown, Download, AlertTriangle, Calendar, CandlestickChart } from 'lucide-react';

const AuditLogsPage = () => {
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const auditData = [
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00125', staff: 'Nifemi', role: 'Sales rep', actionType: 'Sale Logged', description: 'Sold iPhone 11', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
    { id: 'A00124', staff: 'Chineye', role: 'Front Desk', actionType: 'Repair Update', description: 'Repair marked complete', branch: 'Gbagada', timestamp: '10:30AM' },
  ];

  const adminAlerts = [
    'Instagram integration failed to sync',
    'Staff Nifemi has 5 Unread messages',
    'Dennis closed a chat'
  ];

  const securityEvents = [
    { time: '9:32 AM', event: 'Chineye requested password reset' },
    { time: '11:32 AM', event: 'Login failed for Isaiah (Wrong password 3x)' },
    { time: '1:20 PM', event: 'Api Token refreshed by IT Head' },
    { time: '1:20 PM', event: 'Api Token refreshed by IT Head' },
  ];

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
              <p className="text-2xl font-bold text-gray-900">312</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Staffs Activities Today</p>
              <p className="text-2xl font-bold text-gray-900">180</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CandlestickChart className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900">2 Alerts</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-1">Records Edited</p>
              <p className="text-2xl font-bold text-gray-900">41 Changes</p>
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
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                Action Type
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                Branch Name
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                Staff Name
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
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
              {auditData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.staff}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.actionType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.branch}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-orange-500 text-sm hover:text-orange-600">View More</button>
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
              {adminAlerts.map((alert, index) => (
                <div key={index} className="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
                  {alert}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-orange-500 text-sm hover:text-orange-600">View More</button>
            </div>
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
              {securityEvents.map((event, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-900">{event.time}</div>
                  <div className="text-gray-700">{event.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;