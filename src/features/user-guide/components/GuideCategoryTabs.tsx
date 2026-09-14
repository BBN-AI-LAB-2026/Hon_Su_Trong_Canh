import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';

interface GuideCategoryTabsProps {
  activeCategory: 'SEARCH' | 'RECOGNITION';
  onCategoryChange: (category: 'SEARCH' | 'RECOGNITION') => void;
}

export const GuideCategoryTabs: React.FC<GuideCategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mb: { xs: 3, sm: 3.8 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          mb: { xs: 0.6, sm: 0.8 },
          opacity: 0.75,
        }}
        aria-hidden="true"
      >
        <Box sx={{ width: { xs: 26, sm: 42 }, height: '1px', bgcolor: '#A06E35' }} />
        <Box
          sx={{
            width: 5.5,
            height: 5.5,
            borderRadius: '50%',
            bgcolor: '#7A1F1D',
            boxShadow: '0 0 3px #7A1F1D',
          }}
        />
        <Box sx={{ width: { xs: 26, sm: 42 }, height: '1px', bgcolor: '#A06E35' }} />
      </Box>

      <Typography
        component="span"
        sx={{
          fontFamily: '"Be Vietnam Pro", sans-serif',
          fontWeight: 700,
          fontSize: { xs: '0.98rem', sm: '1.2rem', md: '1.35rem' },
          color: '#7A1F1D',
          letterSpacing: { xs: '0.04em', sm: '0.07em' },
          lineHeight: 1.25,
          textTransform: 'uppercase',
          textShadow: '0 1px 1px rgba(255, 252, 245, 0.95), 0 2px 4px rgba(90, 30, 15, 0.1)',
        }}
      >
        Cẩm Nang Khám Phá
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.4,
          my: { xs: 0.4, sm: 0.5 },
          width: '100%',
          maxWidth: 320,
        }}
        aria-hidden="true"
      >
        <Box
          sx={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #B8860B 60%, #7A1F1D 100%)',
          }}
        />
        <Box
          sx={{
            width: 7,
            height: 7,
            transform: 'rotate(45deg)',
            bgcolor: '#7A1F1D',
            border: '1px solid #D4AF37',
            boxShadow: '0 0 3px rgba(122, 31, 29, 0.35)',
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, #7A1F1D 0%, #B8860B 40%, transparent 100%)',
          }}
        />
      </Box>

      <Typography
        component="h1"
        sx={{
          fontFamily: '"Be Vietnam Pro", sans-serif',
          fontWeight: 900,
          fontSize: { xs: '1.55rem', sm: '2.1rem', md: '2.45rem' },
          color: '#5B1513',
          letterSpacing: { xs: '0.04em', sm: '0.07em' },
          lineHeight: 1.2,
          textTransform: 'uppercase',
          textShadow: `
            0 1px 2px rgba(255, 250, 240, 1),
            0 2px 6px rgba(70, 20, 10, 0.18),
            0 4px 12px rgba(90, 25, 15, 0.08)
          `,
        }}
      >
        Hướng Dẫn Sử Dụng
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontFamily: '"Be Vietnam Pro", sans-serif',
          color: '#654321',
          fontSize: { xs: '0.88rem', sm: '0.98rem' },
          maxWidth: 720,
          mt: 1,
          lineHeight: 1.6,
          fontWeight: 500,
        }}
      >
        Cẩm nang trải nghiệm toàn diện: Khám phá di sản bằng <strong>Tính Năng Tra Cứu Địa Danh</strong> trực tiếp và <strong>Quy Trình Nhận Diện Hình Ảnh AI</strong> kết hợp thực tế ảo VR 360°.
      </Typography>

      {/* Chuyển tab cẩm nang */}
      <Box
        sx={{
          mt: 2.5,
          p: 0.6,
          bgcolor: 'rgba(255, 253, 249, 0.88)',
          borderRadius: '28px',
          border: '1.5px solid #D8C29D',
          boxShadow: '0 2px 8px rgba(80, 45, 20, 0.08)',
          display: 'inline-flex',
          gap: 0.8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Button
          size="small"
          variant={activeCategory === 'RECOGNITION' ? 'contained' : 'text'}
          onClick={() => onCategoryChange('RECOGNITION')}
          startIcon={<CameraAltIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: { xs: '0.78rem', sm: '0.84rem' },
            px: { xs: 1.5, sm: 2 },
            py: 0.6,
            bgcolor: activeCategory === 'RECOGNITION' ? '#8E201B' : 'transparent',
            color: activeCategory === 'RECOGNITION' ? '#FFF8E7' : '#704214',
            '&:hover': {
              bgcolor: activeCategory === 'RECOGNITION' ? '#7A1F1D' : 'rgba(142, 32, 27, 0.08)',
            },
          }}
        >
          1. Quy trình Nhận diện ảnh AI
        </Button>
        <Button
          size="small"
          variant={activeCategory === 'SEARCH' ? 'contained' : 'text'}
          onClick={() => onCategoryChange('SEARCH')}
          startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: { xs: '0.78rem', sm: '0.84rem' },
            px: { xs: 1.5, sm: 2 },
            py: 0.6,
            bgcolor: activeCategory === 'SEARCH' ? '#8E201B' : 'transparent',
            color: activeCategory === 'SEARCH' ? '#FFF8E7' : '#704214',
            '&:hover': {
              bgcolor: activeCategory === 'SEARCH' ? '#7A1F1D' : 'rgba(142, 32, 27, 0.08)',
            },
          }}
        >
          2. Hướng dẫn Tra cứu Địa danh
        </Button>
      </Box>
    </Box>
  );
};
