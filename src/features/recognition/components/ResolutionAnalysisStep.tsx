import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  LinearProgress,
  Typography,
} from '@mui/material';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import {
  resolutionEnhancer,
  ResolutionAnalysisResult,
  EnhancedImageResult,
} from '../services/resolutionEnhancer';
import { ImageAnalysisData } from '../services/mlService';
import { ResolutionHeaderControls } from './ResolutionHeaderControls';
import { ResolutionStatusPanels } from './ResolutionStatusPanels';
import { ResolutionComparisonViewer } from './ResolutionComparisonViewer';

interface ResolutionAnalysisStepProps {
  initialImageData: string;
  initialDiagnostics?: ImageAnalysisData | null;
  onProceedToRecognition: (
    finalImageData: string,
    diagnostics: ImageAnalysisData,
    wasEnhanced: boolean,
    enhancementInfo?: {
      originalDimensions: string;
      newDimensions: string;
      scaleFactor: number;
    }
  ) => void;
  onRetake: () => void;
}

export const ResolutionAnalysisStep: React.FC<ResolutionAnalysisStepProps> = ({
  initialImageData,
  initialDiagnostics,
  onProceedToRecognition,
  onRetake,
}) => {
  const [activeImageData, setActiveImageData] = useState<string>(initialImageData);
  const [analysis, setAnalysis] = useState<ResolutionAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);

  // Enhancement state
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhanceProgress, setEnhanceProgress] = useState<number>(0);
  const [enhanceStageText, setEnhanceStageText] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedImageResult | null>(null);

  // Auto-skip timer for Case 1
  const [countdown, setCountdown] = useState<number>(4);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Phân tích độ phân giải khi nạp ảnh
  useEffect(() => {
    let isMounted = true;
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const res = await resolutionEnhancer.analyzeResolution(activeImageData);
        if (isMounted) {
          setAnalysis(res);
          setCountdown(4);
        }
      } catch (err) {
        console.error('Lỗi phân tích độ phân giải:', err);
      } finally {
        if (isMounted) {
          setIsAnalyzing(false);
        }
      }
    };

    runAnalysis();
    return () => {
      isMounted = false;
    };
  }, [activeImageData]);

  const handleCase1Proceed = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const diag: ImageAnalysisData = {
      width: analysis?.width || 800,
      height: analysis?.height || 600,
      aspectRatio: analysis?.aspectRatio || '4:3',
      fileSizeKb: analysis?.fileSizeKb || 120,
      dominantColors: initialDiagnostics?.dominantColors || ['#4A2511', '#C89D35'],
      timestamp: new Date().toISOString(),
      imageData: activeImageData,
    };
    onProceedToRecognition(activeImageData, diag, false);
  };

  // 2. Countdown tự động chuyển tiếp cho Trường hợp 1 (Độ phân giải tốt)
  useEffect(() => {
    if (
      analysis?.isGoodResolution &&
      !isTimerPaused &&
      !enhancedResult &&
      countdown > 0
    ) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (analysis?.isGoodResolution && !isTimerPaused && countdown === 0 && !enhancedResult) {
      handleCase1Proceed();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [analysis, countdown, isTimerPaused, enhancedResult]);

  // Xử lý Trường hợp 2: Bắt đầu nâng độ phân giải (AI Super-Resolution)
  const handleStartEnhancement = async () => {
    setIsEnhancing(true);
    setEnhanceProgress(5);
    setEnhanceStageText('Khởi tạo mô-đun AI Super-Resolution...');

    try {
      const result = await resolutionEnhancer.enhanceResolution(
        activeImageData,
        scaleFactor,
        (percent, stageText) => {
          setEnhanceProgress(percent);
          setEnhanceStageText(stageText);
        }
      );
      setEnhancedResult(result);

      // Tự động chuyển thẳng sang nhận diện ngay khi nâng cấp hoàn tất
      const enhancedDiag: ImageAnalysisData = {
        width: result.newWidth,
        height: result.newHeight,
        aspectRatio: analysis?.aspectRatio || '4:3',
        fileSizeKb: result.newFileSizeKb,
        dominantColors: initialDiagnostics?.dominantColors || ['#4A2511', '#C89D35'],
        timestamp: new Date().toISOString(),
        imageData: result.enhancedDataUrl,
      };

      onProceedToRecognition(
        result.enhancedDataUrl,
        enhancedDiag,
        true,
        {
          originalDimensions: `${result.originalWidth}×${result.originalHeight} px`,
          newDimensions: `${result.newWidth}×${result.newHeight} px`,
          scaleFactor: result.scaleFactor,
        }
      );
    } catch (err) {
      console.error('Lỗi khi nâng độ phân giải:', err);
      alert('Không thể nâng độ phân giải ảnh. Vui lòng thử lại.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Xử lý Trường hợp 2: Mang ảnh vừa xử lý đến phần nhận diện
  const handleCase2ProceedWithEnhanced = () => {
    if (!enhancedResult) return;

    const enhancedDiag: ImageAnalysisData = {
      width: enhancedResult.newWidth,
      height: enhancedResult.newHeight,
      aspectRatio: analysis?.aspectRatio || '4:3',
      fileSizeKb: enhancedResult.newFileSizeKb,
      dominantColors: initialDiagnostics?.dominantColors || ['#4A2511', '#C89D35'],
      timestamp: new Date().toISOString(),
      imageData: enhancedResult.enhancedDataUrl,
    };

    onProceedToRecognition(
      enhancedResult.enhancedDataUrl,
      enhancedDiag,
      true,
      {
        originalDimensions: `${enhancedResult.originalWidth}×${enhancedResult.originalHeight} px`,
        newDimensions: `${enhancedResult.newWidth}×${enhancedResult.newHeight} px`,
        scaleFactor: enhancedResult.scaleFactor,
      }
    );
  };

  const handleSimulateCase = async (type: 'case_1' | 'case_2') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setEnhancedResult(null);

    if (type === 'case_2') {
      setIsAnalyzing(true);
      const lowRes = await resolutionEnhancer.createLowResSimulation(initialImageData, 360);
      setActiveImageData(lowRes);
    } else {
      setActiveImageData(initialImageData);
    }
  };

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }} id="resolution-analysis-card">
      <HeritageCornerFrame>
        {/* Header Bar */}
        <ResolutionHeaderControls
          isGoodResolution={Boolean(analysis?.isGoodResolution)}
          onSimulateCase={handleSimulateCase}
          onRetake={onRetake}
        />

        {/* Loading Bar when reading resolution */}
        {isAnalyzing && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <LinearProgress sx={{ maxWidth: 400, mx: 'auto', mb: 2, height: 6, borderRadius: 3 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Đang kiểm tra chất lượng hình ảnh...
            </Typography>
          </Box>
        )}

        {!isAnalyzing && analysis && (
          <Box>
            {/* Top Status Banner - Divided into 2 Explicit Cases */}
            <ResolutionStatusPanels
              analysis={analysis}
              enhancedResult={enhancedResult}
              countdown={countdown}
              isTimerPaused={isTimerPaused}
              onTogglePauseTimer={() => setIsTimerPaused(!isTimerPaused)}
              onCase1Proceed={handleCase1Proceed}
              scaleFactor={scaleFactor}
              onChangeScaleFactor={setScaleFactor}
              isEnhancing={isEnhancing}
              enhanceStageText={enhanceStageText}
              enhanceProgress={enhanceProgress}
              onStartEnhancement={handleStartEnhancement}
              onCase2ProceedWithEnhanced={handleCase2ProceedWithEnhanced}
            />

            {/* Visual Workspace & Comparison */}
            <ResolutionComparisonViewer
              analysis={analysis}
              activeImageData={activeImageData}
              enhancedResult={enhancedResult}
              isEnhancing={isEnhancing}
              onCase1Proceed={handleCase1Proceed}
              onStartEnhancement={handleStartEnhancement}
              onCase2ProceedWithEnhanced={handleCase2ProceedWithEnhanced}
            />
          </Box>
        )}
      </HeritageCornerFrame>
    </Card>
  );
};
