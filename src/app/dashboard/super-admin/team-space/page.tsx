'use client';

import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  workMode: string;
  gender: string;
  staffId: string;
  phone: string;
  systemRole: string;
  jobTitle: string;
  status: string;
}

const EmployeeManagementMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All staff');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterOptions = [
    'All staff',
    'Accounting',
    'I.T',
    'Online sales',
    'Front desk officer',
    'Engineer',
    'Office Assistant'
  ];

  const employees: Employee[] = [
    {
      id: '01',
      name: 'Samuel',
      workMode: 'Remote',
      gender: 'Male',
      staffId: 'UX0011',
      phone: '0904 814 2949',
      systemRole: 'Super Admin',
      jobTitle: 'UX designer',
      status: 'Active'
    },
    {
      id: '02',
      name: 'Nifemi',
      workMode: 'Office',
      gender: 'Female',
      staffId: 'SRG0011',
      phone: '0904 814 2949',
      systemRole: 'Online sales rep',
      jobTitle: 'UX designer',
      status: 'Active'
    },
    {
      id: '03',
      name: 'Dennis',
      workMode: 'Office',
      gender: 'Male',
      staffId: 'SRL0011',
      phone: '0904 814 2949',
      systemRole: 'Online sales rep',
      jobTitle: 'UX designer',
      status: 'Active'
    },
    {
      id: '04',
      name: 'Samad',
      workMode: 'Office',
      gender: 'Male',
      staffId: 'OAI11',
      phone: '0904 814 2949',
      systemRole: 'Office assistant',
      jobTitle: 'UX designer',
      status: 'Resigned'
    },
    {
      id: '05',
      name: 'Margret',
      workMode: 'Hybrid',
      gender: 'Female',
      staffId: 'AC0011',
      phone: '0904 814 2949',
      systemRole: 'Accounting',
      jobTitle: 'Office assistant',
      status: 'Active'
    },
    {
      id: '06',
      name: 'Osas',
      workMode: 'Office',
      gender: 'Male',
      staffId: 'ENG0011',
      phone: '0904 814 2949',
      systemRole: 'Engineer',
      jobTitle: 'Office assistant',
      status: 'Active'
    },
    {
      id: '07',
      name: 'Tina',
      workMode: 'Office',
      gender: 'Female',
      staffId: 'SRI0011',
      phone: '0904 814 2949',
      systemRole: 'Sales',
      jobTitle: 'Office assistant',
      status: 'Active'
    },
    {
      id: '08',
      name: 'Isaiah',
      workMode: 'Office',
      gender: 'Male',
      staffId: 'OAI0011',
      phone: '0904 814 2949',
      systemRole: 'Office assistant',
      jobTitle: 'Office assistant',
      status: 'Resigned'
    },
    {
      id: '09',
      name: 'Semiu',
      workMode: 'Office',
      gender: 'Male',
      staffId: 'ENI0011',
      phone: '0904 814 2949',
      systemRole: 'Office assistant',
      jobTitle: 'Office assistant',
      status: 'Active'
    },
    {
      id: '10',
      name: 'Chineye',
      workMode: 'Office',
      gender: 'Female',
      staffId: 'FGD0011',
      phone: '0904 814 2949',
      systemRole: 'Office assistant',
      jobTitle: 'Office assistant',
      status: 'Active'
    }
  ];

  const getWorkModeColor = (mode: string): string => {
    switch (mode) {
      case 'Remote':
        return 'bg-blue-100 text-blue-700';
      case 'Office':
        return 'bg-purple-100 text-purple-700';
      case 'Hybrid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Resigned':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleFilterSelect = (option: string) => {
    setFilterStatus(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-6 mb-8">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Quick search for a staff
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter search word"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="text-4xl font-bold text-[#FBB906] leading-none mb-1">
            20
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Total number of staff
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Filter staff
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white flex items-center justify-between text-left"
            >
              <span className="text-gray-900">{filterStatus}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {filterOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleFilterSelect(option)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex gap-3">
          <a 
            href="/dashboard/super-admin/team-space/add-employee" 
            className="bg-[#E866B7] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            Add New Employee
          </a>
          <a 
            href="#" 
            className="bg-white text-gray-600 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors no-underline"
          >
            Task Management
          </a>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Employee</h2>
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">12</span> per page
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">S/N</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Name</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Work mode</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Gender</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Staff ID</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Phone Number</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">System role</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Job title</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Status</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.id}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.name}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getWorkModeColor(employee.workMode)}`}>
                      {employee.workMode}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.gender}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.staffId}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.phone}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.systemRole}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.jobTitle}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <a 
                        href="/dashboard/super-admin/team-space/profile-detail" 
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>
                      <a 
                        href="#" 
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </a>
                      <a 
                        href="#" 
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(1)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 1 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              1
            </button>
            <button 
              onClick={() => setCurrentPage(2)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 2 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              2
            </button>
            <button 
              onClick={() => setCurrentPage(3)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 3 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              3
            </button>
            <button 
              onClick={() => setCurrentPage(4)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 4 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              4
            </button>
            <button 
              onClick={() => setCurrentPage(5)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 5 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              5
            </button>
            <button className="w-9 h-9 rounded-md border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors">
              ››
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementMain;