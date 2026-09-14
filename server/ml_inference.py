import os
import sys
import io
import time
import json
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler

# Configure Keras to use PyTorch backend
os.environ['KERAS_BACKEND'] = 'torch'
import keras
import torch
import numpy as np
from PIL import Image

# Compatibility patch: Keras 3.13+ exports 'quantization_config' in layer configs.
# In Keras 3.12 on Python 3.10, Layer.__init__ raises ValueError if unexpected kwargs are passed.
orig_layer_init = keras.layers.Layer.__init__
def patched_layer_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    return orig_layer_init(self, *args, **kwargs)
keras.layers.Layer.__init__ = patched_layer_init

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'image_classifier_vn.keras'))
MODEL_NAME = os.path.basename(MODEL_PATH)
SAFETY_THRESHOLD = 60.0  # 60% safety threshold

print(f"Loading Machine Learning model from: {MODEL_PATH} ({MODEL_NAME})...")
try:
    model = keras.models.load_model(MODEL_PATH)
    print("Machine Learning model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# Determine number of output classes directly from model architecture
output_shape = model.output_shape
NUM_CLASSES = output_shape[-1] if isinstance(output_shape, tuple) else 14

# Danh sách 14 di tích theo đúng thứ tự đầu ra của mô hình (ASCII-sorted: BNR, CBT, CMC, CauHienLuong, DDCC, DenHung, DinhDocLap, LangChuTichHCM, NgoMon, NhaThoDB, NTCD, TDiaMS, ThanhCoQT, VanMieuQTG)
ORDERED_HERITAGE_LIST = [
    {"index": 0, "code": "BNR", "name": "Bến Nhà Rồng"},
    {"index": 1, "code": "CBT", "name": "Chợ Bến Thành"},
    {"index": 2, "code": "CMC", "name": "Chùa Một Cột"},
    {"index": 3, "code": "CauHienLuong", "name": "Cầu Hiền Lương - Sông Bến Hải"},
    {"index": 4, "code": "DDCC", "name": "Địa đạo Củ Chi"},
    {"index": 5, "code": "DenHung", "name": "Đền Hùng"},
    {"index": 6, "code": "DinhDocLap", "name": "Dinh Độc Lập"},
    {"index": 7, "code": "LangChuTichHCM", "name": "Lăng Chủ tịch Hồ Chí Minh"},
    {"index": 8, "code": "NgoMon", "name": "Cố đô Huế (Ngọ Môn)"},
    {"index": 9, "code": "NhaThoDB", "name": "Nhà Thờ Đức Bà"},
    {"index": 10, "code": "NTCD", "name": "Nhà Tù Côn Đảo"},
    {"index": 11, "code": "TDiaMS", "name": "Thánh Địa Mỹ Sơn"},
    {"index": 12, "code": "ThanhCoQT", "name": "Thành Cổ Quảng Trị"},
    {"index": 13, "code": "VanMieuQTG", "name": "Văn Miếu Quốc Tử Giám"},
]

# Ánh xạ từ chỉ mục đầu ra của mô hình
MODEL_INDEX_MAP = [
    {"code": "BNR", "name": "Bến Nhà Rồng"},
    {"code": "CBT", "name": "Chợ Bến Thành"},
    {"code": "CMC", "name": "Chùa Một Cột"},
    {"code": "CauHienLuong", "name": "Cầu Hiền Lương - Sông Bến Hải"},
    {"code": "DDCC", "name": "Địa đạo Củ Chi"},
    {"code": "DenHung", "name": "Đền Hùng"},
    {"code": "DinhDocLap", "name": "Dinh Độc Lập"},
    {"code": "LangChuTichHCM", "name": "Lăng Chủ tịch Hồ Chí Minh"},
    {"code": "NgoMon", "name": "Cố đô Huế (Ngọ Môn)"},
    {"code": "NhaThoDB", "name": "Nhà Thờ Đức Bà"},
    {"code": "NTCD", "name": "Nhà Tù Côn Đảo"},
    {"code": "TDiaMS", "name": "Thánh Địa Mỹ Sơn"},
    {"code": "ThanhCoQT", "name": "Thành Cổ Quảng Trị"},
    {"code": "VanMieuQTG", "name": "Văn Miếu Quốc Tử Giám"},
]

CLASSES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'classes.json'))
if os.path.exists(CLASSES_FILE):
    try:
        with open(CLASSES_FILE, 'r', encoding='utf-8') as f:
            loaded_classes = json.load(f)
            if isinstance(loaded_classes, list) and len(loaded_classes) > 0:
                ORDERED_HERITAGE_LIST = loaded_classes
                MODEL_INDEX_MAP = loaded_classes
                print(f"Loaded {len(MODEL_INDEX_MAP)} classes from {CLASSES_FILE}")
    except Exception as e:
        print(f"Warning loading classes.json: {e}")

