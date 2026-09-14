import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Chip, Alert, Fade } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { TimelineEventItem } from '../../data/heritageTimelineEvents';
import { ChronoGuideAvatar } from './ChronoGraphics';
import { ChronoGateVisual } from './ChronoGateVisual';
import { chronoSoundService } from '../../services/chronoSoundService';

interface ChronoFinalChallengeViewProps {
  monumentName: string;
  correctEvents: TimelineEventItem[]; // In canonical chronological order
  stats: { score: number; shards: number; maxStreak: number };
  onCompleteFinal: (finalStats: { score: number; shards: number; maxStreak: number }) => void;
}

// Helper to shuffle for the challenge
function createJumbledList(list: TimelineEventItem[]): TimelineEventItem[] {
  if (list.length <= 1) return list;
  // If list has 3 or 4, reverse or swap first two to guarantee not already in order
  const copy = [...list];
  copy.reverse();
  return copy;
}

export const ChronoFinalChallengeView: React.FC<ChronoFinalChallengeViewProps> = ({
  monumentName,
  correctEvents,
  stats,
  onCompleteFinal,
}) => {
  const [currentOrder, setCurrentOrder] = useState<TimelineEventItem[]>(() =>
    createJumbledList(correctEvents)
  );
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);

  // Move item up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    chronoSoundService.playClick();
    const next = [...currentOrder];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setCurrentOrder(next);
    setIsWrong(false);
  };

  // Move item down
  const handleMoveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    chronoSoundService.playClick();
    const next = [...currentOrder];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setCurrentOrder(next);
    setIsWrong(false);
  };

  // Check chronological order
  const handleVerifyAlignment = () => {
    chronoSoundService.playClick();
    const isCorrect = currentOrder.every((item, idx) => item.id === correctEvents[idx].id);

    if (isCorrect) {
      setIsLocking(true);
      chronoSoundService.playGateOpen();
      setTimeout(() => {
        chronoSoundService.playVictory();
        onCompleteFinal({
          score: stats.score + 200,
          shards: stats.shards + 1,
          maxStreak: stats.maxStreak + 1,
        });
      }, 700);
    } else {
      chronoSoundService.playWrong();
      setIsWrong(true);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        bgcolor: '#0B192C',
        color: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 10%, #17365D 0%, #0B192C 80%)',
      }}
    >
      {/* Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <ChronoGuideAvatar size={48} />
        <Box>
          <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 800, letterSpacing: '0.1em' }}>
            THỬ THÁCH CUỐI • ĐỒNG BỘ HÓA DÒNG THỜI GIAN TOÀN CẢNH
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFD54F', fontWeight: 800, lineHeight: 1.2 }}>
            Khóa Vĩnh Viễn Dòng Lịch Sử: {monumentName}
          </Typography>
        </Box>
      </Box>

      {/* Guide Note */}
      <Box
        sx={{
          mb: 2.5,
          p: 1.6,
          borderRadius: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.9)', lineHeight: 1.5 }}>
          <strong>Nhiệm vụ cuối cùng:</strong> Dùng các nút mũi tên <strong>▲ / ▼</strong> để sắp xếp chuỗi các sự kiện theo đúng <strong>tiến trình thời gian từ xưa đến nay</strong> nhằm cố định dòng thời gian của di tích.
        </Typography>
      </Box>

      {/* Error Feedback */}
      {isWrong && (
        <Fade in={isWrong}>
          <Alert
            severity="warning"
            sx={{
              mb: 2.5,
              bgcolor: 'rgba(255, 152, 0, 0.15)',
              color: '#FFE082',
              border: '1px solid #FFB74D',
              fontWeight: 600,
            }}
          >
            Trật tự các mốc thời gian chưa đúng tiến trình lịch sử. Hãy xem kỹ các mốc năm/tháng để điều chỉnh nhé!
          </Alert>
        </Fade>
      )}

      {/* Re-orderable Event List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, mb: 3 }}>
        {currentOrder.map((item, index) => {
          return (
            <Box
              key={item.id}
              sx={{
                p: 1.8,
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              {/* Left Order Index & Content */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: '#00E5FF',
                    color: '#0B192C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Box>
                  <Chip
                    label={item.time}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(212, 175, 55, 0.2)',
                      color: '#FFD54F',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      height: 22,
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 700, lineHeight: 1.4 }}>
                    {item.event}
                  </Typography>
                </Box>
              </Box>

              {/* Up/Down Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <IconButton
                  size="small"
                  disabled={index === 0 || isLocking}
                  onClick={() => handleMoveUp(index)}
                  sx={{
                    color: index === 0 ? 'rgba(255,255,255,0.2)' : '#00E5FF',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    p: 0.6,
                    '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.25)' },
                  }}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === currentOrder.length - 1 || isLocking}
                  onClick={() => handleMoveDown(index)}
                  sx={{
                    color: index === currentOrder.length - 1 ? 'rgba(255,255,255,0.2)' : '#00E5FF',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    p: 0.6,
                    '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.25)' },
                  }}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Lock Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disabled={isLocking}
          startIcon={isLocking ? <LockIcon /> : <LockOpenIcon />}
          onClick={handleVerifyAlignment}
          sx={{
            py: 1.4,
            px: 4.5,
            fontWeight: 900,
            fontSize: '1rem',
            color: '#0B192C',
            bgcolor: '#D4AF37',
            borderRadius: '24px',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
            '&:hover': {
              bgcolor: '#FFD54F',
              boxShadow: '0 0 28px rgba(255, 213, 79, 0.7)',
            },
          }}
        >
          {isLocking ? 'ĐANG KHÓA CỔNG THỜI GIAN...' : 'KÍCH HOẠT ĐỒNG BỘ DÒNG THỜI GIAN'}
        </Button>
      </Box>
    </Box>
  );
};
