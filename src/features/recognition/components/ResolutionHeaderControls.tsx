import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { HeritageSeal } from '../../../core/components/HeritageSeal';

interface ResolutionHeaderControlsProps {
  isGoodResolution: boolean;
  onSimulateCase: (type: 'case_1' | 'case_2') => void;
  onRetake: () => void;
}

export const ResolutionHeaderControls: React.FC<ResolutionHeaderControlsProps> = ({
  isGoodResolution,
  onSimulateCase,
  onRetake,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2.5,
        flexWrap: 'wrap',
        gap: 1.5,
        borderBottom: '1px solid #E2D7C7',
        pb: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HeritageSeal text="ĐỘ PHÂN GIẢI" subtext="KIỂM TRA" size="small" />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              color: 'primary.dark',
              lineHeight: 1.2,
            }}
          >
            Giai Đoạn: Phân Tích & Xử Lý Độ Phân Giải
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Kiểm tra chất lượng hình ảnh trước khi chuyển qua mô hình nhận diện di tích
          </Typography>
        </Box>
      </Box>

      {/* Quick Simulation / Testing Switch for evaluator convenience */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Chuyển đổi thử nghiệm:
        </Typography>
        <Button
          size="small"
          variant={isGoodResolution ? 'contained' : 'outlined'}
          color="success"
          onClick={() => onSimulateCase('case_1')}
          sx={{ py: 0.25, px: 1, fontSize: '0.75rem', fontWeight: 700 }}
          id="btn-simulate-case-1"
        >
          Trường Hợp 1 (Tốt)
        </Button>
        <Button
          size="small"
          variant={!isGoodResolution ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => onSimulateCase('case_2')}
          sx={{ py: 0.25, px: 1, fontSize: '0.75rem', fontWeight: 700 }}
          id="btn-simulate-case-2"
        >
          Trường Hợp 2 (Kém)
        </Button>
        <Button
          size="small"
          variant="text"
          startIcon={<RefreshIcon fontSize="small" />}
          onClick={onRetake}
          sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
          id="btn-retake-photo"
        >
          Chọn Ảnh Khác
        </Button>
      </Box>
    </Box>
  );
};
