import React from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../features/auth';
import { HeritageCornerFrame } from '../core/components/HeritageCornerFrame';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }} id="page-login">
      <Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src="/Logo_web.png"
          alt="Logo Di Tích Việt"
          sx={{
            width: 80,
            height: 80,
            objectFit: 'contain',
          }}
        />
      </Box>
      <HeritageCornerFrame>
        <LoginForm onSuccess={handleSuccess} />
      </HeritageCornerFrame>
    </Container>
  );
};
