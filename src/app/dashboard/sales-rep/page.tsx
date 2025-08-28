'use client'

import React from 'react'
import { 
  ShoppingCart, 
  Eye, 
  Receipt, 
  Wrench,
  Mail,
  User
} from 'lucide-react'

export default function SalesDashboard() {
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900">
              Hello, Nifemi
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Online Sales Representative</span>
            <span>•</span>
            <span>11:45 AM</span>
            <div className="flex items-center gap-1">
              <span className="bg-green-300 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
        
        {/* Customers chatted today */}
        <div className="bg-yellow-100 rounded-lg p-3 text-center min-w-[120px]">
          <div className="text-2xl lg:text-2xl font-bold text-gray-900">47</div>
          <div className="text-sm text-gray-600">Customers chatted today</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Message */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">New Message</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-green-600 text-sm font-medium">+2 today</div>
          </div>
        </div>

        {/* Order in Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Order in Progress</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-yellow-600 text-sm font-medium">3 Pending</div>
          </div>
        </div>

        {/* Daily Sales */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Daily Sales</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">₦2,000,000</div>
            <div className="text-green-600 text-sm font-medium">+2 today</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-lg p-4 shadow-sm border border-gray-200'>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Place Order */}
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="w-8 h-8 mx-auto mb-3">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div className="font-medium mb-1">Place Order</div>
            <div className="text-sm opacity-90">Place a new Order</div>
          </button>

          {/* View Orders */}
          <button className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-4 text-center transition-colors">
            <div className="w-8 h-8 mx-auto mb-3">
              <Eye className="w-8 h-8" />
            </div>
            <div className="font-medium mb-1">View Orders</div>
            <div className="text-sm opacity-90">Check order status</div>
          </button>

          {/* Send Invoice */}
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="w-8 h-8 mx-auto mb-3">
              <Receipt className="w-8 h-8" />
            </div>
            <div className="font-medium mb-1">Send Invoice</div>
            <div className="text-sm opacity-90">Generate and send invoices</div>
          </button>

          {/* Repair Status */}
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-4 text-center transition-colors">
            <div className="w-8 h-8 mx-auto mb-3">
              <Wrench className="w-8 h-8" />
            </div>
            <div className="font-medium mb-1">Repair Status</div>
            <div className="text-sm opacity-90">Track repair progress</div>
          </button>
        </div>
      </div>

      {/* Bottom Section - Messages and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="xl:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                2 new
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Message 1 */}
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center font-semibold text-gray-700">
                SM
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">Samuel Monday</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Hi, I&apos;m interested in the iPhone 15 Pro. Is it available in blue?</p>
              </div>
            </div>

            {/* Message 2 */}
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">Kayode Oyelola</span>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                <p className="text-sm text-gray-600">Can you help with my recent order? I need to change the shipping address.</p>
              </div>
            </div>

            {/* Message 3 */}
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">Testify Olokor</span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <p className="text-sm text-gray-600">Thank you for the quick delivery! The laptop works perfectly.</p>
              </div>
            </div>

            {/* Message 4 */}
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center font-semibold text-gray-700">
                CA
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">Chineye</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600">Do you have any deal on Samsung Galaxy tablets this week?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Activity 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Responded to message from Samuel Monday</p>
                <p className="text-xs text-gray-500">5 min ago</p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Completed Chat with Kyode</p>
                <p className="text-xs text-gray-500">15 min ago</p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Invoice #Inv-2024-001 sent to Voya tech</p>
                <p className="text-xs text-gray-500">25 min ago</p>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Order #12345 processed and shipped</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>

            {/* Activity 5 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Order #12345 processed and shipped</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}