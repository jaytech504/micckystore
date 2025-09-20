import { useState, useEffect } from 'react';
import { 
  activityLogsApi, 
  ActivityLog, 
  ActivityLogsResponse, 
  ActivityLogsSummary,
  ActivityLogsSearchParams 
} from '../../../../api/activityLogsApi';

// Hook for getting activity logs with filtering and pagination
export const useActivityLogs = (params?: ActivityLogsSearchParams) => {
  const [data, setData] = useState<ActivityLogsResponse | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<ActivityLogsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityLogsApi.getActivityLogs(params);
      
      if (response.data?.data) {
        setData(response.data.data);
        setLogs(response.data.data.logs || []);
        setSummary(response.data.data.summary || null);
        setPagination(response.data.pagination || null);
      } else {
        setError('No activity logs data received');
        setLogs([]);
        setSummary(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity logs');
      setLogs([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [JSON.stringify(params)]);

  return {
    data,
    logs,
    summary,
    loading,
    error,
    pagination,
    refetch: fetchActivityLogs
  };
};

// Hook for getting activity logs by module
export const useActivityLogsByModule = (
  module: 'product' | 'repair' | 'notification',
  params?: Omit<ActivityLogsSearchParams, 'module'>
) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchModuleLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityLogsApi.getActivityLogsByModule(module, params);
      
      if (response.data?.data) {
        setLogs(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        setError('No module logs data received');
        setLogs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch module logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleLogs();
  }, [module, JSON.stringify(params)]);

  return {
    logs,
    loading,
    error,
    pagination,
    refetch: fetchModuleLogs
  };
};

// Hook for getting activity logs by entity
export const useActivityLogsByEntity = (
  entityType: 'Product' | 'Repair' | 'User' | 'Customer' | 'Vendor',
  entityId: string,
  params?: { page?: number; limit?: number }
) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchEntityLogs = async () => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await activityLogsApi.getActivityLogsByEntity(entityType, entityId, params);
      
      if (response.data?.data) {
        setLogs(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        setError('No entity logs data received');
        setLogs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch entity logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntityLogs();
  }, [entityType, entityId, JSON.stringify(params)]);

  return {
    logs,
    loading,
    error,
    pagination,
    refetch: fetchEntityLogs
  };
};

// Hook for activity logs statistics/summary
export const useActivityLogsStats = () => {
  const [stats, setStats] = useState<ActivityLogsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get basic stats from the main activity logs endpoint
      const response = await activityLogsApi.getActivityLogs({ limit: 1 });
      
      if (response.data?.data?.summary) {
        setStats(response.data.data.summary);
      } else {
        setError('No stats data received');
        setStats(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity logs stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Utility function to format activity log for display
export const formatActivityLogForAudit = (log: ActivityLog) => {
  return {
    id: log.id,
    staff: `${log.user.firstName} ${log.user.lastName}`,
    role: log.user.staffId, // Could be enhanced with actual role data
    actionType: log.action,
    description: log.description,
    branch: log.metadata?.branch || 'N/A',
    timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    severity: log.severity,
    module: log.module,
    entityType: log.entityType,
    entityId: log.entityId
  };
};

// Hook for real-time activity logs (with polling)
export const useRealTimeActivityLogs = (
  params?: ActivityLogsSearchParams,
  pollingInterval: number = 30000 // 30 seconds
) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLogs = async () => {
    try {
      setError(null);
      const response = await activityLogsApi.getActivityLogs(params);
      
      if (response.data?.data?.logs) {
        setLogs(response.data.data.logs);
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // Set up polling
    const interval = setInterval(fetchLogs, pollingInterval);

    return () => clearInterval(interval);
  }, [JSON.stringify(params), pollingInterval]);

  return {
    logs,
    loading,
    error,
    lastUpdated,
    refetch: fetchLogs
  };
};
