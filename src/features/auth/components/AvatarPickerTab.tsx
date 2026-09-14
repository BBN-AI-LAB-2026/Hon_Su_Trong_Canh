import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PRESET_AVATARS } from '../constants/avatarConstants';
import { User } from '../types';

interface AvatarPickerTabProps {
  user: User;
  onUpdateAvatar: (avatarUrl: string) => Promise<{ success: boolean; message?: string }>;
}

export const AvatarPickerTab: React.FC<AvatarPickerTabProps> = ({ user, onUpdateAvatar }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const [avatarSubmitting, setAvatarSubmitting] = useState<boolean>(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarFeedback({ type: 'error', text: 'Vui lòng chọn một tệp hình ảnh hợp lệ.' });
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setAvatarFeedback({ type: 'error', text: 'Kích thước ảnh không được vượt quá 2.5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatar(reader.result);
        setAvatarFeedback({ type: 'success', text: 'Đã tải ảnh lên thành công. Hãy bấm "Lưu Thay Đổi Avatar" để xác nhận.' });
      }
    };
    reader.onerror = () => {
      setAvatarFeedback({ type: 'error', text: 'Không thể đọc tệp hình ảnh. Vui lòng thử lại.' });
    };
    reader.readAsDataURL(file);
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const generatedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    setSelectedAvatar(generatedUrl);
    setAvatarFeedback({ type: 'success', text: 'Đã tạo ngẫu nhiên một Avatar mới!' });
  };

  const handleSaveAvatar = async () => {
    setAvatarFeedback(null);
    setAvatarSubmitting(true);
    const targetUrl = customAvatarUrl.trim() || selectedAvatar;

    if (!targetUrl) {
      setAvatarFeedback({ type: 'error', text: 'Vui lòng chọn hoặc nhập đường dẫn ảnh đại diện.' });
      setAvatarSubmitting(false);
      return;
    }

    const res = await onUpdateAvatar(targetUrl);
    setAvatarSubmitting(false);
    if (res.success) {
      setAvatarFeedback({ type: 'success', text: 'Đổi ảnh đại diện thành công!' });
      setCustomAvatarUrl('');
    } else {
      setAvatarFeedback({ type: 'error', text: res.message || 'Không thể đổi ảnh đại diện.' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} id="tabpanel-avatar-picker">
      {avatarFeedback && (
        <Alert severity={avatarFeedback.type} onClose={() => setAvatarFeedback(null)}>
          {avatarFeedback.text}
        </Alert>
      )}

      {/* Current Preview */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          p: 2,
          borderRadius: 2,
          bgcolor: '#FAF7F0',
          border: '1px solid #E8DFD1',
        }}
      >
        <Avatar
          src={selectedAvatar || user.avatar}
          alt="Preview"
          sx={{
            width: 76,
            height: 76,
            border: '3px solid #C89D35',
            boxShadow: '0 4px 12px rgba(74,37,17,0.2)',
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
            Ảnh Đại Diện Hiện Tại / Xem Trước
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Bạn có thể chọn ảnh mẫu, tải ảnh từ máy tính hoặc nhập đường dẫn ảnh tùy ý.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PhotoCameraIcon />}
              onClick={() => fileInputRef.current?.click()}
              id="btn-upload-avatar-file"
            >
              Tải Ảnh Lên
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            <Button
              variant="text"
              size="small"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleRandomizeAvatar}
              id="btn-random-avatar"
            >
              Ngẫu Nhiên (Bot)
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Preset Avatars */}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Chọn từ bộ sưu tập ảnh đại diện di sản:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {PRESET_AVATARS.map((item, idx) => {
            const isSelected = selectedAvatar === item.url;
            return (
              <Box
                key={idx}
                onClick={() => {
                  setSelectedAvatar(item.url);
                  setCustomAvatarUrl('');
                }}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 2,
                  border: isSelected ? '2px solid #99281C' : '1px solid #EBE4D5',
                  bgcolor: isSelected ? 'rgba(153,40,28,0.06)' : '#FFFFFF',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  },
                }}
                id={`avatar-preset-${idx}`}
              >
                <Avatar
                  src={item.url}
                  alt={item.name}
                  sx={{ width: 48, height: 48, mx: 'auto', mb: 0.5 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontWeight: isSelected ? 800 : 500,
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Custom URL Input */}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
          Hoặc dán đường dẫn ảnh (URL) trực tiếp:
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="https://example.com/my-photo.jpg"
          value={customAvatarUrl}
          onChange={(e) => {
            setCustomAvatarUrl(e.target.value);
            if (e.target.value.trim()) {
              setSelectedAvatar(e.target.value.trim());
            }
          }}
          id="input-custom-avatar-url"
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={avatarSubmitting}
        onClick={handleSaveAvatar}
        startIcon={avatarSubmitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
        sx={{ fontWeight: 700, py: 1 }}
        id="btn-confirm-save-avatar"
      >
        {avatarSubmitting ? 'Đang Lưu...' : 'Lưu Thay Đổi Avatar'}
      </Button>
    </Box>
  );
};
