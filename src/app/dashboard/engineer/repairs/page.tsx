'use client';

import { useState } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { DevicePhoneMobileIcon } from '@heroicons/react/16/solid';

// Types
interface Repair {
  id: string;
  device: string;
  imei: string;
  customer: string;
  issue: string;
  date: string;
  status: 'pending' | 'in progress' | 'completed' | 'delayed';
  priority: 'urgent' | 'normal' | 'low';
}

type StatusType = 'pending' | 'in progress' | 'completed' | 'delayed';
type PriorityType = 'urgent' | 'normal' | 'low';

interface RepairDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: Repair | null;
}

// Mock data for repairs
const repairData: Repair[] = [
  {
    id: 'MSR-00086532',
    device: 'iPhone 15 Pro',
    imei: '29371130713',
    customer: 'Samuel Monday',
    issue: 'Cracked screen, touch not responding in.....',
    date: 'Aug 07',
    status: 'pending',
    priority: 'urgent'
  },
  {
    id: 'MSR-00086532',
    device: 'Samsung Galaxy S24',
    imei: '29371130713',
    customer: 'Chineye Deo',
    issue: 'Battery drains quickly, overheating issues.....',
    date: 'Aug 07',
    status: 'in progress',
    priority: 'normal'
  },
  {
    id: 'MSR-00086532',
    device: 'Macbook pro 2021',
    imei: '29371130713',
    customer: 'Michael Oye',
    issue: 'Liquid damage, keyboard not working....',
    date: 'Aug 07',
    status: 'completed',
    priority: 'normal'
  },
  {
    id: 'MSR-00086532',
    device: 'iPad Air 5th Gen',
    imei: '29371130713',
    customer: 'Samuel Monday',
    issue: 'Screen flickering, random restarts....',
    date: 'Aug 07',
    status: 'delayed',
    priority: 'normal'
  },
  {
    id: 'MSR-00086532',
    device: 'iPhone 15 Pro',
    imei: '29371130713',
    customer: 'Samuel Monday',
    issue: 'Cracked screen, touch not responding in.....',
    date: 'Aug 07',
    status: 'pending',
    priority: 'urgent'
  },
  {
    id: 'MSR-00086532',
    device: 'iPhone 15 Pro',
    imei: '29371130713',
    customer: 'Samuel Monday',
    issue: 'Cracked screen, touch not responding in.....',
    date: 'Aug 07',
    status: 'pending',
    priority: 'urgent'
  }
];

const statusColors: Record<StatusType, string> = {
  pending: 'bg-red-100 text-red-700',
  'in progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  delayed: 'bg-orange-100 text-orange-700'
};

const priorityColors: Record<PriorityType, string> = {
  urgent: 'bg-red-100 text-red-700',
  normal: 'bg-gray-100 text-gray-700',
  low: 'bg-blue-100 text-blue-700'
};

