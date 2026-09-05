import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise } from '../types';
import { ChevronDown, Play, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface CategorySelectorProps {
  id: string;
  categoryKey: 'energy' | 'focus' | 'calm';
  title: string;
  tagline: string;
  icon: React.ReactNode;
  theme: {
    border: string;
    borderActive: string;
    bgHover: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    glow: string;
  };
  exercises: Exercise[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  activeExerciseId?: string;
}

export const CategoryExerciseList: React.FC<CategorySelectorProps> = ({
  id,
  categoryKey,
  title,
  tagline,
  icon,
  theme,
  exercises,
  isOpen,
  onToggle,
  onSelectExercise,
  activeExerciseId,
}) => {
  return (
    <div className="space-y-2">
      {/* Category Primary Header Button */}
      <motion.button
        id={id}
        whileHover={{
          scale: 1.02,
          y: -2,
          boxShadow: theme.glow,
        }}
        whileTap={{ scale: 0.98, y: 1 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        onClick={() => {
          sounds.playClick();
          onToggle();
        }}
        aria-expanded={isOpen}
        className={`w-full text-left p-4 sm:p-5 rounded-2xl bg-white border-2 ${
          isOpen ? theme.borderActive + ' shadow-md' : theme.border + ' shadow-sm hover:' + theme.borderActive
        } flex items-center justify-between group relative overflow-hidden transition-colors`}
      >
        {/* Shimmer light pass */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className={`w-12 h-12 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black font-gaming text-slate-900 group-hover:text-slate-950 transition-colors">
                {title}
              </span>
              <span
                className={`text-[10px] font-bold font-gaming px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} uppercase`}
              >
                10 Exercises
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{tagline}</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors relative z-10"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Accordion Exercise List (10 Targeted Protocols) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${categoryKey}-exercise-accordion`}
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{
              opacity: 1,
              height: 'auto',
              y: 0,
              transition: {
                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, delay: 0.05 },
                y: { duration: 0.25, ease: 'easeOut' },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -6,
              transition: {
                height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.15 },
                y: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] font-bold font-gaming text-slate-400 tracking-wider uppercase">
                <span>CHOOSE A 1-MINUTE EXERCISE</span>
                <span className="text-indigo-600 font-extrabold">60S TIMER</span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {exercises.map((exercise, index) => {
                  const isSelected = activeExerciseId === exercise.id;
                  return (
                    <motion.button
                      key={exercise.id}
                      id={`btn-select-${exercise.id}`}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sounds.playClick();
                        onSelectExercise(exercise);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 pr-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-black font-gaming text-[11px] shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black font-gaming text-slate-800 group-hover:text-slate-950 flex items-center gap-1.5">
                            <span>{exercise.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {exercise.guideSentence}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold font-gaming px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                          60s
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center text-indigo-600 group-hover:text-white transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
