import { storageService } from '../../../core/services/storage';

export type MindMapContentType = 'video' | 'image' | 'iframe';

export interface MonumentMindMap {
  monumentCode: string;
  type: MindMapContentType;
  content: string; // The URL link (Cloudinary video, image, or iframe)
  title?: string;
  description?: string;
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'ditich_monument_mindmaps_v3_synced';
const VERSION_KEY = 'ditich_monument_mindmaps_version';
const CURRENT_MINDMAP_VERSION = 'v3_mindmaplink_synced_admin_order';

// Helper to auto-detect content type based on URL (especially Cloudinary)
export function detectMindMapType(url: string): MindMapContentType {
  if (!url) return 'iframe';
  const cleanUrl = url.toLowerCase();
  if (
    cleanUrl.includes('/video/upload/') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.ogg')
  ) {
    return 'video';
  }
  if (
    cleanUrl.includes('/image/upload/') ||
    cleanUrl.endsWith('.png') ||
    cleanUrl.endsWith('.jpg') ||
    cleanUrl.endsWith('.jpeg') ||
    cleanUrl.endsWith('.webp') ||
    cleanUrl.endsWith('.svg')
  ) {
    return 'image';
  }
  return 'iframe';
}

/**
 * Danh sách liên kết Video MindMap Cloudinary cho 14 di tích lịch sử
 * Được đồng bộ hóa chuẩn xác từ MindmapLink.txt theo đúng thứ tự danh sách của admin (0 - 13)
 */
export const DEFAULT_CLOUDINARY_MINDMAPS: Record<string, MonumentMindMap> = {
  // 0. Bến Nhà Rồng
  BNR: {
    monumentCode: 'BNR',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308004/BNRR.mp4',
    title: 'Sơ đồ tư duy kiến thức Bến Nhà Rồng',
    description: 'Video MindMap hệ thống hóa sự kiện người thanh niên yêu nước Nguyễn Tất Thành ra đi tìm đường cứu nước.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 1. Chợ Bến Thành
  CBT: {
    monumentCode: 'CBT',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308004/CBTT.mp4',
    title: 'Sơ đồ tư duy kiến thức Chợ Bến Thành',
    description: 'Video MindMap kiến trúc tháp đồng hồ 4 mặt và lịch sử thương mại trung tâm Sài Gòn - TP.HCM.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 2. Chùa Một Cột
  CMC: {
    monumentCode: 'CMC',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308004/CMCC.mp4',
    title: 'Sơ đồ tư duy kiến thức Chùa Một Cột',
    description: 'Video MindMap kiến trúc đóa hoa sen thanh khiết vươn lên từ mặt nước thời vua Lý Thái Tông.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 3. Cầu Hiền Lương - Sông Bến Hải
  CauHienLuong: {
    monumentCode: 'CauHienLuong',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307994/cau.mp4',
    title: 'Sơ đồ tư duy Cầu Hiền Lương - Sông Bến Hải',
    description: 'Video MindMap dấu ấn vĩ tuyến 17 chia cắt và biểu tượng khát vọng non sông liền một dải.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 4. Địa đạo Củ Chi
  DDCC: {
    monumentCode: 'DDCC',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789142696/Dia_Dao_Cu_Chi.mp4',
    title: 'Sơ đồ tư duy kiến thức Địa đạo Củ Chi',
    description: 'Video MindMap thành phố ngầm kỳ vĩ dưới lòng đất của quân dân Đất Thép Thành Đồng.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 5. Đền Hùng
  DenHung: {
    monumentCode: 'DenHung',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307999/DenHu.mp4',
    title: 'Sơ đồ tư duy kiến thức Đền Hùng Phú Thọ',
    description: 'Video MindMap cội nguồn dân tộc, thời đại các Vua Hùng dựng nước Văn Lang trên núi Nghĩa Lĩnh.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 6. Dinh Độc Lập
  DinhDocLap: {
    monumentCode: 'DinhDocLap',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308001/DDLL.mp4',
    title: 'Sơ đồ tư duy kiến thức Dinh Độc Lập',
    description: 'Video MindMap đỉnh cao kiến trúc hiện đại của KTS Ngô Viết Thụ và khúc khải hoàn 30/4/1975.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 7. Lăng Chủ tịch Hồ Chí Minh
  LangChuTichHCM: {
    monumentCode: 'LangChuTichHCM',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307998/LBac.mp4',
    title: 'Sơ đồ tư duy Lăng Chủ tịch Hồ Chí Minh',
    description: 'Video MindMap quảng trường Ba Đình lịch sử và nơi an nghỉ vĩnh hằng của vị Cha già dân tộc.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 8. Cố đô Huế (Ngọ Môn)
  NgoMon: {
    monumentCode: 'NgoMon',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307993/NgoMonn.mp4',
    title: 'Sơ đồ tư duy Cố đô Huế (Ngọ Môn)',
    description: 'Video MindMap cổng chính Hoàng thành Huế và quần thể di sản cố đô triều Nguyễn bên dòng Hương Giang.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 9. Nhà Thờ Đức Bà
  NhaThoDB: {
    monumentCode: 'NhaThoDB',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307995/NThoDB.mp4',
    title: 'Sơ đồ tư duy Nhà Thờ Đức Bà',
    description: 'Video MindMap công trình kiến trúc tôn giáo Gothic kết hợp Roman cổ kính bậc nhất Sài Gòn.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 10. Nhà Tù Côn Đảo
  NTCD: {
    monumentCode: 'NTCD',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307994/nhatu.mp4',
    title: 'Sơ đồ tư duy kiến thức Nhà Tù Côn Đảo',
    description: 'Video MindMap hệ thống hóa mốc son ngày 1/5/1975 phá tan xiềng xích và các chứng tích lịch sử Chuồng Cọp Côn Đảo.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 11. Thánh Địa Mỹ Sơn
  TDiaMS: {
    monumentCode: 'TDiaMS',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308003/T%C4%90MSS.mp4',
    title: 'Sơ đồ tư duy Thánh Địa Mỹ Sơn',
    description: 'Video MindMap thung lũng đền tháp Chăm Pa huyền bí giữa đại ngàn Quảng Nam.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 12. Thành Cổ Quảng Trị
  ThanhCoQT: {
    monumentCode: 'ThanhCoQT',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789307999/TCOQT.mp4',
    title: 'Sơ đồ tư duy Thành Cổ Quảng Trị',
    description: 'Video MindMap thiên sử thi 81 ngày đêm máu lửa và khúc tráng ca bên dòng Thạch Hãn.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
  // 13. Văn Miếu Quốc Tử Giám
  VanMieuQTG: {
    monumentCode: 'VanMieuQTG',
    type: 'video',
    content: 'https://res.cloudinary.com/inwwexot/video/upload/v1789308616/VMiQT.mp4',
    title: 'Sơ đồ tư duy Văn Miếu Quốc Tử Giám',
    description: 'Video MindMap trường đại học đầu tiên của Việt Nam, Khuê Văn Các và 82 bia Tiến sĩ Thăng Long.',
    notes: 'Cloudinary Video MP4',
    updatedAt: new Date().toISOString(),
  },
};

class MindmapService {
  constructor() {
    this.ensureVersionSynchronized();
  }

  private ensureVersionSynchronized(): void {
    try {
      const storedVersion = storageService.get<string | null>(VERSION_KEY, null);
      if (storedVersion !== CURRENT_MINDMAP_VERSION) {
        // Reset or migrate to the latest synchronized Cloudinary links
        storageService.set(STORAGE_KEY, DEFAULT_CLOUDINARY_MINDMAPS);
        storageService.set(VERSION_KEY, CURRENT_MINDMAP_VERSION);
      }
    } catch {
      // ignore in environments without localStorage
    }
  }

  getAllMindMaps(): Record<string, MonumentMindMap> {
    this.ensureVersionSynchronized();
    const saved = storageService.get<Record<string, MonumentMindMap>>(STORAGE_KEY, {});
    // Merge defaults so all 14 Cloudinary MindMaps are available immediately unless custom-edited
    return {
      ...DEFAULT_CLOUDINARY_MINDMAPS,
      ...saved,
    };
  }

  getMindMap(monumentCode: string): MonumentMindMap | null {
    const maps = this.getAllMindMaps();
    return maps[monumentCode] || null;
  }

  saveMindMap(mindMap: MonumentMindMap): void {
    const maps = this.getAllMindMaps();
    maps[mindMap.monumentCode] = {
      ...mindMap,
      updatedAt: new Date().toISOString(),
    };
    storageService.set(STORAGE_KEY, maps);
    window.dispatchEvent(new CustomEvent('ditich_mindmaps_updated'));
  }

  deleteMindMap(monumentCode: string): void {
    const maps = this.getAllMindMaps();
    if (maps[monumentCode]) {
      delete maps[monumentCode];
      storageService.set(STORAGE_KEY, maps);
      window.dispatchEvent(new CustomEvent('ditich_mindmaps_updated'));
    }
  }

  resetToCloudinaryDefaults(): void {
    storageService.set(STORAGE_KEY, DEFAULT_CLOUDINARY_MINDMAPS);
    window.dispatchEvent(new CustomEvent('ditich_mindmaps_updated'));
  }
}

export const mindmapService = new MindmapService();
