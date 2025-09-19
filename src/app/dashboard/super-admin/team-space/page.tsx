'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { useEmployees, useEmployeeStats, useEmployeeSearch, useEmployeeOperations } from '../hooks/useEmployees';
import { useAuth } from '../../../../hooks/useAuth';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const EmployeeManagementMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All staff');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounce search term to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { user } = useAuth();
  const { deleteEmployee } = useEmployeeOperations();

  const filterOptions = [
    'All staff',
    'Accounting',
    'I.T',
    'Online sales',
    'Front desk officer',
    'Engineer',
    'Office Assistant'
  ];

  // API hooks - only make calls when needed
  const { employees, loading: employeesLoading, error: employeesError, pagination, refetch: refetchEmployees } = useEmployees({
    page: currentPage,
    limit: 10,
    department: filterStatus !== 'All staff' ? filterStatus : undefined,
    status: 'Active' // Only show active employees by default
  });

  const { stats, loading: statsLoading, error: statsError } = useEmployeeStats();

  // Only search when there's a debounced search term and it's not empty
  const { employees: searchResults, loading: searchLoading } = useEmployeeSearch(
    debouncedSearchTerm.trim().length > 0 ? debouncedSearchTerm : '', 
    {
      page: currentPage,
      limit: 10,
      department: filterStatus !== 'All staff' ? filterStatus : undefined
    }
  );

  // Use search results if searching, otherwise use regular employees
  const displayEmployees = debouncedSearchTerm.trim().length > 0 ? searchResults : employees;
  const isLoading = debouncedSearchTerm.trim().length > 0 ? searchLoading : employeesLoading;

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
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId);
        refetchEmployees(); // Refresh the list
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Remove the useEffect that was causing unnecessary re-renders
  // The hooks will automatically refetch when their dependencies change

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
            href="/dashboard/super-admin/team-space/task-management" 
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
            {pagination ? (
              <>Showing <span className="font-medium">{pagination.items_per_page}</span> per page</>
            ) : (
              <>Loading...</>
            )}
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
              {isLoading ? (
                // Skeleton loading rows to maintain table structure
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-gray-50">
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : employeesError ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-red-500">
                    Error loading employees: {employeesError}
                  </td>
                </tr>
              ) : displayEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                displayEmployees.map((employee, index) => (
                  <tr key={employee._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 text-xs text-gray-900">{index + 1 + (currentPage - 1) * 10}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.name}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getWorkModeColor(employee.workMode)}`}>
                      {employee.workMode}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.gender}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.staffId}</td>
                    <td className="px-3 py-4 text-xs text-gray-900">{employee.phoneNumber}</td>
                    <td className="px-3 py-4 text-xs text-gray-900">{employee.role}</td>
                  <td className="px-3 py-4 text-xs text-gray-900">{employee.jobTitle}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <a 
                          href={`/dashboard/super-admin/team-space/profile-detail?employeeId=${employee._id}`}
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>
                      <a 
                          href={`/dashboard/super-admin/team-space/add-employee?edit=${employee._id}`}
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </a>
                        <button 
                          onClick={() => handleDeleteEmployee(employee._id)}
                        className="p-2 text-pink-500 bg-gray-50 rounded-md hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex justify-center gap-2">
              {/* Previous button */}
            <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-md border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                ‹
            </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
            <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                      currentPage === pageNum
                  ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white border-pink-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
                    {pageNum}
            </button>
                );
              })}
              
              {/* Next button */}
            <button 
                onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                disabled={currentPage === pagination.total_pages}
                className="w-9 h-9 rounded-md border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                ›
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

const EmployeeManagementPage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <EmployeeManagementMain />
    </ProtectedRoute>
  );
};

export default EmployeeManagementPage;