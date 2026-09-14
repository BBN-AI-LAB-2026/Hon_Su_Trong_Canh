import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  HOME_SCROLL_BOXES,
  AncientScrollBox,
  AntiqueFramedAnimatedBanner,
} from '../features/home';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      id="home-page-hero"
      sx={{
        width: '100%',
        height: '100%',
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundImage: `url('/home.jpg')`,
        backgroundSize: { xs: 'cover', md: '100% 100%' },
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        pt: 0,
        pb: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      {/* Khung tranh cổ phong cách hoàng gia chứa ảnh động với vị trí cố định trên từng thiết bị */}
      <AntiqueFramedAnimatedBanner />

      {/* Hero Content Wrapper */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 720, md: '100%', lg: 1320, xl: 1540 },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 0, lg: 5.0 },
            pb: { xs: 'calc(29vh)', sm: 'calc(25vh)', md: 'calc(22vh)', lg: 0 },
          }}
        >
          {/* Button Bắt Đầu Khám Phá */}
          <Button
            id="btn-bat-dau-kham-pha"
            onClick={() => navigate('/nhandien/')}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 20, color: '#FCE79F' }} />}
            sx={{
              px: { xs: 3.5, sm: 4.5, md: 5 },
              py: { xs: 0.9, sm: 1.1, md: 1.2 },
              fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
              fontWeight: 800,
              fontFamily: '"Be Vietnam Pro"',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '32px',
              color: '#FFF8E8',
              backgroundImage: 'linear-gradient(180deg, #9E241E 0%, #761612 100%)',
              border: '2px solid #D4AF37',
              boxShadow: `
                0 6px 18px rgba(118, 22, 18, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.35),
                0 0 0 2px rgba(212, 175, 55, 0.2)
              `,
              transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.02)',
                backgroundImage: 'linear-gradient(180deg, #B12B24 0%, #851914 100%)',
                boxShadow: `
                  0 8px 22px rgba(118, 22, 18, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.5),
                  0 0 0 3px rgba(212, 175, 55, 0.35)
                `,
                borderColor: '#F1D278',
              },
              '&:active': {
                transform: 'translateY(0) scale(0.99)',
              },
            }}
          >
            BẮT ĐẦU KHÁM PHÁ
          </Button>

          {/* 6 Box Chức Năng Nằm Cùng 1 Hàng Dạng Cuộn Giấy Cổ (Tự động ẩn trên Điện thoại & iPad/Tablet, chỉ hiển thị trên Máy tính) */}
          <Box
            id="home-scroll-boxes-grid"
            sx={{
              width: '100%',
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'grid' },
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: { lg: 1.6, xl: 2 },
              alignItems: 'stretch',
            }}
          >
            {HOME_SCROLL_BOXES.map((box) => (
              <AncientScrollBox
                key={box.id}
                id={box.id}
                title={box.title}
                desc={box.desc}
                icon={box.icon}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
