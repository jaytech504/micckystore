import { useState, useEffect } from 'react';
import { 
  repairsApi, 
  Repair, 
  CreateRepairRequest, 
  UpdateRepairRequest, 
  UpdateRepairStatusRequest,
  RepairSearchParams,
  RepairResponse,
  RepairsResponse,
  ActivityLog
} from '../../../../api/repairsApi';

// Hook for fetching repairs with search and filtering
export const useRepairs = (params?: RepairSearchParams) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairs(params);
      if (response.data.repairs) {
        setRepairs(response.data.repairs);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError('No repairs found');
        setRepairs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repairs');
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [JSON.stringify(params)]);

  return {
    repairs,
    loading,
    error,
    pagination,
    refetch: fetchRepairs
  };
};

// Hook for repair operations (create, update, delete, status)
export const useRepairOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRepair = async (repairData: CreateRepairRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.createRepair(repairData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create repair');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRepair = async (id: string, updateData: UpdateRepairRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.updateRepair(id, updateData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update repair');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRepairStatus = async (id: string, status: UpdateRepairStatusRequest['status']) => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.updateRepairStatus(id, { status });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update repair status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsInProgress = async (id: string) => {
    return updateRepairStatus(id, 'In progress');
  };

  const markAsRepaired = async (id: string) => {
    return updateRepairStatus(id, 'Repaired');
  };

  const markAsCompleted = async (id: string) => {
    return updateRepairStatus(id, 'Completed');
  };

  const markAsReadyForPickup = async (id: string) => {
    return updateRepairStatus(id, 'Completed and ready for pick up');
  };

  return {
    loading,
    error,
    createRepair,
    updateRepair,
    updateRepairStatus,
    markAsInProgress,
    markAsRepaired,
    markAsCompleted,
    markAsReadyForPickup
  };
};

// Hook for getting a single repair
export const useRepair = (id: string) => {
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepair = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairById(id);
      if (response.data.repair) {
        setRepair(response.data.repair);
      } else {
        setError('Repair not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repair');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRepair();
    }
  }, [id]);

  return {
    repair,
    loading,
    error,
    refetch: fetchRepair
  };
};

// Hook for getting repair by ticket ID
export const useRepairByTicketId = (ticketId: string) => {
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairByTicketId = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairByTicketId(ticketId);
      if (response.data.repair) {
        setRepair(response.data.repair);
      } else {
        setError('Repair not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repair');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchRepairByTicketId();
    }
  }, [ticketId]);

  return {
    repair,
    loading,
    error,
    refetch: fetchRepairByTicketId
  };
};

// Hook for getting engineer repairs
export const useEngineerRepairs = (params?: { status?: string }) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngineerRepairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getEngineerRepairs(params);
      if (response.data.repairs) {
        setRepairs(response.data.repairs);
      } else {
        setError('No repairs found');
        setRepairs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch engineer repairs');
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineerRepairs();
  }, [JSON.stringify(params)]);

  return {
    repairs,
    loading,
    error,
    refetch: fetchEngineerRepairs
  };
};

// Hook for repair statistics
export const useRepairStats = (params?: {
  start_date?: string;
  end_date?: string;
  branch?: string;
  engineer?: string;
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairStats(params);
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch repair stats');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repair stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(params)]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for repair activity logs
export const useRepairActivityLogs = (repairId: string) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairActivityLogs(repairId);
      if (response.data.activityLogs) {
        setActivityLogs(response.data.activityLogs);
      } else {
        setError('No activity logs found');
        setActivityLogs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity logs');
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repairId) {
      fetchActivityLogs();
    }
  }, [repairId]);

  return {
    activityLogs,
    loading,
    error,
    refetch: fetchActivityLogs
  };
};

// Hook for repairs by status
export const useRepairsByStatus = (status: string, params?: Omit<RepairSearchParams, 'status'>) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairsByStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairs({ ...params, status: status as any });
      if (response.data.repairs) {
        setRepairs(response.data.repairs);
      } else {
        setError('No repairs found');
        setRepairs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repairs by status');
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairsByStatus();
  }, [status, JSON.stringify(params)]);

  return {
    repairs,
    loading,
    error,
    refetch: fetchRepairsByStatus
  };
};

// Hook for repairs by engineer
export const useRepairsByEngineer = (engineerId: string, params?: Omit<RepairSearchParams, 'assignedEngineer'>) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairsByEngineer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairs({ ...params, assignedEngineer: engineerId });
      if (response.data.repairs) {
        setRepairs(response.data.repairs);
      } else {
        setError('No repairs found');
        setRepairs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repairs by engineer');
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (engineerId) {
      fetchRepairsByEngineer();
    }
  }, [engineerId, JSON.stringify(params)]);

  return {
    repairs,
    loading,
    error,
    refetch: fetchRepairsByEngineer
  };
};

// Hook for repair search with debouncing
export const useRepairSearch = (searchTerm: string, params?: Omit<RepairSearchParams, 'search'>) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchRepairs();
      } else {
        setRepairs([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await repairsApi.getRepairs({ ...params, search: searchTerm });
      if (response.data.repairs) {
        setRepairs(response.data.repairs);
      } else {
        setRepairs([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search repairs');
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    repairs,
    loading,
    error,
    refetch: fetchRepairs
  };
};
