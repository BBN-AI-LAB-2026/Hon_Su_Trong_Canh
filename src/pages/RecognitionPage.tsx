import React, { useState } from 'react';
import { Container, Box, Typography, Card, CircularProgress } from '@mui/material';
import { HeritageCornerFrame } from '../core/components/HeritageCornerFrame';
import { AncientParchmentTitleBanner } from '../features/recognition/components/AncientParchmentTitleBanner';
import { ImageUploader } from '../features/recognition/components/ImageUploader';
import { HeritageRecordCard } from '../features/recognition/components/HeritageRecordCard';
import { mlService, ImageAnalysisData, MLPredictionResult } from '../features/recognition/services/mlService';
import { FlowStep, FlowStepProgress } from '../features/recognition/components/FlowStepProgress';
import { KnowledgeMindMapStep } from '../features/recognition/components/KnowledgeMindMapStep';
import { QuickFunQuizStep } from '../features/recognition/components/QuickFunQuizStep';
import { VrTourStep } from '../features/recognition/components/VrTourStep';

const MONUMENT_METADATA: Record<string, { name: string; location: string }> = {
  BNR: { name: 'Bến Nhà Rồng', location: 'Quận 4, TP. Hồ Chí Minh' },
  CBT: { name: 'Chợ Bến Thành', location: 'Quận 1, TP. Hồ Chí Minh' },
  CMC: { name: 'Chùa Một Cột', location: 'Ba Đình, Hà Nội' },
  CauHienLuong: { name: 'Cầu Hiền Lương - Sông Bến Hải', location: 'Vĩnh Linh, Quảng Trị' },
  DDCC: { name: 'Địa đạo Củ Chi', location: 'Củ Chi, TP. Hồ Chí Minh' },
  DenHung: { name: 'Đền Hùng', location: 'Việt Trì, Phú Thọ' },
  DinhDocLap: { name: 'Dinh Độc Lập', location: 'Quận 1, TP. Hồ Chí Minh' },
  LangChuTichHCM: { name: 'Lăng Chủ tịch Hồ Chí Minh', location: 'Ba Đình, Hà Nội' },
  NgoMon: { name: 'Cố đô Huế (Ngọ Môn)', location: 'TP. Huế, Thừa Thiên Huế' },
  NhaThoDB: { name: 'Nhà Thờ Đức Bà', location: 'Quận 1, TP. Hồ Chí Minh' },
  NTCD: { name: 'Nhà Tù Côn Đảo', location: 'Côn Đảo, Bà Rịa - Vũng Tàu' },
  TDiaMS: { name: 'Thánh Địa Mỹ Sơn', location: 'Duy Xuyên, Quảng Nam' },
  ThanhCoQT: { name: 'Thành Cổ Quảng Trị', location: 'Thị xã Quảng Trị, Quảng Trị' },
  VanMieuQTG: { name: 'Văn Miếu Quốc Tử Giám', location: 'Đống Đa, Hà Nội' },
};

