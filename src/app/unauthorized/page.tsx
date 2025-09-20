'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const UnauthorizedPage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <Shield className="h-8 w-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page. 
          {user && (
            <span className="block mt-2 text-sm">
              Your current role: <span className="font-medium">{user.role}</span>
            </span>
          )}
        </p>


        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Login
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Logout and sign in with different account
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
