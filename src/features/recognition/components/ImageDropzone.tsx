import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { DongSonSunMotif } from '../../../core/components/HeritageMotifs';

interface ImageDropzoneProps {
  onSelectFile: () => void;
  onStartCamera: () => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onSelectFile,
  onStartCamera,
}) => {
  return (
    <Box sx={{ py: { xs: 3.5, sm: 5.5 }, position: 'relative' }} id="image-dropzone-placeholder">
      {/* Subtle Dong Son Watermark in the dropzone background */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0.08,
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <DongSonSunMotif size={200} color="#C59B27" />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <CloudUploadIcon
          sx={{
            fontSize: 54,
            color: '#C59B27',
            mb: 1,
            filter: 'drop-shadow(0 2px 4px rgba(197, 155, 39, 0.25))',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            color: 'primary.dark',
            mb: 1.5,
            fontSize: { xs: '1.05rem', sm: '1.2rem' },
          }}
        >
          Kéo thả ảnh hoặc chọn ảnh thực địa
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={onSelectFile}
            id="btn-select-file"
            sx={{
              px: 3.5,
              py: 1.1,
              fontWeight: 700,
              background: 'linear-gradient(180deg, #8E201B 0%, #6E1515 100%)',
              color: '#FAF6F0',
              border: '1.5px solid #C59B27',
              boxShadow: '0 3px 12px rgba(142, 32, 27, 0.35)',
              '&:hover': {
                background: 'linear-gradient(180deg, #9E2A2B 0%, #7E1818 100%)',
                boxShadow: '0 4px 16px rgba(142, 32, 27, 0.45)',
              },
            }}
          >
            Tải Ảnh Lên
          </Button>
          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={onStartCamera}
            id="btn-open-camera"
            sx={{
              px: 3.5,
              py: 1.1,
              fontWeight: 700,
              background: 'linear-gradient(180deg, #FCFAF5 0%, #F5EFEB 100%)',
              border: '1.5px solid #C59B27',
              color: 'primary.dark',
              boxShadow: '0 2px 6px rgba(50, 26, 15, 0.06)',
              '&:hover': {
                background: '#FAF2E2',
                borderColor: '#9A7416',
              },
            }}
          >
            Chụp Trực Tiếp
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
