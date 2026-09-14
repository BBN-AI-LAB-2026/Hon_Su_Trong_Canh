import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import TimelineIcon from '@mui/icons-material/Timeline';
import { TimelineEventItem } from '../../data/heritageTimelineEvents';
import { ChronosBadgeGraphic, ChronoShardGraphic } from './ChronoGraphics';
import { chronoSoundService } from '../../services/chronoSoundService';

interface ChronoAchievementViewProps {
  monumentName: string;
  events: TimelineEventItem[];
  stats: { score: number; shards: number; maxStreak: number };
  onReview?: () => void;
  onReplay: () => void;
  onNext?: () => void;
}

export const ChronoAchievementView: React.FC<ChronoAchievementViewProps> = ({
  monumentName,
  events,
  stats,
  onReview,
  onReplay,
  onNext,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4.5 },
        bgcolor: '#0B192C',
        color: '#F8FAFC',
        borderRadius: '12px',
        border: '2px solid #D4AF37',
        boxShadow: '0 8px 36px rgba(0, 0, 0, 0.55)',
        position: 'relative',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, #1A3960 0%, #0B192C 75%, #050B14 100%)',
      }}
    >
      {/* Guardian Medallion Badge */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ChronosBadgeGraphic size={150} />
      </Box>

      <Typography
        variant="caption"
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: '#00E5FF',
          fontWeight: 800,
          display: 'block',
          mb: 0.5,
        }}
      >
        DANH HIỆU CAO QUÝ ĐƯỢC CHỨNG NHẬN
      </Typography>

      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontFamily: '"Cinzel", "Be Vietnam Pro", serif',
          fontWeight: 900,
          color: '#D4AF37',
          mb: 1,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
        }}
      >
        NGƯỜI GÌN GIỮ LỊCH SỬ
      </Typography>

      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 580, mx: 'auto', mb: 3 }}>
        Bạn đã xuất sắc khôi phục toàn bộ các tọa độ thời gian bị đứt gãy, đưa di tích <strong>{monumentName}</strong> trở lại trật tự lịch sử nguyên bản!
      </Typography>

      {/* Stats Summary Bento-Grid with interactive hover highlight */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
          maxWidth: 680,
          mx: 'auto',
          mb: 3.5,
        }}
      >
        <Box
          sx={{
            p: 1.6,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              borderColor: '#00E5FF',
              boxShadow: '0 8px 24px rgba(0, 229, 255, 0.35)',
            },
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', whiteSpace: 'nowrap' }}>
            MỐC ĐÃ KHÔI PHỤC
          </Typography>
          <Typography variant="h5" sx={{ color: '#00E5FF', fontWeight: 900, mt: 0.3 }}>
            {events.length} / {events.length}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.6,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              borderColor: '#00E5FF',
              boxShadow: '0 8px 24px rgba(0, 229, 255, 0.35)',
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 700,
              display: 'block',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.64rem', sm: '0.74rem' },
            }}
          >
            CHUỖI ĐÚNG CAO NHẤT
          </Typography>
          <Typography variant="h5" sx={{ color: '#FFD54F', fontWeight: 900, mt: 0.3 }}>
            🔥{stats.maxStreak}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.6,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              borderColor: '#00E5FF',
              boxShadow: '0 8px 24px rgba(0, 229, 255, 0.35)',
            },
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', whiteSpace: 'nowrap' }}>
            MẢNH THỜI GIAN
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.3 }}>
            <ChronoShardGraphic size={20} glow={false} />
            <Typography variant="h5" sx={{ color: '#00E5FF', fontWeight: 900 }}>
              {stats.shards}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 1.6,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              borderColor: '#00E5FF',
              boxShadow: '0 8px 24px rgba(0, 229, 255, 0.35)',
            },
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', whiteSpace: 'nowrap' }}>
            TỔNG ĐIỂM DI SẢN
          </Typography>
          <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 900, mt: 0.3 }}>
            {stats.score}
          </Typography>
        </Box>
      </Box>

      {/* Chronological Archive / Review knowledge */}
      <Box
        sx={{
          textAlign: 'left',
          maxWidth: 720,
          mx: 'auto',
          mb: 3.5,
          p: 2.2,
          borderRadius: '10px',
          bgcolor: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            borderColor: '#00E5FF',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TimelineIcon sx={{ color: '#00E5FF' }} />
          <Typography variant="subtitle1" sx={{ color: '#00E5FF', fontWeight: 800 }}>
            Biên Niên Sử Di Tích
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {events.map((ev) => (
            <Box
              key={ev.id}
              sx={{
                p: 1.5,
                borderRadius: '8px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderLeft: '4px solid #D4AF37',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  borderLeftColor: '#00E5FF',
                  borderColor: 'rgba(0, 229, 255, 0.4)',
                  transform: 'translateX(6px)',
                  boxShadow: '0 4px 20px rgba(0, 229, 255, 0.25)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                <Chip
                  label={ev.time}
                  size="small"
                  sx={{
                    bgcolor: '#D4AF37',
                    color: '#0B192C',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    height: 22,
                  }}
                />
                <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                  {ev.event}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', pl: 0.5, lineHeight: 1.5 }}>
                💡 {ev.explanation}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Action Buttons: Chơi lại Chiến Dịch */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={() => {
            chronoSoundService.playClick();
            onReplay();
          }}
          sx={{
            borderColor: 'rgba(212, 175, 55, 0.5)',
            color: '#FFD54F',
            fontWeight: 800,
            borderRadius: '20px',
            px: 3.5,
            py: 1,
            '&:hover': {
              borderColor: '#D4AF37',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              boxShadow: '0 0 16px rgba(212, 175, 55, 0.3)',
            },
          }}
        >
          Chơi Lại Chiến Dịch
        </Button>
      </Box>
    </Box>
  );
};
