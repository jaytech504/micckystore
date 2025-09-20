'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Check role-based access
      if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, requiredRoles, hasAnyRole, router, fallbackPath]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E866B7]" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }


  // Don't render children if not authenticated or doesn't have required role
  if (!isAuthenticated || (requiredRoles.length > 0 && !hasAnyRole(requiredRoles))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
