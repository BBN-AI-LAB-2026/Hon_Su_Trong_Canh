import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { mindmapService, MonumentMindMap } from '../services/mindmapService';
import { useAuth } from '../../../core/hooks/useAuth';
import { MindMapCanvasViewer } from './MindMapCanvasViewer';
import { MindMapAdminDialog } from './MindMapAdminDialog';

interface KnowledgeMindMapStepProps {
  monumentCode: string;
  monumentName: string;
  location?: string;
  imageData?: string;
  onNext: () => void;
  onBack: () => void;
}

export const KnowledgeMindMapStep: React.FC<KnowledgeMindMapStepProps> = ({
  monumentCode,
  monumentName,
  location = 'Việt Nam',
  onNext,
  onBack,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [mindMap, setMindMap] = useState<MonumentMindMap | null>(() =>
    mindmapService.getMindMap(monumentCode)
  );
  const [adminDialogOpen, setAdminDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setMindMap(mindmapService.getMindMap(monumentCode));
    };
    window.addEventListener('ditich_mindmaps_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_mindmaps_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [monumentCode]);

  return (
    <Card
      sx={{ overflow: 'hidden', boxShadow: '0 4px 24px rgba(42, 31, 23, 0.08)' }}
      id="step-knowledge-mindmap-view"
    >
      <HeritageCornerFrame>
        {/* Top Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            pb: 2,
            borderBottom: '1px solid #E2D7C7',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                }}
              >
                <Box component="span" sx={{ whiteSpace: 'nowrap' }}>Sơ Đồ Kiến Thức</Box> (MindMap): {monumentName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
                {location}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAdmin && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<CloudUploadIcon />}
                onClick={() => setAdminDialogOpen(true)}
                id="btn-admin-manage-mindmap"
                sx={{ fontWeight: 700, fontSize: '0.78rem' }}
              >
                Quản Trị: Cập Nhật MindMap
              </Button>
            )}
          </Box>
        </Box>

        {/* User Explicit Notice Banner */}
        <Alert
          severity="info"
          icon={<AccountTreeIcon sx={{ fontSize: 24, color: '#C89D35' }} />}
          sx={{
            mb: 2.5,
            borderRadius: '6px',
            bgcolor: 'rgba(200, 157, 53, 0.08)',
            border: '1px solid rgba(200, 157, 53, 0.35)',
            color: 'primary.dark',
          }}
          id="notice-mindmap-add-later"
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark' }}>
            🧠 Sơ đồ kiến thức (MindMap)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.2 }}>
            {mindMap
              ? `Sơ đồ tư duy kiến thức tổng quan của di tích ${monumentName} đã được nạp qua liên kết cấu hình.`
              : `Phần MindMap sẽ được thêm riêng ở Quản Trị MindMap và sẽ nhập bằng link (không thêm dữ liệu mẫu).`}
          </Typography>
        </Alert>

        {/* MindMap Interactive Container */}
        <MindMapCanvasViewer monumentName={monumentName} mindMap={mindMap} />

        {/* Bottom Navigation Buttons */}
        <Divider sx={{ my: 2.5, borderColor: '#E2D7C7' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            id="btn-mindmap-back-to-recognition"
            sx={{
              borderColor: '#D8CABE',
              color: 'primary.dark',
              fontWeight: 700,
            }}
          >
            Quay Lại Kết Quả Nhận Diện
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onNext}
            endIcon={<ArrowForwardIcon />}
            id="btn-mindmap-next-to-quiz"
            sx={{
              py: 1.2,
              px: 3.5,
              fontWeight: 800,
              fontSize: '0.98rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
            }}
          >
            Khôi Phục Dòng Thời Gian
          </Button>
        </Box>
      </HeritageCornerFrame>

      {/* Admin Dialog */}
      <MindMapAdminDialog
        open={adminDialogOpen}
        onClose={() => setAdminDialogOpen(false)}
        monumentCode={monumentCode}
        monumentName={monumentName}
        currentMindMap={mindMap}
      />
    </Card>
  );
};
