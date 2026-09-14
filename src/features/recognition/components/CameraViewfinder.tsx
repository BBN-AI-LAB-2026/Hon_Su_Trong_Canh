import React from 'react';
import { Box, Button } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCapture: () => void;
  onCancel: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  canvasRef,
  onCapture,
  onCancel,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        mx: 'auto',
        borderRadius: '6px',
        overflow: 'hidden',
        bgcolor: '#1A1410',
        aspectRatio: '4/3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #C89D35',
      }}
      id="camera-viewfinder-box"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Viewfinder Target Framing */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '65%',
          height: '65%',
          border: '1.5px dashed rgba(200, 157, 53, 0.85)',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          display: 'flex',
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={onCapture}
          startIcon={<PhotoCameraIcon />}
          id="btn-capture-camera"
          sx={{ px: 3, fontWeight: 700 }}
        >
          Chụp Ảnh Di Tích
        </Button>
        <Button
          variant="contained"
          onClick={onCancel}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.85)', color: '#2A1F17' }}
          id="btn-cancel-camera"
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
};
