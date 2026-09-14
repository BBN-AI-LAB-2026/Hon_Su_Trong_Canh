import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SchemaIcon from '@mui/icons-material/Schema';
import { MonumentMindMap } from '../services/mindmapService';

interface MindMapCanvasViewerProps {
  monumentName: string;
  mindMap: MonumentMindMap | null;
}

export const MindMapCanvasViewer: React.FC<MindMapCanvasViewerProps> = ({
  monumentName,
  mindMap,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const toggleFullscreen = () => {
    if (!canvasContainerRef.current) return;
    if (!document.fullscreenElement) {
      canvasContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isVideo =
    mindMap &&
    (mindMap.type === 'video' ||
      mindMap.content.includes('/video/upload/') ||
      mindMap.content.toLowerCase().endsWith('.mp4') ||
      mindMap.content.toLowerCase().endsWith('.webm'));

  const isImage = mindMap && mindMap.type === 'image';

  return (
    <Box
      ref={canvasContainerRef}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 340, sm: 460, md: 520 },
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #D8CEBD',
        bgcolor: '#FBF9F4',
        backgroundImage:
          'radial-gradient(circle, rgba(200, 157, 53, 0.22) 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 0 40px rgba(74, 37, 17, 0.04)',
      }}
      id="mindmap-canvas-container"
    >
      {/* Floating Controls Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #DFD5C6',
          borderRadius: '8px',
          p: 0.5,
          boxShadow: '0 4px 14px rgba(42, 31, 23, 0.12)',
        }}
      >
        <Tooltip title="Phóng to">
          <IconButton size="small" onClick={handleZoomIn} id="btn-mindmap-zoom-in">
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Thu nhỏ">
          <IconButton size="small" onClick={handleZoomOut} id="btn-mindmap-zoom-out">
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Đặt lại kích thước (100%)">
          <IconButton size="small" onClick={handleResetZoom} id="btn-mindmap-reset-zoom">
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
          <IconButton size="small" onClick={toggleFullscreen} id="btn-mindmap-fullscreen">
            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Scale Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #DFD5C6',
          borderRadius: '6px',
          px: 1.2,
          py: 0.4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          Tỷ lệ: {Math.round(zoomLevel * 100)}%
        </Typography>
      </Box>

      {/* Canvas Content */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {mindMap && mindMap.content ? (
          isVideo ? (
            <Box
              sx={{
                width: '100%',
                maxWidth: '920px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                component="video"
                src={mindMap.content}
                playsInline
                autoPlay
                muted={false}
                sx={{
                  width: '100%',
                  maxHeight: { xs: 360, sm: 460, md: 540 },
                  borderRadius: '8px',
                  border: '1px solid #D8CEBD',
                  bgcolor: '#000000',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              >
                <source src={mindMap.content} type="video/mp4" />
                Trình duyệt không hỗ trợ phát video MindMap.
              </Box>
            </Box>
          ) : isImage ? (
            <Box
              component="img"
              src={mindMap.content}
              alt={`Sơ đồ kiến thức ${monumentName}`}
              sx={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: '1px solid #E2D7C7',
                bgcolor: '#FFFFFF',
              }}
            />
          ) : (
            <Box
              component="iframe"
              src={mindMap.content}
              title={`Sơ đồ MindMap ${monumentName}`}
              sx={{
                width: '95%',
                height: { xs: '380px', sm: '480px' },
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
            />
          )
        ) : (
          /* Placeholder Diagram when no custom mindmap exists */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 3,
            }}
          >
            <SchemaIcon sx={{ fontSize: 64, color: '#C89D35', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1 }}>
              {monumentName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 460 }}>
              Sơ đồ tư duy kiến trúc và dữ liệu lịch sử chưa được cấu hình liên kết.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
