import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../../core/hooks/useAuth';
import { authService } from '../services/authService';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !pass) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    if (!authService.validateEmail(email)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, pass);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setErrorMsg(result.message || 'Đăng nhập không thành công.');
    }
  };

  return (
    <Card sx={{ maxWidth: 440, width: '100%', mx: 'auto', p: { xs: 2, sm: 3 } }} id="card-login-form">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: 'rgba(139, 69, 19, 0.1)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Đăng Nhập Quản Trị Viên
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Cổng điều hành & quản lý dữ liệu Di Tích Việt
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Địa chỉ Email Quản Trị"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="bbnailab2026@gmail.com"
            autoComplete="email"
            id="input-login-email"
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={isSubmitting}
            autoComplete="current-password"
            id="input-login-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{ mt: 2.5, mb: 1.5, py: 1.2 }}
            id="btn-submit-login"
          >
            {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
