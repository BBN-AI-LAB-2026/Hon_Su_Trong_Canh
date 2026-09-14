import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { StepGuideItem } from '../types';

interface GuideStepCardProps {
  step: StepGuideItem;
  prefix: string;
}

export const GuideStepCard: React.FC<GuideStepCardProps> = ({ step, prefix }) => {
  return (
    <Box
      id={`guide-${prefix}-step-${step.stepNumber}`}
      sx={{
        position: 'relative',
        bgcolor: '#FFFDF9',
        borderRadius: '6px',
        border: '1.2px solid #D6C3A8',
        p: { xs: 2.2, sm: 3 },
        boxShadow: '0 3px 12px rgba(70, 36, 14, 0.05)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          borderColor: '#C59B27',
          boxShadow: '0 6px 18px rgba(70, 36, 14, 0.09)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 3,
          left: 3,
          right: 3,
          bottom: 3,
          border: '1px solid rgba(197, 155, 39, 0.22)',
          borderRadius: '4px',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header Thẻ Bước: Ấn triện số + Icon + Tiêu đề */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          pb: 1.5,
          mb: 2,
          borderBottom: '1px solid #EBE0D0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
          {/* Ấn triện số son đỏ mạ đồng */}
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #8E201B 0%, #6E1515 100%)',
              border: '1.5px solid #D4AF37',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFEBB0',
              fontWeight: 900,
              fontSize: '0.92rem',
              boxShadow: '0 2px 6px rgba(110, 21, 21, 0.35)',
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.55rem',
                lineHeight: 1,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#F4D084',
                fontWeight: 700,
              }}
            >
              BƯỚC
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '1rem',
                lineHeight: 1,
                fontWeight: 900,
                color: '#FFFFFF',
              }}
            >
              0{step.stepNumber}
            </Typography>
          </Box>

          {/* Vòng icon */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: 'rgba(197, 155, 39, 0.12)',
              border: '1px solid rgba(197, 155, 39, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {step.icon}
          </Box>

          {/* Tiêu đề bước */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Be Vietnam Pro", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                color: '#7A1F1D',
                lineHeight: 1.25,
              }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#7D5838',
                fontSize: '0.8rem',
                display: 'block',
                mt: 0.2,
              }}
            >
              {step.subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Badge điểm nổi bật */}
        {step.highlightBadge && (
          <Box
            sx={{
              px: 1.5,
              py: 0.4,
              borderRadius: '16px',
              background: 'linear-gradient(180deg, #F9F2E2 0%, #EFE1C5 100%)',
              border: '1px solid #D6B885',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 13, color: '#8E201B' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.74rem',
                color: '#6F3818',
                letterSpacing: '0.01em',
              }}
            >
              {step.highlightBadge}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tóm tắt bước */}
      <Typography
        variant="body2"
        sx={{
          color: '#3C2415',
          fontSize: { xs: '0.9rem', sm: '0.95rem' },
          lineHeight: 1.65,
          mb: 2,
          fontWeight: 500,
        }}
      >
        {step.summary}
      </Typography>

      {/* Danh sách các thao tác cụ thể */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.1,
          mb: 2.2,
          pl: 0.5,
        }}
      >
        {step.keyPoints.map((point, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.2,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 16,
                color: '#9C6F2A',
                mt: '3px',
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: '#4A3324',
                fontSize: '0.88rem',
                lineHeight: 1.55,
              }}
            >
              {point}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Box Lưu Ý / Mẹo Hữu Ích */}
      <Box
        sx={{
          p: { xs: 1.4, sm: 1.8 },
          bgcolor: 'rgba(247, 241, 228, 0.75)',
          border: '1px dashed #C8A870',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.3,
        }}
      >
        <LightbulbOutlinedIcon
          sx={{
            fontSize: 18,
            color: '#9E6714',
            mt: '2px',
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: '#804C0E',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              mb: 0.2,
            }}
          >
            Mẹo Di Sản & Thao Tác Chuẩn Xác
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#5C381E',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            {step.tip}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
