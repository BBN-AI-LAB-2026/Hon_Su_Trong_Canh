import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';

interface PasswordChangeTabProps {
  onChangePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
}

export const PasswordChangeTab: React.FC<PasswordChangeTabProps> = ({ onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showOldPass, setShowOldPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [passSubmitting, setPassSubmitting] = useState<boolean>(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!oldPassword) {
      setPassFeedback({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPassFeedback({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassFeedback({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }

    setPassSubmitting(true);
    const res = await onChangePassword(oldPassword, newPassword);
    setPassSubmitting(false);

    if (res.success) {
      setPassFeedback({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassFeedback({ type: 'error', text: res.message || 'Đổi mật khẩu thất bại.' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSavePassword}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      id="tabpanel-password-change"
    >
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Để bảo mật tài khoản, mật khẩu mới cần có tối thiểu <strong>6 ký tự</strong> và khác với mật khẩu cũ.
      </Typography>

      {passFeedback && (
        <Alert severity={passFeedback.type} onClose={() => setPassFeedback(null)}>
          {passFeedback.text}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Mật khẩu hiện tại"
        type={showOldPass ? 'text' : 'password'}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOldPass(!showOldPass)} edge="end" size="small">
                  {showOldPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        id="input-old-password"
      />

      <TextField
        fullWidth
        label="Mật khẩu mới (Tối thiểu 6 ký tự)"
        type={showNewPass ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPass(!showNewPass)} edge="end" size="small">
                  {showNewPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        id="input-new-password"
      />

      <TextField
        fullWidth
        label="Xác nhận mật khẩu mới"
        type={showNewPass ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        size="small"
        error={Boolean(confirmPassword && confirmPassword !== newPassword)}
        helperText={confirmPassword && confirmPassword !== newPassword ? 'Mật khẩu xác nhận chưa trùng khớp' : ''}
        id="input-confirm-password"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={passSubmitting}
        startIcon={passSubmitting ? <CircularProgress size={18} color="inherit" /> : <LockResetIcon />}
        sx={{ fontWeight: 700, py: 1, mt: 1 }}
        id="btn-confirm-change-password"
      >
        {passSubmitting ? 'Đang Đổi Mật Khẩu...' : 'Cập Nhật Mật Khẩu Mới'}
      </Button>
    </Box>
  );
};
