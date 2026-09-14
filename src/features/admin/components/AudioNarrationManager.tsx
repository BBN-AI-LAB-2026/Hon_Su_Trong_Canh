import React, { useState, useEffect, useRef } from 'react';
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LinkIcon from '@mui/icons-material/Link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';
import { audioNarrationService, MonumentAudioNarration } from '../../recognition/services/audioNarrationService';

export const AudioNarrationManager: React.FC = () => {
  const [narrations, setNarrations] = useState<Record<string, MonumentAudioNarration>>(() =>
    audioNarrationService.getAllAudioNarrations()
  );

  const [selectedMonumentCode, setSelectedMonumentCode] = useState<string>(
    ORDERED_HERITAGE_LIST[0].code
  );
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [narrator, setNarrator] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Audio test playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string>('');
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const refreshList = () => {
    setNarrations(audioNarrationService.getAllAudioNarrations());
  };

  useEffect(() => {
    window.addEventListener('ditich_audio_narrations_updated', refreshList);
    return () => window.removeEventListener('ditich_audio_narrations_updated', refreshList);
  }, []);

  // Sync selected monument with existing data
  useEffect(() => {
    const existing = narrations[selectedMonumentCode];
    if (existing) {
      setAudioUrl(existing.audioUrl);
      setTitle(existing.title || '');
      setNarrator(existing.narrator || '');
      setNotes(existing.notes || '');
    } else {
      const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === selectedMonumentCode);
      setAudioUrl('');
      setTitle(monument ? `Bản đọc thuyết minh di tích ${monument.name}` : '');
      setNarrator('Thuyết minh viên');
      setNotes('');
    }
    // Stop any ongoing test playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
    setAudioError('');
  }, [selectedMonumentCode, narrations]);

  const handleSave = () => {
    const trimmed = audioUrl.trim();
    if (!trimmed) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đường dẫn link Audio (bắt đầu bằng http:// hoặc https://).',
        severity: 'error',
      });
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setSnackbar({
        open: true,
        message: 'Đường dẫn link Audio không hợp lệ (phải bắt đầu bằng http:// hoặc https://).',
        severity: 'error',
      });
      return;
    }

    const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === selectedMonumentCode);

    audioNarrationService.saveAudioNarration({
      monumentCode: selectedMonumentCode,
      audioUrl: trimmed,
      title: title.trim() || (monument ? `Bản đọc thuyết minh di tích ${monument.name}` : 'Bản đọc thuyết minh'),
      narrator: narrator.trim(),
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });

    setSnackbar({
      open: true,
      message: `Đã lưu thành công link Audio thuyết minh cho di tích ${monument?.name || selectedMonumentCode}!`,
      severity: 'success',
    });
  };

  const handleDelete = (code: string) => {
    const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === code);
    if (window.confirm(`Bạn có chắc muốn xóa link Audio của di tích "${monument?.name || code}"?`)) {
      audioNarrationService.deleteAudioNarration(code);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      }
      setSnackbar({
        open: true,
        message: `Đã xóa link Audio của di tích ${monument?.name || code}.`,
        severity: 'info',
      });
    }
  };

  const toggleTestPlayback = () => {
    if (!audioPlayerRef.current || !audioUrl.trim()) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioError('');
      audioPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
        setAudioError('Không thể phát âm thanh từ link này. Vui lòng kiểm tra định dạng hoặc quyền truy cập của file audio.');
      });
    }
  };

  const configuredCount = ORDERED_HERITAGE_LIST.filter((m) => Boolean(narrations[m.code]?.audioUrl)).length;

  const handleResetCloudinaryDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ liên kết Audio thuyết minh Cloudinary mặc định từ danh sách chuẩn?')) {
      audioNarrationService.resetToCloudinaryDefaults();
      setSnackbar({
        open: true,
        message: 'Đã nạp và khôi phục thành công các liên kết Audio thuyết minh Cloudinary chuẩn!',
        severity: 'success',
      });
    }
  };

  return (
    <Box id="admin-audio-narration-manager">
      {/* Top Banner */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HeadphonesIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Quản Trị Bản Đọc Thuyết Minh (Audio)
            </Typography>
            <Chip
              label={`Đã cấu hình: ${configuredCount}/${ORDERED_HERITAGE_LIST.length} di tích`}
              color={configuredCount > 0 ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Nhập đường dẫn link tệp âm thanh thuyết minh (Cloudinary MP3, WAV, Stream URL) cho từng di tích. Bản đọc này sẽ được phát trực tiếp tại phần hiển thị kết quả sau khi Nhận Diện di tích.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={handleResetCloudinaryDefaults}
          sx={{ borderColor: '#D6C7B2', fontWeight: 700 }}
          id="btn-reset-cloudinary-audios"
        >
          Khôi Phục Link Cloudinary Chuẩn
        </Button>
      </Box>

      {/* Grid for Form + Live Audio Test */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Form Input Box */}
        <Box>
          <Card sx={{ p: 2.5, border: '1px solid #E2D7C7', bgcolor: '#FAF7F0', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon sx={{ color: 'secondary.main' }} />
              Cập Nhật Link Audio Theo Di Tích
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Select Monument */}
              <FormControl fullWidth size="small">
                <InputLabel id="select-audio-monument-label">Chọn Di Tích Cần Cấu Hình</InputLabel>
                <Select
                  labelId="select-audio-monument-label"
                  label="Chọn Di Tích Cần Cấu Hình"
                  value={selectedMonumentCode}
                  onChange={(e) => setSelectedMonumentCode(e.target.value)}
                  id="admin-audio-select-monument"
                >
                  {ORDERED_HERITAGE_LIST.map((monument) => {
                    const isConfigured = Boolean(narrations[monument.code]?.audioUrl);
                    return (
                      <MenuItem key={monument.code} value={monument.code}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>
                            <strong>[{monument.code}]</strong> {monument.name}
                          </span>
                          {isConfigured ? (
                            <Chip label="Đã có audio" size="small" color="success" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          ) : (
                            <Chip label="Chưa có link" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Audio URL Input */}
              <TextField
                fullWidth
                size="small"
                label="Đường Dẫn Link Audio Thuyết Minh (Bắt Buộc)"
                placeholder="https://res.cloudinary.com/inwwexot/video/upload/.../audio.mp3"
                value={audioUrl}
                onChange={(e) => {
                  setAudioUrl(e.target.value);
                  setIsPlaying(false);
                }}
                helperText="Hỗ trợ link trực tiếp file âm thanh Cloudinary (MP3, WAV, M4A, OGG) hoặc link stream trực tuyến."
                id="input-admin-audio-url"
              />

              {/* Title & Narrator */}
              <TextField
                fullWidth
                size="small"
                label="Tiêu Đề Bản Đọc Thuyết Minh (Tùy chọn)"
                placeholder="Ví dụ: Thuyết minh lịch sử và kiến trúc Chùa Một Cột"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                fullWidth
                size="small"
                label="Người Thuyết Minh / Đơn Vị Phát Hành (Tùy chọn)"
                placeholder="Ví dụ: Ban Quản lý Di tích • Thuyết minh viên Thu Hường"
                value={narrator}
                onChange={(e) => setNarrator(e.target.value)}
              />

              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Ghi Chú Quản Trị (Tùy chọn)"
                placeholder="Thời lượng, nguồn bản quyền, ghi chú nội bộ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  id="btn-admin-save-audio"
                  sx={{ fontWeight: 700, px: 3 }}
                >
                  Lưu Link Audio
                </Button>

                {audioUrl.trim() && (
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => window.open(audioUrl.trim(), '_blank')}
                    sx={{ borderColor: '#D6C7B2', color: 'primary.dark' }}
                  >
                    Mở Link Tab Mới
                  </Button>
                )}

                {narrations[selectedMonumentCode] && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(selectedMonumentCode)}
                  >
                    Xóa Link
                  </Button>
                )}
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Live Audio Test Player */}
        <Box>
          <Card sx={{ p: 2.5, border: '1px solid #E2D7C7', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AudiotrackIcon sx={{ color: 'secondary.main' }} />
                Trình Phát Âm Thanh Kiểm Tra (Audio Test)
              </Typography>
              <Chip
                label={ORDERED_HERITAGE_LIST.find((m) => m.code === selectedMonumentCode)?.name || selectedMonumentCode}
                size="small"
                sx={{ fontWeight: 700, bgcolor: 'rgba(200, 157, 53, 0.15)', color: 'primary.dark' }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                minHeight: 260,
                border: '1px solid #E6DCCD',
                borderRadius: 2,
                bgcolor: '#FAF7F0',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
              }}
            >
              {audioUrl.trim() ? (
                <>
                  <Box
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      bgcolor: isPlaying ? 'secondary.main' : '#FFFFFF',
                      color: isPlaying ? '#FFFFFF' : 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(200, 157, 53, 0.25)',
                      border: '2px solid #C89D35',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'scale(1.06)' },
                    }}
                    onClick={toggleTestPlayback}
                  >
                    {isPlaying ? <PauseIcon sx={{ fontSize: 36 }} /> : <PlayArrowIcon sx={{ fontSize: 36 }} />}
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                      {title || 'Bản đọc thuyết minh'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {narrator || 'Thuyết minh viên'}
                    </Typography>
                  </Box>

                  {/* Native HTML5 Audio Controller */}
                  <audio
                    ref={audioPlayerRef}
                    src={audioUrl.trim()}
                    controls
                    style={{ width: '100%', maxWidth: 360, marginTop: 8 }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      setIsPlaying(false);
                      setAudioError('Không thể nạp tệp âm thanh từ liên kết này. Vui lòng kiểm tra định dạng hoặc đường dẫn CORS.');
                    }}
                  />

                  {audioError && (
                    <Alert severity="error" sx={{ width: '100%', fontSize: '0.82rem', textAlign: 'left' }}>
                      {audioError}
                    </Alert>
                  )}
                </>
              ) : (
                <Box sx={{ color: 'text.secondary' }}>
                  <HeadphonesIcon sx={{ fontSize: 52, color: '#D5C8B4', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Chưa nhập link file âm thanh thuyết minh
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Nhập URL âm thanh ở form bên trái để phát thử nghiệm kiểm tra chất lượng bản thu.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* 13 Monuments Table */}
      <Box sx={{ mt: 3 }}>
        <Card sx={{ border: '1px solid #E2D7C7' }}>
          <Box sx={{ p: 2, bgcolor: '#FAF7F0', borderBottom: '1px solid #E2D7C7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Danh Sách Trạng Thái Audio Thuyết Minh Của 13 Di Tích
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Nhấn biểu tượng Sửa (bút) để nạp link audio cho di tích tương ứng
            </Typography>
          </Box>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F5EFE6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, width: 80 }}>Mã</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 220 }}>Tên Di Tích</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 140 }}>Trạng Thái</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 200 }}>Tiêu Đề Bản Đọc</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Đường Dẫn Link Audio</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 120, textAlign: 'center' }}>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ORDERED_HERITAGE_LIST.map((monument) => {
                  const item = narrations[monument.code];
                  const isSelected = selectedMonumentCode === monument.code;
                  const hasLink = Boolean(item?.audioUrl);

                  return (
                    <TableRow
                      key={monument.code}
                      sx={{
                        bgcolor: isSelected ? 'rgba(200, 157, 53, 0.08)' : 'inherit',
                        '&:hover': { bgcolor: 'rgba(200, 157, 53, 0.04)' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {monument.code}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {monument.name}
                      </TableCell>
                      <TableCell>
                        {hasLink ? (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                            label="Đã có Audio"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 700, height: 22 }}
                          />
                        ) : (
                          <Chip
                            label="Chưa có link"
                            size="small"
                            variant="outlined"
                            sx={{ height: 22, color: 'text.disabled', borderColor: '#D5C8B4' }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item?.title || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        {hasLink ? (
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: 'secondary.dark',
                            }}
                          >
                            {item.audioUrl}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                            Chưa nhập link audio
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="Chọn để chỉnh sửa link">
                          <IconButton
                            size="small"
                            color={isSelected ? 'secondary' : 'default'}
                            onClick={() => setSelectedMonumentCode(monument.code)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {hasLink && (
                          <>
                            <Tooltip title="Mở link trong tab mới">
                              <IconButton
                                size="small"
                                onClick={() => window.open(item.audioUrl, '_blank')}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa link">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(monument.code)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
