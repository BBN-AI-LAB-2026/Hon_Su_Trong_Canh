import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { EmbeddedVrSpace, vrTourAdminService } from '../services/vrTourAdminService';
import { AdminEmbedModal } from './AdminEmbedModal';
import { VrIframePlayer } from './VrIframePlayer';
import { HeritageSeal } from '../../../core/components/HeritageSeal';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';

export interface EmbeddedVrViewerProps {
  space?: EmbeddedVrSpace;
}

export const EmbeddedVrViewer: React.FC<EmbeddedVrViewerProps> = ({ space: propSpace }) => {
  const [spaces, setSpaces] = useState<EmbeddedVrSpace[]>(() => vrTourAdminService.getEmbeddedSpaces());
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(() => {
    const list = vrTourAdminService.getEmbeddedSpaces();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const monumentParam = urlParams.get('monument');
      if (monumentParam) {
        const found = list.find(
          (s) =>
            s.monumentCode?.toLowerCase() === monumentParam.toLowerCase() ||
            s.id.toLowerCase() === monumentParam.toLowerCase() ||
            (monumentParam.toLowerCase().includes('doc-lap') && s.monumentCode === 'DinhDocLap') ||
            ((monumentParam.toLowerCase().includes('duc-ba') || monumentParam.toLowerCase().includes('ducba') || monumentParam.toLowerCase().includes('nhathodb') || monumentParam.toLowerCase().includes('nha-tho-db')) &&
              (s.monumentCode === 'NhaThoDB' || s.id === 'vr-nha-tho-duc-ba')) ||
            ((monumentParam.toLowerCase().includes('my-son') || monumentParam.toLowerCase().includes('myson') || monumentParam.toLowerCase().includes('tdiams') || monumentParam.toLowerCase().includes('thanh-dia')) &&
              (s.monumentCode === 'TDiaMS' || s.id === 'vr-thanh-dia-my-son')) ||
            ((monumentParam.toLowerCase().includes('lang-bac') || monumentParam.toLowerCase().includes('langbac') || monumentParam.toLowerCase().includes('langchutich') || monumentParam.toLowerCase().includes('lang-chu-tich')) &&
              (s.monumentCode === 'LangChuTichHCM' || s.id === 'vr-lang-chu-tich-hcm')) ||
            s.title.toLowerCase().includes(monumentParam.toLowerCase())
        );
        if (found) return found.id;
      }
    }
    return list[0] ? list[0].id : null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const updated = vrTourAdminService.getEmbeddedSpaces();
      setSpaces(updated);
    };
    window.addEventListener('ditich_vr_spaces_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_vr_spaces_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Panorama Canvas state (when embedType is panorama_image)
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeSpace = propSpace || (activeSpaceId ? spaces.find((s) => s.id === activeSpaceId) : undefined) || spaces[0];

  const handleSpaceAdded = (newSpace: EmbeddedVrSpace) => {
    const updated = [newSpace, ...spaces];
    setSpaces(updated);
    setActiveSpaceId(newSpace.id);
  };

  const handleRemoveSpace = (id: string) => {
    vrTourAdminService.removeEmbeddedSpace(id);
    const updated = spaces.filter((s) => s.id !== id);
    setSpaces(updated);
    setActiveSpaceId(updated[0] ? updated[0].id : null);
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

      const normalizedYaw = (yawRef.current % 360 + 360) % 360;
      const sourceX = (normalizedYaw / 360) * img.naturalWidth;
      const pitchOffset = (pitchRef.current / 90) * (img.naturalHeight * 0.2);
      const sourceY = Math.max(
        0,
        Math.min(
          img.naturalHeight - sliceHeight,
          (img.naturalHeight - sliceHeight) / 2 - pitchOffset
        )
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

  return (
    <Card sx={{ overflow: 'hidden' }} id="embedded-vr-tour-card">
      <HeritageCornerFrame>
        {/* Top Header Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            pb: 1.5,
            borderBottom: '1px solid #E4DACB',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HeritageSeal text="VR 360" subtext="DI SẢN" size="small" />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                }}
              >
                {activeSpace ? activeSpace.title : 'Không Gian VR 360°'}
              </Typography>
              {activeSpace && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 13, color: 'secondary.main' }} />
                  {activeSpace.location}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Admin Embed Button */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            id="btn-admin-open-embed"
            sx={{
              borderColor: '#C89D35',
              color: 'primary.dark',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Quản Trị Viên: Nhúng Tour
          </Button>
        </Box>

        {/* Space Selector Chips if multiple embedded spaces exist */}
        {spaces.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 0.5 }}>
            {spaces.map((s) => (
              <Chip
                key={s.id}
                label={s.title}
                onClick={() => setActiveSpaceId(s.id)}
                color={s.id === activeSpaceId ? 'primary' : 'default'}
                variant={s.id === activeSpaceId ? 'filled' : 'outlined'}
                size="small"
                sx={{ fontWeight: 600, borderRadius: '4px' }}
              />
            ))}
          </Box>
        )}

        {/* Main Viewer Display or Waiting Screen */}
        {(!activeSpace || activeSpace.vrOption === 'C' || activeSpace.embedType === 'external_url') ? (
          /* Option C: Clean, light heritage card - NO black background, NO iframe */
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
                fontFamily: '"Playfair Display", "Be Vietnam Pro", serif',
                fontWeight: 800,
                color: '#3D1C06',
                mb: 1.2,
                fontSize: { xs: '1.25rem', sm: '1.45rem' },
              }}
            >
              {activeSpace?.title || 'Không Gian Thực Tế Ảo 360°'}
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
              {activeSpace?.embedUrl && activeSpace.embedUrl.trim()
                ? (activeSpace.description || 'Không gian thực tế ảo 360° đã sẵn sàng. Nhấp vào nút bên dưới để bắt đầu trải nghiệm.')
                : 'Không gian thực tế ảo VR 360° (Lựa chọn C) đã được thiết lập. Quản trị viên sẽ cập nhật đường dẫn sau.'}
            </Typography>

            {activeSpace?.embedUrl && activeSpace.embedUrl.trim() ? (
              <Button
                variant="contained"
                size="large"
                endIcon={<OpenInNewIcon />}
                onClick={() => {
                  const cleanUrl = activeSpace.embedUrl.trim();
                  const targetUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                id="btn-vr-open-external-tab"
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
          <Box
            ref={containerRef}
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: activeSpace.embedType === 'iframe' ? '600px' : { xs: 340, sm: 480, md: 540 },
              borderRadius: '4px',
              overflow: 'hidden',
              bgcolor: '#1E1813',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #DFD5C6',
            }}
          >
            {activeSpace.embedType === 'iframe' ? (
              /* Option B: Iframe VR 360 Player (Panoee, Kuula, Matterport) */
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

            {/* Delete space button if active space exists */}
            <Tooltip title="Xóa không gian này khỏi danh sách">
              <IconButton
                size="small"
                onClick={() => handleRemoveSpace(activeSpace.id)}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                  '&:hover': { bgcolor: 'rgba(153, 27, 27, 0.85)' },
                }}
                id="btn-delete-vr-space"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </HeritageCornerFrame>

      {/* Admin Embed Modal */}
      <AdminEmbedModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSpaceAdded={handleSpaceAdded}
      />
    </Card>
  );
};
