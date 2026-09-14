/**
 * Firebase Service Abstraction
 * 
 * Lưu ý: Ở giai đoạn này, ứng dụng sử dụng mock service và localStorage để xem trước (preview)
 * mà không cần cài đặt hoặc cấu hình biến môi trường API keys.
 */

// TODO: sau này dán config Firebase của bạn
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Placeholder Firebase App & Auth & Firestore
// Sau này khi kết nối Firebase thật, chỉ cần import initializeApp từ 'firebase/app' 
// và getAuth, getFirestore tại đây mà không ảnh hưởng tới UI và cấu trúc ứng dụng.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
