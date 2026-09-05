import React from 'react';

interface PowerUpLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withBackground?: boolean;
}

export const PowerUpLogo: React.FC<PowerUpLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  withBackground = true,
}) => {
  const sizeMap = {
    sm: { box: 36, iconSize: 26 },
    md: { box: 44, iconSize: 32 },
    lg: { box: 56, iconSize: 42 },
    xl: { box: 96, iconSize: 72 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={currentSize.box}
        height={currentSize.box}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 rounded-2xl shadow-sm select-none"
        aria-label="PowerUp Logo"
      >
        <defs>
          <linearGradient id="powerup-bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="brain-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Rounded Tile */}
        {withBackground && (
          <rect
            width="100"
            height="100"
            rx="22"
            fill="url(#powerup-bg-grad)"
          />
        )}

        {/* --- DUMBBELL (Left, Tilted ~6 degrees) --- */}
        <g transform="translate(18, 16) rotate(-7 20 32)">
          {/* Top Outer Plate */}
          <rect
            x="4"
            y="6"
            width="18"
            height="5"
            rx="2.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
          />
          {/* Top Inner Weight Head */}
          <rect
            x="1"
            y="11"
            width="24"
            height="9"
            rx="4"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Central Handle Bar */}
          <rect
            x="10"
            y="20"
            width="6"
            height="22"
            rx="1.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
          />
          {/* Grip Knurling Accent Lines */}
          <line x1="9" y1="28" x2="17" y2="28" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
          <line x1="9" y1="34" x2="17" y2="34" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
          {/* Bottom Inner Weight Head */}
          <rect
            x="1"
            y="42"
            width="24"
            height="9"
            rx="4"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Bottom Outer Plate */}
          <rect
            x="4"
            y="51"
            width="18"
            height="5"
            rx="2.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
          />
        </g>

        {/* --- LIGHTBULB & BRAIN (Right) --- */}
        <g transform="translate(56, 16)">
          {/* Top 3 Radiant Light Rays (Electric Blue) */}
          <line x1="16" y1="2" x2="16" y2="6" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="4" x2="11" y2="8" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="24" y1="4" x2="21" y2="8" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" />

          {/* Lightbulb Glass Outline (White) */}
          <path
            d="M 5 24 
               C 5 15, 10 9, 16 9 
               C 22 9, 27 15, 27 24 
               C 27 29, 24 33, 23 37 
               C 22 40, 21 42, 21 43 
               L 11 43 
               C 11 42, 10 40, 9 37 
               C 8 33, 5 29, 5 24 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Glowing Brain Silhouette inside Lightbulb */}
          <g transform="translate(8.5, 14)">
            {/* Brain base fill */}
            <path
              d="M 2 8 
                 C 1 6, 2 3, 4.5 2 
                 C 6 1, 8.5 2, 9.5 3.5 
                 C 10.5 2, 13 1, 14.5 2 
                 C 17 3, 18 6, 17 8 
                 C 18.5 9.5, 18.5 12.5, 17 14 
                 C 16 15, 14 15, 13 14 
                 C 11 16, 8 16, 6 14 
                 C 5 15, 3 15, 2 14 
                 C 0.5 12.5, 0.5 9.5, 2 8 Z"
              fill="url(#brain-glow-grad)"
            />
            {/* Brain inner sulci / folds (Darker Blue Lines) */}
            <path
              d="M 9.5 4 Q 9.5 12 9.5 14"
              stroke="#1E3A8A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 5 6 Q 7 8 6 11"
              stroke="#1E3A8A"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M 14 6 Q 12 8 13 11"
              stroke="#1E3A8A"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          {/* Screw Base Collar Ribs */}
          <path
            d="M 11 44 Q 16 46 21 44"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 11.5 48 Q 16 50 20.5 48"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 12 52 Q 16 54 20 52"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Rounded Base Contact Tip */}
          <path
            d="M 13.5 54 C 13.5 56, 18.5 56, 18.5 54"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="#FFFFFF"
          />
        </g>

        {/* Wordmark "PowerUp" inside the square badge bottom area (if sized xl or standalone) */}
        {size === 'xl' && (
          <text
            x="50"
            y="88"
            textAnchor="middle"
            fill="#E0E7FF"
            fontSize="15"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.3px"
          >
            PowerUp
          </text>
        )}
      </svg>

      {/* Optional Side Wordmark for Headers */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black font-gaming tracking-tight leading-none text-slate-900">
              Power<span className="text-blue-600">Up</span>
            </span>
            <span className="text-[9px] font-bold font-gaming px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 uppercase">
              30 EXERCISES
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            1-Minute Energy, Focus & Calm
          </span>
        </div>
      )}
    </div>
  );
};
