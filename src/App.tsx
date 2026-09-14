import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './core/theme/muiTheme';
import { AuthProvider } from './core/contexts/AuthContext';
import { AdminGuard } from './core/components/AuthGuard';
import { Layout } from './core/components/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RecognitionPage } from './pages/RecognitionPage';
import { VrTourPage } from './pages/VrTourPage';
import { AdminPage } from './pages/AdminPage';
import { UserGuidePage } from './pages/UserGuidePage';
import { FindMonumentPage } from './pages/FindMonumentPage';
import { SupportPage } from './pages/SupportPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Cổng đăng nhập bí mật dành riêng cho Quản Trị Viên (không có nút liên kết trên giao diện) */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/login/" element={<LoginPage />} />

              {/* Không cho đăng ký/đăng nhập người dùng thông thường - điều hướng tự động sang trang chủ */}
              <Route path="/login" element={<Navigate to="/home/" replace />} />
              <Route path="/register" element={<Navigate to="/home/" replace />} />

              {/* Trang chủ Hồn Sử Trong Cảnh (hỗ trợ cả / và /home/ theo yêu cầu) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/home/" element={<HomePage />} />
              <Route path="/home/*" element={<HomePage />} />

              {/* Tính năng công khai cho tất cả người dùng thông thường (không yêu cầu đăng nhập) */}
              <Route path="/nhandien" element={<RecognitionPage />} />
              <Route path="/nhandien/*" element={<RecognitionPage />} />
              <Route path="/find" element={<FindMonumentPage />} />
              <Route path="/find/" element={<FindMonumentPage />} />
              <Route path="/find/*" element={<FindMonumentPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/support/" element={<SupportPage />} />
              <Route path="/support/*" element={<SupportPage />} />
              <Route path="/vr-tour" element={<VrTourPage />} />
              <Route path="/vr-tour/*" element={<VrTourPage />} />
              <Route path="/hdsd" element={<UserGuidePage />} />
              <Route path="/hdsd/*" element={<UserGuidePage />} />
              <Route path="/map" element={<Navigate to="/nhandien/" replace />} />

              {/* Khu vực quản trị hệ thống - Chỉ dành cho Quản Trị Viên (AdminGuard) */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminGuard>
                    <AdminPage />
                  </AdminGuard>
                }
              />

              {/* 404 Fallback */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
