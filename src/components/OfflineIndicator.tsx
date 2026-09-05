import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-50 flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-amber-500/20 animate-bounce"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode Active • PowerUp exercises run 100% locally</span>
    </div>
  );
};
