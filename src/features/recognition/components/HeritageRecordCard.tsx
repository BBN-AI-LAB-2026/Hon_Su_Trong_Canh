import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VerifiedIcon from '@mui/icons-material/Verified';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { Link as RouterLink } from 'react-router-dom';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { ImageAnalysisData, MLPredictionResult, mlService, getHeritageIllustrationUrl } from '../services/mlService';
import { collectionService } from '../../collection-map/services/collectionService';
import { useAuth } from '../../../core/hooks/useAuth';
import { MonumentHeritageStoriesAndQuiz } from './MonumentHeritageStoriesAndQuiz';
import { adminService } from '../../admin/services/adminService';
import { DEFAULT_MONUMENT_STORIES } from '../data/defaultMonumentStories';
import { aiQuizService } from '../services/aiQuizService';

interface HeritageRecordCardProps {
  analysisData: ImageAnalysisData;
  mlResult?: MLPredictionResult | null;
  enhancementInfo?: {
    originalDimensions: string;
    newDimensions: string;
    scaleFactor: number;
    wasEnhanced: boolean;
  } | null;
  onSaved?: (record: any) => void;
  onRetake?: () => void;
  onProceedToLesson?: () => void;
}

const MONUMENT_METADATA: Record<number, { code: string; location: string; region: 'Bắc' | 'Trung' | 'Nam' }> = {
  0: { code: 'BNR', location: 'Phường Khánh Hội, Thành phố Hồ Chí Minh', region: 'Nam' },
  1: { code: 'CBT', location: 'Phường Bến Thành, Thành phố Hồ Chí Minh', region: 'Nam' },
  2: { code: 'CMC', location: 'Phường Ba Đình, Thành phố Hà Nội', region: 'Bắc' },
  3: { code: 'CauHienLuong', location: 'Xã Vĩnh Linh, Tỉnh Quảng Trị', region: 'Trung' },
  4: { code: 'DDCC', location: 'Xã An Nhơn Tây, Thành phố Hồ Chí Minh', region: 'Nam' },
  5: { code: 'DenHung', location: 'Xã Hy Cương, Tỉnh Phú Thọ', region: 'Bắc' },
  6: { code: 'DinhDocLap', location: 'Phường Bến Thành, Thành phố Hồ Chí Minh', region: 'Nam' },
  7: { code: 'LangChuTichHCM', location: 'Phường Ba Đình, Thành phố Hà Nội', region: 'Bắc' },
  8: { code: 'NgoMon', location: 'Phường Phú Xuân, Thành phố Huế', region: 'Trung' },
  9: { code: 'NhaThoDB', location: 'Phường Sài Gòn, Thành phố Hồ Chí Minh', region: 'Nam' },
  10: { code: 'NTCD', location: 'Đặc khu Côn Đảo, Thành phố Hồ Chí Minh', region: 'Nam' },
  11: { code: 'TDiaMS', location: 'Xã Thu Bồn, Thành phố Đà Nẵng', region: 'Trung' },
  12: { code: 'ThanhCoQT', location: 'Phường Quảng Trị, Tỉnh Quảng Trị', region: 'Trung' },
  13: { code: 'VanMieuQTG', location: 'Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội', region: 'Bắc' },
};