DEFAULT_HERITAGE_CLASSES = [item["name"] for item in MODEL_INDEX_MAP]

def load_class_names(num_classes):
    """
    Load class names strictly mapped to model output classes.
    """
    if num_classes <= len(DEFAULT_HERITAGE_CLASSES):
        return DEFAULT_HERITAGE_CLASSES[:num_classes]
    return DEFAULT_HERITAGE_CLASSES + [f"Class {i}" for i in range(len(DEFAULT_HERITAGE_CLASSES), num_classes)]

CLASS_NAMES = load_class_names(NUM_CLASSES)
print(f"Initialized {len(CLASS_NAMES)} model class names: {CLASS_NAMES}")


def letterbox_preprocess(img, target_size=(224, 224), pad_color=(0, 0, 0)):
    """
    Letterbox padding: Resize image keeping exact aspect ratio without cropping,
    and add padding to fit target_size. Preserves 100% of image borders, rooflines,
    and edges for accurate monument recognition.
    """
    orig_w, orig_h = img.size
    target_w, target_h = target_size

    # Calculate scale factor preserving aspect ratio
    scale = min(target_w / orig_w, target_h / orig_h)
    new_w = max(1, int(round(orig_w * scale)))
    new_h = max(1, int(round(orig_h * scale)))

    # Resize with high-quality resampling (LANCZOS)
    img_scaled = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Create padded background (neutral black padding - standard in computer vision)
    letterboxed = Image.new('RGB', (target_w, target_h), pad_color)
    pad_x = (target_w - new_w) // 2
    pad_y = (target_h - new_h) // 2
    letterboxed.paste(img_scaled, (pad_x, pad_y))

    # Base64 preview of preprocessed image for frontend verification
    preview_buf = io.BytesIO()
    letterboxed.save(preview_buf, format='JPEG', quality=95)
    preview_b64 = "data:image/jpeg;base64," + base64.b64encode(preview_buf.getvalue()).decode('ascii')

    diagnostics = {
        "originalDimensions": f"{orig_w}x{orig_h}",
        "scaledDimensions": f"{new_w}x{new_h}",
        "modelInputDimensions": f"{target_w}x{target_h}",
        "modelInputShape": f"{target_w}x{target_h}x3",
        "padX": pad_x,
        "padY": pad_y,
        "padding": f"pad_x={pad_x}, pad_y={pad_y}",
        "scaleFactor": round(scale, 4),
        "preprocessingMethod": "Letterbox (Bảo toàn 100% tỷ lệ, không crop, đệm viền trung tính)",
        "preprocessedPreview": preview_b64,
    }

    print(f"[ML Worker Letterbox] Original: {orig_w}x{orig_h} -> Scaled: {new_w}x{new_h} -> Model Input: {target_w}x{target_h} (padX={pad_x}, padY={pad_y}, scale={scale:.4f}, NO CROP)")
    sys.stdout.flush()

    return letterboxed, diagnostics


