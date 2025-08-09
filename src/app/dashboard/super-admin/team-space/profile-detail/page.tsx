'use client';

import React, { useState } from 'react';
import { Shield, Briefcase, Users } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { id: 'personal', label: 'Personal Information', icon: Users },
  { id: 'job', label: 'Job Information', icon: Briefcase },
  { id: 'account', label: 'Account Access', icon: Shield }
];

export default function EmployeePage() {
  const [activeTab, setActiveTab] = useState('personal');

  const renderTabContent = () => {
    switch (activeTab) {
      
      case 'personal':
        return (
          <div className="p-6 bg-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">First Name</h3>
                <p className="text-sm text-gray-900">Samuel</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last Name</h3>
                <p className="text-sm text-gray-900">Monday</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Mobile Number</h3>
                <p className="text-sm text-gray-900">0802 063 1277</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="text-sm text-gray-900">samuelmonday857@gmail.com</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Birth</h3>
                <p className="text-sm text-gray-900">Feb. 24 2002</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Marital Status</h3>
                <p className="text-sm text-gray-900">Single</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
                <p className="text-sm text-gray-900">Male</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Nationality</h3>
                <p className="text-sm text-gray-900">Nigerian</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                <p className="text-sm text-gray-900">54, Diya Street Ifako Gbagada Lagos</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">City</h3>
                <p className="text-sm text-gray-900">Gbagada</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">State</h3>
                <p className="text-sm text-gray-900">Lagos State</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Zip Code</h3>
                <p className="text-sm text-gray-900">101012</p>
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
                <p className="text-sm text-gray-900">UX0011</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">User Name</h3>
                <p className="text-sm text-gray-900">samuel_monday</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Employee Type</h3>
                <p className="text-sm text-gray-900">Remote</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="text-sm text-gray-900">samuelmonday857@gmail.com</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                <p className="text-sm text-gray-900">IT</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Job title</h3>
                <p className="text-sm text-gray-900">UI/UX Designer</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Working Days</h3>
                <p className="text-sm text-gray-900">Hybrid</p>
              </div>
              <div className="border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Joining Date</h3>
                <p className="text-sm text-gray-900">July 10, 2024</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Office Location</h3>
                <p className="text-sm text-gray-900">54, Diya Street, Ifako Gbagada Lagos</p>
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
                <p className="text-sm text-gray-900">samuelmonday857@gmail.com</p>
              </div>
              <div className='border-b border-gray-100'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Employee ID</h3>
                <p className="text-sm text-gray-900">UX0011</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">System Role</h3>
                <p className="text-sm text-gray-900">Super Admin</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-none overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isPersonal = tab.id === 'personal';
            const isJob = tab.id === 'job';
            const isAccount = tab.id === 'account';

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? isPersonal
                      ? 'border-[#FBB906] bg-none text-[#FBB906]'
                      : isJob
                      ? 'border-[#FBB906] bg-none text-[#FBB906]'
                      : isAccount
                      ? 'border-[#FBB906] bg-none text-[#FBB906]'
                      : tab.id === 'profile'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-400 bg-gray-50 text-gray-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-none">
        {renderTabContent()}
      </div>
    </div>
  );
}