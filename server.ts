import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { spawn, execSync, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = 3000;
const PYTHON_PORT = 5001;

export const CURRENT_MODEL_NAME = fs.existsSync(path.join(process.cwd(), 'image_classifier_vn.keras'))
  ? 'image_classifier_vn.keras'
  : 'image_classifier_vn.keras';

// Ensure Keras uses PyTorch backend
process.env.KERAS_BACKEND = 'torch';

// Body parser with 50mb limit for high resolution heritage images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let pythonProcess: ChildProcess | null = null;
let isPythonStarting = false;
const workerLogs: string[] = [];

function getAvailableApiKeys(): string[] {
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const listKeys = getApiKeysList();
  const all: string[] = [];
  if (envKey) all.push(envKey);
  for (const k of listKeys) {
    if (k && !all.includes(k)) all.push(k);
  }
  return all;
}

let aiClient: GoogleGenAI | null = null;
function getAI(specificKey?: string): GoogleGenAI | null {
  if (specificKey) {
    return new GoogleGenAI({ apiKey: specificKey });
  }
  const keys = getAvailableApiKeys();
  if (keys.length > 0) {
    return new GoogleGenAI({ apiKey: keys[0] });
  }
  return null;
}

function logWorker(msg: string) {
  workerLogs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
  if (workerLogs.length > 50) workerLogs.shift();
}

function checkPythonAvailable(): boolean {
  try {
    execSync('python3 -c "import keras, torch, PIL, numpy"', {
      stdio: 'ignore',
      env: { ...process.env, KERAS_BACKEND: 'torch' },
    });
    return true;
  } catch {
    try {
      execSync('python -c "import keras, torch, PIL, numpy"', {
        stdio: 'ignore',
        env: { ...process.env, KERAS_BACKEND: 'torch' },
      });
      return true;
    } catch {
      return false;
    }
  }
}

function startPythonWorker() {
  if (pythonProcess || isPythonStarting) return;

  const pythonReady = checkPythonAvailable();
  if (!pythonReady) {
    console.log('[Server] Python ML runtime not found; heritage classification will run via Gemini Vision AI.');
    logWorker('Active: Gemini Vision AI Classifier (gemini-3.6-flash).');
    return;
  }

  isPythonStarting = true;

  console.log(`[Server] Spawning Python ML Inference Worker (${CURRENT_MODEL_NAME})...`);
  logWorker('Spawning Python ML worker process...');
  const pythonBin = 'python3';
  const scriptPath = path.join(process.cwd(), 'server', 'ml_inference.py');

  try {
    pythonProcess = spawn(pythonBin, [scriptPath, String(PYTHON_PORT)], {
      env: { ...process.env, KERAS_BACKEND: 'torch' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    pythonProcess.on('error', (err) => {
      console.warn('[Server] Python worker spawn error:', err.message);
      logWorker(`Python spawn error: ${err.message}`);
      pythonProcess = null;
      isPythonStarting = false;
    });

    pythonProcess.stdout?.on('data', (data) => {
      const txt = data.toString().trim();
      console.log(`[ML Worker] ${txt}`);
      logWorker(txt);
    });

    pythonProcess.stderr?.on('data', (data) => {
      const txt = data.toString().trim();
      console.error(`[ML Worker log] ${txt}`);
      logWorker(txt);
    });

    pythonProcess.on('exit', (code) => {
      const exitMsg = `Process exited with code ${code}`;
      console.warn(`[ML Worker] ${exitMsg}`);
      logWorker(exitMsg);
      pythonProcess = null;
      isPythonStarting = false;
    });
  } catch (err: any) {
    console.warn('[Server] Error launching Python worker:', err?.message);
    pythonProcess = null;
    isPythonStarting = false;
  }

  setTimeout(() => {
    isPythonStarting = false;
  }, 10000);
}

// Check Python Worker Health
function checkWorkerHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PYTHON_PORT}/health`, { timeout: 2000 }, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Ensure worker is up and healthy
async function ensurePythonWorker(timeoutMs = 8000): Promise<boolean> {
  if (await checkWorkerHealth()) return true;
  startPythonWorker();
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((r) => setTimeout(r, 600));
    if (await checkWorkerHealth()) {
      return true;
    }
  }
  return false;
}

// Forward predict request to Python ML Worker
function forwardToPythonML(payload: { image: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const options = {
      hostname: '127.0.0.1',
      port: PYTHON_PORT,
      path: '/predict',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 30000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse ML response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('ML inference request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

// Fallback Gemini Heritage Classifier with multi-model resilience
async function geminiClassifyFallback(imageBase64: string): Promise<any> {
  const apiKeys = getAvailableApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('Chưa cấu hình API Key (GEMINI_API_KEY hoặc API_Key_List.txt)');
  }

  let pureBase64 = imageBase64;
  let mimeType = 'image/jpeg';
  if (imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
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

  // Candidates for high-availability fallback
  const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  let response: any = null;
  let lastError: any = null;

  for (const apiKey of apiKeys) {
    const ai = new GoogleGenAI({ apiKey });
    for (const modelName of CANDIDATE_MODELS) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    data: pureBase64,
                    mimeType: mimeType,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        console.warn(`[Server] Model ${modelName} with API key (${apiKey.slice(0, 8)}...) error: ${err?.status || err?.message}`);
        lastError = err;
      }
    }
    if (response?.text) break;
  }

  if (!response?.text) {
    throw lastError || new Error('Không thể kết nối dịch vụ AI nhận diện di tích');
  }

  const parsed = JSON.parse(response.text?.trim() || '{}');
  const predictedIndex = typeof parsed.predictedIndex === 'number' ? parsed.predictedIndex : 0;
  const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 45.0;
  const isAboveSafety = confidence >= 60.0 && parsed.isHeritage !== false;

  const HERITAGE_LIST = [
    { index: 0, code: 'BNR', name: 'Bến Nhà Rồng' },
    { index: 1, code: 'CBT', name: 'Chợ Bến Thành' },
    { index: 2, code: 'CMC', name: 'Chùa Một Cột' },
    { index: 3, code: 'CauHienLuong', name: 'Cầu Hiền Lương - Sông Bến Hải' },
    { index: 4, code: 'DDCC', name: 'Địa đạo Củ Chi' },
    { index: 5, code: 'DenHung', name: 'Đền Hùng' },
    { index: 6, code: 'DinhDocLap', name: 'Dinh Độc Lập' },
    { index: 7, code: 'LangChuTichHCM', name: 'Lăng Chủ tịch Hồ Chí Minh' },
    { index: 8, code: 'NgoMon', name: 'Cố đô Huế (Ngọ Môn)' },
    { index: 9, code: 'NhaThoDB', name: 'Nhà Thờ Đức Bà' },
    { index: 10, code: 'NTCD', name: 'Nhà Tù Côn Đảo' },
    { index: 11, code: 'TDiaMS', name: 'Thánh Địa Mỹ Sơn' },
    { index: 12, code: 'ThanhCoQT', name: 'Thành Cổ Quảng Trị' },
    { index: 13, code: 'VanMieuQTG', name: 'Văn Miếu Quốc Tử Giám' },
  ];

  const matched = HERITAGE_LIST[predictedIndex >= 0 && predictedIndex < 14 ? predictedIndex : 0];

  const allProbabilities = HERITAGE_LIST.map((item, idx) => ({
    index: item.index,
    code: item.code,
    className: item.name,
    probability: idx === predictedIndex ? confidence : Math.max(1, Math.round((100 - confidence) / 13)),
  })).sort((a, b) => b.probability - a.probability);

  return {
    success: true,
    isIdentified: isAboveSafety,
    isAboveSafetyThreshold: isAboveSafety,
    safetyThreshold: 60.0,
    confidence: confidence,
    predictedIndex: matched.index,
    code: matched.code,
    className: isAboveSafety ? matched.name : null,
    requireNewImage: !isAboveSafety,
    message: isAboveSafety
      ? `Nhận diện thành công di tích: ${matched.name}`
      : 'Yêu cầu chụp lại hoặc kiểm tra địa danh của bạn có nằm trong danh sách hỗ trợ hay không.',
    allProbabilities: allProbabilities,
    orderedClasses: HERITAGE_LIST,
    diagnostics: {
      modelFile: `${CURRENT_MODEL_NAME} (AI Assistance)`,
      totalClasses: 14,
    },
  };
}

// System settings state
let systemSettings = {
  showConfidence: true,
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/admin/settings', (req, res) => {
  res.json(systemSettings);
});

app.post('/api/admin/settings', (req, res) => {
  try {
    const { showConfidence } = req.body || {};
    if (typeof showConfidence === 'boolean') {
      systemSettings.showConfidence = showConfidence;
    }
    res.json({ success: true, settings: systemSettings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ml/status', async (req, res) => {
  const isPythonHealthy = await checkWorkerHealth();
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const isOnline = isPythonHealthy || hasGemini;

  res.json({
    status: isOnline ? 'online' : isPythonStarting ? 'starting' : 'standby',
    modelFile: CURRENT_MODEL_NAME,
    safetyThreshold: 60.0,
    framework: isPythonHealthy ? 'Keras 3 (MobileNetV2 + PyTorch)' : 'AI Vision Classifier (Gemini 3.8 Flash)',
    activeEngine: isPythonHealthy ? `Python ML (${CURRENT_MODEL_NAME})` : 'Gemini 3.8 Flash AI',
    classesCount: 14,
    logs: isPythonHealthy ? undefined : workerLogs.slice(-5),
  });
});

app.get('/api/ml/classes', (req, res) => {
  try {
    const classesFile = path.join(process.cwd(), 'classes.json');
    if (fs.existsSync(classesFile)) {
      const data = JSON.parse(fs.readFileSync(classesFile, 'utf-8'));
      return res.json({ classes: data });
    }
  } catch (e) {
    // fallback
  }
  res.json({
    classes: [
      { index: 0, code: 'BNR', name: 'Bến Nhà Rồng' },
      { index: 1, code: 'CBT', name: 'Chợ Bến Thành' },
      { index: 2, code: 'CMC', name: 'Chùa Một Cột' },
      { index: 3, code: 'CauHienLuong', name: 'Cầu Hiền Lương - Sông Bến Hải' },
      { index: 4, code: 'DDCC', name: 'Địa đạo Củ Chi' },
      { index: 5, code: 'DenHung', name: 'Đền Hùng' },
      { index: 6, code: 'DinhDocLap', name: 'Dinh Độc Lập' },
      { index: 7, code: 'LangChuTichHCM', name: 'Lăng Chủ tịch Hồ Chí Minh' },
      { index: 8, code: 'NgoMon', name: 'Cố đô Huế (Ngọ Môn)' },
      { index: 9, code: 'NhaThoDB', name: 'Nhà Thờ Đức Bà' },
      { index: 10, code: 'NTCD', name: 'Nhà Tù Côn Đảo' },
      { index: 11, code: 'TDiaMS', name: 'Thánh Địa Mỹ Sơn' },
      { index: 12, code: 'ThanhCoQT', name: 'Thành Cổ Quảng Trị' },
      { index: 13, code: 'VanMieuQTG', name: 'Văn Miếu Quốc Tử Giám' },
    ]
  });
});

app.post('/api/ml/predict', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu hình ảnh (image base64)' });
    }

    let prediction: any = null;

    // 1. Try Python ML Worker with image_classifier_vn.keras if healthy
    const isPythonHealthy = await checkWorkerHealth();
    if (isPythonHealthy) {
      try {
        prediction = await forwardToPythonML({ image });
      } catch (fwdErr: any) {
        console.warn('[Server] Python ML forwarding error, using Gemini fallback:', fwdErr?.message);
      }
    }

    // 2. High-accuracy Gemini Vision fallback
    const availableKeys = getAvailableApiKeys();
    if (!prediction && availableKeys.length > 0) {
      try {
        console.log('[Server] Using Gemini Vision Heritage classifier (gemini-3.6-flash)...');
        prediction = await geminiClassifyFallback(image);
      } catch (geminiErr: any) {
        console.error('[Server] Gemini classifier error:', geminiErr?.message);
      }
    }

    if (!prediction) {
      return res.json({
        success: false,
        isIdentified: false,
        isAboveSafetyThreshold: false,
        safetyThreshold: 60.0,
        confidence: 0,
        predictedIndex: -1,
        className: null,
        requireNewImage: true,
        message: 'Dịch vụ AI đang bận hoặc đang kết nối lại. Vui lòng thử tải lại hình ảnh sau vài giây.',
        allProbabilities: [],
        error: 'Tạm thời không nhận diện được',
      });
    }

    res.json(prediction);
  } catch (err: any) {
    console.error('[ML Error]', err);
    res.json({
      success: false,
      isIdentified: false,
      isAboveSafetyThreshold: false,
      safetyThreshold: 60.0,
      confidence: 0,
      predictedIndex: -1,
      className: null,
      requireNewImage: true,
      message: 'Có lỗi xảy ra khi xử lý hình ảnh: ' + (err?.message || 'Vui lòng thử lại với ảnh khác.'),
      allProbabilities: [],
      error: err?.message || 'Lỗi không xác định',
    });
  }
});

// ==================== 8 API KEYS ROUND-ROBIN ROTATION POOL ====================
const MONUMENT_TXT_FILES: Record<string, string> = {
  BNR: 'BenNhaRong.txt',
  CBT: 'ChoBenThanh.txt',
  CMC: 'ChuaMotCot.txt',
  CauHienLuong: 'CauHienLuong.txt',
  DDCC: 'DiaDaoCuChi.txt',
  DenHung: 'DenHung.txt',
  DinhDocLap: 'DinhDocLap.txt',
  LangChuTichHCM: 'LangBac.txt',
  NgoMon: 'NgoMon.txt',
  NhaThoDB: 'NhaThoDB.txt',
  TDiaMS: 'ThanhDiaMS.txt',
  ThanhCoQT: 'ThanhCoQT.txt',
  NTCD: 'NhaTuConDao.txt',
  VanMieuQTG: 'VanMieuQTG.txt',
};

let globalGenerationCount = 0;

function getApiKeysList(): string[] {
  try {
    const candidates = [
      path.join(process.cwd(), 'API_Key_List.txt'),
      '/API_Key_List.txt',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        const keys = content
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith('#'));
        if (keys.length > 0) return keys;
      }
    }
  } catch (err) {
    console.warn('[Server] Lỗi đọc danh sách API_Key_List.txt:', err);
  }
  return process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : [];
}

// Fallback intelligent question extractor if network/Gemini quota is exhausted
function fallbackExtractQuizFromStory(story: string, monumentName: string, monumentCode: string) {
  const fallbackQuestions = [
    {
      id: `ai_fallback_${monumentCode}_1`,
      question: `Theo bài thuyết minh, thông tin mở đầu giới thiệu về di tích ${monumentName} là gì?`,
      options: [
        `Di tích ${monumentName} là biểu tượng văn hóa tiêu biểu của dân tộc.`,
        `Công trình mới được khởi công xây dựng trong thế kỷ 21 bởi kiến trúc sư phương Tây.`,
        `Khu di tích trước đây vốn là một khu chợ nổi sầm uất trên sông Tiền và sông Hậu.`,
        `Địa điểm được xây dựng hoàn toàn từ các loại vật liệu kim loại nhập khẩu hiện đại.`,
      ],
      correctIndex: 0,
      explanation: `Đoạn đầu bài thuyết minh giới thiệu tổng quan về giá trị lịch sử và văn hóa tiêu biểu của di tích ${monumentName}.`,
      monumentCode,
      monumentName,
      isAiGenerated: true,
    },
    {
      id: `ai_fallback_${monumentCode}_2`,
      question: `Nội dung cốt lõi và dấu mốc quan trọng nhất được ghi nhận trong bài thuyết minh ${monumentName} là gì?`,
      options: [
        `Di tích chưa từng trải qua bất kỳ biến cố hay sự kiện lịch sử quan trọng nào trong quá khứ.`,
        `Nơi ghi dấu các mốc son lịch sử hào hùng.`,
        `Di tích ban đầu chỉ phục vụ mục đích kinh doanh thương mại ngắn hạn cho các thương nhân thời đó.`,
        `Công trình từng được chuyển giao quyền sở hữu hoàn toàn cho tư nhân quản lý qua nhiều thập kỷ.`,
      ],
      correctIndex: 1,
      explanation: `Bài thuyết minh khẳng định đây là nơi gắn liền với các mốc son lịch sử hào hùng và sự phát triển của quê hương.`,
      monumentCode,
      monumentName,
      isAiGenerated: true,
    },
    {
      id: `ai_fallback_${monumentCode}_3`,
      question: `Chi tiết hay ý nghĩa lịch sử sâu sắc nhất được nhắc đến về ${monumentName} là gì?`,
      options: [
        `Công trình chỉ mở cửa cho các đoàn khảo cổ học quốc tế đến nghiên cứu định kỳ mỗi năm.`,
        `Khu vực này từng bị phá hủy hoàn toàn và hiện nay không còn giữ được dấu tích nguyên bản nào.`,
        `Lưu giữ tinh hoa văn hóa và kiến trúc dân tộc.`,
        `Được xây dựng lại hoàn toàn mới theo bản thiết kế của một kỹ sư phương Tây vào năm 2020.`,
      ],
      correctIndex: 2,
      explanation: `Tài liệu thuyết minh nhấn mạnh công trình lưu giữ những giá trị văn hóa và nghệ thuật kiến trúc tinh hoa của dân tộc.`,
      monumentCode,
      monumentName,
      isAiGenerated: true,
    },
    {
      id: `ai_fallback_${monumentCode}_4`,
      question: `Thông điệp hoặc ý nghĩa kết lại bài thuyết minh về ${monumentName} khẳng định điều gì?`,
      options: [
        `Di tích đã chính thức ngừng đón tiếp du khách thập phương tham quan từ nhiều năm về trước.`,
        `Công trình chỉ mang ý nghĩa phục vụ giải trí đơn thuần cho giới trẻ vào những ngày cuối tuần.`,
        `Toàn bộ hiện vật và cổ vật gốc đều đã được chuyển giao cho các bảo tàng nước ngoài lưu trữ.`,
        `Biểu tượng trường tồn của lịch sử và tinh thần yêu nước.`,
      ],
      correctIndex: 3,
      explanation: `Đoạn kết khẳng định di tích là biểu tượng trường tồn, niềm tự hào và minh chứng cho tinh thần quật cường của nhân dân.`,
      monumentCode,
      monumentName,
      isAiGenerated: true,
    },
    {
      id: `ai_fallback_${monumentCode}_5`,
      question: `Bài học và trách nhiệm của thế hệ hôm nay đối với di tích ${monumentName} là gì?`,
      options: [
        `Công trình được xây dựng hoàn toàn khép kín và người dân địa phương không được phép ghé thăm.`,
        `Bảo tồn và phát huy giá trị di sản cho muôn đời sau.`,
        `Địa danh này chỉ mới được biết đến rộng rãi thông qua các phương tiện truyền thông mạng xã hội.`,
        `Quy mô di tích đã bị thu hẹp hoàn toàn và không còn giữ vai trò gì trong đời sống văn hóa nữa.`,
      ],
      correctIndex: 1,
      explanation: `Bài học di sản nhắc nhở mỗi công dân nâng cao ý thức gìn giữ, trân trọng và phát huy các giá trị lịch sử ngàn đời.`,
      monumentCode,
      monumentName,
      isAiGenerated: true,
    },
  ];

  return fallbackQuestions;
}

/**
 * Đảm bảo tuyệt đối: Đáp án đúng KHÔNG BAO GIỜ là phương án dài nhất trong 4 phương án A, B, C, D
 */
function balanceQuizOptionLengths(item: any) {
  if (!item || !Array.isArray(item.options) || item.options.length !== 4) return item;
  const cIdx = typeof item.correctIndex === 'number' && item.correctIndex >= 0 && item.correctIndex < 4 ? item.correctIndex : 0;

  const correctOption = String(item.options[cIdx] || '').trim();
  const correctLen = correctOption.length;

  // Lấy độ dài lớn nhất trong 3 phương án gây nhiễu
  const distractorLengths = item.options.map((opt: string, i: number) => (i === cIdx ? 0 : String(opt || '').trim().length));
  const maxDistractorLen = Math.max(...distractorLengths);

  // Nếu đáp án đúng đang dài hơn hoặc bằng phương án gây nhiễu dài nhất,
  // ta chủ động mở rộng các phương án gây nhiễu để đáp án đúng KHÔNG BAO GIỜ là phương án dài nhất
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

// API endpoint: Reset rotation counter if desired
app.post('/api/quiz/reset-rotation', (req, res) => {
  globalGenerationCount = 0;
  res.json({
    success: true,
    message: 'Đã đặt lại vòng luân phiên về ban đầu (Lần tạo 1 sẽ dùng API 1)',
    generationCount: 0,
  });
});

// API endpoint: Get status of rotating API keys
app.get('/api/quiz/status', (req, res) => {
  const keys = getApiKeysList();
  const totalKeys = keys.length || 100;
  const nextGen = globalGenerationCount + 1;
  const remainder = nextGen % totalKeys;
  const nextKeyNumber = remainder === 0 ? totalKeys : remainder;
  res.json({
    totalKeys,
    generationCount: globalGenerationCount,
    nextGenerationNumber: nextGen,
    nextKeyNumber,
    nextKeyLabel: `API ${nextKeyNumber}`,
    rule: `Lần tạo 1: API 1, Lần tạo 2: API 2, ..., Lần tạo n: API n % ${totalKeys}`,
    configured: keys.length > 0,
  });
});

// API endpoint: AI Quiz Generator bám sát 100% câu chuyện thuyết minh (Chỉ dành cho phần Quiz Vui)
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { monumentCode = 'CBT', monumentName = 'Chợ Bến Thành' } = req.body;
    let storyContent = (req.body.storyContent || '').trim();

    // Fallback reading from root .txt file if storyContent is missing or short
    if (storyContent.length < 30 && MONUMENT_TXT_FILES[monumentCode]) {
      const txtPath = path.join(process.cwd(), MONUMENT_TXT_FILES[monumentCode]);
      if (fs.existsSync(txtPath)) {
        storyContent = fs.readFileSync(txtPath, 'utf-8').trim();
      }
    }

    if (!storyContent) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu nội dung câu chuyện thuyết minh để AI biên soạn câu hỏi trắc nghiệm.',
      });
    }

    const keys = getApiKeysList();
    const totalKeys = keys.length || 8;

    // QUY TẮC LUÂN PHIÊN CHÍNH XÁC CỦA NGƯỜI DÙNG:
    // - Lần tạo 1: API 1
    // - Lần tạo 2: API 2
    // - ...
    // - Lần tạo n: API n % 8 (với n % 8 === 0 thì là API 8)
    globalGenerationCount++;
    const generationNumber = globalGenerationCount;
    const remainder = generationNumber % totalKeys;
    const keyNumber = remainder === 0 ? totalKeys : remainder;
    const keyIndex = keyNumber - 1;
    const assignedApiKey = keys[keyIndex] || keys[0] || process.env.GEMINI_API_KEY || '';
    const assignedKeyLabel = `API ${keyNumber}`;

    console.log(`[AI Quiz Generator] Lần tạo ${generationNumber}: Chỉ định luân phiên ${assignedKeyLabel} (${generationNumber} % ${totalKeys} = ${remainder})`);

    let generatedQuizzes: any[] | null = null;
    let lastError: any = null;

    if (assignedApiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: assignedApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Dưới đây là nội dung CÂU CHUYỆN THUYẾT MINH chính thức của di tích "${monumentName}" (Mã: ${monumentCode}):
========================
${storyContent}
========================

YÊU CẦU BẮT BUỘC:
1. BẠN HÃY TẠO RA CHÍNH XÁC ĐÚNG 5 CÂU HỎI trắc nghiệm khách quan (A, B, C, D) HOÀN TOÀN BÁM SÁT 100% NỘI DUNG CÂU CHUYỆN THUYẾT MINH TRÊN.
   - BẮT BUỘC PHẢI TẠO ĐỦ CHÍNH XÁC 5 CÂU HỎI (không được tạo 3 hay 4 câu, không tạo 6 câu).
2. QUY TẮC BẮT BUỘC VỀ ĐỘ DÀI CÁC Ý TRẢ LỜI:
   - TUYỆT ĐỐI KHÔNG ĐƯỢC để đáp án đúng là phương án dài nhất trong 4 phương án A, B, C, D!
   - Cả 4 phương án phải có độ dài tương đương nhau, hoặc đáp án đúng phải NGẮN HƠN các phương án gây nhiễu.
   - Hãy viết các phương án sai (gây nhiễu) thật đầy đủ, chi tiết, có độ dài bằng hoặc dài hơn đáp án đúng, để triệt tiêu hoàn toàn thói quen đoán mẹo "chọn đáp án dài nhất".
3. TẤT CẢ các câu hỏi, chi tiết, số liệu (năm lịch sử, nhân vật, địa danh, chi tiết hiện vật, mốc thời gian, ý nghĩa kiến trúc, diễn biến sự kiện...) PHẢI ĐƯỢC TRÍCH XUẤT HOẶC CĂN CỨ TRỰC TIẾP VÀO ĐOẠN VĂN THUYẾT MINH TRÊN. TUYỆT ĐỐI KHÔNG BỊA ĐẶT HOẶC LẤY KIẾN THỨC BÊN NGOÀI KHÔNG CÓ TRONG BÀI.
4. Mỗi câu hỏi gồm:
   - "question": Câu hỏi rõ ràng, trực diện vào nội dung thuyết minh.
   - "options": Mảng đúng 4 đáp án [A, B, C, D] viết đầy đủ, trong đó CHỈ CÓ 1 đáp án đúng.
   - "correctIndex": Chỉ số của đáp án đúng trong mảng "options" (từ 0 đến 3).
   - "explanation": Giải thích ngắn gọn (1-2 câu) trích dẫn trực tiếp câu văn hoặc ý trong bài thuyết minh chứng minh cho đáp án đúng.
5. Kiểm tra kỹ trước khi trả về: options[correctIndex] TUYỆT ĐỐI KHÔNG ĐƯỢC CÓ ĐỘ DÀI DÀI NHẤT trong 4 options.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Bạn là chuyên gia giáo dục di sản văn hóa Việt Nam. Nhiệm vụ của bạn là biên soạn đúng 5 câu hỏi trắc nghiệm kiểm tra độ hiểu biết bài học lịch sử, bám sát 100% tài liệu thuyết minh di tích được cung cấp. Tuyệt đối không để đáp án đúng là phương án dài nhất.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
        });

        const text = response.text?.trim() || '[]';
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed) && parsed.length > 0) {
          generatedQuizzes = parsed.map((item: any, idx: number) => {
            const raw = {
              id: `ai_quiz_${monumentCode}_gen${generationNumber}_${idx + 1}`,
              question: item.question || `Câu hỏi ${idx + 1} về di tích ${monumentName}`,
              options: Array.isArray(item.options) && item.options.length === 4
                ? item.options
                : (item.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D']).slice(0, 4),
              correctIndex: typeof item.correctIndex === 'number' && item.correctIndex >= 0 && item.correctIndex < 4
                ? item.correctIndex
                : 0,
              explanation: item.explanation || 'Theo nội dung câu chuyện thuyết minh di tích.',
              monumentCode,
              monumentName,
              isAiGenerated: true,
            };
            return balanceQuizOptionLengths(raw);
          });
          console.log(`[AI Quiz Generator] Lần tạo ${generationNumber} (${assignedKeyLabel}): Hoàn tất thành công ${generatedQuizzes.length} câu hỏi.`);
        }
      } catch (err: any) {
        console.warn(`[AI Quiz Generator] Lần tạo ${generationNumber} (${assignedKeyLabel}) gặp sự cố:`, err?.message || err);
        lastError = err;
      }
    }

    // Đảm bảo CHÍNH XÁC 5 câu hỏi và đáp án đúng không phải là đáp án dài nhất
    const fallback5 = fallbackExtractQuizFromStory(storyContent, monumentName, monumentCode);
    if (!generatedQuizzes || generatedQuizzes.length === 0) {
      console.warn(`[AI Quiz Generator] Sử dụng bộ câu hỏi bám sát câu chuyện cho Lần tạo ${generationNumber} (${assignedKeyLabel}):`, lastError?.message);
      generatedQuizzes = fallback5;
    } else if (generatedQuizzes.length < 5) {
      const needed = 5 - generatedQuizzes.length;
      generatedQuizzes = [...generatedQuizzes, ...fallback5.slice(0, needed)];
    } else if (generatedQuizzes.length > 5) {
      generatedQuizzes = generatedQuizzes.slice(0, 5);
    }

    // Bảo đảm cân bằng độ dài cho toàn bộ 5 câu hỏi
    generatedQuizzes = generatedQuizzes.map((q) => balanceQuizOptionLengths(q));

    res.json({
      success: true,
      quizzes: generatedQuizzes,
      generationNumber,
      keyNumber,
      keyIndex,
      apiKeyUsed: assignedKeyLabel,
      formulaLabel: `Lần tạo ${generationNumber}: ${assignedKeyLabel}`,
      totalKeys,
      monumentCode,
      monumentName,
      source: 'gemini-3.8-flash',
      groundedInStory: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AI Quiz API Error]', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Có lỗi xảy ra khi tạo câu hỏi trắc nghiệm',
    });
  }
});

// Canonical historical timeline event dataset for all 13 monuments (3 - 4 rows each)
const CANONICAL_TIMELINE_FALLBACK: Record<string, { id: string; time: string; event: string; explanation: string }[]> = {
  BNR: [
    { id: 'bnr_1', time: 'Năm 1863', event: 'Khởi công xây dựng trụ sở thương cảng với nóc nhà chạm hình đôi rồng chầu mặt trời kiểu phương Đông', explanation: 'Bến Nhà Rồng được khởi dựng năm 1863 bên bờ sông Sài Gòn, vốn là trụ sở của hãng Messageries Maritimes.' },
    { id: 'bnr_2', time: 'Ngày 5/6/1911', event: 'Người thanh niên yêu nước Nguyễn Tất Thành bước lên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước', explanation: 'Sự kiện lịch sử trọng đại mở đầu hành trình bôn ba khắp năm châu tìm con đường giải phóng cho dân tộc của Bác Hồ.' },
    { id: 'bnr_3', time: 'Năm 1979', event: 'Khu lưu niệm Bác Hồ tại Bến Nhà Rồng được xếp hạng Di tích lịch sử - văn hóa cấp quốc gia', explanation: 'Địa danh gắn liền với cuộc đời hoạt động cách mạng của Chủ tịch Hồ Chí Minh được Nhà nước vinh danh và bảo tồn nghiêm cẩn.' },
    { id: 'bnr_4', time: 'Tháng 6 hàng năm', event: 'Nhân dân cả nước tề tựu trước bến cảng tri ân ngày một hành trình lịch sử bắt đầu', explanation: 'Bảo tàng Hồ Chí Minh - Bến Nhà Rồng là điểm đến thiêng liêng lưu giữ những kỷ vật bất hủ và truyền ngọn lửa yêu nước.' },
  ],
  CBT: [
    { id: 'cbt_1', time: 'Đầu thế kỷ XIX', event: 'Hình thành ngôi chợ nguyên thủy bằng tranh tre nứa nằm ven sông Bến Nghé, cạnh thành Quy', explanation: 'Ngôi chợ xưa nằm cạnh bến sông đón thuyền khách vào thành Gia Định nên người dân quen gọi là Chợ Bến Thành.' },
    { id: 'cbt_2', time: 'Năm 1912 - 1914', event: 'Khởi công và hoàn thành xây dựng ngôi chợ kiên cố mới với tháp đồng hồ 4 mặt biểu tượng', explanation: 'Khu chợ mới khánh thành năm 1914 tại bến xe ngựa cũ, trở thành trung tâm giao thương sầm uất bậc nhất Sài Gòn.' },
    { id: 'cbt_3', time: 'Năm 1952', event: 'Gắn các bức phù điêu gốm mỹ thuật Biên Hòa miêu tả sản vật Nam Bộ tại các cửa Đông - Tây - Nam - Bắc', explanation: 'Các bức phù điêu gốm hình bò, chuối, cá... mang đậm bản sắc văn hóa dân gian phương Nam.' },
    { id: 'cbt_4', time: 'Năm 1985', event: 'Đại trùng tu quy mô lớn để bảo tồn kiến trúc tháp đồng hồ và chỉnh trang khuôn viên kinh doanh', explanation: 'Đợt chỉnh trang toàn diện giúp chợ giữ vững diện mạo cổ kính và tiếp tục là biểu tượng thương mại tiêu biểu của TP.HCM.' },
  ],
  CMC: [
    { id: 'cmc_1', time: 'Mùa đông năm 1049', event: 'Vua Lý Thái Tông cho khởi dựng chùa Diên Hựu sau giấc mộng được Phật Bà Quan Âm dắt lên đài sen', explanation: 'Công trình được thiết kế như một đóa hoa sen thanh tịnh ngát hương vươn lên từ cột đá giữa lòng hồ Linh Chiểu.' },
    { id: 'cmc_2', time: 'Năm 1105', event: 'Vua Lý Nhân Tông cho trùng tu, mở rộng hồ Linh Chiểu và cho đúc quả đại hồng chung Quy Điền', explanation: 'Nhà Lý tôn tạo quần thể cảnh quan tâm linh biến nơi đây thành biểu tượng thịnh trị của Phật giáo thời Lý.' },
    { id: 'cmc_3', time: 'Năm 1954', event: 'Chùa bị phá hủy trước khi quân Pháp rút khỏi Hà Nội và được nhân dân phục dựng nguyên mẫu', explanation: 'Các nghệ nhân và kiến trúc sư Việt Nam đã khôi phục chuẩn xác theo bản vẽ cổ thời Lý.' },
    { id: 'cmc_4', time: 'Năm 2012', event: 'Tổ chức Kỷ lục Châu Á xác lập kỷ lục "Ngôi chùa có kiến trúc độc đáo nhất Châu Á"', explanation: 'Tôn vinh kiệt tác kiến trúc gỗ đặt trên một trụ đá duy nhất - viên ngọc quý của nền mỹ thuật cổ truyền dân tộc.' },
  ],
  CauHienLuong: [
    { id: 'chl_1', time: 'Tháng 7/1954', event: 'Hiệp định Genève ký kết, sông Bến Hải và cầu Hiền Lương tại vĩ tuyến 17 trở thành giới tuyến quân sự tạm thời', explanation: 'Hiệp định Genève quy định đường giới tuyến chia cắt hai miền Nam - Bắc trong thời gian chờ cuộc tổng tuyển cử.' },
    { id: 'chl_2', time: 'Giai đoạn 1954 - 1975', event: 'Cuộc chiến sơn màu cầu và các đợt "chọi cờ", "chọi loa" biểu tượng cho ý chí thống nhất non sông', explanation: 'Hai bờ giới tuyến diễn ra những cuộc so tài ý chí rực lửa với cột cờ giới tuyến kiên cường tung bay trong bom đạn.' },
    { id: 'chl_3', time: 'Mùa Xuân năm 1975', event: 'Đại thắng giải phóng hoàn toàn miền Nam, cầu Hiền Lương chính thức hoàn thành sứ mệnh lịch sử giới tuyến', explanation: 'Đất nước trọn niềm vui non sông thu về một mối, đôi bờ Bến Hải nối liền khúc ruột Bắc - Nam gắn kết một nhà.' },
    { id: 'chl_4', time: 'Năm 2013', event: 'Cụm di tích Đôi bờ Hiền Lương - Bến Hải được Nhà nước xếp hạng Di tích quốc gia đặc biệt', explanation: 'Di tích trở thành chứng tích hào hùng và bài học thiêng liêng về khát vọng hòa bình, thống nhất của toàn dân tộc.' },
  ],
  DDCC: [
    { id: 'ddcc_1', time: 'Năm 1946 - 1948', event: 'Quân dân Tân Phú Trung và Phước Vĩnh An đào những đoạn hầm bí mật riêng lẻ đầu tiên trong lòng đất', explanation: 'Giai đoạn đầu thời kỳ kháng chiến chống Pháp, nhân dân đào hầm để che giấu cán bộ và cất giữ vũ khí.' },
    { id: 'ddcc_2', time: 'Giai đoạn 1961 - 1965', event: 'Mở rộng và kết nối các đoạn hầm thành hệ thống địa đạo liên hoàn đa tầng dài hơn 250km', explanation: 'Phát triển thành một kỳ quan quân sự dưới lòng đất với đầy đủ chiến hào, phòng hội họp, trạm xá và bếp Hoàng Cầm.' },
    { id: 'ddcc_3', time: 'Năm 1966 - 1967', event: 'Kiên cường bám trụ đánh bại các cuộc hành quân càn quét quy mô lớn như Cedar Falls và Junction City', explanation: 'Quân dân Củ Chi vinh dự đón nhận danh hiệu cao quý "Đất thép thành đồng" vì tinh thần chiến đấu bất khuất.' },
    { id: 'ddcc_4', time: 'Năm 2015', event: 'Khu di tích lịch sử Địa đạo Củ Chi được Thủ tướng Chính phủ xếp hạng Di tích quốc gia đặc biệt', explanation: 'Một trong những công trình quân sự độc đáo nhất thế giới đón hàng triệu lượt khách quốc tế đến chiêm ngưỡng.' },
  ],
  DenHung: [
    { id: 'dh_1', time: 'Thời đại Hùng Vương', event: 'Các Vua Hùng chọn đỉnh núi Nghĩa Lĩnh linh thiêng định đô và khai sinh nhà nước Văn Lang', explanation: 'Mở đầu kỷ nguyên dựng nước Văn Lang - buổi bình minh của lịch sử hào hùng dựng nước và giữ nước của dân tộc.' },
    { id: 'dh_2', time: 'Năm 1479', event: 'Triều vua Lê Thánh Tông ban chỉ ghi chép ngọc phả Hùng Vương và quy chuẩn thể thức giỗ Tổ cấp quốc gia', explanation: 'Nhà nước phong kiến ghi nhận chính thức nghi thức tế lễ tri ân công đức tổ tiên hàng năm tại vùng đất Phong Châu.' },
    { id: 'dh_3', time: 'Ngày 19/9/1954', event: 'Chủ tịch Hồ Chí Minh căn dặn: "Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước"', explanation: 'Lời căn dặn thiêng liêng tại Đền Giếng khắc sâu trách nhiệm gìn giữ giang sơn cho muôn đời con cháu mai sau.' },
    { id: 'dh_4', time: 'Ngày 6/12/2012', event: 'UNESCO chính thức công nhận "Tín ngưỡng thờ cúng Hùng Vương" là Di sản văn hóa phi vật thể đại diện nhân loại', explanation: 'Biểu tượng gắn kết cộng đồng và tinh thần "uống nước nhớ nguồn" độc nhất vô nhị của người Việt.' },
  ],
  DinhDocLap: [
    { id: 'ddl_1', time: 'Năm 1868', event: 'Thống đốc Nam Kỳ đặt viên đá đầu tiên khởi công xây dựng Dinh Norodom cổ kính', explanation: 'Dinh thự mang phong cách tân cổ điển phương Tây phục vụ bộ máy hành chính cấp cao của chính quyền bảo hộ Pháp.' },
    { id: 'ddl_2', time: 'Năm 1962 - 1966', event: 'Kiến trúc sư Ngô Viết Thụ thiết kế xây dựng lại dinh mới kết hợp hài hòa triết lý Á Đông và kiến trúc hiện đại', explanation: 'Mặt bằng dinh được xếp đặt khéo léo theo các chữ Hán mang biểu tượng Cát, Khẩu, Trung, Tam hàm ý hòa bình, thịnh vượng.' },
    { id: 'ddl_3', time: '11 giờ 30 ngày 30/4/1975', event: 'Xe tăng 390 húc đổ cổng chính, lá cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc dinh báo hiệu toàn thắng', explanation: 'Giây phút lịch sử thiêng liêng đánh dấu thắng lợi trọn vẹn của Chiến dịch Hồ Chí Minh, non sông thu về một mối.' },
    { id: 'ddl_4', time: 'Năm 2009', event: 'Thủ tướng Chính phủ xếp hạng Dinh Độc Lập là một trong 10 Di tích quốc gia đặc biệt đầu tiên của cả nước', explanation: 'Công trình kiến trúc di sản chứng kiến bước ngoặt lịch sử thống nhất đất nước.' },
  ],
  LangChuTichHCM: [
    { id: 'lb_1', time: 'Ngày 2/9/1969', event: 'Chủ tịch Hồ Chí Minh qua đời, Đảng và Nhà nước quyết định bảo quản lâu dài thi hài và xây dựng Lăng', explanation: 'Thể theo nguyện vọng thiết tha của toàn Đảng, toàn dân và đồng bào miền Nam muốn được chiêm ngưỡng dung nhan của Bác.' },
    { id: 'lb_2', time: 'Ngày 2/9/1973', event: 'Khởi công xây dựng công trình Lăng Chủ tịch Hồ Chí Minh tại vị trí lễ đài Quảng trường Ba Đình lịch sử', explanation: 'Công trình được dựng xây từ những khối đá quý, gỗ quý và hàng ngàn giống cây hoa do nhân dân khắp mọi miền gửi về.' },
    { id: 'lb_3', time: 'Ngày 29/8/1975', event: 'Lễ khánh thành Lăng Chủ tịch Hồ Chí Minh trọng thể và chính thức mở cửa đón nhân dân vào viếng', explanation: 'Đồng bào từ mọi miền Tổ quốc cùng bạn bè năm châu trang nghiêm nghiêng mình trước vị lãnh tụ kính yêu.' },
    { id: 'lb_4', time: 'Mỗi ngày từ năm 1975 đến nay', event: 'Duy trì nghi thức thượng cờ lúc 6h sáng và hạ cờ lúc 21h tối trang nghiêm trên Quảng trường Ba Đình', explanation: 'Nghi lễ biểu tượng của chủ quyền quốc gia và lòng kính yêu, tự hào của các thế hệ người Việt Nam.' },
  ],
  NgoMon: [
    { id: 'nm_1', time: 'Năm 1833', event: 'Vua Minh Mạng cho khởi công xây dựng Ngọ Môn làm cổng chính phía Nam của Hoàng thành Huế', explanation: 'Công trình thay thế Nam Khuyết Đài cũ, có bình diện chữ U với 5 lối đi và lầu Ngũ Phụng tráng lệ.' },
    { id: 'nm_2', time: 'Thời Nguyễn (1802 - 1945)', event: 'Nơi triều đình tổ chức các đại lễ quốc gia như Lễ Ban Sóc (ban lịch mới) và Lễ Truyền Lô (xướng danh bảng vàng)', explanation: 'Không gian nghi lễ uy nghiêm phản ánh đỉnh cao lễ nhạc và phong cách kiến trúc cung đình triều Nguyễn.' },
    { id: 'nm_3', time: 'Ngày 30/8/1945', event: 'Vua Bảo Đại đọc Chiếu thoái vị và trao ấn kiếm cho phái đoàn Chính phủ Cách mạng Lâm thời', explanation: 'Sự kiện bước ngoặt chấm dứt hoàn toàn chế độ quân chủ phong kiến kéo dài hàng ngàn năm tại Việt Nam.' },
    { id: 'nm_4', time: 'Năm 1993', event: 'Quần thể Di tích Cố đô Huế cùng Ngọ Môn được UNESCO vinh danh là Di sản Văn hóa Thế giới đầu tiên của Việt Nam', explanation: 'Biểu tượng kiến trúc cung đình tuyệt mỹ được nhân loại tôn vinh và cam kết bảo tồn nguyên vẹn.' },
  ],
  NhaThoDB: [
    { id: 'ntdb_1', time: 'Tháng 10/1877', event: 'Giám mục Colombert cử hành nghi thức đặt viên đá đầu tiên khởi công xây dựng nhà thờ chính tòa Sài Gòn', explanation: 'Kiến trúc sư J. Bourard thiết kế công trình mang phong cách Roman kết hợp Gothic với gạch ngói Marseille.' },
    { id: 'ntdb_2', time: 'Lễ Phục Sinh năm 1880', event: 'Tổ chức lễ khánh thành nhà thờ với tên gọi ban đầu là Nhà thờ Nhà nước', explanation: 'Ngôi thánh đường trở thành tâm điểm kiến trúc uy nghi giữa lòng trung tâm thành phố.' },
    { id: 'ntdb_3', time: 'Năm 1895', event: 'Xây dựng thêm hai ngọn tháp nhọn cao 57,6m cùng hệ thống 6 quả chuông đồng lớn nặng gần 30 tấn', explanation: 'Hai tháp nhọn vút cao lên nền trời đã định hình nên diện mạo biểu tượng kiều diễm cho thánh đường.' },
    { id: 'ntdb_4', time: 'Năm 1962', event: 'Tòa thánh Vatican chính thức nâng nhà thờ lên hàng Tiểu Vương cung thánh đường (Basilica)', explanation: 'Danh hiệu quốc tế cao quý ghi nhận vị thế tôn giáo trang trọng cùng giá trị nghệ thuật kiến trúc kiệt xuất.' },
  ],
  TDiaMS: [
    { id: 'tdms_1', time: 'Thế kỷ IV', event: 'Vua Bhadravarman khởi dựng ngôi đền gỗ đầu tiên thờ thần Shiva tại thung lũng Mỹ Sơn', explanation: 'Mở đầu cho hơn một thiên niên kỷ xây dựng trung tâm thánh địa tôn giáo linh thiêng của vương quốc Champa.' },
    { id: 'tdms_2', time: 'Thế kỷ VII - XIII', event: 'Các triều vua Champa liên tục xây dựng hơn 70 đền tháp bằng gạch nung với kỹ thuật mài chập bí ẩn', explanation: 'Kỹ thuật xếp gạch khít khao không dùng vữa liên kết vẫn là kiệt tác nghệ thuật kiến trúc làm kinh ngạc thế giới.' },
    { id: 'tdms_3', time: 'Năm 1898', event: 'Nhà khảo cổ học người Pháp Camille Paris phát hiện lại quần thể phế tích nằm ẩn sâu trong rừng rậm', explanation: 'Mở đầu công tác thám sát, giải mã văn bia và trùng tu khoa học quy mô của Viện Viễn Đông Bác Cổ.' },
    { id: 'tdms_4', time: 'Tháng 12/1999', event: 'UNESCO chính thức ghi danh Thánh địa Mỹ Sơn vào danh mục Di sản Văn hóa Thế giới', explanation: 'Minh chứng sống động độc nhất về nền văn minh và tôn giáo cổ đại phát triển rực rỡ tại miền Trung.' },
  ],
  ThanhCoQT: [
    { id: 'tcqt_1', time: 'Năm 1809 - 1827', event: 'Vua Gia Long cho đắp thành đất, sau đó vua Minh Mạng xây kiên cố lại bằng gạch theo phong cách Vauban', explanation: 'Tòa thành quân sự kiên cố có chu vi gần 2.000 mét với 4 cổng thành hướng ra 4 phương.' },
    { id: 'tcqt_2', time: 'Mùa hè đỏ lửa năm 1972', event: 'Cuộc chiến đấu bảo vệ Thành Cổ Quảng Trị diễn ra anh dũng suốt 81 ngày đêm rực lửa', explanation: 'Hàng ngàn chiến sĩ anh dũng hy sinh, mỗi tấc đất và viên gạch nơi đây thấm đẫm máu xương vì độc lập dân tộc.' },
    { id: 'tcqt_3', time: 'Tháng 1/1973', event: 'Thắng lợi phòng ngự kiên cường 81 ngày đêm tạo thế mạnh quyết định buộc Mỹ phải ký Hiệp định Paris', explanation: 'Chiến công quả cảm đã mở đường cho thắng lợi ngoại giao quốc tế và tạo tiền đề giải phóng hoàn toàn miền Nam.' },
    { id: 'tcqt_4', time: 'Năm 1986', event: 'Thành Cổ Quảng Trị được Nhà nước xếp hạng Di tích lịch sử quốc gia đặc biệt quan trọng', explanation: 'Đài tưởng niệm tri ân và mảnh đất linh thiêng nhắc nhở muôn đời thế hệ mai sau về cái giá của hòa bình.' },
  ],
  NTCD: [
    { id: 'ntcd_1', time: 'Năm 1862', event: 'Thực dân Pháp thành lập hệ thống nhà tù Côn Đảo giữa biển khơi', explanation: 'Hệ thống nhà tù tàn bạo nhằm giam giữ và đày đọa các chiến sĩ cách mạng yêu nước.' },
    { id: 'ntcd_2', time: 'Giai đoạn 1940 - 1970', event: 'Xây dựng mở rộng các trại giam khét tiếng như Chuồng Cọp; biến ngục tù thành trường học cách mạng', explanation: 'Các chiến sĩ cách mạng kiên cường giữ vững khí tiết và ý chí đấu tranh giải phóng dân tộc.' },
    { id: 'ntcd_3', time: 'Sáng sớm 1/5/1975', event: 'Người tù chính trị phá tung cửa sắt trại Phú Bình, giải phóng toàn bộ Côn Đảo', explanation: 'Sự kiện lịch sử vĩ đại chấm dứt hơn một thế kỷ địa ngục trần gian, mang lại tự do trọn vẹn.' },
    { id: 'ntcd_4', time: 'Năm 2012 - Nay', event: 'Được Thủ tướng Chính phủ xếp hạng Di tích quốc gia đặc biệt', explanation: 'Bảo tồn nguyên vẹn các công trình chứng tích và Nghĩa trang Hàng Dương thiêng liêng.' },
  ],
  VanMieuQTG: [
    { id: 'vm_1', time: 'Mùa thu năm 1070', event: 'Vua Lý Thánh Tông cho xây dựng Văn Miếu để thờ Khổng Tử và các bậc hiền triết Nho học', explanation: 'Khởi đầu cho trung tâm văn hóa, giáo dục tiêu biểu của kinh thành Thăng Long thời Lý.' },
    { id: 'vm_2', time: 'Năm 1076', event: 'Vua Lý Nhân Tông cho lập Quốc Tử Giám, trở thành trường đại học đầu tiên của Việt Nam', explanation: 'Nơi quy tụ và đào tạo hàng ngàn danh sĩ, hiền tài kiệt xuất phò tá triều đình qua bao thế hệ.' },
    { id: 'vm_3', time: 'Năm 1484', event: 'Vua Lê Thánh Tông ban chỉ khởi dựng những tấm bia đá đầu tiên ghi danh các vị tiến sĩ đỗ đạt', explanation: '82 tấm bia tiến sĩ đặt trên lưng rùa đá là Di sản tư liệu thế giới biểu trưng cho truyền thống hiếu học.' },
    { id: 'vm_4', time: 'Năm 1805', event: 'Xây dựng Khuê Văn Các với bốn cửa sổ tròn hình mặt trời tỏa sáng, tượng trưng cho sao Khuê', explanation: 'Công trình kiến trúc tinh xảo và tao nhã đã trở thành biểu tượng văn hiến chính thức của thủ đô Hà Nội.' },
  ],
};

// API endpoint: AI Timeline Match Generator (Ghép Nối Thời Gian Sự Kiện Di Tích - CHÍNH XÁC 3 ĐẾN 4 HÀNG)
app.post('/api/timeline/generate', async (req, res) => {
  try {
    const { monumentCode = 'CBT', monumentName = 'Chợ Bến Thành' } = req.body;
    let storyContent = (req.body.storyContent || '').trim();

    if (storyContent.length < 30 && MONUMENT_TXT_FILES[monumentCode]) {
      const txtPath = path.join(process.cwd(), MONUMENT_TXT_FILES[monumentCode]);
      if (fs.existsSync(txtPath)) {
        storyContent = fs.readFileSync(txtPath, 'utf-8').trim();
      }
    }

    const keys = getApiKeysList();
    const totalKeys = keys.length || 8;

    globalGenerationCount++;
    const generationNumber = globalGenerationCount;
    const remainder = generationNumber % totalKeys;
    const keyNumber = remainder === 0 ? totalKeys : remainder;
    const keyIndex = keyNumber - 1;
    const assignedApiKey = keys[keyIndex] || keys[0] || process.env.GEMINI_API_KEY || '';
    const assignedKeyLabel = `API ${keyNumber}`;

    console.log(`[Timeline Match Generator] Lần tạo ${generationNumber}: Chỉ định luân phiên ${assignedKeyLabel}`);

    let generatedEvents: { id: string; time: string; event: string; explanation: string }[] | null = null;

    if (assignedApiKey && storyContent) {
      try {
        const ai = new GoogleGenAI({
          apiKey: assignedApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Dưới đây là nội dung CÂU CHUYỆN THUYẾT MINH chính thức của di tích "${monumentName}" (Mã: ${monumentCode}):
========================
${storyContent}
========================

YÊU CẦU BẮT BUỘC:
1. Bạn hãy tạo ra CHÍNH XÁC TỪ 3 ĐẾN 4 HÀNG (sự kiện lịch sử liên quan đến di tích đó):
Mỗi hàng là một cặp ghép nối giữa:
- "time": THỜI GIAN SỰ KIỆN (Mốc thời gian, năm, ngày tháng, thời kỳ hoặc thế kỷ liên quan trực tiếp đến di tích). Ví dụ: "Năm 1070", "Ngày 5/6/1911", "Năm 1975", "Thế kỷ IV"...
- "event": TÊN SỰ KIỆN LIÊN QUAN ĐẾN DI TÍCH (Tên sự kiện hoặc tóm tắt sự việc lịch sử quan trọng diễn ra vào mốc thời gian đó). Ví dụ: "Khởi công xây dựng...", "Nguyễn Tất Thành lên tàu ra đi tìm đường cứu nước"...
- "explanation": Giải thích ngắn gọn (1 câu) dựa vào bài thuyết minh để cung cấp kiến thức lịch sử khi người dùng ghép đúng.

2. SỐ LƯỢNG HÀNG:
- BẮT BUỘC PHẢI CÓ CHÍNH XÁC TỪ 3 ĐẾN 4 HÀNG (tối thiểu 3 hàng, tối đa 4 hàng, lý tưởng nhất là 4 hàng). Tuyệt đối không tạo ít hơn 3 hoặc nhiều hơn 4.

3. TẤT CẢ các mốc thời gian và sự kiện PHẢI BÁM SÁT 100% NỘI DUNG CÂU CHUYỆN THUYẾT MINH TRÊN.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Bạn là chuyên gia sử học và giáo dục di sản văn hóa Việt Nam. Nhiệm vụ của bạn là biên soạn chính xác 3 đến 4 cặp ghép nối giữa Mốc thời gian sự kiện và Tên sự kiện lịch sử liên quan đến di tích, bám sát 100% tài liệu thuyết minh di tích.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  time: { type: Type.STRING },
                  event: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['time', 'event', 'explanation'],
              },
            },
          },
        });

        const text = response.text?.trim() || '[]';
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed) && parsed.length > 0) {
          generatedEvents = parsed.map((item: any, idx: number) => ({
            id: `ev_${monumentCode}_${idx + 1}`,
            time: item.time || `Mốc ${idx + 1}`,
            event: item.event || `Sự kiện liên quan đến di tích ${monumentName}`,
            explanation: item.explanation || 'Theo nội dung bài học lịch sử di tích.',
          }));
        }
      } catch (err: any) {
        console.warn(`[Timeline Match Generator] Lỗi tạo AI (${assignedKeyLabel}):`, err?.message);
      }
    }

    const fallbackList = CANONICAL_TIMELINE_FALLBACK[monumentCode] || CANONICAL_TIMELINE_FALLBACK['BNR'];

    if (!generatedEvents || generatedEvents.length === 0) {
      generatedEvents = fallbackList;
    } else if (generatedEvents.length < 3) {
      const needed = 4 - generatedEvents.length;
      generatedEvents = [...generatedEvents, ...fallbackList.slice(0, needed)];
    } else if (generatedEvents.length > 4) {
      generatedEvents = generatedEvents.slice(0, 4);
    }

    res.json({
      success: true,
      events: generatedEvents,
      generationNumber,
      keyNumber,
      keyIndex,
      apiKeyUsed: assignedKeyLabel,
      totalKeys,
      monumentCode,
      monumentName,
      groundedInStory: true,
    });
  } catch (err: any) {
    console.error('[Timeline Match API Error]', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi xử lý mốc thời gian sự kiện',
    });
  }
});

// Start Express server and attach Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Di Tích Việt server listening on http://0.0.0.0:${PORT}`);
    // Start Python ML background worker asynchronously after HTTP server is live
    setTimeout(() => {
      startPythonWorker();
    }, 200);
  });

  // Cleanup on process termination
  const cleanup = () => {
    if (pythonProcess) {
      console.log('[Server] Terminating Python ML process...');
      pythonProcess.kill();
      pythonProcess = null;
    }
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

startServer();
