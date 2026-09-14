import React from 'react';
import { Box } from '@mui/material';

interface ChronoGateVisualProps {
  status?: 'idle' | 'active' | 'success' | 'restoring';
  size?: number;
}

export const ChronoGateVisual: React.FC<ChronoGateVisualProps> = ({
  status = 'active',
  size = 180,
}) => {
  const isSuccess = status === 'success';
  const ringColor = isSuccess ? '#00E5FF' : '#D4AF37';
  const glowColor = isSuccess ? 'rgba(0, 229, 255, 0.45)' : 'rgba(212, 175, 55, 0.35)';

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 0 16px ${glowColor})`,
          transition: 'all 0.5s ease',
        }}
      >
        <defs>
          <linearGradient id="gateGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <radialGradient id="portalCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isSuccess ? '#E0F7FA' : '#FFF9E6'} stopOpacity="0.9" />
            <stop offset="40%" stopColor={isSuccess ? '#00E5FF' : '#D4AF37'} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0B192C" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Outer Tech Ring */}
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke={ringColor}
          strokeWidth="2"
          strokeDasharray="6 8"
          opacity="0.6"
        />

        {/* Concentric Heritage Ring with notches */}
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="url(#gateGrad)"
          strokeWidth="3.5"
          opacity="0.85"
        />

        {/* Trống Đồng Sun Ray Motif (Center Heritage Star) */}
        <path
          d="M100 35 L103 90 L158 90 L110 102 L132 150 L100 115 L68 150 L90 102 L42 90 L97 90 Z"
          fill="none"
          stroke={ringColor}
          strokeWidth="1.2"
          opacity="0.5"
        />

        {/* Portal Vortex Core */}
        <circle cx="100" cy="100" r="62" fill="url(#portalCore)" />

        {/* Orbital Quantum Nodes */}
        <circle cx="100" cy="20" r="5" fill="#00E5FF" />
        <circle cx="180" cy="100" r="5" fill="#D4AF37" />
        <circle cx="100" cy="180" r="5" fill="#00E5FF" />
        <circle cx="20" cy="100" r="5" fill="#D4AF37" />

        {/* Chrono Clock Hands (Symbol of Time Restoration) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="60"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2="132"
          y2="100"
          stroke="#00E5FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    </Box>
  );
};
