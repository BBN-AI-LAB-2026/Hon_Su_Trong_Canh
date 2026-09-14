import { storageService } from '../../../core/services/storage';
import { SAMPLE_MONUMENTS } from '../constants/sampleMonuments';
import { MonumentDetailed, RecognitionResult } from '../types';

const DISCOVERED_MONUMENTS_KEY = 'collection_discovered_ids';
const RECOGNITION_HISTORY_KEY = 'recognition_history_logs';

export const recognitionService = {
  getAllMonuments(): MonumentDetailed[] {
    return SAMPLE_MONUMENTS;
  },

  getMonumentById(id: string): MonumentDetailed | undefined {
    return SAMPLE_MONUMENTS.find((m) => m.id === id);
  },

  async recognizeImage(imageSource: string, monumentHintId?: string): Promise<RecognitionResult> {
    // Simulate image analysis AI processing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    let matched: MonumentDetailed;

    if (monumentHintId) {
      matched = SAMPLE_MONUMENTS.find((m) => m.id === monumentHintId) || SAMPLE_MONUMENTS[0];
    } else {
      // Pick a match based on simple hash of string or default to first
      const index = Math.abs(imageSource.length) % SAMPLE_MONUMENTS.length;
      matched = SAMPLE_MONUMENTS[index];
    }

    // Auto-save discovered monument to user's personal collection
    const currentDiscovered = storageService.get<string[]>(DISCOVERED_MONUMENTS_KEY, [
      'van-mieu-quoc-tu-giam',
      'co-do-hue-ngo-mon',
    ]);

    if (!currentDiscovered.includes(matched.id)) {
      const updated = [...currentDiscovered, matched.id];
      storageService.set(DISCOVERED_MONUMENTS_KEY, updated);
    }

    const result: RecognitionResult = {
      monument: matched,
      confidenceScore: Math.floor(94 + Math.random() * 5), // 94% - 99%
      detectedFeatures: [
        'Kiến trúc mái ngói âm dương cổ truyền',
        'Hoa văn điêu khắc rồng phượng thời phong kiến',
        'Vật liệu gạch nung và đá thanh nguyên khối',
        'Bố cục cảnh quan di sản đặc trưng Việt Nam',
      ],
      recognizedAt: new Date().toISOString(),
    };

    // Save recognition log
    const history = storageService.get<Array<{ monumentId: string; date: string }>>(
      RECOGNITION_HISTORY_KEY,
      []
    );
    storageService.set(RECOGNITION_HISTORY_KEY, [
      { monumentId: matched.id, date: result.recognizedAt },
      ...history.slice(0, 20),
    ]);

    return result;
  },
};
