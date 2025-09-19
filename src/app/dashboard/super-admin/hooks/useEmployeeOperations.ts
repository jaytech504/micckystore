import { useState, useEffect, useCallback } from 'react';
import { 
  employeeOperationsApi,
  AttendanceRecord,
  LeaveRequest,
  CreateLeaveRequest,
  AttendanceSearchParams,
  LeaveSearchParams,
  UpdateLeaveStatusRequest
} from '../../../../api/employeeOperationsApi';

// Hook for attendance operations (clock in/out)
export const useAttendanceOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clockIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.clockIn();
      
      if (response.data.success) {
        return response.data.attendance;
      } else {
        throw new Error(response.data.message || 'Failed to clock in');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to clock in';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clockOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.clockOut();
      
      if (response.data.success) {
        return response.data.attendance;
      } else {
        throw new Error(response.data.message || 'Failed to clock out');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to clock out';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBreakTime = useCallback(async (attendanceId: string, breakTime: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.updateBreakTime(attendanceId, breakTime);
      
      if (response.data.success) {
        return response.data.attendance;
      } else {
        throw new Error(response.data.message || 'Failed to update break time');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update break time';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clockIn,
    clockOut,
    updateBreakTime,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for current day attendance
export const useCurrentDayAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [hasClockedOut, setHasClockedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentDayAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getCurrentDayAttendance();
      
      if (response.data.success) {
        setAttendance(response.data.attendance);
        setHasClockedIn(response.data.hasClockedIn);
        setHasClockedOut(response.data.hasClockedOut);
      } else {
        setError(response.data.message || 'Failed to fetch current day attendance');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch current day attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentDayAttendance();
  }, [fetchCurrentDayAttendance]);

  return {
    attendance,
    hasClockedIn,
    hasClockedOut,
    loading,
    error,
    refetch: fetchCurrentDayAttendance
  };
};

// Hook for user attendance records
export const useUserAttendance = (userId: string, params?: { startDate?: string; endDate?: string }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAttendance = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getUserAttendance(userId, params);
      
      if (response.data.success) {
        setAttendance(response.data.attendance);
      } else {
        setError(response.data.message || 'Failed to fetch user attendance');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch user attendance');
    } finally {
      setLoading(false);
    }
  }, [userId, params]);

  useEffect(() => {
    fetchUserAttendance();
  }, [fetchUserAttendance]);

  return {
    attendance,
    loading,
    error,
    refetch: fetchUserAttendance
  };
};

// Hook for all attendance records (Admin only)
export const useAllAttendance = (params?: AttendanceSearchParams) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);

  const fetchAllAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getAllAttendance(params);
      
      if (response.data.success) {
        setAttendance(response.data.attendance);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.data.message || 'Failed to fetch attendance records');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAllAttendance();
  }, [fetchAllAttendance]);

  return {
    attendance,
    loading,
    error,
    pagination,
    refetch: fetchAllAttendance
  };
};

// Hook for leave request operations
export const useLeaveOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLeaveRequest = useCallback(async (leaveData: CreateLeaveRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.createLeaveRequest(leaveData);
      
      if (response.data.success) {
        return response.data.leaveRequest;
      } else {
        throw new Error(response.data.message || 'Failed to create leave request');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create leave request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLeaveStatus = useCallback(async (leaveId: string, status: 'Approved' | 'Rejected') => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.updateLeaveStatus(leaveId, status);
      
      if (response.data.success) {
        return response.data.leaveRequest;
      } else {
        throw new Error(response.data.message || 'Failed to update leave status');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update leave status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createLeaveRequest,
    updateLeaveStatus,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for all leave requests (Admin only)
export const useAllLeaveRequests = (params?: LeaveSearchParams) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);

  const fetchAllLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getAllLeaveRequests(params);
      
      if (response.data.success) {
        setLeaveRequests(response.data.leaveRequests);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.data.message || 'Failed to fetch leave requests');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAllLeaveRequests();
  }, [fetchAllLeaveRequests]);

  return {
    leaveRequests,
    loading,
    error,
    pagination,
    refetch: fetchAllLeaveRequests
  };
};

// Hook for user leave requests
export const useUserLeaveRequests = (userId: string) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLeaveRequests = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getUserLeaveRequests(userId);
      
      if (response.data.success) {
        setLeaveRequests(response.data.leaveRequests);
      } else {
        setError(response.data.message || 'Failed to fetch user leave requests');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch user leave requests');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserLeaveRequests();
  }, [fetchUserLeaveRequests]);

  return {
    leaveRequests,
    loading,
    error,
    refetch: fetchUserLeaveRequests
  };
};

// Hook for single leave request
export const useLeaveRequest = (leaveId: string) => {
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveRequest = useCallback(async () => {
    if (!leaveId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getLeaveRequestById(leaveId);
      
      if (response.data.success) {
        setLeaveRequest(response.data.leaveRequest);
      } else {
        setError(response.data.message || 'Failed to fetch leave request');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leave request');
    } finally {
      setLoading(false);
    }
  }, [leaveId]);

  useEffect(() => {
    fetchLeaveRequest();
  }, [fetchLeaveRequest]);

  return {
    leaveRequest,
    loading,
    error,
    refetch: fetchLeaveRequest
  };
};

// Hook for attendance statistics
export const useAttendanceStats = (params?: { startDate?: string; endDate?: string; userId?: string }) => {
  const [stats, setStats] = useState<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    totalWorkHours: string;
    averageWorkHours: string;
    attendanceRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getAttendanceStats(params);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch attendance statistics');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance statistics');
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

// Hook for leave statistics
export const useLeaveStats = (params?: { startDate?: string; endDate?: string; userId?: string }) => {
  const [stats, setStats] = useState<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    totalLeaveDays: number;
    averageLeaveDays: number;
    leaveRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.getLeaveStats(params);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch leave statistics');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leave statistics');
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

// Hook for exporting attendance data
export const useAttendanceExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAttendance = useCallback(async (format: 'csv' | 'excel' = 'csv', params?: AttendanceSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.exportAttendance(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export attendance data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportAttendance,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Hook for exporting leave data
export const useLeaveExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportLeaveRequests = useCallback(async (format: 'csv' | 'excel' = 'csv', params?: LeaveSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeOperationsApi.exportLeaveRequests(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leave-requests.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export leave data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportLeaveRequests,
    loading,
    error,
    clearError: () => setError(null)
  };
};
