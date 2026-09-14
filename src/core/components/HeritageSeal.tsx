import React from 'react';
import { Box, Typography } from '@mui/material';

interface HeritageSealProps {
  text?: string;
  subtext?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle';
}

export const HeritageSeal: React.FC<HeritageSealProps> = ({
  text = 'DI TÍCH',
  subtext = 'QUỐC GIA',
  size = 'medium',
  shape = 'square',
}) => {
  const isCircle = shape === 'circle';
  const sizePx = size === 'small' ? 44 : size === 'large' ? 72 : 56;
  const fontSize = size === 'small' ? '0.65rem' : size === 'large' ? '0.95rem' : '0.78rem';
  const subFontSize = size === 'small' ? '0.5rem' : size === 'large' ? '0.7rem' : '0.6rem';

  return (
    <Box
      sx={{
        width: sizePx,
        height: sizePx,
        border: '2.5px solid #991B1B',
        borderRadius: isCircle ? '50%' : '4px',
        bgcolor: 'rgba(153, 27, 27, 0.05)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0.5,
        boxShadow: 'inset 0 0 0 1px rgba(153, 27, 27, 0.25)',
        userSelect: 'none',
        flexShrink: 0,
      }}
      title={`${text} ${subtext}`}
    >
      <Typography
        sx={{
          fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
          fontWeight: 900,
          color: '#991B1B',
          lineHeight: 1.1,
          fontSize,
          letterSpacing: '0.04em',
          textAlign: 'center',
        }}
      >
        {text}
      </Typography>
      {subtext && (
        <Typography
          sx={{
            fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            color: '#991B1B',
            lineHeight: 1,
            fontSize: subFontSize,
            letterSpacing: '0.05em',
            mt: 0.2,
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          {subtext}
        </Typography>
      )}
    </Box>
  );
};
