import { useState, useEffect } from 'react';
import { authService } from '../api/apiService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  branch: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = authService.getToken();
      const userData = authService.getUserData();
      
      console.log('🔍 Checking auth status:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        hasUserData: !!userData,
        userData: userData
      });
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ User authenticated successfully');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: User) => {
    try {
      console.log('🔐 Login function called:', {
        tokenLength: token?.length || 0,
        userData: userData
      });
      
      authService.setToken(token);
      authService.setUserData(userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful, token and user data stored');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const getUserBranch = (): string | null => {
    return authService.getUserBranch();
  };

  const getUserRole = (): string | null => {
    return authService.getUserRole();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getUserBranch,
    getUserRole,
    checkAuthStatus,
  };
};
