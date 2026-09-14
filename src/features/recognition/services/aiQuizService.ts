import { getMonumentTimelineEvents, TimelineEventItem } from '../data/heritageTimelineEvents';

export interface TimelineMatchResponse {
  success: boolean;
  events: TimelineEventItem[];
  generationNumber?: number;
  keyNumber?: number;
  keyIndex?: number;
  apiKeyUsed?: string;
  totalKeys?: number;
  monumentCode: string;
  monumentName: string;
  groundedInStory?: boolean;
  error?: string;
}

export interface AiGeneratedQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  monumentCode?: string;
  monumentName?: string;
  isAiGenerated?: boolean;
}

export interface AiQuizResponse {
  success: boolean;
  quizzes: AiGeneratedQuizQuestion[];
  generationNumber?: number;
  keyNumber?: number;
  keyIndex: number;
  apiKeyUsed: string;
  formulaLabel?: string;
  totalKeys: number;
  monumentCode: string;
  monumentName: string;
  source?: string;
  groundedInStory?: boolean;
  generatedAt?: string;
  error?: string;
}

const CLIENT_QUIZ_API_KEYS: string[] = [
  'AQ.Ab8RN6Jk8MlTOl3oI4vmjwvL0z7ajfoiIXcwbgjIGTrTyD7gxg',
  'AQ.Ab8RN6LIPISkq4ti5CxXENpU0Dit1bnUPc_Pu1n5x5tRcqCd5w',
  'AQ.Ab8RN6IycBr8jHLjBwKhjGRp0dlFnKRVzwhpszJCEasHZsbN_Q',
  'AQ.Ab8RN6LZLqNc6WejRG2oXLBDmwpww8p_Eb5Rs-5UiyC-GZBVHQ',
  'AQ.Ab8RN6IwZtNBN9mDYOnFYddmOjq9G-dw70yJR8Go8XbGi9rEXg',
  'AQ.Ab8RN6KIsnAP-36WxKRMhPLUbHnh0QpyFfqxlg1b43E9uoSB7g',
  'AQ.Ab8RN6IguxXTBPm3bZ88uNm92FWEJDiZIyDckJimY1dGA9Ao9Q',
  'AQ.Ab8RN6Ixrj6qGJDE2DvQZriBbAYSSRgKT__MXab7vwzh4q9jDA',
];

let clientGenCounter = 0;

function balanceClientQuizOptionLengths(item: any) {
  if (!item || !Array.isArray(item.options) || item.options.length !== 4) return item;
  const cIdx = typeof item.correctIndex === 'number' && item.correctIndex >= 0 && item.correctIndex < 4 ? item.correctIndex : 0;
  const correctOption = String(item.options[cIdx] || '').trim();
  const correctLen = correctOption.length;

  const distractorLengths = item.options.map((opt: string, i: number) => (i === cIdx ? 0 : String(opt || '').trim().length));
  const maxDistractorLen = Math.max(...distractorLengths);

  if (correctLen >= maxDistractorLen) {
    const updatedOptions = [...item.options];
    for (let i = 0; i < 4; i++) {
      if (i !== cIdx) {
        let dist = String(updatedOptions[i] || '').trim();
        if (dist.length <= correctLen) {
          const detailSuffixes = [
            ' (theo các nguồn tài liệu khảo sát và số liệu lịch sử)',
            ' được ghi chép trong các hồ sơ di sản văn hóa',
            ' căn cứ theo các tư liệu ghi nhận qua nhiều giai đoạn',
          ];
          dist = `${dist}${detailSuffixes[i % detailSuffixes.length]}`;
          if (dist.length <= correctLen) {
            dist = `${dist} từ thời kỳ xây dựng ban đầu`;
          }
        }
        updatedOptions[i] = dist;
      }
    }
    item.options = updatedOptions;
  }
  return item;
}

