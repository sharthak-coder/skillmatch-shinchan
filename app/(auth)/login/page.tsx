'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Zap, Shield, Sparkles, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginDemoUser, profiles } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await loginWithEmail(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  const handleDemoClick = (userId: string) => {
    loginDemoUser(userId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="w-full max-w-4xl card-pop p-0 overflow-hidden bg-white grid grid-cols-1 md:grid-cols-2 border-2 border-shin-ink shadow-pop-lg">
        
        {/* Left Side: Playful Animated Brand Panel */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-shin-red via-rose-500 to-amber-500 text-white flex flex-col justify-between relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-shin-ink">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-shin-ink border-2 border-shin-ink flex items-center justify-center shadow-pop-sm mb-6">
              <Zap className="w-6 h-6 fill-shin-yellow text-shin-yellow" />
            </div>

            <Badge variant="shiro" className="mb-3">
              Action Kamen Headquarters
            </Badge>

            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Welcome Back, Builder!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-semibold mt-3 leading-relaxed">
              Log in to review team join requests, manage active hackathon projects, and compute your complement score.
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="relative z-10 mt-8 pt-6 border-t-2 border-white/20">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-shin-yellow mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Personas:
            </div>

            <div className="flex flex-col gap-2">
              {profiles.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleDemoClick(p.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={p.avatar_url}
                      alt={p.name}
                      className="w-7 h-7 rounded-full border border-white object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-white">{p.name}</div>
                      <div className="text-[10px] text-white/70">{p.major.split(' ')[0]}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-shin-ink shadow-pop-sm group-hover:scale-105 transition-transform">
                    Enter as {p.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#FFFDF9]">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-shin-ink">Student Sign In</h3>
            <p className="text-xs text-shin-ink/60 font-semibold mt-1">
              Enter your university email or password to continue.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-shin-red text-shin-red text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="shinnosuke@kasukabe.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="red"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs font-semibold text-shin-ink/60">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-black text-shin-red hover:underline">
              Sign up here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
