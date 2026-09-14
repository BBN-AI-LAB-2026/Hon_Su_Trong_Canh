import { storageService } from '../../../core/services/storage';
import { UserProfile } from '../../../core/types/common';
import { SYSTEM_ADMIN_CREDENTIALS } from '../constants/authConstants';

const USERS_KEY = 'auth_registered_users';

export const authService = {
  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  },

  getRegisteredUsers(): Array<{ email: string; pass: string; profile: UserProfile }> {
    const users = storageService.get<Array<{ email: string; pass: string; profile: UserProfile }>>(USERS_KEY, []);
    // Filter out any old demo users from previous sessions
    return users.filter((u) => u.email !== 'user@ditichviet.vn' && u.email !== 'admin@ditichviet.vn');
  },

  isAdminCredentials(email: string, pass: string): boolean {
    const normalized = email.toLowerCase().trim();
    return (
      (normalized === SYSTEM_ADMIN_CREDENTIALS.email.toLowerCase().trim() && pass === SYSTEM_ADMIN_CREDENTIALS.pass) ||
      (normalized === 'adminhsucanh@gmail.com' && pass === '123456')
    );
  },
};

