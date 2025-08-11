'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Bell,
  LayoutDashboard,
  Calculator,
  Package,
  Wrench,
  MessageSquare,
  Users as TeamIcon,
  Settings,
  FileText,
  Calendar,
  Mail,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/super-admin' },
    { icon: Calculator, label: 'Accounting', href: '/dashboard/super-admin/accounting' },
    { icon: Package, label: 'Inventory', href: '/dashboard/super-admin/inventory' },
    { icon: Wrench, label: 'Repair Tracking', href: '/dashboard/super-admin/repair-tracking' },
    { icon: MessageSquare, label: 'Cross Messaging', href: '/dashboard/super-admin/cross-messaging' },
    { icon: TeamIcon, label: 'Team Space', href: '/dashboard/super-admin/team-space' },
    { icon: Settings, label: 'System Management', href: '/dashboard/super-admin/system-management' },
    { icon: FileText, label: 'Audit Logs', href: '/dashboard/super-admin/audit-logs' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/super-admin/calendar' },
    { icon: Mail, label: 'Messages', href: '/dashboard/super-admin/messages' },
  ];

  const preferencesItems = [
    { icon: Settings, label: 'Settings', href: '/dashboard/super-admin/settings' },
    { icon: User, label: 'Contact Admin', href: '/dashboard/super-admin/contact-admin' },
    { icon: LogOut, label: 'Log Out', href: '/logout', textColor: 'text-red-500' },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActiveRoute = (href: string) => {
    // For exact match on superadmin home
    if (href === '/dashboard/super-admin') {
      return pathname === '/dashboard/super-admin';
    }
    // For all other routes, check if current path starts with the href
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:rounded-tr-xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png" 
                alt="MickkyStore Logo" 
                width={180} 
                height={40}
                className="h-8 object-contain"
              />
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-3 space-y-1">
            {/* Home text (not a link) */}
            <div className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700">
              <span className="truncate">Home</span>
            </div>
            
            {/* Rest of navigation items */}
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#E866B7] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences Section */}
        <div className="border-t border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-3">
            Preferences
          </div>
          <nav className="space-y-1">
            {preferencesItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
                    isActive && !item.textColor ? 'bg-pink-500 text-white' : (item.textColor || 'text-gray-700')
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-2 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Left side - Menu and Search */}
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Desktop hamburger menu (optional) */}
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <div className="h-0.5 bg-gray-600 rounded"></div>
                  <div className="h-0.5 bg-gray-600 rounded"></div>
                  <div className="h-0.5 bg-gray-600 rounded"></div>
                </div>
              </button>
              
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right side - Notification and User */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile search button */}
              <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-sm hidden sm:block">
                  <div className="font-medium text-gray-900">User</div>
                  <div className="text-gray-500">Super Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}