import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ChronoGateVisual } from './ChronoGateVisual';
import { ChronoShardGraphic } from './ChronoGraphics';
import { chronoSoundService } from '../../services/chronoSoundService';

interface ChronoWelcomeViewProps {
  monumentName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onStart: () => void;
}

export const ChronoWelcomeView: React.FC<ChronoWelcomeViewProps> = ({
  monumentName,
  isMuted,
  onToggleMute,
  onStart,
}) => {
  return (
    <Box
      sx={{
        minHeight: 460,
        p: { xs: 3, sm: 4.5 },
        bgcolor: '#0B192C',
        color: '#F8FAFC',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, #1E3E62 0%, #0B192C 75%, #050C16 100%)',
      }}
    >
      {/* Sound Toggle Button (Top Right) */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Tooltip title={isMuted ? 'Bật âm thanh tương tác' : 'Tắt âm thanh'}>
          <IconButton
            onClick={onToggleMute}
            sx={{
              color: isMuted ? 'rgba(255,255,255,0.4)' : '#00E5FF',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.15)' },
            }}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 2.5D Chrono Gate Visual */}
      <Box sx={{ mb: 2.5 }}>
        <ChronoGateVisual size={160} status="active" />
      </Box>

      {/* Game Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ChronoShardGraphic size={24} />
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: '#00E5FF',
            fontWeight: 800,
          }}
        >
          Chiến Dịch Khôi Phục Dòng Thời Gian
        </Typography>
        <ChronoShardGraphic size={24} />
      </Box>

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: '"Cinzel", "Be Vietnam Pro", serif',
          fontWeight: 900,
          color: '#D4AF37',
          mb: 1.5,
          textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
          fontSize: { xs: '1.6rem', sm: '2.2rem' },
        }}
      >
        {monumentName}
      </Typography>

      {/* Context & Big Goal */}
      <Box
        sx={{
          maxWidth: 620,
          mb: 2.5,
          p: 2,
          borderRadius: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.88)', lineHeight: 1.6, mb: 1 }}>
          <strong>Bối cảnh:</strong> Một dị thường lượng tử vừa làm đảo lộn các mốc lịch sử của di tích <strong>{monumentName}</strong>. Các sự kiện bị tách rời khỏi dòng chảy thời gian.
        </Typography>
        <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600 }}>
          <strong>Mục tiêu:</strong> Đặt các sự kiện lịch sử về đúng tọa độ thời gian để tái cấu trúc dòng lịch sử, thu thập Mảnh Thời Gian và kích hoạt Cổng Thời Gian Di Sản!
        </Typography>
      </Box>

      {/* Instructions (Tối đa 3 dòng theo quy chuẩn) */}
      <Box
        sx={{
          maxWidth: 580,
          mb: 3.5,
          textAlign: 'left',
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          p: 2,
          borderRadius: '8px',
          borderLeft: '3px solid #00E5FF',
        }}
      >
        <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 800, display: 'block', mb: 0.8 }}>
          LỘ TRÌNH THỬ THÁCH KHÔI PHỤC DÒNG THỜI GIAN:
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, mb: 0.5 }}>
          <strong>Chặng 1 - Ghép Nối Mốc Lịch Sử:</strong> Kết nối và ghép các thẻ sự kiện lịch sử vào đúng tọa độ niên đại để thu thập Mảnh Thời Gian.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
          <strong>Chặng 2 - Hoàn Thiện Niên Biểu:</strong> Tái cấu trúc và hoàn thiện trật tự liên tục của dòng thời gian để nhận chứng nhận Người Gìn Giữ Lịch Sử.
        </Typography>
      </Box>

      {/* Start Button */}
      <Button
        variant="contained"
        size="large"
        startIcon={<PlayArrowIcon sx={{ fontSize: 24 }} />}
        onClick={() => {
          chronoSoundService.playClick();
          chronoSoundService.playGateOpen();
          onStart();
        }}
        id="btn-start-chrono-game"
        sx={{
          py: 1.4,
          px: 4.5,
          fontWeight: 900,
          fontSize: '1.05rem',
          letterSpacing: '0.08em',
          color: '#0B192C',
          bgcolor: '#D4AF37',
          borderRadius: '24px',
          boxShadow: '0 0 24px rgba(212, 175, 55, 0.5)',
          '&:hover': {
            bgcolor: '#F3C623',
            boxShadow: '0 0 32px rgba(243, 198, 35, 0.75)',
            transform: 'scale(1.03)',
          },
          transition: 'all 0.25s ease',
        }}
      >
        BẮT ĐẦU CHIẾN DỊCH
      </Button>
    </Box>
  );
};
