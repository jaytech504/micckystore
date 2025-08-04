export interface DashboardStats {
  totalStaffs: number;
  totalSales: number;
  transferredItems: number;
  completedRepairs: number;
  staffResigned: number;
  salesPercentage: number;
  transferredPercentage: number;
  repairsPercentage: number;
}

export interface Branch {
  id: string;
  name: string;
  code?: string;
}

export interface RecentActivity {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
  timeAgo: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

export interface MostUsedApp {
  id: string;
  name: string;
  icon: string;
  route: string;
}

export interface UserInfo {
  name: string;
  role: string;
  avatar?: string;
} 