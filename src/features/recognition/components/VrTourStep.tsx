import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MapIcon from '@mui/icons-material/Map';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { EmbeddedVrSpace, vrTourAdminService } from '../../vr-tour/services/vrTourAdminService';
import { AdminEmbedModal } from '../../vr-tour/components/AdminEmbedModal';
import { VrIframePlayer } from '../../vr-tour/components/VrIframePlayer';
import { collectionService } from '../../collection-map/services/collectionService';
import { useAuth } from '../../../core/hooks/useAuth';

interface VrTourStepProps {
  monumentCode: string;
  monumentName: string;
  location?: string;
  confidence?: number;
  imageData?: string;
  onBack: () => void;
  onFinishAndExit: () => void;
}

export const VrTourStep: React.FC<VrTourStepProps> = ({
  monumentCode,
  monumentName,
  location = 'Việt Nam',
  confidence = 90,
  imageData,
  onBack,
  onFinishAndExit,
}) => {
  const { user, incrementDiscoveredCount } = useAuth();
  const navigate = useNavigate();

  // Check if there is an embedded VR space specifically for this monument
  const [spaces, setSpaces] = useState<EmbeddedVrSpace[]>(() => vrTourAdminService.getEmbeddedSpaces());
  const [activeSpace, setActiveSpace] = useState<EmbeddedVrSpace | undefined>(() =>
    vrTourAdminService.getEmbeddedSpaceForMonument(monumentCode)
  );

  useEffect(() => {
    const handleUpdate = () => {
      const updated = vrTourAdminService.getEmbeddedSpaces();
      setSpaces(updated);
      const match = vrTourAdminService.getEmbeddedSpaceForMonument(monumentCode);
      setActiveSpace(match);
    };
    handleUpdate();
    window.addEventListener('ditich_vr_spaces_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_vr_spaces_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [monumentCode]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  // Panorama Canvas state
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleSpaceAdded = (newSpace: EmbeddedVrSpace) => {
    // Tag with this monument code if not specified
    const tagged: EmbeddedVrSpace = {
      ...newSpace,
      monumentCode: monumentCode,
    };
    const updated = [tagged, ...spaces];
    setSpaces(updated);
    setActiveSpace(tagged);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Render canvas if embedType is panorama_image
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (imageRef.current) {
      const img = imageRef.current;
      const fov = 85;
      const visibleRatio = fov / 360;
      const sliceWidth = img.naturalWidth * visibleRatio;
      const sliceHeight = img.naturalHeight * 0.75;

      const normalizedYaw = ((yawRef.current % 360) + 360) % 360;
      const sourceX = (normalizedYaw / 360) * img.naturalWidth;
      const pitchOffset = (pitchRef.current / 90) * (img.naturalHeight * 0.2);
      const sourceY = Math.max(
        0,
        Math.min(img.naturalHeight - sliceHeight, (img.naturalHeight - sliceHeight) / 2 - pitchOffset)
      );

      if (sourceX + sliceWidth <= img.naturalWidth) {
        ctx.drawImage(img, sourceX, sourceY, sliceWidth, sliceHeight, 0, 0, width, height);
      } else {
        const part1Width = img.naturalWidth - sourceX;
        const part2Width = sliceWidth - part1Width;
        const drawPart1Width = (part1Width / sliceWidth) * width;
        const drawPart2Width = width - drawPart1Width;

        ctx.drawImage(img, sourceX, sourceY, part1Width, sliceHeight, 0, 0, drawPart1Width, height);
        ctx.drawImage(img, 0, sourceY, part2Width, sliceHeight, drawPart1Width, 0, drawPart2Width, height);
      }
    }

    if (isAutoRotate && !isDraggingRef.current) {
      yawRef.current = (yawRef.current + 0.12) % 360;
    }

    animationFrameRef.current = requestAnimationFrame(renderCanvas);
  }, [isAutoRotate]);

  useEffect(() => {
    if (activeSpace?.embedType === 'panorama_image') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeSpace.embedUrl;
      img.onload = () => {
        imageRef.current = img;
        if (canvasRef.current) {
          canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 960;
          canvasRef.current.height = 520;
        }
        renderCanvas();
      };
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        imageRef.current = null;
      };
    }
  }, [activeSpace, renderCanvas]);

  const handleTriggerFinishAndExit = () => {
    // Save to collection
    const recordId = `heritage-${monumentCode}`;
    collectionService.addDiscovered(recordId);
    incrementDiscoveredCount();
    setIsExitDialogOpen(true);
  };

  const handleConfirmNewSurvey = () => {
    setIsExitDialogOpen(false);
    onFinishAndExit();
  };

  const isOptionC = !activeSpace || activeSpace.vrOption === 'C' || activeSpace.embedType === 'external_url';
  const hasUrl = !!(activeSpace?.embedUrl && activeSpace.embedUrl.trim());

  return (
    <Card sx={{ overflow: 'hidden', boxShadow: '0 4px 24px rgba(42, 31, 23, 0.08)' }} id="step-vr-tour-view">
      <HeritageCornerFrame>
        {/* Step Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            pb: 2,
            borderBottom: '1px solid #E2D7C7',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontFamily: '"Be Vietnam Pro"',
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                }}
              >
                Không Gian VR 360°: {monumentName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
                {location}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user?.role === 'admin' && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                id="btn-admin-embed-vr-direct"
                sx={{ fontWeight: 700, fontSize: '0.78rem' }}
              >
                Quản Trị: Cấu Hình VR
              </Button>
            )}
          </Box>
        </Box>

        {/* Notice for Option A or B only */}
        {!isOptionC && (
          <Alert
            severity="info"
            icon={<ViewInArIcon sx={{ fontSize: 24, color: '#C89D35' }} />}
            sx={{
              mb: 2.5,
              borderRadius: '6px',
              bgcolor: 'rgba(200, 157, 53, 0.08)',
              border: '1px solid rgba(200, 157, 53, 0.35)',
              color: 'primary.dark',
            }}
            id="notice-vr-tour-active"
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              🏛️ Không gian thực tế ảo 360°
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.2 }}>
              Không gian thực tế ảo 360° của di tích đã sẵn sàng tương tác bên dưới.
            </Typography>
          </Alert>
        )}

        {/* Option C: Clean, light heritage card - NO black background, NO iframe */}
        {isOptionC ? (
          <Box
            sx={{
              width: '100%',
              borderRadius: '10px',
              py: { xs: 4, sm: 5, md: 6 },
              px: { xs: 2.5, sm: 4, md: 5 },
              bgcolor: '#FFFDF9',
              background: 'linear-gradient(135deg, #FFFDF9 0%, #F8F3EA 100%)',
              border: '1.5px solid #E6DBCB',
              boxShadow: '0 4px 20px rgba(140, 103, 24, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              mb: 3,
            }}
            id="vr-option-c-card"
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(200, 157, 53, 0.12)',
                border: '2px solid #C89D35',
                color: '#8C6718',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: '0 4px 16px rgba(200, 157, 53, 0.2)',
              }}
            >
              <OpenInNewIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Be Vietnam Pro"',
                fontWeight: 800,
                color: '#3D1C06',
                mb: 1.2,
                fontSize: { xs: '1.25rem', sm: '1.45rem' },
              }}
            >
              {activeSpace?.title || `Không Gian Thực Tế Ảo 360°: ${monumentName}`}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#685344',
                maxWidth: 580,
                mb: 3,
                lineHeight: 1.65,
                fontSize: { xs: '0.9rem', sm: '0.98rem' },
              }}
            >
              {hasUrl
                ? (activeSpace?.description || `Không gian thực tế ảo 360° của di tích ${monumentName} đã sẵn sàng. Nhấp vào nút bên dưới để bắt đầu trải nghiệm.`)
                : 'Không gian thực tế ảo VR 360° (Lựa chọn C) đã được thiết lập. Quản trị viên sẽ cập nhật đường dẫn sau.'}
            </Typography>

            {hasUrl ? (
              <Button
                variant="contained"
                size="large"
                endIcon={<OpenInNewIcon />}
                onClick={() => {
                  const cleanUrl = activeSpace!.embedUrl.trim();
                  const targetUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                id="btn-vr-open-external-tab-step"
                sx={{
                  bgcolor: '#8C6718',
                  color: '#FFFDF8',
                  fontWeight: 800,
                  fontSize: '1.02rem',
                  px: 4,
                  py: 1.4,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(140, 103, 24, 0.28)',
                  border: '1px solid rgba(200, 157, 53, 0.6)',
                  '&:hover': {
                    bgcolor: '#735210',
                    boxShadow: '0 6px 22px rgba(140, 103, 24, 0.4)',
                  },
                }}
              >
                Khám phá không gian 360°
              </Button>
            ) : (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#F5EEDB',
                  border: '1px solid #D6C49B',
                  borderRadius: '6px',
                  px: 3,
                  py: 1.2,
                  color: '#8C6718',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                }}
              >
                <span>⏳ URL sẽ cấp sau</span>
              </Box>
            )}
          </Box>
        ) : (
          /* Option A or Option B (Khung hiển thị canvas 360 hoặc iframe) */
          <Box
            ref={containerRef}
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: activeSpace?.embedType === 'iframe' ? '600px' : { xs: 320, sm: 440, md: 500 },
              borderRadius: '6px',
              overflow: 'hidden',
              bgcolor: '#19130E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #DFD5C6',
              mb: 3,
            }}
            id="vr-360-interactive-viewport"
          >
            {activeSpace?.embedType === 'iframe' ? (
              /* Option B: Iframe VR 360 Player with gyroscope/devicemotion sync */
              <VrIframePlayer
                id="tour-embedded"
                title={activeSpace.title}
                src={activeSpace.embedUrl}
                height="600px"
              />
            ) : (
              /* Option A: Canvas 360 Player for Equirectangular Image (Cloudinary) */
              <Box
                sx={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}
                onMouseDown={(e) => {
                  isDraggingRef.current = true;
                  lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                }}
                onMouseMove={(e) => {
                  if (isDraggingRef.current) {
                    const dx = e.clientX - lastMousePosRef.current.x;
                    const dy = e.clientY - lastMousePosRef.current.y;
                    yawRef.current = (yawRef.current - dx * 0.25 + 360) % 360;
                    pitchRef.current = Math.max(-45, Math.min(45, pitchRef.current + dy * 0.25));
                    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                  }
                }}
                onMouseUp={() => (isDraggingRef.current = false)}
                onMouseLeave={() => (isDraggingRef.current = false)}
              >
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                {/* On-screen controls */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    display: 'flex',
                    gap: 1,
                    bgcolor: 'rgba(26, 20, 16, 0.75)',
                    borderRadius: '4px',
                    p: 0.5,
                  }}
                >
                  <Tooltip title={isAutoRotate ? 'Dừng quay' : 'Tự động quay'}>
                    <IconButton size="small" onClick={() => setIsAutoRotate(!isAutoRotate)} sx={{ color: '#fff' }}>
                      {isAutoRotate ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Toàn màn hình">
                    <IconButton size="small" onClick={toggleFullscreen} sx={{ color: '#fff' }}>
                      {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* BOTTOM ACTION SECTION: "Xong rồi thì nhấn xong ở dưới và thoát." */}
        <Divider sx={{ my: 3, borderColor: '#E2D7C7' }} />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: '#FAF7F0',
            borderRadius: '8px',
            border: '1.5px solid #D6C7B2',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
          id="finish-and-exit-bottom-bar"
        >
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            id="btn-vr-back-to-quiz"
            sx={{ borderColor: '#D8CABE', color: 'primary.dark', fontWeight: 700, order: { xs: 2, sm: 1 } }}
          >
            Quay Lại Quiz
          </Button>

          <Box sx={{ textAlign: { xs: 'center', sm: 'right' }, order: { xs: 1, sm: 2 } }}>
            {/* THE PROMINENT FINISH BUTTON AS REQUESTED */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleTriggerFinishAndExit}
              id="btn-finish-and-exit"
              sx={{
                py: 1.4,
                px: 4,
                fontWeight: 900,
                fontSize: '1.05rem',
                fontFamily: '"Be Vietnam Pro", sans-serif',
                bgcolor: '#4A2511',
                color: '#FAF6F0',
                border: '2px solid #C89D35',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 18px rgba(74, 37, 17, 0.25)',
                '&:hover': {
                  bgcolor: '#2E1508',
                  borderColor: '#DEC067',
                },
              }}
            >
              Hoàn Tất
            </Button>
          </Box>
        </Box>
      </HeritageCornerFrame>

      {/* Admin Embed Modal */}
      <AdminEmbedModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSpaceAdded={handleSpaceAdded}
      />

      {/* Congratulations & Completion Exit Dialog */}
      <Dialog
        open={isExitDialogOpen}
        onClose={() => setIsExitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              border: '1px solid #D6C7B2',
              p: 1,
              bgcolor: '#FAF7F0',
            },
          },
        }}
        id="completion-celebration-dialog"
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(200, 157, 53, 0.15)',
              border: '2px solid #C89D35',
              color: '#C89D35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              color: 'primary.dark',
            }}
          >
            Chúc Mừng Bạn Đã Hoàn Thành!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Hành trình khảo sát di tích lịch sử đã hoàn tất xuất sắc
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2D7C7', mb: 2 }}>
            <Typography variant="overline" sx={{ color: 'secondary.dark', fontWeight: 800, letterSpacing: '0.08em' }}>
              DI TÍCH ĐÃ KHẢO SÁT & GHI DANH:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', my: 0.5 }}>
              {monumentName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Trạng thái: <strong>Đã xác thực thành công</strong> • Đã lưu vào Bộ sưu tập cá nhân
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left', px: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <strong>1. Đăng ảnh:</strong> Hình ảnh thực địa đã tải lên thành công.
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <strong>2. Nhận diện:</strong> Mô hình AI xác nhận chính xác.
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <strong>3. Bài học lịch sử:</strong> Đã trích xuất các thông điệp di sản.
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <strong>4. Khôi phục dòng thời gian:</strong> Đã hoàn thành thử thách ghép nối niên biểu lịch sử.
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <strong>5. VR 360 Tour:</strong> Đã trải nghiệm không gian toàn cảnh.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<CameraAltIcon />}
            onClick={handleConfirmNewSurvey}
            sx={{ py: 1.2, fontWeight: 800 }}
          >
            Khảo Sát Di Tích Mới
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
