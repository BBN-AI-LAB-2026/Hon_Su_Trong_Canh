import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, AuthState, UserRole } from '../types/common';
import { storageService } from '../services/storage';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  incrementDiscoveredCount: () => void;
  switchRole: (role: UserRole) => void;
  updateAvatar: (newAvatarUrl: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: { fullName?: string; avatar?: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'auth_current_user';
const USERS_LIST_KEY = 'auth_registered_users';
const ADMIN_PASSWORD_KEY = 'auth_admin_password';
const ADMIN_AVATAR_KEY = 'auth_admin_avatar';

// The Primary Admin Account of the system
const ADMIN_EMAIL = 'bbnailab2026@gmail.com';
const ADMIN_PASSWORD = '123456';
const LEGACY_ADMIN_EMAIL = 'adminhsucanh@gmail.com';
const LEGACY_ADMIN_PASSWORD = '123456';

const getInitialAdminProfile = (email: string = ADMIN_EMAIL): UserProfile => {
  const savedAvatar = storageService.get<string>(
    ADMIN_AVATAR_KEY,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  );
  return {
    id: 'admin_root',
    email: email,
    fullName: 'Quản Trị Viên (Admin)',
    role: 'admin',
    avatar: savedAvatar,
    createdAt: '2025-01-01T08:00:00.000Z',
    discoveredMonumentsCount: 14,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from storage on mount (cleans any old demo seeds)
  useEffect(() => {
    // Clean out old mock demo accounts from previous sessions
    const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
      USERS_LIST_KEY,
      []
    );
    const cleanedUsers = existingUsers.filter(
      (u) => u.email !== 'user@ditichviet.vn' && u.email !== 'admin@ditichviet.vn' && u.email !== 'nguoikhampha@ditichviet.vn'
    );
    if (cleanedUsers.length !== existingUsers.length) {
      storageService.set(USERS_LIST_KEY, cleanedUsers);
    }

    const savedUser = storageService.get<UserProfile | null>(CURRENT_USER_KEY, null);
    if (savedUser) {
      const savedEmail = savedUser.email?.toLowerCase().trim();
      if (savedEmail === ADMIN_EMAIL || savedEmail === LEGACY_ADMIN_EMAIL) {
        setUser({ ...savedUser, role: 'admin' });
      } else if (savedUser.email === 'user@ditichviet.vn' || savedUser.email === 'admin@ditichviet.vn') {
        // Clear out old demo session
        storageService.remove(CURRENT_USER_KEY);
        setUser(null);
      } else {
        // Any regular user always has 'user' role
        setUser({ ...savedUser, role: 'user' });
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Strict check for Admin accounts
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      const currentAdminPassword = storageService.get<string>(ADMIN_PASSWORD_KEY, ADMIN_PASSWORD);
      if (pass === currentAdminPassword || pass === ADMIN_PASSWORD) {
        const adminProfile = getInitialAdminProfile(ADMIN_EMAIL);
        setUser(adminProfile);
        storageService.set(CURRENT_USER_KEY, adminProfile);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          message: 'Mật khẩu quản trị viên không chính xác.',
        };
      }
    }

    if (normalizedEmail === LEGACY_ADMIN_EMAIL.toLowerCase()) {
      if (pass === LEGACY_ADMIN_PASSWORD) {
        const adminProfile = getInitialAdminProfile(LEGACY_ADMIN_EMAIL);
        setUser(adminProfile);
        storageService.set(CURRENT_USER_KEY, adminProfile);
        setIsLoading(false);
        return { success: true };
      }
    }

    // 2. Check registered normal users
    const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
      USERS_LIST_KEY,
      []
    );

    const found = existingUsers.find(
      (u) => u.email.toLowerCase().trim() === normalizedEmail && u.pass === pass
    );

    if (found) {
      // Normal users are strictly 'user'
      const userProfile: UserProfile = {
        ...found.profile,
        role: 'user',
      };
      setUser(userProfile);
      storageService.set(CURRENT_USER_KEY, userProfile);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      message: 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.',
    };
  }, []);

  const register = useCallback(
    async (fullName: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const normalizedEmail = email.toLowerCase().trim();

      // Guard: Cannot register the sole admin email
      if (normalizedEmail === ADMIN_EMAIL) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Email này là tài khoản Quản Trị Viên hệ thống. Vui lòng sử dụng tính năng Đăng Nhập.',
        };
      }

      const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
        USERS_LIST_KEY,
        []
      );

      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase().trim() === normalizedEmail
      );

      if (emailExists) {
        setIsLoading(false);
        return { success: false, message: 'Email này đã được đăng ký tài khoản.' };
      }

      // All newly registered users are strictly regular users
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        fullName: fullName.trim(),
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
        createdAt: new Date().toISOString(),
        discoveredMonumentsCount: 0,
      };

      const updatedList = [...existingUsers, { email: email.trim(), pass, profile: newProfile }];
      storageService.set(USERS_LIST_KEY, updatedList);
      storageService.set(CURRENT_USER_KEY, newProfile);
      setUser(newProfile);

      setIsLoading(false);
      return { success: true };
    },
    []
  );

  const switchRole = useCallback((newRole: UserRole) => {
    // Only the admin account can be admin; regular users cannot toggle
    setUser((prev) => {
      if (!prev) return null;
      if (prev.email.toLowerCase().trim() !== ADMIN_EMAIL) {
        return prev;
      }
      const updated: UserProfile = {
        ...prev,
        role: newRole,
      };
      storageService.set(CURRENT_USER_KEY, updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    storageService.remove(CURRENT_USER_KEY);
    setUser(null);
  }, []);

  const incrementDiscoveredCount = useCallback(() => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: UserProfile = {
        ...prev,
        discoveredMonumentsCount: prev.discoveredMonumentsCount + 1,
      };
      storageService.set(CURRENT_USER_KEY, updated);
      return updated;
    });
  }, []);

  const updateAvatar = useCallback(async (newAvatarUrl: string): Promise<{ success: boolean; message?: string }> => {
    if (!newAvatarUrl || !newAvatarUrl.trim()) {
      return { success: false, message: 'Đường dẫn ảnh đại diện không hợp lệ.' };
    }
    const cleanUrl = newAvatarUrl.trim();
    setUser((prev) => {
      if (!prev) return null;
      const updated: UserProfile = { ...prev, avatar: cleanUrl };
      storageService.set(CURRENT_USER_KEY, updated);

      if (prev.email.toLowerCase().trim() === ADMIN_EMAIL) {
        storageService.set(ADMIN_AVATAR_KEY, cleanUrl);
      } else {
        const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
          USERS_LIST_KEY,
          []
        );
        const updatedList = existingUsers.map((u) => {
          if (u.email.toLowerCase().trim() === prev.email.toLowerCase().trim()) {
            return { ...u, profile: { ...u.profile, avatar: cleanUrl } };
          }
          return u;
        });
        storageService.set(USERS_LIST_KEY, updatedList);
      }
      return updated;
    });
    return { success: true, message: 'Cập nhật ảnh đại diện thành công!' };
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
      if (!user) {
        return { success: false, message: 'Bạn chưa đăng nhập.' };
      }
      if (!oldPassword) {
        return { success: false, message: 'Vui lòng nhập mật khẩu hiện tại.' };
      }
      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
      }
      if (oldPassword === newPassword) {
        return { success: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ.' };
      }

      const normalizedEmail = user.email.toLowerCase().trim();

      // Case 1: Admin Account
      if (user.role === 'admin' || normalizedEmail === ADMIN_EMAIL.toLowerCase() || normalizedEmail === LEGACY_ADMIN_EMAIL.toLowerCase()) {
        const currentAdminPass = storageService.get<string>(ADMIN_PASSWORD_KEY, ADMIN_PASSWORD);
        if (oldPassword !== currentAdminPass && oldPassword !== ADMIN_PASSWORD && oldPassword !== LEGACY_ADMIN_PASSWORD) {
          return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
        }
        storageService.set(ADMIN_PASSWORD_KEY, newPassword);
        return { success: true, message: 'Đổi mật khẩu tài khoản Quản trị viên thành công!' };
      }

      // Case 2: Regular Registered Users
      const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
        USERS_LIST_KEY,
        []
      );
      const userIdx = existingUsers.findIndex(
        (u) => u.email.toLowerCase().trim() === normalizedEmail
      );

      if (userIdx === -1) {
        return { success: false, message: 'Không tìm thấy hồ sơ tài khoản người dùng.' };
      }

      if (existingUsers[userIdx].pass !== oldPassword) {
        return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
      }

      existingUsers[userIdx].pass = newPassword;
      storageService.set(USERS_LIST_KEY, existingUsers);
      return { success: true, message: 'Đổi mật khẩu thành công!' };
    },
    [user]
  );

  const updateProfile = useCallback(
    async (data: { fullName?: string; avatar?: string }): Promise<{ success: boolean; message?: string }> => {
      if (!user) return { success: false, message: 'Bạn chưa đăng nhập.' };

      const updatedName = data.fullName !== undefined && data.fullName.trim() ? data.fullName.trim() : user.fullName;
      const updatedAvatar = data.avatar !== undefined && data.avatar.trim() ? data.avatar.trim() : user.avatar;

      setUser((prev) => {
        if (!prev) return null;
        const updated: UserProfile = {
          ...prev,
          fullName: updatedName,
          avatar: updatedAvatar,
        };
        storageService.set(CURRENT_USER_KEY, updated);

        if (prev.email.toLowerCase().trim() === ADMIN_EMAIL) {
          storageService.set(ADMIN_AVATAR_KEY, updatedAvatar);
        } else {
          const existingUsers = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(
            USERS_LIST_KEY,
            []
          );
          const updatedList = existingUsers.map((u) => {
            if (u.email.toLowerCase().trim() === prev.email.toLowerCase().trim()) {
              return {
                ...u,
                profile: {
                  ...u.profile,
                  fullName: updatedName,
                  avatar: updatedAvatar,
                },
              };
            }
            return u;
          });
          storageService.set(USERS_LIST_KEY, updatedList);
        }
        return updated;
      });

      return { success: true, message: 'Cập nhật thông tin tài khoản thành công!' };
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    incrementDiscoveredCount,
    switchRole,
    updateAvatar,
    changePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
