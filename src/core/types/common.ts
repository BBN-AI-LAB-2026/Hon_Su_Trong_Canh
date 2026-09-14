export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  discoveredMonumentsCount: number;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MonumentBasic {
  id: string;
  name: string;
  location: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // For Vietnam interactive SVG map visualization
    yPercent: number;
  };
  thumbnailUrl: string;
  shortDescription: string;
}
