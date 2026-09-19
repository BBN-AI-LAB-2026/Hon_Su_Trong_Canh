/**
 * Danh sách API Key Gemini luân phiên
 * Phục vụ sinh câu hỏi AI Quiz và nhận diện ảnh Vision AI (Client-side & Netlify/Vercel)
 *
 * LƯU Ý BẢO MẬT: Không lưu trực tiếp API Key vào mã nguồn khi đẩy lên GitHub.
 * Hãy cấu hình API Key qua biến môi trường:
 * - VITE_GEMINI_API_KEY trong file .env hoặc cấu hình hosting (Netlify/Vercel/Render)
 * - GEMINI_API_KEY trong file .env.local hoặc file API_Key_List.txt (đã được thêm vào .gitignore)
 */
export const GEMINI_API_KEYS_100: string[] = [];

export function getClientGeminiApiKeys(): string[] {
  const envViteKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const envKey = (import.meta.env.GEMINI_API_KEY || '').trim();
  const keys: string[] = [];
  if (envViteKey) keys.push(envViteKey);
  if (envKey && !keys.includes(envKey)) keys.push(envKey);
  for (const k of GEMINI_API_KEYS_100) {
    if (k && !keys.includes(k)) keys.push(k);
  }
  return keys;
}
