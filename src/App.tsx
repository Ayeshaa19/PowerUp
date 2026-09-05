import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ENERGY_EXERCISES,
  FOCUS_EXERCISES,
  CALM_EXERCISES,
  POWER_UP_EXERCISES,
} from './data/exercises';
import { Exercise, UserStats } from './types';
import { ExerciseSession } from './components/ExerciseSession';
import { CategoryExerciseList } from './components/CategoryExerciseList';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PowerUpLogo } from './components/PowerUpLogo';
import { sounds } from './utils/sound';
import {
  Zap,
  Target,
  Shield,
  Volume2,
  VolumeX,
  Flame,
  Award,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'powerup_user_stats_v1';

export default function App() {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [openCategory, setOpenCategory] = useState<'energy' | 'focus' | 'calm' | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getIsMuted());
  const [showUpgradeToast, setShowUpgradeToast] = useState<string | null>(null);

  // User Gamification stats (Local persistent)
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window === 'undefined') {
      return { xp: 120, level: 2, upgradesCompleted: 8, currentStreak: 3, lastCompletedAt: null };
    }
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('somaup_user_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { xp: 120, level: 2, upgradesCompleted: 8, currentStreak: 3, lastCompletedAt: null };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sounds.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const handleToggleCategory = (category: 'energy' | 'focus' | 'calm') => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleCompleteExercise = () => {
    // Award XP and increment upgrades count
    setStats((prev) => {
      const nextXp = prev.xp + 50;
      const nextLevel = Math.floor(nextXp / 100) + 1;
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        upgradesCompleted: prev.upgradesCompleted + 1,
        currentStreak: prev.currentStreak + 1,
        lastCompletedAt: new Date().toISOString(),
      };
    });

    const completedTitle = activeExercise?.title || 'Exercise';
    setActiveExercise(null);
    setShowUpgradeToast(`${completedTitle} Completed • Daily Streak Maintained!`);
    setTimeout(() => {
      setShowUpgradeToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* View Switch with smooth animations */}
      <AnimatePresence mode="wait">
        {activeExercise ? (
          <ExerciseSession
            key={`exercise-${activeExercise.id}`}
            exercise={activeExercise}
            onComplete={handleCompleteExercise}
            onExit={() => setActiveExercise(null)}
          />
        ) : (
          /* Home Screen Dashboard */
          <motion.div
            key="home-dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-md w-full mx-auto px-4 py-6 sm:px-6 flex flex-col justify-between flex-1"
          >
            {/* TOP GAMING HUD HEADER */}
            <header className="space-y-4">
              {/* Top Row: Brand & System Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PowerUpLogo size="md" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-xl font-black font-gaming text-slate-900 tracking-tight leading-none">
                        Power<span className="text-blue-600">Up</span>
                      </h1>
                      <span className="text-[9px] font-bold font-gaming px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 uppercase">
                        30 QUICK EXERCISES
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                      1-Minute Energy, Focus & Calm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PWAInstallButton />
                  <motion.button
                    id="btn-app-sound-toggle"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSound}
                    aria-label="Toggle Sound Effects"
                    className="p-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                  </motion.button>
                </div>
              </div>

              {/* Daily Streak Display Only */}
              <div
                id="daily-streak-card"
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-500">
                    <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-black font-gaming text-slate-800 tracking-wider">
                      {stats.currentStreak} DAY STREAK
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Daily routine active
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold font-gaming px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  ACTIVE
                </span>
              </div>

              {/* Notification Toast */}
              <AnimatePresence>
                {showUpgradeToast && (
                  <motion.div
                    id="upgrade-toast"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="p-3 rounded-xl bg-emerald-600 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 text-xs font-bold font-gaming"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{showUpgradeToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* MAIN EXERCISE HUB WITH 10 EXERCISES IN EACH CATEGORY */}
            <main className="my-auto py-5 space-y-3.5">
              <div className="text-center px-2 mb-1">
                <span className="text-[11px] font-extrabold font-gaming uppercase tracking-widest text-slate-400">
                  FEEL BETTER IN 60 SECONDS
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-gaming text-slate-900 tracking-tight mt-0.5">
                  CHOOSE YOUR FOCUS
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tap any category below to pick a quick 1-minute exercise
                </p>
              </div>

              {/* 1. CATEGORY: Boost Energy (10 Exercises) */}
              <CategoryExerciseList
                id="btn-unlock-peak-energy"
                categoryKey="energy"
                title="Boost Energy"
                tagline="For when you feel sleepy, sluggish, or low on energy"
                icon={<Zap className="w-6 h-6" />}
                theme={{
                  border: 'border-amber-200/90',
                  borderActive: 'border-amber-500 ring-2 ring-amber-100',
                  bgHover: 'bg-amber-50/40',
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-600',
                  badgeBg: 'bg-amber-50',
                  badgeText: 'text-amber-700',
                  badgeBorder: 'border-amber-200',
                  glow: '0 10px 25px -5px rgba(245, 158, 11, 0.15)',
                }}
                exercises={ENERGY_EXERCISES}
                isOpen={openCategory === 'energy'}
                onToggle={() => handleToggleCategory('energy')}
                onSelectExercise={(exercise) => setActiveExercise(exercise)}
              />

              {/* 2. CATEGORY: Sharpen Focus (10 Exercises) */}
              <CategoryExerciseList
                id="btn-unlock-laser-focus"
                categoryKey="focus"
                title="Sharpen Focus"
                tagline="For when your mind feels scattered, distracted, or foggy"
                icon={<Target className="w-6 h-6" />}
                theme={{
                  border: 'border-blue-200/90',
                  borderActive: 'border-blue-500 ring-2 ring-blue-100',
                  bgHover: 'bg-blue-50/40',
                  iconBg: 'bg-blue-100',
                  iconColor: 'text-blue-600',
                  badgeBg: 'bg-blue-50',
                  badgeText: 'text-blue-700',
                  badgeBorder: 'border-blue-200',
                  glow: '0 10px 25px -5px rgba(59, 130, 246, 0.15)',
                }}
                exercises={FOCUS_EXERCISES}
                isOpen={openCategory === 'focus'}
                onToggle={() => handleToggleCategory('focus')}
                onSelectExercise={(exercise) => setActiveExercise(exercise)}
              />

              {/* 3. CATEGORY: Calm & Relax (10 Exercises) */}
              <CategoryExerciseList
                id="btn-unlock-deep-calm"
                categoryKey="calm"
                title="Calm & Relax"
                tagline="For when you feel stressed, overwhelmed, or anxious"
                icon={<Shield className="w-6 h-6" />}
                theme={{
                  border: 'border-emerald-200/90',
                  borderActive: 'border-emerald-500 ring-2 ring-emerald-100',
                  bgHover: 'bg-emerald-50/40',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-600',
                  badgeBg: 'bg-emerald-50',
                  badgeText: 'text-emerald-700',
                  badgeBorder: 'border-emerald-200',
                  glow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)',
                }}
                exercises={CALM_EXERCISES}
                isOpen={openCategory === 'calm'}
                onToggle={() => handleToggleCategory('calm')}
                onSelectExercise={(exercise) => setActiveExercise(exercise)}
              />
            </main>

            {/* FOOTER */}
            <footer className="pt-4 border-t border-slate-200/80 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold font-gaming text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>SIMPLE 1-MINUTE SCIENCE-BACKED EXERCISES</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Quick physical and breathing exercises to help you feel better in 60 seconds.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
