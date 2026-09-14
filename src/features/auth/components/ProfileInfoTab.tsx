import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import { User } from '../types';

interface ProfileInfoTabProps {
  user: User;
  onUpdateProfile: (updates: { fullName?: string }) => Promise<{ success: boolean; message?: string }>;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ user, onUpdateProfile }) => {
  const [fullName, setFullName] = useState<string>(user.fullName || '');
  const [nameSubmitting, setNameSubmitting] = useState<boolean>(false);
  const [nameFeedback, setNameFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveName = async () => {
    setNameFeedback(null);
    if (!fullName.trim()) {
      setNameFeedback({ type: 'error', text: 'Tên hiển thị không được để trống.' });
      return;
    }

    setNameSubmitting(true);
    const res = await onUpdateProfile({ fullName: fullName.trim() });
    setNameSubmitting(false);

    if (res.success) {
      setNameFeedback({ type: 'success', text: 'Cập nhật họ tên thành công!' });
    } else {
      setNameFeedback({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} id="tabpanel-profile-info">
      {nameFeedback && (
        <Alert severity={nameFeedback.type} onClose={() => setNameFeedback(null)}>
          {nameFeedback.text}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Đăng Ký"
        value={user.email}
        disabled
        size="small"
        helperText="Địa chỉ email đăng ký là mã định danh không thể thay đổi."
        id="input-profile-email"
      />

      <TextField
        fullWidth
        label="Họ và Tên Hiển Thị"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        size="small"
        id="input-profile-fullname"
      />

      <Box sx={{ p: 2, bgcolor: '#FAF7F0', borderRadius: 2, border: '1px solid #EBE4D5' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          THÔNG TIN TÀI KHOẢN
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={user.role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Người Dùng Khám Phá (User)'}
            color={user.role === 'admin' ? 'secondary' : 'default'}
            size="small"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={`Đã Khám Phá: ${user.discoveredMonumentsCount || 0} Di Tích`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        disabled={nameSubmitting}
        onClick={handleSaveName}
        sx={{ fontWeight: 700, py: 1 }}
        id="btn-save-profile-name"
      >
        {nameSubmitting ? 'Đang Lưu...' : 'Cập Nhật Tên Hiển Thị'}
      </Button>
    </Box>
  );
};
