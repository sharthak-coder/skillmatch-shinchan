'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import { POPULAR_SKILLS, POPULAR_INTERESTS } from '@/lib/seed-data';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TagInput from '@/components/ui/TagInput';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  GraduationCap, 
  Wrench, 
  HeartHandshake, 
  Zap,
  Dog
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useData();

  const [step, setStep] = useState(1);
  const [major, setMajor] = useState(currentUser?.major || 'Computer Science');
  const [year, setYear] = useState(currentUser?.year || 'Sophomore');
  const [bio, setBio] = useState(
    currentUser?.bio || 'Ready to build something legendary with the Kasukabe Defense Corps!'
  );
  const [avatar, setAvatar] = useState(currentUser?.avatar_url || AVATAR_OPTIONS[0]);
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || ['react', 'typescript']);
  const [interests, setInterests] = useState<string[]>(
    currentUser?.interests || ['ai & machine learning', 'game development']
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsSaving(true);
    await updateProfile({
      major,
      year,
      bio,
      avatar_url: avatar,
      skills,
      interests,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#FACC15', '#0284C7'],
      });
    } catch {}

    setIsSaving(false);
    setStep(4); // Success Celebration step
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-shin-ink mb-2">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-shin-yellow text-shin-yellow" />
            Step {step} of 3
          </span>
          <span className="text-shin-ink/60">
            {step === 1 && 'Academic Identity'}
            {step === 2 && 'Superpower Skills'}
            {step === 3 && 'Project Interests'}
            {step === 4 && 'Complete!'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-shin-canvas rounded-full border-2 border-shin-ink overflow-hidden p-0.5 shadow-pop-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-shin-yellow via-shin-red to-shin-blue rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${Math.min(100, (step / 3) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Card className="p-8 bg-white border-2 border-shin-ink shadow-pop-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: Academic Identity */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="kasukabe" className="mb-2">Profile Identity</Badge>
                <h2 className="text-2xl font-black text-shin-ink">Tell Us About Yourself</h2>
                <p className="text-xs text-shin-ink/60 font-semibold mt-1">
                  Your academic major and background helps teams understand your foundation.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-2">
                  Choose Your Student Avatar
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                        avatar === url
                          ? 'border-shin-red scale-110 shadow-pop-sm ring-2 ring-shin-yellow'
                          : 'border-shin-ink opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar option" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science, HCI, Data Science"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-sm font-bold shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
                  />
                </div>

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

              <div>
                <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                  Short Bio & Work Style
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What excites you? Are you a fast hacker, researcher, or motion designer?"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-sm font-medium shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
                />
              </div>

              <div className="flex justify-end pt-4 border-t-2 border-shin-ink/10">
                <Button
                  variant="red"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Superpower Skills
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Superpower Skills */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="kamen" className="mb-2">Action Kamen Skills</Badge>
                <h2 className="text-2xl font-black text-shin-ink">Your Superpower Skills</h2>
                <p className="text-xs text-shin-ink/60 font-semibold mt-1">
                  The weighted matching algorithm uses these to compute real compatibility with projects.
                </p>
              </div>

              <TagInput
                label="Add Skills You Confidently Bring to the Table"
                value={skills}
                onChange={setSkills}
                suggestions={POPULAR_SKILLS}
                placeholder="Type skill (e.g. React, PyTorch, Figma) and press Enter"
                badgeColor="yellow"
              />

              <div className="flex items-center justify-between pt-6 border-t-2 border-shin-ink/10">
                <Button
                  variant="white"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="red"
                  onClick={handleNext}
                  disabled={skills.length === 0}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Passion Interests
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Project Interests */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="shiro" className="mb-2">Domain Curiosity</Badge>
                <h2 className="text-2xl font-black text-shin-ink">What Domains Excite You?</h2>
                <p className="text-xs text-shin-ink/60 font-semibold mt-1">
                  Projects in these categories give you a complementary 5% interest affinity boost!
                </p>
              </div>

              <TagInput
                label="Select Categories / Hackathon Tracks You Love"
                value={interests}
                onChange={setInterests}
                suggestions={POPULAR_INTERESTS}
                placeholder="Type interest (e.g. AI, GameDev) and press Enter"
                badgeColor="blue"
              />

              <div className="flex items-center justify-between pt-6 border-t-2 border-shin-ink/10">
                <Button
                  variant="white"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="red"
                  onClick={handleComplete}
                  isLoading={isSaving}
                  rightIcon={<Check className="w-4 h-4 stroke-[3]" />}
                >
                  Lock In Profile
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Celebratory Completion */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-shin-yellow border-2 border-shin-ink mx-auto flex items-center justify-center text-shin-ink shadow-pop animate-bounce-subtle">
                <Dog className="w-8 h-8 text-shin-ink" />
              </div>

              <div>
                <Badge variant="kamen">Shiro&apos;s Seal of Approval!</Badge>
                <h2 className="text-3xl font-black text-shin-ink mt-2">
                  You&apos;re Ready to Roll!
                </h2>
                <p className="text-xs text-shin-ink/70 font-semibold max-w-md mx-auto mt-2 leading-relaxed">
                  Your profile has been saved. You can now browse live projects, view your real-time SyncChain match percentages, or post your own project idea!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  variant="red"
                  size="lg"
                  onClick={() => router.push('/projects')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Explore Open Projects
                </Button>
                <Button
                  variant="white"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
