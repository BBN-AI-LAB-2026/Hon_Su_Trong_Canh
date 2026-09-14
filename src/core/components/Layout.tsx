import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { DongSonSunMotif, AncientCloudMotif } from './HeritageMotifs';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome =
    location.pathname === '/' ||
    location.pathname === '/home' ||
    location.pathname === '/home/' ||
    location.pathname.startsWith('/home');
  const isNhanDien = location.pathname.startsWith('/nhandien');

  const bgImage = isNhanDien ? `url('/back_gr.jpg')` : `url('/home.jpg')`;

  return (
    <Box
      id="app-layout"
      sx={{
        minHeight: '100vh',
        height: isHome ? '100vh' : 'auto',
        maxHeight: isHome ? '100vh' : 'none',
        overflow: isHome ? 'hidden' : 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F7F2E7',
        backgroundImage: isHome
          ? 'none'
          : `
          radial-gradient(ellipse at 50% 20%, rgba(255, 253, 248, 0.6) 0%, rgba(247, 242, 231, 0.85) 70%, rgba(235, 226, 212, 0.95) 100%),
          ${bgImage}
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        position: 'relative',
      }}
    >
      {/* Subtle Background Heritage Motifs (non-intrusive watermarks) */}
      {!isHome && (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: -30,
              right: -30,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.12,
            }}
            aria-hidden="true"
          >
            <DongSonSunMotif size={280} color="#C59B27" />
          </Box>

          <Box
            sx={{
              position: 'fixed',
              top: 90,
              left: 12,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.2,
              display: { xs: 'none', md: 'block' },
            }}
            aria-hidden="true"
          >
            <AncientCloudMotif width={110} height={50} color="#C59B27" />
          </Box>

          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: -40,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.1,
              display: { xs: 'none', lg: 'block' },
            }}
            aria-hidden="true"
          >
            <DongSonSunMotif size={240} color="#8E201B" />
          </Box>
        </>
      )}

      {/* Header & Main Content */}
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          minHeight: 0,
          py: isHome ? 0 : { xs: 2, md: 3.5 },
          position: 'relative',
          zIndex: 1,
          height: isHome ? '100%' : 'auto',
          overflow: isHome ? 'hidden' : 'visible',
          display: isHome ? 'flex' : 'block',
          flexDirection: isHome ? 'column' : undefined,
        }}
      >
        {children}
      </Box>

      {/* Footer (ẩn hoàn toàn ở trang /home/ để không bị cuộn trang) */}
      {!isHome && (
        <Box
          component="footer"
          id="app-footer"
          sx={{
            py: 2.2,
            px: 2,
            mt: 'auto',
            borderTop: '1px solid #D8C5AA',
            bgcolor: 'rgba(252, 250, 245, 0.95)',
            backgroundImage: 'linear-gradient(180deg, #FAF5EB 0%, #F5EDE0 100%)',
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 -2px 10px rgba(50, 26, 15, 0.03)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 2, sm: 5 },
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  color: 'primary.dark',
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', sm: '0.92rem' },
                  letterSpacing: '0.01em',
                }}
              >
                Admin: <strong>BBN AI Lab</strong>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  color: 'primary.dark',
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', sm: '0.92rem' },
                  letterSpacing: '0.01em',
                }}
              >
                Email:{' '}
                <Box
                  component="a"
                  href="mailto:bbnailab2026@gmail.com"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 700,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'secondary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  bbnailab2026@gmail.com
                </Box>
              </Typography>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

