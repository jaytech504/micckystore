'use client';


import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const NewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://mickkystore.onrender.com/api/users/verify-otp-and-set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          otp: otp,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Password reset failed');
      }

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - New Password Form on white background */}
        <div className="w-1/2 bg-white rounded-l-3xl p-12 flex items-center">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-black mb-6">Set New Password</h1>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Please enter your new password below.<br />
              Make sure it is strong and secure.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm mb-4">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold bg-white text-black"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
        {/* Right Side - Branding (unchanged) */}
        <div className="w-1/2 bg-yellow-400 flex items-center justify-center px-12 relative">
          <div className="text-center relative">
            <div className="relative mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm mx-auto relative">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4 leading-tight">
                  It&apos;s a new day to start over...
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-16">
                  We intend to make job process easier and seamless. So,
                  everyone gets to connect together and work as a team easily.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2 transform translate-x-2 translate-y-2">
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Stay organized</p>
                  <p className="text-sm font-semibold text-purple-600">
                    Mickkystore
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mickkystore Software
            </h1>
          </div>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white">
        <div className="pt-12 pb-8 px-6 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded"></div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-purple-600">MICKKY</span>
                <span className="text-yellow-500">STORE</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Organized at its Peak</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Set New Password</h1>
          <p className="text-gray-500 text-sm mb-6">
            Please enter your new password below.
          </p>
        </div>
        <div className="px-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="text-center text-gray-700 font-medium mb-6">
              New Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold bg-white text-black"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
        <div className="flex justify-center pb-6">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
