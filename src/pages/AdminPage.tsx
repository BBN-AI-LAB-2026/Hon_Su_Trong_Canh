import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MuseumIcon from '@mui/icons-material/Museum';
import TranslateIcon from '@mui/icons-material/Translate';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/hooks/useAuth';
import { HeritageCornerFrame } from '../core/components/HeritageCornerFrame';
import {
  StoryManager,
  VrTourManager,
  MonumentAdminOverview,
  MindMapManager,
  AudioNarrationManager,
  SystemSettingsManager,
} from '../features/admin';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <HeritageCornerFrame>
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#FAF7F0' }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1 }}>
              Khu Vực Dành Riêng Cho Quản Trị Viên
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Mục Quản Trị chỉ cho phép tài khoản Quản Trị Viên (bbnailab2026@gmail.com) truy cập để quản trị hệ thống, VR Tour, thuyết minh và sơ đồ tri thức di tích.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => navigate('/nhandien/')}>
                Về Trang Nhận Diện
              </Button>
            </Box>
          </Card>
        </HeritageCornerFrame>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }} id="page-admin">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          pb: 1.5,
          borderBottom: '1px solid #E2D7C7',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              color: 'primary.dark',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Mục Quản Trị
          </Typography>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
            label="Admin"
            size="small"
            color="secondary"
            sx={{ fontWeight: 800 }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#E2D7C7', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          aria-label="admin tabs"
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<MuseumIcon fontSize="small" />}
            iconPosition="start"
            label="Tổng Quan Di Tích"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-overview"
          />
          <Tab
            icon={<AccountTreeIcon fontSize="small" />}
            iconPosition="start"
            label="Quản Trị MindMap"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-mindmap"
          />
          <Tab
            icon={<HeadphonesIcon fontSize="small" />}
            iconPosition="start"
            label="Quản Trị Audio"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-audio"
          />
          <Tab
            icon={<TranslateIcon fontSize="small" />}
            iconPosition="start"
            label="Quản Lý Câu Chuyện Đa Ngôn Ngữ"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-stories"
          />
          <Tab
            icon={<ViewInArIcon fontSize="small" />}
            iconPosition="start"
            label="Quản Lý VR 360"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-vrtours"
          />
          <Tab
            icon={<TuneIcon fontSize="small" />}
            iconPosition="start"
            label="Cài Đặt Hệ Thống"
            sx={{ fontWeight: 700, textTransform: 'none' }}
            id="tab-admin-settings"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <MonumentAdminOverview
              onGoToMindMap={() => setActiveTab(1)}
              onGoToAudio={() => setActiveTab(2)}
              onGoToStories={() => setActiveTab(3)}
              onGoToVr={() => setActiveTab(4)}
              onGoToSettings={() => setActiveTab(5)}
            />
          </Card>
        </HeritageCornerFrame>
      )}

      {activeTab === 1 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <MindMapManager />
          </Card>
        </HeritageCornerFrame>
      )}

      {activeTab === 2 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <AudioNarrationManager />
          </Card>
        </HeritageCornerFrame>
      )}

      {activeTab === 3 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <StoryManager />
          </Card>
        </HeritageCornerFrame>
      )}

      {activeTab === 4 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <VrTourManager />
          </Card>
        </HeritageCornerFrame>
      )}

      {activeTab === 5 && (
        <HeritageCornerFrame>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <SystemSettingsManager />
          </Card>
        </HeritageCornerFrame>
      )}
    </Container>
  );
};
