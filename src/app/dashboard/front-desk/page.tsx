"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Download, Target, Eye, MessageSquare, ShoppingCart, FileText, Receipt, Send, Phone } from 'lucide-react';
import { DevicePhoneMobileIcon } from '@heroicons/react/16/solid';
import { frontdeskApi } from '../../../api/frontdeskApi';

type Activity = {
  id: number | string;
  type: string;
  title: string;
  time: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

type MessageItem = {
  id: number | string;
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

// API payload shapes (best-effort, tolerant to partials)
interface ChatSummary {
  id?: number | string;
  participantName?: string;
  name?: string;
  title?: string;
  participantAvatar?: string;
  lastMessage?: { content?: string } | string;
  lastMessageAt?: string;
  updatedAt?: string;
  createdAt?: string;
  unreadCount?: number;
}

interface ActivityLogApi {
  id?: number | string;
  type?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  time?: string;
}

interface RepairTicket {
  id?: number | string;
  status?: string;
}

function normalizeArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown[] }).data)
  ) {
    return ((payload as { data?: unknown[] }).data || []) as T[];
  }
  return [] as T[];
}

export default function DashboardMain(): React.ReactElement {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [chatsRes, unreadRes, activityRes, repairsRes] = await Promise.all([
          frontdeskApi.getChats({ limit: 10 }),
          frontdeskApi.getUnreadMessageCount(),
          frontdeskApi.getActivityLogs({ limit: 10 }),
          frontdeskApi.getRepairs({ status: 'in-progress', limit: 50 }),
        ]);

        if (!isMounted) return;

        const chats = normalizeArray<ChatSummary>(chatsRes.data);
        const mappedMessages: MessageItem[] = chats.map((c: ChatSummary, idx: number) => ({
          id: c.id ?? idx,
          sender: c.participantName || c.name || c.title || 'Chat',
          avatar: c.participantAvatar || 'SM',
          message:
            typeof c.lastMessage === 'string'
              ? c.lastMessage
              : c.lastMessage?.content || 'No messages yet',
          time: formatRelativeTime(c.lastMessageAt || c.updatedAt || c.createdAt),
          isNew: !!c.unreadCount,
        }));

        const unread = unreadRes.data as { count?: number } | number;
        const unreadNumber = typeof unread === 'number' ? unread : (unread?.count ?? 0);

        const logs = normalizeArray<ActivityLogApi>(activityRes.data);
        const mappedActivities: Activity[] = logs.map((log: ActivityLogApi, idx: number) => ({
          id: log.id ?? idx,
          type: log.type || 'activity',
          title: log.title || log.message || 'Activity',
          time: formatRelativeTime(log.createdAt || log.time),
          icon: resolveIcon(log.type),
          color: resolveColor(log.type),
        }));

        const repairsList = normalizeArray<RepairTicket>(repairsRes.data);

        setMessages(mappedMessages);
        setUnreadCount(Number(unreadNumber) || 0);
        setRecentActivities(mappedActivities);
        setRepairs(repairsList);
      } catch {
        // non-fatal; keep placeholders
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const ongoingRepairsCount = useMemo(() => {
    if (!Array.isArray(repairs)) return 0;
    const inProgress = repairs.filter((r: RepairTicket) =>
      typeof r?.status === 'string' ? r.status.toLowerCase().includes('progress') : false
    );
    return inProgress.length || repairs.length || 0;
  }, [repairs]);

  const pendingApprovalCount = useMemo(() => {
    if (!Array.isArray(repairs)) return 0;
    const pending = repairs.filter((r: RepairTicket) =>
      typeof r?.status === 'string' ? r.status.toLowerCase().includes('pending') : false
    );
    return pending.length || 0;
  }, [repairs]);

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
                <span className=" text-gray-700 font-semibold">{loading ? '...' : ongoingRepairsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Pending Approval</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-semibold text-gray-700">{loading ? '...' : pendingApprovalCount}</span>
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
                    {loading ? '...' : `${unreadCount} new`}
                  </span>
                </div>
              </div>
              <div className="p-0">
                {(loading ? [0,1,2] : messages).map((item, index) => {
                  const isLoading = loading;
                  const message = isLoading ? undefined : (item as MessageItem);
                  return (
                    <div key={message?.id ?? index} className="p-6 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors relative">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="absolute left-6 w-0.5 h-12 bg-yellow-400"></div>
                          {isLoading ? (
                            <div className="w-10 h-10 ml-3 bg-gray-200 rounded-full animate-pulse" />
                          ) : message?.avatar?.includes('/') ? (
                            <Image
                              src={message.avatar}
                              alt={message.sender}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover ml-3"
                            />
                          ) : (
                            <div className="w-10 h-10 ml-3 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {message?.avatar || 'SM'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900">{isLoading ? 'Loading...' : message?.sender}</p>
                            <span className="text-xs text-gray-500">{isLoading ? '' : message?.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{isLoading ? 'Please wait...' : message?.message}</p>
                        </div>
                      </div>
                    
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-0">
                {(loading ? [0,1,2,3] : recentActivities).map((item, idx) => {
                  const isLoading = loading;
                  const activity = isLoading ? undefined : (item as Activity);
                  const IconComponent = isLoading ? MessageSquare : activity!.icon;
                  const colorClass = isLoading ? 'text-gray-300' : activity!.color;
                  const bgClass = isLoading
                    ? 'bg-gray-100'
                    : activity!.color === 'text-green-500'
                      ? 'bg-green-100'
                      : activity!.color === 'text-pink-500'
                        ? 'bg-pink-100'
                        : activity!.color === 'text-red-500'
                          ? 'bg-red-100'
                          : 'bg-blue-100';
                  return (
                    <div key={(activity?.id as string | number) ?? idx} className="p-6 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
                            <IconComponent size={18} className={colorClass} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">{isLoading ? 'Loading activity...' : activity!.title}</p>
                          <span className="text-xs text-gray-500">{isLoading ? '' : activity!.time}</span>
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

function resolveIcon(type?: string) {
  const t = (type || '').toLowerCase();
  if (t.includes('message') || t.includes('chat')) return MessageSquare;
  if (t.includes('order') || t.includes('sale')) return ShoppingCart;
  if (t.includes('invoice') || t.includes('receipt')) return FileText;
  if (t.includes('call') || t.includes('phone')) return Phone;
  return MessageSquare;
}

function resolveColor(type?: string) {
  const t = (type || '').toLowerCase();
  if (t.includes('message') || t.includes('chat')) return 'text-green-500';
  if (t.includes('invoice') || t.includes('receipt')) return 'text-red-500';
  if (t.includes('order') || t.includes('sale')) return 'text-blue-500';
  return 'text-pink-500';
}

function formatRelativeTime(dateLike?: string) {
  if (!dateLike) return '';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day === 1 ? '' : 's'} ago`;
}