export const HeritageRecordCard: React.FC<HeritageRecordCardProps> = ({
  analysisData,
  mlResult,
  enhancementInfo,
  onSaved,
  onRetake,
  onProceedToLesson,
}) => {
  const { user, incrementDiscoveredCount } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'bbnailab2026@gmail.com';

  const [isSaved, setIsSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPhotoView, setSelectedPhotoView] = useState<'original' | 'letterbox'>('original');

  // Derive model results
  const isAboveSafety = mlResult?.isAboveSafetyThreshold ?? false;
  const confidence = mlResult?.confidence ?? 0;
  const [showConfidence, setShowConfidence] = useState(() => adminService.isShowConfidenceEnabled());

  const origW = mlResult?.letterboxDiagnostics?.originalWidth || analysisData.width;
  const origH = mlResult?.letterboxDiagnostics?.originalHeight || analysisData.height;
  const modelW = mlResult?.letterboxDiagnostics?.modelInputWidth || 224;
  const modelH = mlResult?.letterboxDiagnostics?.modelInputHeight || 224;
  const padX = mlResult?.letterboxDiagnostics?.padX ?? 0;
  const padY = mlResult?.letterboxDiagnostics?.padY ?? 0;
  const scaleFactor = mlResult?.letterboxDiagnostics?.scaleFactor ?? 1;
  const letterboxPreviewUrl = mlResult?.preprocessedPreviewUrl || mlResult?.diagnostics?.preprocessedPreview;

  // In ra kích thước ảnh gốc và kích thước ảnh gửi vào model để dễ kiểm tra (chỉ cho admin)
  useEffect(() => {
    if (isAdmin) {
      console.log(
        `[Admin Kiểm Tra - Kích thước ảnh HeritageRecordCard]\n` +
        `• Kích thước ảnh gốc: ${origW} x ${origH} px\n` +
        `• Kích thước gửi vào model: ${modelW} x ${modelH} px (Letterbox/Padding)\n` +
        `• Tỉ lệ scale: ${scaleFactor}\n` +
        `• Vùng đệm letterbox: Trái/Phải=${padX}px, Trên/Dưới=${padY}px\n` +
        `• Trạng thái mái ngói: Bảo toàn nguyên vẹn 100%, không bị crop, không mất mép trên hay hai bên.`
      );
    }
  }, [isAdmin, origW, origH, modelW, modelH, padX, padY, scaleFactor]);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setShowConfidence(adminService.isShowConfidenceEnabled());
    };
    window.addEventListener('ditich_system_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('ditich_system_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Strictly use the class name returned by the model
  const className = mlResult?.className;
  const predictedIndex = mlResult?.predictedIndex ?? -1;
  const monumentCode =
    mlResult?.code ||
    (predictedIndex >= 0 && MONUMENT_METADATA[predictedIndex] ? MONUMENT_METADATA[predictedIndex].code : '');

  // Ảnh minh họa chính thức theo class tương ứng trong source code (không thay ảnh user đăng)
  const illustrationUrl = getHeritageIllustrationUrl(monumentCode, predictedIndex, className);

  // Tự động khởi tạo dữ liệu câu hỏi ghép nối Dòng Thời Gian AI bám sát di tích và bài thuyết minh ngay khi nhận diện
  useEffect(() => {
    if (isAboveSafety && className && monumentCode) {
      const stories = adminService.getStories({ monumentCode });
      const storyContent =
        stories[0]?.content ||
        DEFAULT_MONUMENT_STORIES[monumentCode]?.storyContent ||
        `Di tích ${className} là công trình văn hóa lịch sử tiêu biểu của Việt Nam.`;

      aiQuizService
        .generateTimelineMatches({
          monumentCode,
          monumentName: className,
          storyContent,
        })
        .catch((err) => console.debug('[Pre-warm Timeline Matches]:', err));
    }
  }, [isAboveSafety, className, monumentCode]);

  const handleSaveToRecord = () => {
    if (!className) return;

    const recordId = `heritage-${monumentCode || (predictedIndex >= 0 ? predictedIndex : 'item')}`;
    const meta =
      (predictedIndex >= 0 && MONUMENT_METADATA[predictedIndex]) ||
      (monumentCode ? Object.values(MONUMENT_METADATA).find((m) => m.code === monumentCode) : undefined) ||
      { location: 'Di tích lịch sử Việt Nam', region: 'Bắc' as const };

    // Save to collectionService and mlService
    collectionService.addDiscovered(recordId);

    const record = {
      id: recordId,
      name: className,
      location: meta.location,
      region: meta.region,
      imageUrl: analysisData.imageData,
      recordedAt: new Date().toISOString(),
      confidence: confidence,
      certifiedBy: mlService.getConfig().modelName || 'image_classifier_vn.keras',
    };

    mlService.saveHeritageRecord(record);
    incrementDiscoveredCount();
    setIsSaved(true);
    setSnackbarOpen(true);

    if (onSaved) {
      onSaved(record);
    }
  };

  return (
    <Box sx={{ mt: 3 }} id="heritage-record-card-section">
      <Card
        sx={{
          overflow: 'hidden',
          bgcolor: '#FCFAF5',
          border: '1.5px solid #D8C5AA',
          boxShadow: '0 4px 20px rgba(50, 26, 15, 0.06), 0 1px 3px rgba(50, 26, 15, 0.04)',
        }}
      >
        <HeritageCornerFrame>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'center', md: 'flex-start' } }}>
            {/* Left Column: Image Artwork (Ảnh thực địa bạn đăng & Ảnh minh họa mẫu di tích) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: { xs: '100%', md: 236 },
                gap: 2,
              }}
            >
              {/* Khung 1: Ảnh thực địa do người dùng đăng & Ảnh sau tiền xử lý Letterbox (Chỉ Admin xem thông số) */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {isAdmin && letterboxPreviewUrl && (
                  <Box sx={{ mb: 1, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#8E201B', fontWeight: 700, fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                      [Quản Trị Viên] Kiểm tra ảnh vào Model:
                    </Typography>
                    <ToggleButtonGroup
                      value={selectedPhotoView}
                      exclusive
                      onChange={(_, mode) => mode && setSelectedPhotoView(mode)}
                      size="small"
                      sx={{
                        bgcolor: '#F5EFEB',
                        border: '1px solid #D8C5AA',
                        borderRadius: '4px',
                        '& .MuiToggleButton-root': {
                          px: 1.2,
                          py: 0.4,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          color: '#5C4431',
                          '&.Mui-selected': {
                            bgcolor: '#8E201B',
                            color: '#FAF6F0',
                            '&:hover': { bgcolor: '#7A1B16' },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="original" id="card-toggle-original">
                        <CropFreeIcon sx={{ fontSize: 14, mr: 0.4 }} />
                        Ảnh gốc
                      </ToggleButton>
                      <ToggleButton value="letterbox" id="card-toggle-letterbox">
                        <AspectRatioIcon sx={{ fontSize: 14, mr: 0.4 }} />
                        Vào Model (224x224)
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                )}

                <Box
                  sx={{
                    width: 224,
                    height: 180,
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #DFD5C6',
                    bgcolor: isAdmin && selectedPhotoView === 'letterbox' ? '#0F0C08' : '#FAF7F0',
                    boxShadow: '0 4px 14px rgba(42, 31, 23, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={isAdmin && selectedPhotoView === 'letterbox' && letterboxPreviewUrl ? letterboxPreviewUrl : analysisData.imageData}
                    alt={isAdmin && selectedPhotoView === 'letterbox' ? 'Ảnh Letterbox gửi vào Model' : 'Ảnh thực địa bạn đăng'}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  
                  {/* Badge chỉ báo chế độ xem (Chỉ cho admin khi xem letterbox) */}
                  {isAdmin && selectedPhotoView === 'letterbox' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        bgcolor: 'rgba(142, 32, 27, 0.9)',
                        color: '#FAF4E8',
                        px: 0.8,
                        py: 0.2,
                        borderRadius: '3px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                      }}
                    >
                      224×224 Letterbox
                    </Box>
                  )}
                </Box>

                {/* Thông số kích thước: DÀNH CHO ADMIN. Người dùng thông thường thì KHÔNG xem thông số */}
                {isAdmin ? (
                  <Box sx={{ mt: 0.8, width: 224, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#6A4D32', fontWeight: 600, fontSize: '0.72rem', display: 'block' }}>
                      Kích thước gốc: <strong>{origW} × {origH} px</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8E201B', fontWeight: 700, fontSize: '0.72rem', display: 'block' }}>
                      Kích thước vào model: <strong>{modelW} × {modelH} px</strong> (Letterbox)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700, fontSize: '0.68rem', display: 'block' }}>
                      ✓ Bảo toàn 100% mái ngói & hai bên mép
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ mt: 0.6, color: '#6A4D32', fontWeight: 600, fontSize: '0.74rem' }}>
                    Ảnh thực địa của bạn
                  </Typography>
                )}
              </Box>

              {/* Khung 2: Ảnh minh họa di tích (Chỉ hiển thị khi độ tin cậy đạt chuẩn >= 60%) */}
              {isAboveSafety && illustrationUrl && (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 224,
                      height: 180,
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #C59B27',
                      bgcolor: '#FAF7F0',
                      boxShadow: '0 4px 14px rgba(197, 155, 39, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={illustrationUrl}
                      alt={`Ảnh minh họa ${className || 'di tích'}`}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(123, 24, 20, 0.88)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFF8E7',
                        px: 1,
                        py: 0.3,
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '1px solid #E5C378',
                      }}
                    >
                      Ảnh minh họa
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 0.6, color: '#7B1814', fontWeight: 700, fontSize: '0.74rem' }}>
                    Ảnh minh họa di tích
                  </Typography>
                </Box>
              )}

              {/* Phần tên di tích xác nhận để ở dưới hình ảnh */}
              {isAboveSafety && className && (
                <Box sx={{ mt: 0.5, textAlign: 'center', width: 224 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      letterSpacing: '0.08em',
                      fontWeight: 700,
                      display: 'block',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      mb: 0.3,
                    }}
                  >
                    Di Tích Xác Nhận
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      color: 'primary.dark',
                      lineHeight: 1.3,
                      fontSize: '1.05rem',
                      mb: 1,
                    }}
                  >
                    {className}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                    {showConfidence && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                        label={`Độ tin cậy: ${confidence}%`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                        id="chip-recognition-confidence"
                      />
                    )}
                    {enhancementInfo?.wasEnhanced && (
                      <Chip
                        icon={<AutoFixHighIcon sx={{ fontSize: 14 }} />}
                        label="Làm nét ảnh"
                        size="small"
                        color="secondary"
                        sx={{ fontWeight: 800, color: '#2A1F17', height: 22, fontSize: '0.72rem' }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Right Column: Model Output or Low-Confidence Rejection Notice */}
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                {isAboveSafety && className ? (
                  /* ================= CASE 1: CONFIDENCE >= 60% (VALID PREDICTION) ================= */
                  <Box>
                    {/* Multilingual Stories with Cloudinary Audio Narration next to text & Quiz */}
                    <MonumentHeritageStoriesAndQuiz
                      monumentCode={monumentCode || 'CBT'}
                      monumentName={className}
                    />

                    {/* Action Buttons: Nằm ở cuối phần Nhận diện */}
                    {isSaved ? (
                      <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #E2D7C7' }}>
                        <Box sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.08)', borderRadius: '4px', border: '1px solid rgba(46, 125, 50, 0.3)', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CheckCircleIcon sx={{ color: 'success.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.dark' }}>
                              Đã Lưu Kết Quả Nhận Diện!
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1.5, alignItems: 'center' }}>
                            {onProceedToLesson && (
                              <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={onProceedToLesson}
                                id="btn-proceed-to-mindmap-saved"
                                sx={{
                                  py: 1.2,
                                  px: 3.5,
                                  fontWeight: 800,
                                  fontSize: '0.98rem',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
                                }}
                              >
                                Sơ Đồ Kiến Thức
                              </Button>
                            )}
                            <Button
                              component={RouterLink}
                              to="/vr-tour"
                              variant="contained"
                              color="secondary"
                              startIcon={<ViewInArIcon />}
                              id="btn-goto-vr-after-save"
                            >
                              Trải Nghiệm VR 360°
                            </Button>
                            <Tooltip title="Đăng Ảnh Khác">
                              <Button
                                variant="outlined"
                                onClick={onRetake}
                                id="btn-retake-after-save"
                                aria-label="Đăng Ảnh Khác"
                                sx={{ py: 1.2, px: 2, minWidth: 48, borderColor: '#D6C7B2', color: 'primary.dark' }}
                              >
                                <CameraAltIcon />
                              </Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #E2D7C7', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        {onProceedToLesson && (
                          <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={onProceedToLesson}
                            id="btn-proceed-to-mindmap"
                            sx={{
                              py: 1.2,
                              px: 3.5,
                              fontWeight: 800,
                              fontSize: '0.98rem',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
                            }}
                          >
                            Sơ Đồ Kiến Thức
                          </Button>
                        )}
                        <Tooltip title="Lưu Kết Quả">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={handleSaveToRecord}
                            id="btn-save-record"
                            aria-label="Lưu Kết Quả"
                            sx={{ py: 1.2, px: 2, minWidth: 48, borderColor: '#C89D35' }}
                          >
                            <BookmarkAddIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Đăng Ảnh Khác">
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={onRetake}
                            id="btn-retake-normal"
                            aria-label="Đăng Ảnh Khác"
                            sx={{ py: 1.2, px: 2, minWidth: 48, borderColor: '#D6C7B2', color: 'primary.dark' }}
                          >
                            <RefreshIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                ) : (
                  /* ================= CASE 2: CONFIDENCE < 60% (SAFETY THRESHOLD TRIGGERED) ================= */
                  <Box id="ml-low-confidence-notice" sx={{ py: 1 }}>
                    <Alert
                      severity="warning"
                      variant="standard"
                      icon={<WarningAmberIcon sx={{ color: '#8E201B', fontSize: 28 }} />}
                      sx={{
                        mb: 2.5,
                        borderRadius: '8px',
                        bgcolor: 'rgba(211, 47, 47, 0.08)',
                        border: '1.5px solid rgba(211, 47, 47, 0.28)',
                        p: 2,
                        '& .MuiAlert-message': {
                          width: '100%',
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: '"Be Vietnam Pro", sans-serif',
                          fontWeight: 600,
                          color: '#5B1513',
                          fontSize: { xs: '0.95rem', sm: '1.02rem' },
                          lineHeight: 1.6,
                        }}
                      >
                        Yêu cầu chụp lại hoặc kiểm tra địa danh của bạn có nằm trong{' '}
                        <RouterLink
                          to="/support/"
                          style={{
                            color: '#8E201B',
                            textDecoration: 'underline',
                            fontWeight: 800,
                          }}
                        >
                          danh sách hỗ trợ
                        </RouterLink>{' '}
                        hay không.
                      </Typography>
                    </Alert>

                    <Box sx={{ p: 2, bgcolor: '#FAF7F0', borderRadius: '6px', border: '1px solid #E6DCCD', mb: 2.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.dark', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                        Lưu Ý Khi Chụp / Tải Lên Hình Mới:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        • Chụp trực diện chủ thể với góc nhìn bao quát, rõ nét
                        <br />
                        • Đảm bảo đủ ánh sáng tự nhiên, hạn chế ngược sáng mạnh
                        <br />
                        • Giữ máy ảnh ổn định, tránh rung nhòe hoặc vật cản che khuất
                        <br />
                        • Hạn chế chụp quá xa hoặc bị che khuất bởi cây, người, ...
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<RefreshIcon />}
                        onClick={onRetake}
                        id="btn-retake-photo"
                        sx={{ py: 1.2, px: 3, fontWeight: 800, fontSize: '0.95rem' }}
                      >
                        Chụp Lại
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/support/"
                        variant="outlined"
                        size="large"
                        sx={{
                          py: 1.2,
                          px: 2.5,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          borderColor: '#8E201B',
                          color: '#8E201B',
                          '&:hover': {
                            borderColor: '#721612',
                            bgcolor: 'rgba(142, 32, 27, 0.05)',
                          },
                        }}
                      >
                        Danh Sách Hỗ Trợ
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Box>
          </Box>
        </HeritageCornerFrame>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Đã lưu kết quả nhận diện thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};
