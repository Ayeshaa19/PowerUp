import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise } from '../types';
import { Play, Pause, RotateCcw, CheckCircle2, ChevronLeft, Volume2, VolumeX, Shield, Activity, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ExerciseSessionProps {
  exercise: Exercise;
  onComplete: () => void;
  onExit: () => void;
}

export const ExerciseSession: React.FC<ExerciseSessionProps> = ({
  exercise,
  onComplete,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(exercise.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getIsMuted());
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [saccadePhase, setSaccadePhase] = useState<'left' | 'right'>('left');
  const [tremorTick, setTremorTick] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 60-second timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sounds.playLevelUp();
            setHasFinished(true);
            // Auto-reset timer to full 60 seconds after one's timer is done so user can run again or integrate
            return exercise.durationSeconds;
          }
          if (prev % 5 === 0 || prev <= 5) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, exercise.durationSeconds]);

  // Reset timer if active exercise changes
  useEffect(() => {
    setTimeLeft(exercise.durationSeconds);
    setIsRunning(true);
    setHasFinished(false);
  }, [exercise.id, exercise.durationSeconds]);

  // Bilateral pacing animation loop
  useEffect(() => {
    const saccadeInterval = setInterval(() => {
      setSaccadePhase((prev) => (prev === 'left' ? 'right' : 'left'));
    }, 2000);
    return () => clearInterval(saccadeInterval);
  }, []);

  // Rapid tremor jitter tick loop
  useEffect(() => {
    if (!isRunning) return;
    const tremorInterval = setInterval(() => {
      setTremorTick((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(tremorInterval);
  }, [isRunning]);

  const toggleTimer = () => {
    sounds.playClick();
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    sounds.playClick();
    setTimeLeft(exercise.durationSeconds);
    setIsRunning(true);
    setHasFinished(false);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sounds.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const handleUpgradeComplete = () => {
    sounds.playLevelUp();
    onComplete();
  };

  // Progress percentage (0 to 100%)
  const progress = ((exercise.durationSeconds - timeLeft) / exercise.durationSeconds) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine which interactive visualizer HUD to display
  const isSaccade =
    exercise.type === 'racing-thoughts' ||
    exercise.id === 'calm-2' ||
    exercise.title.toLowerCase().includes('saccade') ||
    exercise.title.toLowerCase().includes('side-to-side') ||
    exercise.actionCommand.toLowerCase().includes('left to right');

  const isCrossMarch =
    exercise.type === 'low-mood' ||
    exercise.id === 'calm-3' ||
    exercise.title.toLowerCase().includes('march') ||
    exercise.actionCommand.toLowerCase().includes('elbow to knee');

  const isTremor =
    exercise.type === 'extreme-stress' ||
    exercise.id === 'calm-4' ||
    exercise.title.toLowerCase().includes('shake') ||
    exercise.actionCommand.toLowerCase().includes('shake');

  return (
    <motion.div
      id="active-exercise-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-[#F2F2F7] text-slate-900 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto select-none"
    >
      {/* Top HUD Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between pt-2 pb-3"
      >
        <motion.button
          id="btn-back-dashboard"
          whileHover={{ scale: 1.03, x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sounds.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold font-gaming text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK TO EXERCISES</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            id="btn-toggle-sound"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-slate-600 hover:text-slate-900 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </motion.button>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs text-[11px] font-bold font-gaming tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isRunning ? 'IN PROGRESS' : 'PAUSED'}</span>
          </div>
        </div>
      </motion.header>

      {/* Main Clinical Card */}
      <main className="my-auto space-y-4 py-2">
        {/* Protocol Category Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-gaming tracking-wider uppercase border shadow-xs"
            style={{
              backgroundColor: exercise.themeColor.bgBadge,
              borderColor: exercise.themeColor.border,
              color: exercise.themeColor.textBadge,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: exercise.themeColor.accent }} />
            <span>{exercise.title}</span>
          </div>
        </motion.div>

        {/* Giant Direct Physical Action Command & Easy Instructions */}
        <div className="space-y-3 px-1">
          <motion.h1
            id="exercise-action-command"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-2xl sm:text-3xl font-black font-gaming text-slate-900 tracking-tight leading-tight uppercase text-center"
          >
            {exercise.actionCommand}
          </motion.h1>

          {/* Dedicated Easy-to-Follow Instructions Card with Increased Text Size */}
          <motion.div
            id="exercise-instructions-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200/90 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-black font-gaming tracking-wider text-slate-700 uppercase">
              <span className="flex items-center gap-1.5 text-indigo-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                HOW TO DO THIS (EASY STEPS)
              </span>
              <span className="text-[11px] text-slate-400 font-bold">SIMPLE GUIDE</span>
            </div>

            {exercise.steps && exercise.steps.length > 0 ? (
              <div className="space-y-2.5 pt-0.5">
                {exercise.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-left">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-black font-gaming text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p
                id="exercise-guide-sentence"
                className="text-base sm:text-lg font-bold text-slate-800 text-left leading-relaxed"
              >
                {exercise.guideSentence}
              </p>
            )}
          </motion.div>
        </div>

        {/* Interactive Pacing Visualizer: Zero AI images, 100% interactive pacing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-bold font-gaming text-slate-400 uppercase tracking-wider mb-2.5">
            <span>RHYTHM & PACING</span>
            <span className="text-indigo-600 font-extrabold">{exercise.cadenceText}</span>
          </div>

          {/* Saccadic Eye Tracking HUD */}
          {isSaccade && (
            <div className="relative h-14 bg-slate-100 rounded-xl flex items-center px-4 overflow-hidden border border-slate-200">
              <div className="absolute left-3 text-[10px] font-black font-gaming text-slate-400 z-10">
                EXTREME LEFT
              </div>
              <div className="absolute right-3 text-[10px] font-black font-gaming text-slate-400 z-10">
                EXTREME RIGHT
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full relative">
                <motion.div
                  animate={{
                    left: saccadePhase === 'left' ? '6%' : '88%',
                  }}
                  transition={{
                    duration: 1.8,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                  className="w-8 h-8 -top-3.5 absolute rounded-full bg-indigo-600 shadow-md shadow-indigo-400/40 border-2 border-white flex items-center justify-center text-white text-xs font-black"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Cross-Lateral Marching Cadence HUD */}
          {isCrossMarch && (
            <div className="grid grid-cols-2 gap-3 text-center">
              <motion.div
                animate={{
                  scale: saccadePhase === 'left' ? 1.03 : 1,
                  backgroundColor: saccadePhase === 'left' ? '#0284C7' : '#F8FAFC',
                  color: saccadePhase === 'left' ? '#FFFFFF' : '#64748B',
                  borderColor: saccadePhase === 'left' ? '#0369A1' : '#E2E8F0',
                }}
                transition={{ duration: 0.3 }}
                className="py-3 px-3 rounded-xl border font-gaming font-bold text-xs shadow-xs"
              >
                RIGHT ELBOW ➔ LEFT KNEE
              </motion.div>
              <motion.div
                animate={{
                  scale: saccadePhase === 'right' ? 1.03 : 1,
                  backgroundColor: saccadePhase === 'right' ? '#0284C7' : '#F8FAFC',
                  color: saccadePhase === 'right' ? '#FFFFFF' : '#64748B',
                  borderColor: saccadePhase === 'right' ? '#0369A1' : '#E2E8F0',
                }}
                transition={{ duration: 0.3 }}
                className="py-3 px-3 rounded-xl border font-gaming font-bold text-xs shadow-xs"
              >
                LEFT ELBOW ➔ RIGHT KNEE
              </motion.div>
            </div>
          )}

          {/* High-Frequency Tremoring HUD */}
          {isTremor && (
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 px-3 overflow-hidden">
              {[...Array(18)].map((_, i) => {
                const seed = (i * 7 + tremorTick * 13) % 24;
                const barHeight = isRunning ? Math.max(8, seed + 10) : 10;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      height: barHeight,
                      opacity: isRunning ? 0.9 : 0.3,
                    }}
                    transition={{ duration: 0.08 }}
                    className="w-1.5 rounded-full bg-red-500"
                  />
                );
              })}
            </div>
          )}

          {/* General Power-Up Mechanic Prompts for other exercises */}
          {!isSaccade && !isCrossMarch && !isTremor && (
            <div className="flex items-center justify-center py-2.5">
              <div className="flex items-center gap-2.5 text-xs font-bold font-gaming text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span>{exercise.mechanicsPrompt || 'FOLLOW THE PACING RHYTHM'}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* ACTIVE DIGITAL COUNTDOWN TIMER (60 SECONDS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="flex flex-col items-center justify-center relative py-1"
        >
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-slate-200/90"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={exercise.themeColor.accent}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Centered Digital Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold font-gaming tracking-widest text-slate-400 uppercase">
                {hasFinished ? 'TIME COMPLETED!' : isRunning ? 'TIME REMAINING' : 'PAUSED'}
              </span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={timeLeft}
                  initial={{ opacity: 0.8, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  id="digital-countdown-timer"
                  className="text-5xl sm:text-6xl font-black font-gaming tracking-wider text-slate-900 leading-none mt-1"
                >
                  {formatSeconds(timeLeft)}
                </motion.span>
              </AnimatePresence>
              <span className="text-[11px] font-bold text-slate-500 font-gaming mt-1">
                {hasFinished ? '1 MINUTE COMPLETE! TAP FINISH BELOW' : `${timeLeft} SECONDS REMAINING`}
              </span>
            </div>
          </div>

          {/* Interactive Timer Controls (Pause / Resume / Reset) */}
          <div className="flex items-center gap-3 mt-3">
            <motion.button
              id="btn-toggle-timer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs font-bold font-gaming text-slate-700 hover:bg-slate-50 transition"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isRunning ? 'PAUSE' : 'RESUME'}</span>
            </motion.button>
            <motion.button
              id="btn-reset-timer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs font-bold font-gaming text-slate-500 hover:text-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </motion.button>
          </div>
        </motion.div>

        {/* SINGLE SENTENCE EXPLAINING WHY THIS HELPS YOUR BODY */}
        <motion.div
          id="neurobiology-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-black font-gaming tracking-wider text-slate-800 uppercase">
              WHY THIS HELPS YOUR BODY
            </span>
          </div>
          <p
            id="exercise-neurobiology-text"
            className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal"
          >
            {exercise.neurobiology}
          </p>
        </motion.div>
      </main>

      {/* FOOTER: "COMPLETE EXERCISE" BUTTON */}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        className="pt-3 pb-2"
      >
        <motion.button
          id="btn-upgrade-complete"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpgradeComplete}
          className={`w-full py-4 px-6 rounded-2xl font-black font-gaming tracking-wider uppercase text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
            hasFinished
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 ring-4 ring-emerald-200/60 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>COMPLETE EXERCISE</span>
        </motion.button>
        <p className="text-center text-[11px] text-slate-400 font-gaming mt-2">
          TAP TO FINISH & EXTEND YOUR DAILY STREAK
        </p>
      </motion.footer>
    </motion.div>
  );
};