def classify_image(image_bytes):
    start_time = time.time()

    # Preprocess image with Letterbox Padding (No Crop, Preserves 100% rooflines and borders)
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_letterboxed, diag_info = letterbox_preprocess(img, (224, 224), pad_color=(0, 0, 0))

    # Convert to float32 numpy array [1, 224, 224, 3]
    # Note: Keras model architecture contains TrueDivide and Subtract preprocessing layers
    arr = np.array(img_letterboxed, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)

    # Run torch tensor inference
    tensor = torch.from_numpy(arr)
    with torch.no_grad():
        preds = model(tensor, training=False).numpy()[0]

    inference_ms = round((time.time() - start_time) * 1000, 1)
    diag_info["inferenceTimeMs"] = inference_ms
    diag_info["modelFile"] = MODEL_NAME
    diag_info["totalClasses"] = NUM_CLASSES

    # Format all class probabilities with exact class names and codes returned by model
    all_results = []
    for idx, prob in enumerate(preds):
        conf_pct = round(float(prob) * 100, 2)
        info = MODEL_INDEX_MAP[idx] if idx < len(MODEL_INDEX_MAP) else {"code": f"C{idx}", "name": f"Di tích {idx}"}
        all_results.append({
            "index": idx,
            "code": info["code"],
            "className": info["name"],
            "probability": conf_pct,
        })

    # Sort descending by probability
    all_results.sort(key=lambda x: x["probability"], reverse=True)

    top = all_results[0]
    top_index = int(top["index"])
    top_code = str(top["code"])
    top_confidence = float(top["probability"])
    top_class_name = str(top["className"])

    is_above_safety = top_confidence >= SAFETY_THRESHOLD

    # Requirement: Khi độ tin cậy dưới 60% thì cần trả về là yêu cầu người dùng đăng hình khác
    if not is_above_safety:
        return {
            "success": False,
            "isIdentified": False,
            "isAboveSafetyThreshold": False,
            "safetyThreshold": SAFETY_THRESHOLD,
            "confidence": top_confidence,
            "predictedIndex": top_index,
            "code": top_code,
            "className": None,
            "error": "LOW_CONFIDENCE",
            "requireNewImage": True,
            "message": f"Độ tin cậy nhận diện dưới 60% ({top_confidence}%). Yêu cầu người dùng đăng hình khác.",
            "allProbabilities": all_results,
            "orderedClasses": ORDERED_HERITAGE_LIST,
            "preprocessedPreview": diag_info.get("preprocessedPreview"),
            "diagnostics": diag_info
        }

    # Requirement: Chỉ sử dụng tên class mà model trả về. Không tự bịa ra tên class.
    return {
        "success": True,
        "isIdentified": True,
        "isAboveSafetyThreshold": True,
        "safetyThreshold": SAFETY_THRESHOLD,
        "confidence": top_confidence,
        "predictedIndex": top_index,
        "code": top_code,
        "className": top_class_name,
        "displayName": f"{top_class_name} ({top_code})",
        "requireNewImage": False,
        "message": f"Nhận diện thành công: {top_class_name} [{top_code}] ({top_confidence}%)",
        "allProbabilities": all_results,
        "orderedClasses": ORDERED_HERITAGE_LIST,
        "preprocessedPreview": diag_info.get("preprocessedPreview"),
        "diagnostics": diag_info
    }


class MLRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ['/', '/health', '/api/ml/status']:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            status_payload = {
                "status": "online",
                "model": MODEL_NAME,
                "modelLoaded": True,
                "framework": "Keras 3 + PyTorch",
                "safetyThreshold": SAFETY_THRESHOLD,
                "classesCount": NUM_CLASSES,
                "orderedClasses": ORDERED_HERITAGE_LIST,
                "classNames": CLASS_NAMES,
                "timestamp": time.time()
            }
            self.wfile.write(json.dumps(status_payload).encode('utf-8'))
        elif self.path in ['/classes', '/api/ml/classes']:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"orderedClasses": ORDERED_HERITAGE_LIST}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path in ['/predict', '/api/ml/predict']:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body.decode('utf-8'))
                image_data = data.get('image', '')

                # Handle base64 data URI
                if ',' in image_data:
                    image_data = image_data.split(',', 1)[1]

                image_bytes = base64.b64decode(image_data)
                result = classify_image(image_bytes)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                err_resp = {"success": False, "error": str(e), "requireNewImage": True}
                self.wfile.write(json.dumps(err_resp).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))


def run_server(port=5001):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, MLRequestHandler)
    print(f"ML Worker server listening on http://127.0.0.1:{port} (Safety threshold: {SAFETY_THRESHOLD}%)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping ML Worker server...")
        httpd.server_close()


if __name__ == '__main__':
    port = 5001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except (ValueError, TypeError):
            port = 5001
    run_server(port)
