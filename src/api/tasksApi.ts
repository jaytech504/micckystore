import { api } from './apiService';

// Types for Task Management
export interface Task {
  _id: string;
  name: string;
  start_date: string;
  finish_date: string;
  status: 'in process' | 'completed';
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    staffId: string;
    email: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    staffId: string;
    email: string;
  };
  task_type: 'repairs' | 'others';
  description: string;
  isRepair?: {
    _id: string;
    ticketId: string;
    device: string;
    customerName: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  name: string;
  start_date: string;
  finish_date: string;
  status: 'in process' | 'completed';
  user: string; // User ID
  task_type: 'repairs' | 'others';
  description: string;
  isRepair?: string; // Repair ID (optional)
}

export interface UpdateTaskRequest {
  name?: string;
  start_date?: string;
  finish_date?: string;
  status?: 'in process' | 'completed';
  user?: string; // User ID
  task_type?: 'repairs' | 'others';
  description?: string;
  isRepair?: string; // Repair ID (optional)
}

export interface TaskSearchParams {
  page?: number;
  limit?: number;
  status?: 'in process' | 'completed';
  task_type?: 'repairs' | 'others';
  user?: string; // User ID
  createdBy?: string; // Creator ID
  search?: string; // Search by task name or description
  startDate?: string; // Filter by start date
  endDate?: string; // Filter by end date
  sortBy?: 'name' | 'start_date' | 'finish_date' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskStats {
  totalTasks: number;
  inProcessTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByType: Array<{
    type: string;
    count: number;
  }>;
  tasksByUser: Array<{
    user: {
      _id: string;
      name: string;
      staffId: string;
    };
    count: number;
  }>;
  averageCompletionTime: number; // in days
  completionRate: number; // percentage
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface TaskStatsResponse {
  success: boolean;
  message: string;
  data: TaskStats;
}

export interface UpdateTaskStatusRequest {
  status: 'in process' | 'completed';
}

export interface UpdateTaskStatusResponse {
  success: boolean;
  message: string;
  data: Task;
}

// Task Management API
export const tasksApi = {
  // Create a new task (Admin and Super Admin only)
  createTask: async (taskData: CreateTaskRequest) => {
    return api.post<TaskResponse>('/tasks', taskData);
  },

  // Get all tasks with pagination and filtering
  getTasks: async (params?: TaskSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get tasks assigned to the authenticated user
  getMyTasks: async (params?: { status?: 'in process' | 'completed'; task_type?: 'repairs' | 'others' }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.task_type) queryParams.append('task_type', params.task_type);

    const url = `/tasks/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get tasks assigned to a specific user
  getTasksByUser: async (userId: string, params?: { status?: 'in process' | 'completed'; task_type?: 'repairs' | 'others' }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.task_type) queryParams.append('task_type', params.task_type);

    const url = `/tasks/user/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get task by ID
  getTaskById: async (taskId: string) => {
    return api.get<TaskResponse>(`/tasks/${taskId}`);
  },

  // Update task (Admin/Super Admin or assigned user only)
  updateTask: async (taskId: string, updateData: UpdateTaskRequest) => {
    return api.put<TaskResponse>(`/tasks/${taskId}`, updateData);
  },

  // Delete task (Admin and Super Admin only)
  deleteTask: async (taskId: string) => {
    return api.delete<{ success: boolean; message: string }>(`/tasks/${taskId}`);
  },

  // Update task status (Admin/Super Admin or assigned user only)
  updateTaskStatus: async (taskId: string, status: 'in process' | 'completed') => {
    return api.put<UpdateTaskStatusResponse>(`/tasks/${taskId}/status`, { status });
  },

  // Get task statistics
  getTaskStats: async (params?: { startDate?: string; endDate?: string; userId?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.userId) queryParams.append('userId', params.userId);

    const url = `/tasks/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TaskStatsResponse>(url);
  },

  // Search tasks
  searchTasks: async (searchTerm: string, params?: Omit<TaskSearchParams, 'search'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('search', searchTerm);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get tasks by status
  getTasksByStatus: async (status: 'in process' | 'completed', params?: Omit<TaskSearchParams, 'status'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get tasks by type
  getTasksByType: async (taskType: 'repairs' | 'others', params?: Omit<TaskSearchParams, 'task_type'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('task_type', taskType);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Get overdue tasks
  getOverdueTasks: async (params?: Omit<TaskSearchParams, 'status'>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('overdue', 'true');
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<TasksResponse>(url);
  },

  // Export tasks data
  exportTasks: async (format: 'csv' | 'excel' = 'csv', params?: TaskSearchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.user) queryParams.append('user', params.user);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/tasks/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, { responseType: 'blob' });
  },

  // Convenience methods for common operations
  
  // Mark task as completed
  markAsCompleted: async (taskId: string) => {
    return tasksApi.updateTaskStatus(taskId, 'completed');
  },

  // Mark task as in process
  markAsInProcess: async (taskId: string) => {
    return tasksApi.updateTaskStatus(taskId, 'in process');
  },

  // Assign task to user
  assignTask: async (taskId: string, userId: string) => {
    return tasksApi.updateTask(taskId, { user: userId });
  },

  // Get tasks due today
  getTasksDueToday: async (params?: Omit<TaskSearchParams, 'startDate' | 'endDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    return tasksApi.getTasks({
      ...params,
      startDate: today,
      endDate: today
    });
  },

  // Get tasks due this week
  getTasksDueThisWeek: async (params?: Omit<TaskSearchParams, 'startDate' | 'endDate'>) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return tasksApi.getTasks({
      ...params,
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    });
  }
};
