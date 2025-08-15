'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Receipt,
  Calculator,
  ChevronDown,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  BarChart3,
  Calendar,
  MessageCircle,
  Settings,
  Shield,
  LogOut,
  X,
  Menu,
  LucideIcon
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  hasDropdown?: boolean;
  isLogout?: boolean;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const mainNavigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard/accounting', icon: LayoutDashboard },
    { name: 'Transaction', href: '/dashboard/accounting/transaction', icon: Receipt },
    { name: 'Financial Overview', href: '/dashboard/accounting/financials', icon: Calculator },
  ];

  const otherItems: NavigationItem[] = [
    { name: 'Inventory', href: '/dashboard/accounting/inventory', icon: Package },
    { name: 'Sales', href: '/dashboard/accounting/sales', icon: ShoppingCart },
    { name: 'Customers', href: '/dashboard/accounting/customers', icon: Users },
    { name: 'Vendor', href: '/dashboard/accounting/vendor', icon: UserCheck },
    { name: 'Reports', href: '/dashboard/accounting/reports', icon: BarChart3 },
    { name: 'Calendar', href: '/dashboard/accounting/calendar', icon: Calendar },
    { name: 'Messages', href: '/dashboard/accounting/messages', icon: MessageCircle }
  ];

  const bottomItems: NavigationItem[] = [
    { name: 'Settings', href: '/dashboard/accounting/settings', icon: Settings },
    { name: 'Contact Admin', href: '/dashboard/accounting/contact-admin', icon: Shield },
    { name: 'Log Out', href: '/logout', icon: LogOut, isLogout: true }
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard/accounting' && pathname === '/dashboard/accounting') return true;
    if (href !== '/dashboard/accounting' && pathname.startsWith(href)) return true;
    return false;
  };

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const baseClasses = 'flex items-center justify-between px-3 py-2.5 text-left transition-all duration-200';
    
    const activeClasses = active
      ? 'bg-[#E866B7] text-white rounded-lg mx-2'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2';

    const logoutClasses = item.isLogout
      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
      : '';

    if (item.hasDropdown) {
      return (
        <div className={`${baseClasses} ${activeClasses} ${logoutClasses} cursor-pointer`}>
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
      );
    }

    return (
      <Link href={item.href}>
        <div className={`${baseClasses} ${activeClasses} ${logoutClasses}`}>
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Hamburger Menu Button - Only visible on small screens */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
              <div>
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Home Section Label */}
          <div className="px-6 mb-3">
            <span className="text-gray-600 text-sm font-medium">Home</span>
          </div>

          <nav className="space-y-1 text-sm">
            {mainNavigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Others Section */}
          <div className="mt-8">
            <div className="px-6 mb-3">
              <span className="text-gray-600 text-sm font-medium">Others</span>
            </div>
            <nav className="space-y-1 text-sm">
              {otherItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-4">
          <div className="px-6 mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Preferences
            </span>
          </div>
          <nav className="space-y-1 text-sm">
            {bottomItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 overflow-hidden">
        <main className="h-full overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}