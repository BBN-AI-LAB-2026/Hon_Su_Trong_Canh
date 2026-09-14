import React from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth';
import { HeritageCornerFrame } from '../core/components/HeritageCornerFrame';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/nhandien/', { replace: true });
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }} id="page-register">
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
        <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={handleSwitchToLogin} />
      </HeritageCornerFrame>
    </Container>
  );
};
