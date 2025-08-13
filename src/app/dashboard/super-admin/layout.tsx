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
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/super-admin' },
    { icon: Calculator, label: 'Accounting', href: '/dashboard/super-admin/accounting' },
    { icon: Package, label: 'Inventory', href: '/dashboard/super-admin/inventory' },
    { icon: Wrench, label: 'Repair Tracking', href: '/dashboard/super-admin/repair-tracking' },
    { icon: MessageSquare, label: 'Cross Messaging', href: '/dashboard/super-admin/cross-messaging' },
    { icon: TeamIcon, label: 'Team Space', href: '/dashboard/super-admin/team-space' },
    { icon: FileText, label: 'Audit Logs', href: '/dashboard/super-admin/audit-logs' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/super-admin/calendar' },
    { icon: Mail, label: 'Messages', href: '/dashboard/super-admin/messages' },
  ];

  const preferencesItems = [
    { icon: Settings, label: 'Settings', href: '/dashboard/super-admin/settings' },
    { icon: User, label: 'Contact Admin', href: '/dashboard/super-admin/contact-admin' },
    { icon: LogOut, label: 'Log Out', href: '/logout', textColor: 'text-red-500' },
  ];

  // Check if we're on the messages route
  const isOnMessagesRoute = pathname.startsWith('/dashboard/super-admin/messages');
  
  // Determine if sidebar should be collapsed
  const shouldCollapseToIcons = isOnMessagesRoute && !isManuallyCollapsed;

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

  // Check if notification route is active
  const isNotificationActive = pathname.startsWith('/dashboard/super-admin/notify');

  // Toggle collapse manually
  const toggleSidebarCollapse = () => {
    if (isOnMessagesRoute) {
      setIsManuallyCollapsed(!isManuallyCollapsed);
    }
  };

  return (
    <div className={`flex ${isOnMessagesRoute ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gray-50`}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-sm border-r border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out lg:rounded-tr-xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${shouldCollapseToIcons ? 'w-16' : 'w-64'}
        ${isOnMessagesRoute ? 'lg:h-screen' : ''}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              {shouldCollapseToIcons ? (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              ) : (
                <Image
                  src="/logo.png" 
                  alt="MickkyStore Logo" 
                  width={180} 
                  height={40}
                  className="h-8 object-contain"
                />
              )}
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Collapse/Expand toggle for messages route */}
            {isOnMessagesRoute && (
              <button 
                className="hidden lg:block p-1 hover:bg-gray-100 rounded"
                onClick={toggleSidebarCollapse}
              >
                {shouldCollapseToIcons ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <nav className="px-3 space-y-1">
            {/* Home text (not a link) */}
            {!shouldCollapseToIcons && (
              <div className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700">
                <span className="truncate">Home</span>
              </div>
            )}
            
            {/* Navigation items with Others section */}
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <React.Fragment key={index}>
                  {/* Add 'Others' text after Inventory (index 2) */}
                  {index === 3 && !shouldCollapseToIcons && (
                    <div className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 mt-4">
                      <span className="truncate">Others</span>
                    </div>
                  )}
                  
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center ${shouldCollapseToIcons ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'} text-sm font-medium rounded-lg transition-colors relative group ${
                      isActive
                        ? 'bg-[#E866B7] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={shouldCollapseToIcons ? item.label : undefined}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${shouldCollapseToIcons ? '' : 'mr-3'}`} />
                    {!shouldCollapseToIcons && <span className="truncate">{item.label}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {shouldCollapseToIcons && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Preferences Section */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          {!shouldCollapseToIcons && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-3">
              Preferences
            </div>
          )}
          <nav className="space-y-1">
            {preferencesItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center ${shouldCollapseToIcons ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'} text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 relative group ${
                    isActive && !item.textColor ? 'bg-pink-500 text-white' : (item.textColor || 'text-gray-700')
                  }`}
                  title={shouldCollapseToIcons ? item.label : undefined}
                >
                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${shouldCollapseToIcons ? '' : 'mr-3'}`} />
                  {!shouldCollapseToIcons && <span className="truncate">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {shouldCollapseToIcons && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col lg:ml-0 ${isOnMessagesRoute ? 'h-screen overflow-hidden' : ''}`}>
        {/* Header */}
        <header className={`bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-2 z-30 flex-shrink-0 ${
          isOnMessagesRoute ? 'relative' : 'sticky top-0'
        }`}>
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
              
              {/* Hide search on messages route to save space */}
              {!isOnMessagesRoute && (
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 w-64 lg:w-80 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>

            {/* Right side - Notification and User */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile search button - only show if not on messages route */}
              {!isOnMessagesRoute && (
                <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              <Link href='/dashboard/super-admin/notify'>
                <button className={`p-2 hover:bg-gray-100 rounded-lg relative ${
                  isNotificationActive ? 'bg-white' : ''
                }`}>
                  <Bell className={`w-5 h-5 ${
                    isNotificationActive ? 'text-[#E866B7]' : 'text-gray-600'
                  }`} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </Link>

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

          {/* Mobile search bar - only show if not on messages route */}
          {!isOnMessagesRoute && (
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
          )}
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden ${
          isOnMessagesRoute 
            ? 'p-0 h-full overflow-hidden' 
            : 'p-4 sm:p-6'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}