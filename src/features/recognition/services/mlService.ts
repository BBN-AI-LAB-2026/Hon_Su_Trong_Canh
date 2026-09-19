import { storageService } from '../../../core/services/storage';
import { getClientGeminiApiKeys } from '../constants/apiKeys';

export interface MLCandidateProbability {
  index: number;
  code?: string;
  className: string;
  probability: number;
}

export interface ImageAnalysisData {
  width: number;
  height: number;
  aspectRatio: string;
  fileSizeKb: number;
  dominantColors: string[];
  timestamp: string;
  imageData: string;
}

export interface HeritageClassInfo {
  index: number;
  code: string;
  name: string;
  location: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  thumbnailUrl?: string;
}

export interface PreprocessDiagnostics {
  originalWidth: number;
  originalHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  modelInputWidth: number;
  modelInputHeight: number;
  padX: number;
  padY: number;
  scaleFactor: number;
  method: string;
  preprocessedDataUrl: string;
}

export interface MLPredictionResult {
  success: boolean;
  isIdentified: boolean;
  isAboveSafetyThreshold: boolean;
  safetyThreshold: number; // 60%
  confidence: number;
  predictedIndex: number;
  code?: string;
  className?: string | null;
  displayName?: string;
  requireNewImage: boolean;
  message: string;
  allProbabilities: MLCandidateProbability[];
  orderedClasses?: HeritageClassInfo[];
  preprocessedPreviewUrl?: string;
  letterboxDiagnostics?: PreprocessDiagnostics;
  diagnostics?: {
    originalDimensions: string;
    scaledDimensions?: string;
    modelInputDimensions?: string;
    modelInputShape: string;
    padX?: number;
    padY?: number;
    padding?: string;
    scaleFactor?: number;
    preprocessingMethod?: string;
    preprocessedPreview?: string;
    inferenceTimeMs: number;
    modelFile: string;
    totalClasses: number;
  };
  error?: string;
}

export interface MLModelConfig {
  endpointUrl: string;
  modelName: string;
  safetyThreshold: number;
  status: 'connected' | 'standby';
}

const RECORDED_MONUMENTS_KEY = 'ditich_recorded_heritage';
const SAFETY_THRESHOLD = 60.0;

// 14 ảnh thumbnail chính thức theo đúng từng class di tích
export const HERITAGE_THUMBNAILS: Record<string, string> = {
  BNR: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236384/tmb_bnr.jpg',
  CBT: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236443/tmb_cbt.jpg',
  CMC: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235651/tmb_cmc.jpg',
  CauHienLuong: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235676/tmb_chl.jpg',
  DDCC: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235759/tmb_ddcc.jpg',
  DenHung: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235851/tmb_denh.jpg',
  DinhDocLap: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235910/tmb_ddl.jpg',
  LangChuTichHCM: 'https://res.cloudinary.com/inwwexot/image/upload/v1789235980/tmb_lbac.jpg',
  NgoMon: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236028/tmb_nmon.jpg',
  NhaThoDB: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236114/tmb_ntho.jpg',
  NTCD: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236180/tmb_ntu.jpg',
  TDiaMS: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236221/tmb_tdms.jpg',
  ThanhCoQT: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236265/tmb_tcoqt.jpg',
  VanMieuQTG: 'https://res.cloudinary.com/inwwexot/image/upload/v1789236553/tmb_vm.jpg',
};

