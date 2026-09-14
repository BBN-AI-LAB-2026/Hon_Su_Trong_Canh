import React from 'react';
import { Box, Typography, Card, Chip, Grid, Button } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CollectionsIcon from '@mui/icons-material/Collections';
import { MonumentVrTour, VrScene } from '../types';

interface SceneSelectorProps {
  currentTour: MonumentVrTour;
  currentScene: VrScene;
  allTours: MonumentVrTour[];
  onSelectScene: (sceneId: string) => void;
  onSelectTour: (tourId: string) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  currentTour,
  currentScene,
  allTours,
  onSelectScene,
  onSelectTour,
}) => {
  return (
    <Box sx={{ mt: 3 }} id="vr-scene-selector-view">
      {/* Current Tour Scenes */}
      <Card sx={{ p: 2.5, mb: 3, border: '1px solid #EBE6DE' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CollectionsIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Các Không Gian Góc Nhìn Của {currentTour.monumentName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {currentTour.scenes.map((sc) => {
            const isSelected = sc.id === currentScene.id;
            return (
              <Box
                key={sc.id}
                onClick={() => onSelectScene(sc.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : '#EBE6DE',
                  bgcolor: isSelected ? 'rgba(139, 69, 19, 0.05)' : 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    transform: 'translateY(-2px)',
                  },
                }}
                id={`btn-scene-${sc.id}`}
              >
                <Box
                  component="img"
                  src={sc.imageUrl}
                  alt={sc.title}
                  sx={{ width: 64, height: 48, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'primary.main' : 'text.primary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {sc.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {sc.hotspots?.length ? `${sc.hotspots.length} điểm chú thích 360` : 'Toàn cảnh tự do'}
                  </Typography>
                </Box>
                {isSelected && (
                  <Chip label="Đang xem" size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />
                )}
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* Switch Monument VR Tour */}
      <Card sx={{ p: 2.5, border: '1px solid #EBE6DE' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ViewInArIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Khám Phá Các Di Tích Khác Bằng Thực Tế Ảo 360°
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {allTours.map((t) => {
            const isCurrent = t.id === currentTour.id;
            return (
              <Box
                key={t.id}
                onClick={() => onSelectTour(t.id)}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: isCurrent ? '#D4AF37' : '#EBE6DE',
                  bgcolor: isCurrent ? 'rgba(212, 175, 55, 0.08)' : 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
                id={`btn-tour-${t.id}`}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                  {t.monumentName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  Địa điểm: {t.location} • {t.scenes.length} không gian
                </Typography>
                <Button
                  size="small"
                  variant={isCurrent ? 'contained' : 'outlined'}
                  color={isCurrent ? 'secondary' : 'primary'}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  {isCurrent ? 'Đang Tham Quan' : 'Vào Tham Quan'}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
};
