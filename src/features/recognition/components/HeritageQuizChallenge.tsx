import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { AdminQuizQuestion } from '../../admin/types';

interface HeritageQuizChallengeProps {
  quizzes: AdminQuizQuestion[];
}

export const HeritageQuizChallenge: React.FC<HeritageQuizChallengeProps> = ({ quizzes }) => {
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  if (quizzes.length === 0) return null;

  const currentQuiz = quizzes[activeQuizIndex];
  if (!currentQuiz) return null;

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setActiveQuizIndex((prev) => (prev + 1) % quizzes.length);
  };

  return (
    <Box sx={{ mb: 2 }} id="heritage-quiz-challenge">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <QuizIcon fontSize="small" color="primary" /> Thử Thách Trắc Nghiệm Di Tích
        </Typography>
        <Chip
          label={`Câu ${activeQuizIndex + 1} / ${quizzes.length}`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
          {currentQuiz.question}
        </Typography>

        <RadioGroup
          value={selectedOption}
          onChange={(e) => !isAnswerSubmitted && setSelectedOption(parseInt(e.target.value, 10))}
        >
          {currentQuiz.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuiz.correctIndex;

            let bgColor = 'background.paper';
            let borderColor = '#E5DAC9';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                bgColor = 'rgba(46, 125, 50, 0.12)';
                borderColor = '#2E7D32';
              } else if (isSelected && !isCorrect) {
                bgColor = 'rgba(211, 47, 47, 0.12)';
                borderColor = '#D32F2F';
              }
            }

            return (
              <Box
                key={idx}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: 1.5,
                  bgcolor: bgColor,
                  border: `1px solid ${borderColor}`,
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value={idx}
                  control={<Radio size="small" disabled={isAnswerSubmitted} color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.875rem !important',
                          fontWeight: '700 !important',
                          color: 'text.primary',
                          minWidth: '20px',
                          lineHeight: 1.5,
                          userSelect: 'none',
                        }}
                      >
                        {String.fromCharCode(65 + idx)}.
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected || isCorrect ? 600 : 500,
                          color: isSelected ? 'primary.dark' : 'text.primary',
                          lineHeight: 1.5,
                        }}
                      >
                        {opt}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Box>
            );
          })}
        </RadioGroup>

        {/* Feedback and explanation */}
        {isAnswerSubmitted && (
          <Box sx={{ mt: 1.5, mb: 1.5 }}>
            {selectedOption === currentQuiz.correctIndex ? (
              <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ py: 0.5 }}>
                <strong>Chính xác!</strong> {currentQuiz.explanation}
              </Alert>
            ) : (
              <Alert severity="error" icon={<CancelIcon fontSize="inherit" />} sx={{ py: 0.5 }}>
                <strong>Chưa đúng!</strong> Đáp án đúng là{' '}
                <strong>
                  {String.fromCharCode(65 + currentQuiz.correctIndex)}. {currentQuiz.options[currentQuiz.correctIndex]}
                </strong>
                . {currentQuiz.explanation}
              </Alert>
            )}
          </Box>
        )}

        {/* Submit / Next Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
          {!isAnswerSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={selectedOption === null}
              onClick={handleQuizSubmit}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              Kiểm Tra Đáp Án
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleNextQuiz}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              {activeQuizIndex + 1 < quizzes.length ? 'Câu Tiếp Theo' : 'Làm Lại Từ Đầu'}
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};
