'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/lib/store/data-provider';
import { 
  Sparkles, 
  PlusCircle, 
  Compass, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, loginDemoUser, profiles } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b-2 border-shin-ink px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-shin-red border-2 border-shin-ink flex items-center justify-center text-white shadow-pop-sm group-hover:rotate-6 transition-transform">
            <Zap className="w-6 h-6 fill-shin-yellow text-shin-yellow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-shin-ink flex items-center gap-1.5">
              SkillMatch
              <span className="text-xs px-2 py-0.5 rounded-full bg-shin-yellow text-shin-ink border border-shin-ink font-bold uppercase tracking-wider">
                Shin-chan Ed.
              </span>
            </span>
            <span className="text-[10px] font-semibold text-shin-ink/60 -mt-1">
              Kasukabe Defense Squad Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-shin-canvas/80 p-1.5 rounded-2xl border-2 border-shin-ink shadow-pop-sm">
          <Link
            href="/projects"
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
              isActive('/projects')
                ? 'bg-shin-yellow text-shin-ink border-2 border-shin-ink shadow-pop-sm'
                : 'text-shin-ink/80 hover:text-shin-ink hover:bg-white/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Projects
          </Link>

          <Link
            href="/projects/new"
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
              isActive('/projects/new')
                ? 'bg-shin-red text-white border-2 border-shin-ink shadow-pop-sm'
                : 'text-shin-ink/80 hover:text-shin-ink hover:bg-white/80'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Create Project
          </Link>

          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
              isActive('/dashboard')
                ? 'bg-shin-blue text-white border-2 border-shin-ink shadow-pop-sm'
                : 'text-shin-ink/80 hover:text-shin-ink hover:bg-white/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        {/* Right side auth & profile */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-shin-ink shadow-pop-sm hover:translate-y-[-1px] transition-transform"
              >
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-shin-ink object-cover"
                />
                <div className="text-left">
                  <div className="text-xs font-black text-shin-ink leading-tight flex items-center gap-1">
                    {currentUser.name.split(' ')[0]}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-shin-ink/60 font-medium">
                    {currentUser.major.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-shin-ink" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-shin-ink rounded-2xl shadow-pop p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b-2 border-shin-ink/10 mb-2">
                    <p className="text-xs font-bold text-shin-ink">{currentUser.name}</p>
                    <p className="text-[11px] text-shin-ink/60">{currentUser.bio.slice(0, 45)}...</p>
                  </div>

                  <div className="px-3 py-1 mb-2">
                    <span className="text-[10px] font-extrabold uppercase text-shin-ink/50 tracking-wider">
                      Switch Demo Persona
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {profiles.slice(0, 3).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            loginDemoUser(p.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`text-[10px] font-bold p-1 rounded-lg border border-shin-ink transition-all ${
                            currentUser.id === p.id
                              ? 'bg-shin-yellow font-black text-shin-ink'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {p.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/profile/${currentUser.id}`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-shin-ink hover:bg-shin-canvas rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-shin-blue" />
                    My Public Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-shin-ink hover:bg-shin-canvas rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-shin-kamen.purple" />
                    Edit Skills & Preferences
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-shin-red hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-black border-2 border-shin-ink bg-white text-shin-ink shadow-pop-sm hover:translate-y-[-1px] transition-transform"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-xs font-black border-2 border-shin-ink bg-shin-red text-white shadow-pop-sm hover:translate-y-[-1px] transition-transform"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border-2 border-shin-ink bg-white shadow-pop-sm text-shin-ink"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-shin-ink/10 flex flex-col gap-2 pb-2">
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-sm bg-shin-canvas border border-shin-ink"
          >
            <Compass className="w-4 h-4 text-shin-blue" />
            Explore Projects
          </Link>
          <Link
            href="/projects/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-sm bg-shin-canvas border border-shin-ink"
          >
            <PlusCircle className="w-4 h-4 text-shin-red" />
            Create Project
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-sm bg-shin-canvas border border-shin-ink"
          >
            <LayoutDashboard className="w-4 h-4 text-shin-yellow" />
            Dashboard
          </Link>
          {currentUser ? (
            <div className="pt-2 border-t border-shin-ink/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-shin-ink">
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full border border-shin-ink"
                />
                <span className="text-xs font-bold text-shin-ink">{currentUser.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-xs font-bold text-shin-red p-2"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-black border-2 border-shin-ink bg-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-black border-2 border-shin-ink bg-shin-red text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
