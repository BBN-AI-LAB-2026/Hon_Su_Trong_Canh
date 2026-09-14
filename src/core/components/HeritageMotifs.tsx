import React from 'react';
import { Box } from '@mui/material';

// Biểu tượng mặt trời Trống Đồng Đông Sơn (Ngọc Lũ)
export const DongSonSunMotif: React.FC<{ size?: number; color?: string; opacity?: number; className?: string }> = ({
  size = 120,
  color = '#C59B27',
  opacity = 0.15,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
    className={className}
    aria-hidden="true"
  >
    {/* Vòng ngoài cùng */}
    <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="1.5" />
    <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" />
    
    {/* Vòng chim Lạc bay */}
    <circle cx="100" cy="100" r="78" stroke={color} strokeWidth="1.2" />
    <circle cx="100" cy="100" r="68" stroke={color} strokeWidth="0.8" />
    
    {/* Họa tiết răng cưa / tiếp tuyến */}
    <circle cx="100" cy="100" r="54" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="100" cy="100" r="46" stroke={color} strokeWidth="1.2" />
    
    {/* Vòng tâm và các tia mặt trời 14 cánh */}
    <circle cx="100" cy="100" r="20" stroke={color} strokeWidth="1.5" />
    <circle cx="100" cy="100" r="8" fill={color} fillOpacity="0.6" />
    
    {/* 14 tia mặt trời nhọn vươn ra */}
    {Array.from({ length: 14 }).map((_, i) => {
      const angle = (i * 360) / 14;
      return (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <polygon points="100,55 96,78 104,78" fill={color} fillOpacity="0.75" />
          <line x1="100" y1="22" x2="100" y2="44" stroke={color} strokeWidth="1.5" />
          {/* Họa tiết lông công / tam giác xen kẽ */}
          <polygon points="100,24 97,36 103,36" fill={color} fillOpacity="0.4" />
        </g>
      );
    })}

    {/* 4 Chim Lạc cách điệu bay ngược chiều kim đồng hồ */}
    {[0, 90, 180, 270].map((angle, i) => (
      <g key={`bird-${i}`} transform={`rotate(${angle} 100 100)`}>
        <path
          d="M 100 24 C 115 22 130 28 140 38 C 132 36 120 34 112 36 C 118 30 128 26 138 27 C 122 23 108 24 100 24 Z"
          fill={color}
          fillOpacity="0.85"
        />
        <circle cx="138" cy="27" r="1.5" fill={color} />
      </g>
    ))}
  </svg>
);

// Họa tiết mây lành cổ truyền Việt Nam (Vân mây cung đình / mỹ thuật truyền thống)
export const AncientCloudMotif: React.FC<{
  width?: number | string;
  height?: number | string;
  color?: string;
  opacity?: number;
  flip?: boolean;
}> = ({ width = 80, height = 36, color = '#C59B27', opacity = 0.35, flip = false }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      opacity,
      transform: flip ? 'scaleX(-1)' : undefined,
    }}
    aria-hidden="true"
  >
    <path
      d="M10 44 C20 44 26 38 32 38 C38 38 42 42 50 42 C62 42 70 32 78 32 C86 32 92 36 102 36 C110 36 116 30 114 24 C112 16 100 14 90 18 C82 12 70 12 62 18 C54 10 40 10 32 18 C24 16 14 22 12 30 C10 38 4 38 2 44 Z"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
      fillOpacity="0.08"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 34 C30 28 38 28 44 32 M58 30 C64 24 74 24 82 28 M88 28 C94 22 102 24 106 30"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="36" cy="31" r="2.5" fill={color} fillOpacity="0.4" />
    <circle cx="72" cy="27" r="2.5" fill={color} fillOpacity="0.4" />
  </svg>
);

// Họa tiết góc cổ truyền (Hoa văn góc triện gỗ / đồng son hoàng gia)
export const HeritageCornerOrnament: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  accentColor?: string;
}> = ({ position, size = 32, color = '#C59B27', accentColor = '#8E201B' }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return undefined;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: 0, left: 0 };
      case 'top-right':
        return { top: 0, right: 0 };
      case 'bottom-left':
        return { bottom: 0, left: 0 };
      case 'bottom-right':
        return { bottom: 0, right: 0 };
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        ...getPositionStyles(),
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 2,
        transform: getTransform(),
      }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Đường viền góc chính */}
        <path d="M 0 0 L 32 0 L 32 4 L 4 4 L 4 32 L 0 32 Z" fill={color} />
        {/* Nét triện gập vuông lồng nhau */}
        <path d="M 8 8 L 24 8 L 24 11 L 11 11 L 11 24 L 8 24 Z" fill={color} fillOpacity="0.75" />
        {/* Điểm nhấn son chu sa ở góc tâm */}
        <rect x="13" y="13" width="5" height="5" fill={accentColor} />
        {/* Họa tiết răng cưa / rãnh nhỏ */}
        <rect x="27" y="1" width="3" height="2" fill={accentColor} />
        <rect x="1" y="27" width="2" height="3" fill={accentColor} />
      </svg>
    </Box>
  );
};

// Họa tiết Hoa Sen Cổ cách điệu
export const AncientLotusMotif: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 40,
  color = '#8E201B',
  opacity = 0.8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
    aria-hidden="true"
  >
    {/* Cánh sen trung tâm */}
    <path
      d="M50 15 C58 35 62 55 50 78 C38 55 42 35 50 15 Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Cánh sen trái */}
    <path
      d="M50 78 C35 65 22 50 25 35 C35 38 45 52 50 78 Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Cánh sen phải */}
    <path
      d="M50 78 C65 65 78 50 75 35 C65 38 55 52 50 78 Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Cánh sen ngoài cùng */}
    <path
      d="M50 82 C28 75 14 62 12 50 C24 50 36 62 50 82 Z"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M50 82 C72 75 86 62 88 50 C76 50 64 62 50 82 Z"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Đế đài sen */}
    <path
      d="M30 84 C40 88 60 88 70 84 C65 92 35 92 30 84 Z"
      fill="#C59B27"
      fillOpacity="0.4"
      stroke="#C59B27"
      strokeWidth="1.5"
    />
  </svg>
);

// Dải hoa văn Đông Sơn dạng đường viền (Border frieze)
export const DongSonBorderFrieze: React.FC<{ height?: number; color?: string; opacity?: number }> = ({
  height = 10,
  color = '#C59B27',
  opacity = 0.5,
}) => (
  <svg
    width="100%"
    height={height}
    style={{ opacity, display: 'block' }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="repeat-x"
  >
    <defs>
      <pattern id="dongson-pattern" width="36" height={height} patternUnits="userSpaceOnUse">
        {/* Răng cưa tam giác */}
        <polygon points="0,0 9,9 18,0" fill={color} fillOpacity="0.75" />
        <polygon points="18,9 27,0 36,9" fill={color} fillOpacity="0.75" />
        <line x1="0" y1={height} x2="36" y2={height} stroke={color} strokeWidth="1" />
        <circle cx="18" cy="4.5" r="1.5" fill={color} />
      </pattern>
    </defs>
    <rect width="100%" height={height} fill="url(#dongson-pattern)" />
  </svg>
);
