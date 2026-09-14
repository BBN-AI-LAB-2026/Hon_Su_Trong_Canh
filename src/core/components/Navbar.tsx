import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockResetIcon from '@mui/icons-material/LockReset';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { useAuth } from '../hooks/useAuth';
import { HeritageSeal } from './HeritageSeal';
import { UserProfileDialog } from './UserProfileDialog';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<'avatar' | 'password' | 'profile'>('avatar');

  const handleOpenProfileModal = (tab: 'avatar' | 'password' | 'profile') => {
    handleMenuClose();
    setMobileOpen(false);
    setProfileDialogTab(tab);
    setProfileDialogOpen(true);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/nhandien/');
  };

  const navItems = [
    { label: 'Trang chủ', path: '/home/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Tra Cứu', path: '/find/', icon: <SearchIcon fontSize="small" /> },
    { label: 'Hỗ trợ', path: '/support/', icon: <ContactSupportIcon fontSize="small" /> },
    { label: 'Hướng dẫn', path: '/hdsd/', icon: <MenuBookIcon fontSize="small" /> },
  ];

  const isItemActive = (itemPath: string) => {
    const current = location.pathname.replace(/\/+$/, '') || '/';
    const target = itemPath.replace(/\/+$/, '') || '/';
    if (target === '/home') {
      return current === '/' || current === '/home';
    }
    return current === target || current.startsWith(target + '/');
  };

  if (isAuthenticated && user?.role === 'admin') {
    navItems.push({
      label: 'Quản Trị',
      path: '/admin',
      icon: <AdminPanelSettingsIcon fontSize="small" />,
    });
  }

  return (
    <AppBar
      position="relative"
      elevation={0}
      id="app-navbar"
      sx={{
        flexShrink: 0,
        bgcolor: '#FCFAF5',
        backgroundImage: 'linear-gradient(180deg, #FDFCF9 0%, #FAF5EB 100%)',
        borderBottom: '1px solid #D8C5AA',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 66 } }}>
          {/* Mobile hamburger */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { md: 'none' }, color: 'primary.dark' }}
            aria-label="menu"
            id="btn-mobile-menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo & Heritage Brand */}
          <Box
            component={NavLink}
            to="/home/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              mr: 4,
              gap: 1.5,
            }}
            id="brand-logo-link"
          >
            <Box
              component="img"
              src="/Logo_web.png"
              alt="Logo Hồn Sử Trong Cảnh"
              sx={{
                width: 44,
                height: 44,
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 4px rgba(50, 26, 15, 0.15))',
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Be Vietnam Pro"',
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', md: '1.25rem' },
                  letterSpacing: '-0.01em',
                  color: '#7B1814',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                }}
              >
                Lịch Sử
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Be Vietnam Pro"',
                  color: 'secondary.dark',
                  fontSize: '0.68rem',
                  display: 'block',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                trong từng không gian
              </Typography>
            </Box>
          </Box>

          {/* Desktop Nav links (Concise, Heritage Style) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  id={`nav-link-${item.path.replace(/^\/|\/$/g, '') || 'home'}`}
                  sx={{
                    px: 2.2,
                    py: 0.8,
                    color: isActive ? '#FAF6F0' : 'primary.dark',
                    background: isActive
                      ? 'linear-gradient(180deg, #8E201B 0%, #721612 100%)'
                      : 'transparent',
                    border: isActive ? '1px solid #C59B27' : '1px solid transparent',
                    boxShadow: isActive ? '0 2px 8px rgba(142, 32, 27, 0.28)' : 'none',
                    fontWeight: isActive ? 700 : 600,
                    borderRadius: '6px',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isActive
                        ? '#721612'
                        : 'rgba(197, 155, 39, 0.12)',
                      color: isActive ? '#FAF6F0' : 'primary.main',
                      borderColor: isActive ? '#C59B27' : 'rgba(197, 155, 39, 0.3)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* User Section - Only visible when Admin is logged in */}
          {isAuthenticated && user?.role === 'admin' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="Quản Trị Viên"
                size="small"
                color="secondary"
                variant="filled"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
                id="chip-user-role"
              />

              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ p: 0.5, border: '1.5px solid #EBE6DE' }}
                id="btn-user-avatar"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.fullName}
                  sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}
                >
                  {user.fullName.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: { width: 250, mt: 1, p: 0.5 },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label="Vai trò: Quản Trị Viên (Admin)"
                      size="small"
                      color="secondary"
                      sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                  onClick={() => handleOpenProfileModal('avatar')}
                  sx={{ gap: 1.5 }}
                  id="menu-item-change-avatar"
                >
                  <PhotoCameraIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Đổi Ảnh Đại Diện</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => handleOpenProfileModal('password')}
                  sx={{ gap: 1.5 }}
                  id="menu-item-change-password"
                >
                  <LockResetIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Đổi Mật Khẩu</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/admin');
                  }}
                  sx={{ gap: 1.5, color: 'primary.dark', fontWeight: 700 }}
                >
                  <AdminPanelSettingsIcon fontSize="small" color="secondary" />
                  <Typography variant="body2">Mục Quản Trị Hệ Thống</Typography>
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', gap: 1.5 }}>
                  <LogoutIcon fontSize="small" />
                  <Typography variant="body2">Đăng xuất</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 270 } } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/Logo_web.png"
            alt="Logo Hồn Sử Trong Cảnh"
            sx={{
              width: 42,
              height: 42,
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#7B1814', lineHeight: 1.1, fontFamily: '"Philosopher", "Playfair Display", serif' }}>
              Hồn Sử Trong Cảnh
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Kết nối quá khứ - Kiến tạo tương lai
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isItemActive(item.path)}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {isAuthenticated && user?.role === 'admin' && (
          <>
            <Divider sx={{ mt: 'auto' }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOpenProfileModal('avatar')}>
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <PhotoCameraIcon />
                  </ListItemIcon>
                  <ListItemText primary="Đổi Ảnh Đại Diện" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOpenProfileModal('password')}>
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <LockResetIcon />
                  </ListItemIcon>
                  <ListItemText primary="Đổi Mật Khẩu" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Đăng xuất" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Drawer>

      {/* User Profile / Change Password / Change Avatar Dialog */}
      <UserProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        initialTab={profileDialogTab}
        key={`${profileDialogTab}_${profileDialogOpen ? 'open' : 'closed'}`}
      />
    </AppBar>
  );
};
