import { storageService } from '../../../core/services/storage';
import { MultilingualStory, AdminQuizQuestion, SupportedLanguage, SystemSettings } from '../types';
import { ORDERED_HERITAGE_LIST } from '../../recognition/services/mlService';
import { MONUMENT_LESSONS_DATA } from '../../recognition/data/heritageLessonsAndQuiz';
import { DEFAULT_MONUMENT_STORIES } from '../../recognition/data/defaultMonumentStories';
import { DEFAULT_MONUMENT_STORIES_EN } from '../../recognition/data/defaultMonumentStoriesEn';
import { DEFAULT_MONUMENT_STORIES_ZH } from '../../recognition/data/defaultMonumentStoriesZh';
import { vrTourAdminService } from '../../vr-tour/services/vrTourAdminService';

const ADMIN_STORIES_KEY = 'admin_multilingual_stories';
const ADMIN_STORIES_VERSION_KEY = 'admin_stories_data_version';
const CURRENT_STORIES_VERSION = 'txt_canonical_v9_zh_full_story_audio_narration';
const ADMIN_QUIZZES_KEY = 'admin_custom_quizzes';
const ADMIN_SYSTEM_SETTINGS_KEY = 'admin_system_settings';

// Build complete initial stories from canonical monuments (including Vietnamese, English, and Chinese for all 14 monuments)
export const buildInitialStories = (): MultilingualStory[] => {
  const now = new Date().toISOString();
  const viStories: MultilingualStory[] = ORDERED_HERITAGE_LIST.map((monument) => {
    const defaultStory = DEFAULT_MONUMENT_STORIES[monument.code];
    const lesson = MONUMENT_LESSONS_DATA[monument.code] || {
      summary: `Di tích ${monument.name} là công trình văn hóa lịch sử tiêu biểu của Việt Nam.`,
      historicalValue: `Lưu giữ những giá trị văn hóa, kiến trúc và bài học lịch sử thiêng liêng của dân tộc.`,
      heritageLesson: `Bài học về lòng tự hào dân tộc, ý thức gìn giữ và phát huy giá trị di sản.`,
      keyTakeaways: [
        'Di tích quốc gia có giá trị lịch sử và văn hóa trường tồn.',
        'Minh chứng cho tinh thần quật cường và tinh hoa văn hóa dân tộc.',
        'Trách nhiệm gìn giữ và lan tỏa bài học lịch sử cho các thế hệ.',
      ],
      audioNarrationText: `Di tích ${monument.name} mang giá trị lịch sử vô cùng to lớn đối với non sông đất nước.`,
      era: 'Di sản lịch sử văn hóa',
    };

    const storyTitle = defaultStory?.storyTitle || `Hồ Sơ Di Tích: ${monument.name}`;
    const storyContent = defaultStory?.storyContent || lesson.summary;
    const era = defaultStory?.era || lesson.era;
    const author = defaultStory?.author || 'Tư liệu Lịch sử Di Tích Việt';

    return {
      id: `story_init_${monument.code}`,
      monumentCode: monument.code,
      monumentName: monument.name,
      language: 'vi' as SupportedLanguage,
      title: storyTitle,
      content: storyContent,
      historicalValue: lesson.historicalValue,
      heritageLesson: lesson.heritageLesson,
      keyTakeaways: lesson.keyTakeaways,
      audioNarrationText: lesson.audioNarrationText || storyContent,
      era,
      author,
      createdAt: now,
      updatedAt: now,
    };
  });

  const enStories: MultilingualStory[] = ORDERED_HERITAGE_LIST.map((monument) => {
    const defaultEn = DEFAULT_MONUMENT_STORIES_EN[monument.code];
    return {
      id: `story_init_en_${monument.code}`,
      monumentCode: monument.code,
      monumentName: monument.name,
      language: 'en' as SupportedLanguage,
      title: defaultEn?.storyTitle || `Historical Landmark: ${monument.name}`,
      content: defaultEn?.storyContent || `${monument.name} is a designated national historic landmark of Vietnam.`,
      historicalValue: defaultEn?.historicalValue || 'Preserving priceless architectural, historical, and cultural values.',
      heritageLesson: defaultEn?.heritageLesson || 'A profound lesson in national heritage preservation and cultural appreciation.',
      keyTakeaways: defaultEn?.keyTakeaways || [
        'Recognized national historic and cultural heritage site.',
        'Symbol of cultural resilience and historical legacy.',
        'Commitment to preserving heritage for future generations.',
      ],
      audioNarrationText: defaultEn?.audioNarrationText || defaultEn?.storyContent,
      era: defaultEn?.era || 'Historical Cultural Heritage',
      author: defaultEn?.author || 'Vietnam Heritage Historical Archives',
      createdAt: now,
      updatedAt: now,
    };
  });

  const zhStories: MultilingualStory[] = ORDERED_HERITAGE_LIST.map((monument) => {
    const defaultZh = DEFAULT_MONUMENT_STORIES_ZH[monument.code];
    return {
      id: `story_init_zh_${monument.code}`,
      monumentCode: monument.code,
      monumentName: monument.name,
      language: 'zh' as SupportedLanguage,
      title: defaultZh?.storyTitle || `历史文化名胜：${monument.name}`,
      content: defaultZh?.storyContent || `${monument.name}是越南具有代表性的国家级历史文化遗产名胜。`,
      historicalValue: defaultZh?.historicalValue || '保存无价的历史、建筑与文化遗产价值。',
      heritageLesson: defaultZh?.heritageLesson || '深刻铭记历史传承，珍惜并弘扬民族优秀文化遗产。',
      keyTakeaways: defaultZh?.keyTakeaways || [
        '越南国家级历史文化遗产名胜。',
        '凝聚深厚历史底蕴与杰出建筑艺术结晶。',
        '共同守护并向世人传播传统文化与历史记忆。',
      ],
      audioNarrationText: defaultZh?.audioNarrationText || defaultZh?.storyContent,
      era: defaultZh?.era || '历史文化名胜',
      author: defaultZh?.author || '越南国家历史文化遗产研究文献',
      createdAt: now,
      updatedAt: now,
    };
  });

  return [...viStories, ...enStories, ...zhStories];
};

