import React from 'react';
import { Box } from '@mui/material';
import { HeritageCornerOrnament } from './HeritageMotifs';

interface HeritageCornerFrameProps {
  children: React.ReactNode;
  sx?: object;
  className?: string;
  showOrnaments?: boolean;
  id?: string;
}

export const HeritageCornerFrame: React.FC<HeritageCornerFrameProps> = ({
  children,
  sx,
  className,
  showOrnaments = true,
  id,
}) => {
  return (
    <Box
      id={id}
      className={className}
      sx={{
        position: 'relative',
        border: '1.5px solid #D6C3A8',
        bgcolor: '#FCFAF5',
        p: { xs: 2, sm: 3 },
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(59, 32, 16, 0.06), 0 1px 3px rgba(59, 32, 16, 0.04)',
        backgroundImage: 'linear-gradient(180deg, #FDFCF9 0%, #FAF6ED 100%)',
        // Classical inner fine line
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 6,
          left: 6,
          right: 6,
          bottom: 6,
          border: '1px solid rgba(197, 155, 39, 0.35)',
          pointerEvents: 'none',
          borderRadius: '4px',
        },
        ...sx,
      }}
    >
      {showOrnaments && (
        <>
          <HeritageCornerOrnament position="top-left" size={26} color="#C59B27" accentColor="#8E201B" />
          <HeritageCornerOrnament position="top-right" size={26} color="#C59B27" accentColor="#8E201B" />
          <HeritageCornerOrnament position="bottom-left" size={26} color="#C59B27" accentColor="#8E201B" />
          <HeritageCornerOrnament position="bottom-right" size={26} color="#C59B27" accentColor="#8E201B" />
        </>
      )}
      {children}
    </Box>
  );
};

