import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockResetIcon from '@mui/icons-material/LockReset';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../hooks/useAuth';
import { AvatarPickerTab } from '../../features/auth/components/AvatarPickerTab';
import { PasswordChangeTab } from '../../features/auth/components/PasswordChangeTab';
import { ProfileInfoTab } from '../../features/auth/components/ProfileInfoTab';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'avatar' | 'password' | 'profile';
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onClose,
  initialTab = 'avatar',
}) => {
  const { user, updateAvatar, changePassword, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(
    initialTab === 'password' ? 1 : initialTab === 'profile' ? 2 : 0
  );

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #E5DAC9',
          },
        },
      }}
      id="dialog-user-profile"
    >
      <DialogTitle
        sx={{
          bgcolor: '#FAF7F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1.5,
          borderBottom: '1px solid #EBE4D5',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user.avatar}
            alt={user.fullName}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #C89D35',
              boxShadow: '0 2px 8px rgba(74,37,17,0.15)',
            }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', lineHeight: 1.2 }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email} • {user.role === 'admin' ? 'Quản Trị Viên' : 'Người Dùng'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" id="btn-close-profile-dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#FCFAF7' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          id="tabs-profile-settings"
        >
          <Tab
            icon={<PhotoCameraIcon fontSize="small" />}
            iconPosition="start"
            label="Đổi Avatar"
            id="tab-avatar-change"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
          <Tab
            icon={<LockResetIcon fontSize="small" />}
            iconPosition="start"
            label="Đổi Mật Khẩu"
            id="tab-password-change"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
          <Tab
            icon={<AccountCircleIcon fontSize="small" />}
            iconPosition="start"
            label="Hồ Sơ"
            id="tab-profile-info"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {activeTab === 0 && (
          <AvatarPickerTab user={user} onUpdateAvatar={updateAvatar} />
        )}
        {activeTab === 1 && (
          <PasswordChangeTab onChangePassword={changePassword} />
        )}
        {activeTab === 2 && (
          <ProfileInfoTab user={user} onUpdateProfile={updateProfile} />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600 }} id="btn-close-profile-footer">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
