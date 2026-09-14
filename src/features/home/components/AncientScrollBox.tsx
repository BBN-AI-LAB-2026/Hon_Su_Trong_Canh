import React from 'react';
import { Box, Typography } from '@mui/material';
import { ScrollBoxItem } from '../types';

export const AncientScrollBox: React.FC<ScrollBoxItem> = ({
  id,
  title,
  desc,
  icon,
  onClick,
}) => {
  return (
    <Box
      id={id}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        minHeight: { xs: 84, sm: 92, md: 102, lg: 106 },
        filter: 'drop-shadow(0 5px 14px rgba(70, 36, 14, 0.16))',
        transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)',
          filter: 'drop-shadow(0 10px 22px rgba(118, 22, 18, 0.26))',
          '& .scroll-body': {
            borderColor: '#B08E58',
            backgroundImage: `
              linear-gradient(180deg, #FFFDF8 0%, #FAF0DE 30%, #F5E4C3 80%, #ECD6A8 100%)
            `,
            boxShadow: `
              inset 8px 0 12px -5px rgba(90, 48, 18, 0.3),
              inset -8px 0 12px -5px rgba(90, 48, 18, 0.3),
              0 8px 20px rgba(120, 30, 20, 0.16)
            `,
          },
          '& .scroll-rod': {
            filter: 'brightness(1.12) drop-shadow(0 3px 6px rgba(90, 30, 15, 0.35))',
          },
          '& .scroll-icon-ring': {
            transform: 'scale(1.1) rotate(4deg)',
            borderColor: '#9E241E',
            backgroundColor: '#7A1F1D',
            color: '#FFF9EE',
            boxShadow: '0 4px 12px rgba(122, 31, 29, 0.35)',
          },
          '& .scroll-title': {
            color: '#9E241E',
          },
        },
        '&:active': {
          transform: 'translateY(-2px) scale(1)',
        },
      }}
    >
      {/* Trục cuộn mép trái (Left Scroll Rod / Rolled Edge) */}
      <Box
        className="scroll-rod"
        sx={{
          width: { xs: 12, sm: 14 },
          flexShrink: 0,
          position: 'relative',
          my: -0.8,
          zIndex: 2,
          borderRadius: '4px 0 0 4px',
          background: `linear-gradient(90deg, 
            #6F4522 0%, 
            #A27541 12%, 
            #E3C89B 35%, 
            #FFF4DE 58%, 
            #D5B685 82%, 
            #8D5D2E 95%, 
            #503013 100%)`,
          borderTop: '1.5px solid #A8814D',
          borderBottom: '1.5px solid #A8814D',
          borderLeft: '1.5px solid #6E4420',
          boxShadow:
            'inset 1.5px 0 3px rgba(255, 255, 255, 0.4), inset -2px 0 4px rgba(60, 30, 10, 0.55), -2px 2px 5px rgba(60, 30, 10, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          '&::before, &::after': {
            content: '""',
            display: 'block',
            width: { xs: 15, sm: 17 },
            height: 7,
            borderRadius: '2px',
            background:
              'linear-gradient(90deg, #381A0B 0%, #7E451F 45%, #C2914F 60%, #35170A 100%)',
            border: '1px solid #D4AF37',
            boxShadow: '0 2px 4px rgba(40, 18, 8, 0.45)',
          },
        }}
      />

      {/* Thân cuộn giấy dó (Parchment Body) */}
      <Box
        className="scroll-body"
        sx={{
          flexGrow: 1,
          position: 'relative',
          mx: '-2px',
          py: { xs: 0.9, sm: 1.1, md: 1.25 },
          px: { xs: 0.7, sm: 0.9, md: 1.1 },
          background: `
            linear-gradient(180deg, #FAF4E8 0%, #F5E9CE 25%, #EFE1C3 75%, #E5CF9F 100%)
          `,
          borderTop: '1.5px solid #C4A470',
          borderBottom: '1.5px solid #B08E58',
          boxShadow: `
            inset 8px 0 10px -4px rgba(90, 48, 18, 0.35),
            inset -8px 0 10px -4px rgba(90, 48, 18, 0.35),
            inset 0 3px 6px -2px rgba(160, 110, 50, 0.15),
            inset 0 -3px 6px -2px rgba(120, 80, 30, 0.22)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: 5,
            right: 5,
            border: '1px solid rgba(184, 134, 45, 0.38)',
            borderRadius: '2px',
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(255, 248, 230, 0.3)',
          },
        }}
      >
        {/* Nếp gấp chỉ góc giấy cổ */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: 5,
            width: 6,
            height: 6,
            borderTop: '1.5px solid #C59B27',
            borderLeft: '1.5px solid #C59B27',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 5,
            width: 6,
            height: 6,
            borderTop: '1.5px solid #C59B27',
            borderRight: '1.5px solid #C59B27',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            left: 5,
            width: 6,
            height: 6,
            borderBottom: '1.5px solid #C59B27',
            borderLeft: '1.5px solid #C59B27',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 5,
            width: 6,
            height: 6,
            borderBottom: '1.5px solid #C59B27',
            borderRight: '1.5px solid #C59B27',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Icon trong vòng tròn viền đỏ nâu */}
        <Box
          className="scroll-icon-ring"
          sx={{
            width: { xs: 28, sm: 32, md: 34 },
            height: { xs: 28, sm: 32, md: 34 },
            borderRadius: '50%',
            backgroundColor: 'rgba(122, 31, 29, 0.08)',
            border: '1.5px solid #7A1F1D',
            color: '#7A1F1D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 0.35, sm: 0.45 },
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(122, 31, 29, 0.12)',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {icon}
        </Box>

        {/* Tiêu đề box */}
        <Typography
          className="scroll-title"
          variant="subtitle1"
          sx={{
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '0.78rem', sm: '0.82rem', md: '0.84rem', lg: '0.88rem' },
            color: '#7A1F1D',
            lineHeight: 1.2,
            mb: 0.25,
            letterSpacing: '0.01em',
            textShadow: '0 1px 1px rgba(255, 252, 245, 0.95), 0 2px 4px rgba(90, 30, 15, 0.08)',
            transition: 'color 0.25s ease',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {title}
        </Typography>

        {/* Mô tả box */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontSize: { xs: '0.64rem', sm: '0.67rem', md: '0.68rem', lg: '0.72rem' },
            color: '#5C1D17',
            lineHeight: 1.22,
            fontWeight: 500,
            maxWidth: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {desc}
        </Typography>
      </Box>

      {/* Trục cuộn mép phải (Right Scroll Rod / Rolled Edge) */}
      <Box
        className="scroll-rod"
        sx={{
          width: { xs: 12, sm: 14 },
          flexShrink: 0,
          position: 'relative',
          my: -0.8,
          zIndex: 2,
          borderRadius: '0 4px 4px 0',
          background: `linear-gradient(90deg, 
            #503013 0%, 
            #8D5D2E 5%, 
            #D5B685 18%, 
            #FFF4DE 42%, 
            #E3C89B 65%, 
            #A27541 88%, 
            #6F4522 100%)`,
          borderTop: '1.5px solid #A8814D',
          borderBottom: '1.5px solid #A8814D',
          borderRight: '1.5px solid #6E4420',
          boxShadow:
            'inset -1.5px 0 3px rgba(255, 255, 255, 0.4), inset 2px 0 4px rgba(60, 30, 10, 0.55), 2px 2px 5px rgba(60, 30, 10, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          '&::before, &::after': {
            content: '""',
            display: 'block',
            width: { xs: 15, sm: 17 },
            height: 7,
            borderRadius: '2px',
            background:
              'linear-gradient(90deg, #35170A 0%, #C2914F 40%, #7E451F 55%, #381A0B 100%)',
            border: '1px solid #D4AF37',
            boxShadow: '0 2px 4px rgba(40, 18, 8, 0.45)',
          },
        }}
      />
    </Box>
  );
};
