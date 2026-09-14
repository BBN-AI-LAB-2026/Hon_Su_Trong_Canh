import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MonumentBasic } from '../../../core/types/common';

interface MonumentCardProps {
  monument: MonumentBasic;
  onSelect: (monument: MonumentBasic) => void;
}

export const MonumentCard: React.FC<MonumentCardProps> = ({ monument, onSelect }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFDF9',
        border: '1.5px solid #D8C29D',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 3px 12px rgba(80,45,20,0.08)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#8E201B',
          boxShadow: '0 8px 24px rgba(142,32,27,0.18)',
        },
      }}
    >
      {/* Khung ảnh di tích */}
      <Box sx={{ position: 'relative', height: 185, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="185"
          image={monument.thumbnailUrl}
          alt={monument.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.45s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        {/* Chip vùng miền */}
        <Chip
          label={`Miền ${monument.region}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(123, 24, 20, 0.88)',
            color: '#FFF8E7',
            fontWeight: 700,
            fontSize: '0.72rem',
            border: '1px solid #D4AF37',
            backdropFilter: 'blur(3px)',
          }}
        />
      </Box>

      {/* Nội dung thông tin di tích */}
      <CardContent sx={{ flexGrow: 1, p: 2.2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Be Vietnam Pro"',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: '#7B1814',
            lineHeight: 1.25,
            mb: 0.8,
          }}
        >
          {monument.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1.2,
            color: '#6A4D32',
          }}
        >
          <LocationOnIcon sx={{ fontSize: 16, color: '#8E201B', flexShrink: 0 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#6A4D32' }}>
            {monument.location}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#533827',
            fontSize: '0.84rem',
            lineHeight: 1.5,
            mb: 2,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {monument.shortDescription}
        </Typography>

        <Divider sx={{ my: 1.2, borderColor: '#EBE0CC' }} />

        {/* NÚT TÌM HIỂU */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onSelect(monument)}
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 'auto',
            bgcolor: '#8E201B',
            color: '#FFF8E7',
            fontWeight: 700,
            py: 1,
            border: '1px solid #D4AF37',
            boxShadow: '0 2px 6px rgba(142,32,27,0.25)',
            '&:hover': {
              bgcolor: '#7A1F1D',
              boxShadow: '0 4px 12px rgba(142,32,27,0.4)',
            },
          }}
        >
          Tìm Hiểu
        </Button>
      </CardContent>
    </Card>
  );
};
