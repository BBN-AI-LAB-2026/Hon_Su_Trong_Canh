import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { EnhancedImageResult, ResolutionAnalysisResult } from '../services/resolutionEnhancer';

interface ResolutionStatusPanelsProps {
  analysis: ResolutionAnalysisResult;
  enhancedResult: EnhancedImageResult | null;
  countdown: number;
  isTimerPaused: boolean;
  onTogglePauseTimer: () => void;
  onCase1Proceed: () => void;
  scaleFactor: 2 | 4;
  onChangeScaleFactor: (factor: 2 | 4) => void;
  isEnhancing: boolean;
  enhanceStageText: string;
  enhanceProgress: number;
  onStartEnhancement: () => void;
  onCase2ProceedWithEnhanced: () => void;
}

export const ResolutionStatusPanels: React.FC<ResolutionStatusPanelsProps> = ({
  analysis,
  enhancedResult,
  countdown,
  isTimerPaused,
  onTogglePauseTimer,
  onCase1Proceed,
  scaleFactor,
  onChangeScaleFactor,
  isEnhancing,
  enhanceStageText,
  enhanceProgress,
  onStartEnhancement,
  onCase2ProceedWithEnhanced,
}) => {
  if (analysis.isGoodResolution) {
    /* TRƯỜNG HỢP 1: ĐỘ PHÂN GIẢI TỐT */
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          borderRadius: '6px',
          bgcolor: 'rgba(46, 125, 50, 0.08)',
          border: '1.5px solid #2E7D32',
        }}
        id="case-1-good-resolution-panel"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.dark' }}>
              Hình Ảnh Đạt Chuẩn
            </Typography>
            <Typography variant="body2" sx={{ color: '#1B5E20' }}>
              Hình ảnh rõ nét, sẵn sàng để nhận diện di tích lịch sử.
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onCase1Proceed}
              id="btn-case1-skip-to-recognition"
              sx={{
                py: 1.2,
                px: 3,
                fontWeight: 800,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              Bỏ Qua & Đến Nhận Diện {countdown > 0 ? `(${countdown}s)` : ''}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5, mt: 0.75 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isTimerPaused ? 'Đã tạm dừng đếm ngược' : `Tự động chuyển tiếp sau ${countdown}s`}
              </Typography>
              <IconButton
                size="small"
                onClick={onTogglePauseTimer}
                title={isTimerPaused ? 'Tiếp tục' : 'Tạm dừng'}
              >
                {isTimerPaused ? <PlayArrowIcon fontSize="inherit" /> : <PauseIcon fontSize="inherit" />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  /* TRƯỜNG HỢP 2: ĐỘ PHÂN GIẢI KÉM */
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: '6px',
        bgcolor: enhancedResult ? 'rgba(46, 125, 50, 0.08)' : 'rgba(237, 108, 2, 0.08)',
        border: '1.5px solid',
        borderColor: enhancedResult ? '#2E7D32' : '#ED6C02',
      }}
      id="case-2-poor-resolution-panel"
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 260 }}>
          {enhancedResult ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32, mt: 0.25 }} />
          ) : (
            <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 32, mt: 0.25 }} />
          )}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: enhancedResult ? 'success.dark' : 'warning.dark',
                }}
              >
                Trường Hợp 2: {enhancedResult ? 'Đã Nâng Cấp Sắc Nét Thành Công' : 'Hình Ảnh Chưa Đạt Chuẩn'}
              </Typography>
              <Chip
                label={enhancedResult ? 'Đã Tối Ưu Hóa' : 'Cần Làm Sắc Nét'}
                color={enhancedResult ? 'success' : 'warning'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: enhancedResult ? '#1B5E20' : '#E65100', lineHeight: 1.5 }}>
              {enhancedResult
                ? 'Hình ảnh đã được phục chế và làm sắc nét thành công. Các chi tiết kiến trúc, mái ngói và viền hoa văn đã rõ ràng, sẵn sàng để nhận diện!'
                : 'Hình ảnh bị mờ hoặc chất lượng chưa đạt chuẩn. Vui lòng bấm nâng độ phân giải để AI làm sắc nét các chi tiết kiến trúc trước khi nhận diện.'}
            </Typography>
          </Box>
        </Box>

        {/* Primary Actions for Case 2 */}
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
          {!enhancedResult ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Mức nâng cấp:
                </Typography>
                <Button
                  size="small"
                  variant={scaleFactor === 2 ? 'contained' : 'outlined'}
                  onClick={() => onChangeScaleFactor(2)}
                  sx={{ minWidth: 48, py: 0.25, fontWeight: 700 }}
                >
                  2x
                </Button>
                <Button
                  size="small"
                  variant={scaleFactor === 4 ? 'contained' : 'outlined'}
                  onClick={() => onChangeScaleFactor(4)}
                  sx={{ minWidth: 48, py: 0.25, fontWeight: 700 }}
                >
                  4x HD
                </Button>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AutoFixHighIcon />}
                disabled={isEnhancing}
                onClick={onStartEnhancement}
                id="btn-case2-enhance-resolution"
                sx={{
                  py: 1.2,
                  px: 3,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {isEnhancing ? 'Đang Nâng Độ Phân Giải...' : 'Nâng Độ Phân Giải (AI Super-Resolution)'}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onCase2ProceedWithEnhanced}
              id="btn-case2-proceed-with-enhanced-image"
              sx={{
                py: 1.3,
                px: 3.5,
                fontWeight: 800,
                fontSize: '0.98rem',
                bgcolor: 'secondary.main',
                color: '#2A1F17',
                boxShadow: '0 4px 14px rgba(200, 157, 53, 0.4)',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                  color: '#FFFFFF',
                },
              }}
            >
              Mang Ảnh Vừa Xử Lý Đến Phần Nhận Diện ➔
            </Button>
          )}
        </Box>
      </Box>

      {/* Live Enhancement Progress Bar */}
      {isEnhancing && (
        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px dashed #E5DAC9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
              {enhanceStageText}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.dark' }}>
              {enhanceProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={enhanceProgress}
            color="secondary"
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      )}
    </Paper>
  );
};
