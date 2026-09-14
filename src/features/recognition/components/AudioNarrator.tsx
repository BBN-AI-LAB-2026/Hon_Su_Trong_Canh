import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  Slider,
  Stack,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import { useSpeech } from '../../../core/hooks/useSpeech';

interface AudioNarratorProps {
  narrationText: string;
  monumentTitle: string;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  narrationText,
  monumentTitle,
}) => {
  const { speak, pause, resume, stop, isPlaying, isPaused, isSupported } = useSpeech();
  const [speedRate, setSpeedRate] = useState<number>(0.95);

  const handlePlayToggle = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(narrationText, { rate: speedRate });
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleRateChange = (_: Event, newValue: number | number[]) => {
    const newRate = newValue as number;
    setSpeedRate(newRate);
    if (isPlaying) {
      speak(narrationText, { rate: newRate });
    }
  };

  return (
    <Card
      sx={{
        p: 2.5,
        mb: 3.5,
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%)',
        border: '1px solid #E5DEC9',
        boxShadow: '0 4px 16px rgba(139, 69, 19, 0.06)',
      }}
      id="card-audio-narrator"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VolumeUpIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              Thuyết Minh Giọng Đọc Lịch Sử
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Truyền cảm • Bản quyền Di Tích Việt • {monumentTitle}
            </Typography>
          </Box>
        </Box>

        {/* Audio Wave Visualizer Animation */}
        {isPlaying && !isPaused && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 24, px: 1.5 }}>
            {[40, 90, 60, 100, 75, 45, 80, 60].map((h, i) => (
              <Box
                key={i}
                sx={{
                  width: 3,
                  height: `${h}%`,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  animation: `pulseHeight 0.6s ease-in-out infinite alternate ${i * 0.1}s`,
                  '@keyframes pulseHeight': {
                    '0%': { height: '20%' },
                    '100%': { height: '100%' },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Quote / Transcript Display */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderLeft: '4px solid #8B4513',
          fontStyle: 'italic',
        }}
      >
        <Typography variant="body2" sx={{ color: '#3E342B', lineHeight: 1.7 }}>
          "{narrationText}"
        </Typography>
      </Box>

      {/* Playback Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            color={isPlaying && !isPaused ? 'secondary' : 'primary'}
            startIcon={isPlaying && !isPaused ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handlePlayToggle}
            sx={{ px: 2.5, fontWeight: 700 }}
            id="btn-play-narration"
          >
            {isPlaying && !isPaused ? 'Tạm Dừng' : isPaused ? 'Tiếp Tục' : 'Nghe Giọng Đọc'}
          </Button>

          {isPlaying && (
            <Tooltip title="Dừng phát">
              <IconButton onClick={handleStop} color="error" size="small" id="btn-stop-narration">
                <StopIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Speed Adjustment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 170 }}>
          <SpeedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
            {speedRate}x
          </Typography>
          <Slider
            size="small"
            value={speedRate}
            min={0.7}
            max={1.3}
            step={0.05}
            onChange={handleRateChange}
            sx={{ color: 'primary.main', width: 90 }}
            aria-label="Tốc độ đọc"
          />
        </Box>
      </Box>

      {!isSupported && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
          Trình duyệt của bạn không hỗ trợ tính năng Web Speech API tổng hợp giọng nói.
        </Typography>
      )}
    </Card>
  );
};
