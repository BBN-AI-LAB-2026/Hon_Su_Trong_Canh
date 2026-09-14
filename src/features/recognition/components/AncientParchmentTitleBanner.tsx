import React from 'react';
import { Box, Typography } from '@mui/material';

// Hoa văn Trống Đồng Đông Sơn chi tiết ở hai bên (Mặt trời, chim Lạc, vành răng cưa)
export const DongSonFriezeMotif: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 110,
  color = '#8F632B',
  opacity = 0.22,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
    aria-hidden="true"
  >
    {/* Vành tròn ngoài cùng & chấm gạch cổ */}
    <circle cx="70" cy="70" r="66" stroke={color} strokeWidth="1.6" />
    <circle cx="70" cy="70" r="62" stroke={color} strokeWidth="0.8" strokeDasharray="2 3" />
    <circle cx="70" cy="70" r="58" stroke={color} strokeWidth="1" />

    {/* Vành răng cưa tam giác */}
    {Array.from({ length: 28 }).map((_, i) => {
      const angle = (i * 360) / 28;
      return (
        <g key={`saw-${i}`} transform={`rotate(${angle} 70 70)`}>
          <polygon points="70,12 67,17 73,17" fill={color} fillOpacity="0.75" />
        </g>
      );
    })}

    {/* Vành chim Lạc bay ngược chiều kim đồng hồ */}
    <circle cx="70" cy="70" r="48" stroke={color} strokeWidth="0.9" />
    <circle cx="70" cy="70" r="38" stroke={color} strokeWidth="0.9" />
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <g key={`bird-${i}`} transform={`rotate(${angle} 70 70)`}>
        <path
          d="M 70 24 C 79 23 88 27 94 33 C 89 32 82 31 77 32 C 81 28 87 26 93 26 C 83 24 74 24 70 24 Z"
          fill={color}
          fillOpacity="0.85"
        />
        <circle cx="93" cy="26" r="1.1" fill={color} />
      </g>
    ))}

    {/* Tâm mặt trời 14 tia sáng */}
    <circle cx="70" cy="70" r="26" stroke={color} strokeWidth="1.2" />
    <circle cx="70" cy="70" r="14" stroke={color} strokeWidth="1" />
    <circle cx="70" cy="70" r="6" fill={color} fillOpacity="0.85" />
    {Array.from({ length: 14 }).map((_, i) => {
      const angle = (i * 360) / 14;
      return (
        <g key={`ray-${i}`} transform={`rotate(${angle} 70 70)`}>
          <polygon points="70,44 67,56 73,56" fill={color} fillOpacity="0.8" />
          <line x1="70" y1="56" x2="70" y2="64" stroke={color} strokeWidth="1.2" />
        </g>
      );
    })}
  </svg>
);

// Họa tiết Mây truyền thống cung đình (Auspicious Clouds)
export const AuspiciousCloudMotif: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  flip?: boolean;
}> = ({ width = 68, height = 28, color = '#A87635', opacity = 0.28, flip = false }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      opacity,
      transform: flip ? 'scaleX(-1)' : undefined,
    }}
    aria-hidden="true"
  >
    <path
      d="M8 38
         C16 38, 22 34, 28 34
         C34 34, 38 38, 46 38
         C56 38, 62 28, 70 28
         C76 28, 82 32, 90 32
         C96 32, 100 26, 98 20
         C96 14, 86 12, 78 16
         C70 10, 60 10, 52 16
         C46 8, 32 8, 26 16
         C18 14, 10 20, 8 26
         C6 32, 4 38, 8 38
         Z"
      stroke={color}
      strokeWidth="1.3"
      fill={color}
      fillOpacity="0.08"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 28 C26 22 34 22 38 26 M50 24 C56 18 64 18 70 22"
      stroke={color}
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <circle cx="30" cy="24" r="1.8" fill={color} fillOpacity="0.3" />
    <circle cx="60" cy="20" r="1.8" fill={color} fillOpacity="0.3" />
  </svg>
);

