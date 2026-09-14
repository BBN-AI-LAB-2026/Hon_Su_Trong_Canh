import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router-dom';
import { UserMonumentItem } from '../types';

interface InteractiveVietnamMapProps {
  monuments: UserMonumentItem[];
  selectedMonumentId?: string;
  onSelectMonument?: (monument: UserMonumentItem) => void;
}

export const InteractiveVietnamMap: React.FC<InteractiveVietnamMapProps> = ({
  monuments,
  selectedMonumentId,
  onSelectMonument,
}) => {
  const [activeItem, setActiveItem] = useState<UserMonumentItem | null>(null);
  const navigate = useNavigate();

  const handlePinClick = (item: UserMonumentItem) => {
    setActiveItem(item);
    onSelectMonument?.(item);
  };

  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        border: '1px solid #EBE6DE',
        position: 'relative',
        background: 'linear-gradient(180deg, #F8F6F0 0%, #F1EDE3 100%)',
        overflow: 'hidden',
      }}
      id="interactive-vietnam-map-card"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
            Bản Đồ Di Tích Khám Phá Toàn Quốc
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Bấm vào các điểm ghim vàng để xem di tích đã lưu trong hành trình của bạn
          </Typography>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#D4AF37', boxShadow: '0 0 6px #D4AF37' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Đã mở khóa</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9E9E9E' }} />
            <Typography variant="caption" color="text.secondary">Chưa khám phá</Typography>
          </Box>
        </Box>
      </Box>

      {/* Vietnam Map Canvas / SVG Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 760,
          mx: 'auto',
          aspectRatio: { xs: '1/1.2', sm: '1/0.95', md: '1/0.85' },
          bgcolor: 'rgba(255,255,255,0.65)',
          borderRadius: 3,
          p: 2,
          border: '1px solid #E6DFD3',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Stylized Vietnam S-Curve SVG Map */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2DCD1" />
              <stop offset="50%" stopColor="#D9D2C4" />
              <stop offset="100%" stopColor="#CEC5B3" />
            </linearGradient>
            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#8B4513" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Sea ripples / compass rose decor */}
          <circle cx="82" cy="22" r="10" fill="none" stroke="#D5CEBE" strokeWidth="0.5" strokeDasharray="1 1" />
          <text x="82" y="16" fontSize="3" fill="#8B7D6B" textAnchor="middle" fontWeight="bold">BẮC</text>
          <text x="82" y="30" fontSize="2.5" fill="#A89F8D" textAnchor="middle">BIỂN ĐÔNG</text>

          {/* Mainland Vietnam Stylized Boundary Polygon (Iconic S shape) */}
          <path
            d="M 38,8
               C 50,7 62,11 60,18
               C 58,22 48,22 45,26
               C 42,30 45,34 52,38
               C 58,42 66,45 68,52
               C 70,58 64,65 60,72
               C 56,77 58,82 54,88
               C 50,92 42,94 38,92
               C 34,90 36,84 42,80
               C 46,76 48,72 45,68
               C 40,62 44,52 42,44
               C 40,36 32,32 30,25
               C 28,18 32,10 38,8 Z"
            fill="url(#mapGradient)"
            stroke="#B5AB99"
            strokeWidth="0.8"
            filter="url(#mapShadow)"
          />

          {/* Island territories representation */}
          {/* Phu Quoc Island */}
          <ellipse cx="32" cy="88" rx="2.5" ry="3.5" fill="#D9D2C4" stroke="#B5AB99" strokeWidth="0.5" />
          <text x="32" y="93" fontSize="1.8" fill="#8B7D6B" textAnchor="middle">Phú Quốc</text>

          {/* Hoang Sa Archipelago */}
          <g transform="translate(80, 42)">
            <circle cx="0" cy="0" r="1" fill="#AA820A" />
            <circle cx="3" cy="1.5" r="0.8" fill="#AA820A" />
            <circle cx="-2" cy="2.5" r="0.9" fill="#AA820A" />
            <text x="0" y="5.5" fontSize="2" fill="#8B4513" textAnchor="middle" fontWeight="bold">QĐ. Hoàng Sa</text>
          </g>

          {/* Truong Sa Archipelago */}
          <g transform="translate(82, 74)">
            <circle cx="0" cy="0" r="1.1" fill="#AA820A" />
            <circle cx="4" cy="2" r="0.9" fill="#AA820A" />
            <circle cx="-3" cy="3" r="1" fill="#AA820A" />
            <circle cx="2" cy="5" r="0.8" fill="#AA820A" />
            <text x="0" y="8" fontSize="2" fill="#8B4513" textAnchor="middle" fontWeight="bold">QĐ. Trường Sa</text>
          </g>
        </svg>

        {/* Monument Interactive Pins placed on percentage coords */}
        {monuments.map((m) => {
          const isSelected = activeItem?.id === m.id || selectedMonumentId === m.id;
          return (
            <Box
              key={m.id}
              onClick={() => handlePinClick(m)}
              sx={{
                position: 'absolute',
                top: `${m.coordinates.yPercent}%`,
                left: `${m.coordinates.xPercent}%`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: isSelected ? 20 : 10,
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'translate(-50%, -115%) scale(1.15)',
                },
              }}
              id={`pin-${m.id}`}
            >
              <Tooltip title={`${m.name} (${m.isDiscovered ? 'Đã khám phá' : 'Chưa khám phá'})`} arrow>
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Pin Body */}
                  <Box
                    sx={{
                      width: isSelected ? 34 : 28,
                      height: isSelected ? 34 : 28,
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-45deg)',
                      bgcolor: m.isDiscovered ? '#D4AF37' : '#757575',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: m.isDiscovered
                        ? '0 3px 12px rgba(212, 175, 55, 0.6)'
                        : '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Box sx={{ transform: 'rotate(45deg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {m.isDiscovered ? (
                        <LocationOnIcon sx={{ fontSize: isSelected ? 20 : 16 }} />
                      ) : (
                        <LockIcon sx={{ fontSize: isSelected ? 16 : 13 }} />
                      )}
                    </Box>
                  </Box>

                  {/* Pin pulse ring if discovered */}
                  {m.isDiscovered && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        width: 14,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'rgba(212, 175, 55, 0.4)',
                        animation: 'pulseRing 2s infinite',
                        '@keyframes pulseRing': {
                          '0%': { transform: 'scale(1)', opacity: 0.8 },
                          '100%': { transform: 'scale(2.2)', opacity: 0 },
                        },
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            </Box>
          );
        })}

        {/* Selected Monument Popup Card */}
        {activeItem && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: { xs: 16, sm: 'auto' },
              maxWidth: 340,
              p: 2,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              border: '1px solid #EBE6DE',
              zIndex: 30,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              animation: 'fadeInUp 0.2s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(10px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Chip
                label={activeItem.isDiscovered ? 'Đã Mở Khóa' : 'Chưa Khám Phá'}
                color={activeItem.isDiscovered ? 'success' : 'default'}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              />
              <IconButton size="small" onClick={() => setActiveItem(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
              <Box
                component="img"
                src={activeItem.thumbnailUrl}
                alt={activeItem.name}
                sx={{ width: 70, height: 70, borderRadius: 1.5, objectFit: 'cover' }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.3 }}>
                  {activeItem.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {activeItem.location} • Miền {activeItem.region}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 0.4 }}>
                  {activeItem.shortDescription}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                startIcon={<ViewInArIcon />}
                onClick={() => navigate(`/vr-tour?monument=${activeItem.id}`)}
                sx={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                VR 360°
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                startIcon={<AutoStoriesIcon />}
                onClick={() => navigate(`/nhandien/?monument=${activeItem.id}`)}
                sx={{ fontSize: '0.75rem' }}
              >
                Chi Tiết
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Card>
  );
};
