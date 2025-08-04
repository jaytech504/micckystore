# Super Admin Dashboard - API Integration Guide

## 🏗️ Architecture Overview

The dashboard is built with a modular architecture:

```
src/app/dashboard/super-admin/
├── components/          # Reusable UI components
├── hooks/              # Custom hooks for data management
├── services/           # API service layer
├── types.ts           # TypeScript interfaces
├── page.tsx           # Main dashboard page
└── README.md          # This file
```

## 🔧 Components Structure

### 1. StatsCard Component
- **File**: `components/StatsCard.tsx`
- **Purpose**: Displays individual statistics with loading states
- **Props**: title, value, icon, percentage, loading state
- **Usage**: Used for all 4 stat cards (Total Staffs, Sales, Transferred Items, Completed Repairs)

### 2. BranchSelector Component
- **File**: `components/BranchSelector.tsx`
- **Purpose**: Dropdown for selecting branches
- **Props**: branches array, selected branch, change handler
- **Features**: Loading state, click outside to close

### 3. ChartSection Component
- **File**: `components/ChartSection.tsx`
- **Purpose**: Displays user activities chart
- **Props**: chart data, time range controls
- **Note**: Currently uses SVG placeholder - replace with Chart.js, Recharts, or similar

### 4. RecentActivity Component
- **File**: `components/RecentActivity.tsx`
- **Purpose**: Shows recent user activities
- **Props**: activities array, loading state

### 5. MostUsedApps Component
- **File**: `components/MostUsedApps.tsx`
- **Purpose**: Navigation to other dashboard sections
- **Props**: apps array with routes, loading state
- **Features**: Simple navigation links (no usage counts)

## 📊 Data Types

All data structures are defined in `types.ts`:

```typescript
interface DashboardStats {
  totalStaffs: number;
  totalSales: number;
  transferredItems: number;
  completedRepairs: number;
  staffResigned: number;
  salesPercentage: number;
  transferredPercentage: number;
  repairsPercentage: number;
}

interface Branch {
  id: string;
  name: string;
  code?: string;
}

interface RecentActivity {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
  timeAgo: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface MostUsedApp {
  id: string;
  name: string;
  icon: string;
  route: string;
}

interface UserInfo {
  name: string;
  role: string;
  avatar?: string;
}
```

## 🔌 API Integration

### Current State
The dashboard currently uses mock data in the `useDashboard` hook. To integrate real APIs:

### Step 1: Update API Service
Replace the mock functions in `services/api.ts` with real API calls:

```typescript
// Example: Replace mock with real API call
export const dashboardAPI = {
  getStats: async (branchId?: string): Promise<DashboardStats> => {
    const params = branchId && branchId !== 'all' ? { branchId } : {};
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },
  // ... other methods
};
```

### Step 2: Update useDashboard Hook
In `hooks/useDashboard.ts`, replace mock data with API calls:

```typescript
const fetchStats = async () => {
  setIsLoadingStats(true);
  try {
    const data = await dashboardAPI.getStats(selectedBranch?.id);
    setStats(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Handle error (show toast, fallback data, etc.)
  } finally {
    setIsLoadingStats(false);
  }
};
```

### Step 3: Environment Variables
Add your API base URL to `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

## 🎯 Dynamic Elements

### 1. Stats Cards
- **Total Staffs**: `stats.totalStaffs` + `stats.staffResigned`
- **Total Sales**: `stats.totalSales` + `stats.salesPercentage`
- **Transferred Items**: `stats.transferredItems` + `stats.transferredPercentage`
- **Completed Repairs**: `stats.completedRepairs` + `stats.repairsPercentage`

### 2. User Name
- **Dynamic**: `userInfo.name` (currently "Samuel")
- **Fallback**: "User" if no data

### 3. Branch Dropdown
- **Dynamic**: `branches` array from API
- **Default**: "All Branches"
- **Filtering**: All stats update based on selected branch

### 4. Chart Data
- **Dynamic**: `chartData` object with labels and datasets
- **Time Range**: Daily/Monthly toggle
- **Replace**: Current SVG with real chart library

### 5. Recent Activities
- **Dynamic**: `recentActivities` array
- **Format**: Each activity has userName, action, timeAgo

### 6. Most Used Apps
- **Static**: Simple navigation links to other pages
- **Navigation**: Each app has a route for navigation
- **No Usage Data**: These are just static links, not dynamic

## 🚀 Implementation Steps for API Integration

### 1. Replace Mock Data
```typescript
// In useDashboard.ts, replace all mock data with API calls
const fetchStats = async () => {
  setIsLoadingStats(true);
  try {
    const data = await dashboardAPI.getStats(selectedBranch?.id);
    setStats(data);
  } catch (error) {
    // Handle error
  } finally {
    setIsLoadingStats(false);
  }
};
```

### 2. Add Error Handling
```typescript
// Add error states to components
const [error, setError] = useState<string | null>(null);

// Show error messages in UI
{error && (
  <div className="bg-red-50 border border-red-200 rounded-md p-4">
    <p className="text-red-800">{error}</p>
  </div>
)}
```

### 3. Add Real-time Updates (Optional)
```typescript
// Use WebSocket or polling for real-time data
useEffect(() => {
  const interval = setInterval(fetchStats, 30000); // Refresh every 30s
  return () => clearInterval(interval);
}, [selectedBranch]);
```

### 4. Add Chart Library
Install and integrate a chart library:

```bash
npm install recharts
# or
npm install chart.js react-chartjs-2
```

Then replace the SVG chart in `ChartSection.tsx` with the real chart component.

## 🔐 Authentication

The API service includes authentication interceptors:

```typescript
// Automatically adds auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📱 Responsive Design

All components are fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grid for stats
- Desktop: 4-column grid for stats, 3-column for chart section

## 🎨 Styling

The dashboard uses Tailwind CSS with:
- Consistent spacing (`space-y-6`, `gap-6`)
- Loading animations (`animate-pulse`)
- Hover effects and transitions
- Proper focus states for accessibility

## 🧪 Testing

To test the dashboard:

1. **Development**: Currently shows mock data with loading states
2. **API Integration**: Replace mock functions with real API calls
3. **Error Scenarios**: Test with network errors, invalid data
4. **Responsive**: Test on different screen sizes

## 📝 Notes for the Other Developer

1. **All components are ready for API integration**
2. **TypeScript interfaces ensure type safety**
3. **Loading states provide good UX during data fetching**
4. **Error handling is built into the API service**
5. **The chart section needs a real chart library**
6. **Authentication is handled automatically**
7. **Most Used Apps are static navigation links (no API needed)**
8. **All dynamic data is properly typed and structured**

The dashboard is production-ready once you replace the mock data with real API calls! 