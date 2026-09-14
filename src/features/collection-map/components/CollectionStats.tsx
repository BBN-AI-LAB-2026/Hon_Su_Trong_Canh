import React from 'react';
import { Box, Card, Typography, LinearProgress, Chip } from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { CollectionStatsData } from '../types';

interface CollectionStatsProps {
  stats: CollectionStatsData;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => {
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        mb: 3.5,
        border: '1px solid #EBE6DE',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8F5 100%)',
      }}
      id="collection-stats-card"
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { md: 'center' } }}>
        {/* Progress & Badge */}
        <Box sx={{ width: { xs: '100%', md: '58%' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(212, 175, 55, 0.15)',
                color: '#AA820A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MilitaryTechIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  Bộ Sưu Tập Di Tích Cá Nhân
                </Typography>
                <Chip
                  label={stats.badge.title}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(139, 69, 19, 0.1)',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Đã mở khóa {stats.discoveredCount}/{stats.totalMonuments} di tích lịch sử trọng điểm Việt Nam
              </Typography>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Tiến độ khám phá
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {stats.discoveryPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.discoveryPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#EBE6DE',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #8B4513 0%, #D4AF37 100%)',
                  borderRadius: 5,
                },
              }}
            />
          </Box>
        </Box>

        {/* Region Breakdown pills */}
        <Box sx={{ width: { xs: '100%', md: '42%' } }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid #EBE6DE',
                textAlign: 'center',
                minWidth: 85,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                Miền Bắc
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {stats.regionBreakdown.bac.discovered}/{stats.regionBreakdown.bac.total}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid #EBE6DE',
                textAlign: 'center',
                minWidth: 85,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                Miền Trung
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.dark' }}>
                {stats.regionBreakdown.trung.discovered}/{stats.regionBreakdown.trung.total}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid #EBE6DE',
                textAlign: 'center',
                minWidth: 85,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                Miền Nam
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.main' }}>
                {stats.regionBreakdown.nam.discovered}/{stats.regionBreakdown.nam.total}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
