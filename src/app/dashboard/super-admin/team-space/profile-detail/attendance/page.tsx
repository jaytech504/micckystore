'use client';
import React from 'react';

const attendanceData = [
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "Late"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  },
  {
    date: "Jan 01, 2025",
    clockIn: "09:28 AM",
    clockOut: "06:00 PM",
    break: "00:30 Min",
    workHours: "09:02 Hrs",
    status: "On Time"
  }
];

export default function AttendanceTable() {
  return (
    <div className="bg-none rounded-lg">
      {/* Table Container with Custom Scrollbar */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-120" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#FBB906 transparent'
        }}>
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 6px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #f97316;
              border-radius: 3px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: #ea580c;
            }
          `}</style>
          
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Break
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Work Hours
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-none divide-y divide-gray-200">
              {attendanceData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clockIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clockOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.break}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.workHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                      record.status === 'Late' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}