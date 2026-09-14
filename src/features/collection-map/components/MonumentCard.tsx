import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Link as RouterLink } from 'react-router-dom';
import { UserMonumentItem } from '../types';

interface MonumentCardProps {
  monument: UserMonumentItem;
  onExploreClick?: (id: string) => void;
}

export const MonumentCard: React.FC<MonumentCardProps> = ({ monument, onExploreClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid #EBE6DE',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
      id={`monument-card-${monument.id}`}
    >
      <Box sx={{ position: 'relative', height: 180, bgcolor: '#EBE6DE' }}>
        <CardMedia
          component="img"
          image={monument.thumbnailUrl}
          alt={monument.name}
          sx={{
            height: '100%',
            objectFit: 'cover',
            filter: monument.isDiscovered ? 'none' : 'grayscale(80%) brightness(0.8)',
          }}
        />

        {/* Status chip */}
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          {monument.isDiscovered ? (
            <Chip
              icon={<CheckCircleIcon fontSize="small" />}
              label="Đã mở khóa"
              color="success"
              size="small"
              sx={{ fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
            />
          ) : (
            <Chip
              icon={<LockIcon fontSize="small" />}
              label="Chưa mở khóa"
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.65)',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />
          )}
        </Box>

        {/* Region tag */}
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            label={`Miền ${monument.region}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Chip
            label={monument.id}
            size="small"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '0.72rem',
              bgcolor: 'rgba(200, 157, 53, 0.15)',
              color: 'primary.dark',
              height: 20,
            }}
          />
        </Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
          {monument.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16 }} color="primary" />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {monument.location}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {monument.shortDescription}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          component={RouterLink}
          to={`/?monument=${monument.id}`}
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<AutoStoriesIcon />}
          fullWidth
          sx={{ fontSize: '0.78rem' }}
        >
          Xem Lịch Sử
        </Button>
        <Button
          component={RouterLink}
          to={`/vr-tour?monument=${monument.id}`}
          size="small"
          variant="contained"
          color="secondary"
          startIcon={<ViewInArIcon />}
          fullWidth
          sx={{ fontSize: '0.78rem', fontWeight: 700 }}
        >
          VR 360°
        </Button>
      </CardActions>
    </Card>
  );
};
