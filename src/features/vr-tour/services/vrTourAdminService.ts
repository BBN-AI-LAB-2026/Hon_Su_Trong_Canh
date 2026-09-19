import { storageService } from '../../../core/services/storage';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';

export type VrOptionType = 'panorama_image' | 'iframe' | 'external_url';
export type VrOptionKey = 'A' | 'B' | 'C';

export interface EmbeddedVrSpace {
  id: string;
  title: string;
  location: string;
  embedType: VrOptionType; // 'panorama_image' (A) | 'iframe' (B) | 'external_url' (C)
  vrOption?: VrOptionKey;  // 'A' | 'B' | 'C'
  embedUrl: string; // URL Cloudinary (A), mã nhúng/URL Iframe (B), hoặc URL mở tab mới (C)
  rawEmbedCode?: string; // Toàn bộ mã nhúng HTML iframe và script Panoee nếu có
  description?: string;
  monumentCode?: string; // Linkage to specific monument code (e.g. BNR, CBT, CauHienLuong...)
  addedAt: string;
  addedBy?: string;
  isCustom?: boolean;
}

export const CHUA_MOT_COT_EMBED_CODE = `<iframe id="tour-embedded" title="Chùa Một Cột" src="https://tour.panoee.net/iframe/chua-mot-cot?embedFullscreen=1&amp;embedVr=1&amp;embedGyro=1" frameborder="0" width="100%" height="600px" scrolling="no" allow="autoplay; accelerometer; gyroscope; fullscreen; xr-spatial-tracking" loading="eager" allowfullscreen></iframe>
<script>(function(){var i="tour-embedded",o="https://tour.panoee.net",r=false;function s(v,a){if(!v)return null;var x={};a.forEach(function(k){x[k]=typeof v[k]==="number"?v[k]:null});return x}function ready(f){try{var h=f.contentWindow.location.href;if(h&&h!=="about:blank")r=true}catch(e){r=true}}function send(payload){var el=document.getElementById(i);if(!el||!el.contentWindow)return;try{el.contentWindow.postMessage(payload,o)}catch(t){}}var f=document.getElementById(i);if(f){f.addEventListener("load",function(){r=true});ready(f)}window.addEventListener("message",function(ev){if(!r||!ev.data||ev.data.type!=="devicemotion")return;if(ev.source!==window.parent)return;send(ev.data)},false);window.addEventListener("devicemotion",function(e){if(!r)return;send({type:"devicemotion",deviceMotionEvent:{acceleration:s(e.acceleration,["x","y","z"]),accelerationIncludingGravity:s(e.accelerationIncludingGravity,["x","y","z"]),rotationRate:s(e.rotationRate,["alpha","beta","gamma"]),interval:typeof e.interval==="number"?e.interval:0,timeStamp:e.timeStamp}})},{passive:true})})();</script>`;

export const CHO_BEN_THANH_EMBED_CODE = `<iframe id="tour-embedded" title="Chợ Bến Thành" src="https://tour.panoee.net/iframe/cho-ben-thanh?embedFullscreen=1&amp;embedVr=1&amp;embedGyro=1" frameborder="0" width="100%" height="600px" scrolling="no" allow="autoplay; accelerometer; gyroscope; fullscreen; xr-spatial-tracking" loading="eager" allowfullscreen></iframe>
<script>(function(){var i="tour-embedded",o="https://tour.panoee.net",r=false;function s(v,a){if(!v)return null;var x={};a.forEach(function(k){x[k]=typeof v[k]==="number"?v[k]:null});return x}function ready(f){try{var h=f.contentWindow.location.href;if(h&&h!=="about:blank")r=true}catch(e){r=true}}function send(payload){var el=document.getElementById(i);if(!el||!el.contentWindow)return;try{el.contentWindow.postMessage(payload,o)}catch(t){}}var f=document.getElementById(i);if(f){f.addEventListener("load",function(){r=true});ready(f)}window.addEventListener("message",function(ev){if(!r||!ev.data||ev.data.type!=="devicemotion")return;if(ev.source!==window.parent)return;send(ev.data)},false);window.addEventListener("devicemotion",function(e){if(!r)return;send({type:"devicemotion",deviceMotionEvent:{acceleration:s(e.acceleration,["x","y","z"]),accelerationIncludingGravity:s(e.accelerationIncludingGravity,["x","y","z"]),rotationRate:s(e.rotationRate,["alpha","beta","gamma"]),interval:typeof e.interval==="number"?e.interval:0,timeStamp:e.timeStamp}})},{passive:true})})();</script>`;