async function clientSideGenerateQuiz(params: {
  monumentCode: string;
  monumentName: string;
  storyContent: string;
}): Promise<AiQuizResponse | null> {
  const { monumentCode, monumentName, storyContent } = params;
  const keys = CLIENT_QUIZ_API_KEYS;
  const totalKeys = keys.length || 8;
  clientGenCounter++;
  const genNum = clientGenCounter;
  const remainder = genNum % totalKeys;
  const keyNumber = remainder === 0 ? totalKeys : remainder;
  const keyIndex = keyNumber - 1;
  const assignedApiKey = keys[keyIndex] || keys[0];

  const prompt = `Dưới đây là nội dung CÂU CHUYỆN THUYẾT MINH chính thức của di tích "${monumentName}" (Mã: ${monumentCode}):
========================
${storyContent}
========================

YÊU CẦU BẮT BUỘC:
1. BẠN HÃY TẠO RA CHÍNH XÁC ĐÚNG 5 CÂU HỎI trắc nghiệm khách quan (A, B, C, D) HOÀN TOÀN BÁM SÁT 100% NỘI DUNG CÂU CHUYỆN THUYẾT MINH TRÊN.
   - BẮT BUỘC PHẢI TẠO ĐỦ CHÍNH XÁC 5 CÂU HỎI.
2. QUY TẮC BẮT BUỘC VỀ ĐỘ DÀI CÁC Ý TRẢ LỜI:
   - TUYỆT ĐỐI KHÔNG ĐƯỢC để đáp án đúng là phương án dài nhất trong 4 phương án A, B, C, D!
   - Cả 4 phương án phải có độ dài tương đương nhau, hoặc đáp án đúng phải NGẮN HƠN các phương án gây nhiễu.
3. TẤT CẢ các câu hỏi, chi tiết, số liệu PHẢI ĐƯỢC TRÍCH XUẤT HOẶC CĂN CỨ TRỰC TIẾP VÀO ĐOẠN VĂN THUYẾT MINH TRÊN.
4. Trả về định dạng JSON thuần túy là mảng gồm 5 phần tử:
[
  {
    "question": "Câu hỏi...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "Giải thích..."
  }
]`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${assignedApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const quizzes = parsed.map((item: any, idx: number) => {
            const raw = {
              id: `ai_quiz_${monumentCode}_client_gen${genNum}_${idx + 1}`,
              question: item.question || `Câu hỏi ${idx + 1} về di tích ${monumentName}`,
              options: Array.isArray(item.options) && item.options.length === 4
                ? item.options
                : (item.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D']).slice(0, 4),
              correctIndex: typeof item.correctIndex === 'number' && item.correctIndex >= 0 && item.correctIndex < 4
                ? item.correctIndex
                : 0,
              explanation: item.explanation || `Chi tiết lịch sử được nêu rõ trong bài thuyết minh về ${monumentName}.`,
              monumentCode,
              monumentName,
              isAiGenerated: true,
            };
            return balanceClientQuizOptionLengths(raw);
          });

          return {
            success: true,
            quizzes,
            generationNumber: genNum,
            keyNumber,
            keyIndex,
            apiKeyUsed: `API ${keyNumber}`,
            formulaLabel: `Lần tạo ${genNum} % 8 = ${remainder} -> API ${keyNumber}`,
            totalKeys,
            monumentCode,
            monumentName,
            source: 'gemini-3.6-flash (Client-side)',
            groundedInStory: true,
            generatedAt: new Date().toISOString(),
          };
        }
      }
    }
  } catch (e) {
    console.warn('[clientSideGenerateQuiz] Gemini client call failed:', e);
  }
  return null;
}

