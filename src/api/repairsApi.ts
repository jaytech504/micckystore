import { api } from './apiService';

// Type definitions
export interface Engineer {
  _id: string;
  firstName: string;
  lastName: string;
  staffId: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  staffId: string;
}

export interface Repair {
  _id: string;
  ticketId: string;
  device: string;
  issueReported: string;
  diagnosis?: string;
  imei?: string;
  assignedEngineer?: Engineer;
  status: 'Pending' | 'In progress' | 'Repaired' | 'Repaired and sent back' | 'Completed' | 'Completed and ready for pick up';
  priorityLevel: 'Low' | 'Medium' | 'High' | 'Urgent';
  customerName: string;
  customerPhoneNumber: string;
  customerEmail?: string;
  customerAddress?: string;
  expectedCompletionDate?: string;
  price?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepairRequest {
  device: string;
  issueReported: string;
  diagnosis?: string;
  imei?: string;
  assignedEngineer?: string;
  priorityLevel?: 'Low' | 'Medium' | 'High' | 'Urgent';
  customerName: string;
  customerPhoneNumber: string;
  customerEmail?: string;
  customerAddress?: string;
  expectedCompletionDate?: string;
  price?: string;
}

export interface UpdateRepairRequest {
  device?: string;
  issueReported?: string;
  diagnosis?: string;
  imei?: string;
  assignedEngineer?: string;
  customerName?: string;
  customerPhoneNumber?: string;
  customerEmail?: string;
  customerAddress?: string;
  expectedCompletionDate?: string;
  price?: string;
}

export interface UpdateRepairStatusRequest {
  status: 'Pending' | 'In progress' | 'Repaired' | 'Repaired and sent back' | 'Completed' | 'Completed and ready for pick up';
}

export interface RepairSearchParams {
  status?: 'Pending' | 'In progress' | 'Repaired' | 'Repaired and sent back' | 'Completed' | 'Completed and ready for pick up';
  assignedEngineer?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  priorityLevel?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface RepairResponse {
  message: string;
  repair: Repair;
  customerCreated?: boolean;
  customer?: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export interface RepairsResponse {
  repairs: Repair[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface ActivityLog {
  action: string;
  description: string;
  performedBy: User;
  timestamp: string;
  oldData: any;
  newData: any;
}

export interface RepairActivityLogsResponse {
  message: string;
  repair: {
    _id: string;
    ticketId: string;
    device: string;
    customerName: string;
    status: string;
  };
  activityLogs: ActivityLog[];
}

// API service functions
export const repairsApi = {
  // Create a new repair ticket
  createRepair: async (repairData: CreateRepairRequest) => {
    return api.post<RepairResponse>('/repairs', repairData);
  },

  // Get all repairs with optional filtering
  getRepairs: async (params?: RepairSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.assignedEngineer) queryParams.append('assignedEngineer', params.assignedEngineer);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.priorityLevel) queryParams.append('priorityLevel', params.priorityLevel);

    const url = `/repairs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<RepairsResponse>(url);
  },

  // Get repairs assigned to current engineer
  getEngineerRepairs: async (params?: { status?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);

    const url = `/repairs/engineer${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<RepairsResponse>(url);
  },

  // Get repair by ID
  getRepairById: async (id: string) => {
    return api.get<RepairResponse>(`/repairs/${id}`);
  },

  // Get repair by ticket ID
  getRepairByTicketId: async (ticketId: string) => {
    return api.get<RepairResponse>(`/repairs/ticket/${ticketId}`);
  },

  // Update repair details
  updateRepair: async (id: string, updateData: UpdateRepairRequest) => {
    return api.put<RepairResponse>(`/repairs/${id}`, updateData);
  },

  // Update repair status
  updateRepairStatus: async (id: string, statusData: UpdateRepairStatusRequest) => {
    return api.put<RepairResponse>(`/repairs/${id}/status`, statusData);
  },

  // Get repair activity logs
  getRepairActivityLogs: async (id: string) => {
    return api.get<RepairActivityLogsResponse>(`/repairs/${id}/activity-logs`);
  },

  // Get repair statistics (if available)
  getRepairStats: async (params?: {
    start_date?: string;
    end_date?: string;
    branch?: string;
    engineer?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.branch) queryParams.append('branch', params.branch);
    if (params?.engineer) queryParams.append('engineer', params.engineer);

    const url = `/repairs/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<{
      success: boolean;
      message: string;
      data: {
        totalRepairs: number;
        pendingRepairs: number;
        inProgressRepairs: number;
        completedRepairs: number;
        averageCompletionTime: string;
        overdueRepairs: number;
        repairsByStatus: {
          Pending: number;
          'In progress': number;
          Repaired: number;
          'Repaired and sent back': number;
          Completed: number;
          'Completed and ready for pick up': number;
        };
        repairsByPriority: {
          Low: number;
          Medium: number;
          High: number;
          Urgent: number;
        };
        engineerStats: Array<{
          engineer: string;
          engineerName: string;
          repairsDone: number;
          avgTime: string;
          completionRate: number;
        }>;
        monthlyTrends: Array<{
          month: string;
          repairs: number;
          completed: number;
        }>;
      };
    }>(url);
  },

  // Export repair data (if available)
  exportRepairs: async (params?: RepairSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.assignedEngineer) queryParams.append('assignedEngineer', params.assignedEngineer);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.priorityLevel) queryParams.append('priorityLevel', params.priorityLevel);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/repairs/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<Blob>(url, {
      responseType: 'blob'
    });
  }
};
