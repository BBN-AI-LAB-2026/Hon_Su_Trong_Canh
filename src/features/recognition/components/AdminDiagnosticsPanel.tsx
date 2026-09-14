import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedIcon from '@mui/icons-material/Verified';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { ImageAnalysisData, MLPredictionResult, PreprocessDiagnostics } from '../services/mlService';

interface AdminDiagnosticsPanelProps {
  isAdmin: boolean;
  previewImage: string;
  letterboxPreview: string | null;
  activePreviewMode: 'original' | 'letterbox';
  setActivePreviewMode: (mode: 'original' | 'letterbox') => void;
  preprocessInfo: PreprocessDiagnostics | null;
  analysisData: ImageAnalysisData | null;
  mlResult: MLPredictionResult | null;
  isWorking: boolean;
  showConfidence: boolean;
  onReset: () => void;
  onSelectNewFile: () => void;
}

export const AdminDiagnosticsPanel: React.FC<AdminDiagnosticsPanelProps> = ({
  isAdmin,
  previewImage,
  letterboxPreview,
  activePreviewMode,
  setActivePreviewMode,
  preprocessInfo,
  analysisData,
  mlResult,
  isWorking,
  showConfidence,
  onReset,
  onSelectNewFile,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }} id="admin-diagnostics-panel">
      {/* Photo with Frame and Admin Letterbox Toggle */}
      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        {/* Toggle buttons between original and preprocessed letterbox image (CHỈ CHO ADMIN) */}
        {isAdmin && letterboxPreview && (
          <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#8E201B', fontWeight: 700, fontSize: '0.72rem' }}>
              [Quản Trị Viên] Kiểm tra ảnh vào Model:
            </Typography>
            <ToggleButtonGroup
              value={activePreviewMode}
              exclusive
              onChange={(_, newMode) => newMode && setActivePreviewMode(newMode)}
              size="small"
              sx={{
                bgcolor: '#F5EFEB',
                border: '1px solid #D8C5AA',
                borderRadius: '6px',
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: '#5C4431',
                  '&.Mui-selected': {
                    bgcolor: '#8E201B',
                    color: '#FAF6F0',
                    '&:hover': { bgcolor: '#7A1B16' },
                  },
                },
              }}
            >
              <ToggleButton value="original" id="toggle-preview-original">
                <CropFreeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Ảnh thực địa gốc
              </ToggleButton>
              <ToggleButton value="letterbox" id="toggle-preview-letterbox">
                <AspectRatioIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Ảnh vào Model (224x224 Letterbox)
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxHeight: 340,
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1.5px solid #D8C5AA',
            boxShadow: '0 4px 18px rgba(50, 26, 15, 0.1)',
            bgcolor: isAdmin && activePreviewMode === 'letterbox' ? '#0F0C08' : '#FAF7F0',
          }}
        >
          <Box
            component="img"
            src={isAdmin && activePreviewMode === 'letterbox' && letterboxPreview ? letterboxPreview : previewImage}
            alt={isAdmin && activePreviewMode === 'letterbox' ? 'Ảnh Letterbox gửi vào Model' : 'Ảnh thực địa gốc'}
            sx={{
              width: '100%',
              height: 280,
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Badge Mode */}
          {isAdmin && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: activePreviewMode === 'letterbox' ? 'rgba(142, 32, 27, 0.88)' : 'rgba(30, 25, 20, 0.8)',
                backdropFilter: 'blur(4px)',
                color: '#FAF4E8',
                px: 1,
                py: 0.3,
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {activePreviewMode === 'letterbox'
                ? 'Đầu vào Model (224×224 px - Letterbox/Padding)'
                : 'Ảnh thực địa gốc (Không cắt xén)'}
            </Box>
          )}

          {isWorking && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(38, 28, 20, 0.78)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAF6F0',
                gap: 1.5,
                px: 3,
                textAlign: 'center',
              }}
            >
              <CircularProgress color="inherit" size={40} />
              <Typography variant="subtitle2" sx={{ fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em' }}>
                Đang nhận diện qua mô hình AI...
              </Typography>
            </Box>
          )}

          <IconButton
            onClick={onReset}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(42, 31, 23, 0.8)',
              color: '#FFFFFF',
              '&:hover': { bgcolor: 'rgba(42, 31, 23, 0.95)' },
            }}
            size="small"
            title="Đổi ảnh khác"
            id="btn-reset-image"
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Kích thước ảnh gốc và kích thước gửi vào model (CHỈ HIỂN THỊ CHO ADMIN) */}
        {isAdmin && (
          <Box sx={{ mt: 1, px: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#6A4D32', fontWeight: 600, fontSize: '0.73rem' }}>
              Kích thước gốc: <strong>{preprocessInfo?.originalWidth || analysisData?.width || 0} × {preprocessInfo?.originalHeight || analysisData?.height || 0} px</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: '#8E201B', fontWeight: 700, fontSize: '0.73rem' }}>
              Kích thước model: <strong>224 × 224 px</strong> (Letterbox)
            </Typography>
          </Box>
        )}
      </Box>

      {/* Real Image & ML Diagnostics Panel */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, textAlign: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Ảnh thực địa đã nạp"
            size="small"
            sx={{ bgcolor: 'rgba(200, 157, 53, 0.15)', color: 'primary.dark', fontWeight: 600 }}
          />
          {isAdmin && (
            <Chip
              icon={<AspectRatioIcon sx={{ fontSize: 14 }} />}
              label="Bảo toàn 100% mái ngói (Không crop)"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.73rem' }}
            />
          )}

          {mlResult && !mlResult.isAboveSafetyThreshold && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
              label="Chưa đạt chuẩn nhận diện"
              size="small"
              color="error"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>

        {/* Bảng thông số tiền xử lý trực quan (CHỈ CHO ADMIN) */}
        {isAdmin && (
          <Box
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: '6px',
              bgcolor: '#F5EFEB',
              border: '1px solid #D8C5AA',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A3423', display: 'block', mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Thông số tiền xử lý ảnh (Dành riêng cho Quản trị viên)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, fontSize: '0.78rem' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#7D6452', display: 'block' }}>Kích thước ảnh gốc:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2A1F17' }}>
                  {preprocessInfo?.originalWidth || analysisData?.width || 0} × {preprocessInfo?.originalHeight || analysisData?.height || 0} px
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#7D6452', display: 'block' }}>Kích thước gửi vào model:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#8E201B' }}>
                  224 × 224 px (Cố định)
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#7D6452', display: 'block' }}>Tỉ lệ co giãn (Scale):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2A1F17' }}>
                  {preprocessInfo?.scaleFactor || '1.0'} (Giữ nguyên tỉ lệ)
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#7D6452', display: 'block' }}>Vùng đệm Letterbox:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2A1F17' }}>
                  {preprocessInfo ? `X:${preprocessInfo.padX}px | Y:${preprocessInfo.padY}px` : 'Padding viền đen'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Khi độ tin cậy >= 60%: hiển thị tên di tích, hiển thị độ tin cậy nếu admin bật */}
        {mlResult?.isAboveSafetyThreshold && mlResult.className && (
          <Box sx={{ mt: 1, p: 1.5, borderRadius: '4px', bgcolor: 'rgba(46, 125, 50, 0.06)', border: '1px solid rgba(46, 125, 50, 0.2)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
              Di tích nhận diện:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.dark' }}>
                {mlResult.className}
              </Typography>
              {showConfidence && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                  label={`Độ tin cậy: ${mlResult.confidence}%`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                  id="uploader-confidence-chip"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Khi độ tin cậy < 60%: hiển thị cảnh báo và yêu cầu chụp lại / kiểm tra danh sách hỗ trợ */}
        {mlResult && !mlResult.isAboveSafetyThreshold && (
          <Alert
            severity="error"
            variant="filled"
            sx={{ mt: 1.5, borderRadius: '4px' }}
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderColor: 'white', fontWeight: 700 }}
                onClick={() => {
                  onReset();
                  onSelectNewFile();
                }}
              >
                Chụp Lại
              </Button>
            }
          >
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
              Yêu cầu chụp lại hoặc kiểm tra địa danh của bạn có nằm trong{' '}
              <RouterLink
                to="/support/"
                style={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  textDecoration: 'underline',
                }}
              >
                danh sách hỗ trợ
              </RouterLink>{' '}
              hay không.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};
