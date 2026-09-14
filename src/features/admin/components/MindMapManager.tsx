import React, { useState, useEffect } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';
import {
  mindmapService,
  MonumentMindMap,
  MindMapContentType,
  detectMindMapType,
} from '../../recognition/services/mindmapService';

export const MindMapManager: React.FC = () => {
  const [mindmaps, setMindmaps] = useState<Record<string, MonumentMindMap>>(() =>
    mindmapService.getAllMindMaps()
  );

  const [selectedMonumentCode, setSelectedMonumentCode] = useState<string>(
    ORDERED_HERITAGE_LIST[0].code
  );
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkType, setLinkType] = useState<MindMapContentType>('video');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const refreshList = () => {
    setMindmaps(mindmapService.getAllMindMaps());
  };

  useEffect(() => {
    window.addEventListener('ditich_mindmaps_updated', refreshList);
    return () => window.removeEventListener('ditich_mindmaps_updated', refreshList);
  }, []);

  // When selected monument changes, populate fields
  useEffect(() => {
    const existing = mindmaps[selectedMonumentCode];
    if (existing) {
      setLinkUrl(existing.content || '');
      setLinkType(existing.type || 'iframe');
      setTitle(existing.title || '');
      setDescription(existing.description || '');
    } else {
      const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === selectedMonumentCode);
      setLinkUrl('');
      setLinkType('iframe');
      setTitle(monument ? `Sơ đồ kiến thức ${monument.name}` : '');
      setDescription('');
    }
  }, [selectedMonumentCode, mindmaps]);

  const handleResetCloudinaryDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ liên kết video MindMap Cloudinary mặc định từ danh sách chuẩn?')) {
      mindmapService.resetToCloudinaryDefaults();
      setSnackbar({
        open: true,
        message: 'Đã nạp và khôi phục thành công các liên kết video MindMap Cloudinary chuẩn!',
        severity: 'success',
      });
    }
  };

  const handleUrlChange = (val: string) => {
    setLinkUrl(val);
    if (val.trim()) {
      const detected = detectMindMapType(val.trim());
      setLinkType(detected);
    }
  };

  const handleSave = () => {
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đường dẫn link sơ đồ MindMap (bắt đầu bằng http:// hoặc https://).',
        severity: 'error',
      });
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setSnackbar({
        open: true,
        message: 'Đường dẫn liên kết không hợp lệ. Vui lòng nhập link đầy đủ (ví dụ: https://...).',
        severity: 'error',
      });
      return;
    }

    const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === selectedMonumentCode);

    mindmapService.saveMindMap({
      monumentCode: selectedMonumentCode,
      content: trimmed,
      type: linkType,
      title: title.trim() || (monument ? `Sơ đồ kiến thức ${monument.name}` : 'Sơ đồ kiến thức'),
      description: description.trim(),
      updatedAt: new Date().toISOString(),
    });

    setSnackbar({
      open: true,
      message: `Đã lưu thành công link MindMap cho di tích ${monument?.name || selectedMonumentCode}!`,
      severity: 'success',
    });
  };

  const handleDelete = (code: string) => {
    const monument = ORDERED_HERITAGE_LIST.find((m) => m.code === code);
    if (window.confirm(`Bạn có chắc muốn xóa link sơ đồ MindMap của di tích "${monument?.name || code}"?`)) {
      mindmapService.deleteMindMap(code);
      setSnackbar({
        open: true,
        message: `Đã xóa link MindMap của di tích ${monument?.name || code}.`,
        severity: 'info',
      });
    }
  };

  const configuredCount = ORDERED_HERITAGE_LIST.filter((m) => Boolean(mindmaps[m.code]?.content)).length;

  return (
    <Box id="admin-mindmap-manager">
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
            <AccountTreeIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Quản Trị Sơ Đồ Kiến Thức (MindMap)
            </Typography>
            <Chip
              label={`Đã cấu hình: ${configuredCount}/${ORDERED_HERITAGE_LIST.length} di tích`}
              color={configuredCount > 0 ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Nhập đường dẫn link sơ đồ tư duy (Video Cloudinary MP4, Embed iframe hoặc Ảnh) cho từng di tích. Sơ đồ này sẽ được hiển thị trực tiếp ở Bước 3 &quot;Sơ đồ kiến thức&quot; trong hành trình nhận diện.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={handleResetCloudinaryDefaults}
          sx={{ borderColor: '#D6C7B2', fontWeight: 700 }}
          id="btn-reset-cloudinary-mindmaps"
        >
          Khôi Phục Link Cloudinary Chuẩn
        </Button>
      </Box>

      {/* Grid for Form + Live Preview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Form Configuration Box */}
        <Box>
          <Card sx={{ p: 2.5, border: '1px solid #E2D7C7', bgcolor: '#FAF7F0', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon sx={{ color: 'secondary.main' }} />
              Cập Nhật Link MindMap Theo Di Tích
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Select Monument */}
              <FormControl fullWidth size="small">
                <InputLabel id="select-monument-label">Chọn Di Tích Cần Cấu Hình</InputLabel>
                <Select
                  labelId="select-monument-label"
                  label="Chọn Di Tích Cần Cấu Hình"
                  value={selectedMonumentCode}
                  onChange={(e) => setSelectedMonumentCode(e.target.value)}
                  id="admin-mindmap-select-monument"
                >
                  {ORDERED_HERITAGE_LIST.map((monument) => {
                    const isConfigured = Boolean(mindmaps[monument.code]?.content);
                    return (
                      <MenuItem key={monument.code} value={monument.code}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>
                            <strong>[{monument.code}]</strong> {monument.name}
                          </span>
                          {isConfigured ? (
                            <Chip label="Đã có link" size="small" color="success" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          ) : (
                            <Chip label="Chưa có link" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* URL Input */}
              <TextField
                fullWidth
                size="small"
                label="Đường Dẫn Link Sơ Đồ MindMap (Bắt Buộc)"
                placeholder="https://res.cloudinary.com/.../video.mp4 hoặc https://coggle.it/... hoặc ảnh"
                value={linkUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                helperText="Hỗ trợ link Video Cloudinary (.mp4), link khung nhúng (iframe) từ Coggle/Miro/Canva hoặc link ảnh (PNG, JPG, SVG)."
                id="input-admin-mindmap-url"
              />

              {/* Format / Type Option */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Định Dạng Hiển Thị
                </Typography>
                <RadioGroup
                  row
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as MindMapContentType)}
                >
                  <FormControlLabel
                    value="video"
                    control={<Radio size="small" color="secondary" />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Video MindMap (Cloudinary Video / MP4)</Typography>}
                  />
                  <FormControlLabel
                    value="iframe"
                    control={<Radio size="small" color="secondary" />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Khung nhúng web (Iframe / Embed URL)</Typography>}
                  />
                  <FormControlLabel
                    value="image"
                    control={<Radio size="small" color="secondary" />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Link tệp ảnh (Image URL: PNG, JPG)</Typography>}
                  />
                </RadioGroup>
              </Box>

              {/* Title & Notes */}
              <TextField
                fullWidth
                size="small"
                label="Tiêu Đề Sơ Đồ (Tùy chọn)"
                placeholder="Ví dụ: Sơ đồ tư duy lịch sử và kiến trúc Chùa Một Cột"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Ghi Chú / Nguồn Sơ Đồ (Tùy chọn)"
                placeholder="Mô tả tóm tắt nội dung các nhánh kiến thức hoặc nguồn tài liệu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  id="btn-admin-save-mindmap"
                  sx={{ fontWeight: 700, px: 3 }}
                >
                  Lưu Link MindMap
                </Button>

                {linkUrl.trim() && (
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => window.open(linkUrl.trim(), '_blank')}
                    sx={{ borderColor: '#D6C7B2', color: 'primary.dark' }}
                  >
                    Mở Link Tab Mới
                  </Button>
                )}

                {mindmaps[selectedMonumentCode] && (
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

        {/* Live Preview Container */}
        <Box>
          <Card sx={{ p: 2.5, border: '1px solid #E2D7C7', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon sx={{ color: 'secondary.main' }} />
                Xem Thử Khung MindMap Trực Quan
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
                minHeight: 320,
                border: '1px dashed #D5C8B4',
                borderRadius: 1.5,
                bgcolor: '#FBF9F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {linkUrl.trim() ? (
                linkType === 'video' ||
                linkUrl.includes('/video/upload/') ||
                linkUrl.toLowerCase().endsWith('.mp4') ||
                linkUrl.toLowerCase().endsWith('.webm') ? (
                  <Box
                    component="video"
                    src={linkUrl.trim()}
                    controls
                    playsInline
                    autoPlay
                    muted
                    loop
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 380,
                      objectFit: 'contain',
                      borderRadius: 1,
                      bgcolor: '#000000',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                  />
                ) : linkType === 'image' ? (
                  <Box
                    component="img"
                    src={linkUrl.trim()}
                    alt="Mindmap Preview"
                    sx={{
                      maxWidth: '95%',
                      maxHeight: 380,
                      objectFit: 'contain',
                      borderRadius: 1,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Box
                    component="iframe"
                    src={linkUrl.trim()}
                    title="Mindmap Live Preview"
                    sx={{
                      width: '100%',
                      height: 380,
                      border: 'none',
                      borderRadius: 1,
                    }}
                  />
                )
              ) : (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <AccountTreeIcon sx={{ fontSize: 48, color: '#D5C8B4', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Chưa nhập link sơ đồ MindMap
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Nhập đường dẫn link ở cột bên trái để xem thử giao diện hiển thị ngay tại đây.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* List of 14 Monuments Table */}
      <Box sx={{ mt: 3 }}>
        <Card sx={{ border: '1px solid #E2D7C7' }}>
          <Box sx={{ p: 2, bgcolor: '#FAF7F0', borderBottom: '1px solid #E2D7C7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Danh Sách Trạng Thái MindMap Của 14 Di Tích
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Nhấn biểu tượng Sửa (bút) để nhanh chóng chọn và cập nhật link cho di tích đó
            </Typography>
          </Box>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F5EFE6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, width: 80 }}>Mã</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 220 }}>Tên Di Tích</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 140 }}>Trạng Thái</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 120 }}>Định Dạng</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Đường Dẫn Link MindMap</TableCell>
                  <TableCell sx={{ fontWeight: 800, width: 120, textAlign: 'center' }}>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ORDERED_HERITAGE_LIST.map((monument) => {
                  const item = mindmaps[monument.code];
                  const isSelected = selectedMonumentCode === monument.code;
                  const hasLink = Boolean(item?.content);

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
                            label="Đã có link"
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
                      <TableCell>
                        {hasLink ? (
                          <Chip
                            icon={
                              item.type === 'video' ||
                              item.content.includes('/video/upload/') ||
                              item.content.toLowerCase().endsWith('.mp4') ? (
                                <OndemandVideoIcon sx={{ fontSize: '14px !important' }} />
                              ) : undefined
                            }
                            label={
                              item.type === 'video' ||
                              item.content.includes('/video/upload/') ||
                              item.content.toLowerCase().endsWith('.mp4')
                                ? 'Video MP4'
                                : item.type === 'image'
                                ? 'Ảnh (Image)'
                                : 'Nhúng (Iframe)'
                            }
                            size="small"
                            variant="outlined"
                            color={
                              item.type === 'video' || item.content.includes('/video/upload/')
                                ? 'secondary'
                                : 'default'
                            }
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
                        )}
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
                            {item.content}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                            Chưa cấu hình
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
                                onClick={() => window.open(item.content, '_blank')}
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
