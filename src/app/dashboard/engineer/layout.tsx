'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  LayoutDashboard,
  Calendar,
  Calculator,
  Link as Chain,
  ChartNoAxesCombined,
  Wrench,
  Settings,
  Users,
  LogOut,
  LucideIcon,
  MessageCircle,

} from 'lucide-react'




interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon | (() => React.ReactElement);
}

interface SalesLayoutProps {
  children: React.ReactNode;
}

export default function SalesLayout({ children }: SalesLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  const mainNavigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard/engineer', icon: LayoutDashboard },
    { name: 'My Repairs', href: '/dashboard/engineer/repairs', icon: ChartNoAxesCombined },
    { name: 'Parts Requests', href: '/dashboard/engineer/parts', icon: Calculator },
  ]

  const otherItems: NavigationItem[] = [
    { name: 'Calendar', href: '/dashboard/engineer/calendar', icon: Calendar },
    { name: 'Messages', href: '/dashboard/engineer/messaging', icon: MessageCircle },
  ]

  const bottomItems: NavigationItem[] = [
    { name: 'Settings', href: '/dashboard/engineer/settings', icon: Settings },
    { name: 'Contact Admin', href: '/dashboard/engineer/contact-admin', icon: Users },
    { name: 'Log Out', href: '/dashboard/engineer/logout', icon: LogOut }
  ]
 
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Handle resize and initial mobile check
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024
      setIsMobile(isMobileView)
      
      if (!isMobileView) {
        setIsSidebarOpen(false)
      }
    }

    // Initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard/engineer' && pathname === '/dashboard/engineer') return true
    if (href !== '/dashboard/engineer' && pathname.startsWith(href)) return true
    return false
  }

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const active = isActive(item.href)
    const Icon = item.icon

    const baseClasses = 'flex items-center justify-between px-3 py-2.5 text-left transition-all duration-200'
    
    const activeClasses = active
      ? 'bg-[#E866B7] text-white rounded-lg mx-2'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2'

    const logoutClasses = item.name === 'Log Out'
      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
      : ''

    return (
      <Link href={item.href}>
        <div className={`${baseClasses} ${activeClasses} ${logoutClasses}`}>
          <div className="flex items-center space-x-3">
            {typeof Icon === 'function' && item.name !== 'Dashboard' && item.name !== 'Calendar' && item.name !== 'In-House Messages' && item.name !== 'Place Order' && item.name !== 'Settings' && item.name !== 'Contact Admin' && item.name !== 'Log Out' ? (
              <Icon />
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span className="font-medium">{item.name}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sticky Header for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center">
              <Image
                src="/logo.png" 
                alt="MickkyStore Logo" 
                width={140} 
                height={32}
                className="h-8 object-contain"
              />
            </div>
          </div>
          {/* Header right side for mobile */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-sm border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:rounded-tr-xl w-64
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-8 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Notification */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium"></span>
                </span>
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">User</span>
                    <span className="text-xs text-gray-500">Online sales rep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className={`flex-1 overflow-y-auto p-2 lg:p-2 ${isMobile ? 'pt-20' : ''} pb-8`}>
          {children}
        </main>
      </div>
    </div>
  )
}
