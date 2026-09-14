import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Card, CircularProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import { VrScene, TourHotspot } from '../types';

interface Panorama360ViewerProps {
  scene: VrScene;
  monumentTitle: string;
  onSelectScene?: (sceneId: string) => void;
}

export const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  scene,
  monumentTitle,
  onSelectScene,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewer state
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 0.8 to 2.2
  const [activeHotspot, setActiveHotspot] = useState<TourHotspot | null>(null);

  // Position angles (degrees)
  const yawRef = useRef<number>(0); // Horizontal angle 0-360
  const pitchRef = useRef<number>(0); // Vertical angle -45 to 45
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load Panorama image
  useEffect(() => {
    setIsLoadingImage(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = scene.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setIsLoadingImage(false);
      renderScene();
    };
    img.onerror = () => {
      console.warn('Lỗi tải ảnh panorama, sử dụng chế độ dự phòng.');
      setIsLoadingImage(false);
    };

    return () => {
      imageRef.current = null;
    };
  }, [scene.imageUrl]);

  // Main Render Loop for Equirectangular projection
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const img = imageRef.current;
    if (!img) {
      // Fallback background
      ctx.fillStyle = '#1A1815';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Auto rotate if enabled and not actively dragging
    if (isAutoRotate && !isDraggingRef.current) {
      yawRef.current = (yawRef.current + 0.08) % 360;
    }

    // Equirectangular mapping approximation
    // Yaw maps to X position of image, Pitch maps to Y position
    const currentYaw = yawRef.current;
    const currentPitch = pitchRef.current;

    const imgW = img.naturalWidth || 2000;
    const imgH = img.naturalHeight || 1000;

    // Source coordinates calculated based on spherical angles
    // Normalized yaw 0 -> 1
    const normalizedYaw = ((currentYaw % 360) + 360) % 360 / 360;
    const sourceX = normalizedYaw * imgW;
    const normalizedPitch = (currentPitch + 45) / 90; // 0 to 1
    const sourceY = Math.max(0, Math.min(imgH * 0.5, (1 - normalizedPitch) * (imgH * 0.4)));

    // Visible window size affected by zoom
    const viewWidth = imgW / (2.2 * zoomLevel);
    const viewHeight = imgH / (2.0 * zoomLevel);

    // Draw panoramic slice with seam wrapping
    const sx1 = sourceX;
    const sw1 = Math.min(viewWidth, imgW - sx1);
    const dw1 = (sw1 / viewWidth) * width;

    // Left slice
    ctx.drawImage(img, sx1, sourceY, sw1, viewHeight, 0, 0, dw1, height);

    // If view spans past right edge, wrap to left edge of panoramic image
    if (sw1 < viewWidth) {
      const sw2 = viewWidth - sw1;
      const dw2 = width - dw1;
      ctx.drawImage(img, 0, sourceY, sw2, viewHeight, dw1, 0, dw2, height);
    }

    // Add subtle cinematic vignette around edges
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(renderScene);
  }, [isAutoRotate, zoomLevel]);

  // Start animation frame loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderScene);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderScene]);

  // Resize canvas to container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Mouse & Touch interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    yawRef.current = (yawRef.current - deltaX * 0.2 + 360) % 360;
    pitchRef.current = Math.max(-40, Math.min(40, pitchRef.current + deltaY * 0.15));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

    yawRef.current = (yawRef.current - deltaX * 0.25 + 360) % 360;
    pitchRef.current = Math.max(-40, Math.min(40, pitchRef.current + deltaY * 0.18));

    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(2.0, prev + 0.1));
    } else {
      setZoomLevel((prev) => Math.max(0.8, prev - 0.1));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Hotspot Click Handling
  const handleHotspotClick = (hotspot: TourHotspot) => {
    if (hotspot.targetSceneId && onSelectScene) {
      onSelectScene(hotspot.targetSceneId);
    } else {
      setActiveHotspot(hotspot);
    }
  };

  return (
    <Card
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : { xs: 440, md: 580 },
        bgcolor: '#0E0D0B',
        overflow: 'hidden',
        cursor: 'grab',
        userSelect: 'none',
        '&:active': { cursor: 'grabbing' },
        border: '1px solid #EBE6DE',
      }}
      id="vr-360-canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Loading Spinner */}
      {isLoadingImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            gap: 2,
            zIndex: 10,
          }}
        >
          <CircularProgress color="secondary" size={54} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Đang tải không gian thực tế ảo 360°...
          </Typography>
        </Box>
      )}

      {/* Top Banner: Monument Title & Current Scene */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          bgcolor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          p: 1.5,
          px: 2,
          borderRadius: 2,
          maxWidth: { xs: '80%', sm: 420 },
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
          <ThreeDRotationIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
          <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            VR 360° Panorama Tour
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {scene.title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', mt: 0.4 }}>
          {monumentTitle} • {scene.description}
        </Typography>
      </Box>

      {/* Interactive Hotspots Overlay */}
      {scene.hotspots && scene.hotspots.map((hs) => {
        // Calculate screen projection of hotspot based on current yaw/pitch
        const relYaw = ((hs.yaw - yawRef.current + 180 + 360) % 360) - 180;
        // Visible if in front 120-degree FOV
        const isVisible = Math.abs(relYaw) < 65;
        if (!isVisible) return null;

        const screenX = 50 + (relYaw / 65) * 45; // percentage
        const screenY = 50 - ((hs.pitch - pitchRef.current) / 45) * 35;

        return (
          <Box
            key={hs.id}
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(hs);
            }}
            sx={{
              position: 'absolute',
              top: `${screenY}%`,
              left: `${screenX}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title={hs.title}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                bgcolor: hs.targetSceneId ? '#D4AF37' : 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.8)',
                animation: 'pulseGlow 1.8s infinite',
                '@keyframes pulseGlow': {
                  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
                  '70%': { transform: 'scale(1.15)', boxShadow: '0 0 0 12px rgba(212, 175, 55, 0)' },
                  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)' },
                },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                px: 1,
                py: 0.2,
                borderRadius: 1,
                bgcolor: 'rgba(0,0,0,0.75)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
              }}
            >
              {hs.title}
            </Typography>
          </Box>
        );
      })}

      {/* Floating View Controls (Bottom Right) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          bgcolor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          p: 0.8,
          borderRadius: 2,
          zIndex: 5,
        }}
      >
        <Tooltip title={isAutoRotate ? 'Dừng tự động xoay' : 'Tự động xoay 360'}>
          <IconButton
            size="small"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            sx={{ color: isAutoRotate ? '#D4AF37' : 'white' }}
            id="btn-vr-toggle-autorotate"
          >
            {isAutoRotate ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Phóng to">
          <IconButton
            size="small"
            onClick={() => setZoomLevel((prev) => Math.min(2.0, prev + 0.15))}
            sx={{ color: 'white' }}
            id="btn-vr-zoom-in"
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Thu nhỏ">
          <IconButton
            size="small"
            onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.15))}
            sx={{ color: 'white' }}
            id="btn-vr-zoom-out"
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
          <IconButton
            size="small"
            onClick={toggleFullscreen}
            sx={{ color: 'white' }}
            id="btn-vr-fullscreen"
          >
            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Guide hint at bottom left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          bgcolor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          color: 'rgba(255,255,255,0.8)',
          px: 1.5,
          py: 0.6,
          borderRadius: 1.5,
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="caption">
          Kéo chuột hoặc vuốt để quay 360° • Cuộn chuột để phóng to/thu nhỏ
        </Typography>
      </Box>

      {/* Hotspot detail Dialog */}
      <Dialog
        open={Boolean(activeHotspot)}
        onClose={() => setActiveHotspot(null)}
        slotProps={{ paper: { sx: { borderRadius: 3, maxWidth: 440 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', pb: 1 }}>
          {activeHotspot?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {activeHotspot?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setActiveHotspot(null)} variant="contained" size="small">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
