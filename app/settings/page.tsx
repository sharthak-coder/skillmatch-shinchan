'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/store/data-provider';
import { POPULAR_SKILLS, POPULAR_INTERESTS } from '@/lib/seed-data';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TagInput from '@/components/ui/TagInput';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { 
  Check, 
  ArrowLeft, 
  User, 
  Sparkles, 
  ShieldCheck,
  Save,
  Dog
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useData();

  const [name, setName] = useState(currentUser?.name || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [year, setYear] = useState(currentUser?.year || 'Sophomore');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar_url || AVATARS[0]);
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setMajor(currentUser.major);
      setYear(currentUser.year);
      setBio(currentUser.bio);
      setAvatar(currentUser.avatar_url);
      setSkills(currentUser.skills);
      setInterests(currentUser.interests);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-black text-shin-ink">Please Sign In</h2>
        <p className="text-xs text-shin-ink/60 font-semibold mt-2">
          You need to be logged in to modify your settings.
        </p>
        <Link href="/login" className="inline-block mt-4">
          <Button variant="red" size="sm">Log In</Button>
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await updateProfile({
      name,
      major,
      year,
      bio,
      avatar_url: avatar,
      skills,
      interests,
    });

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#FACC15', '#0284C7'],
      });
    } catch {}

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="py-6 space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-shin-ink hover:text-shin-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <Badge variant="shiro">Account Profile</Badge>
      </div>

      <Card className="p-6 sm:p-8 bg-white border-2 border-shin-ink shadow-pop-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-shin-ink tracking-tight">
              Edit Skills & Profile
            </h1>
            <p className="text-xs sm:text-sm text-shin-ink/60 font-semibold mt-1">
              Keep your superpower skills updated to maximize matching accuracy.
            </p>
          </div>
          {savedSuccess && (
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500 text-xs font-black flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-3">
              {AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === url
                      ? 'border-shin-red scale-110 shadow-pop-sm ring-2 ring-shin-yellow'
                      : 'border-shin-ink opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                Graduation Standing
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-sm font-bold shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Master's / PhD">Master&apos;s / PhD</option>
              </select>
            </div>
          </div>

          <Input
            label="Major / Program"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
              Short Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-sm font-medium shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
            />
          </div>

          <TagInput
            label="Superpower Skills"
            value={skills}
            onChange={setSkills}
            suggestions={POPULAR_SKILLS}
            placeholder="Type skill and press Enter"
            badgeColor="yellow"
          />

          <TagInput
            label="Interests & Domain Tracks"
            value={interests}
            onChange={setInterests}
            suggestions={POPULAR_INTERESTS}
            placeholder="Type interest and press Enter"
            badgeColor="blue"
          />

          <div className="pt-4 border-t-2 border-shin-ink/10 flex items-center justify-between">
            <Link href={`/profile/${currentUser.id}`}>
              <Button variant="white" size="md">
                View Public Profile
              </Button>
            </Link>

            <Button
              type="submit"
              variant="red"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
