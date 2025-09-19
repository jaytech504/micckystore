import { api } from './apiService';

// Types for Attendance Management
export interface AttendanceRecord {
  _id: string;
  userId: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
    email: string;
  };
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  workHours?: string;
  breakTime?: string;
  status: 'On Time' | 'Late' | 'Absent';
  createdAt: string;
  updatedAt: string;
}

export interface ClockInResponse {
  success: boolean;
  message: string;
  attendance: {
    date: string;
    clockInTime: string;
    status: 'On Time' | 'Late';
  };
}

export interface ClockOutResponse {
  success: boolean;
  message: string;
  attendance: {
    date: string;
    clockInTime: string;
    clockOutTime: string;
    workHours: string;
    status: 'On Time' | 'Late';
  };
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  attendance: AttendanceRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface CurrentDayAttendanceResponse {
  success: boolean;
  message: string;
  attendance: AttendanceRecord | null;
  hasClockedIn: boolean;
  hasClockedOut: boolean;
}

export interface BreakTimeUpdateRequest {
  break: string; // Format: "HH:MM"
}

export interface BreakTimeUpdateResponse {
  success: boolean;
  message: string;
  attendance: AttendanceRecord;
}

// Types for Leave Management
export interface LeaveRequest {
  _id: string;
  userId: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  manager?: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    staffId: string;
    email: string;
  };
  managerId?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequest {
  startDate: string;
  endDate: string;
  manager: string; // Manager ID
  reason: string;
}

export interface LeaveRequestResponse {
  success: boolean;
  message: string;
  leaveRequest: LeaveRequest;
}

export interface LeaveRequestsResponse {
  success: boolean;
  message: string;
  leaveRequests: LeaveRequest[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface UpdateLeaveStatusRequest {
  status: 'Approved' | 'Rejected';
}

export interface UpdateLeaveStatusResponse {
  success: boolean;
  message: string;
  leaveRequest: LeaveRequest;
}

// Search and Filter Parameters
export interface AttendanceSearchParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
  status?: 'On Time' | 'Late' | 'Absent';
}

export interface LeaveSearchParams {
  status?: 'Pending' | 'Approved' | 'Rejected';
  userId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

// Employee Operations API
export const employeeOperationsApi = {
  // Attendance Management
  
  // Clock in for the day
  clockIn: async () => {
    return api.post<ClockInResponse>('/attendance/clock-in', {});
  },

  // Clock out for the day
  clockOut: async () => {
    return api.post<ClockOutResponse>('/attendance/clock-out', {});
  },

  // Get current day attendance
  getCurrentDayAttendance: async () => {
    return api.get<CurrentDayAttendanceResponse>('/attendance/current-day');
  },

  // Get attendance records for a specific user
  getUserAttendance: async (userId: string, params?: { startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const url = `/attendance/user/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<AttendanceResponse>(url);
  },

  // Get all attendance records (Admin only)
  getAllAttendance: async (params?: AttendanceSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<AttendanceResponse>(url);
  },

  // Update break time for an attendance record
  updateBreakTime: async (attendanceId: string, breakTime: string) => {
    return api.put<BreakTimeUpdateResponse>(`/attendance/${attendanceId}/break`, {
      break: breakTime
    });
  },

  // Leave Management

  // Create a leave request
  createLeaveRequest: async (leaveData: CreateLeaveRequest) => {
    return api.post<LeaveRequestResponse>('/staff-leave', leaveData);
  },

  // Get all leave requests (Admin only)
  getAllLeaveRequests: async (params?: LeaveSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/staff-leave${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<LeaveRequestsResponse>(url);
  },

  // Get leave requests for a specific user
  getUserLeaveRequests: async (userId: string) => {
    return api.get<LeaveRequestsResponse>(`/staff-leave/user/${userId}`);
  },

  // Get leave request by ID
  getLeaveRequestById: async (leaveId: string) => {
    return api.get<LeaveRequestResponse>(`/staff-leave/${leaveId}`);
  },

  // Update leave request status (Admin only)
  updateLeaveStatus: async (leaveId: string, status: 'Approved' | 'Rejected') => {
    return api.put<UpdateLeaveStatusResponse>(`/staff-leave/${leaveId}/status`, {
      status
    });
  },

  // Convenience methods for common operations
  
  // Get attendance statistics
  getAttendanceStats: async (params?: { startDate?: string; endDate?: string; userId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.userId) queryParams.append('userId', params.userId);
    
    const url = `/attendance/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: {
        totalDays: number;
        presentDays: number;
        absentDays: number;
        lateDays: number;
        totalWorkHours: string;
        averageWorkHours: string;
        attendanceRate: number;
      };
    }>(url);
  },

  // Get leave statistics
  getLeaveStats: async (params?: { startDate?: string; endDate?: string; userId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.userId) queryParams.append('userId', params.userId);
    
    const url = `/staff-leave/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: {
        totalRequests: number;
        pendingRequests: number;
        approvedRequests: number;
        rejectedRequests: number;
        totalLeaveDays: number;
        averageLeaveDays: number;
        leaveRate: number;
      };
    }>(url);
  },

  // Export attendance data
  exportAttendance: async (format: 'csv' | 'excel' = 'csv', params?: AttendanceSearchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/attendance/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, { responseType: 'blob' });
  },

  // Export leave data
  exportLeaveRequests: async (format: 'csv' | 'excel' = 'csv', params?: LeaveSearchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/staff-leave/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, { responseType: 'blob' });
  }
};
