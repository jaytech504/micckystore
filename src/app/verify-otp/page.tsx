'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image';

const OTPVerification = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Add this to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const [otp, setOtp] = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)

  const email = searchParams.get('email') || ''

  useEffect(() => {
    if (!email && mounted) {
      router.push('/login')
    }
  }, [email, router, mounted])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) || document.getElementById(`mobile-otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) || document.getElementById(`mobile-otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async () => {
    const joinedOtp = otp.join('');
    if (joinedOtp.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    // No API call here, just redirect to new-password page with email and otp
    try {
      router.push(`/new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(joinedOtp)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true)
    setError('')

    try {
      const res = await fetch('https://mickkystore.onrender.com/api/users/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: email }),
      })

      if (!res.ok) {
        throw new Error('Failed to resend OTP')
      }

      alert('OTP resent to your email.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Could not resend OTP.')
      } else {
        setError('Could not resend OTP.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen text-black">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - OTP Form on white background */}
        <div className="w-1/2 bg-white rounded-l-3xl p-12 flex items-center">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-black mb-6">Input otp</h1>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Please enter the unique code sent to<br />
              your email for verification.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-4">Enter unique code</label>
              <div className="flex space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
            <div className="mb-8">
              <button
                type="button"
                onClick={handleResend}
                className="text-[#FBB906] hover:text-yellow-600 text-sm font-medium underline"
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend Link'}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r bg-[#E866B7] text-white py-3 rounded-lg font-medium hover:from-[#E866B7] hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Right Side - Branding (unchanged) */}
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
      <div className="lg:hidden min-h-screen bg-white">
        <div className="pt-12 pb-8 px-6 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2">
            <Image
                src="/logo.png" 
                alt="MickkyStore Logo" 
                width={180} 
                height={40}
                className="h-8 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Organized at its Peak</p>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Input otp</h1>
          <p className="text-gray-500 text-sm mb-6">
            Please enter the unique code sent to your email for verification.
          </p>
        </div>

        <div className="px-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="text-center text-gray-700 font-medium mb-6">
              Enter unique code
            </h2>
            <div className="flex justify-center mb-6">
              <div className="flex space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`mobile-otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
            <div className="mb-8 text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-[#FBB906] hover:text-yellow-700 text-sm font-medium underline"
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend Link'}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Reset'}
            </button>
          </div>
        </div>
        <div className="flex justify-center pb-6">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading verification page...</p>
    </div>
  </div>
);

// Main page component with Suspense wrapper
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OTPVerification />
    </Suspense>
  );
}