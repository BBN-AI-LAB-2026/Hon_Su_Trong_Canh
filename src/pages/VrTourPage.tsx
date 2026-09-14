import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { HeritageSeal } from '../core/components/HeritageSeal';
import { EmbeddedVrViewer } from '../features/vr-tour/components/EmbeddedVrViewer';

export const VrTourPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }} id="page-vr-tour">
      {/* Header Bar (Clean, Historical, Minimal Text) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          pb: 1.5,
          borderBottom: '1px solid #E2D7C7',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HeritageSeal text="VR 360" subtext="TOÀN CẢNH" size="medium" />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                color: 'primary.dark',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Không Gian VR 360°
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Khám phá thực tế ảo di tích lịch sử • Liên kết do Quản trị viên quản lý
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Embedded VR Viewer (No mock sample data, standby for admin embeds) */}
      <EmbeddedVrViewer />
    </Container>
  );
};
