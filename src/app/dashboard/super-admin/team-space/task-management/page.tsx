'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Loader2 } from 'lucide-react'
import { TaskDetailsModal, StartTaskModal, UpdateTaskModal, AddTaskModal } from './TaskModals';
import { useTasks, useTaskStats, useTaskOperations, useTaskSearch } from '../../hooks/useTasks';
import { useAuth } from '../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../components/ProtectedRoute';

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

function TaskManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedDate, setSelectedDate] = useState('All Dates')
  const [showStartModal, setShowStartModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { user } = useAuth();
  const { createTask, updateTask, deleteTask, markAsCompleted, markAsInProcess, loading: operationLoading } = useTaskOperations();

  // API hooks
  const { tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks({
    status: selectedStatus !== 'All Status' ? (selectedStatus.toLowerCase().replace(' ', '_') as 'in_process' | 'completed') : undefined,
    task_type: selectedRole !== 'All Roles' ? (selectedRole.toLowerCase() as 'repairs' | 'others') : undefined,
    page: 1,
    limit: 50
  });

  const { stats, loading: statsLoading, error: statsError } = useTaskStats();

  const { tasks: searchResults, loading: searchLoading } = useTaskSearch(searchTerm, {
    status: selectedStatus !== 'All Status' ? (selectedStatus.toLowerCase().replace(' ', '_') as 'in_process' | 'completed') : undefined,
    task_type: selectedRole !== 'All Roles' ? (selectedRole.toLowerCase() as 'repairs' | 'others') : undefined
  });

  // Use search results if searching, otherwise use regular tasks
  const displayTasks = searchTerm ? searchResults : tasks;
  const isLoading = searchTerm ? searchLoading : tasksLoading;

  // Calculate status counts from API data
  const statusCounts = {
    total: displayTasks.length,
    pending: displayTasks.filter(t => t.status === 'in process').length,
    inProgress: displayTasks.filter(t => t.status === 'in process').length,
    completed: displayTasks.filter(t => t.status === 'completed').length
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

  const confirmStartTask = async (note?: string) => {
    if (selectedTask) {
      try {
        await markAsInProcess(selectedTask.id);
        refetchTasks(); // Refresh the task list
      } catch (error) {
        console.error('Error starting task:', error);
      }
    }
    setShowStartModal(false)
    setSelectedTask(null)
  }

  const confirmUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, {
        name: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status === 'In Progress' ? 'in process' : 'completed',
        task_type: updatedTask.department === 'Engineer' ? 'repairs' : 'others'
      });
      refetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setShowUpdateModal(false)
    setSelectedTask(null)
  }

  const handleCreateTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      await createTask({
        name: newTask.title,
        description: newTask.description,
        start_date: new Date().toISOString().split('T')[0],
        finish_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        status: 'in process',
        user: user?.id || '', // Assign to current user or get from form
        task_type: newTask.department === 'Engineer' ? 'repairs' : 'others'
      });
      refetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error creating task:', error);
    }
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
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mt-2" />
              ) : (
                <p className="text-2xl text-black font-semibold">{stats?.totalTasks || statusCounts.total}</p>
              )}
            </div>
            <div className="bg-gray-100 text-black px-2 py-1 rounded text-sm font-medium">
              {statusCounts.total}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mt-2" />
              ) : (
                <p className="text-2xl text-black font-semibold">{stats?.inProcessTasks || statusCounts.inProgress}</p>
              )}
            </div>
            <div className="bg-[#FBB906] text-white px-2 py-1 rounded text-sm font-medium">
              {statusCounts.inProgress}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mt-2" />
              ) : (
                <p className="text-2xl text-black font-semibold">{stats?.completedTasks || statusCounts.completed}</p>
              )}
            </div>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
              {statusCounts.completed}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mt-2" />
              ) : (
                <p className="text-2xl text-black font-semibold">{stats?.overdueTasks || 0}</p>
              )}
            </div>
            <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              {stats?.overdueTasks || 0}
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
        {isLoading ? (
          <div className="col-span-3 flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#E866B7] mx-auto mb-4" />
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : tasksError ? (
          <div className="col-span-3 flex items-center justify-center py-12">
            <div className="text-center text-red-500">
              <p>Error loading tasks: {tasksError}</p>
            </div>
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="col-span-3 flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              <p>No tasks found</p>
            </div>
          </div>
        ) : (
          displayTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusTextColor(task.status === 'in process' ? 'In Progress' : 'Completed')}`}>
                    {task.status === 'in process' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 font-medium rounded-full border ${getPriorityColor('Medium')}`}>
                  {task.task_type === 'repairs' ? 'Repair' : 'Other'}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{task.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{task.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-black font-medium">
                      {task.user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {task.user?.firstName} {task.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{task.task_type}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs mb-4 text-gray-500">
                Due {new Date(task.finish_date).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDetails({
                    id: task._id,
                    title: task.name,
                    description: task.description,
                    assignedTo: `${task.user?.firstName} ${task.user?.lastName}`,
                    department: task.task_type,
                    dueDate: new Date(task.finish_date).toLocaleDateString(),
                    priority: 'Medium',
                    status: task.status === 'in process' ? 'In Progress' : 'Completed',
                    overdue: new Date(task.finish_date) < new Date()
                  })}
                  className="flex-1 px-3 py-2 border text-black border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  View Details
                </button>
                {task.status === 'in process' && (
                  <button
                    onClick={() => handleStartTask({
                      id: task._id,
                      title: task.name,
                      description: task.description,
                      assignedTo: `${task.user?.firstName} ${task.user?.lastName}`,
                      department: task.task_type,
                      dueDate: new Date(task.finish_date).toLocaleDateString(),
                      priority: 'Medium',
                      status: 'In Progress',
                      overdue: new Date(task.finish_date) < new Date()
                    })}
                    className="flex-1 px-3 py-2 bg-[#E866B7] text-white rounded-lg text-sm hover:bg-pink-600"
                  >
                    Start
                  </button>
                )}
                {task.status === 'in process' && (
                  <button
                    onClick={() => handleUpdateTask({
                      id: task._id,
                      title: task.name,
                      description: task.description,
                      assignedTo: `${task.user?.firstName} ${task.user?.lastName}`,
                      department: task.task_type,
                      dueDate: new Date(task.finish_date).toLocaleDateString(),
                      priority: 'Medium',
                      status: 'In Progress',
                      overdue: new Date(task.finish_date) < new Date()
                    })}
                    className="flex-1 px-3 py-2 bg-[#E866B7] text-white rounded-lg text-sm hover:bg-pink-600"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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
          onConfirm={handleCreateTask}
        />
      )}
    </div>
  )
}

const TaskManagementPage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <TaskManagement />
    </ProtectedRoute>
  );
};

export default TaskManagementPage;