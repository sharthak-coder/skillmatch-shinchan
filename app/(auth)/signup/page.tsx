'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/store/data-provider';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Zap, Shield, Sparkles, ArrowRight, AlertCircle, CheckCircle, MailCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await signUpWithEmail(name, email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.needsConfirmation) {
        setConfirmationSent(true);
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="w-full max-w-4xl card-pop p-0 overflow-hidden bg-white grid grid-cols-1 md:grid-cols-2 border-2 border-shin-ink shadow-pop-lg">
        
        {/* Left Side: Brand motivation */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-shin-blue via-sky-500 to-indigo-600 text-white flex flex-col justify-between relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-shin-ink">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-shin-ink border-2 border-shin-ink flex items-center justify-center shadow-pop-sm mb-6">
              <Zap className="w-6 h-6 fill-shin-yellow text-shin-yellow" />
            </div>

            <Badge variant="shiro" className="mb-3">
              Action Kamen Recruiter
            </Badge>

            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Assemble Your Hackathon Superteam!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-semibold mt-3 leading-relaxed">
              Join students from top tech universities who use SkillMatch to build complementary squads, ship killer MVPs, and win podium prizes.
            </p>

            <div className="mt-8 space-y-3 text-xs font-bold text-white/95">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-shin-yellow" />
                <span>Weighted Jaccard Complement Score</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-shin-yellow" />
                <span>Action Kamen Lock-In Celebrations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-shin-yellow" />
                <span>Zero Ghosting Guarantee</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 text-[11px] font-semibold text-white/80">
            &ldquo;We won 1st prize at TreeHacks in our very first week of teaming up!&rdquo;
          </div>
        </div>

        {/* Right Side: Sign up Form or Confirmation Sent Screen */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#FFFDF9]">
          {confirmationSent ? (
            <div className="text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-shin-ink text-shin-red flex items-center justify-center mx-auto shadow-pop-sm">
                <MailCheck className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-shin-ink">Check Your Email!</h3>
                <p className="text-xs text-slate-600 font-semibold mt-2 leading-relaxed">
                  We sent a confirmation link to <span className="font-bold text-slate-900">{email}</span>.
                </p>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Click the link in the email to activate your account and access your dashboard.
                </p>
              </div>

              <div className="pt-3 flex flex-col gap-2.5">
                <Link href="/login" className="w-full">
                  <Button variant="yellow" size="md" className="w-full">
                    Return to Log In
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmationSent(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  Need to change your email?
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-black text-shin-ink">Create Your Account</h3>
                <p className="text-xs text-shin-ink/60 font-semibold mt-1">
                  Start matching with teammates in under 2 minutes.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-shin-red text-shin-red text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="University Email"
                  type="email"
                  placeholder="your.name@university.edu"
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

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center text-xs font-semibold text-shin-ink/60">
                Already have an account?{' '}
                <Link href="/login" className="font-black text-shin-blue hover:underline">
                  Log in here
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
