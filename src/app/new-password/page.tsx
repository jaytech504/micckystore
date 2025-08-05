'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
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
            <h1 className="text-4xl font-bold text-black mb-6">New Password</h1>
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
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-4">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold bg-white text-black"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r bg-[#E866B7] text-white py-3 rounded-lg font-medium hover:from-[#E866B7] hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? 'Setting Password...' : 'Set New Password'}
              </button>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-[#FBB906] flex items-center justify-center px-12 relative">
          <div className="text-center relative">
            <div className="relative mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm mx-auto relative">
                <h2 className="text-2xl font-bold text-[#FBB906] mb-4 leading-tight">
                  It&apos;s a new day to start over...
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-16">
                  We intend to make job process easier and seamless. So,
                  everyone gets to connect together and work as a team easily.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2 transform translate-x-2 translate-y-2">
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#FBB906] rounded"></div>
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
      <div className="lg:hidden min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="text-3xl font-bold text-black mb-6">New Password</h1>
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
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-4">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold bg-white text-black"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Password...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPasswordPage;