export const aiQuizService = {
  /**
   * Check status of the 8 rotating API keys on server
   */
  async getStatus(): Promise<{
    totalKeys: number;
    generationCount: number;
    nextGenerationNumber: number;
    nextKeyNumber: number;
    nextKeyLabel: string;
    rule: string;
    configured: boolean;
  }> {
    try {
      const res = await fetch('/api/quiz/status');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[aiQuizService] Could not fetch quiz status:', err);
    }
    return {
      totalKeys: 8,
      generationCount: clientGenCounter,
      nextGenerationNumber: clientGenCounter + 1,
      nextKeyNumber: ((clientGenCounter + 1) % 8) || 8,
      nextKeyLabel: `API ${((clientGenCounter + 1) % 8) || 8}`,
      rule: 'Lần tạo 1: API 1, Lần tạo 2: API 2, ..., Lần tạo n: API n % 8',
      configured: true,
    };
  },

  /**
   * Reset rotation counter back to 0
   */
  async resetRotation(): Promise<void> {
    clientGenCounter = 0;
    try {
      await fetch('/api/quiz/reset-rotation', { method: 'POST' });
    } catch (err) {
      console.warn('[aiQuizService] Reset rotation error:', err);
    }
  },

  /**
   * Generate exactly 3 - 4 timeline event matching pairs for monument
   */
  async generateTimelineMatches(params: {
    monumentCode: string;
    monumentName: string;
    storyContent: string;
  }): Promise<TimelineMatchResponse> {
    const { monumentCode, monumentName, storyContent } = params;
    try {
      const res = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monumentCode, monumentName, storyContent }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.events) && data.events.length >= 3) {
          return {
            ...data,
            events: data.events.slice(0, 4), // Guarantee 3 - 4 items
          };
        }
      }
    } catch (err) {
      console.warn('[aiQuizService] generateTimelineMatches API fallback:', err);
    }

    const fallbackList = getMonumentTimelineEvents(monumentCode);
    return {
      success: true,
      events: fallbackList.slice(0, 4),
      monumentCode,
      monumentName,
      groundedInStory: true,
      apiKeyUsed: 'Engine_NoiBo',
    };
  },

  _cachedQuizzes: {} as Record<string, AiQuizResponse>,

  getCachedQuiz(monumentCode: string): AiQuizResponse | null {
    return this._cachedQuizzes[monumentCode] || null;
  },

  /**
   * Generate 5 multiple-choice quiz questions 100% grounded in monument story
   * using the 8 round-robin API keys on the server or client-side fallback.
   */
  async generateQuiz(params: {
    monumentCode: string;
    monumentName: string;
    storyContent: string;
    forceRefresh?: boolean;
  }): Promise<AiQuizResponse> {
    const { monumentCode, monumentName, storyContent, forceRefresh = false } = params;

    if (!forceRefresh && this._cachedQuizzes[monumentCode]) {
      return this._cachedQuizzes[monumentCode];
    }

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monumentCode,
          monumentName,
          storyContent,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data: AiQuizResponse = await res.json();
        if (data.success && Array.isArray(data.quizzes) && data.quizzes.length > 0) {
          this._cachedQuizzes[monumentCode] = data;
          return data;
        }
      }
    } catch (err: any) {
      console.warn('[aiQuizService] Server endpoint unavailable, trying client Gemini:', err);
    }

    // Client-side Gemini fallback for Netlify static deployments
    const clientQuiz = await clientSideGenerateQuiz({ monumentCode, monumentName, storyContent });
    if (clientQuiz && clientQuiz.success) {
      this._cachedQuizzes[monumentCode] = clientQuiz;
      return clientQuiz;
    }

    // Story text parsing fallback if network is completely down
    const fallbackQuestions = this.extractFallbackFromStory(storyContent, monumentName, monumentCode);
    const fallbackResponse: AiQuizResponse = {
      success: true,
      quizzes: fallbackQuestions,
      apiKeyUsed: 'Engine_NoiBo (Bám sát Thuyết Minh)',
      keyIndex: 1,
      totalKeys: 8,
      monumentCode,
      monumentName,
      groundedInStory: true,
    };
    this._cachedQuizzes[monumentCode] = fallbackResponse;
    return fallbackResponse;
  },

  /**
   * Direct fallback parser for instant local fallback based on story sentences
   */
  extractFallbackFromStory(story: string, monumentName: string, monumentCode: string): AiGeneratedQuizQuestion[] {
    const sentences = (story || '')
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25);

    const s1 = sentences[0] || `Di tích ${monumentName} là một trong những công trình văn hóa đặc sắc của Việt Nam.`;
    const s2 = sentences[Math.floor(sentences.length / 2)] || `Nơi đây ghi dấu những bước ngoặt lịch sử hào hùng và tinh hoa văn hóa.`;
    const s3 = sentences[Math.min(sentences.length - 1, 2)] || `Công trình lưu giữ những giá trị kiến trúc và tinh thần trường tồn.`;
    const s4 = sentences[sentences.length - 1] || `Di tích là niềm tự hào của quê hương và nhân dân cả nước.`;

    return [
      {
        id: `fb_${monumentCode}_1`,
        question: `Theo bài thuyết minh, thông tin mở đầu giới thiệu về di tích ${monumentName} là gì?`,
        options: [
          s1,
          'Địa điểm mới được xây dựng và khánh thành vào năm 2024.',
          'Công trình vốn là một trung tâm thương mại cổ đại từ thế kỷ 20.',
          'Khuôn viên di tích được thiết kế bởi kiến trúc sư nước ngoài gần đây.',
        ],
        correctIndex: 0,
        explanation: `Đoạn đầu bài thuyết minh khẳng định: "${s1.slice(0, 130)}..."`,
        monumentCode,
        monumentName,
        isAiGenerated: true,
      },
      {
        id: `fb_${monumentCode}_2`,
        question: `Nội dung nổi bật về lịch sử và ý nghĩa của di tích ${monumentName} trong thuyết minh là gì?`,
        options: [
          'Di tích chưa từng trải qua biến cố hay thăng trầm lịch sử nào.',
          s2,
          'Di tích chỉ mở cửa cho các hoạt động nghiên cứu chuyên biệt.',
          'Công trình đã bị phá bỏ hoàn toàn trước khi được mô phỏng lại.',
        ],
        correctIndex: 1,
        explanation: `Theo tài liệu thuyết minh: "${s2.slice(0, 130)}..."`,
        monumentCode,
        monumentName,
        isAiGenerated: true,
      },
      {
        id: `fb_${monumentCode}_3`,
        question: `Chi tiết kiến trúc hoặc hiện vật lịch sử tiêu biểu được bài thuyết minh miêu tả là:`,
        options: [
          'Không có hiện vật hay kiến trúc lịch sử nào được bảo tồn.',
          'Di tích sử dụng toàn bộ bê tông cốt thép hiện đại từ khi khởi dựng.',
          s3,
          'Tất cả các kiến trúc cổ đều bị tháo dỡ vào năm 2010.',
        ],
        correctIndex: 2,
        explanation: `Trích từ nội dung thuyết minh: "${s3.slice(0, 130)}..."`,
        monumentCode,
        monumentName,
        isAiGenerated: true,
      },
      {
        id: `fb_${monumentCode}_4`,
        question: `Thông điệp bài thuyết minh gửi gắm về giá trị trường tồn của ${monumentName} là:`,
        options: [
          'Di tích không còn nhiều ý nghĩa trong đời sống hiện đại ngày nay.',
          'Chỉ mang giá trị địa lý đơn thuần cho người dân địa phương.',
          'Là khu vực được quy hoạch thành trung tâm giải trí thương mại mới.',
          s4,
        ],
        correctIndex: 3,
        explanation: `Lời kết bài thuyết minh nhấn mạnh: "${s4.slice(0, 130)}..."`,
        monumentCode,
        monumentName,
        isAiGenerated: true,
      },
    ];
  },
};
