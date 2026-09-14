import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 800, color: 'primary.main', mb: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Không Tìm Thấy Trang
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Trang bạn đang tìm kiếm có thể đã đổi đường dẫn hoặc chưa được mở khóa.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/nhandien/')}
        sx={{ px: 3, py: 1 }}
      >
        Về Trang Chủ
      </Button>
    </Container>
  );
};
