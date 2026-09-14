import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { MonumentBasic } from '../../../core/types/common';
import { KnowledgeMindMapStep } from '../../recognition/components/KnowledgeMindMapStep';
import { QuickFunQuizStep } from '../../recognition/components/QuickFunQuizStep';
import { VrTourStep } from '../../recognition/components/VrTourStep';
import { MonumentHeritageStoriesAndQuiz } from '../../recognition/components/MonumentHeritageStoriesAndQuiz';

interface MonumentDetailViewProps {
  monument: MonumentBasic;
  onBackToSearch: () => void;
}

export const MonumentDetailView: React.FC<MonumentDetailViewProps> = ({
  monument,
  onBackToSearch,
}) => {
  const [subTab, setSubTab] = useState<'story' | 'mindmap' | 'timeline' | 'vr'>('story');

  return (
    <Box id="monument-detail-view">
      {/* THANH ĐIỀU HƯỚNG BƯỚC 3 */}
      <HeritageCornerFrame
        sx={{
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 1.8,
          }}
        >
          {/* Nút Quay Lại Tra Cứu */}
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBackToSearch}
            sx={{
              borderColor: '#8E201B',
              color: '#8E201B',
              fontWeight: 700,
              px: 2,
              py: 0.75,
              '&:hover': {
                bgcolor: 'rgba(142,32,27,0.08)',
                borderColor: '#7A1F1D',
              },
            }}
          >
            Tra cứu địa danh khác
          </Button>

          {/* Tiêu đề di tích hiện tại */}
          <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Be Vietnam Pro"',
                fontWeight: 800,
                color: '#7B1814',
                lineHeight: 1.2,
              }}
            >
              {monument.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6A4D32', fontWeight: 600 }}>
              <LocationOnIcon sx={{ fontSize: 13, verticalAlign: 'text-bottom', color: '#8E201B' }} />{' '}
              {monument.location} (Miền {monument.region})
            </Typography>
          </Box>

          {/* Huy hiệu di sản */}
          <Chip
            label="Hồ Sơ Di Tích Lịch Sử"
            size="small"
            sx={{
              bgcolor: 'rgba(212,175,55,0.2)',
              color: '#6A4D32',
              border: '1px solid #C59B27',
              fontWeight: 700,
            }}
          />
        </Box>

        {/* Tabs chuyển đổi giữa 4 nội dung */}
        <Divider sx={{ my: 1.8, borderColor: '#D8C29D' }} />
        <Tabs
          value={subTab}
          onChange={(_, val) => setSubTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              bgcolor: '#8E201B',
              height: 3,
            },
            '& .MuiTab-root': {
              fontFamily: '"Be Vietnam Pro"',
              fontWeight: 600,
              fontSize: { xs: '0.84rem', sm: '0.92rem' },
              color: '#5C1D17',
              textTransform: 'none',
              minHeight: 44,
              '&.Mui-selected': {
                color: '#8E201B',
                fontWeight: 800,
              },
            },
          }}
        >
          <Tab
            value="story"
            icon={<MenuBookIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Thông Tin & Thuyết Minh"
          />
          <Tab
            value="mindmap"
            icon={<AccountTreeIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Sơ Đồ Kiến Thức"
          />
          <Tab
            value="timeline"
            icon={<TimelineIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Khôi Phục Dòng Thời Gian"
          />
          <Tab
            value="vr"
            icon={<ViewInArIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="VR 360° Tour"
          />
        </Tabs>
      </HeritageCornerFrame>

      {/* PHẦN 1: THÔNG TIN DI TÍCH & THUYẾT MINH ÂM THANH */}
      {subTab === 'story' && (
        <Box>
          {/* Banner ảnh & tóm tắt */}
          <HeritageCornerFrame
            sx={{
              mb: 3,
              p: { xs: 2.5, sm: 3.5 },
              background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 3,
              }}
            >
              <Box sx={{ width: { xs: '100%', md: '42%' }, flexShrink: 0 }}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 4px 16px rgba(80,45,20,0.15)',
                  }}
                >
                  <Box
                    component="img"
                    src={monument.thumbnailUrl}
                    alt={monument.name}
                    sx={{
                      width: '100%',
                      height: { xs: 220, sm: 260 },
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Chip
                    label={`Miền ${monument.region}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'rgba(123, 24, 20, 0.9)',
                      color: '#FFF8E7',
                      fontWeight: 700,
                      border: '1px solid #D4AF37',
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Be Vietnam Pro"',
                    fontWeight: 800,
                    color: '#7B1814',
                    mb: 1,
                  }}
                >
                  {monument.name}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#4A2511',
                    lineHeight: 1.7,
                    mb: 2.5,
                    fontSize: '0.98rem',
                  }}
                >
                  {monument.shortDescription}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    pt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setSubTab('mindmap')}
                    startIcon={<AccountTreeIcon />}
                    sx={{
                      bgcolor: '#8E201B',
                      color: '#FFF8E7',
                      fontWeight: 700,
                      border: '1px solid #D4AF37',
                      '&:hover': { bgcolor: '#7A1F1D' },
                    }}
                  >
                    Xem Sơ Đồ Kiến Thức
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setSubTab('timeline')}
                    startIcon={<TimelineIcon />}
                    sx={{
                      borderColor: '#8E201B',
                      color: '#8E201B',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(142,32,27,0.08)',
                        borderColor: '#7A1F1D',
                      },
                    }}
                  >
                    Game Dòng Thời Gian
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setSubTab('vr')}
                    startIcon={<ViewInArIcon />}
                    sx={{
                      borderColor: '#C59B27',
                      color: '#7A4B10',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(212,175,55,0.1)',
                        borderColor: '#9B7415',
                      },
                    }}
                  >
                    Tham Quan VR 360°
                  </Button>
                </Box>
              </Box>
            </Box>
          </HeritageCornerFrame>

          {/* Thuyết Minh Lịch Sử & Câu Chuyện */}
          <HeritageCornerFrame
            sx={{
              p: { xs: 2, sm: 3 },
              background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
            }}
          >
            <MonumentHeritageStoriesAndQuiz
              monumentCode={monument.id}
              monumentName={monument.name}
            />
          </HeritageCornerFrame>
        </Box>
      )}

      {/* PHẦN 2: SƠ ĐỒ KIẾN THỨC */}
      {subTab === 'mindmap' && (
        <Box>
          <KnowledgeMindMapStep
            monumentCode={monument.id}
            monumentName={monument.name}
            location={monument.location}
            imageData={monument.thumbnailUrl}
            onNext={() => setSubTab('timeline')}
            onBack={() => setSubTab('story')}
          />
        </Box>
      )}

      {/* PHẦN 3: GAME KHÔI PHỤC DÒNG THỜI GIAN */}
      {subTab === 'timeline' && (
        <Box>
          <QuickFunQuizStep
            monumentCode={monument.id}
            monumentName={monument.name}
            onNext={() => setSubTab('vr')}
            onBack={() => setSubTab('mindmap')}
          />
        </Box>
      )}

      {/* PHẦN 4: VR 360 TOUR */}
      {subTab === 'vr' && (
        <Box>
          <VrTourStep
            monumentCode={monument.id}
            monumentName={monument.name}
            location={monument.location}
            imageData={monument.thumbnailUrl}
            onBack={() => setSubTab('timeline')}
            onFinishAndExit={onBackToSearch}
          />
        </Box>
      )}
    </Box>
  );
};
