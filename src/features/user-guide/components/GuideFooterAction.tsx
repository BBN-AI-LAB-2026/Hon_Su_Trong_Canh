import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';

interface GuideFooterActionProps {
  activeCategory: 'SEARCH' | 'RECOGNITION';
}

export const GuideFooterAction: React.FC<GuideFooterActionProps> = ({ activeCategory }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 3,
        mt: 4,
        pt: 2.5,
        borderTop: '1px dashed #C8AA77',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Button
        component={NavLink}
        to={activeCategory === 'SEARCH' ? '/find/' : '/nhandien/'}
        variant="contained"
        startIcon={activeCategory === 'SEARCH' ? <SearchIcon /> : <CameraAltIcon />}
        endIcon={<ArrowForwardIcon />}
        id="btn-guide-start-action"
        sx={{
          px: 3.2,
          py: 1.2,
          fontWeight: 800,
          fontSize: { xs: '0.9rem', sm: '0.96rem' },
          background: 'linear-gradient(180deg, #8E201B 0%, #6E1515 100%)',
          color: '#FAF6F0',
          border: '1.5px solid #C59B27',
          boxShadow: '0 4px 14px rgba(142, 32, 27, 0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          '&:hover': {
            background: 'linear-gradient(180deg, #9E2A2B 0%, #7E1818 100%)',
            boxShadow: '0 6px 18px rgba(142, 32, 27, 0.45)',
          },
        }}
      >
        {activeCategory === 'SEARCH' ? 'Tra Cứu Địa Danh Ngay' : 'Nhận Diện Hình Ảnh'}
      </Button>
    </Box>
  );
};
