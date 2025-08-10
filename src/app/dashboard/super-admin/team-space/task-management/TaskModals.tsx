import React, { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

// Type definitions
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  department: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  tags?: string[];
  createdBy?: string;
  overdue?: boolean;
}

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

interface StartTaskModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: (note?: string) => void;
}

interface UpdateTaskModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: (task: Task) => void;
}

interface AddTaskModalProps {
  onClose: () => void;
  onConfirm: (task: Omit<Task, 'id'>) => void;
}

// Task Details Modal
export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {task.title}
            </h2>
            <p className="text-sm text-gray-600">
              View complete task details and current status
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <span className="font-medium text-gray-900">Description</span>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              {task.description}
            </p>
          </div>

          {/* Assignment and Due Date */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Assigned to</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">MA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.assignedTo}</p>
                  <p className="text-xs text-gray-500">{task.department}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Due Date</span>
              </div>
              <p className={`text-sm font-medium ${task.overdue ? 'text-red-600' : 'text-gray-900'}`}>
                {task.dueDate}
              </p>
              {task.overdue && <p className="text-xs text-red-600">Overdue</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
            <span>Created by: {task.createdBy || 'Alex Manager'}</span>
            <span>Task ID: #{task.id}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onEdit}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Start Task Modal
export const StartTaskModal: React.FC<StartTaskModalProps> = ({ task, onClose, onConfirm }) => {
  const [note, setNote] = useState<string>('');

  const handleConfirm = (): void => {
    onConfirm(note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Task</h2>
              <p className="text-sm text-gray-600">
                Confirm starting this task and move it to &apos;In Progress&apos; status
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Task Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                task.priority === 'High' ? 'bg-none border border-red-500 text-red-500' :
                task.priority === 'Medium' ? 'bg-none border border-yellow-500 text-yellow-500' :
                'bg-none border border-green-500 text-green-500'
              }`}>
                {task.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{task.assignedTo}</p>
                <p className="text-xs text-gray-500">{task.department}</p>
              </div>
              <p className={`text-sm font-medium ${task.overdue ? 'text-red-600' : 'text-gray-600'}`}>
                Due {task.dueDate} {task.overdue && '(Overdue)'}
              </p>
            </div>
          </div>

          {/* Add Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Add a Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any Note about starting this Task"
              className="w-full p-3 border bg-gray-100 text-gray-700 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Warning */}
          {task.overdue && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">
                ⚠️ This task is overdue. Consider updating the due date after starting.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Start Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Task Modal
export const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({ task, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo,
    department: task.department,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    tags: task.tags?.join(', ') || ''
  });

  const handleSubmit = (): void => {
    const updatedTask: Task = {
      ...task,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    onConfirm(updatedTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Task</h2>
              <p className="text-sm text-gray-600">
                Make changes to the task details and assignment information.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Task Title*
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Description*
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Assign to and Status */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Assign to*
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Margaret A">Margaret A (Accounting)</option>
                  <option value="Osas A">Osas A (Engineer)</option>
                  <option value="Chineye Deomature">Chineye Deomature (Sales)</option>
                  <option value="Samuel">Samuel (UX Designer)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Task['status']})}
                  className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Due Date and Priority */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Due Date*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pick a date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full p-3 border text-sm text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Priority*
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                  className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Urgent, inventory, customer issue"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Update Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Task Modal
export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    department: '',
    priority: 'Medium' as Task['priority'],
    dueDate: '',
    tags: ''
  });

  const handleSubmit = (): void => {
    const newTask: Omit<Task, 'id'> = {
      ...formData,
      status: 'Pending' as const,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    onConfirm(newTask);
  };

  const getDepartmentForAssignee = (assignee: string): string => {
    const mapping: Record<string, string> = {
      'Margaret A': 'Accounting',
      'Osas A': 'Engineer', 
      'Chineye Deomature': 'Sales',
      'Samuel': 'UX Design'
    };
    return mapping[assignee] || '';
  };

  const handleAssigneeChange = (assignee: string): void => {
    setFormData({
      ...formData, 
      assignedTo: assignee,
      department: getDepartmentForAssignee(assignee)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add New Task</h2>
              <p className="text-sm text-gray-600">
                Create a new task and assign it to a team member with a due date and priority level.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Task Title*
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border text-sm bg-gray-100 text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Description*
              </label>
              <textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border text-sm bg-gray-100 text-gray-800 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Assign to and Priority */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Assign to*
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Staff member</option>
                  <option value="Margaret A">Margaret A (Accounting)</option>
                  <option value="Osas A">Osas A (Engineer)</option>
                  <option value="Chineye Deomature">Chineye Deomature (Sales)</option>
                  <option value="Samuel">Samuel (UX Designer)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Priority*
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                  className="w-full p-3 border text-sm bg-gray-100 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Due Date*
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pick a date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full p-3 border text-sm text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Urgent, inventory, customer issue"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full p-3 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};