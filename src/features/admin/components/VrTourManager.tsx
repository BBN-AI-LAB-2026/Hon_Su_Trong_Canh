import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';
import {
  vrTourAdminService,
  EmbeddedVrSpace,
  VrOptionKey,
  VrOptionType,
} from '../../vr-tour/services/vrTourAdminService';
import { EmbeddedVrViewer } from '../../vr-tour/components/EmbeddedVrViewer';

export const VrTourManager: React.FC = () => {
  const [spaces, setSpaces] = useState<EmbeddedVrSpace[]>(() => vrTourAdminService.getEmbeddedSpaces());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'has_url' | 'pending_url' | 'A' | 'B' | 'C'>('all');

  // Edit dialog state - Mặc định Lựa chọn C (URL sẽ cấp sau)
  const [editOpen, setEditOpen] = useState(false);
  const [editingMonument, setEditingMonument] = useState<{ code: string; name: string } | null>(null);
  const [formOption, setFormOption] = useState<VrOptionKey>('C');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSpace, setPreviewSpace] = useState<EmbeddedVrSpace | null>(null);

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const reloadData = () => {
    setSpaces(vrTourAdminService.getEmbeddedSpaces());
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ 14 liên kết VR 360 Tour (Lựa chọn C) về danh mục URL chuẩn của Ban quản trị?')) {
      vrTourAdminService.resetToOfficialDefaults();
      reloadData();
      setSnackbar({
        open: true,
        message: 'Đã khôi phục thành công 14 đường dẫn VR 360 Tour (Lựa chọn C) chuẩn Ban quản trị!',
        severity: 'success',
      });
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      reloadData();
    };
    window.addEventListener('ditich_vr_spaces_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_vr_spaces_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleOpenEdit = (monumentCode: string, monumentName: string) => {
    const current = spaces.find((s) => s.monumentCode === monumentCode);
    const heritageMeta = ORDERED_HERITAGE_LIST.find((m) => m.code === monumentCode);
    setEditingMonument({ code: monumentCode, name: monumentName });

    if (current) {
      const opt: VrOptionKey =
        current.vrOption ||
        (current.embedType === 'panorama_image' ? 'A' : current.embedType === 'iframe' ? 'B' : 'C');
      setFormOption(opt);
      setFormTitle(current.title);
      setFormLocation(current.location || heritageMeta?.location || 'Việt Nam');
      setFormUrl(current.rawEmbedCode || current.embedUrl || '');
      setFormDescription(current.description || '');
    } else {
      // Mặc định là Lựa chọn C (URL sẽ cấp sau)
      setFormOption('C');
      setFormTitle(`VR 360: ${monumentName}`);
      setFormLocation(heritageMeta?.location || 'Việt Nam');
      setFormUrl('');
      setFormDescription('Không gian VR 360° (Lựa chọn C - URL sẽ cấp sau).');
    }
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMonument) return;

    // Kiểm tra tính hợp lệ theo từng option:
    // Option A & B bắt buộc URL, Option C cho phép để trống (sẽ cấp sau)
    if (formOption === 'A' && !formUrl.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đường dẫn URL ảnh Panorama 360° (từ Cloudinary) cho Lựa chọn A!',
        severity: 'error',
      });
      return;
    }

    if (formOption === 'B' && !formUrl.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập mã nhúng Iframe hoặc đường dẫn tour cho Lựa chọn B!',
        severity: 'error',
      });
      return;
    }

    let cleanUrl = formUrl.trim();
    let rawEmbedCode: string | undefined = undefined;
    if (formOption === 'B' || (formOption === 'C' && cleanUrl.includes('<iframe'))) {
      if (formOption === 'B') {
        rawEmbedCode = formUrl.trim();
      }
      const iframeMatch = cleanUrl.match(/src=["']([^"']+)["']/);
      if (iframeMatch) {
        cleanUrl = iframeMatch[1].replace(/&amp;/g, '&');
      } else if (cleanUrl.includes('panoee.net') || cleanUrl.includes('/iframe/')) {
        cleanUrl = cleanUrl.replace(/&amp;/g, '&');
      }
    }

    const embedType: VrOptionType =
      formOption === 'A' ? 'panorama_image' : formOption === 'B' ? 'iframe' : 'external_url';

    vrTourAdminService.saveSpaceForMonument({
      monumentCode: editingMonument.code,
      title: formTitle.trim() || `VR 360: ${editingMonument.name}`,
      location: formLocation.trim() || 'Việt Nam',
      embedType,
      vrOption: formOption,
      embedUrl: cleanUrl,
      rawEmbedCode,
      description:
        formDescription.trim() ||
        (formOption === 'C' && !cleanUrl ? 'Không gian VR 360° (Lựa chọn C - URL sẽ cấp sau).' : ''),
    });

    reloadData();
    setEditOpen(false);
    setSnackbar({
      open: true,
      message: `Đã lưu cấu hình VR 360° (Lựa chọn ${formOption}) cho ${editingMonument.name}!`,
      severity: 'success',
    });
  };

  const handleDelete = (monumentCode: string, monumentName: string) => {
    vrTourAdminService.deleteSpaceForMonument(monumentCode);
    reloadData();
    setSnackbar({
      open: true,
      message: `Đã xóa cấu hình VR 360° của ${monumentName}`,
      severity: 'info',
    });
  };

  const handleOpenPreview = (space: EmbeddedVrSpace) => {
    setPreviewSpace(space);
    setPreviewOpen(true);
  };

  // Thống kê
  const hasUrlCount = ORDERED_HERITAGE_LIST.filter((m) => {
    const s = spaces.find((sp) => sp.monumentCode === m.code);
    return Boolean(s && s.embedUrl && s.embedUrl.trim());
  }).length;

  const pendingUrlCount = ORDERED_HERITAGE_LIST.length - hasUrlCount;

  // Filter monuments list
  const filteredList = ORDERED_HERITAGE_LIST.filter((monument) => {
    const space = spaces.find((s) => s.monumentCode === monument.code);
    const matchesSearch =
      monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monument.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (space?.title && space.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (space?.location && space.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const opt =
      space?.vrOption ||
      (space?.embedType === 'panorama_image' ? 'A' : space?.embedType === 'iframe' ? 'B' : 'C');

    if (typeFilter === 'has_url') {
      return Boolean(space && space.embedUrl && space.embedUrl.trim());
    }
    if (typeFilter === 'pending_url') {
      return !space || !space.embedUrl || !space.embedUrl.trim();
    }
    if (typeFilter === 'A') {
      return opt === 'A';
    }
    if (typeFilter === 'B') {
      return opt === 'B';
    }
    if (typeFilter === 'C') {
      return opt === 'C';
    }

    return true;
  });

  return (
    <Box>
      {/* Header Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewInArIcon color="primary" />
          Quản Lý Cấu Hình Thực Tế Ảo VR 360 Tour (3 Phương Án: A, B, C)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Hỗ trợ 3 phương án cấu hình VR 360°: <strong>Lựa chọn A</strong> (Ảnh panorama 360 Cloudinary), <strong>Lựa chọn B</strong> (Embed/Nhúng Iframe), và <strong>Lựa chọn C</strong> (Nhập URL mở tab mới — Mặc định, URL sẽ cấp sau).
        </Typography>

        {/* Search & Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm theo tên hoặc mã di tích..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 280, bgcolor: '#FAF7F0' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Tất cả (${ORDERED_HERITAGE_LIST.length})`}
              clickable
              color={typeFilter === 'all' ? 'primary' : 'default'}
              variant={typeFilter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('all')}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Lựa chọn C: Nhập URL (${spaces.filter((s) => (s.vrOption || (s.embedType === 'external_url' ? 'C' : '')) === 'C').length})`}
              clickable
              color={typeFilter === 'C' ? 'primary' : 'default'}
              variant={typeFilter === 'C' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('C')}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Lựa chọn B: Emebed (${spaces.filter((s) => (s.vrOption || (s.embedType === 'iframe' ? 'B' : '')) === 'B').length})`}
              clickable
              color={typeFilter === 'B' ? 'secondary' : 'default'}
              variant={typeFilter === 'B' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('B')}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Lựa chọn A: Ảnh 360 (${spaces.filter((s) => (s.vrOption || (s.embedType === 'panorama_image' ? 'A' : '')) === 'A').length})`}
              clickable
              color={typeFilter === 'A' ? 'warning' : 'default'}
              variant={typeFilter === 'A' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('A')}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Đã có URL (${hasUrlCount})`}
              clickable
              color={typeFilter === 'has_url' ? 'success' : 'default'}
              variant={typeFilter === 'has_url' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('has_url')}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Chờ cấp URL (${pendingUrlCount})`}
              clickable
              color={typeFilter === 'pending_url' ? 'warning' : 'default'}
              variant={typeFilter === 'pending_url' ? 'filled' : 'outlined'}
              onClick={() => setTypeFilter('pending_url')}
              sx={{ fontWeight: 700 }}
            />

            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={handleResetDefaults}
              sx={{
                ml: { xs: 0, sm: 'auto' },
                textTransform: 'none',
                fontWeight: 700,
                borderColor: '#C2A383',
                color: '#8B4513',
                '&:hover': {
                  borderColor: '#8B4513',
                  bgcolor: '#FAF7F0',
                },
              }}
            >
              Khôi Phục 14 URL Chuẩn (Lựa Chọn C)
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#E5DAC9' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAF7F0' }}>
              <TableCell sx={{ fontWeight: 700, width: 50 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>Mã Di Tích</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 220 }}>Tên Di Tích</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 190 }}>Phương Án VR 360</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thông Tin Cấu Hình & URL</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 140 }}>Trạng Thái URL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 220 }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((monument, idx) => {
              const space = spaces.find((s) => s.monumentCode === monument.code);
              const opt: VrOptionKey =
                space?.vrOption ||
                (space?.embedType === 'panorama_image' ? 'A' : space?.embedType === 'iframe' ? 'B' : 'C');
              const hasUrl = Boolean(space && space.embedUrl && space.embedUrl.trim());

              return (
                <TableRow
                  key={monument.code}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: hasUrl ? 'inherit' : 'rgba(255, 248, 235, 0.4)',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={monument.code}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        bgcolor: 'rgba(200, 157, 53, 0.15)',
                        color: 'primary.dark',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {monument.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {monument.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {opt === 'A' ? (
                      <Chip
                        label="Lựa chọn A: Ảnh panorama 360 (Cloudinary)"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    ) : opt === 'B' ? (
                      <Chip
                        label="Lựa chọn B: Emebed (Nhúng)"
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    ) : (
                      <Chip
                        label="Lựa chọn C: Nhập URL (Mở tab mới)"
                        size="small"
                        color="primary"
                        variant="filled"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          bgcolor: 'rgba(200, 157, 53, 0.18)',
                          color: '#8C6718',
                          border: '1px solid #C89D35',
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {space ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {space.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          📍 {space.location || monument.location}
                        </Typography>
                        {hasUrl ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'primary.main',
                                fontFamily: 'monospace',
                                display: 'block',
                                maxWidth: 280,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {space.embedUrl}
                            </Typography>
                            {opt === 'C' && (
                              <IconButton
                                size="small"
                                sx={{ p: 0.2, color: '#C89D35' }}
                                title="Mở thử nghiệm trong tab mới"
                                onClick={() => {
                                  const url = space.embedUrl.trim().startsWith('http')
                                    ? space.embedUrl.trim()
                                    : `https://${space.embedUrl.trim()}`;
                                  window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                <OpenInNewIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#D97706', fontStyle: 'italic', fontWeight: 600, display: 'block', mt: 0.3 }}>
                            ⏳ URL sẽ cấp sau
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Lựa chọn C (Mặc định - URL sẽ cấp sau)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {hasUrl ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="Đã có URL"
                        size="small"
                        color="success"
                        variant="filled"
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    ) : (
                      <Chip
                        label="URL sẽ cấp sau"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                      {space && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<ViewInArIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleOpenPreview(space)}
                          sx={{ fontSize: '0.75rem', py: 0.4, px: 1, fontWeight: 700 }}
                        >
                          Xem
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleOpenEdit(monument.code, monument.name)}
                        sx={{ fontSize: '0.75rem', py: 0.4, px: 1, fontWeight: 700 }}
                      >
                        Sửa
                      </Button>
                      {space && space.isCustom && (
                        <Tooltip title="Xóa cấu hình tự đặt của di tích này">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(monument.code, monument.name)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit/Configure Modal with 3 Options: A, B, C */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 800, color: 'primary.dark' }}>
          Cấu Hình VR 360 Tour Cho Di Tích
          {editingMonument && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Di tích: <strong>{editingMonument.name}</strong> ({editingMonument.code})
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Lựa chọn 3 phương án A, B, C */}
          <FormControl component="fieldset" sx={{ mb: 2.5, width: '100%' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#2C1810', mb: 1 }}>
              Lựa chọn 1 trong 3 phương án VR 360 (Mặc định là C):
            </FormLabel>
            <RadioGroup
              value={formOption}
              onChange={(e) => setFormOption(e.target.value as VrOptionKey)}
              sx={{ gap: 1 }}
            >
              {/* Lựa chọn A */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: formOption === 'A' ? '#C89D35' : '#E8E1D5',
                  bgcolor: formOption === 'A' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="A"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: formOption === 'A' ? '#8C6718' : '#2C1810' }}>
                        Ảnh panorama 360 (nhập từ cloudinary): Lựa chọn A
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Nhập ảnh panorama 360 độ từ Cloudinary, hiển thị trực quan xoay toàn cảnh trên Canvas.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>

              {/* Lựa chọn B */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: formOption === 'B' ? '#C89D35' : '#E8E1D5',
                  bgcolor: formOption === 'B' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="B"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: formOption === 'B' ? '#8C6718' : '#2C1810' }}>
                        Emebed (Nhúng): Lựa chọn B
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Nhúng iframe trực tiếp từ Panoee, Kuula, Matterport... hiển thị ngay trong trang.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>

              {/* Lựa chọn C (Mặc định) */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: formOption === 'C' ? '#C89D35' : '#E8E1D5',
                  bgcolor: formOption === 'C' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="C"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: formOption === 'C' ? '#8C6718' : '#2C1810' }}>
                          Nhập URL (Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập): Lựa chọn C
                        </Typography>
                        <Chip
                          label="Mặc định - URL sẽ cấp sau"
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                        Phương án mặc định. Quản trị viên có thể để trống và cấp URL sau. Khi người dùng nhấp vào nút sẽ mở sang một tab mới là URL đã nhập.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>

          <TextField
            label="Tiêu Đề Không Gian 360°"
            fullWidth
            size="small"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Địa Điểm / Tỉnh Thành"
            fullWidth
            size="small"
            value={formLocation}
            onChange={(e) => setFormLocation(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Dynamic input according to Option A, B, C */}
          <TextField
            label={
              formOption === 'A'
                ? 'Ảnh panorama 360 (nhập từ cloudinary)'
                : formOption === 'B'
                ? 'Emebed (Nhúng) - Mã nhúng iframe hoặc link tour VR 360'
                : 'Nhập URL (Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập)'
            }
            placeholder={
              formOption === 'A'
                ? 'https://res.cloudinary.com/.../image/upload/...jpg'
                : formOption === 'B'
                ? 'https://tour.panoee.net/... hoặc <iframe src="..."></iframe>'
                : 'https://... (Mặc định để trống nếu URL sẽ cấp sau)'
            }
            fullWidth
            multiline={formOption === 'B'}
            rows={formOption === 'B' ? 2 : 1}
            size="small"
            required={formOption === 'A' || formOption === 'B'}
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            helperText={
              formOption === 'C'
                ? 'Lựa chọn C (Mặc định): URL có thể để trống và cấp sau. Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập.'
                : formOption === 'A'
                ? 'Lựa chọn A: Nhập link ảnh panorama 360 toàn cảnh từ Cloudinary.'
                : 'Lựa chọn B: Nhập mã nhúng <iframe> hoặc link tour để nhúng trực tiếp vào giao diện.'
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Mô Tả / Điểm Nhấn Kiến Trúc (Tùy chọn)"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Hủy Bỏ
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            Lưu Cấu Hình
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2, overflow: 'hidden' } } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#1A1410',
            color: '#FAF6F0',
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewInArIcon sx={{ color: '#DEC067' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#FAF6F0' }}>
              Xem Trước: {previewSpace?.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {previewSpace?.embedUrl && (
              <IconButton
                size="small"
                onClick={() => {
                  const url = previewSpace.embedUrl.trim().startsWith('http')
                    ? previewSpace.embedUrl.trim()
                    : `https://${previewSpace.embedUrl.trim()}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                sx={{ color: '#DEC067' }}
                title="Mở trong tab mới"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => setPreviewOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#000', minHeight: 460 }}>
          {previewSpace && (
            <Box sx={{ width: '100%', minHeight: 480 }}>
              <EmbeddedVrViewer space={previewSpace} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1A1410', py: 1, px: 2 }}>
          <Typography variant="caption" sx={{ color: '#A09282', mr: 'auto' }}>
            Phương án: {
              previewSpace?.vrOption === 'A' || previewSpace?.embedType === 'panorama_image'
                ? 'Lựa chọn A: Ảnh panorama 360 (nhập từ cloudinary)'
                : previewSpace?.vrOption === 'B' || previewSpace?.embedType === 'iframe'
                ? 'Lựa chọn B: Emebed (Nhúng)'
                : 'Lựa chọn C: Nhập URL (Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập) — [Mặc định]'
            }
          </Typography>
          <Button onClick={() => setPreviewOpen(false)} sx={{ color: '#DEC067', fontWeight: 700 }}>
            Đóng Xem Trước
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
