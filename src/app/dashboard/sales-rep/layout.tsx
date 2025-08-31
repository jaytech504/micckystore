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
  ShoppingCart,
  Settings,
  Users,
  LogOut,
  LucideIcon,
  MessageCircle
} from 'lucide-react'

// Social Media Icons Components
const WhatsAppIcon = () => (
  <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.687"/>
    </svg>
  </div>
)

const InstagramIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-sm flex items-center justify-center">
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C8.396 0 7.952.01 6.684.048 5.417.087 4.551.222 3.782.42a5.888 5.888 0 0 0-2.125.98A5.888 5.888 0 0 0 .675 3.782C.222 4.551.087 5.417.048 6.684.01 7.952 0 8.396 0 12.017s.01 4.065.048 5.332c.04 1.268.174 2.133.372 2.902a5.888 5.888 0 0 0 .98 2.125 5.888 5.888 0 0 0 2.125.98c.769.198 1.634.333 2.902.372C7.952 23.99 8.396 24 12.017 24s4.065-.01 5.332-.048c1.268-.04 2.133-.174 2.902-.372a5.888 5.888 0 0 0 2.125-.98 5.888 5.888 0 0 0 .98-2.125c.198-.769.333-1.634.372-2.902.04-1.267.048-1.711.048-5.332s-.01-4.065-.048-5.332c-.04-1.268-.174-2.133-.372-2.902a5.888 5.888 0 0 0-.98-2.125A5.888 5.888 0 0 0 20.684.42C19.915.222 19.049.087 17.781.048 16.514.01 16.07 0 12.449 0h-.432zm-.086 2.198c.63.003 1.114.01 1.563.023 1.267.04 1.953.171 2.408.284.606.236 1.04.517 1.495.972.455.455.736.889.972 1.495.113.455.244 1.141.284 2.408.015.462.023.946.023 1.563v.896c0 .617-.008 1.101-.023 1.563-.04 1.267-.171 1.953-.284 2.408a4.018 4.018 0 0 1-.972 1.495c-.455.455-.889.736-1.495.972-.455.113-1.141.244-2.408.284-.462.015-.946.023-1.563.023H12.017c-.617 0-1.101-.008-1.563-.023-1.267-.04-1.953-.171-2.408-.284a4.018 4.018 0 0 1-1.495-.972 4.018 4.018 0 0 1-.972-1.495c-.113-.455-.244-1.141-.284-2.408-.015-.462-.023-.946-.023-1.563V12.017c0-.617.008-1.101.023-1.563.04-1.267.171-1.953.284-2.408.236-.606.517-1.04.972-1.495a4.018 4.018 0 0 1 1.495-.972c.455-.113 1.141-.244 2.408-.284.462-.015.946-.023 1.563-.023zm.086 3.235a6.581 6.581 0 1 0 0 13.162 6.581 6.581 0 0 0 0-13.162zm0 2.198a4.383 4.383 0 1 1 0 8.766 4.383 4.383 0 0 1 0-8.766zm7.504-2.383a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0z"/>
    </svg>
  </div>
)

const FacebookIcon = () => (
  <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </div>
)

const TikTokIcon = () => (
  <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  </div>
)

const TwitterIcon = () => (
  <div className="w-5 h-5 bg-sky-500 rounded-sm flex items-center justify-center">
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  </div>
)

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
    { name: 'Dashboard', href: '/dashboard/sales-rep', icon: LayoutDashboard },
    { name: 'WhatsApp', href: '/dashboard/sales-rep/whatsapp', icon: WhatsAppIcon },
    { name: 'Instagram', href: '/dashboard/sales-rep/instagram', icon: InstagramIcon },
    { name: 'Facebook', href: '/dashboard/sales-rep/facebook', icon: FacebookIcon },
  ]

  const otherItems: NavigationItem[] = [
    { name: 'Tiktok', href: '/dashboard/sales-rep/tiktok', icon: TikTokIcon },
    { name: 'Twitter', href: '/dashboard/sales-rep/twitter', icon: TwitterIcon },
    { name: 'Calendar', href: '/dashboard/sales-rep/calendar', icon: Calendar },
    { name: 'In-House Messages', href: '/dashboard/sales-rep/messaging', icon: MessageCircle },
    { name: 'Place Order', href: '/dashboard/sales-rep/place-order', icon: ShoppingCart },
  ]

  const bottomItems: NavigationItem[] = [
    { name: 'Settings', href: '/sales/settings', icon: Settings },
    { name: 'Contact Admin', href: '/sales/contact-admin', icon: Users },
    { name: 'Log Out', href: '/logout', icon: LogOut }
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
    if (href === '/dashboard/sales-rep' && pathname === '/dashboard/sales-rep') return true
    if (href !== '/dashboard/sales-rep' && pathname.startsWith(href)) return true
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
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
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
