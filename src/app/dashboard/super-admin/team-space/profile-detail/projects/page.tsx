'use client';
import React from 'react';

const projectsData = [
  {
    srNo: 1,
    jobName: "Design Website",
    startDate: "Feb 01, 2025",
    finishDate: "Apr 05, 2025",
    status: "Completed"
  },
  {
    srNo: 2,
    jobName: "New Month Flyer",
    startDate: "Feb 01, 2025",
    finishDate: "Feb 01, 2025",
    status: "Completed"
  },
  {
    srNo: 3,
    jobName: "Promotion Flyer",
    startDate: "April 05, 2025",
    finishDate: "March 05, 2025",
    status: "In Process"
  },
  {
    srNo: 4,
    jobName: "Project Launch",
    startDate: "Jan 12, 2025",
    finishDate: "Jan 12, 2025",
    status: "In Process"
  }
];

export default function ProjectsTable() {
  return (
    <div className="bg-none">
      {/* Table Container */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-none border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs  text-gray-500 tracking-wider">
                  Sr. No.
                </th>
                <th className="px-6 py-3 text-left text-xs  text-gray-500 tracking-wider">
                  Job Name
                </th>
                <th className="px-6 py-3 text-left text-xs  text-gray-500 tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs  text-gray-500 tracking-wider">
                  Finish Date
                </th>
                <th className="px-6 py-3 text-left text-xs  text-gray-500 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-none divide-y divide-gray-200">
              {projectsData.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.srNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.jobName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.finishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                      project.status === 'Completed' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#FBB906] text-white'
                    }`}>
                      {project.status}
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