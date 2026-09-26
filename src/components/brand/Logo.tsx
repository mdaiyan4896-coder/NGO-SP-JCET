import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  showTagline?: boolean;
  className?: string;
  inverted?: boolean;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 38, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 group ${className}`}
      style={{ width: size, height: size }}
      aria-label="VolunEase Logo Icon"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Radiant Deep Emerald to Brilliant Teal Gradient */}
          <linearGradient id="volunBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#0EA47A" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>

          {/* Inner Light Ring */}
          <linearGradient id="innerGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>

          {/* Warm Coral & Gold Heart Emblem */}
          <linearGradient id="heartCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B4A" />
            <stop offset="60%" stopColor="#FF8559" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Subtle Ambient Drop Shadow */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#042F2E" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Squircle Outer Base */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="13"
          fill="url(#volunBaseGrad)"
        />

        {/* Subtle Inner Glass Bevel */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          stroke="url(#innerGlowGrad)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Upward Caring Palm Curve & Trust Checkmark */}
        <path
          d="M13 28.5C13 28.5 16.5 32.5 21.5 32.5C26.5 32.5 30 28 34 24C35.5 22.5 38 22.5 39.5 24"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />

        {/* Action Checkmark / Community Growth Vector */}
        <path
          d="M15.5 22.5L21.5 28.5L34.5 14"
          stroke="white"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Coral Hope Sparkle / Caring Heart Gem */}
        <path
          d="M28.5 9.5C27 8 24.5 8 23 9.5C22.2 10.3 21.8 11.2 21.8 12.2C21.8 14.2 24.5 16.8 26.5 18.8C28.5 16.8 31.2 14.2 31.2 12.2C31.2 11.2 30.8 10.3 30 9.5C29.5 9 29 9 28.5 9.5Z"
          fill="url(#heartCoralGrad)"
          stroke="white"
          strokeWidth="1.2"
          filter="url(#softShadow)"
        />

        {/* Radiant Spark Accent */}
        <circle cx="15.5" cy="13.5" r="2.2" fill="white" />
        <circle cx="35" cy="31" r="1.5" fill="#A7F3D0" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = false,
  className = '',
  inverted = false,
}) => {
  const iconSizes = {
    sm: 30,
    md: 40,
    lg: 48,
    xl: 60,
  };

  const isWhite = inverted || className.includes('text-white');

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <LogoIcon size={iconSizes[size]} />

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-extrabold font-['Plus_Jakarta_Sans'] leading-none">
            <span
              className={`text-base sm:text-lg md:text-xl font-black ${
                isWhite ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
            >
              Volun
            </span>
            <span
              className={`text-base sm:text-lg md:text-xl font-black ml-0.5 ${
                isWhite ? 'text-amber-300 drop-shadow-xs' : 'text-emerald-600 dark:text-emerald-400'
              }`}
              style={
                !isWhite
                  ? {
                      backgroundImage: 'linear-gradient(135deg, #0EA47A, #14B8A6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#0EA47A',
                    }
                  : undefined
              }
            >
              Ease
            </span>
            <span
              className={`w-2 h-2 rounded-full ml-1 mb-1 animate-pulse shadow-xs ${
                isWhite ? 'bg-amber-300' : 'bg-gradient-to-tr from-amber-500 to-rose-500'
              }`}
            />
          </div>
          {showTagline && (
            <span
              className={`text-[10px] sm:text-[11px] font-semibold tracking-wider mt-1 uppercase font-['Inter'] ${
                isWhite ? 'text-white/80' : 'text-[var(--text-muted)]'
              }`}
            >
              Where Helping Hands Find Their Place
            </span>
          )}
        </div>
      )}
    </div>
  );
};
