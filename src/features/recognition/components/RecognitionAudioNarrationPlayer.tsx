import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Button,
  Chip,
  Slider,
  Tooltip,
  Alert,
} from '@mui/material';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { audioNarrationService, MonumentAudioNarration } from '../services/audioNarrationService';
import { useAuth } from '../../../core/hooks/useAuth';

interface RecognitionAudioNarrationPlayerProps {
  monumentCode: string;
  monumentName: string;
}

export const RecognitionAudioNarrationPlayer: React.FC<RecognitionAudioNarrationPlayerProps> = ({
  monumentCode,
  monumentName,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const [narration, setNarration] = useState<MonumentAudioNarration | null>(() =>
    audioNarrationService.getAudioNarration(monumentCode)
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [loadError, setLoadError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setNarration(audioNarrationService.getAudioNarration(monumentCode));
    };
    window.addEventListener('ditich_audio_narrations_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_audio_narrations_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [monumentCode]);

  // Reset audio playback on monument change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [monumentCode, narration?.audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !narration?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoadError(false);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Lỗi phát audio thuyết minh:', err);
        setLoadError(true);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 2.5,
        bgcolor: '#FAF7F0',
        borderColor: '#E2D7C7',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(74, 37, 17, 0.04)',
      }}
      id="recognition-audio-narration-section"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'rgba(200, 157, 53, 0.15)',
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #C89D35',
            }}
          >
            <HeadphonesIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark', lineHeight: 1.2 }}>
              Đọc Thuyết Minh Di Tích
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Lắng nghe giới thiệu âm thanh về {monumentName}
            </Typography>
          </Box>
        </Box>

        {isAdmin && (
          <Button
            size="small"
            variant="text"
            color="secondary"
            startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/admin')}
            sx={{ fontSize: '0.75rem', fontWeight: 700 }}
          >
            Quản Trị Audio
          </Button>
        )}
      </Box>

      {narration?.audioUrl ? (
        <Box sx={{ mt: 1 }}>
          <audio
            ref={audioRef}
            src={narration.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setLoadError(true);
              setIsPlaying(false);
            }}
          />

          <Box sx={{ bgcolor: '#FFFFFF', p: 1.5, borderRadius: 1.5, border: '1px solid #E6DCCD' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ maxWidth: '75%' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {narration.title || `Bản đọc thuyết minh ${monumentName}`}
                </Typography>
                {narration.narrator && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Người đọc: {narration.narrator}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Tốc độ đọc">
                  <Chip
                    label={`${playbackRate}x`}
                    size="small"
                    onClick={cyclePlaybackRate}
                    sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  />
                </Tooltip>
                <Tooltip title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}>
                  <IconButton size="small" onClick={toggleMute}>
                    {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Scrubber & Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                color="secondary"
                onClick={togglePlay}
                id="btn-play-recognition-audio"
                sx={{
                  bgcolor: 'rgba(200, 157, 53, 0.15)',
                  '&:hover': { bgcolor: 'rgba(200, 157, 53, 0.25)' },
                  p: 1,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <Box sx={{ flexGrow: 1 }}>
                <Slider
                  size="small"
                  value={currentTime}
                  max={duration || 100}
                  onChange={handleSeek}
                  color="secondary"
                  sx={{ py: 0.5 }}
                />
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          {loadError && (
            <Alert severity="warning" sx={{ mt: 1, fontSize: '0.78rem', py: 0.5 }}>
              Không thể phát trực tiếp tệp âm thanh này. Bạn có thể{' '}
              <a href={narration.audioUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 700 }}>
                nhấn vào đây để mở trực tiếp
              </a>.
            </Alert>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            p: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: 1.5,
            border: '1px dashed #D5C8B4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            Bản đọc thuyết minh âm thanh sẽ được cập nhật bởi Quản trị viên qua <strong>Quản Trị Audio</strong> (nhập bằng đường dẫn link).
          </Typography>
          {isAdmin ? (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/admin')}
              sx={{ flexShrink: 0, fontSize: '0.72rem', fontWeight: 700 }}
            >
              Nhập Link Audio
            </Button>
          ) : (
            <Chip label="Chờ cập nhật" size="small" variant="outlined" sx={{ flexShrink: 0, height: 20, fontSize: '0.68rem', color: 'text.disabled' }} />
          )}
        </Box>
      )}
    </Card>
  );
};
