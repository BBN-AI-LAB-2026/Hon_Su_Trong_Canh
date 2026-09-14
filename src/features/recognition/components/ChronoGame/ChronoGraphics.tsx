import React from 'react';
import { Box } from '@mui/material';

/**
 * Crystalline Chrono Shard (Mảnh Thời Gian)
 */
export const ChronoShardGraphic: React.FC<{ size?: number; glow?: boolean }> = ({
  size = 32,
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: glow ? 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.65))' : 'none',
    }}
  >
    <defs>
      <linearGradient id="shardGrad1" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F7FA" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0288D1" />
      </linearGradient>
      <linearGradient id="facetGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Crystal Body */}
    <polygon points="24,4 40,16 34,44 14,44 8,16" fill="url(#shardGrad1)" stroke="#E0F7FA" strokeWidth="1.5" />
    {/* Front Facet */}
    <polygon points="24,4 24,44 14,44 8,16" fill="url(#facetGrad)" />
    <polygon points="24,14 34,22 24,34 14,22" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

/**
 * Huy hiệu "Người Gìn Giữ Lịch Sử" (Chronos Guardian Badge)
 * Sử dụng hình ảnh huy hiệu độc quyền Huy_Hieu.png
 */
export const ChronosBadgeGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className,
}) => {
  const [hasError, setHasError] = React.useState(false);

  if (!hasError) {
    return (
      <Box
        component="img"
        src="/Huy_Hieu.png"
        alt="Huy hiệu Người Gìn Giữ Lịch Sử"
        onError={() => setHasError(true)}
        className={className}
        sx={{
          width: size,
          height: size,
          maxWidth: '100%',
          objectFit: 'contain',
          filter:
            'drop-shadow(0 8px 24px rgba(212, 175, 55, 0.65)) drop-shadow(0 0 35px rgba(0, 229, 255, 0.35))',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.08) rotate(1deg)',
            filter:
              'drop-shadow(0 12px 32px rgba(212, 175, 55, 0.9)) drop-shadow(0 0 45px rgba(0, 229, 255, 0.6))',
          },
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 16px rgba(212, 175, 55, 0.45))' }}
    >
      <defs>
        <linearGradient id="goldMedal" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#C89D35" />
        </radialGradient>
      </defs>

      {/* Ribbon Tails */}
      <path d="M40 90 L32 118 L50 108 L60 118 L52 90 Z" fill="#8B0000" stroke="#AA7C11" strokeWidth="1.5" />
      <path d="M80 90 L88 118 L70 108 L60 118 L68 90 Z" fill="#B71C1C" stroke="#AA7C11" strokeWidth="1.5" />

      {/* Laurel Wreath */}
      <circle cx="60" cy="55" r="48" stroke="#D4AF37" strokeWidth="3" strokeDasharray="6 6" fill="none" opacity="0.75" />

      {/* Main Medallion */}
      <circle cx="60" cy="55" r="40" fill="url(#goldMedal)" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="60" cy="55" r="33" fill="#0B192C" stroke="#D4AF37" strokeWidth="1.5" />

      {/* Dong Son Star rays */}
      <path
        d="M60 28 L63 50 L85 50 L66 57 L74 78 L60 63 L46 78 L54 57 L35 50 L57 50 Z"
        fill="url(#sunCore)"
      />

      {/* Clock Chrono Hands */}
      <line x1="60" y1="55" x2="60" y2="38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="55" x2="72" y2="55" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="55" r="3.5" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
};

/**
 * Chrono Historian Guide Avatar (GS. Trần Sử)
 */
export const ChronoGuideAvatar: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      bgcolor: '#0B192C',
      border: '2px solid #D4AF37',
      boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#0B192C" />
      {/* Head */}
      <circle cx="32" cy="24" r="13" fill="#FAD0C4" />
      {/* Hair */}
      <path d="M19 23 C19 14 24 11 32 11 C40 11 45 14 45 23 C42 18 36 17 32 17 C26 17 21 19 19 23 Z" fill="#4A3728" />
      {/* Futuristic Chrono Glasses */}
      <rect x="22" y="21" width="9" height="6" rx="2" fill="none" stroke="#00E5FF" strokeWidth="1.5" />
      <rect x="33" y="21" width="9" height="6" rx="2" fill="none" stroke="#00E5FF" strokeWidth="1.5" />
      <line x1="31" y1="24" x2="33" y2="24" stroke="#00E5FF" strokeWidth="1.5" />
      {/* Friendly Smile */}
      <path d="M28 29 Q32 33 36 29" stroke="#3E2723" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Heritage Scholarly Robe */}
      <path d="M15 54 C15 42 22 38 32 38 C42 38 49 42 49 54 Z" fill="#1E3E62" />
      <path d="M30 38 L32 54 L34 38 Z" fill="#D4AF37" />
    </svg>
  </Box>
);
