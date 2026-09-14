import { storageService } from '../../../core/services/storage';
import { ALL_MAP_MONUMENTS } from '../constants/mapConstants';
import { UserMonumentItem, CollectionStatsData } from '../types';

const DISCOVERED_KEY = 'collection_discovered_ids';

export const collectionService = {
  getDiscoveredIds(): string[] {
    // No mock sample data; starts clean
    return storageService.get<string[]>(DISCOVERED_KEY, []);
  },

  addDiscovered(monumentId: string): string[] {
    const current = this.getDiscoveredIds();
    if (!current.includes(monumentId)) {
      const updated = [...current, monumentId];
      storageService.set(DISCOVERED_KEY, updated);
      return updated;
    }
    return current;
  },

  getUserMonuments(): UserMonumentItem[] {
    const discoveredIds = this.getDiscoveredIds();

    return ALL_MAP_MONUMENTS.map((m) => ({
      ...m,
      isDiscovered: discoveredIds.includes(m.id),
      discoveredAt: discoveredIds.includes(m.id) ? 'Đã lưu trong bộ sưu tập' : undefined,
    }));
  },

  getStats(): CollectionStatsData {
    const monuments = this.getUserMonuments();
    const total = monuments.length;
    const discovered = monuments.filter((m) => m.isDiscovered).length;
    const percentage = total > 0 ? Math.round((discovered / total) * 100) : 0;

    let badge = { title: 'Người Khởi Đầu', level: 1, color: '#9E9E9E' };
    if (percentage >= 70) {
      badge = { title: 'Bậc Thầy Di Sản', level: 3, color: '#D4AF37' };
    } else if (percentage >= 30) {
      badge = { title: 'Nhà Lữ Hành Văn Hóa', level: 2, color: '#8B4513' };
    }

    const bac = {
      total: monuments.filter((m) => m.region === 'Bắc').length,
      discovered: monuments.filter((m) => m.region === 'Bắc' && m.isDiscovered).length,
    };
    const trung = {
      total: monuments.filter((m) => m.region === 'Trung').length,
      discovered: monuments.filter((m) => m.region === 'Trung' && m.isDiscovered).length,
    };
    const nam = {
      total: monuments.filter((m) => m.region === 'Nam').length,
      discovered: monuments.filter((m) => m.region === 'Nam' && m.isDiscovered).length,
    };

    return {
      totalMonuments: total,
      discoveredCount: discovered,
      discoveryPercentage: percentage,
      badge,
      regionBreakdown: { bac, trung, nam },
    };
  },
};
