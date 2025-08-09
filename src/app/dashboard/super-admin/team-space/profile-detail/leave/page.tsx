import React from 'react';

const leaveData = [
  {
    date: "Jan 01, 2025",
    duration: "Jan 01 - Dec 31",
    days: "1 Year",
    directManager: "Michael Oyelola",
    status: "Pending"
  },
  {
    date: "Apr 05, 2025",
    duration: "Apr 06 - Apr 10",
    days: "4 Days",
    directManager: "Michael Oyelola",
    status: "Approved"
  },
  {
    date: "Mar 12, 2025",
    duration: "Mar 14 - Mar 16",
    days: "2 Days",
    directManager: "Michael Oyelola",
    status: "Approved"
  },
  {
    date: "Feb 01, 2025",
    duration: "Feb 02 - Feb 10",
    days: "8 Days",
    directManager: "Michael Oyelola",
    status: "Approved"
  },
  {
    date: "Jan 01, 2025",
    duration: "Jan 16 - Jan 19",
    days: "3 Days",
    directManager: "Michael Oyelola",
    status: "Reject"
  }
];

export default function LeaveTable() {
  return (
    <div className="bg-none">
      {/* Table Container */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-none border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Direct Manager
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-none divide-y divide-gray-200">
              {leaveData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.directManager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                      record.status === 'Approved' 
                        ? 'bg-green-500 text-white' 
                        : record.status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
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