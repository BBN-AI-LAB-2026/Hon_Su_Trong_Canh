import React from 'react';
import { Box } from '@mui/material';
import { HOME_ANIMATED_BANNER_SRC } from '../constants/homeConstants';

export const AntiqueFramedAnimatedBanner: React.FC = () => {
  return (
    <Box
      id="home-antique-animated-frame"
      sx={{
        position: 'absolute',
        left: {
          xs: '50%',
          sm: '50%',
          md: '50%',
          lg: 'calc(50% + 460px)',
          xl: 'calc(50% + 500px)',
        },
        top: {
          xs: '77%',
          sm: '90%',
          md: '68%',
          lg: '45%',
          xl: '45%',
        },
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        maxWidth: { xs: '85vw', sm: '320px', md: '340px' },
        width: {
          xs: '210px',
          sm: '250px',
          md: '270px',
          lg: '290px',
          xl: '310px',
        },
        pointerEvents: 'auto',
        transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
        filter: 'drop-shadow(0 12px 28px rgba(35, 15, 8, 0.45))',
        '&:hover': {
          transform: 'translate(-50%, calc(-50% - 4px)) scale(1.02)',
          filter: 'drop-shadow(0 18px 36px rgba(120, 30, 20, 0.4))',
          '& .antique-inner-border': {
            borderColor: '#F3E1A9',
            boxShadow: '0 0 14px rgba(212, 175, 55, 0.5), inset 0 0 10px rgba(212, 175, 55, 0.25)',
          },
        },
      }}
    >
      <Box
        component="img"
        src={HOME_ANIMATED_BANNER_SRC}
        alt="Di tích lịch sử - Bức họa động cổ kính"
        loading="eager"
        referrerPolicy="no-referrer"
        sx={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: '2px',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.4)',
        }}
      />
    </Box>
  );
};
