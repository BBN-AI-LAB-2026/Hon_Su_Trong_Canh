import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Tooltip,
  Slider,
  IconButton,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import StopIcon from '@mui/icons-material/Stop';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { SupportedLanguage } from '../../admin/types';

interface HeritageAudioPlayerProps {
  language: SupportedLanguage;
  audioUrl?: string;
  fullStoryToSpeak: string;
}

export const HeritageAudioPlayer: React.FC<HeritageAudioPlayerProps> = ({
  language,
  audioUrl,
  fullStoryToSpeak,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [loadError, setLoadError] = useState(false);

  const speechKeepAliveRef = useRef<NodeJS.Timeout | null>(null);
  const cancelSpeechRef = useRef<boolean>(false);

  const stopAllAudio = () => {
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    cancelSpeechRef.current = true;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTTS(false);
  };

  useEffect(() => {
    stopAllAudio();
    setCurrentTime(0);
    setLoadError(false);
    return () => {
      stopAllAudio();
    };
  }, [language, audioUrl]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleCloudinaryAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    }

    if (!audioRef.current || !audioUrl) {
      alert('Không tìm thấy tệp âm thanh thuyết minh Cloudinary cho di tích này.');
      return;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      setLoadError(false);
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setLoadError(true);
          setIsPlayingAudio(false);
        });
    }
  };

  const handleToggleSpeechTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ phát giọng nói (Speech Synthesis).');
      return;
    }

    if (isPlayingTTS) {
      stopAllAudio();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    window.speechSynthesis.cancel();
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    cancelSpeechRef.current = false;

    if (!fullStoryToSpeak.trim()) return;

    const isZh = language === 'zh';
    const targetLang = isZh ? 'zh-CN' : 'en-US';

    const sentenceDelimiters = isZh ? /(?<=[。！？；\n])\s*/ : /(?<=[.!?])\s+/;
    const sentences = fullStoryToSpeak
      .split(sentenceDelimiters)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) return;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = isZh
      ? voices.find((v) => v.lang.startsWith('zh') && (v.name.includes('Google') || v.name.includes('Natural') || v.default)) ||
        voices.find((v) => v.lang.startsWith('zh'))
      : voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.default)) ||
        voices.find((v) => v.lang.startsWith('en'));

    let currentSentenceIndex = 0;

    const speakNextSentence = () => {
      if (cancelSpeechRef.current) {
        setIsPlayingTTS(false);
        return;
      }

      if (currentSentenceIndex >= sentences.length) {
        setIsPlayingTTS(false);
        if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }
        return;
      }

      const currentSentence = sentences[currentSentenceIndex];
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = targetLang;
      utterance.rate = isZh ? 0.92 : 0.95;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        if (!cancelSpeechRef.current) {
          currentSentenceIndex++;
          speakNextSentence();
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        if (!cancelSpeechRef.current) {
          currentSentenceIndex++;
          speakNextSentence();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlayingTTS(true);
    speakNextSentence();

    speechKeepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.85];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Audio Play Button */}
      {language === 'en' || language === 'zh' ? (
        <Tooltip title={isPlayingTTS ? 'Dừng đọc thuyết minh' : 'Nghe giọng đọc toàn bộ câu chuyện di sản'}>
          <Button
            size="small"
            variant={isPlayingTTS ? 'outlined' : 'contained'}
            color="secondary"
            startIcon={isPlayingTTS ? <StopIcon /> : <VolumeUpIcon />}
            onClick={handleToggleSpeechTTS}
            id="btn-play-multilingual-tts-story"
            sx={{
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 800,
              py: 0.7,
              px: 2,
              borderRadius: 1.5,
              bgcolor: isPlayingTTS ? 'transparent' : 'secondary.main',
              color: isPlayingTTS ? 'secondary.dark' : '#2A1F17',
              borderColor: 'secondary.main',
              boxShadow: isPlayingTTS ? 'none' : '0 2px 10px rgba(200, 157, 53, 0.3)',
              '&:hover': {
                bgcolor: isPlayingTTS ? 'rgba(200, 157, 53, 0.1)' : 'secondary.dark',
              },
            }}
          >
            {isPlayingTTS
              ? language === 'zh'
                ? '停止朗读'
                : 'Stop Narration'
              : language === 'zh'
              ? '收听完整故事'
              : 'Listen Full Story'}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title={isPlayingAudio ? 'Tạm dừng thuyết minh' : 'Bật thuyết minh âm thanh di tích'}>
          <Button
            size="small"
            variant={isPlayingAudio ? 'outlined' : 'contained'}
            color="secondary"
            startIcon={isPlayingAudio ? <StopIcon /> : <VolumeUpIcon />}
            onClick={handleToggleCloudinaryAudio}
            id="btn-play-cloudinary-narration"
            sx={{
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 800,
              py: 0.7,
              px: 2,
              borderRadius: 1.5,
              bgcolor: isPlayingAudio ? 'transparent' : 'secondary.main',
              color: isPlayingAudio ? 'secondary.dark' : '#2A1F17',
              borderColor: 'secondary.main',
              boxShadow: isPlayingAudio ? 'none' : '0 2px 10px rgba(200, 157, 53, 0.3)',
              '&:hover': {
                bgcolor: isPlayingAudio ? 'rgba(200, 157, 53, 0.1)' : 'secondary.dark',
              },
            }}
          >
            {isPlayingAudio ? 'Dừng Thuyết Minh' : 'Đọc Thuyết Minh'}
          </Button>
        </Tooltip>
      )}

      {/* Multilingual Audio Narration Active Indicator (for English & Chinese) */}
      {(language === 'en' || language === 'zh') && isPlayingTTS && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            border: '1px solid rgba(200, 157, 53, 0.5)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'success.main',
                boxShadow: '0 0 8px rgba(46, 125, 50, 0.7)',
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark', fontSize: '0.85rem' }}>
              {language === 'zh'
                ? '语音解说：正在朗读完整中文历史故事...'
                : 'Audio Narration: Reading the complete English historical story...'}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={stopAllAudio}
            sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', py: 0.3, px: 1.5 }}
          >
            {language === 'zh' ? '停止' : 'Stop'}
          </Button>
        </Box>
      )}

      {/* Cloudinary Audio Narration Mini-Player & Progress (for Vietnamese authentic recordings) */}
      {language !== 'en' && language !== 'zh' && audioUrl && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: 1.5,
            border: '1px solid #E6DCCD',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<HeadphonesIcon fontSize="small" />}
                label="Thuyết Minh"
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  bgcolor: 'rgba(200, 157, 53, 0.15)',
                  color: 'primary.dark',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Chỉnh tốc độ đọc">
                <Chip
                  label={`${playbackRate}x`}
                  size="small"
                  onClick={cyclePlaybackRate}
                  sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                />
              </Tooltip>
              <Tooltip title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
                <IconButton size="small" onClick={toggleMute} sx={{ p: 0.5 }}>
                  {isMuted ? <VolumeOffIcon sx={{ fontSize: 18, color: 'text.secondary' }} /> : <VolumeUpIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Slider
            size="small"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            sx={{
              color: 'secondary.main',
              py: 0.5,
              '& .MuiSlider-thumb': { width: 12, height: 12 },
              '& .MuiSlider-rail': { bgcolor: '#E5DAC9' },
            }}
          />

          {loadError && (
            <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 0.5 }}>
              Không thể tải tệp âm thanh. Vui lòng kiểm tra kết nối mạng.
            </Typography>
          )}

          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsPlayingAudio(false);
              setCurrentTime(0);
            }}
            onError={() => {
              setLoadError(true);
              setIsPlayingAudio(false);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