export const OFFICIAL_HERITAGE_VR_SPACES: EmbeddedVrSpace[] = [
  {
    id: 'vr-ben-nha-rong',
    title: 'Bến Nhà Rồng',
    location: 'Phường Khánh Hội, Thành phố Hồ Chí Minh',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://bennharong.hochiminh.vn/',
    description: 'Bảo tàng Hồ Chí Minh - Bến Nhà Rồng, nơi Người ra đi tìm đường cứu nước năm 1911.',
    monumentCode: 'BNR',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-cho-ben-thanh',
    title: 'Chợ Bến Thành',
    location: 'Phường Bến Thành, Thành phố Hồ Chí Minh',
    embedType: 'iframe',
    vrOption: 'B',
    embedUrl: 'https://tour.panoee.net/iframe/cho-ben-thanh?embedFullscreen=1&embedVr=1&embedGyro=1',
    rawEmbedCode: CHO_BEN_THANH_EMBED_CODE,
    description: 'Chợ Bến Thành - Biểu tượng thương mại và văn hóa lịch sử hơn một thế kỷ của TP. Hồ Chí Minh.',
    monumentCode: 'CBT',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-chua-mot-cot',
    title: 'Chùa Một Cột',
    location: 'Phường Ba Đình, Thành phố Hà Nội',
    embedType: 'iframe',
    vrOption: 'B',
    embedUrl: 'https://tour.panoee.net/iframe/chua-mot-cot?embedFullscreen=1&embedVr=1&embedGyro=1',
    rawEmbedCode: CHUA_MOT_COT_EMBED_CODE,
    description: 'Chùa Một Cột (Diên Hựu Tự) - Đóa sen ngàn năm tuổi giữa lòng Hà Nội.',
    monumentCode: 'CMC',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-cau-hien-luong',
    title: 'Cầu Hiền Lương - Sông Bến Hải',
    location: 'Xã Vĩnh Linh, Tỉnh Quảng Trị',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://vr360.com.vn/di-tich-lich-su-quang-tri',
    description: 'Di tích Lịch sử Cầu Hiền Lương - Sông Bến Hải, vĩ tuyến 17.',
    monumentCode: 'CauHienLuong',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-dia-dao-cu-chi',
    title: 'Địa đạo Củ Chi',
    location: 'Xã An Nhơn Tây, Thành phố Hồ Chí Minh',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://sanpham.starglobal3d.vn/smart-tourism-3d/sdl-tphcm/?startscene=scene_1_1_2_dia-dao-cu-chi_(1)&startactions=lookat(-48.57,6.67,64.92,0,0);',
    description: 'Địa đạo Củ Chi - Kỳ quan nghệ thuật quân sự độc đáo trong lòng đất của dân tộc Việt Nam.',
    monumentCode: 'DDCC',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-den-hung',
    title: 'Đền Hùng',
    location: 'Xã Hy Cương, Tỉnh Phú Thọ',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://meey3d.com/tour/vu-van-tu-tour-22-103508',
    description: 'Khu Di tích Lịch sử Quốc gia Đặc biệt Đền Hùng - Cội nguồn thiêng liêng của dân tộc Việt Nam.',
    monumentCode: 'DenHung',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-dinh-doc-lap',
    title: 'Dinh Độc Lập',
    location: 'Phường Bến Thành, Thành phố Hồ Chí Minh',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://thamquanvr360.dinhdoclap.gov.vn/',
    description: 'Dinh Độc Lập (Hội trường Thống Nhất) - Di tích lịch sử quốc gia đặc biệt tại TP. Hồ Chí Minh.',
    monumentCode: 'DinhDocLap',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-lang-chu-tich-hcm',
    title: 'Lăng Chủ tịch Hồ Chí Minh',
    location: 'Phường Ba Đình, Thành phố Hà Nội',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://sanpham.starglobal3d.vn/smart-heritage-3d/lang-chu-tich-ho-chi-minh/?startscene=scene_01_lang_bac_(1)&startactions=lookat(-43.42,0.66,118.73,0,0);',
    description: 'Lăng Chủ tịch Hồ Chí Minh - Nơi an nghỉ vĩnh hằng của vị lãnh tụ vĩ đại của dân tộc tại Quảng trường Ba Đình lịch sử.',
    monumentCode: 'LangChuTichHCM',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-ngo-mon',
    title: 'Cố đô Huế (Ngọ Môn)',
    location: 'Phường Phú Xuân, Thành phố Huế',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://360view.vn/gallery/data/projects/vietnam/thuathien_hue/kinhthanh__092011/',
    description: 'Quần thể Di tích Cố đô Huế - Ngọ Môn Hoàng thành Huế, Di sản Văn hóa Thế giới UNESCO.',
    monumentCode: 'NgoMon',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-nha-tho-duc-ba',
    title: 'Nhà Thờ Đức Bà',
    location: 'Phường Sài Gòn, Thành phố Hồ Chí Minh',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://360view.vn/gallery/data/projects/vietnam/tp_hcm/nhathoducba__022011/index.html',
    description: 'Vương cung thánh đường Chính tòa Đức Bà Sài Gòn - Tuyệt tác kiến trúc cổ kính hơn một thế kỷ giữa lòng TP. Hồ Chí Minh.',
    monumentCode: 'NhaThoDB',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-nha-tu-con-dao',
    title: 'Nhà Tù Côn Đảo',
    location: 'Đặc khu Côn Đảo, Thành phố Hồ Chí Minh',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://condao.com.vn/bando3d/du-lich-con-dao/',
    description: 'Khu Di tích Lịch sử Nhà tù Côn Đảo - Trường học cách mạng kiên cường của các chiến sĩ yêu nước Việt Nam.',
    monumentCode: 'NTCD',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-thanh-dia-my-son',
    title: 'Thánh Địa Mỹ Sơn',
    location: 'Xã Thu Bồn, Thành phố Đà Nẵng',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://vr360.com.vn/du-lich-ao-thanh-dia-my-son-co-gi-dac-biet',
    description: 'Thánh địa Mỹ Sơn - Quần thể kiến trúc đền tháp Champa cổ kính ngàn năm giữa thung lũng Duy Xuyên, Di sản Văn hóa Thế giới UNESCO.',
    monumentCode: 'TDiaMS',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-thanh-co-quang-tri',
    title: 'Thành Cổ Quảng Trị',
    location: 'Phường Quảng Trị, Tỉnh Quảng Trị',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://vr360.com.vn/di-tich-lich-su-quang-tri',
    description: 'Di tích Quốc gia Đặc biệt Thành Cổ Quảng Trị - Đài tưởng niệm hào hùng về cuộc chiến đấu 81 ngày đêm mùa hè đỏ lửa 1972.',
    monumentCode: 'ThanhCoQT',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
  {
    id: 'vr-van-mieu-qtg',
    title: 'Văn Miếu Quốc Tử Giám',
    location: 'Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội',
    embedType: 'external_url',
    vrOption: 'C',
    embedUrl: 'https://www.360view.vn/gallery/data/projects/vietnam/hanoi/van_mieu_qtg__102010/index.html',
    description: 'Văn Miếu - Quốc Tử Giám - Trường đại học đầu tiên của Việt Nam, cái nôi của tinh hoa Nho học và hiền tài ngàn năm văn hiến.',
    monumentCode: 'VanMieuQTG',
    addedAt: '2026-09-13T00:00:00.000Z',
    addedBy: 'Admin',
    isCustom: false,
  },
];

const EMBEDDED_VR_SPACES_KEY = 'ditich_embedded_vr_spaces';
const VR_CONFIG_VERSION_KEY = 'ditich_embedded_vr_spaces_version';
const CURRENT_VR_VERSION = 'v5_cmc_cbt_option_b_panoee_2026';

export const vrTourAdminService = {
  getEmbeddedSpaces(): EmbeddedVrSpace[] {
    const raw = storageService.get<EmbeddedVrSpace[]>(EMBEDDED_VR_SPACES_KEY, []);
    let list: EmbeddedVrSpace[] = Array.isArray(raw) ? [...raw] : [];

    // Lọc bỏ toàn bộ dữ liệu mẫu / mock cũ không hợp lệ
    list = list.filter((s) => s && !s.id?.startsWith('vr-default-'));

    // Kiểm tra version đồng bộ để nạp 14 VR Tour mới nhất (bao gồm Option B Panoee cho Chùa Một Cột và Chợ Bến Thành)
    const storedVersion = storageService.get<string>(VR_CONFIG_VERSION_KEY, '');
    const isUpToDate = storedVersion === CURRENT_VR_VERSION;

    if (!isUpToDate) {
      OFFICIAL_HERITAGE_VR_SPACES.forEach((official) => {
        const idx = list.findIndex(
          (s) =>
            s.monumentCode === official.monumentCode ||
            s.id === official.id ||
            s.title.toLowerCase().trim() === official.title.toLowerCase().trim()
        );

        if (idx === -1) {
          list.push({ ...official });
        } else {
          // Ưu tiên cập nhật chính thức Option B cho Chùa Một Cột và Chợ Bến Thành, hoặc các mục chưa có URL
          const isTargetUpdated = official.monumentCode === 'CMC' || official.monumentCode === 'CBT';
          if (isTargetUpdated || !list[idx].isCustom || !list[idx].embedUrl.trim()) {
            list[idx] = {
              ...list[idx],
              title: official.title,
              embedType: official.embedType,
              vrOption: official.vrOption,
              embedUrl: official.embedUrl,
              rawEmbedCode: official.rawEmbedCode,
              monumentCode: official.monumentCode,
              location: official.location,
              description: official.description || list[idx].description,
              isCustom: false,
            };
          }
        }
      });
      storageService.set(VR_CONFIG_VERSION_KEY, CURRENT_VR_VERSION);
    } else {
      // Đảm bảo đủ 14 di tích
      OFFICIAL_HERITAGE_VR_SPACES.forEach((official) => {
        const idx = list.findIndex(
          (s) => s.monumentCode === official.monumentCode || s.id === official.id
        );
        if (idx === -1) {
          list.push({ ...official });
        }
      });
    }

    // Chuẩn hóa vrOption và embedType cho tất cả item
    list.forEach((s) => {
      if (s.vrOption === 'C') {
        s.embedType = 'external_url';
      } else if (s.vrOption === 'B') {
        s.embedType = 'iframe';
      } else if (s.vrOption === 'A') {
        s.embedType = 'panorama_image';
      } else if (!s.vrOption) {
        s.vrOption = s.embedType === 'panorama_image' ? 'A' : s.embedType === 'iframe' ? 'B' : 'C';
      }
    });

    // Sắp xếp danh sách di tích theo chuẩn 14 di tích (0-13)
    list.sort((a, b) => {
      const idxA = ORDERED_HERITAGE_LIST.findIndex((m) => m.code === a.monumentCode);
      const idxB = ORDERED_HERITAGE_LIST.findIndex((m) => m.code === b.monumentCode);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    storageService.set(EMBEDDED_VR_SPACES_KEY, list);
    return list;
  },

  resetToOfficialDefaults(): EmbeddedVrSpace[] {
    const list = OFFICIAL_HERITAGE_VR_SPACES.map((item) => ({ ...item }));
    storageService.set(EMBEDDED_VR_SPACES_KEY, list);
    storageService.set(VR_CONFIG_VERSION_KEY, CURRENT_VR_VERSION);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_vr_spaces_updated', { detail: list }));
    }
    return list;
  },

  getEmbeddedSpaceForMonument(monumentCode: string): EmbeddedVrSpace | undefined {
    const spaces = this.getEmbeddedSpaces();
    const normalizedCode = (monumentCode || '').trim().toLowerCase();

    return spaces.find(
      (s) => {
        const itemCode = (s.monumentCode || '').trim().toLowerCase();
        if (itemCode && itemCode === normalizedCode) return true;

        if (normalizedCode === 'bnr' || normalizedCode.includes('nha-rong') || normalizedCode.includes('nharong')) {
          return itemCode === 'bnr' || s.id === 'vr-ben-nha-rong' || s.title.toLowerCase().includes('bến nhà rồng');
        }
        if (normalizedCode === 'cbt' || normalizedCode.includes('ben-thanh') || normalizedCode.includes('benthanh')) {
          return itemCode === 'cbt' || s.id === 'vr-cho-ben-thanh' || s.title.toLowerCase().includes('bến thành');
        }
        if (normalizedCode === 'cmc' || normalizedCode.includes('mot-cot') || normalizedCode.includes('motcot')) {
          return itemCode === 'cmc' || s.id === 'vr-chua-mot-cot' || s.title.toLowerCase().includes('một cột');
        }
        if (normalizedCode === 'cauhienluong' || normalizedCode.includes('hien-luong') || normalizedCode.includes('hienluong')) {
          return itemCode === 'cauhienluong' || s.id === 'vr-cau-hien-luong' || s.title.toLowerCase().includes('hiền lương');
        }
        if (normalizedCode === 'ddcc' || normalizedCode.includes('cu-chi') || normalizedCode.includes('cuchi')) {
          return itemCode === 'ddcc' || s.id === 'vr-dia-dao-cu-chi' || s.title.toLowerCase().includes('củ chi');
        }
        if (normalizedCode === 'denhung' || normalizedCode.includes('den-hung')) {
          return itemCode === 'denhung' || s.id === 'vr-den-hung' || s.title.toLowerCase().includes('đền hùng');
        }
        if (normalizedCode === 'dinhdoclap' || normalizedCode.includes('doc-lap') || normalizedCode.includes('doclap')) {
          return itemCode === 'dinhdoclap' || s.id === 'vr-dinh-doc-lap' || s.title.toLowerCase().includes('độc lập');
        }
        if (normalizedCode === 'langchutichhcm' || normalizedCode.includes('lang-bac') || normalizedCode.includes('langbac') || normalizedCode.includes('langchutich')) {
          return itemCode === 'langchutichhcm' || s.id === 'vr-lang-chu-tich-hcm' || s.title.toLowerCase().includes('lăng');
        }
        if (normalizedCode === 'ngomon' || normalizedCode.includes('ngo-mon') || normalizedCode.includes('hue')) {
          return itemCode === 'ngomon' || s.id === 'vr-ngo-mon' || s.title.toLowerCase().includes('ngọ môn') || s.title.toLowerCase().includes('huế');
        }
        if (normalizedCode === 'nhathodb' || normalizedCode.includes('duc-ba') || normalizedCode.includes('ducba')) {
          return itemCode === 'nhathodb' || s.id === 'vr-nha-tho-duc-ba' || s.title.toLowerCase().includes('đức bà');
        }
        if (normalizedCode === 'ntcd' || normalizedCode.includes('con-dao') || normalizedCode.includes('condao')) {
          return itemCode === 'ntcd' || s.id === 'vr-nha-tu-con-dao' || s.title.toLowerCase().includes('côn đảo');
        }
        if (normalizedCode === 'tdiams' || normalizedCode.includes('my-son') || normalizedCode.includes('myson')) {
          return itemCode === 'tdiams' || s.id === 'vr-thanh-dia-my-son' || s.title.toLowerCase().includes('mỹ sơn');
        }
        if (normalizedCode === 'thanhcoqt' || normalizedCode.includes('quang-tri') || normalizedCode.includes('quangtri') || normalizedCode.includes('thanh-co')) {
          return itemCode === 'thanhcoqt' || s.id === 'vr-thanh-co-quang-tri' || s.title.toLowerCase().includes('thành cổ');
        }
        if (normalizedCode === 'vanmieuqtg' || normalizedCode.includes('van-mieu') || normalizedCode.includes('vanmieu') || normalizedCode.includes('quoc-tu-giam')) {
          return itemCode === 'vanmieuqtg' || s.id === 'vr-van-mieu-qtg' || s.title.toLowerCase().includes('văn miếu');
        }

        return false;
      }
    );
  },

  saveSpaceForMonument(space: {
    monumentCode: string;
    title: string;
    location: string;
    embedType: VrOptionType;
    vrOption?: VrOptionKey;
    embedUrl: string;
    rawEmbedCode?: string;
    description?: string;
  }): EmbeddedVrSpace {
    const spaces = this.getEmbeddedSpaces();
    const now = new Date().toISOString();
    const existingIndex = spaces.findIndex((s) => s.monumentCode === space.monumentCode);

    const determinedOption: VrOptionKey =
      space.vrOption ||
      (space.embedType === 'panorama_image' ? 'A' : space.embedType === 'iframe' ? 'B' : 'C');

    let savedSpace: EmbeddedVrSpace;

    if (existingIndex >= 0) {
      savedSpace = {
        ...spaces[existingIndex],
        ...space,
        vrOption: determinedOption,
        isCustom: true,
        addedAt: now,
        addedBy: 'Admin',
      };
      spaces[existingIndex] = savedSpace;
    } else {
      savedSpace = {
        id: `vr-${Date.now()}`,
        ...space,
        vrOption: determinedOption,
        isCustom: true,
        addedAt: now,
        addedBy: 'Admin',
      };
      spaces.unshift(savedSpace);
    }

    storageService.set(EMBEDDED_VR_SPACES_KEY, spaces);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_vr_spaces_updated', { detail: savedSpace }));
    }

    return savedSpace;
  },

  deleteSpaceForMonument(monumentCode: string): void {
    const spaces = this.getEmbeddedSpaces().filter((s) => s.monumentCode !== monumentCode);
    storageService.set(EMBEDDED_VR_SPACES_KEY, spaces);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_vr_spaces_updated', { detail: { monumentCode } }));
    }
  },

  addEmbeddedSpace(space: Omit<EmbeddedVrSpace, 'id' | 'addedAt' | 'isCustom'>): EmbeddedVrSpace {
    const spaces = this.getEmbeddedSpaces();
    const determinedOption: VrOptionKey =
      space.vrOption ||
      (space.embedType === 'panorama_image' ? 'A' : space.embedType === 'iframe' ? 'B' : 'C');
    const newSpace: EmbeddedVrSpace = {
      ...space,
      vrOption: determinedOption,
      id: `vr-custom-${Date.now()}`,
      addedAt: new Date().toISOString(),
      isCustom: true,
    };
    spaces.unshift(newSpace);
    storageService.set(EMBEDDED_VR_SPACES_KEY, spaces);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_vr_spaces_updated', { detail: newSpace }));
    }
    return newSpace;
  },

  removeEmbeddedSpace(id: string): void {
    const spaces = this.getEmbeddedSpaces().filter((s) => s.id !== id);
    storageService.set(EMBEDDED_VR_SPACES_KEY, spaces);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_vr_spaces_updated', { detail: { id } }));
    }
  },
};
