import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { MonumentMindMap, MindMapContentType, mindmapService } from '../services/mindmapService';

interface MindMapAdminDialogProps {
  open: boolean;
  onClose: () => void;
  monumentCode: string;
  monumentName: string;
  currentMindMap: MonumentMindMap | null;
}

export const MindMapAdminDialog: React.FC<MindMapAdminDialogProps> = ({
  open,
  onClose,
  monumentCode,
  monumentName,
  currentMindMap,
}) => {
  const [uploadType, setUploadType] = useState<MindMapContentType>('video');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentMindMap) {
      setUploadType(currentMindMap.type);
      if (currentMindMap.type === 'iframe' || currentMindMap.type === 'video') {
        setCustomUrl(currentMindMap.content);
      } else {
        setUploadPreview(currentMindMap.content);
      }
    } else {
      setUploadType('video');
      setCustomUrl('');
      setUploadPreview('');
    }
  }, [currentMindMap, open]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh sơ đồ không được vượt quá 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMindMap = () => {
    setIsSaving(true);
    const contentToSave = uploadType === 'image' ? uploadPreview : customUrl.trim();

    if (!contentToSave) {
      alert('Vui lòng tải lên tệp ảnh hoặc nhập đường dẫn sơ đồ MindMap.');
      setIsSaving(false);
      return;
    }

    mindmapService.saveMindMap({
      monumentCode,
      type: uploadType,
      content: contentToSave,
      title: `Sơ đồ kiến thức di tích ${monumentName}`,
      updatedAt: new Date().toISOString(),
    });

    setIsSaving(false);
    onClose();
  };

  const handleDeleteMindMap = () => {
    if (window.confirm('Bạn có chắc muốn xóa sơ đồ MindMap hiện tại của di tích này?')) {
      mindmapService.deleteMindMap(monumentCode);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      id="dialog-admin-manage-mindmap"
    >
      <DialogTitle sx={{ bgcolor: '#FAF7F0', borderBottom: '1px solid #EBE4D5', pb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountTreeIcon sx={{ color: 'secondary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              Quản Trị: Cập Nhật Sơ Đồ Kiến Thức (MindMap)
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Cập nhật sơ đồ tư duy chính thức cho di tích <strong>{monumentName}</strong>.
        </Typography>

        <RadioGroup
          row
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value as MindMapContentType)}
          sx={{ mb: 2.5 }}
        >
          <FormControlLabel
            value="video"
            control={<Radio size="small" />}
            label="Video MindMap (Cloudinary MP4)"
          />
          <FormControlLabel
            value="iframe"
            control={<Radio size="small" />}
            label="Nhúng Link iFrame"
          />
          <FormControlLabel
            value="image"
            control={<Radio size="small" />}
            label="Ảnh Sơ Đồ"
          />
        </RadioGroup>

        {uploadType === 'video' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Đường dẫn (URL) Video MindMap Cloudinary"
              placeholder="https://res.cloudinary.com/.../video.mp4"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              helperText="Nhập đường dẫn trực tiếp đến video Cloudinary MP4 của sơ đồ kiến thức."
            />
          </Box>
        ) : uploadType === 'image' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                border: '2px dashed #D5C7B2',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: '#FAF7F0',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: '#F5EFE6' },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 44, color: 'secondary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                Bấm để chọn tệp sơ đồ từ thiết bị
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Hỗ trợ PNG, JPG, SVG, WebP (Tối đa 5MB)
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFileChange}
              />
            </Box>

            {uploadPreview && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Xem trước ảnh sơ đồ:
                </Typography>
                <Box
                  component="img"
                  src={uploadPreview}
                  alt="Preview"
                  sx={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 1, border: '1px solid #DFD5C6' }}
                />
              </Box>
            )}

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>HOẶC DÁN URL ẢNH</Typography>
            </Divider>

            <TextField
              fullWidth
              size="small"
              label="Đường dẫn URL hình ảnh sơ đồ"
              placeholder="https://example.com/mindmap-monument.png"
              value={uploadPreview.startsWith('http') ? uploadPreview : ''}
              onChange={(e) => setUploadPreview(e.target.value.trim())}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Đường dẫn (URL) nhúng sơ đồ MindMap"
              placeholder="https://coggle.it/diagram/... hoặc https://miro.com/app/embed/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              helperText="Hỗ trợ các nền tảng tạo sơ đồ tư duy như Coggle, Miro, GitMind, Canva..."
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between' }}>
        {currentMindMap ? (
          <Button
            color="error"
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteMindMap}
          >
            Xóa Sơ Đồ
          </Button>
        ) : <Box />}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveMindMap}
            disabled={isSaving}
            sx={{ fontWeight: 700 }}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Lưu Sơ Đồ'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
