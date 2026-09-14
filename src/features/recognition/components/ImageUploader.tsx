import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { mlService, ImageAnalysisData, MLPredictionResult, PreprocessDiagnostics } from '../services/mlService';
import { adminService } from '../../admin/services/adminService';
import { useAuth } from '../../../core/hooks/useAuth';
import { CameraViewfinder } from './CameraViewfinder';
import { ImageDropzone } from './ImageDropzone';
import { AdminDiagnosticsPanel } from './AdminDiagnosticsPanel';

interface ImageUploaderProps {
  onImageSelected?: (base64Data: string) => void;
  onImageProcessed: (data: ImageAnalysisData, mlResult: MLPredictionResult) => void;
  isProcessing?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onImageProcessed,
  isProcessing: externalProcessing = false,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'bbnailab2026@gmail.com';

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [letterboxPreview, setLetterboxPreview] = useState<string | null>(null);
  const [activePreviewMode, setActivePreviewMode] = useState<'original' | 'letterbox'>('original');
  const [preprocessInfo, setPreprocessInfo] = useState<PreprocessDiagnostics | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<ImageAnalysisData | null>(null);
  const [mlResult, setMlResult] = useState<MLPredictionResult | null>(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showConfidence, setShowConfidence] = useState(() => adminService.isShowConfidenceEnabled());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setShowConfidence(adminService.isShowConfidenceEnabled());
    };
    window.addEventListener('ditich_system_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('ditich_system_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processSelectedImage = async (base64Data: string) => {
    setIsImageLoading(true);
    setPreviewImage(base64Data);
    setIsInferencing(true);

    try {
      // 1. Trích xuất thông tin kích thước ảnh thực địa nguyên bản (không cắt tự động)
      const diag = await mlService.extractImageDiagnostics(base64Data);
      setAnalysisData(diag);

      // 2. Tiền xử lý letterbox/padding 224x224 giữ nguyên 100% tỉ lệ và mái ngói
      const letterboxDiag = await mlService.createLetterboxImage(base64Data, 224, 224);
      setLetterboxPreview(letterboxDiag.preprocessedDataUrl);
      setPreprocessInfo(letterboxDiag);

      // 3. Đưa ảnh vào mô hình nhận diện
      const prediction = await mlService.predict(base64Data);
      setMlResult(prediction);

      // 4. Chuyển tiếp kết quả kèm thông số tiền xử lý
      onImageProcessed(diag, prediction);
    } catch (err) {
      console.error('Lỗi nhận diện hình ảnh:', err);
    } finally {
      setIsInferencing(false);
      setIsImageLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        processSelectedImage(base64);
      };
      reader.onerror = () => {
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type?.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|heic)$/i.test(file.name || ''))) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        processSelectedImage(base64);
      };
      reader.onerror = () => {
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Không thể mở camera:', err);
      alert('Không thể truy cập camera. Vui lòng cấp quyền hoặc tải ảnh từ thư viện thiết bị.');
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
        stopCamera();
        processSelectedImage(dataUrl);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const resetSelection = () => {
    setPreviewImage(null);
    setLetterboxPreview(null);
    setPreprocessInfo(null);
    setActivePreviewMode('original');
    setAnalysisData(null);
    setMlResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isWorking = isInferencing || externalProcessing;

  return (
    <Card
      sx={{
        mb: 4,
        overflow: 'hidden',
        bgcolor: '#FCFAF5',
        border: '1.5px solid #D8C5AA',
        boxShadow: '0 4px 20px rgba(50, 26, 15, 0.06), 0 1px 3px rgba(50, 26, 15, 0.04)',
      }}
      id="heritage-image-uploader-card"
    >
      <HeritageCornerFrame>
        {/* Header Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: 'rgba(142, 32, 27, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main',
                border: '1.5px solid #C59B27',
                boxShadow: '0 2px 6px rgba(197, 155, 39, 0.25)',
              }}
            >
              <PhotoCameraIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                Thu Nhận Hình Ảnh Khảo Sát
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Camera Viewfinder */}
        {isCameraActive ? (
          <CameraViewfinder
            videoRef={videoRef}
            canvasRef={canvasRef}
            onCapture={captureCameraPhoto}
            onCancel={stopCamera}
          />
        ) : (
          /* Normal Upload & Preview Area */
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: '1.5px dashed',
              borderColor: previewImage ? 'secondary.main' : '#C59B27',
              borderRadius: '6px',
              p: { xs: 2, sm: 3 },
              bgcolor: previewImage ? 'rgba(80, 35, 19, 0.02)' : '#FAF6ED',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 4px rgba(50, 26, 15, 0.03)',
            }}
          >
            {isImageLoading ? (
              <Box
                sx={{
                  py: { xs: 4, sm: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
                id="box-image-uploading-state"
              >
                <CircularProgress
                  size={52}
                  thickness={4.2}
                  sx={{ color: 'secondary.main' }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      color: 'primary.dark',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Ảnh đang được tải lên...
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Đang giải mã tập tin và chuẩn bị kiểm tra độ phân giải di tích
                  </Typography>
                </Box>
              </Box>
            ) : previewImage ? (
              <AdminDiagnosticsPanel
                isAdmin={Boolean(isAdmin)}
                previewImage={previewImage}
                letterboxPreview={letterboxPreview}
                activePreviewMode={activePreviewMode}
                setActivePreviewMode={setActivePreviewMode}
                preprocessInfo={preprocessInfo}
                analysisData={analysisData}
                mlResult={mlResult}
                isWorking={isWorking}
                showConfidence={showConfidence}
                onReset={resetSelection}
                onSelectNewFile={() => fileInputRef.current?.click()}
              />
            ) : (
              <ImageDropzone
                onSelectFile={() => fileInputRef.current?.click()}
                onStartCamera={startCamera}
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              id="input-file-heritage"
            />
          </Box>
        )}
      </HeritageCornerFrame>
    </Card>
  );
};
