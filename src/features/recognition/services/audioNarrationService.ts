import { storageService } from '../../../core/services/storage';

export interface MonumentAudioNarration {
  monumentCode: string;
  audioUrl: string; // Direct link to audio file (Cloudinary mp3, etc.)
  title?: string;
  narrator?: string;
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'ditich_monument_audio_narrations_v2';

/**
 * Danh sách liên kết Audio thuyết minh Cloudinary cho các di tích lịch sử
 * Được nạp từ AudioLink.txt theo thứ tự các class trong mã nguồn
 */
export const DEFAULT_CLOUDINARY_AUDIO_NARRATIONS: Record<string, MonumentAudioNarration> = {
  BNR: {
    monumentCode: 'BNR',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1789193877/BNR.mp3',
    title: 'Thuyết minh di tích Bến Nhà Rồng',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh lịch sử Bến Nhà Rồng - Bảo tàng Hồ Chí Minh (TP. Hồ Chí Minh)',
    updatedAt: new Date().toISOString(),
  },
  CBT: {
    monumentCode: 'CBT',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971867/Cho%CC%9B%CC%A3_Be%CC%82%CC%81n_Tha%CC%80nh.mp3',
    title: 'Thuyết minh Chợ Bến Thành',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh lịch sử văn hóa thương mại trung tâm Sài Gòn - Chợ Bến Thành',
    updatedAt: new Date().toISOString(),
  },
  CMC: {
    monumentCode: 'CMC',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971867/Chu%CC%80a_Mo%CC%A3%CC%82t_Co%CC%A3%CC%82t.mp3',
    title: 'Thuyết minh Chùa Một Cột',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh kiệt tác kiến trúc đóa sen ngàn năm Chùa Diên Hựu (Hà Nội)',
    updatedAt: new Date().toISOString(),
  },
  CauHienLuong: {
    monumentCode: 'CauHienLuong',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1789231162/CHL.mp3',
    title: 'Thuyết minh Cầu Hiền Lương - Sông Bến Hải',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh di tích lịch sử Đôi bờ Hiền Lương - Vĩ tuyến 17 (Quảng Trị)',
    updatedAt: new Date().toISOString(),
  },
  DDCC: {
    monumentCode: 'DDCC',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971867/%C4%90%E1%BB%8Ba_%C4%91%E1%BA%A1o_C%E1%BB%A7_Chi.mp3',
    title: 'Thuyết minh Địa đạo Củ Chi',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh huyền thoại trận đồ ngầm Đất Thép Thành Đồng Củ Chi',
    updatedAt: new Date().toISOString(),
  },
  DenHung: {
    monumentCode: 'DenHung',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971867/%C4%90e%CC%82%CC%80n_Hu%CC%80ng_Phu%CC%81_Tho%CC%A3.mp3',
    title: 'Thuyết minh Đền Hùng Phú Thọ',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh cội nguồn dân tộc linh thiêng - Khu di tích lịch sử Đền Hùng',
    updatedAt: new Date().toISOString(),
  },
  DinhDocLap: {
    monumentCode: 'DinhDocLap',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971866/Dinh_%C4%90o%CC%A3%CC%82c_La%CC%A3%CC%82p.mp3',
    title: 'Thuyết minh Dinh Độc Lập',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Di tích lịch sử quốc gia đặc biệt Dinh Độc Lập (Hội trường Thống Nhất)',
    updatedAt: new Date().toISOString(),
  },
  LangChuTichHCM: {
    monumentCode: 'LangChuTichHCM',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971868/La%CC%86ng_Chu%CC%89_Ti%CC%A3ch_Ho%CC%82%CC%80_Chi%CC%81_Minh.mp3',
    title: 'Thuyết minh Lăng Chủ tịch Hồ Chí Minh',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Quần thể Quảng trường Ba Đình và Lăng Bác kính yêu',
    updatedAt: new Date().toISOString(),
  },
  NgoMon: {
    monumentCode: 'NgoMon',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971868/Ngo%CC%A3_Mo%CC%82n.mp3',
    title: 'Thuyết minh Cố đô Huế (Ngọ Môn)',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Cổng Ngọ Môn và Đại Nội Hoàng Thành Huế di sản thế giới',
    updatedAt: new Date().toISOString(),
  },
  NhaThoDB: {
    monumentCode: 'NhaThoDB',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971868/Nha%CC%80_tho%CC%9B%CC%80_%C4%90u%CC%9B%CC%81c_Ba%CC%80.mp3',
    title: 'Thuyết minh Nhà Thờ Đức Bà',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Vương cung thánh đường Chính tòa Đức Bà Sài Gòn cổ kính',
    updatedAt: new Date().toISOString(),
  },
  NTCD: {
    monumentCode: 'NTCD',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1789189719/Nha-Tu-Con-Dao.mp3',
    title: 'Thuyết minh Nhà Tù Côn Đảo',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Di tích Lịch sử Quốc gia Đặc biệt Nhà Tù Côn Đảo - Khúc tráng ca tự do 1/5/1975',
    updatedAt: new Date().toISOString(),
  },
  TDiaMS: {
    monumentCode: 'TDiaMS',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788972425/Th%C3%A1nh_%C4%91%E1%BB%8Ba_M%E1%BB%B9_S%C6%A1n.mp3',
    title: 'Thuyết minh Thánh Địa Mỹ Sơn',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Thung lũng đền tháp Chăm Pa cổ - Di sản Văn hóa Thế giới UNESCO',
    updatedAt: new Date().toISOString(),
  },
  ThanhCoQT: {
    monumentCode: 'ThanhCoQT',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971868/Tha%CC%80nh_co%CC%82%CC%89_Qua%CC%89ng_Tri%CC%A3.mp3',
    title: 'Thuyết minh Thành Cổ Quảng Trị',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Khúc tráng ca Thành Cổ Quảng Trị mùa hè đỏ lửa 1972',
    updatedAt: new Date().toISOString(),
  },
  VanMieuQTG: {
    monumentCode: 'VanMieuQTG',
    audioUrl: 'https://res.cloudinary.com/inwwexot/video/upload/v1788971865/Va%CC%86n_mie%CC%82%CC%81u_Quo%CC%82%CC%81c_Tu%CC%9B%CC%A3_Gia%CC%81m_-_Khue%CC%82_Va%CC%86n_Ca%CC%81c.mp3',
    title: 'Thuyết minh Văn Miếu Quốc Tử Giám',
    narrator: 'Đọc thuyết minh di sản (Cloudinary Audio)',
    notes: 'Thuyết minh Trường đại học đầu tiên của Việt Nam và Khuê Văn Các nghìn năm',
    updatedAt: new Date().toISOString(),
  },
};

class AudioNarrationService {
  getAllAudioNarrations(): Record<string, MonumentAudioNarration> {
    const saved = storageService.get<Record<string, MonumentAudioNarration>>(STORAGE_KEY, {});
    // Auto-update legacy BNR link if present
    if (saved?.BNR?.audioUrl && saved.BNR.audioUrl.includes('v1788971865/B')) {
      delete saved.BNR;
      storageService.set(STORAGE_KEY, saved);
    }
    // Auto-update legacy CauHienLuong link if present
    if (saved?.CauHienLuong?.audioUrl && (saved.CauHienLuong.audioUrl.includes('v1788971865') || saved.CauHienLuong.audioUrl.includes('C%E1%BA%A7u_Hi%E1%BB%81n_L%C6%B0%C6%A1ng'))) {
      delete saved.CauHienLuong;
      storageService.set(STORAGE_KEY, saved);
    }
    // Merge defaults so all 13 Cloudinary audio narrations are available immediately unless custom-edited
    return {
      ...DEFAULT_CLOUDINARY_AUDIO_NARRATIONS,
      ...saved,
    };
  }

  getAudioNarration(monumentCode: string): MonumentAudioNarration | null {
    const list = this.getAllAudioNarrations();
    return list[monumentCode] || null;
  }

  saveAudioNarration(narration: MonumentAudioNarration): void {
    const list = this.getAllAudioNarrations();
    list[narration.monumentCode] = {
      ...narration,
      updatedAt: new Date().toISOString(),
    };
    storageService.set(STORAGE_KEY, list);
    window.dispatchEvent(new CustomEvent('ditich_audio_narrations_updated'));
  }

  deleteAudioNarration(monumentCode: string): void {
    const list = this.getAllAudioNarrations();
    if (list[monumentCode]) {
      delete list[monumentCode];
      storageService.set(STORAGE_KEY, list);
      window.dispatchEvent(new CustomEvent('ditich_audio_narrations_updated'));
    }
  }

  resetToCloudinaryDefaults(): void {
    storageService.set(STORAGE_KEY, DEFAULT_CLOUDINARY_AUDIO_NARRATIONS);
    window.dispatchEvent(new CustomEvent('ditich_audio_narrations_updated'));
  }
}

export const audioNarrationService = new AudioNarrationService();
