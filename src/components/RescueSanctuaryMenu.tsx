import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESCUE_SANCTUARY_OPTIONS } from '../data/exercises';
import { Exercise } from '../types';
import { ShieldAlert, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface RescueSanctuaryMenuProps {
  isOpen: boolean;
  onSelectExercise: (exercise: Exercise) => void;
  onLaunchDeepCalmDirect: () => void;
}

export const RescueSanctuaryMenu: React.FC<RescueSanctuaryMenuProps> = ({
  isOpen,
  onSelectExercise,
  onLaunchDeepCalmDirect,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="rescue-sanctuary-submenu"
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{
            opacity: 1,
            height: 'auto',
            y: 0,
            transition: {
              height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, delay: 0.05 },
              y: { duration: 0.3, ease: 'easeOut' },
            },
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -8,
            transition: {
              height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.15 },
              y: { duration: 0.2 },
            },
          }}
          className="overflow-hidden"
        >
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-200/90 shadow-lg shadow-emerald-500/5">
            {/* Sub-menu Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black font-gaming uppercase tracking-wider text-slate-900">
                    QUICK CALM MENU
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Quick exercises when you are feeling stressed or overwhelmed
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold font-gaming tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </span>
            </div>

            {/* 3 Specific Distress Options with smooth hover and click animations */}
            <div className="mt-3.5 space-y-2.5">
              {RESCUE_SANCTUARY_OPTIONS.map((opt, index) => (
                <motion.button
                  key={opt.id}
                  id={`btn-${opt.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.25 }}
                  whileHover={{
                    scale: 1.015,
                    x: 2,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.playClick();
                    onSelectExercise(opt);
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-400 bg-slate-50/80 hover:bg-white active:scale-[0.98] transition-colors duration-150 group flex items-center justify-between shadow-xs relative overflow-hidden"
                >
                  {/* Subtle hover accent flash */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="pr-2 relative z-10">
                    <div className="text-xs sm:text-sm font-bold font-gaming text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {opt.actionCommand}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 relative z-10">
                    <span className="text-[10px] font-bold font-gaming px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                      60s
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Direct baseline Deep Calm Launch Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Or start a gentle breathing exercise:
              </span>
              <motion.button
                id="btn-direct-deep-calm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sounds.playClick();
                  onLaunchDeepCalmDirect();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold font-gaming uppercase tracking-wider shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Relaxing</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
