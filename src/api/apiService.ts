import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mickkystore.onrender.com/api';


const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiService.interceptors.request.use(
  (config) => {
  
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request with token:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenLength: token.length
      });
    } else {
      console.warn(' API Request without token:', {
        url: config.url,
        method: config.method
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(' API Response success:', {
      url: response.config.url,
      status: response.status,
      data: JSON.stringify(response.data, null, 2)
    });
    return response;
  },
  (error) => {
    console.error(' API Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No data'
    });
  
    if (error.response?.status === 401) {
      console.warn(' 401 Unauthorized - Redirecting to login');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setTimeout(() => {
          window.location.href = '/login';
        }, 50000);
      }
    }
    

    if (!error.response) {
      console.error(' Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);


export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.put(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.patch(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.delete(url, config),
};


export const authService = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      console.log('🔐 Token stored in localStorage:', {
        tokenLength: token.length,
        firstChars: token.substring(0, 20) + '...'
      });
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('🔍 Getting token from localStorage:', {
        hasToken: !!token,
        tokenLength: token?.length || 0
      });
      return token;
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },
  
  setUserData: (userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('👤 User data stored in localStorage:', userData);
    }
  },
  
  getUserData: (): any | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      const parsed = userData ? JSON.parse(userData) : null;
      console.log('👤 Getting user data from localStorage:', {
        hasUserData: !!parsed,
        userData: parsed
      });
      return parsed;
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
  
  // Get user's branch ID for API calls
  getUserBranch: (): string | null => {
    const userData = authService.getUserData();
    return userData?.branch || null;
  },
  
  // Get user's role for authorization
  getUserRole: (): string | null => {
    const userData = authService.getUserData();
    return userData?.role || null;
  },
  
  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const userRole = authService.getUserRole();
    return userRole === role;
  },
  
  // Check if user has any of the specified roles
  hasAnyRole: (roles: string[]): boolean => {
    const userRole = authService.getUserRole();
    return roles.includes(userRole || '');
  },
};

export default apiService;
