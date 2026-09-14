import React from 'react';
import { Box } from '@mui/material';
import {
  SeamlessScrollRollEnd,
  DongSonFriezeMotif,
  AuspiciousCloudMotif,
} from '../../recognition/components/AncientParchmentTitleBanner';

interface AncientParchmentScrollProps {
  children: React.ReactNode;
}

export const AncientParchmentScroll: React.FC<AncientParchmentScrollProps> = ({ children }) => {
  return (
    <Box
      id="ancient-parchment-guide-scroll"
      sx={{
        position: 'relative',
        mx: 'auto',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 24px rgba(70, 36, 14, 0.16))',
      }}
    >
      {/* 1. Mép Cuộn Giấy Bên Trái */}
      <SeamlessScrollRollEnd position="left" />

      {/* 2. Thân Cuộn Thư Giấy Dó Cổ Truyền */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          background: `
            linear-gradient(180deg, #FAF4E8 0%, #F5E9CE 20%, #EFE1C3 75%, #E5CF9F 100%)
          `,
          borderTop: '1.5px solid #C4A470',
          borderBottom: '1.5px solid #B08E58',
          borderLeft: 'none',
          borderRight: 'none',
          boxShadow: `
            inset 14px 0 16px -6px rgba(90, 48, 18, 0.38),
            inset -14px 0 16px -6px rgba(90, 48, 18, 0.38),
            inset 0 8px 16px -6px rgba(160, 110, 50, 0.15),
            inset 0 -8px 16px -6px rgba(120, 80, 30, 0.22)
          `,
          py: { xs: 3, sm: 4, md: 4.5 },
          px: { xs: 2.2, sm: 3.8, md: 5.5 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 1,
            backgroundImage: `
              radial-gradient(#B88B4A 0.75px, transparent 0.75px),
              radial-gradient(#7C4E1E 0.6px, transparent 0.6px)
            `,
            backgroundSize: '24px 24px, 36px 36px',
            backgroundPosition: '0 0, 12px 18px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: { xs: 7, sm: 10 },
            bottom: { xs: 7, sm: 10 },
            left: { xs: 9, sm: 16 },
            right: { xs: 9, sm: 16 },
            border: '1px solid rgba(184, 134, 45, 0.45)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 2,
            boxShadow: 'inset 0 0 0 1.5px rgba(255, 248, 230, 0.35)',
          },
        }}
      >
        {/* Họa tiết lịch sử mờ chìm */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: -20, sm: 8, md: 24 },
            top: 80,
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <DongSonFriezeMotif size={135} color="#946626" opacity={0.22} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -20, sm: 8, md: 24 },
            top: 80,
            transform: 'scaleX(-1)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <DongSonFriezeMotif size={135} color="#946626" opacity={0.22} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 10, sm: 14 },
            left: { xs: 16, sm: 40, md: 70 },
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <AuspiciousCloudMotif width={72} height={30} color="#A87635" opacity={0.3} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 10, sm: 14 },
            right: { xs: 16, sm: 40, md: 70 },
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <AuspiciousCloudMotif width={72} height={30} color="#A87635" opacity={0.3} flip />
        </Box>

        {children}
      </Box>

      {/* 3. Mép Cuộn Giấy Bên Phải */}
      <SeamlessScrollRollEnd position="right" />
    </Box>
  );
};
