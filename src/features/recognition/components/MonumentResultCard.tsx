import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link as RouterLink } from 'react-router-dom';
import { RecognitionResult } from '../types';
import { AudioNarrator } from './AudioNarrator';
import { TimelineView } from './TimelineView';
import { HistoryQuiz } from './HistoryQuiz';
import { adminService } from '../../admin/services/adminService';

interface MonumentResultCardProps {
  result: RecognitionResult;
}

export const MonumentResultCard: React.FC<MonumentResultCardProps> = ({ result }) => {
  const { monument, confidenceScore, detectedFeatures } = result;
  const [showConfidence, setShowConfidence] = useState(() => adminService.isShowConfidenceEnabled());

  useEffect(() => {
    const handleUpdate = () => {
      setShowConfidence(adminService.isShowConfidenceEnabled());
    };
    window.addEventListener('ditich_system_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_system_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <Box sx={{ mt: 3 }} id="monument-recognition-result-view">
      {/* Header Banner & Overview */}
      <Card sx={{ mb: 4, overflow: 'hidden', border: '1px solid #EBE6DE' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              minHeight: { xs: 260, md: 380 },
              position: 'relative',
              bgcolor: '#FAF7F0',
            }}
          >
            <Box
              component="img"
              src={monument.thumbnailUrl}
              alt={monument.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                color: 'white',
                borderRadius: 2,
                px: 1.5,
                py: 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
              }}
            >
              <VerifiedIcon sx={{ color: '#D4AF37', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Xác thực di tích
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '55%' } }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CheckCircleIcon fontSize="small" />}
                  label="Đã nhận diện thành công"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                {showConfidence && (
                  <Chip
                    icon={<VerifiedIcon fontSize="small" />}
                    label={`Độ tin cậy: ${confidenceScore}%`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                    id="chip-monument-result-confidence"
                  />
                )}
                <Chip
                  label={`Miền ${monument.region}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  icon={<CheckCircleIcon fontSize="small" />}
                  label="Đã lưu hồ sơ di sản"
                  size="small"
                  sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', color: 'secondary.dark', fontWeight: 600 }}
                />
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'primary.dark',
                  mt: 1,
                  mb: 0.5,
                }}
              >
                {monument.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {monument.location}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                {monument.shortDescription}
              </Typography>

              {/* Action buttons to 360 Tour & Collection Map */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Button
                  component={RouterLink}
                  to={`/vr-tour?monument=${monument.id}`}
                  variant="contained"
                  color="secondary"
                  startIcon={<ViewInArIcon />}
                  id="btn-goto-vr-tour"
                  sx={{ fontWeight: 700 }}
                >
                  Tham Quan VR 360°
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Dấu hiệu kiến trúc đặc trưng nhận diện được:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {detectedFeatures.map((feat, idx) => (
                  <Chip
                    key={idx}
                    label={feat}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.78rem', bgcolor: '#FBF9F5' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>

      {/* Audio Narrator Player */}
      <AudioNarrator
        narrationText={monument.audioNarrationText}
        monumentTitle={monument.name}
      />

      {/* Historical Story Section */}
      <Card sx={{ p: { xs: 2.5, md: 3.5 }, mb: 4, border: '1px solid #EBE6DE' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
          Câu Chuyện Lịch Sử & Giá Trị Văn Hóa
        </Typography>
        {monument.historicalStory.split('\n\n').map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              color: 'text.primary',
              lineHeight: 1.8,
              mb: 2,
              fontSize: '1rem',
              '&:last-child': { mb: 0 },
            }}
          >
            {paragraph}
          </Typography>
        ))}

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #EBE6DE' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Điểm nhấn kiến trúc đặc sắc:
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            {monument.architecturalHighlights.map((hl, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {hl}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      {/* Timeline Section */}
      <TimelineView milestones={monument.timeline} monumentName={monument.name} />

      {/* History Quiz Section */}
      <HistoryQuiz quizList={monument.quiz} monumentName={monument.name} />
    </Box>
  );
};
