'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('mikimekonen9@gmail.com')
  const [password, setPassword] = useState('Michu0907')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify your credentials.')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const fillCredential = (userEmail: string, userPass: string) => {
    setEmail(userEmail)
    setPassword(userPass)
    setError(null)
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-[#071220] flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Blue glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#1a4f8b] rounded-full opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#c8931a] rounded-full opacity-5 blur-3xl pointer-events-none" />

        {/* Logo area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-full bg-white/10 p-1 border border-white/20 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Angolela Tera Woreda"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#c8931a] uppercase tracking-widest">Admin Console</p>
              <p className="text-sm font-bold text-white">Angolela Tera Woreda</p>
            </div>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
              Digital Governance<br />
              <span className="text-[#1a4f8b]" style={{ WebkitTextStroke: '1px #3b82f6', color: 'transparent' }}>
                Command Center
              </span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              The official administrative portal for Angolela Tera Woreda, North Shewa Zone, Amhara Region.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: '10', label: 'Sector Offices' },
            { value: '3', label: 'Languages' },
            { value: '5', label: 'Access Roles' },
          ].map((s) => (
            <div key={s.label} className="border border-white/8 rounded-xl p-4 bg-white/3">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#f1f5f9] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-full bg-white p-1 border border-gray-200 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Angolela Tera Woreda"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#c8931a] uppercase tracking-widest">Admin Console</p>
              <p className="text-sm font-bold text-[#0d2340]">Angolela Tera Woreda</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#0d2340] tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to access the administrative panel.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@angolelatera.gov.et"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/40 focus:border-[#1a4f8b] transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/40 focus:border-[#1a4f8b] transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In to Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick fill credentials */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
              Quick-fill Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Super Admin', email: 'mikimekonen9@gmail.com', pass: 'Michu0907', color: 'bg-blue-50 border-blue-200 text-[#1a4f8b] hover:bg-blue-100' },
                { label: 'Editor', email: 'editor@angolelatera.gov.et', pass: 'Admin@Angolela2026!', color: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100' },
                { label: 'Reviewer', email: 'reviewer@angolelatera.gov.et', pass: 'Admin@Angolela2026!', color: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' },
              ].map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => fillCredential(cred.email, cred.pass)}
                  className={`px-2 py-2 border rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${cred.color}`}
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
            <Link href="/en" className="hover:text-[#1a4f8b] transition-colors font-medium">
              ← Public Portal
            </Link>
            <span className="text-[10px]">RBAC · JWT Secured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
