'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const OTPVerificationForm = () => {
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
            <h1 className="text-4xl font-bold text-black mb-6">Verify OTP</h1>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              We&apos;ve sent a 6-digit verification code to<br />
              <span className="font-semibold">{email}</span><br />
              Please enter the code below.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm mb-4">Enter 6-digit code</label>
              <div className="flex space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl font-semibold bg-white text-black"
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {resending ? 'Resending...' : "Didn&apos;t receive code? Resend"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-3xl flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Almost There!</h2>
            <p className="text-xl opacity-90">Enter the verification code to continue.</p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="text-3xl font-bold text-black mb-6">Verify OTP</h1>
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            We&apos;ve sent a 6-digit verification code to<br />
            <span className="font-semibold">{email}</span><br />
            Please enter the code below.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm mb-4">Enter 6-digit code</label>
            <div className="flex space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`mobile-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl font-semibold bg-white text-black"
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {resending ? 'Resending...' : "Didn&apos;t receive code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OTPVerification = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OTPVerificationForm />
    </Suspense>
  );
};

export default OTPVerification;
