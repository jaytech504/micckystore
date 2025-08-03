'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    router.push('/email-verification');
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    // Step 1: Login
    const loginRes = await fetch('https://mickkystore.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    if (!loginRes.ok) {
      const data = await loginRes.json();
      throw new Error(data?.message || 'Invalid login credentials');
    }

    // Step 2: Request OTP
    const otpRes = await fetch('https://mickkystore.onrender.com/api/users/request-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        identifier: email }),
    });

    if (!otpRes.ok) {
      const data = await otpRes.json();
      throw new Error(data?.message || 'Failed to send OTP');
    }

    // Try to log the OTP if present in the response
    try {
      const otpData = await otpRes.clone().json();
      if (otpData && otpData.otp) {
        console.log('OTP:', otpData.otp);
      }
    } catch {
      // ignore if response is not JSON or doesn't contain OTP
    }

    // Step 3: Redirect to OTP page
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      setError((err as { message?: string }).message || 'Something went wrong');
    } else {
      setError('Something went wrong');
    }
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen text-black">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center px-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-500 mb-8">Log into your account</p>

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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Enter Staff ID/Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
                  placeholder="example@gmail.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12 bg-white text-black"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Proceed'
                )}
              </button>

              {/* Forgot Password - Desktop (Below Proceed Button) */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-yellow-500 font-medium hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Branding */}
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

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in</h1>
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <span className="text-yellow-500 font-medium">Contact Admin</span>
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
              Log In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Enter Staff ID/Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
                  placeholder="example@gmail.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12 bg-white text-black"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-yellow-500 font-medium hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot Password ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Proceed'
                )}
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

export default LoginPage;
