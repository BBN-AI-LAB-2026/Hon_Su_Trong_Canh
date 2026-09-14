import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { GUIDE_STEPS, SEARCH_GUIDE_STEPS } from '../constants/guideConstants';
import { GuideStepCard } from './GuideStepCard';

interface GuideContentSectionsProps {
  activeCategory: 'SEARCH' | 'RECOGNITION';
}

export const GuideContentSections: React.FC<GuideContentSectionsProps> = ({ activeCategory }) => {
  return (
    <>
      {/* KHỐI 1: CẨM NANG TRA CỨU ĐỊA DANH */}
      {activeCategory === 'SEARCH' && (
        <Box sx={{ position: 'relative', zIndex: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2.5,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Be Vietnam Pro", sans-serif',
                fontWeight: 800,
                color: '#7A1F1D',
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
              }}
            >
              Quy trình 3 bước Tra cứu Địa danh & Di tích
            </Typography>

            <Chip
              icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
              label="Hồ sơ Di tích Toàn diện"
              size="small"
              sx={{
                bgcolor: 'rgba(122, 31, 29, 0.12)',
                color: '#7A1F1D',
                fontWeight: 700,
                border: '1px solid #C4A470',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.2, sm: 2.8 } }}>
            {SEARCH_GUIDE_STEPS.map((step) => (
              <GuideStepCard key={`search-${step.stepNumber}`} step={step} prefix="search" />
            ))}
          </Box>
        </Box>
      )}

      {/* KHỐI 2: CẨM NANG NHẬN DIỆN ẢNH BẰNG TRÍ TUỆ NHÂN TẠO */}
      {activeCategory === 'RECOGNITION' && (
        <Box sx={{ position: 'relative', zIndex: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2.5,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Be Vietnam Pro", sans-serif',
                fontWeight: 800,
                color: '#7A1F1D',
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
              }}
            >
              Quy trình 4 bước Nhận diện Hình ảnh & Khám phá AI
            </Typography>

            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              label="Trí tuệ nhân tạo AI"
              size="small"
              sx={{
                bgcolor: 'rgba(197, 155, 39, 0.18)',
                color: '#8C6718',
                fontWeight: 700,
                border: '1px solid #C59B27',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.2, sm: 2.8 } }}>
            {GUIDE_STEPS.map((step) => (
              <GuideStepCard key={`rec-${step.stepNumber}`} step={step} prefix="recognition" />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};
