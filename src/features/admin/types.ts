export type SupportedLanguage = 'vi' | 'en' | 'fr' | 'ja' | 'ko' | 'zh';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English (Tiếng Anh)', flag: '🇬🇧' },
  { code: 'fr', label: 'Français (Tiếng Pháp)', flag: '🇫🇷' },
  { code: 'ja', label: '日本語 (Tiếng Nhật)', flag: '🇯🇵' },
  { code: 'ko', label: '한국어 (Tiếng Hàn)', flag: '🇰🇷' },
  { code: 'zh', label: '中文 (Tiếng Trung)', flag: '🇨🇳' },
];

export interface MultilingualStory {
  id: string;
  monumentCode: string; // e.g. 'BNR', 'CBT', 'CMC', etc.
  monumentName: string;
  language: SupportedLanguage;
  title: string;
  content: string; // Khái quát di tích & nội dung câu chuyện
  historicalValue?: string; // Giá trị lịch sử & kiến trúc
  heritageLesson?: string; // Bài học lịch sử cho thế hệ trẻ
  keyTakeaways?: string[]; // 3 điểm cốt lõi ghi nhớ
  audioNarrationText?: string;
  era?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminQuizQuestion {
  id: string;
  monumentCode: string;
  monumentName: string;
  question: string;
  options: string[]; // 4 options
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  showConfidence: boolean; // Mặc định hiển thị độ tin cậy là bật (true)
}
