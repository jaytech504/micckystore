'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Briefcase, Users, Loader2, Calendar, Clock } from 'lucide-react';
import { useEmployee } from '../../hooks/useEmployees';
import { useAuth } from '../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { id: 'personal', label: 'Personal Information', icon: Users },
  { id: 'job', label: 'Job Information', icon: Briefcase },
  { id: 'account', label: 'Account Access', icon: Shield },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave Management', icon: Calendar }
];

function EmployeePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Get employee ID from URL params or use current user
  useEffect(() => {
    const empId = searchParams.get('employeeId');
    setEmployeeId(empId || user?.id || null);
  }, [searchParams, user]);

  // Fetch employee data
  const { employee, loading: employeeLoading, error: employeeError } = useEmployee(employeeId || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const renderTabContent = () => {
    if (employeeLoading) {
      return (
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#E866B7] mx-auto mb-4" />
            <p className="text-gray-600">Loading employee data...</p>
          </div>
        </div>
      );
    }

    if (employeeError) {
      return (
        <div className="p-6 text-center text-red-500">
          <p>Error loading employee: {employeeError}</p>
        </div>
      );
    }

    if (!employee) {
      return (
        <div className="p-6 text-center text-gray-500">
          <p>Employee not found</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'personal':
        return (
          <div className="p-6 bg-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">First Name</h3>
                <p className="text-sm text-gray-900">{employee.firstName || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last Name</h3>
                <p className="text-sm text-gray-900">{employee.lastName || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Mobile Number</h3>
                <p className="text-sm text-gray-900">{employee.phoneNumber || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="text-sm text-gray-900">{employee.email || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Birth</h3>
                <p className="text-sm text-gray-900">{employee.dateOfBirth ? formatDate(employee.dateOfBirth) : 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Marital Status</h3>
                <p className="text-sm text-gray-900">{employee.maritalStatus || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
                <p className="text-sm text-gray-900">{employee.gender || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Nationality</h3>
                <p className="text-sm text-gray-900">{employee.nationality || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                <p className="text-sm text-gray-900">{employee.address || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">City</h3>
                <p className="text-sm text-gray-900">{employee.city || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">State</h3>
                <p className="text-sm text-gray-900">{employee.state || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Zip Code</h3>
                <p className="text-sm text-gray-900">{employee.zipCode || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'job':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Staff ID</h3>
                <p className="text-sm text-gray-900">{employee.staffId || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">User Name</h3>
                <p className="text-sm text-gray-900">{employee.name || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Employee Type</h3>
                <p className="text-sm text-gray-900">{employee.workMode || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="text-sm text-gray-900">{employee.email || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                <p className="text-sm text-gray-900">{employee.department || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Job title</h3>
                <p className="text-sm text-gray-900">{employee.jobTitle || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Working Days</h3>
                <p className="text-sm text-gray-900">{employee.expectedWorkingDays?.join(', ') || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Joining Date</h3>
                <p className="text-sm text-gray-900">{employee.resumptionDate ? formatDate(employee.resumptionDate) : 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Office Location</h3>
                <p className="text-sm text-gray-900">{employee.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="text-sm text-gray-900">{employee.email || 'N/A'}</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Employee ID</h3>
                <p className="text-sm text-gray-900">{employee.staffId || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">System Role</h3>
                <p className="text-sm text-gray-900">{employee.role || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Management</h3>
              <p className="text-gray-600 mb-6">View and manage attendance records for this employee</p>
              <Link 
                href={`/dashboard/super-admin/team-space/profile-detail/attendance?employeeId=${employeeId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Clock className="w-5 h-5" />
                View Attendance Records
              </Link>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Management</h3>
              <p className="text-gray-600 mb-6">View and manage leave requests for this employee</p>
              <Link 
                href={`/dashboard/super-admin/team-space/profile-detail/leave?employeeId=${employeeId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                View Leave Records
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      {employee && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#E866B7] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {employee.firstName?.charAt(0) || 'E'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-gray-600">{employee.jobTitle} • {employee.department}</p>
              <p className="text-sm text-gray-500">Staff ID: {employee.staffId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#E866B7] bg-pink-50 text-[#E866B7]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

const EmployeeProfilePage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin', 'Staff']}>
      <EmployeePage />
    </ProtectedRoute>
  );
};

export default EmployeeProfilePage;