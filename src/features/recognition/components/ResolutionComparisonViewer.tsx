import React, { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { EnhancedImageResult, ResolutionAnalysisResult } from '../services/resolutionEnhancer';

interface ResolutionComparisonViewerProps {
  analysis: ResolutionAnalysisResult;
  activeImageData: string;
  enhancedResult: EnhancedImageResult | null;
  isEnhancing: boolean;
  onCase1Proceed: () => void;
  onStartEnhancement: () => void;
  onCase2ProceedWithEnhanced: () => void;
}

export const ResolutionComparisonViewer: React.FC<ResolutionComparisonViewerProps> = ({
  analysis,
  activeImageData,
  enhancedResult,
  isEnhancing,
  onCase1Proceed,
  onStartEnhancement,
  onCase2ProceedWithEnhanced,
}) => {
  const [activeCompareTab, setActiveCompareTab] = useState<'after' | 'before' | 'side_by_side'>('side_by_side');

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          bgcolor: '#FAF7F0',
          borderRadius: '6px',
          border: '1px solid #DFD5C6',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
            {enhancedResult ? 'So Sánh Hình Ảnh Trước & Sau Khi Xử Lý' : 'Khảo Sát Khung Ảnh'}
          </Typography>

          {enhancedResult && (
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Button
                size="small"
                variant={activeCompareTab === 'side_by_side' ? 'contained' : 'outlined'}
                onClick={() => setActiveCompareTab('side_by_side')}
                sx={{ py: 0.3, px: 1.5, fontSize: '0.78rem', fontWeight: 700 }}
              >
                Đặt Cạnh Nhau
              </Button>
              <Button
                size="small"
                variant={activeCompareTab === 'after' ? 'contained' : 'outlined'}
                onClick={() => setActiveCompareTab('after')}
                sx={{ py: 0.3, px: 1.5, fontSize: '0.78rem', fontWeight: 700 }}
              >
                Ảnh Đã Làm Nét
              </Button>
              <Button
                size="small"
                variant={activeCompareTab === 'before' ? 'contained' : 'outlined'}
                onClick={() => setActiveCompareTab('before')}
                sx={{ py: 0.3, px: 1.5, fontSize: '0.78rem', fontWeight: 700 }}
              >
                Ảnh Gốc Ban Đầu
              </Button>
            </Box>
          )}
        </Box>

        {/* Displaying Image(s) */}
        {enhancedResult ? (
          activeCompareTab === 'side_by_side' ? (
            /* Side by Side Comparison */
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              {/* Before */}
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={activeImageData}
                  alt="Trước xử lý"
                  sx={{
                    width: '100%',
                    height: { xs: 240, sm: 320 },
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #D6C7B2',
                    filter: 'blur(0.5px)',
                  }}
                />
                <Chip
                  label="Ảnh Gốc (Mờ)"
                  size="small"
                  color="warning"
                  sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 700 }}
                />
              </Box>

              {/* After */}
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={enhancedResult.enhancedDataUrl}
                  alt="Sau khi nâng độ phân giải"
                  sx={{
                    width: '100%',
                    height: { xs: 240, sm: 320 },
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '2px solid #C89D35',
                    boxShadow: '0 4px 14px rgba(200, 157, 53, 0.2)',
                  }}
                />
                <Chip
                  icon={<HighQualityIcon />}
                  label="Ảnh Đã Làm Sắc Nét"
                  size="small"
                  color="success"
                  sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 700 }}
                />
              </Box>
            </Box>
          ) : (
            /* Single View Tab */
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={activeCompareTab === 'after' ? enhancedResult.enhancedDataUrl : activeImageData}
                alt="So sánh ảnh"
                sx={{
                  width: '100%',
                  height: { xs: 260, sm: 360 },
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: activeCompareTab === 'after' ? '2px solid #C89D35' : '1px solid #D6C7B2',
                }}
              />
              <Chip
                label={activeCompareTab === 'after' ? 'Ảnh Đã Làm Sắc Nét' : 'Ảnh Gốc Ban Đầu'}
                color={activeCompareTab === 'after' ? 'success' : 'default'}
                size="small"
                sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 700 }}
              />
            </Box>
          )
        ) : (
          /* Standard Single Preview */
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={activeImageData}
              alt="Ảnh khảo sát"
              sx={{
                width: '100%',
                height: { xs: 260, sm: 360 },
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid #D6C7B2',
              }}
            />
            <Chip
              label={analysis.isGoodResolution ? 'Hình ảnh rõ nét' : 'Chất lượng ảnh thấp (cần làm nét)'}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                bgcolor: 'rgba(42, 31, 23, 0.85)',
                color: '#FAF6F0',
                fontWeight: 700,
              }}
            />
          </Box>
        )}

        {/* Clean Bottom Action Bar */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #EDE4D8', display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
          {analysis.isGoodResolution && !enhancedResult && (
            <Button
              variant="contained"
              color="success"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onCase1Proceed}
              id="btn-case1-bottom-proceed"
              sx={{ fontWeight: 800, py: 1.2, px: 3.5 }}
            >
              Bỏ Qua & Đến Nhận Diện ➔
            </Button>
          )}

          {!analysis.isGoodResolution && !enhancedResult && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AutoFixHighIcon />}
              disabled={isEnhancing}
              onClick={onStartEnhancement}
              id="btn-case2-bottom-enhance"
              sx={{ fontWeight: 800, py: 1.2, px: 3.5 }}
            >
              {isEnhancing ? 'Đang Nâng Độ Phân Giải...' : 'Nâng Độ Phân Giải Bằng AI'}
            </Button>
          )}

          {enhancedResult && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onCase2ProceedWithEnhanced}
              id="btn-case2-bottom-proceed-enhanced"
              sx={{
                fontWeight: 800,
                py: 1.2,
                px: 3.5,
                bgcolor: 'secondary.main',
                color: '#2A1F17',
                '&:hover': { bgcolor: 'secondary.dark', color: '#FFFFFF' },
              }}
            >
              Mang Ảnh Vừa Xử Lý Đến Phần Nhận Diện ➔
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