// Mép Cuộn Giấy Liền Khối (Integrated Seamless Scroll Roll Ends)
export const SeamlessScrollRollEnd: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const isLeft = position === 'left';

  return (
    <Box
      sx={{
        width: { xs: 22, sm: 28, md: 32 },
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 4,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Đầu núm cuộn trên (Gỗ mun / gụ bọc đồng vàng triều đình) */}
      <Box
        sx={{
          width: { xs: 18, sm: 22, md: 26 },
          height: { xs: 10, sm: 12 },
          mt: { xs: '-5px', sm: '-6px' },
          borderRadius: '3px 3px 1px 1px',
          background: 'linear-gradient(90deg, #381A0B 0%, #7E451F 45%, #C2914F 60%, #35170A 100%)',
          border: '1px solid #D4AF37',
          boxShadow: '0 2px 5px rgba(40, 18, 8, 0.45)',
          position: 'relative',
          zIndex: 5,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            height: 1.5,
            bgcolor: '#FFE6A0',
            opacity: 0.7,
            borderRadius: '1px',
          },
        }}
      />

      {/* Thân cuộn tròn của tờ giấy dó - DÍNH LIỀN TRỰC TIẾP vào mép của thân giấy */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          position: 'relative',
          borderRadius: isLeft ? '5px 0 0 5px' : '0 5px 5px 0',
          // Hiệu ứng trụ tròn cuộn 3D của tấm giấy dó
          background: isLeft
            ? `linear-gradient(90deg, 
                #6F4522 0%, 
                #A27541 12%, 
                #E3C89B 35%, 
                #FFF4DE 58%, 
                #D5B685 82%, 
                #8D5D2E 95%, 
                #503013 100%)`
            : `linear-gradient(90deg, 
                #503013 0%, 
                #8D5D2E 5%, 
                #D5B685 18%, 
                #FFF4DE 42%, 
                #E3C89B 65%, 
                #A27541 88%, 
                #6F4522 100%)`,
          borderTop: '1.5px solid #A8814D',
          borderBottom: '1.5px solid #A8814D',
          borderLeft: isLeft ? '1.5px solid #6E4420' : 'none',
          borderRight: !isLeft ? '1.5px solid #6E4420' : 'none',
          boxShadow: isLeft
            ? 'inset 2px 0 4px rgba(255, 255, 255, 0.4), inset -3px 0 5px rgba(60, 30, 10, 0.55), -3px 3px 8px rgba(60, 30, 10, 0.22)'
            : 'inset -2px 0 4px rgba(255, 255, 255, 0.4), inset 3px 0 5px rgba(60, 30, 10, 0.55), 3px 3px 8px rgba(60, 30, 10, 0.22)',
          // Gân chỉ cuộn giấy
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            [isLeft ? 'right' : 'left']: 2,
            width: 1.5,
            bgcolor: 'rgba(75, 40, 15, 0.4)',
          },
        }}
      />

      {/* Đầu núm cuộn dưới (Gỗ mun / gụ bọc đồng vàng triều đình) */}
      <Box
        sx={{
          width: { xs: 18, sm: 22, md: 26 },
          height: { xs: 10, sm: 12 },
          mb: { xs: '-5px', sm: '-6px' },
          borderRadius: '1px 1px 3px 3px',
          background: 'linear-gradient(90deg, #381A0B 0%, #7E451F 45%, #C2914F 60%, #35170A 100%)',
          border: '1px solid #D4AF37',
          boxShadow: '0 2px 5px rgba(40, 18, 8, 0.45)',
          position: 'relative',
          zIndex: 5,
        }}
      />
    </Box>
  );
};

/**
 * AncientParchmentTitleBanner
 * Redesign chuẩn xác box tiêu đề theo đúng yêu cầu:
 * 1. Banner giấy cổ giấy dó/parchment màu kem, be, nâu nhạt với texture xơ giấy tinh tế.
 * 2. Hai mép cuộn giấy ở bên trái và bên phải GẮN LIỀN, DÍNH TRỰC TIẾP vào hai đầu của box, tạo cảm giác một cuộn thư hoàn chỉnh.
 * 3. XOÁ HOÀN TOÀN hình bản đồ và các họa tiết bản đồ bên trong box. Giữ nền giấy cổ sạch và hoa văn lịch sử tinh tế (Trống Đồng Đông Sơn, vân mây cung đình, chỉ vàng đôi).
 * 4. XOÁ LOGO, giữ nguyên chính xác nội dung tiêu đề 2 dòng, dùng font "Be Vietnam Pro" màu đỏ nâu cổ điển.
 * 5. Chỉ thay đổi duy nhất box tiêu đề, không thay đổi bất kỳ thành phần nào khác.
 */
