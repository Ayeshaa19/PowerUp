export interface Exercise {
  id: string;
  title: string;
  category: 'power-up' | 'rescue';
  type: 'energy' | 'focus' | 'calm' | 'racing-thoughts' | 'low-mood' | 'extreme-stress';
  actionCommand: string;
  guideSentence: string;
  steps?: string[];
  neurobiology: string;
  durationSeconds: number;
  themeColor: {
    primary: string;
    bgBadge: string;
    textBadge: string;
    border: string;
    accent: string;
    glow: string;
  };
  cadenceText?: string;
  mechanicsPrompt?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  upgradesCompleted: number;
  currentStreak: number;
  lastCompletedAt: string | null;
}
