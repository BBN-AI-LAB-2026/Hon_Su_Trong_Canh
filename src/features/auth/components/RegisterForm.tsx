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
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '../../../core/hooks/useAuth';
import { authService } from '../services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !pass || !confirmPass) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bên dưới.');
      return;
    }

    if (!authService.validateEmail(email)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    if (pass.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu phải từ 6 ký tự.');
      return;
    }

    if (pass !== confirmPass) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, pass);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setErrorMsg(result.message || 'Đăng ký không thành công.');
    }
  };

  return (
    <Card sx={{ maxWidth: 440, width: '100%', mx: 'auto', p: { xs: 2, sm: 3 } }} id="card-register-form">
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
            <PersonAddOutlinedIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Tạo Tài Khoản
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Khởi đầu hành trình lưu giữ & khám phá di sản Việt Nam
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
            label="Họ và tên"
            variant="outlined"
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ví dụ: Trần Minh Hoàng"
            id="input-register-name"
          />

          <TextField
            fullWidth
            label="Địa chỉ Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="ban@example.com"
            autoComplete="email"
            id="input-register-email"
          />

          <TextField
            fullWidth
            label="Mật khẩu (tối thiểu 6 ký tự)"
            type="password"
            variant="outlined"
            margin="normal"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={isSubmitting}
            id="input-register-password"
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type="password"
            variant="outlined"
            margin="normal"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            disabled={isSubmitting}
            id="input-register-confirmpass"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddOutlinedIcon />}
            sx={{ mt: 2.5, mb: 1.5, py: 1.2 }}
            id="btn-submit-register"
          >
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{' '}
              <Button
                variant="text"
                color="primary"
                onClick={onSwitchToLogin}
                sx={{ p: 0, minWidth: 'auto', fontWeight: 600, textDecoration: 'underline' }}
                id="btn-switch-login"
              >
                Đăng nhập ngay
              </Button>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