export const adminService = {
  // Multilingual Stories
  getStories(filters?: { monumentCode?: string; language?: SupportedLanguage }): MultilingualStory[] {
    let stories = storageService.get<MultilingualStory[]>(ADMIN_STORIES_KEY, []);
    const storedVersion = storageService.get<string>(ADMIN_STORIES_VERSION_KEY, '');

    if (!Array.isArray(stories) || stories.length === 0 || storedVersion !== CURRENT_STORIES_VERSION) {
      const defaultInitStories = buildInitialStories();
      // Retain any custom non-initial stories added by admin
      const customUserStories = Array.isArray(stories)
        ? stories.filter((s) => s && s.id && !s.id.startsWith('story_init_'))
        : [];
      stories = [...defaultInitStories, ...customUserStories];
      storageService.set(ADMIN_STORIES_KEY, stories);
      storageService.set(ADMIN_STORIES_VERSION_KEY, CURRENT_STORIES_VERSION);
    }

    // Filter out any corrupted entries without an id
    stories = stories.filter((s) => s && typeof s.id === 'string');

    return stories.filter((s) => {
      if (!s) return false;
      if (filters?.monumentCode && s.monumentCode !== filters.monumentCode) return false;
      if (filters?.language && s.language !== filters.language) return false;
      return true;
    });
  },

  resetToDefaultStories(): MultilingualStory[] {
    const defaultInitStories = buildInitialStories();
    storageService.set(ADMIN_STORIES_KEY, defaultInitStories);
    storageService.set(ADMIN_STORIES_VERSION_KEY, CURRENT_STORIES_VERSION);
    window.dispatchEvent(new CustomEvent('ditich_stories_updated'));
    return defaultInitStories;
  },

  getStoryById(id: string): MultilingualStory | undefined {
    const stories = this.getStories();
    return stories.find((s) => s.id === id);
  },

  saveStory(story: Omit<MultilingualStory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): MultilingualStory {
    const all = this.getStories();
    const now = new Date().toISOString();

    let savedStory: MultilingualStory;

    if (story.id) {
      // Update by ID
      const index = all.findIndex((s) => s.id === story.id);
      if (index >= 0) {
        savedStory = {
          ...all[index],
          ...story,
          updatedAt: now,
        };
        all[index] = savedStory;
      } else {
        savedStory = {
          id: story.id,
          ...story,
          createdAt: now,
          updatedAt: now,
        };
        all.unshift(savedStory);
      }
    } else {
      // Check if a story with same monumentCode and language already exists
      const existingIdx = all.findIndex(
        (s) => s.monumentCode === story.monumentCode && s.language === story.language
      );
      if (existingIdx >= 0) {
        savedStory = {
          ...all[existingIdx],
          ...story,
          updatedAt: now,
        };
        all[existingIdx] = savedStory;
      } else {
        savedStory = {
          id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...story,
          createdAt: now,
          updatedAt: now,
        };
        all.unshift(savedStory);
      }
    }

    storageService.set(ADMIN_STORIES_KEY, all);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_stories_updated', { detail: savedStory }));
    }

    return savedStory;
  },

  deleteStory(id: string): boolean {
    const all = this.getStories();
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length !== all.length) {
      storageService.set(ADMIN_STORIES_KEY, filtered);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ditich_stories_updated', { detail: { deletedId: id } }));
      }
      return true;
    }
    return false;
  },

  // Quizzes
  getQuizzes(filters?: { monumentCode?: string; difficulty?: string }): AdminQuizQuestion[] {
    let quizzes = storageService.get<AdminQuizQuestion[]>(ADMIN_QUIZZES_KEY, []);
    if (!Array.isArray(quizzes)) {
      quizzes = [];
    }
    // Filter out any corrupted entries without an id
    quizzes = quizzes.filter((q) => q && typeof q.id === 'string');

    // Remove any legacy mock sample quizzes from early tests
    if (
      quizzes.some(
        (q) =>
          q?.id?.startsWith('quiz_cbt_') ||
          q?.id?.startsWith('quiz_chl_') ||
          q?.id?.startsWith('quiz_cmc_') ||
          q?.id?.startsWith('quiz_kvc_') ||
          q?.id?.startsWith('quiz_ddcc_') ||
          q?.id?.startsWith('quiz_lang_')
      )
    ) {
      quizzes = quizzes.filter(
        (q) =>
          q?.id &&
          !q.id.startsWith('quiz_cbt_') &&
          !q.id.startsWith('quiz_chl_') &&
          !q.id.startsWith('quiz_cmc_') &&
          !q.id.startsWith('quiz_kvc_') &&
          !q.id.startsWith('quiz_ddcc_') &&
          !q.id.startsWith('quiz_lang_')
      );
      storageService.set(ADMIN_QUIZZES_KEY, quizzes);
    }
    return quizzes.filter((q) => {
      if (!q) return false;
      if (filters?.monumentCode && q.monumentCode !== filters.monumentCode) return false;
      if (filters?.difficulty && q.difficulty !== filters.difficulty) return false;
      return true;
    });
  },

  getQuizById(id: string): AdminQuizQuestion | undefined {
    const quizzes = this.getQuizzes();
    return quizzes.find((q) => q.id === id);
  },

  saveQuiz(quiz: Omit<AdminQuizQuestion, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): AdminQuizQuestion {
    const all = storageService.get<AdminQuizQuestion[]>(ADMIN_QUIZZES_KEY, []);
    const now = new Date().toISOString();

    if (quiz.id) {
      const index = all.findIndex((q) => q.id === quiz.id);
      if (index >= 0) {
        const updated: AdminQuizQuestion = {
          ...all[index],
          ...quiz,
          updatedAt: now,
        };
        all[index] = updated;
        storageService.set(ADMIN_QUIZZES_KEY, all);
        return updated;
      }
    }

    const newQuiz: AdminQuizQuestion = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...quiz,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newQuiz);
    storageService.set(ADMIN_QUIZZES_KEY, all);
    return newQuiz;
  },

  deleteQuiz(id: string): boolean {
    const all = storageService.get<AdminQuizQuestion[]>(ADMIN_QUIZZES_KEY, []);
    const filtered = all.filter((q) => q.id !== id);
    if (filtered.length !== all.length) {
      storageService.set(ADMIN_QUIZZES_KEY, filtered);
      return true;
    }
    return false;
  },

  // Get monument stats summary
  getMonumentStats() {
    const stories = this.getStories();
    const quizzes = this.getQuizzes();

    const allVrSpaces = vrTourAdminService.getEmbeddedSpaces();

    return ORDERED_HERITAGE_LIST.map((monument) => {
      const monumentStories = stories.filter((s) => s.monumentCode === monument.code);
      const monumentQuizzes = quizzes.filter((q) => q.monumentCode === monument.code);
      const vrSpace = allVrSpaces.find((v) => v.monumentCode === monument.code);
      const languages: SupportedLanguage[] = Array.from(new Set(monumentStories.map((s) => s.language)));

      return {
        code: monument.code,
        name: monument.name,
        storiesCount: monumentStories.length,
        quizzesCount: monumentQuizzes.length,
        hasVrTour: Boolean(vrSpace),
        vrType: vrSpace?.embedType || 'panorama_image',
        languages,
      };
    });
  },

  // System Settings: Tùy chỉnh hiển thị độ tin cậy và cấu hình hệ thống
  getSystemSettings(): SystemSettings {
    const defaultSettings: SystemSettings = {
      showConfidence: true, // Mặc định hiển thị độ tin cậy là bật
    };
    const stored = storageService.get<SystemSettings>(ADMIN_SYSTEM_SETTINGS_KEY, defaultSettings);
    if (!stored || typeof stored.showConfidence !== 'boolean') {
      return defaultSettings;
    }
    return stored;
  },

  updateSystemSettings(partial: Partial<SystemSettings>): SystemSettings {
    const current = this.getSystemSettings();
    const updated: SystemSettings = {
      ...current,
      ...partial,
    };
    storageService.set(ADMIN_SYSTEM_SETTINGS_KEY, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ditich_system_settings_updated', { detail: updated }));
      // Sync with server if available
      try {
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(() => {});
      } catch (e) {}
    }
    return updated;
  },

  isShowConfidenceEnabled(): boolean {
    return this.getSystemSettings().showConfidence !== false;
  },
};
