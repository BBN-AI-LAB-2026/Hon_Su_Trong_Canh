import { MonumentBasic } from '../../core/types/common';

export interface UserMonumentItem extends MonumentBasic {
  isDiscovered: boolean;
  discoveredAt?: string;
}

export interface CollectionStatsData {
  totalMonuments: number;
  discoveredCount: number;
  discoveryPercentage: number;
  badge: {
    title: string;
    level: number;
    color: string;
  };
  regionBreakdown: {
    bac: { total: number; discovered: number };
    trung: { total: number; discovered: number };
    nam: { total: number; discovered: number };
  };
}

export type RegionFilter = 'ALL' | 'Bắc' | 'Trung' | 'Nam';
export type StatusFilter = 'ALL' | 'DISCOVERED' | 'LOCKED';
