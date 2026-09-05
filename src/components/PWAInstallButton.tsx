import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { sounds } from '../utils/sound';
import { PowerUpLogo } from './PowerUpLogo';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={() => {
          sounds.playClick();
          install();
        }}
        className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm shadow-indigo-200 transition tracking-wide uppercase font-gaming"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => {
            sounds.playClick();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-800 px-3 py-1.5 text-xs font-bold transition tracking-wide uppercase font-gaming"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-install-modal"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <PowerUpLogo size="sm" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install PowerUp</h3>
                    <p className="text-[11px] text-slate-500">Add to Home Screen for offline access</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> Share</strong> icon in your Safari toolbar.
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" /> Add to Home Screen</strong>.
                  </span>
                </div>
              </div>

              <button
                id="btn-close-ios-guide"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-indigo-600 text-white py-2.5 text-xs font-bold hover:bg-indigo-700 transition font-gaming tracking-wide uppercase"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
