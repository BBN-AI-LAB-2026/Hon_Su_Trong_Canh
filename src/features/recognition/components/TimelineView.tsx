import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Milestone } from '../types';

interface TimelineViewProps {
  milestones: Milestone[];
  monumentName: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ milestones, monumentName }) => {
  return (
    <Box sx={{ my: 3.5 }} id="timeline-monument-view">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
        <AccessTimeFilledIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Dòng Thời Gian Lịch Sử — {monumentName}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', pl: { xs: 3, sm: 4 } }}>
        {/* Continuous vertical timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 11, sm: 15 },
            top: 12,
            bottom: 12,
            width: 3,
            bgcolor: 'primary.light',
            opacity: 0.35,
            borderRadius: 1.5,
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {milestones.map((item, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              {/* Timeline marker node */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: -24, sm: -28 },
                  top: 6,
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 0 0 2px #8B4513',
                  zIndex: 2,
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2.5,
                  border: '1px solid #EBE6DE',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: 'secondary.dark',
                      bgcolor: 'rgba(212, 175, 55, 0.15)',
                      px: 1.2,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: '0.85rem',
                    }}
                  >
                    Năm {item.year}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
