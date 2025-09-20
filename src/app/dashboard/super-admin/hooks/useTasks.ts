import { useState, useEffect, useCallback } from 'react';
import { 
  tasksApi,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskSearchParams,
  TaskStats
} from '../../../../api/tasksApi';

// Hook for fetching all tasks with filtering and pagination
export const useTasks = (params?: TaskSearchParams) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasks(params);
      
      if (response.data.success) {
        setTasks(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    pagination, 
    refetch: fetchTasks 
  };
};

// Hook for fetching tasks assigned to the authenticated user
export const useMyTasks = (params?: { status?: 'in process' | 'completed'; task_type?: 'repairs' | 'others' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getMyTasks(params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch my tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch my tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchMyTasks 
  };
};

// Hook for fetching tasks assigned to a specific user
export const useTasksByUser = (userId: string, params?: { status?: 'in process' | 'completed'; task_type?: 'repairs' | 'others' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksByUser = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasksByUser(userId, params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch user tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch user tasks');
    } finally {
      setLoading(false);
    }
  }, [userId, params]);

  useEffect(() => {
    fetchTasksByUser();
  }, [fetchTasksByUser]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasksByUser 
  };
};

// Hook for fetching a single task by ID
export const useTask = (taskId: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTaskById(taskId);
      
      if (response.data.success) {
        setTask(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch task');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return { 
    task, 
    loading, 
    error, 
    refetch: fetchTask 
  };
};

// Hook for task CRUD operations
export const useTaskOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.createTask(taskData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create task');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updateData: UpdateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.updateTask(taskId, updateData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update task');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.deleteTask(taskId);
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete task');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: 'in process' | 'completed') => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.updateTaskStatus(taskId, status);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update task status');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsCompleted = useCallback(async (taskId: string) => {
    return updateTaskStatus(taskId, 'completed');
  }, [updateTaskStatus]);

  const markAsInProcess = useCallback(async (taskId: string) => {
    return updateTaskStatus(taskId, 'in process');
  }, [updateTaskStatus]);

  const assignTask = useCallback(async (taskId: string, userId: string) => {
    return updateTask(taskId, { user: userId });
  }, [updateTask]);

  return {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    markAsCompleted,
    markAsInProcess,
    assignTask,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for task statistics
export const useTaskStats = (params?: { startDate?: string; endDate?: string; userId?: string }) => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTaskStats(params);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch task statistics');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch task statistics');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchStats 
  };
};

// Hook for searching tasks
export const useTaskSearch = (searchTerm: string, params?: Omit<TaskSearchParams, 'search'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTasks = useCallback(async () => {
    if (!searchTerm.trim()) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.searchTasks(searchTerm, params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to search tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search tasks');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, params]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTasks();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    search: searchTasks 
  };
};

// Hook for tasks by status
export const useTasksByStatus = (status: 'in process' | 'completed', params?: Omit<TaskSearchParams, 'status'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksByStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasksByStatus(status, params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tasks by status');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks by status');
    } finally {
      setLoading(false);
    }
  }, [status, params]);

  useEffect(() => {
    fetchTasksByStatus();
  }, [fetchTasksByStatus]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasksByStatus 
  };
};

// Hook for tasks by type
export const useTasksByType = (taskType: 'repairs' | 'others', params?: Omit<TaskSearchParams, 'task_type'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksByType = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasksByType(taskType, params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tasks by type');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks by type');
    } finally {
      setLoading(false);
    }
  }, [taskType, params]);

  useEffect(() => {
    fetchTasksByType();
  }, [fetchTasksByType]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasksByType 
  };
};

// Hook for overdue tasks
export const useOverdueTasks = (params?: Omit<TaskSearchParams, 'status'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverdueTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getOverdueTasks(params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch overdue tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch overdue tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOverdueTasks();
  }, [fetchOverdueTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchOverdueTasks 
  };
};

// Hook for tasks due today
export const useTasksDueToday = (params?: Omit<TaskSearchParams, 'startDate' | 'endDate'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksDueToday = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasksDueToday(params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tasks due today');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks due today');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasksDueToday();
  }, [fetchTasksDueToday]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasksDueToday 
  };
};

// Hook for tasks due this week
export const useTasksDueThisWeek = (params?: Omit<TaskSearchParams, 'startDate' | 'endDate'>) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksDueThisWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasksDueThisWeek(params);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tasks due this week');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks due this week');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasksDueThisWeek();
  }, [fetchTasksDueThisWeek]);

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasksDueThisWeek 
  };
};

// Hook for exporting tasks data
export const useTaskExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportTasks = useCallback(async (format: 'csv' | 'excel' = 'csv', params?: TaskSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.exportTasks(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export tasks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportTasks,
    loading,
    error,
    clearError: () => setError(null)
  };
};