export const RecognitionPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<FlowStep>(1);

  const [currentAnalysis, setCurrentAnalysis] = useState<ImageAnalysisData | null>(null);
  const [currentMlResult, setCurrentMlResult] = useState<MLPredictionResult | null>(null);
  const [isInferencing, setIsInferencing] = useState<boolean>(false);

  const handleImageProcessed = (data: ImageAnalysisData, mlResult: MLPredictionResult) => {
    setCurrentAnalysis(data);
    setCurrentMlResult(mlResult);
    setCurrentStep(2);
    setMaxStepReached((prev) => Math.max(prev, 2) as FlowStep);
  };

  const handleRetake = () => {
    setCurrentAnalysis(null);
    setCurrentMlResult(null);
    setCurrentStep(1);
    setMaxStepReached(1);
  };

  const handleGoToStep = (step: FlowStep) => {
    // Khi ảnh đã được xử lý vào quy trình nhận diện, không quay lại phần đăng ảnh ở Bước 1
    if (step === 1 && currentAnalysis) {
      return;
    }
    setCurrentStep(step);
    setMaxStepReached((prev) => Math.max(prev, step) as FlowStep);
  };

  const monumentCode = currentMlResult?.code || 'CBT';
  const rawMonumentName =
    currentMlResult?.displayName ||
    currentMlResult?.className ||
    MONUMENT_METADATA[monumentCode]?.name ||
    'Di Tích Lịch Sử';
  const monumentName = rawMonumentName.replace(/\s*[\(\[][A-Za-z0-9_]+[\)\]]/g, '').trim();
  const monumentLocation =
    MONUMENT_METADATA[monumentCode]?.location || 'Di tích lịch sử văn hóa Việt Nam';
  const confidence = currentMlResult?.confidence || 90;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }} id="page-heritage-recognition">
      {/* Ancient Parchment Title Banner */}
      <AncientParchmentTitleBanner />

      {/* Sequential Flow Step Progress Bar */}
      <FlowStepProgress
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onSelectStep={handleGoToStep}
      />

      {/* STEP 1: ĐĂNG ẢNH THỰC ĐỊA */}
      {currentStep === 1 && (
        <Box id="flow-step-1-upload">
          <ImageUploader
            onImageProcessed={handleImageProcessed}
            isProcessing={isInferencing}
          />
        </Box>
      )}

      {/* STEP 2: NHẬN DIỆN (Result Card hoặc Trạng thái Đang Nhận Diện) */}
      {currentStep === 2 && (
        <Box id="flow-step-2-recognition">
          {isInferencing || !currentMlResult ? (
            <Card sx={{ overflow: 'hidden', boxShadow: '0 4px 20px rgba(42, 31, 23, 0.08)' }}>
              <HeritageCornerFrame>
                <Box
                  sx={{
                    py: { xs: 5, sm: 7 },
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                  id="recognition-inference-loading-view"
                >
                  <CircularProgress
                    size={58}
                    thickness={4}
                    sx={{ color: 'secondary.main', mb: 2.5 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      color: 'primary.dark',
                      letterSpacing: '-0.01em',
                      mb: 1,
                    }}
                  >
                    Đang Nhận Diện Di Tích Lịch Sử...
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      maxWidth: 540,
                      mx: 'auto',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    Mặt trời & hệ thống AI đang nhận diện di tích lịch sử từ hình ảnh...
                  </Typography>

                  {/* Hiển thị ảnh vừa chụp/xử lý */}
                  {currentAnalysis?.imageData && (
                    <Box
                      sx={{
                        maxWidth: 360,
                        width: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #C89D35',
                        boxShadow: '0 6px 20px rgba(42, 31, 23, 0.15)',
                      }}
                    >
                      <Box
                        component="img"
                        src={currentAnalysis.imageData}
                        alt="Ảnh vừa chụp đã xử lý"
                        sx={{
                          width: '100%',
                          maxHeight: 260,
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </HeritageCornerFrame>
            </Card>
          ) : currentAnalysis ? (
            <HeritageRecordCard
              analysisData={currentAnalysis}
              mlResult={currentMlResult}
              enhancementInfo={null}
              onRetake={handleRetake}
              onProceedToLesson={() => handleGoToStep(3)}
            />
          ) : null}
        </Box>
      )}

      {/* STEP 3: SƠ ĐỒ KIẾN THỨC (MINDMAP - SẼ THÊM VÀO SAU, KHÔNG ADD DATA MẪU) */}
      {currentStep === 3 && (
        <Box id="flow-step-3-mindmap">
          <KnowledgeMindMapStep
            monumentCode={monumentCode}
            monumentName={monumentName}
            location={monumentLocation}
            imageData={currentAnalysis?.imageData}
            onNext={() => handleGoToStep(4)}
            onBack={() => handleGoToStep(2)}
          />
        </Box>
      )}

      {/* STEP 4: QUIZ NHANH, VUI */}
      {currentStep === 4 && (
        <Box id="flow-step-4-quiz">
          <QuickFunQuizStep
            monumentCode={monumentCode}
            monumentName={monumentName}
            onNext={() => handleGoToStep(5)}
            onBack={() => handleGoToStep(3)}
          />
        </Box>
      )}

      {/* STEP 5: VR 360 TOUR (SẼ ĐƯỢC NHÚNG SAU) & XONG Ở DƯỚI VÀ THOÁT */}
      {currentStep === 5 && (
        <Box id="flow-step-5-vr">
          <VrTourStep
            monumentCode={monumentCode}
            monumentName={monumentName}
            location={monumentLocation}
            confidence={confidence}
            imageData={currentAnalysis?.imageData}
            onBack={() => handleGoToStep(4)}
            onFinishAndExit={handleRetake}
          />
        </Box>
      )}
    </Container>
  );
};
