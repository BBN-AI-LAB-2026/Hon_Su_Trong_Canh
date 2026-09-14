import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Snackbar,
  Button,
  Divider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { adminService } from '../services/adminService';
import { SystemSettings } from '../types';

export const SystemSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => adminService.getSystemSettings());
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminService.getSystemSettings());
    };
    window.addEventListener('ditich_system_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_system_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleToggleConfidence = (checked: boolean) => {
    adminService.updateSystemSettings({ showConfidence: checked });
    setSettings(adminService.getSystemSettings());
    setSnackbarMessage(
      checked
        ? 'Đã BẬT hiển thị độ tin cậy nhận diện di tích!'
        : 'Đã TẮT hiển thị độ tin cậy nhận diện di tích!'
    );
  };

  const handleResetDefaults = () => {
    adminService.updateSystemSettings({ showConfidence: true });
    setSettings(adminService.getSystemSettings());
    setSnackbarMessage('Đã khôi phục cài đặt mặc định (Độ tin cậy: BẬT)!');
  };

  return (
    <Box id="system-settings-manager">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TuneIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Cài Đặt Hệ Thống & Hiển Thị Nhận Diện
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tùy chỉnh các thông số hiển thị và quy tắc trải nghiệm dành cho người dùng
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={handleResetDefaults}
          sx={{ textTransform: 'none', borderColor: '#D6C7B2', color: 'text.secondary' }}
        >
          Khôi phục mặc định
        </Button>
      </Box>

      {/* Main Setting Card */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: '#E2D7C7',
          borderRadius: 2,
          bgcolor: '#FAF7F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.8 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: settings.showConfidence ? 'rgba(46, 125, 50, 0.12)' : 'rgba(100, 100, 100, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: settings.showConfidence ? 'success.main' : 'text.secondary',
                  flexShrink: 0,
                  mt: 0.3,
                }}
              >
                {settings.showConfidence ? (
                  <VisibilityIcon sx={{ fontSize: 26 }} />
                ) : (
                  <VisibilityOffIcon sx={{ fontSize: 26 }} />
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', fontSize: '1.1rem' }}>
                    Hiển Thị Độ Tin Cậy Nhận Diện (Confidence Score)
                  </Typography>
                  <Chip
                    size="small"
                    label={settings.showConfidence ? 'Đang Bật' : 'Đang Tắt'}
                    color={settings.showConfidence ? 'success' : 'default'}
                    sx={{ fontWeight: 800, height: 24 }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Mặc định: BẬT"
                    sx={{ height: 24, fontSize: '0.75rem', borderColor: '#D4AF37', color: '#8A6D1C' }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, maxWidth: 680 }}>
                  Quyết định xem người dùng có nhìn thấy tỷ lệ phần trăm độ tin cậy sau khi AI nhận diện thành công di tích hay không.
                </Typography>
              </Box>
            </Box>

            {/* Switch Control */}
            <Box sx={{ pl: { xs: 7, sm: 0 }, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    id="switch-toggle-confidence"
                    checked={settings.showConfidence}
                    onChange={(e) => handleToggleConfidence(e.target.checked)}
                    color="success"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2E7D32',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2E7D32',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: settings.showConfidence ? 'success.dark' : 'text.secondary' }}>
                    {settings.showConfidence ? 'BẬT' : 'TẮT'}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#E5DAC9', my: 2 }} />

          {/* Detailed Explanation */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: settings.showConfidence ? 'rgba(46, 125, 50, 0.08)' : '#F2ECE1',
                border: settings.showConfidence ? '1.5px solid rgba(46, 125, 50, 0.4)' : '1px solid #E0D5C1',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.dark' }}>
                  Khi Admin BẬT (Mặc định):
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.5 }}>
                • Kết quả nhận diện sẽ <strong>HIỆN RA</strong> độ tin cậy (ví dụ: <code>Độ tin cậy: 98.5%</code>).<br />
                • Giúp người dùng nắm được mức độ chắc chắn của thuật toán AI.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: !settings.showConfidence ? 'rgba(123, 24, 20, 0.08)' : '#F2ECE1',
                border: !settings.showConfidence ? '1.5px solid rgba(123, 24, 20, 0.4)' : '1px solid #E0D5C1',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VisibilityOffIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                  Khi Admin TẮT:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.5 }}>
                • Kết quả nhận diện sẽ <strong>KHÔNG HIỆN RA</strong> độ tin cậy.<br />
                • Giao diện tinh gọn, chỉ hiển thị tên di tích và nhãn "Xác thực" mà không làm người dùng bận tâm về con số kỹ thuật.
              </Typography>
            </Box>
          </Box>

          {/* Live Preview Box */}
          <Box sx={{ mt: 2, p: 2.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #DED4C3' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'primary.main', letterSpacing: '0.06em' }}>
                Mô Phỏng Trực Quan Giao Diện Người Dùng (Live Preview)
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Thay đổi ngay lập tức khi bạn gạt công tắc ở trên
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: '#FAF7F0',
                border: '1.5px solid #C59B27',
                maxWidth: 420,
                mx: 'auto',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                Di Tích Xác Nhận
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1, fontSize: '1.05rem' }}>
                Chùa Một Cột
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  label="Xác thực"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
                />
                {settings.showConfidence ? (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                    label="Độ tin cậy: 98.5%"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
                    id="preview-confidence-chip"
                  />
                ) : (
                  <Chip
                    label="Độ tin cậy: Đã ẩn"
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: '0.72rem', color: 'text.disabled', borderStyle: 'dashed' }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
