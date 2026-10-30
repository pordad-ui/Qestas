import React from 'react';

interface LegalScalesLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'emerald' | 'navy' | 'monochrome';
  className?: string;
  showRays?: boolean;
  interactive?: boolean;
}

export const LegalScalesLogo: React.FC<LegalScalesLogoProps> = ({
  size = 'md',
  variant = 'gold',
  className = '',
  showRays = false,
  interactive = false,
}) => {
  const sizeMap = {
    xs: { box: 20, px: 'w-5 h-5' },
    sm: { box: 28, px: 'w-7 h-7' },
    md: { box: 40, px: 'w-10 h-10' },
    lg: { box: 56, px: 'w-14 h-14' },
    xl: { box: 80, px: 'w-20 h-20' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Color schemes
  const colorSchemes = {
    gold: {
      gradientStart: '#FDE047', // yellow-300
      gradientMid: '#F59E0B',   // amber-500
      gradientEnd: '#B45309',   // amber-700
      accent: '#FEF08A',        // yellow-200
      panFill: 'url(#goldPanGrad)',
      beamStroke: 'url(#goldBeamGrad)',
      baseFill: 'url(#goldBaseGrad)',
      glow: 'rgba(245, 158, 11, 0.35)',
    },
    emerald: {
      gradientStart: '#6EE7B7',
      gradientMid: '#10B981',
      gradientEnd: '#047857',
      accent: '#A7F3D0',
      panFill: 'url(#emeraldPanGrad)',
      beamStroke: 'url(#emeraldBeamGrad)',
      baseFill: 'url(#emeraldBaseGrad)',
      glow: 'rgba(16, 185, 129, 0.35)',
    },
    navy: {
      gradientStart: '#93C5FD',
      gradientMid: '#3B82F6',
      gradientEnd: '#1D4ED8',
      accent: '#BFDBFE',
      panFill: 'url(#navyPanGrad)',
      beamStroke: 'url(#navyBeamGrad)',
      baseFill: 'url(#navyBaseGrad)',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    monochrome: {
      gradientStart: '#FFFFFF',
      gradientMid: '#CBD5E1',
      gradientEnd: '#64748B',
      accent: '#F8FAFC',
      panFill: 'currentColor',
      beamStroke: 'currentColor',
      baseFill: 'currentColor',
      glow: 'rgba(255, 255, 255, 0.2)',
    },
  };

  const colors = colorSchemes[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.px} ${
        interactive ? 'group cursor-pointer' : ''
      } ${className}`}
      title="نشان ترازوی دادگستر (سمبل عدالت و موازنه حقوقی)"
    >
      {/* Background ambient glow if requested or large */}
      {showRays && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none scale-125"
          style={{ background: colors.glow }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          interactive ? 'group-hover:scale-105 group-hover:-rotate-1' : ''
        }`}
        aria-label="ترازوی عدالت دادگستر"
      >
        <defs>
          {/* Gold Gradients */}
          <linearGradient id="goldBeamGrad" x1="10" y1="28" x2="90" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FEF08A" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="goldPanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="goldBaseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Emerald Gradients */}
          <linearGradient id="emeraldBeamGrad" x1="10" y1="28" x2="90" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          <linearGradient id="emeraldPanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="emeraldBaseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Navy Gradients */}
          <linearGradient id="navyBeamGrad" x1="10" y1="28" x2="90" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id="navyPanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="navyBaseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Filter for subtle drop shadow */}
          <filter id="scalesShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Central Vertical Pillar (Shaft of Justice) */}
        <g filter="url(#scalesShadow)">
          {/* Base pedestal step 1 */}
          <path
            d="M26 88 C26 85, 74 85, 74 88 L78 93 C78 95, 22 95, 22 93 Z"
            fill={colors.baseFill}
          />
          {/* Base pedestal step 2 */}
          <rect x="34" y="81" width="32" height="5" rx="2.5" fill={colors.beamStroke} />

          {/* Pillar shaft */}
          <path
            d="M48 24 L48 81 L52 81 L52 24 Z"
            fill={colors.beamStroke}
          />

          {/* Pillar decorative rings */}
          <rect x="46" y="44" width="8" height="2.5" rx="1.2" fill={colors.accent} />
          <rect x="46" y="66" width="8" height="2.5" rx="1.2" fill={colors.accent} />

          {/* Pinnacle Diamond Finial at the Apex */}
          <path
            d="M50 8 L55.5 17 L50 24 L44.5 17 Z"
            fill={colors.beamStroke}
          />
          <circle cx="50" cy="16.5" r="2" fill={colors.accent} />
        </g>

        {/* Horizontal Balance Crossbeam */}
        <g filter="url(#scalesShadow)">
          {/* Crossbeam with elegant taper */}
          <path
            d="M16 28 C30 25, 45 23.5, 50 23.5 C55 23.5, 70 25, 84 28 C85 29.5, 83.5 31, 82 30.5 C70 27.5, 56 26.5, 50 26.5 C44 26.5, 30 27.5, 18 30.5 C16.5 31, 15 29.5, 16 28 Z"
            fill={colors.beamStroke}
          />

          {/* Center Pivot Pivot Knob */}
          <circle cx="50" cy="25" r="4.5" fill={colors.baseFill} stroke={colors.accent} strokeWidth="1.2" />
          <circle cx="50" cy="25" r="1.8" fill={colors.accent} />

          {/* Left end hook/loop */}
          <circle cx="18" cy="30" r="2.8" fill="none" stroke={colors.accent} strokeWidth="1.4" />
          {/* Right end hook/loop */}
          <circle cx="82" cy="30" r="2.8" fill="none" stroke={colors.accent} strokeWidth="1.4" />
        </g>

        {/* LEFT SCALE PAN & SUSPENSION CHAINS */}
        <g id="left-pan" filter="url(#scalesShadow)">
          {/* Left Suspension Lines / Chains */}
          <line x1="18" y1="32.5" x2="8" y2="54" stroke={colors.accent} strokeWidth="1.1" strokeDasharray="2 1.5" opacity="0.9" />
          <line x1="18" y1="32.5" x2="28" y2="54" stroke={colors.accent} strokeWidth="1.1" strokeDasharray="2 1.5" opacity="0.9" />
          <line x1="18" y1="32.5" x2="18" y2="55" stroke={colors.accent} strokeWidth="0.8" opacity="0.6" />

          {/* Left Pan (Bowl of Equity) */}
          <path
            d="M6 54 C6 64, 30 64, 30 54 C27 55.5, 9 55.5, 6 54 Z"
            fill={colors.panFill}
            stroke={colors.accent}
            strokeWidth="0.8"
          />
          {/* Inner rim highlight */}
          <ellipse cx="18" cy="54" rx="12" ry="1.8" fill={colors.accent} opacity="0.4" />
        </g>

        {/* RIGHT SCALE PAN & SUSPENSION CHAINS */}
        <g id="right-pan" filter="url(#scalesShadow)">
          {/* Right Suspension Lines / Chains */}
          <line x1="82" y1="32.5" x2="72" y2="54" stroke={colors.accent} strokeWidth="1.1" strokeDasharray="2 1.5" opacity="0.9" />
          <line x1="82" y1="32.5" x2="92" y2="54" stroke={colors.accent} strokeWidth="1.1" strokeDasharray="2 1.5" opacity="0.9" />
          <line x1="82" y1="32.5" x2="82" y2="55" stroke={colors.accent} strokeWidth="0.8" opacity="0.6" />

          {/* Right Pan (Bowl of Equity) */}
          <path
            d="M70 54 C70 64, 94 64, 94 54 C91 55.5, 73 55.5, 70 54 Z"
            fill={colors.panFill}
            stroke={colors.accent}
            strokeWidth="0.8"
          />
          {/* Inner rim highlight */}
          <ellipse cx="82" cy="54" rx="12" ry="1.8" fill={colors.accent} opacity="0.4" />
        </g>
      </svg>
    </div>
  );
};
