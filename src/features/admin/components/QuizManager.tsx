import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdminQuizQuestion } from '../types';
import { adminService } from '../services/adminService';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';

export const QuizManager: React.FC = () => {
  const [quizzes, setQuizzes] = useState<AdminQuizQuestion[]>(() => adminService.getQuizzes());
  const [filterMonument, setFilterMonument] = useState<string>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<AdminQuizQuestion | null>(null);

  // Form Fields
  const [monumentCode, setMonumentCode] = useState<string>('CBT');
  const [question, setQuestion] = useState<string>('');
  const [optionA, setOptionA] = useState<string>('');
  const [optionB, setOptionB] = useState<string>('');
  const [optionC, setOptionC] = useState<string>('');
  const [optionD, setOptionD] = useState<string>('');
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [formError, setFormError] = useState<string>('');
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  const refreshQuizzes = () => {
    setQuizzes(adminService.getQuizzes());
  };

  const handleOpenAdd = () => {
    setEditingQuiz(null);
    setMonumentCode('CBT');
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectIndex(0);
    setExplanation('');
    setDifficulty('medium');
    setFormError('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (quiz: AdminQuizQuestion) => {
    setEditingQuiz(quiz);
    setMonumentCode(quiz.monumentCode);
    setQuestion(quiz.question);
    setOptionA(quiz.options[0] || '');
    setOptionB(quiz.options[1] || '');
    setOptionC(quiz.options[2] || '');
    setOptionD(quiz.options[3] || '');
    setCorrectIndex(quiz.correctIndex);
    setExplanation(quiz.explanation);
    setDifficulty(quiz.difficulty);
    setFormError('');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!question.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setFormError('Vui lòng nhập đầy đủ cả 4 phương án A, B, C, D.');
      return;
    }

    const selectedMonument = ORDERED_HERITAGE_LIST.find((m) => m.code === monumentCode);
    const monumentName = selectedMonument ? selectedMonument.name : monumentCode;

    adminService.saveQuiz({
      id: editingQuiz ? editingQuiz.id : undefined,
      monumentCode,
      monumentName,
      question: question.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctIndex,
      explanation: explanation.trim(),
      difficulty,
    });

    setIsDialogOpen(false);
    refreshQuizzes();
    setSnackbarMsg(editingQuiz ? 'Đã cập nhật câu hỏi trắc nghiệm!' : 'Đã thêm câu hỏi trắc nghiệm mới!');
  };

  const handleDelete = (id: string, qText: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi: "${qText}"?`)) {
      adminService.deleteQuiz(id);
      refreshQuizzes();
      setSnackbarMsg('Đã xóa câu hỏi.');
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (filterMonument !== 'ALL' && q.monumentCode !== filterMonument) return false;
    if (filterDifficulty !== 'ALL' && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <Box>
      {/* Header with Add Action */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Cinzel", "Playfair Display", serif',
              fontWeight: 800,
              color: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <QuizIcon color="primary" /> Quản Lý Câu Hỏi Trắc Nghiệm (Quiz)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Biên tập ngân hàng câu hỏi kiến thức lịch sử cho người dùng khi khám phá di tích
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ fontWeight: 700, px: 2.5 }}
          id="btn-admin-add-quiz"
        >
          Thêm Câu Hỏi Mới
        </Button>
      </Box>

      {/* Filter Bar */}
      <Card variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="filter-quiz-monument">Lọc Theo Di Tích</InputLabel>
            <Select
              labelId="filter-quiz-monument"
              value={filterMonument}
              label="Lọc Theo Di Tích"
              onChange={(e) => setFilterMonument(e.target.value)}
            >
              <MenuItem value="ALL">Tất Cả 13 Di Tích</MenuItem>
              {ORDERED_HERITAGE_LIST.map((m) => (
                <MenuItem key={m.code} value={m.code}>
                  <strong>[{m.code}]</strong> &nbsp;{m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="filter-difficulty">Mức Độ</InputLabel>
            <Select
              labelId="filter-difficulty"
              value={filterDifficulty}
              label="Mức Độ"
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <MenuItem value="ALL">Tất Cả Mức Độ</MenuItem>
              <MenuItem value="easy">Dễ</MenuItem>
              <MenuItem value="medium">Trung Bình</MenuItem>
              <MenuItem value="hard">Nâng Cao</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ color: 'text.secondary', ml: 'auto', fontWeight: 600 }}>
            Tổng số: <strong>{filteredQuizzes.length}</strong> câu hỏi
          </Typography>
        </Box>
      </Card>

      {/* Quizzes Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#E5DAC9' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAF7F0' }}>
              <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 90 }}>Mã</TableCell>
              <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', minWidth: 140 }}>Di Tích</TableCell>
              <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif' }}>Nội Dung Câu Hỏi & Đáp Án Đúng</TableCell>
              <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 110 }}>Độ Khó</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 110 }}>
                Thao Tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Chưa có câu hỏi nào phù hợp bộ lọc. Bấm "Thêm Câu Hỏi Mới" để bắt đầu nhập.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((q) => {
                const diffLabel = q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'hard' ? 'Nâng cao' : 'Trung bình';
                const diffColor = q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'error' : 'warning';

                return (
                  <TableRow key={q.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.dark' }}>
                      <Chip
                        label={q.monumentCode}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          bgcolor: 'rgba(200, 157, 53, 0.15)',
                          color: 'primary.dark',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{q.monumentName}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        {q.question}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                          label={`Đáp án: ${q.options[q.correctIndex]}`}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 700 }}
                        />
                        {q.explanation && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            • {q.explanation}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={diffLabel}
                        size="small"
                        color={diffColor}
                        sx={{ height: 20, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(q)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main' }}
                          onClick={() => handleDelete(q.id, q.question)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Quiz Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        id="dialog-admin-quiz"
      >
        <DialogTitle
          sx={{
            fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            color: 'primary.dark',
            borderBottom: '1px solid #E2D7C7',
          }}
        >
          {editingQuiz ? 'Chỉnh Sửa Câu Hỏi Trắc Nghiệm' : 'Thêm Câu Hỏi Trắc Nghiệm Mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2, mb: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="dialog-quiz-monument-label">Di Tích Lịch Sử</InputLabel>
              <Select
                labelId="dialog-quiz-monument-label"
                value={monumentCode}
                label="Di Tích Lịch Sử"
                onChange={(e) => setMonumentCode(e.target.value)}
              >
                {ORDERED_HERITAGE_LIST.map((m) => (
                  <MenuItem key={m.code} value={m.code}>
                    <strong>[{m.code}]</strong> &nbsp;{m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="dialog-difficulty-label">Mức Độ Khó</InputLabel>
              <Select
                labelId="dialog-difficulty-label"
                value={difficulty}
                label="Mức Độ Khó"
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              >
                <MenuItem value="easy">Dễ</MenuItem>
                <MenuItem value="medium">Trung Bình</MenuItem>
                <MenuItem value="hard">Nâng Cao</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Nội Dung Câu Hỏi"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            margin="normal"
            placeholder="Ví dụ: Chợ Bến Thành hiện nay được khánh thành chính thức vào năm nào?"
            required
            id="input-quiz-question"
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark', mt: 2, mb: 1 }}>
            4 Phương Án Trả Lời (Chọn nút tròn tại phương án đúng):
          </Typography>

          <RadioGroup
            value={correctIndex}
            onChange={(e) => setCorrectIndex(parseInt(e.target.value, 10))}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel value={0} control={<Radio color="success" />} label="A." sx={{ mr: 0 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Phương án A"
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel value={1} control={<Radio color="success" />} label="B." sx={{ mr: 0 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Phương án B"
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel value={2} control={<Radio color="success" />} label="C." sx={{ mr: 0 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Phương án C"
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel value={3} control={<Radio color="success" />} label="D." sx={{ mr: 0 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Phương án D"
                  required
                />
              </Box>
            </Box>
          </RadioGroup>

          <TextField
            fullWidth
            label="Lời Giải Thích Chi Tiết (Hiển thị sau khi người dùng trả lời)"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            margin="normal"
            multiline
            rows={2}
            placeholder="Cung cấp ngữ cảnh lịch sử chứng minh đáp án đúng..."
            id="input-quiz-explanation"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2D7C7' }}>
          <Button onClick={() => setIsDialogOpen(false)} variant="outlined" color="inherit">
            Hủy Bỏ
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
            {editingQuiz ? 'Lưu Thay Đổi' : 'Tạo Câu Hỏi'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(snackbarMsg)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
        message={snackbarMsg}
      />
    </Box>
  );
};