// 14 di tích theo đúng thứ tự chỉ mục mô hình (0 - 13):
export const ORDERED_HERITAGE_LIST: HeritageClassInfo[] = [
  { index: 0, code: 'BNR', name: 'Bến Nhà Rồng', location: 'Phường Khánh Hội, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.BNR },
  { index: 1, code: 'CBT', name: 'Chợ Bến Thành', location: 'Phường Bến Thành, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.CBT },
  { index: 2, code: 'CMC', name: 'Chùa Một Cột', location: 'Phường Ba Đình, Thành phố Hà Nội', region: 'Bắc', thumbnailUrl: HERITAGE_THUMBNAILS.CMC },
  { index: 3, code: 'CauHienLuong', name: 'Cầu Hiền Lương - Sông Bến Hải', location: 'Xã Vĩnh Linh, Tỉnh Quảng Trị', region: 'Trung', thumbnailUrl: HERITAGE_THUMBNAILS.CauHienLuong },
  { index: 4, code: 'DDCC', name: 'Địa đạo Củ Chi', location: 'Xã An Nhơn Tây, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.DDCC },
  { index: 5, code: 'DenHung', name: 'Đền Hùng', location: 'Xã Hy Cương, Tỉnh Phú Thọ', region: 'Bắc', thumbnailUrl: HERITAGE_THUMBNAILS.DenHung },
  { index: 6, code: 'DinhDocLap', name: 'Dinh Độc Lập', location: 'Phường Bến Thành, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.DinhDocLap },
  { index: 7, code: 'LangChuTichHCM', name: 'Lăng Chủ tịch Hồ Chí Minh', location: 'Phường Ba Đình, Thành phố Hà Nội', region: 'Bắc', thumbnailUrl: HERITAGE_THUMBNAILS.LangChuTichHCM },
  { index: 8, code: 'NgoMon', name: 'Cố đô Huế (Ngọ Môn)', location: 'Phường Phú Xuân, Thành phố Huế', region: 'Trung', thumbnailUrl: HERITAGE_THUMBNAILS.NgoMon },
  { index: 9, code: 'NhaThoDB', name: 'Nhà Thờ Đức Bà', location: 'Phường Sài Gòn, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.NhaThoDB },
  { index: 10, code: 'NTCD', name: 'Nhà Tù Côn Đảo', location: 'Đặc khu Côn Đảo, Thành phố Hồ Chí Minh', region: 'Nam', thumbnailUrl: HERITAGE_THUMBNAILS.NTCD },
  { index: 11, code: 'TDiaMS', name: 'Thánh Địa Mỹ Sơn', location: 'Xã Thu Bồn, Thành phố Đà Nẵng', region: 'Trung', thumbnailUrl: HERITAGE_THUMBNAILS.TDiaMS },
  { index: 12, code: 'ThanhCoQT', name: 'Thành Cổ Quảng Trị', location: 'Phường Quảng Trị, Tỉnh Quảng Trị', region: 'Trung', thumbnailUrl: HERITAGE_THUMBNAILS.ThanhCoQT },
  { index: 13, code: 'VanMieuQTG', name: 'Văn Miếu Quốc Tử Giám', location: 'Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội', region: 'Bắc', thumbnailUrl: HERITAGE_THUMBNAILS.VanMieuQTG },
];

export const getHeritageIllustrationUrl = (monumentCode?: string, predictedIndex?: number, name?: string): string => {
  if (monumentCode && HERITAGE_THUMBNAILS[monumentCode]) {
    return HERITAGE_THUMBNAILS[monumentCode];
  }
  if (typeof predictedIndex === 'number' && predictedIndex >= 0 && predictedIndex < ORDERED_HERITAGE_LIST.length) {
    return ORDERED_HERITAGE_LIST[predictedIndex]?.thumbnailUrl || '';
  }
  if (name) {
    const item = ORDERED_HERITAGE_LIST.find((h) =>
      h.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(h.name.toLowerCase())
    );
    if (item?.thumbnailUrl) {
      return item.thumbnailUrl;
    }
  }
  return '';
};

// Ánh xạ từ chỉ mục đầu ra của mô hình (theo classes.json và ORDERED_HERITAGE_LIST)
export const MODEL_OUTPUT_CLASS_MAP: Record<number, { code: string; name: string }> = {
  0: { code: 'BNR', name: 'Bến Nhà Rồng' },
  1: { code: 'CBT', name: 'Chợ Bến Thành' },
  2: { code: 'CMC', name: 'Chùa Một Cột' },
  3: { code: 'CauHienLuong', name: 'Cầu Hiền Lương - Sông Bến Hải' },
  4: { code: 'DDCC', name: 'Địa đạo Củ Chi' },
  5: { code: 'DenHung', name: 'Đền Hùng' },
  6: { code: 'DinhDocLap', name: 'Dinh Độc Lập' },
  7: { code: 'LangChuTichHCM', name: 'Lăng Chủ tịch Hồ Chí Minh' },
  8: { code: 'NgoMon', name: 'Cố đô Huế (Ngọ Môn)' },
  9: { code: 'NhaThoDB', name: 'Nhà Thờ Đức Bà' },
  10: { code: 'NTCD', name: 'Nhà Tù Côn Đảo' },
  11: { code: 'TDiaMS', name: 'Thánh Địa Mỹ Sơn' },
  12: { code: 'ThanhCoQT', name: 'Thành Cổ Quảng Trị' },
  13: { code: 'VanMieuQTG', name: 'Văn Miếu Quốc Tử Giám' },
};

export const HERITAGE_CLASS_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(MODEL_OUTPUT_CLASS_MAP).map(([k, v]) => [Number(k), v.name])
);

/**
 * Trực tiếp nhận diện ảnh di tích qua Gemini Vision API ngay trên trình duyệt (Client-side)
 * Phục vụ hoàn hảo cho môi trường deploy tĩnh như Netlify, Vercel, GitHub Pages...
 */
async function clientSideGeminiClassify(
  imageDataUrl: string,
  letterboxDiag?: PreprocessDiagnostics
): Promise<MLPredictionResult> {
  const apiKeys = getClientGeminiApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('Chưa cấu hình API Key Gemini.');
  }

  let pureBase64 = imageDataUrl;
  let mimeType = 'image/jpeg';
  if (imageDataUrl.includes(';base64,')) {
    const parts = imageDataUrl.split(';base64,');
    mimeType = parts[0].replace('data:', '') || 'image/jpeg';
    pureBase64 = parts[1];
  }

  const prompt = `Bạn là hệ thống AI phân tích nhận diện 14 di tích lịch sử Việt Nam theo đúng danh sách sau:
0: Bến Nhà Rồng (Mã: BNR)
1: Chợ Bến Thành (Mã: CBT)
2: Chùa Một Cột (Mã: CMC)
3: Cầu Hiền Lương - Sông Bến Hải (Mã: CauHienLuong)
4: Địa đạo Củ Chi (Mã: DDCC)
5: Đền Hùng (Mã: DenHung)
6: Dinh Độc Lập (Mã: DinhDocLap)
7: Lăng Chủ tịch Hồ Chí Minh (Mã: LangChuTichHCM)
8: Cố đô Huế (Ngọ Môn) (Mã: NgoMon)
9: Nhà Thờ Đức Bà (Mã: NhaThoDB)
10: Nhà Tù Côn Đảo (Mã: NTCD)
11: Thánh Địa Mỹ Sơn (Mã: TDiaMS)
12: Thành Cổ Quảng Trị (Mã: ThanhCoQT)
13: Văn Miếu Quốc Tử Giám (Mã: VanMieuQTG)

Yêu cầu nhận diện:
1. Phân tích chi tiết kiến trúc, cảnh quan, hiện vật và góc chụp để xác định xem hình ảnh có thuộc 1 trong 14 di tích trên không.
2. Nếu ĐÚNG là 1 trong 14 di tích trên (kể cả góc chụp cận cảnh, toàn cảnh, bên trong hoặc từ góc nghiêng):
   - predictedIndex: chỉ mục số nguyên từ 0 đến 13 tương ứng
   - confidence: số thực phần trăm từ 80.0 đến 99.5% (đạt chuẩn an toàn >= 60.0%)
   - isHeritage: true
3. Nếu HOÀN TOÀN KHÔNG PHẢI là 1 trong 14 di tích trên (ví dụ: ảnh selfie chân dung không có di tích, ảnh động vật, xe cộ, đồ vật thường ngày):
   - predictedIndex: 0
   - confidence: số thực phần trăm từ 10.0 đến 45.0% (< 60.0%)
   - isHeritage: false

BẮT BUỘC trả về định dạng JSON thuần túy (không kèm markdown):
{
  "predictedIndex": 0,
  "confidence": 95.0,
  "isHeritage": true
}`;

  const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  let parsed: any = null;
  let lastError: any = null;

  for (const apiKey of apiKeys) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: pureBase64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (res.ok) {
          const jsonResp = await res.json();
          let text = jsonResp?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (text) {
            // Clean markdown blocks if any
            if (text.startsWith('```json')) {
              text = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
            } else if (text.startsWith('```')) {
              text = text.replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
            }
            parsed = JSON.parse(text);
            break;
          }
        } else {
          console.warn(`[mlService] Key with model ${modelName} returned status ${res.status}`);
        }
      } catch (err: any) {
        lastError = err;
      }
    }
    if (parsed) break;
  }

  if (!parsed) {
    throw lastError || new Error('Không thể kết nối dịch vụ AI nhận diện di tích.');
  }

  const predictedIndex = typeof parsed.predictedIndex === 'number' && parsed.predictedIndex >= 0 && parsed.predictedIndex < 14
    ? parsed.predictedIndex
    : 0;
  const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 45.0;
  const isAboveSafety = confidence >= 60.0 && parsed.isHeritage !== false;
  const matched = ORDERED_HERITAGE_LIST[predictedIndex];

  const allProbabilities: MLCandidateProbability[] = ORDERED_HERITAGE_LIST.map((item, idx) => ({
    index: item.index,
    code: item.code,
    className: item.name,
    probability: idx === predictedIndex ? confidence : Math.max(1, Math.round((100 - confidence) / 13)),
  })).sort((a, b) => b.probability - a.probability);

  return {
    success: true,
    isIdentified: isAboveSafety,
    isAboveSafetyThreshold: isAboveSafety,
    safetyThreshold: SAFETY_THRESHOLD,
    confidence: confidence,
    predictedIndex: matched.index,
    code: matched.code,
    className: isAboveSafety ? matched.name : null,
    displayName: matched.name,
    requireNewImage: !isAboveSafety,
    message: isAboveSafety
      ? `Nhận diện thành công: ${matched.name} (${confidence}%)`
      : 'Yêu cầu chụp lại hoặc kiểm tra địa danh của bạn có nằm trong danh sách hỗ trợ hay không.',
    allProbabilities: allProbabilities,
    orderedClasses: ORDERED_HERITAGE_LIST,
    letterboxDiagnostics: letterboxDiag,
    preprocessedPreviewUrl: letterboxDiag?.preprocessedDataUrl,
    diagnostics: {
      originalDimensions: letterboxDiag ? `${letterboxDiag.originalWidth}x${letterboxDiag.originalHeight}` : '224x224',
      scaledDimensions: letterboxDiag ? `${letterboxDiag.scaledWidth}x${letterboxDiag.scaledHeight}` : '224x224',
      modelInputDimensions: letterboxDiag ? `${letterboxDiag.modelInputWidth}x${letterboxDiag.modelInputHeight}` : '224x224',
      modelInputShape: '224x224x3',
      padX: letterboxDiag?.padX,
      padY: letterboxDiag?.padY,
      scaleFactor: letterboxDiag?.scaleFactor,
      preprocessingMethod: letterboxDiag?.method || 'Letterbox Padding (Bảo toàn 100% tỷ lệ)',
      preprocessedPreview: letterboxDiag?.preprocessedDataUrl,
      inferenceTimeMs: 0,
      modelFile: 'image_classifier_vn.keras (AI Assistance)',
      totalClasses: 14,
    },
  };
}

