import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mickkystore.onrender.com/api';


const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
  
    if (error.response?.status === 401) {
    console.error('401 Unauthorized - Token may be invalid or expired');
    // In production, token handling should be performed server-side.
    console.warn('401 received. Ensure client is authenticated via secure server-side session.');
    }
    
    if (!error.response) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);


export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.get(url, config),
  
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.post(url, data, config),
  
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.put(url, data, config),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.patch(url, data, config),
  
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiService.delete(url, config),
};

// Minimal authService placeholder - intentionally inert.
// Keep these methods if other modules import authService; they no-op now.
export const authService = {
  setToken: () => {
    // intentionally no-op; token persistence removed
  },
  getToken: () => null as string | null,
  removeToken: () => {},
  isAuthenticated: () => false,
  checkAuthStatus: () => ({ isAuthenticated: false, token: null }),
};

export default apiService;
