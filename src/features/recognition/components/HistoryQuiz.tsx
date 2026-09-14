import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import { QuizQuestion } from '../types';

interface HistoryQuizProps {
  quizList: QuizQuestion[];
  monumentName: string;
}

export const HistoryQuiz: React.FC<HistoryQuizProps> = ({ quizList, monumentName }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!quizList || quizList.length === 0) {
    return null;
  }

  const currentQ = quizList[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizList.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <Card
      sx={{
        mt: 4,
        mb: 3,
        border: '1px solid #EBE6DE',
        background: '#FFFFFF',
      }}
      id="card-history-quiz"
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <QuizIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Trắc Nghiệm Vui — Khám Phá Tri Thức
            </Typography>
          </Box>
          {!isFinished && (
            <Chip
              label={`Câu ${currentIdx + 1}/${quizList.length}`}
              color="primary"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>

        {!isFinished && (
          <LinearProgress
            variant="determinate"
            value={((currentIdx + 1) / quizList.length) * 100}
            sx={{ mb: 3, height: 6, borderRadius: 3, bgcolor: '#EBE6DE' }}
          />
        )}

        {isFinished ? (
          /* Finished Screen */
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(212, 175, 55, 0.15)',
                color: 'secondary.dark',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Chúc mừng bạn đã hoàn thành bài đố!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Bạn đã trả lời đúng <strong>{score}</strong> trên tổng số <strong>{quizList.length}</strong> câu hỏi về{' '}
              {monumentName}.
            </Typography>

            <Button
              variant="contained"
              startIcon={<ReplayIcon />}
              onClick={handleRestart}
              sx={{ px: 3, py: 1 }}
              id="btn-restart-quiz"
            >
              Làm Lại Trắc Nghiệm
            </Button>
          </Box>
        ) : (
          /* Active Question */
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary', fontSize: '1.05rem' }}>
              {currentQ.question}
            </Typography>

            <RadioGroup value={selectedOption !== null ? selectedOption : ''}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {currentQ.options.map((option, idx) => {
                  let borderStyle = '1px solid #EBE6DE';
                  let bgStyle = '#FFFFFF';

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      borderStyle = '2px solid #2E7D32';
                      bgStyle = 'rgba(46, 125, 50, 0.08)';
                    } else if (idx === selectedOption) {
                      borderStyle = '2px solid #D32F2F';
                      bgStyle = 'rgba(211, 47, 47, 0.08)';
                    }
                  } else if (selectedOption === idx) {
                    borderStyle = '2px solid #8B4513';
                    bgStyle = 'rgba(139, 69, 19, 0.04)';
                  }

                  return (
                    <Box
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      sx={{
                        p: 1.5,
                        px: 2,
                        borderRadius: 2,
                        border: borderStyle,
                        bgcolor: bgStyle,
                        cursor: isAnswerSubmitted ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: isAnswerSubmitted ? bgStyle : 'rgba(139, 69, 19, 0.04)',
                        },
                      }}
                    >
                      <FormControlLabel
                        value={idx}
                        control={<Radio size="small" color="primary" />}
                        label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{option}</Typography>}
                        sx={{ m: 0, flexGrow: 1 }}
                      />
                      {isAnswerSubmitted && idx === currentQ.correctIndex && (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                      {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </RadioGroup>

            {/* Answer Explanation */}
            {isAnswerSubmitted && (
              <Alert
                severity={selectedOption === currentQ.correctIndex ? 'success' : 'info'}
                sx={{ mt: 2.5, borderRadius: 2 }}
              >
                <Typography variant="body2">
                  <strong>Giải thích:</strong> {currentQ.explanation}
                </Typography>
              </Alert>
            )}

            {/* Action buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              {!isAnswerSubmitted ? (
                <Button
                  variant="contained"
                  disabled={selectedOption === null}
                  onClick={handleCheckAnswer}
                  sx={{ px: 3 }}
                  id="btn-check-quiz-answer"
                >
                  Kiểm Tra Đáp Án
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ px: 3 }}
                  id="btn-next-quiz-question"
                >
                  {currentIdx + 1 < quizList.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