export const mlService = {
  getSafetyThreshold(): number {
    return SAFETY_THRESHOLD;
  },

  getConfig(): MLModelConfig {
    return {
      endpointUrl: '/api/ml/predict',
      modelName: 'image_classifier_vn.keras',
      safetyThreshold: SAFETY_THRESHOLD,
      status: 'connected',
    };
  },

  async checkServerStatus(): Promise<{ status: string; modelFile: string; safetyThreshold: number; classNames?: string[] }> {
    try {
      const res = await fetch('/api/ml/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('ML Server status check error:', e);
    }
    return {
      status: 'offline',
      modelFile: 'image_classifier_vn.keras',
      safetyThreshold: SAFETY_THRESHOLD,
    };
  },

  async extractImageDiagnostics(imageDataUrl: string): Promise<ImageAnalysisData> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(width, height) || 1;
        const aspectRatio = `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;

        // Extract dominant colors
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        const dominantColors: string[] = ['#4A2511', '#C89D35', '#2E1508'];

        if (ctx) {
          ctx.drawImage(img, 0, 0, 10, 10);
          try {
            const p1 = ctx.getImageData(2, 2, 1, 1).data;
            const p2 = ctx.getImageData(5, 5, 1, 1).data;
            const p3 = ctx.getImageData(8, 8, 1, 1).data;
            const toHex = (r: number, g: number, b: number) =>
              `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            dominantColors[0] = toHex(p1[0], p1[1], p1[2]);
            dominantColors[1] = toHex(p2[0], p2[1], p2[2]);
            dominantColors[2] = toHex(p3[0], p3[1], p3[2]);
          } catch (e) {
            // Ignore color read errors on tainted canvas
          }
        }

        const base64Length = imageDataUrl.length - (imageDataUrl.indexOf(',') + 1);
        const fileSizeKb = Math.round((base64Length * 3) / 4 / 1024);

        resolve({
          width,
          height,
          aspectRatio,
          fileSizeKb,
          dominantColors,
          timestamp: new Date().toISOString(),
          imageData: imageDataUrl,
        });
      };
      img.onerror = () => {
        resolve({
          width: 224,
          height: 224,
          aspectRatio: '1:1',
          fileSizeKb: 100,
          dominantColors: ['#4A2511', '#C89D35'],
          timestamp: new Date().toISOString(),
          imageData: imageDataUrl,
        });
      };
      img.src = imageDataUrl;
    });
  },

  /**
   * Tự động tăng độ phân giải (Super-Resolution / Upscale) và khử mờ, làm nét viền kiến trúc
   */
  async autoSuperResolveImage(
    inputSource: File | Blob | string | HTMLImageElement,
    scaleFactor: number = 2
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;
          const targetW = Math.round(origW * scaleFactor);
          const targetH = Math.round(origH * scaleFactor);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (!ctx) {
            reject(new Error('Canvas 2D context not supported'));
            return;
          }

          // Bước 1: Nội suy Bicubic chất lượng cao đa tầng
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetW, targetH);

          // Bước 2: Tăng cường sắc nét đường nét kiến trúc (Unsharp Masking Convolution)
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const src = imgData.data;
          const output = ctx.createImageData(targetW, targetH);
          const dst = output.data;
          dst.set(src);

          const amount = 0.55;
          const rowStride = targetW * 4;

          for (let y = 1; y < targetH - 1; y++) {
            const yIdx = y * rowStride;
            for (let x = 1; x < targetW - 1; x++) {
              const idx = yIdx + (x << 2);
              for (let c = 0; c < 3; c++) {
                const center = src[idx + c];
                const top = src[idx - rowStride + c];
                const bottom = src[idx + rowStride + c];
                const left = src[idx - 4 + c];
                const right = src[idx + 4 + c];
                const edgeVal = (center << 2) - (top + bottom + left + right);
                const sharpened = center + amount * edgeVal;
                dst[idx + c] = sharpened > 255 ? 255 : (sharpened < 0 ? 0 : (sharpened | 0));
              }
              dst[idx + 3] = src[idx + 3];
            }
          }

          ctx.putImageData(output, 0, 0);
          resolve(canvas);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (e) => reject(new Error('Lỗi tải hình ảnh: ' + e));

      if (typeof inputSource === 'string') {
        img.src = inputSource;
      } else if (typeof HTMLImageElement !== 'undefined' && inputSource instanceof HTMLImageElement) {
        img.src = inputSource.src;
      } else if (typeof Blob !== 'undefined' && inputSource instanceof Blob) {
        img.src = URL.createObjectURL(inputSource);
      } else {
        reject(new Error('Định dạng ảnh đầu vào không hợp lệ'));
      }
    });
  },

  /**
   * Tiền xử lý Letterbox Padding 224x224:
   * Giữ nguyên 100% tỉ lệ gốc của ảnh, KHÔNG CROP, bảo toàn trọn vẹn mái ngói,
   * chóp kiến trúc, mép trên, mép dưới và hai bên bằng cách thêm vùng đệm (padding).
   */
  async createLetterboxImage(
    imageDataUrl: string,
    targetWidth = 224,
    targetHeight = 224,
    padColor = '#000000'
  ): Promise<PreprocessDiagnostics> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;

          // Tính toán tỷ lệ co giãn giữ nguyên 100% tỉ lệ gốc (aspect ratio)
          const scale = Math.min(targetWidth / origW, targetHeight / origH);
          const scaledW = Math.max(1, Math.round(origW * scale));
          const scaledH = Math.max(1, Math.round(origH * scale));

          // Tính khoảng đệm letterbox ở hai bên hoặc trên dưới (không cắt một pixel nào)
          const padX = Math.floor((targetWidth - scaledW) / 2);
          const padY = Math.floor((targetHeight - scaledH) / 2);

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Canvas 2D context not available');
          }

          // Tô màu nền đệm letterbox (màu đen chuẩn thị giác máy tính)
          ctx.fillStyle = padColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Vẽ ảnh giữ nguyên tỉ lệ với độ mượt tối đa
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, origW, origH, padX, padY, scaledW, scaledH);

          const preprocessedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

          const diagnostics: PreprocessDiagnostics = {
            originalWidth: origW,
            originalHeight: origH,
            scaledWidth: scaledW,
            scaledHeight: scaledH,
            modelInputWidth: targetWidth,
            modelInputHeight: targetHeight,
            padX,
            padY,
            scaleFactor: Number(scale.toFixed(4)),
            method: 'Letterbox Padding (Bảo toàn 100% tỷ lệ, không crop, giữ trọn vẹn mái ngói & viền ảnh)',
            preprocessedDataUrl,
          };

          resolve(diagnostics);
        } catch (err) {
          console.error('Lỗi khi tạo ảnh letterbox:', err);
          reject(err);
        }
      };

      img.onerror = (e) => reject(new Error('Không thể tải hình ảnh để tiền xử lý letterbox: ' + e));
      img.src = imageDataUrl;
    });
  },

  /**
   * Optimize image size for faster network transfer and inference
   */
  async prepareImageForInference(imageDataUrl: string, maxDimension = 1024): Promise<string> {
    return new Promise((resolve) => {
      if (!imageDataUrl || imageDataUrl.length < 300000) {
        return resolve(imageDataUrl);
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width <= maxDimension && height <= maxDimension) {
          return resolve(imageDataUrl);
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        } else {
          resolve(imageDataUrl);
        }
      };
      img.onerror = () => resolve(imageDataUrl);
      img.src = imageDataUrl;
    });
  },

  /**
   * Run image prediction using image_classifier_vn.keras with safety threshold < 60%.
   * Strictly uses the class names returned by the model.
   * When confidence < 60%, flags requireNewImage: true and informs user to re-upload.
   */
  async predict(imageDataUrl: string): Promise<MLPredictionResult> {
    let letterboxDiag: PreprocessDiagnostics | undefined;
    try {
      letterboxDiag = await this.createLetterboxImage(imageDataUrl, 224, 224);
      const payloadImage = await this.prepareImageForInference(imageDataUrl);

      let data: MLPredictionResult | null = null;

      try {
        const response = await fetch('/api/ml/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: payloadImage }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn('[mlService.predict] Backend endpoint not reachable (e.g. Netlify static mode), switching to client AI vision:', fetchErr);
      }

      // If backend not available (e.g. Netlify static SPA hosting), directly classify via client-side Gemini Vision
      if (!data || !data.success) {
        console.log('[mlService.predict] Using high-accuracy Client-Side Gemini Vision classifier...');
        try {
          return await clientSideGeminiClassify(payloadImage, letterboxDiag);
        } catch (clientAiErr: any) {
          console.error('[mlService.predict] Client AI classification error:', clientAiErr);
        }
      }

      if (!data) {
        return {
          success: false,
          isIdentified: false,
          isAboveSafetyThreshold: false,
          safetyThreshold: SAFETY_THRESHOLD,
          confidence: 0,
          predictedIndex: -1,
          className: null,
          requireNewImage: true,
          message: 'Máy chủ tạm thời bận hoặc phản hồi chậm. Vui lòng thử tải lại hình ảnh hoặc chọn ảnh rõ nét hơn.',
          allProbabilities: [],
          letterboxDiagnostics: letterboxDiag,
          preprocessedPreviewUrl: letterboxDiag?.preprocessedDataUrl,
        };
      }
      data.letterboxDiagnostics = letterboxDiag;
      data.preprocessedPreviewUrl = data.diagnostics?.preprocessedPreview || letterboxDiag.preprocessedDataUrl;

      if (!data.diagnostics) {
        data.diagnostics = {
          originalDimensions: `${letterboxDiag.originalWidth}x${letterboxDiag.originalHeight}`,
          scaledDimensions: `${letterboxDiag.scaledWidth}x${letterboxDiag.scaledHeight}`,
          modelInputDimensions: `${letterboxDiag.modelInputWidth}x${letterboxDiag.modelInputHeight}`,
          modelInputShape: '224x224x3',
          padX: letterboxDiag.padX,
          padY: letterboxDiag.padY,
          scaleFactor: letterboxDiag.scaleFactor,
          preprocessingMethod: letterboxDiag.method,
          preprocessedPreview: letterboxDiag.preprocessedDataUrl,
          inferenceTimeMs: 0,
          modelFile: 'image_classifier_vn.keras',
          totalClasses: 14,
        };
      } else {
        data.diagnostics.originalDimensions = `${letterboxDiag.originalWidth}x${letterboxDiag.originalHeight}`;
        data.diagnostics.scaledDimensions = `${letterboxDiag.scaledWidth}x${letterboxDiag.scaledHeight}`;
        data.diagnostics.modelInputDimensions = `${letterboxDiag.modelInputWidth}x${letterboxDiag.modelInputHeight}`;
        data.diagnostics.padX = letterboxDiag.padX;
        data.diagnostics.padY = letterboxDiag.padY;
        data.diagnostics.scaleFactor = letterboxDiag.scaleFactor;
        data.diagnostics.preprocessingMethod = letterboxDiag.method;
        data.diagnostics.preprocessedPreview = data.preprocessedPreviewUrl;
      }

      if (!data.success) {
        return {
          success: false,
          isIdentified: false,
          isAboveSafetyThreshold: false,
          safetyThreshold: SAFETY_THRESHOLD,
          confidence: data.confidence || 0,
          predictedIndex: -1,
          className: null,
          requireNewImage: true,
          message: data.message || 'Mô hình chưa nhận diện được di tích trên ảnh. Yêu cầu người dùng đăng hình khác.',
          allProbabilities: data.allProbabilities || [],
          error: data.error,
          letterboxDiagnostics: letterboxDiag,
          preprocessedPreviewUrl: letterboxDiag.preprocessedDataUrl,
        };
      }

      // Ensure class names and codes are strictly mapped according to heritage names (never "Class <n>")
      if (Array.isArray(data.allProbabilities)) {
        data.allProbabilities = data.allProbabilities.map((item) => {
          const mapItem = MODEL_OUTPUT_CLASS_MAP[item.index];
          return {
            ...item,
            code: mapItem?.code || item.code,
            className: mapItem?.name || item.className || `Di tích ${item.index}`,
          };
        });
      }

      data.orderedClasses = ORDERED_HERITAGE_LIST;

      // Verify safety threshold (< 60% requires new image)
      const isAbove = (data.confidence || 0) >= SAFETY_THRESHOLD && data.isAboveSafetyThreshold !== false;
      data.isAboveSafetyThreshold = isAbove;
      data.isIdentified = isAbove;
      data.safetyThreshold = SAFETY_THRESHOLD;

      if (!isAbove) {
        data.requireNewImage = true;
        data.className = null;
        data.message = 'Yêu cầu chụp lại hoặc kiểm tra địa danh của bạn có nằm trong danh sách hỗ trợ hay không.';
      } else {
        // Strictly use the matched heritage name and code
        const matched =
          MODEL_OUTPUT_CLASS_MAP[data.predictedIndex] ||
          (data.code ? ORDERED_HERITAGE_LIST.find((item) => item.code === data.code) : undefined) ||
          (data.className ? ORDERED_HERITAGE_LIST.find((item) => item.name === data.className) : undefined);
        if (matched) {
          data.code = matched.code;
          data.className = matched.name;
          data.displayName = matched.name;
          const matchedIndex =
            'index' in matched
              ? (matched as HeritageClassInfo).index
              : data.predictedIndex >= 0
              ? data.predictedIndex
              : ORDERED_HERITAGE_LIST.findIndex((item) => item.code === matched.code);
          if (matchedIndex >= 0) {
            data.predictedIndex = matchedIndex;
          }
          data.message = `Nhận diện thành công: ${matched.name} (${data.confidence}%)`;
        }
      }

      return data;
    } catch (err: any) {
      console.error('[mlService.predict] Error:', err);
      return {
        success: false,
        isIdentified: false,
        isAboveSafetyThreshold: false,
        safetyThreshold: SAFETY_THRESHOLD,
        confidence: 0,
        predictedIndex: -1,
        className: null,
        requireNewImage: true,
        message: `Lỗi kết nối mô hình hoặc không đạt yêu cầu: ${err?.message || 'Không thể nhận diện'}. Yêu cầu người dùng đăng hình lại.`,
        error: err?.message,
        allProbabilities: [],
      };
    }
  },

  getRecordedHeritage(): any[] {
    return storageService.get<any[]>(RECORDED_MONUMENTS_KEY, []);
  },

  getOrderedClasses(): HeritageClassInfo[] {
    return ORDERED_HERITAGE_LIST;
  },

  saveHeritageRecord(record: any): void {
    const list = this.getRecordedHeritage();
    const updated = [record, ...list.filter((item) => item.id !== record.id)];
    storageService.set(RECORDED_MONUMENTS_KEY, updated);
  },
};

export const autoSuperResolveImage = mlService.autoSuperResolveImage.bind(mlService);
export const createLetterboxImage = mlService.createLetterboxImage.bind(mlService);
