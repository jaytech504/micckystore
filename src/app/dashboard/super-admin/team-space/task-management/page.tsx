'use client'

import React, { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { TaskDetailsModal, StartTaskModal, UpdateTaskModal, AddTaskModal } from './TaskModals';

interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  department: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'In Progress' | 'Completed'
  tags?: string[]
  createdBy?: string
  overdue?: boolean
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Process iPhone 15 shipment',
    description: 'Check and catalog incoming iPhone 15 units, update inventory system',
    assignedTo: 'Margaret A',
    department: 'Accounting',
    dueDate: 'Aug 7, 2024',
    priority: 'High',
    status: 'Pending',
    overdue: true
  },
  {
    id: '2',
    title: 'Customer warranty claim review',
    description: 'Review warranty claim for MacBook Pro - customer reports screen issues',
    assignedTo: 'Osas A',
    department: 'Engineer',
    dueDate: 'Aug 8, 2025',
    priority: 'Medium',
    status: 'In Progress',
    overdue: true
  },
  {
    id: '3',
    title: 'Monthly sales report preparation',
    description: 'Compile Q3 sales data and prepare presentation for regional meeting',
    assignedTo: 'Chineye Deomature',
    department: 'Sales',
    dueDate: 'Aug 5, 2024',
    priority: 'Low',
    status: 'Completed'
  },
  {
    id: '4',
    title: 'Budget reconciliation',
    description: 'Check and catalog incoming iPhone 15 units, update inventory system',
    assignedTo: 'Margaret A',
    department: 'Accounting',
    dueDate: 'Aug 7, 2024',
    priority: 'Medium',
    status: 'Pending',
    overdue: true
  },
  {
    id: '5',
    title: 'Gaming console display setup',
    description: 'Set up new PlayStation 5 and Xbox Series X display for showroom',
    assignedTo: 'Margaret A',
    department: 'Sales',
    dueDate: 'Aug 7, 2024',
    priority: 'High',
    status: 'Pending',
    overdue: true
  },
  {
    id: '6',
    title: 'Repair smartphone - cracked screen',
    description: 'Replace cracked screen on Samsung Galaxy S24 - customer waiting',
    assignedTo: 'Margaret A',
    department: 'Engineer',
    dueDate: 'Aug 7, 2024',
    priority: 'High',
    status: 'Pending',
    overdue: true
  }
]

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedDate, setSelectedDate] = useState('All Dates')
  const [showStartModal, setShowStartModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const statusCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  }

  const handleStartTask = (task: Task) => {
    setSelectedTask(task)
    setShowStartModal(true)
  }

  const handleUpdateTask = (task: Task) => {
    setSelectedTask(task)
    setShowUpdateModal(true)
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setShowDetailsModal(true)
  }

  const confirmStartTask = (note?: string) => {
    if (selectedTask) {
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, status: 'In Progress' as const }
          : t
      ))
    }
    setShowStartModal(false)
    setSelectedTask(null)
  }

  const confirmUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => 
      t.id === updatedTask.id ? updatedTask : t
    ))
    setShowUpdateModal(false)
    setSelectedTask(null)
  }

  const createTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: (tasks.length + 1).toString(),
      createdBy: 'Alex Manager'
    }
    setTasks([...tasks, task])
    setShowAddModal(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 border-red-200'
      case 'Medium': return 'text-[#FBB906] border-yellow-200'
      case 'Low': return 'text-green-400 border-green-200'
      default: return 'text-gray-600 border-gray-200'
    }
  }


  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-white bg-red-400 border-red-200'
      case 'In Progress': return 'text-white bg-[#FBB906] border-yellow-200'
      case 'Completed': return 'text-white bg-green-600 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Manage and track tasks for your team</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#E866B7] hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl text-black font-semibold">{statusCounts.total}</p>
            </div>
            <div className="bg-gray-100 text-black px-2 py-1 rounded text-sm font-medium">
              6
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl text-black font-semibold">{statusCounts.pending}</p>
            </div>
            <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              3
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl text-black font-semibold">{statusCounts.inProgress}</p>
            </div>
            <div className="bg-[#FBB906] text-white px-2 py-1 rounded text-sm font-medium">
              2
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-black font-semibold">{statusCounts.completed}</p>
            </div>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
              1
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks, assignees or descriptions..."
              className="w-100 pl-10 text-gray-900 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          
          <select
            className="px-3 py-2 border text-xs bg-gray-100 border-gray-200 rounded-lg  text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          
          <select
            className="px-3 py-2 border text-xs bg-gray-100 border-gray-200 rounded-lg  text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>All Roles</option>
            <option>Accounting</option>
            <option>Engineer</option>
            <option>Sales</option>
          </select>
          
          <select
            className="px-3 py-2 border text-xs bg-gray-100 border-gray-200 rounded-lg  text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option>All Dates</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusTextColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-black font-medium">MA</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">{task.assignedTo}</p>
                  <p className="text-xs text-gray-500">{task.department}</p>
                </div>
              </div>
            </div>
            
            <div className={`text-xs mb-4 ${task.overdue ? 'text-red-600' : 'text-gray-500'}`}>
              Due {task.dueDate} {task.overdue && '(Overdue)'}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleViewDetails(task)}
                className="flex-1 px-3 py-2 border text-black border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                View Details
              </button>
              {task.status === 'Pending' && (
                <button
                  onClick={() => handleStartTask(task)}
                  className="flex-1 px-3 py-2 bg-[#E866B7] text-white rounded-lg text-sm hover:bg-pink-600"
                >
                  Start
                </button>
              )}
              {task.status === 'In Progress' && (
                <button
                  onClick={() => handleUpdateTask(task)}
                  className="flex-1 px-3 py-2 bg-[#E866B7] text-white rounded-lg text-sm hover:bg-pink-600"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL COMPONENTS - COPY THE MODALS FROM THE FIRST ARTIFACT AND PASTE THEM HERE */}
      {showStartModal && selectedTask && (
        <StartTaskModal
          task={selectedTask}
          onClose={() => setShowStartModal(false)}
          onConfirm={confirmStartTask}
        />
      )}

      {showUpdateModal && selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={() => setShowUpdateModal(false)}
          onConfirm={confirmUpdateTask}
        />
      )}

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false)
            setShowUpdateModal(true)
          }}
        />
      )}

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onConfirm={createTask}
        />
      )}
    </div>
  )
}