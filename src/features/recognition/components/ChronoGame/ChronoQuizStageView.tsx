import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AiGeneratedQuizQuestion } from '../../services/aiQuizService';
import { ChronoShardGraphic, ChronoGuideAvatar } from './ChronoGraphics';
import { chronoSoundService } from '../../services/chronoSoundService';

interface ChronoQuizStageViewProps {
  monumentName: string;
  quizzes: AiGeneratedQuizQuestion[];
  isMuted: boolean;
  onToggleMute: () => void;
  onComplete: (quizStats: { score: number; shards: number; correctCount: number }) => void;
  onSkipToTimeline?: () => void;
}

export const ChronoQuizStageView: React.FC<ChronoQuizStageViewProps> = ({
  monumentName,
  quizzes,
  isMuted,
  onToggleMute,
  onComplete,
  onSkipToTimeline,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [shards, setShards] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [showRoundSummary, setShowRoundSummary] = useState<boolean>(false);

  if (!quizzes || quizzes.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#F8FAFC', bgcolor: '#0B192C', borderRadius: '10px' }}>
        <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2 }}>
          Đang chuẩn bị câu hỏi trắc nghiệm...
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => onComplete({ score: 0, shards: 0, correctCount: 0 })}>
          Tiếp Tục Đến Dòng Thời Gian
        </Button>
      </Box>
    );
  }

  const currentQ = quizzes[currentIdx];
  const progressPercent = ((currentIdx + (isAnswerSubmitted ? 1 : 0)) / quizzes.length) * 100;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      chronoSoundService.playCorrect();
      const nextStreak = streak + 1;
      const pointsEarned = 100 + nextStreak * 10;
      setScore((prev) => prev + pointsEarned);
      setShards((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      setStreak(nextStreak);
    } else {
      chronoSoundService.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizzes.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      chronoSoundService.playClick();
    } else {
      setShowRoundSummary(true);
      chronoSoundService.playCorrect();
    }
  };

  const handleProceedToTimeline = () => {
    chronoSoundService.playClick();
    onComplete({
      score,
      shards,
      correctCount,
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3.5 },
        bgcolor: '#0B192C',
        color: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        background: 'radial-gradient(circle at 50% 20%, #1E3E62 0%, #0B192C 75%, #050C16 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="chrono-quiz-stage-view"
    >
      {/* Top Controls Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2.5,
          pb: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <ChronoGuideAvatar size={38} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#00E5FF',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Chặng 1: Thử Thách Trắc Nghiệm Di Tích
              </Typography>
              <Chip
                label="AI biên soạn từ thuyết minh"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(0, 229, 255, 0.15)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#D4AF37' }}>
              {monumentName}
            </Typography>
          </Box>
        </Box>

        {/* Stats & Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Shards Collected */}
          <Tooltip title="Mảnh Thời Gian tích lũy">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.2,
                py: 0.4,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
              }}
            >
              <ChronoShardGraphic size={18} glow={false} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#00E5FF' }}>
                {shards} Mảnh
              </Typography>
            </Box>
          </Tooltip>

          {/* Current Score */}
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: '8px',
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#D4AF37' }}>
              {score} Điểm
            </Typography>
          </Box>

          {/* Sound Toggle */}
          <Tooltip title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
            <IconButton
              size="small"
              onClick={onToggleMute}
              sx={{
                color: isMuted ? 'rgba(255,255,255,0.4)' : '#00E5FF',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
              }}
            >
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
            Tiến độ trắc nghiệm
          </Typography>
          <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 800 }}>
            Câu {currentIdx + 1} / {quizzes.length}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#00E5FF',
              background: 'linear-gradient(90deg, #00E5FF 0%, #D4AF37 100%)',
            },
          }}
        />
      </Box>

      {showRoundSummary ? (
        /* ================= ROUND 1 SUMMARY VIEW ================= */
        <Box
          sx={{
            py: 4,
            px: 2,
            textAlign: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 52, color: '#D4AF37' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#D4AF37', mb: 1 }}>
            Xuất Sắc! Hoàn Thành Chặng 1
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 520, mx: 'auto', mb: 3 }}>
            Bạn đã trả lời đúng <strong>{correctCount}/{quizzes.length}</strong> câu hỏi trắc nghiệm dựa trên bài thuyết minh, tích lũy được <strong>{score} điểm</strong> và <strong>{shards} Mảnh Thời Gian</strong>!
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleProceedToTimeline}
              id="btn-proceed-to-round-2"
              sx={{
                py: 1.4,
                px: 3.5,
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 18px rgba(200, 157, 53, 0.4)',
              }}
            >
              Tiếp Tục Chặng 2: Khôi Phục Dòng Thời Gian
            </Button>
          </Box>
        </Box>
      ) : (
        /* ================= ACTIVE QUESTION VIEW ================= */
        <Box>
          {/* Question Banner */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              mb: 2.5,
              borderRadius: '10px',
              bgcolor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <QuizIcon sx={{ color: '#00E5FF', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 800, textTransform: 'uppercase' }}>
                Câu Hỏi {currentIdx + 1}
              </Typography>
              {streak > 1 && (
                <Chip
                  label={`Combo x${streak}!`}
                  size="small"
                  color="warning"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                />
              )}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                fontSize: { xs: '1.02rem', sm: '1.2rem' },
                lineHeight: 1.5,
              }}
            >
              {currentQ.question}
            </Typography>
          </Box>

          {/* Options Grid (A, B, C, D) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let borderStyle = '1px solid rgba(255, 255, 255, 0.15)';
              let bgStyle = 'rgba(255, 255, 255, 0.04)';
              let textColor = '#F8FAFC';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  borderStyle = '2px solid #10B981';
                  bgStyle = 'rgba(16, 185, 129, 0.2)';
                  textColor = '#A7F3D0';
                } else if (isSelected && !isCorrect) {
                  borderStyle = '2px solid #EF4444';
                  bgStyle = 'rgba(239, 68, 68, 0.2)';
                  textColor = '#FECACA';
                } else {
                  borderStyle = '1px solid rgba(255, 255, 255, 0.08)';
                  bgStyle = 'rgba(0, 0, 0, 0.2)';
                  textColor = 'rgba(255, 255, 255, 0.45)';
                }
              }

              return (
                <Box
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  sx={{
                    p: 1.8,
                    borderRadius: '8px',
                    bgcolor: bgStyle,
                    border: borderStyle,
                    cursor: isAnswerSubmitted ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': !isAnswerSubmitted
                      ? {
                          bgcolor: 'rgba(0, 229, 255, 0.1)',
                          borderColor: '#00E5FF',
                          transform: 'translateX(4px)',
                        }
                      : {},
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      bgcolor: isAnswerSubmitted && isCorrect
                        ? '#10B981'
                        : isAnswerSubmitted && isSelected && !isCorrect
                        ? '#EF4444'
                        : 'rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </Box>

                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: { xs: '0.92rem', sm: '0.98rem' },
                      fontWeight: isSelected || isCorrect ? 700 : 500,
                      color: textColor,
                      lineHeight: 1.5,
                    }}
                  >
                    {opt}
                  </Typography>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircleIcon sx={{ color: '#10B981', fontSize: 22, flexShrink: 0 }} />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <CancelIcon sx={{ color: '#EF4444', fontSize: 22, flexShrink: 0 }} />
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Explanation Box (Revealed after answer) */}
          {isAnswerSubmitted && (
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: '8px',
                bgcolor: selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                border: `1px solid ${selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.35)' : 'rgba(212, 175, 55, 0.35)'}`,
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <MenuBookIcon sx={{ color: '#D4AF37', fontSize: 22, mt: 0.2, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.3 }}>
                  Căn Cứ Theo Thuyết Minh Di Tích:
                </Typography>
                <Typography variant="body2" sx={{ color: '#F8FAFC', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {currentQ.explanation}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Bottom Action Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            {onSkipToTimeline && (
              <Button
                variant="text"
                size="small"
                onClick={onSkipToTimeline}
                sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}
              >
                Chuyển Thẳng Đến Dòng Thời Gian »
              </Button>
            )}

            {isAnswerSubmitted && (
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextQuestion}
                id="btn-quiz-next-question"
                sx={{
                  ml: 'auto',
                  py: 1,
                  px: 3,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
                }}
              >
                {currentIdx + 1 < quizzes.length ? 'Câu Hỏi Tiếp Theo' : 'Xem Kết Quả Chặng 1'}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