function RepairDetailModal({ isOpen, onClose, repair }: RepairDetailModalProps) {
  if (!isOpen || !repair) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <DevicePhoneMobileIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <div className="text-lg text-gray-700">{repair.id}</div>
              <div className="text-sm text-gray-500">{repair.device}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Device Information */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-4">Device Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-700 mb-1">Model</div>
                <div className='text-gray-500'>iPhone 15promax 256gb</div>
              </div>
              <div>
                <div className="text-gray-700 mb-1">Color</div>
                <div className='text-gray-500'>Blue</div>
              </div>
              <div>
                <div className="text-gray-700 mb-1">Imei</div>
                <div className='text-gray-500'>35478901234567B</div>
              </div>
              <div>
                <div className="text-gray-700 mb-1">Customer</div>
                <div className='text-gray-500'>{repair.customer}</div>
              </div>
              <div>
                <div className="text-gray-700 mb-1">Received</div>
                <div className='text-gray-500'>August 7th, 2025</div>
              </div>
            </div>
          </div>

          {/* Reported Fault */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-2 text-gray-700">Reported Fault</h3>
            <p className="text-sm text-gray-600">{repair.issue}</p>
          </div>

          {/* Status & Priority */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4 text-gray-700">Status & Priority</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Status</label>
                <select className="w-full p-2 text-gray-500 border rounded-lg bg-white" defaultValue={repair.status}>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Priority</label>
                <select className="w-full p-2 text-gray-500 border rounded-lg bg-white" defaultValue={repair.priority}>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Engineer Diagnosis */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-2 text-gray-700">Engineer Diagnosis</h3>
            <label className="text-sm text-gray-500 mb-2 block">Priority</label>
            <textarea 
              className="w-full p-3 text-gray-500 border rounded-lg resize-none" 
              rows={3}
              placeholder="State what the issue is..."
            />
          </div>

          {/* Estimated Cost */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4 text-gray-700">Estimated Cost (NGN)</h3>
            <div>
              <label className="text-sm text-gray-500 mb-2 block">NGN</label>
              <input 
                type="text" 
                className="w-full p-2 text-gray-500 border rounded-lg" 
                placeholder="Type the estimated amount (Optional)"
              />
            </div>
          </div>

          {/* Spare Parts */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4 text-gray-700">Spare Parts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-500">iPhone 15promax screen</div>
                  <div className="text-xs text-gray-500">Qty: 1 × NGN 50,000</div>
                </div>
                <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                  🗑️
                </button>
              </div>
              <div>
                <input 
                  type="text" 
                  className="w-full p-2 text-sm text-gray-500 border rounded-lg mb-2" 
                  placeholder="Enter Part Name"
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 p-2 text-sm text-gray-500 border rounded-lg" 
                    placeholder="Enter quantity"
                  />
                  <input 
                    type="text" 
                    className="flex-1 p-2 text-sm text-gray-500 border rounded-lg" 
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <button className="w-full text-gray-500 px-4 py-2.5 border rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                Add Part
                <Plus className="w-4 h-4 text-pink-500" />
              </button>
            </div>
          </div>

          {/* Progress Notes */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4 text-gray-700">Progress Notes</h3>
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Progress</label>
              <textarea 
                className="w-full p-3 text-gray-500 border rounded-lg resize-none" 
                rows={4}
                placeholder="Add progress note..."
              />
            </div>
            <button className="w-full text-gray-500 px-4 py-2.5 border rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Add Note
              <Plus className="w-4 h-4 text-pink-500" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-pink-500 text-sm text-white py-3 rounded-lg font-medium hover:bg-pink-600">
              Save Changes
            </button>
            <button className="w-full text-sm text-gray-700 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Request Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RepairDashboard() {
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priority');

  const handleViewDetails = (repair: Repair): void => {
    setSelectedRepair(repair);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl lg:text-2xl font-semibold text-gray-800">
            Hello, Osas <span className="text-gray-500 text-lg">Repair Dashboard</span>
          </h1>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Online</span>
        </div>
        <p className="text-gray-600">Manage and track device repair jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl text-gray-700 font-bold">2</p>
            </div>
            <span className="bg-pink-400 text-white text-xs px-2 py-1 rounded">Active</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl text-gray-700 font-bold">1</p>
            </div>
            <span className="bg-pink-400 text-white text-xs px-2 py-1 rounded">Active</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl text-gray-700 font-bold">4</p>
            </div>
            <span className="bg-pink-400 text-white text-xs px-2 py-1 rounded">This month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl text-gray-700 font-bold">1</p>
            </div>
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Job ID, device name, or customer..."
                className="w-full pl-10 pr-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center text-gray-700 text-sm gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters:</span>
              </button>
              <select 
                className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select 
                className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option>All Priority</option>
                <option>Urgent</option>
                <option>Normal</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Repairs List */}
        <div className="divide-y">
          {repairData.map((repair: Repair, index: number) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
                    <DevicePhoneMobileIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                      <div className="lg:w-32">
                        <div className="font-medium text-gray-700 text-sm">{repair.id}</div>
                        <div className="text-xs text-gray-400">{repair.date}</div>
                      </div>
                      <div className="lg:w-40">
                        <div className="font-medium text-gray-700 text-sm">{repair.device}</div>
                        <div className="text-xs text-gray-500">Imei: {repair.imei}</div>
                      </div>
                      <div className="lg:w-32">
                        <div className="text-sm text-gray-700">{repair.customer}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600 truncate">{repair.issue}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[repair.status]}`}>
                          {repair.status}
                        </span>
                        {repair.priority === 'urgent' && (
                          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[repair.priority]}`}>
                            urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(repair)}
                  className="ml-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <RepairDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repair={selectedRepair}
      />
    </div>
  );
}
