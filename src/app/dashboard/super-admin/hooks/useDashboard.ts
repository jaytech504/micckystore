import { useState, useEffect } from 'react';
import { 
  DashboardStats, 
  Branch, 
  RecentActivity, 
  ChartData, 
  UserInfo 
} from '../types';

interface UseDashboardReturn {
  // Data
  stats: DashboardStats | null;
  branches: Branch[];
  selectedBranch: Branch | null;
  recentActivities: RecentActivity[];
  chartData: ChartData;
  userInfo: UserInfo | null;
  
  // Loading states
  isLoadingStats: boolean;
  isLoadingBranches: boolean;
  isLoadingActivities: boolean;
  isLoadingChart: boolean;
  isLoadingUser: boolean;
  
  // Actions
  setSelectedBranch: (branch: Branch) => void;
  setTimeRange: (range: 'daily' | 'monthly') => void;
  refreshData: () => void;
}

export function useDashboard(): UseDashboardReturn {
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Active Users',
        data: [120, 180, 150, 200, 180, 220],
        color: '#f59e0b'
      },
      {
        label: 'Tasks completed',
        data: [80, 120, 100, 140, 120, 160],
        color: '#ec4899'
      },
      {
        label: 'Internal Messages',
        data: [60, 90, 80, 110, 100, 130],
        color: '#f9a8d4'
      }
    ]
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Mock data for development - Replace with actual API calls
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        totalStaffs: 20,
        totalSales: 689000,
        transferredItems: 10,
        completedRepairs: 30,
        staffResigned: 2,
        salesPercentage: 1.8,
        transferredPercentage: -4.3,
        repairsPercentage: -8.3
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchBranches = async () => {
    setIsLoadingBranches(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBranches: Branch[] = [
        { id: '1', name: 'Main Branch', code: 'MB' },
        { id: '2', name: 'North Branch', code: 'NB' },
        { id: '3', name: 'South Branch', code: 'SB' },
        { id: '4', name: 'East Branch', code: 'EB' }
      ];
      
      setBranches(mockBranches);
      setSelectedBranch({ id: 'all', name: 'All Branches' });
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const fetchRecentActivities = async () => {
    setIsLoadingActivities(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          userName: 'Semiu',
          action: 'completed a repair ticket.',
          timestamp: new Date().toISOString(),
          timeAgo: '2 minutes ago'
        },
        {
          id: '2',
          userName: 'Chineye',
          action: 'made a sale.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          timeAgo: '5 minutes ago'
        },
        {
          id: '3',
          userName: 'Margret',
          action: 'updated the inventory.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          timeAgo: '10 minutes ago'
        },
        {
          id: '4',
          userName: 'Nifemi',
          action: 'completed her task.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeAgo: '2 days ago'
        },
        {
          id: '5',
          userName: 'Samad',
          action: 'submitted a request.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeAgo: '2 days ago'
        }
      ];
      
      setRecentActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };



  const fetchUserInfo = async () => {
    setIsLoadingUser(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockUserInfo: UserInfo = {
        name: 'Samuel',
        role: 'Super Admin',
        avatar: undefined
      };
      
      setUserInfo(mockUserInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const setTimeRange = (range: 'daily' | 'monthly') => {
    // This would trigger a new API call to fetch chart data for the selected time range
    console.log('Time range changed to:', range);
    // You can implement the actual API call here
  };

  const refreshData = () => {
    fetchStats();
    fetchRecentActivities();
    // Add other refresh calls as needed
  };

  // Load data on mount
  useEffect(() => {
    fetchStats();
    fetchBranches();
    fetchRecentActivities();
    fetchUserInfo();
  }, []);

  return {
    // Data
    stats,
    branches,
    selectedBranch,
    recentActivities,
    chartData,
    userInfo,
    
    // Loading states
    isLoadingStats,
    isLoadingBranches,
    isLoadingActivities,
    isLoadingChart,
    isLoadingUser,
    
    // Actions
    setSelectedBranch,
    setTimeRange,
    refreshData
  };
} 