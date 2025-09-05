import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Download, Target, Eye, MessageSquare, ShoppingCart, FileText, Receipt, Send, Phone } from 'lucide-react';
import { DevicePhoneMobileIcon } from '@heroicons/react/16/solid';

type Activity = {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

type MessageItem = {
  id: number;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isNew: boolean;
};

type Order = {
  id: number;
  product: string;
  orderId: string;
  customer: string;
  source: string;
  amount: string;
  stock?: number;
  status: 'pending' | 'approved' | 'delivered' | 'ready' | 'cancelled';
  action?: string;
  badges: string[];
};

export default function DashboardMain(): React.ReactElement {
  const messages: MessageItem[] = [
    {
      id: 1,
      sender: 'Semiu',
      avatar: 'SM',
      message: 'Chineye, that iPhone 15, the customer will need to change the battery',
      time: 'just now',
      isNew: true
    },
    {
      id: 2,
      sender: 'Nifemi',
      avatar: '/api/placeholder/32/32',
      message: 'I sent an order since, you never create receipt for am',
      time: '15 min ago',
      isNew: true
    },
    {
      id: 3,
      sender: 'Mr Michael',
      avatar: '/api/placeholder/32/32',
      message: 'Check your task bos',
      time: '1 hour ago',
      isNew: false
    },
    {
      id: 4,
      sender: 'Samuel',
      avatar: 'CA',
      message: 'Watsup, your account should be working now',
      time: '2 hours ago',
      isNew: false
    }
  ];

  const recentActivities: Activity[] = [
    {
      id: 1,
      type: 'message',
      title: 'Responded to message from Samuel Monday',
      time: '5 min ago',
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'chat',
      title: 'Completed Chat with Kyode',
      time: '12 min ago',
      icon: MessageSquare,
  color: 'text-pink-500'
    },
    {
      id: 3,
      type: 'invoice',
      title: 'Invoice #Inv-2024-001 sent to Voya tech',
      time: '25 min ago',
      icon: FileText,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'order',
      title: 'Order #12345 processed and shipped',
      time: '1 hour ago',
      icon: ShoppingCart,
      color: 'text-blue-500'
    },
    {
      id: 5,
      type: 'order',
      title: 'Order #12345 processed and shipped',
      time: '1 hour ago',
      icon: ShoppingCart,
      color: 'text-blue-500'
    }
  ];

  // Sample orders data and helper functions to avoid implicit any errors
  const orders: Order[] = [
    {
      id: 1,
      product: 'iPhone 15 Pro Repair',
      orderId: 'ORD-1001',
      customer: 'John Doe',
      source: 'Walk-in',
      amount: '₦120,000',
      stock: 2,
      status: 'pending',
      action: 'create-receipt',
      badges: ['Pending']
    },
    {
      id: 2,
      product: 'Samsung S24 Screen',
      orderId: 'ORD-1002',
      customer: 'Jane Smith',
      source: 'Online',
      amount: '₦40,000',
      status: 'approved',
      action: 'create-receipt',
      badges: ['Approved']
    },
    {
      id: 3,
      product: 'Itel S24 Screen',
      orderId: 'ORD-1003',
      customer: 'Jane Doe',
      source: 'Online',
      amount: '₦40,000',
      status: 'cancelled',
      action: 'create-receipt',
      badges: ['Cancelled']
    }
  ];

  const getStatusBadge = (badge: string): string => {
    switch (badge.toLowerCase()) {
      case 'approved':
        return 'text-white bg-green-600 px-2 py-1 rounded text-xs font-medium';
      case 'ready':
        return 'text-white bg-yellow-500 px-2 py-1 rounded text-xs font-medium';
      case 'pending':
        return 'text-white bg-orange-500 px-2 py-1 rounded text-xs font-medium';
      case 'delivered':
        return 'text-white bg-blue-500 px-2 py-1 rounded text-xs font-medium';
      case 'cancelled':
        return 'text-white bg-red-500 px-2 py-1 rounded text-xs font-medium';
      default:
        return 'text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-medium';
    }
  };

  const getStatusDropdown = (status: Order['status']): React.ReactElement => {
    return (
      <select defaultValue={status} className="border border-gray-200 rounded px-3 py-2 text-sm">
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="shipped">Delivered</option>
        <option value="completed">Ready</option>
        <option value="cancelled">Cancelled</option>
      </select>
    );
  };

  const getActionButton = (action: string | undefined, status: Order['status']): React.ReactElement => {
    // Use status to determine primary action label/tooltip
    if (action === 'ready') {
      return (
        <button className="bg-[#E866B7] text-white px-3 py-2 rounded text-sm">{status === 'ready' ? 'Mark as delivered' : 'Mark as delivered'}</button>
      );
    }

    return (
      <button className="text-gray-700 border border-gray-300 py-2.5 px-4 flex items-center justify-center gap-2 rounded text-sm"><Receipt className="w-4 h-4" /> Create Reciept</button>
    );
  };

  return (
    <div className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Hello Devaan.</h2>
                    <p className="text-gray-600 text-sm">Monitor all sales, repairs, and orders.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <Link
                    href="/dashboard/front-desk/new-reciept"
                    className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    New Receipt
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                  </div>
                </div>
      
              </div>
        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Today's Sales Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Todays Sales summary</h3>
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Send className='text-white' size={17}/>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Todays sales</p>
              </div>
              <p className="text-xl font-bold text-green-500">₦60,000</p>
              <button className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Plus size={17} />
                New Sale
              </button>
            </div>
          </div>

          {/* Repair Overview Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Repair Overview</h3>
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Send className='text-white' size={17}/>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Ongoing repairs</span>
                <span className=" text-gray-700 font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Pending Approval</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-semibold text-gray-700">1</span>
                </div>
              </div>
              <button className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Target size={17} />
                Track Repair
              </button>
            </div>
          </div>

          {/* Inventory Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Send className='text-white' size={17}/>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Stock transferred</span>
                <span className="font-semibold text-gray-700">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Pending Approval</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-semibold text-gray-700">2</span>
                </div>
              </div>
              <button className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Eye size={20} />
                View Inventory
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Messages, Recent Activity, and Orders Table */}
        <div className="space-y-6">
          {/* Messages and Recent Activity Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* In House Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">In house messages</h3>
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-sm">
                    2 new
                  </span>
                </div>
              </div>
              <div className="p-0">
                {messages.map((message, index) => (
                  <div key={message.id} className="p-6 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="absolute left-6 w-0.5 h-12 bg-yellow-400"></div>
                        {message.avatar.includes('/') ? (
                          <Image
                            src={message.avatar}
                            alt={message.sender}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover ml-3"
                          />
                        ) : (
                          <div className="w-10 h-10 ml-3 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {message.avatar}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900">{message.sender}</p>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{message.message}</p>
                      </div>
                    </div>
      
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-0">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="p-6 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.color === 'text-green-500' ? 'bg-green-100' :
                            activity.color === 'text-pink-500' ? 'bg-pink-100' :
                            activity.color === 'text-red-500' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            <IconComponent size={18} className={activity.color} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">{activity.title}</p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orders/Receipts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto max-h-100 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <DevicePhoneMobileIcon className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{order.product}</p>
                            <p className="text-sm text-gray-500">{order.orderId}</p>
                            <div className="p-1">
                                <div key={`badges-${order.id}`} className="flex gap-2 pl-16">
                                  {order.badges.map((badge, index) => (
                                    <span key={index} className={getStatusBadge(badge)}>
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">Source: {order.source}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Amount: {order.amount}</p>
                          {order.stock && (
                            <p className="text-xs text-green-600">Stock: {order.stock}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-gray-700">
                        <div className='hover:bg-gray-50'>
                          {getStatusDropdown(order.status)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className='hover:bg-gray-50'>
                          {getActionButton(order.action, order.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}