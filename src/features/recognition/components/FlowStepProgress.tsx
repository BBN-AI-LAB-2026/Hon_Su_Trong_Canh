import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';

export type FlowStep = 1 | 2 | 3 | 4 | 5;

interface FlowStepProgressProps {
  currentStep: FlowStep;
  maxStepReached: FlowStep;
  isResolutionActive?: boolean;
  onSelectStep?: (step: FlowStep) => void;
}

const STEPS = [
  {
    step: 1 as FlowStep,
    label: 'Đăng Ảnh',
    shortLabel: 'Đăng Ảnh',
    icon: <CameraAltIcon fontSize="small" />,
  },
  {
    step: 2 as FlowStep,
    label: 'Nhận Diện',
    shortLabel: 'Nhận Diện',
    icon: <SearchIcon fontSize="small" />,
  },
  {
    step: 3 as FlowStep,
    label: 'Sơ đồ kiến thức',
    subtitle: '',
    shortLabel: 'Sơ đồ kiến thức',
    icon: <AccountTreeIcon fontSize="small" />,
  },
  {
    step: 4 as FlowStep,
    label: 'Khôi Phục Dòng Thời Gian',
    shortLabel: 'Dòng Thời Gian',
    icon: <TimelineIcon fontSize="small" />,
  },
  {
    step: 5 as FlowStep,
    label: 'VR 360° Tour',
    subtitle: '',
    shortLabel: 'VR 360°',
    icon: <ViewInArIcon fontSize="small" />,
  },
];

export const FlowStepProgress: React.FC<FlowStepProgressProps> = ({
  currentStep,
  maxStepReached,
  isResolutionActive = false,
  onSelectStep,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <HeritageCornerFrame
      id="flow-step-progress-bar"
      sx={{
        width: '100%',
        mb: 3,
        py: { xs: 1.6, sm: 2.2 },
        px: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {STEPS.map((item, idx) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          const isClickable = item.step <= maxStepReached && onSelectStep !== undefined;

          return (
            <React.Fragment key={item.step}>
              {/* Step Node */}
              <Box
                onClick={() => {
                  if (isClickable && onSelectStep) {
                    onSelectStep(item.step);
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isClickable ? 'pointer' : 'default',
                  opacity: item.step <= maxStepReached ? 1 : 0.45,
                  transition: 'all 0.25s ease',
                  flex: 1,
                  maxWidth: { xs: 68, sm: 120, md: 150 },
                  textAlign: 'center',
                  '&:hover': isClickable
                    ? {
                        transform: 'translateY(-2px)',
                      }
                    : {},
                }}
                id={`step-indicator-${item.step}`}
              >
                {/* Step Circle / Medallion */}
                <Box
                  sx={{
                    width: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCurrent
                      ? 'linear-gradient(135deg, #8E201B 0%, #6E1515 100%)'
                      : isCompleted
                      ? 'linear-gradient(135deg, #2D5A27 0%, #1E3F1A 100%)'
                      : '#F3EDE0',
                    color: isCurrent
                      ? '#FAF6F0'
                      : isCompleted
                      ? '#DEC067'
                      : '#8C7765',
                    border: '2px solid',
                    borderColor: isCurrent
                      ? '#C59B27'
                      : isCompleted
                      ? '#C59B27'
                      : '#D6C3A8',
                    boxShadow: isCurrent
                      ? '0 0 0 3px rgba(197, 155, 39, 0.3), 0 3px 10px rgba(142, 32, 27, 0.35)'
                      : isCompleted
                      ? '0 2px 6px rgba(45, 90, 39, 0.25)'
                      : 'inset 0 1px 2px rgba(50, 26, 15, 0.05)',
                    transition: 'all 0.25s ease',
                    mb: 0.85,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#DEC067' }} />
                  ) : (
                    item.icon
                  )}
                </Box>

                {/* Step Text */}
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                    color: isCurrent
                      ? 'error.main'
                      : isCompleted
                      ? '#2D5A27'
                      : 'text.secondary',
                    fontSize: { xs: '0.65rem', sm: '0.78rem' },
                    lineHeight: 1.2,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    letterSpacing: isCurrent ? '0.01em' : 'normal',
                  }}
                >
                  {isMobile ? item.shortLabel : item.label}
                </Typography>

                {!isMobile && item.subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.65rem',
                      color: isCurrent ? 'secondary.dark' : 'text.disabled',
                      fontWeight: 600,
                      lineHeight: 1,
                      mt: 0.2,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                )}
              </Box>

              {/* Connecting Line between steps */}
              {idx < STEPS.length - 1 && (
                <Box
                  sx={{
                    flexGrow: 1,
                    position: 'relative',
                    height: 2.5,
                    bgcolor:
                      idx === 0 && isResolutionActive
                        ? '#C59B27'
                        : currentStep > idx + 1
                        ? '#C59B27'
                        : '#D8C5AA',
                    mb: { xs: 2.5, sm: 3 },
                    transition: 'background-color 0.3s ease',
                    borderRadius: '1px',
                  }}
                >
                  {idx === 0 && isResolutionActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -13,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
                        color: '#261C14',
                        border: '1px solid #C59B27',
                        px: { xs: 0.8, sm: 1.2 },
                        py: 0.3,
                        borderRadius: '10px',
                        fontSize: { xs: '0.6rem', sm: '0.68rem' },
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(197, 155, 39, 0.4)',
                        zIndex: 2,
                      }}
                    >
                      {isMobile ? 'Xử Lý Độ Phân Giải' : 'Giai Đoạn: Xử Lý Độ Phân Giải'}
                    </Box>
                  )}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </HeritageCornerFrame>
  );
};