export interface AncientParchmentTitleBannerProps {
  line1?: string;
  line2?: string;
  children?: React.ReactNode;
}

export const AncientParchmentTitleBanner: React.FC<AncientParchmentTitleBannerProps> = ({
  line1 = 'Hành Trình Khám Phá',
  line2 = 'Di Tích Lịch Sử',
  children,
}) => {
  return (
    <Box
      id="ancient-parchment-title-banner"
      sx={{
        position: 'relative',
        mx: 'auto',
        mb: 2.8,
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        // Hiệu ứng bóng đổ mềm của toàn bộ cuộn thư lên bề mặt
        filter: 'drop-shadow(0 7px 20px rgba(70, 36, 14, 0.14))',
      }}
    >
      {/* 1. Mép Cuộn Giấy Bên Trái - Gắn liền, dính trực tiếp vào đầu box */}
      <SeamlessScrollRollEnd position="left" />

      {/* 2. Thân Cuộn Thư Giấy Dó Cổ Truyền (Center Parchment Sheet) */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          // Nền giấy dó màu kem, be, nâu nhạt mềm mại, sạch và thanh nhã
          background: `
            linear-gradient(180deg, #FAF4E8 0%, #F5E9CE 25%, #EFE1C3 75%, #E5CF9F 100%)
          `,
          borderTop: '1.5px solid #C4A470',
          borderBottom: '1.5px solid #B08E58',
          // Khử viền trái & phải để dính liền hoàn toàn vào 2 mép cuộn
          borderLeft: 'none',
          borderRight: 'none',
          // Đổ bóng nếp gấp mép giấy cuộn nối tiếp tự nhiên vào thân giấy
          boxShadow: `
            inset 12px 0 14px -6px rgba(90, 48, 18, 0.38),
            inset -12px 0 14px -6px rgba(90, 48, 18, 0.38),
            inset 0 6px 12px -5px rgba(160, 110, 50, 0.15),
            inset 0 -6px 12px -5px rgba(120, 80, 30, 0.22)
          `,
          py: { xs: 2.2, sm: 2.8, md: 3 },
          px: { xs: 2, sm: 3.5, md: 5 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',

          // Texture xơ giấy dó / hạt giấy cổ tinh tế (subtle fibers & organic grain)
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 1,
            backgroundImage: `
              radial-gradient(#B88B4A 0.75px, transparent 0.75px),
              radial-gradient(#7C4E1E 0.6px, transparent 0.6px)
            `,
            backgroundSize: '24px 24px, 36px 36px',
            backgroundPosition: '0 0, 12px 18px',
          },

          // Viền chỉ vàng đôi hoàng gia viền quanh thân giấy
          '&::after': {
            content: '""',
            position: 'absolute',
            top: { xs: 6, sm: 8 },
            bottom: { xs: 6, sm: 8 },
            left: { xs: 8, sm: 14 },
            right: { xs: 8, sm: 14 },
            border: '1px solid rgba(184, 134, 45, 0.45)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 2,
            boxShadow: 'inset 0 0 0 1.5px rgba(255, 248, 230, 0.35)',
          },
        }}
      >
        {/* ================= HỌA TIẾT LỊCH SỬ TINH TẾ (KHÔNG BẢN ĐỒ) ================= */}

        {/* Trống Đồng Đông Sơn bên Trái */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: -18, sm: 4, md: 18 },
            top: children ? 70 : '50%',
            transform: children ? 'none' : 'translateY(-50%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <DongSonFriezeMotif size={118} color="#946626" opacity={0.24} />
        </Box>

        {/* Trống Đồng Đông Sơn bên Phải */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -18, sm: 4, md: 18 },
            top: children ? 70 : '50%',
            transform: children ? 'scaleX(-1)' : 'translateY(-50%) scaleX(-1)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <DongSonFriezeMotif size={118} color="#946626" opacity={0.24} />
        </Box>

        {/* Mây truyền thống góc trên trái */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 6, sm: 10 },
            left: { xs: 12, sm: 30, md: 56 },
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <AuspiciousCloudMotif width={65} height={26} color="#A87635" opacity={0.32} />
        </Box>

        {/* Mây truyền thống góc trên phải */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 6, sm: 10 },
            right: { xs: 12, sm: 30, md: 56 },
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <AuspiciousCloudMotif width={65} height={26} color="#A87635" opacity={0.32} flip />
        </Box>

        {/* ================= NỘI DUNG TIÊU ĐỀ 2 DÒNG (FONT "Be Vietnam Pro" MÀU ĐỎ NÂU) ================= */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100%',
          }}
        >
          {/* Điểm hoa văn triện son thanh tao phía trên */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              mb: { xs: 0.5, sm: 0.7 },
              opacity: 0.75,
            }}
            aria-hidden="true"
          >
            <Box sx={{ width: { xs: 24, sm: 36 }, height: '1px', bgcolor: '#A06E35' }} />
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                bgcolor: '#7A1F1D',
                boxShadow: '0 0 3px #7A1F1D',
              }}
            />
            <Box sx={{ width: { xs: 24, sm: 36 }, height: '1px', bgcolor: '#A06E35' }} />
          </Box>

          {/* DÒNG 1: TIÊU ĐỀ */}
          <Typography
            component={line2 ? 'span' : 'h1'}
            sx={{
              fontFamily: '"Be Vietnam Pro", sans-serif',
              fontWeight: line2 ? 700 : 900,
              fontSize: line2
                ? { xs: '1.05rem', sm: '1.32rem', md: '1.52rem' }
                : { xs: '1.35rem', sm: '1.8rem', md: '2.2rem' },
              color: line2 ? '#7A1F1D' : '#5B1513',
              letterSpacing: { xs: '0.04em', sm: '0.06em' },
              lineHeight: 1.25,
              textTransform: 'uppercase',
              textShadow: line2
                ? '0 1px 1px rgba(255, 252, 245, 0.95), 0 2px 4px rgba(90, 30, 15, 0.1)'
                : `
                  0 1px 2px rgba(255, 250, 240, 1),
                  0 2px 6px rgba(70, 20, 10, 0.18),
                  0 4px 12px rgba(90, 25, 15, 0.08)
                `,
            }}
          >
            {line1}
          </Typography>

          {line2 ? (
            <>
              {/* Dải phân cách hoa văn hoàng gia giữa 2 dòng */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.4,
                  my: { xs: 0.35, sm: 0.45 },
                  width: '100%',
                  maxWidth: 300,
                }}
                aria-hidden="true"
              >
                <Box
                  sx={{
                    flex: 1,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, #B8860B 60%, #7A1F1D 100%)',
                  }}
                />
                <Box
                  sx={{
                    width: 6.5,
                    height: 6.5,
                    transform: 'rotate(45deg)',
                    bgcolor: '#7A1F1D',
                    border: '1px solid #D4AF37',
                    boxShadow: '0 0 3px rgba(122, 31, 29, 0.35)',
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: '1px',
                    background: 'linear-gradient(90deg, #7A1F1D 0%, #B8860B 40%, transparent 100%)',
                  }}
                />
              </Box>

              {/* DÒNG 2: TIÊU ĐỀ CHÍNH / DÒNG DƯỚI */}
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Be Vietnam Pro", sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
                  color: '#5B1513',
                  letterSpacing: { xs: '0.05em', sm: '0.08em' },
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  textShadow: `
                    0 1px 2px rgba(255, 250, 240, 1),
                    0 2px 6px rgba(70, 20, 10, 0.18),
                    0 4px 12px rgba(90, 25, 15, 0.08)
                  `,
                }}
              >
                {line2}
              </Typography>
            </>
          ) : null}

          {children && (
            <Box
              sx={{
                width: '100%',
                mt: { xs: 2.5, sm: 3 },
                position: 'relative',
                zIndex: 3,
              }}
            >
              {children}
            </Box>
          )}
        </Box>
      </Box>

      {/* 3. Mép Cuộn Giấy Bên Phải - Gắn liền, dính trực tiếp vào đầu box */}
      <SeamlessScrollRollEnd position="right" />
    </Box>
  );
};
