import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import TranslateIcon from '@mui/icons-material/Translate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MultilingualStory, SupportedLanguage, SUPPORTED_LANGUAGES } from '../types';
import { adminService } from '../services/adminService';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';

export const StoryManager: React.FC = () => {
  const [stories, setStories] = useState<MultilingualStory[]>(() => adminService.getStories());
  const [filterMonument, setFilterMonument] = useState<string>('ALL');
  const [filterLang, setFilterLang] = useState<string>('ALL');

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<MultilingualStory | null>(null);

  // Form Fields
  const [monumentCode, setMonumentCode] = useState<string>('CBT');
  const [language, setLanguage] = useState<SupportedLanguage>('vi');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [historicalValue, setHistoricalValue] = useState<string>('');
  const [heritageLesson, setHeritageLesson] = useState<string>('');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState<string>('');
  const [audioNarrationText, setAudioNarrationText] = useState<string>('');
  const [era, setEra] = useState<string>('');
  const [author, setAuthor] = useState<string>('Ban Quản Trị Di Sản');
  const [formError, setFormError] = useState<string>('');

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  const refreshStories = () => {
    setStories(adminService.getStories());
  };

  React.useEffect(() => {
    const handleUpdate = () => refreshStories();
    window.addEventListener('ditich_stories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_stories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingStory(null);
    setMonumentCode('CBT');
    setLanguage('vi');
    setTitle('');
    setContent('');
    setHistoricalValue('');
    setHeritageLesson('');
    setKeyTakeawaysText('');
    setAudioNarrationText('');
    setEra('');
    setAuthor('Ban Quản Trị Di Sản');
    setFormError('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (story: MultilingualStory) => {
    setEditingStory(story);
    setMonumentCode(story.monumentCode);
    setLanguage(story.language);
    setTitle(story.title);
    setContent(story.content);
    setHistoricalValue(story.historicalValue || '');
    setHeritageLesson(story.heritageLesson || '');
    setKeyTakeawaysText((story.keyTakeaways || []).join('\n'));
    setAudioNarrationText(story.audioNarrationText || '');
    setEra(story.era || '');
    setAuthor(story.author || 'Ban Quản Trị Di Sản');
    setFormError('');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setFormError('Vui lòng nhập đầy đủ tiêu đề và nội dung câu chuyện.');
      return;
    }

    const selectedMonument = ORDERED_HERITAGE_LIST.find((m) => m.code === monumentCode);
    const monumentName = selectedMonument ? selectedMonument.name : monumentCode;

    const takeaways = keyTakeawaysText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    adminService.saveStory({
      id: editingStory ? editingStory.id : undefined,
      monumentCode,
      monumentName,
      language,
      title: title.trim(),
      content: content.trim(),
      historicalValue: historicalValue.trim(),
      heritageLesson: heritageLesson.trim(),
      keyTakeaways: takeaways.length > 0 ? takeaways : undefined,
      audioNarrationText: audioNarrationText.trim() || content.trim(),
      era: era.trim(),
      author: author.trim(),
    });

    setIsDialogOpen(false);
    refreshStories();
    setSnackbarMsg(editingStory ? 'Đã cập nhật câu chuyện thành công!' : 'Đã thêm câu chuyện đa ngôn ngữ mới!');
  };

  const handleDelete = (id: string, storyTitle: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu chuyện: "${storyTitle}"?`)) {
      adminService.deleteStory(id);
      refreshStories();
      setSnackbarMsg('Đã xóa câu chuyện.');
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Bạn có chắc muốn khôi phục 13 câu chuyện mặc định tương ứng với nội dung chính thức trong các file txt của các di tích?'
      )
    ) {
      adminService.resetToDefaultStories();
      refreshStories();
      setSnackbarMsg('Đã khôi phục thành công 13 câu chuyện mặc định từ dữ liệu file txt!');
    }
  };

  const ttsKeepAliveRef = useRef<NodeJS.Timeout | null>(null);
  const cancelTtsRef = useRef<boolean>(false);

  const stopTTS = () => {
    if (ttsKeepAliveRef.current) {
      clearInterval(ttsKeepAliveRef.current);
      ttsKeepAliveRef.current = null;
    }
    cancelTtsRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handlePlayTTS = (text: string, lang: SupportedLanguage) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ phát âm thanh.');
      return;
    }

    if (isPlayingAudio) {
      stopTTS();
      return;
    }

    stopTTS();
    cancelTtsRef.current = false;

    const isCjk = lang === 'zh' || lang === 'ja' || lang === 'ko';
    const splitRegex = isCjk ? /(?<=[.!?。！？；\n])\s*/ : /(?<=[.!?])\s+/;
    const sentences = text
      .split(splitRegex)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) return;

    const langMap: Record<SupportedLanguage, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      fr: 'fr-FR',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN',
    };
    const targetLang = langMap[lang] || 'vi-VN';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(targetLang.split('-')[0]));

    let currentIdx = 0;

    const speakSentence = () => {
      if (cancelTtsRef.current) {
        setIsPlayingAudio(false);
        return;
      }

      if (currentIdx >= sentences.length) {
        setIsPlayingAudio(false);
        if (ttsKeepAliveRef.current) {
          clearInterval(ttsKeepAliveRef.current);
          ttsKeepAliveRef.current = null;
        }
        return;
      }

      const sentenceText = sentences[currentIdx];
      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (!cancelTtsRef.current) {
          currentIdx++;
          speakSentence();
        }
      };

      utterance.onerror = () => {
        if (!cancelTtsRef.current) {
          currentIdx++;
          speakSentence();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlayingAudio(true);
    speakSentence();

    ttsKeepAliveRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);
  };

  const filteredStories = stories.filter((s) => {
    if (filterMonument !== 'ALL' && s.monumentCode !== filterMonument) return false;
    if (filterLang !== 'ALL' && s.language !== filterLang) return false;
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
            <TranslateIcon color="primary" /> Quản Lý Câu Chuyện Đa Ngôn Ngữ
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nhập và biên soạn tư liệu thuyết minh đa ngữ cho các di tích lịch sử
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={handleResetDefaults}
            sx={{ fontWeight: 600, bgcolor: '#FAF7F0' }}
            id="btn-admin-reset-stories"
          >
            Khôi Phục 13 Bản Gốc (.txt)
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ fontWeight: 700, px: 2.5 }}
            id="btn-admin-add-story"
          >
            Thêm Câu Chuyện Mới
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="filter-monument-label">Lọc Theo Di Tích</InputLabel>
            <Select
              labelId="filter-monument-label"
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

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="filter-lang-label">Ngôn Ngữ</InputLabel>
            <Select
              labelId="filter-lang-label"
              value={filterLang}
              label="Ngôn Ngữ"
              onChange={(e) => setFilterLang(e.target.value)}
            >
              <MenuItem value="ALL">Tất Cả Ngôn Ngữ</MenuItem>
              {SUPPORTED_LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ color: 'text.secondary', ml: 'auto', fontWeight: 600 }}>
            Tổng số: <strong>{filteredStories.length}</strong> câu chuyện
          </Typography>
        </Box>
      </Card>

      {/* Stories Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#E5DAC9' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAF7F0' }}>
              <TableCell sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif', width: 90 }}>Mã</TableCell>
              <TableCell sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif', minWidth: 150 }}>Di Tích</TableCell>
              <TableCell sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif', width: 130 }}>Ngôn Ngữ</TableCell>
              <TableCell sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif' }}>Tiêu Đề & Nội Dung</TableCell>
              <TableCell sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif', width: 120 }}>Thời Kỳ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: '"Cinzel", serif', width: 120 }}>
                Thao Tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Chưa có câu chuyện nào phù hợp bộ lọc. Bấm "Thêm Câu Chuyện Mới" để bắt đầu nhập.
                </TableCell>
              </TableRow>
            ) : (
              filteredStories.map((story) => {
                const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === story.language);
                return (
                  <TableRow key={story.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.dark' }}>
                      <Chip
                        label={story.monumentCode}
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
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{story.monumentName}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${langObj?.flag || ''} ${langObj?.label || story.language}`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {story.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {story.content}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{story.era || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Nghe thử thuyết minh">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePlayTTS(story.audioNarrationText || story.title, story.language)}
                        >
                          {isPlayingAudio ? <StopIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(story)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main' }}
                          onClick={() => handleDelete(story.id, story.title)}
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

      {/* Add / Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        id="dialog-admin-story"
      >
        <DialogTitle
          sx={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 800,
            color: 'primary.dark',
            borderBottom: '1px solid #E2D7C7',
          }}
        >
          {editingStory ? 'Chỉnh Sửa Câu Chuyện Đa Ngôn Ngữ' : 'Thêm Câu Chuyện Đa Ngôn Ngữ Mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="dialog-monument-label">Di Tích Lịch Sử</InputLabel>
              <Select
                labelId="dialog-monument-label"
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
              <InputLabel id="dialog-lang-label">Ngôn Ngữ Thuyết Minh</InputLabel>
              <Select
                labelId="dialog-lang-label"
                value={language}
                label="Ngôn Ngữ Thuyết Minh"
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <MenuItem key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Tiêu Đề Câu Chuyện"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            placeholder="Ví dụ: Lầu Ngũ Phụng và khúc tráng ca triều Nguyễn..."
            required
            id="input-story-title"
          />

          <TextField
            fullWidth
            label="Khái Quát Lịch Sử & Di Tích"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            placeholder="Nhập tư liệu lịch sử, bối cảnh, sự kiện gắn liền với di tích..."
            required
            id="input-story-content"
          />

          <TextField
            fullWidth
            label="Giá Trị Lịch Sử & Kiến Trúc"
            value={historicalValue}
            onChange={(e) => setHistoricalValue(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Nhập giá trị văn hóa, kiến trúc nghệ thuật và dấu ấn thời đại..."
            id="input-story-historical-value"
          />

          <TextField
            fullWidth
            label="Bài Học Lịch Sử Rút Ra Cho Thế Hệ Trẻ"
            value={heritageLesson}
            onChange={(e) => setHeritageLesson(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Thông điệp giáo dục truyền thống, lòng yêu nước, ý thức trách nhiệm bảo tồn..."
            id="input-story-heritage-lesson"
          />

          <TextField
            fullWidth
            label="Các Điểm Cốt Lõi Cần Ghi Nhớ (Mỗi dòng một ý)"
            value={keyTakeawaysText}
            onChange={(e) => setKeyTakeawaysText(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Dòng 1: Ý nghĩa lịch sử thiêng liêng&#10;Dòng 2: Giá trị văn hóa trường tồn&#10;Dòng 3: Bài học phát huy cho tương lai"
            helperText="Nhập các điểm mấu chốt, mỗi ý trên 1 dòng riêng biệt."
            id="input-story-takeaways"
          />

          <TextField
            fullWidth
            label="Lời Thoại Thuyết Minh Âm Thanh (Audio Narration Script)"
            value={audioNarrationText}
            onChange={(e) => setAudioNarrationText(e.target.value)}
            margin="normal"
            multiline
            rows={2}
            placeholder="Văn bản truyền cảm ngắn gọn dùng cho audio guide hoặc đọc tự động..."
            helperText="Để trống nếu muốn sử dụng tiêu đề làm lời thoại ngắn."
            id="input-story-audio"
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Niên Đại / Thời Kỳ"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="Ví dụ: Thế kỷ XIX (1833), Thời Lý..."
            />
            <TextField
              fullWidth
              size="small"
              label="Tác Giả / Nguồn Dữ Liệu"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Ban Quản Trị Di Sản, Viện Sử Học..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2D7C7' }}>
          <Button onClick={() => setIsDialogOpen(false)} variant="outlined" color="inherit">
            Hủy Bỏ
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
            {editingStory ? 'Lưu Thay Đổi' : 'Tạo Câu Chuyện'}
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
