import { UserProfile } from '../../core/types/common';

export type User = UserProfile;
export type { UserProfile };

export interface LoginCredentials {
  email: string;
  pass: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  pass: string;
  confirmPass: string;
}

