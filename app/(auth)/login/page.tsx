'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/store/data-provider';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginDemoUser, profiles } = useData();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Handle email or roll number / name
    const emailToUse = identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@kasukabe.edu`;
    const res = await loginWithEmail(emailToUse, password || 'password123');
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = (userId: string) => {
    loginDemoUser(userId);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
      {/* Background Watermarks */}
      <div className="absolute top-6 left-6 text-2xl font-black text-amber-200/40 select-none tracking-widest -rotate-6 pointer-events-none hidden md:block">
        SKILLMATCH
      </div>
      <div className="absolute bottom-4 right-8 text-sm font-black text-amber-300/60 select-none tracking-wide rotate-3 pointer-events-none hidden lg:flex flex-col items-center">
        <span>👑</span>
        <span className="font-mono text-xs">Same dreams,</span>
        <span className="font-mono text-xs font-black">Bigger Projects!</span>
      </div>

      {/* Main Two-Column Frame */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Authentic Illustrated Scene */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-left">
          {/* We render the exact high-res artwork from the design */}
          <div className="w-full max-w-[580px] rounded-3xl overflow-hidden drop-shadow-sm transition-transform hover:scale-[1.01]">
            <img
              src="/images/login-left-panel.png"
              alt="Find Your Project Partner — Kasukabe Defense Squad"
              className="w-full h-auto object-contain rounded-3xl"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: The Clean White Login Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-100 relative">
            
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Login to continue building amazing projects.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border-2 border-shin-red text-shin-red text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Roll Number Input */}
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Email or Roll Number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all"
                />
              </div>

              {/* Password Input with Visibility Toggle */}
              <div>
                <div className="relative flex items-center">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-sky-500 hover:text-sky-600 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-sky-500 hover:text-sky-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Yellow Pop Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FDCD1A] hover:bg-[#FACC15] active:translate-x-[2px] active:translate-y-[2px] text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[3px_3px_0px_#1E293B] hover:shadow-[1px_1px_0px_#1E293B] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Logging In...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Quick 1-Click Demo Personas Switcher */}
              <div className="pt-2">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>1-Click Demo Login:</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {profiles.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleDemoLogin(p.id)}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-shin-canvas hover:bg-shin-yellow/30 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-sm"
                    >
                      <img src={p.avatar_url} alt={p.name} className="w-5 h-5 rounded-full" />
                      <span className="truncate">{p.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Or continue with
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Social Login Buttons (Google, GitHub, Microsoft) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user-shinchan')}
                  className="flex items-center justify-center py-2.5 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  title="Sign in with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user-kazama')}
                  className="flex items-center justify-center py-2.5 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  title="Sign in with GitHub"
                >
                  <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </button>

                {/* Microsoft Button */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user-nene')}
                  className="flex items-center justify-center py-2.5 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  title="Sign in with Microsoft"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-xs font-semibold text-slate-500 pt-2">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-bold text-sky-500 hover:text-sky-600 hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>

            {/* Bottom Quote Card */}
            <div className="mt-6 p-3.5 rounded-2xl bg-[#FDF7EB] border border-amber-200/80 flex items-center justify-between gap-3">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 italic leading-snug">
                &ldquo;Alone we do random projects,<br />
                Together we build something amazing!&rdquo;
              </p>
              <img
                src="/images/shinchan-face-quote.png"
                alt="Shin-chan"
                className="w-10 h-10 rounded-full flex-shrink-0 object-contain"
                onError={(e) => {
                  // Fallback to SVG if png not found
                  (e.target as HTMLImageElement).src = '/avatars/shinchan.svg';
                }}
              />
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-shin-ink shadow-pop text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-shin-yellow border-2 border-shin-ink flex items-center justify-center mx-auto text-lg">
              🔑
            </div>
            <h3 className="text-lg font-black text-slate-900">Forgot Password?</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              In demo mode, you can log in with any email and password or use the 1-click persona buttons! For university accounts, contact your campus admin.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-shin-red text-white font-bold text-xs border-2 border-shin-ink shadow-pop-sm"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
