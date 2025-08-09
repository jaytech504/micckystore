'use client';

import React, { ReactNode } from 'react';
import { User, Calendar, CheckSquare, UserMinus, Mail } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface EmployeeLayoutProps {
  children: ReactNode;
  params?: Promise<Record<string, string | string[]>>; // For App Router dynamic route parameters
}

const sidebarItems = [
  { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/super-admin/team-space/profile-detail' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, href: '/dashboard/super-admin/team-space/profile-detail/attendance' },
  { id: 'projects', label: 'Projects', icon: CheckSquare, href: '/dashboard/super-admin/team-space/profile-detail/projects' },
  { id: 'leave', label: 'Leave', icon: UserMinus, href: '/dashboard/super-admin/team-space/profile-detail/leave' }
];

// Mock employee data - in a real app, you'd fetch this based on route params or context
const employeeData = {
  name: 'Samuel Monday',
  role: 'UI/UX Designer',
  email: 'samuelmonday857@gmail.com',
  avatar: undefined
};

export default function EmployeeLayout({ 
  children,
  params
}: EmployeeLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for the profile route
    if (href === '/dashboard/super-admin/team-space/profile-detail') {
      return pathname === href;
    }
    // For other routes, check if current path starts with the href
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-none border-b border-gray-200 px-4 sm:px-0 pb-3 mt-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-gray-900 font-bold">Samuel Monday</h2>
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4 mt-0">
            <span>All Employee</span>
            <span className="mx-2">{'>'}</span>
            <span className="text-gray-900">Samuel Monday</span>
          </div>

          {/* Employee Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {employeeData?.avatar ? (
                  <Image
                    src={employeeData.avatar}
                    alt={`${employeeData.name} Avatar`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FBB906] flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-1xl font-bold text-gray-900 truncate">
                  {employeeData.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <CheckSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">{employeeData.role}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400"/>
                  <span className="text-gray-600 text-sm">{employeeData.email}</span>
                </div>
              </div>
            </div>
            
            <button className="bg-[#E866B7] text-white px-6 py-2 rounded-lg font-medium transition-colors flex-shrink-0">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-none px-4 sm:px-0 pb-3 mt-2">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 px-0">
            <div className="bg-none rounded-lg border border-gray-200">
              <div className="p-0 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        active 
                          ? 'bg-[#E866B7] text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#FBB906]'}`} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}