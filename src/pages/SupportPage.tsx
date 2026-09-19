import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AncientParchmentTitleBanner } from '../features/recognition/components/AncientParchmentTitleBanner';

// Danh sách 14 di tích hỗ trợ kèm địa chỉ xã/phường chuẩn xác
interface SupportedMonument {
  stt: number;
  name: string;
  address: string;
}

const SUPPORTED_MONUMENTS: SupportedMonument[] = [
  {
    stt: 1,
    name: 'Bến Nhà Rồng',
    address: 'Phường Khánh Hội, Thành phố Hồ Chí Minh',
  },
  {
    stt: 2,
    name: 'Chợ Bến Thành',
    address: 'Phường Bến Thành, Thành phố Hồ Chí Minh',
  },
  {
    stt: 3,
    name: 'Cầu Hiền Lương - Sông Bến Hải',
    address: 'Xã Vĩnh Linh, Tỉnh Quảng Trị',
  },
  {
    stt: 4,
    name: 'Chùa Một Cột',
    address: 'Phường Ba Đình, Thành phố Hà Nội',
  },
  {
    stt: 5,
    name: 'Dinh Độc Lập',
    address: 'Phường Bến Thành, Thành phố Hồ Chí Minh',
  },
  {
    stt: 6,
    name: 'Đền Hùng',
    address: 'Xã Hy Cương, Tỉnh Phú Thọ',
  },
  {
    stt: 7,
    name: 'Địa đạo Củ Chi',
    address: 'Xã An Nhơn Tây, Thành phố Hồ Chí Minh',
  },
  {
    stt: 8,
    name: 'Lăng Chủ tịch Hồ Chí Minh',
    address: 'Phường Ba Đình, Thành phố Hà Nội',
  },
  {
    stt: 9,
    name: 'Ngọ Môn',
    address: 'Phường Phú Xuân, Thành phố Huế',
  },
  {
    stt: 10,
    name: 'Nhà Thờ Đức Bà',
    address: 'Phường Sài Gòn, Thành phố Hồ Chí Minh',
  },
  {
    stt: 11,
    name: 'Nhà Tù Côn Đảo',
    address: 'Đặc khu Côn Đảo, Thành phố Hồ Chí Minh',
  },
  {
    stt: 12,
    name: 'Thánh Địa Mỹ Sơn',
    address: 'Xã Thu Bồn, Thành phố Đà Nẵng',
  },
  {
    stt: 13,
    name: 'Thành Cổ Quảng Trị',
    address: 'Phường Quảng Trị, Tỉnh Quảng Trị',
  },
  {
    stt: 14,
    name: 'Văn Miếu Quốc Tử Giám',
    address: 'Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội',
  },
];

export const SupportPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FAF7F0',
        py: { xs: 3, md: 5 },
        backgroundImage: 'radial-gradient(#E8DEC8 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
      id="support-page"
    >
      <Container maxWidth="lg">
        {/* Nền giấy dó chung bao trọn Tiêu đề và Bảng 14 di tích */}
        <AncientParchmentTitleBanner
          line1="DANH SÁCH DI TÍCH ĐƯỢC HỖ TRỢ"
        >
          {/* Bảng danh sách 14 di tích hỗ trợ kèm địa chỉ xã phường */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: '8px',
              border: '1.5px solid #C4A470',
              boxShadow: '0 4px 14px rgba(90, 30, 15, 0.08)',
              overflow: 'hidden',
              bgcolor: 'rgba(255, 253, 249, 0.88)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="Bảng 14 di tích hỗ trợ">
              <TableHead>
                <TableRow
                  sx={{
                    background: 'linear-gradient(180deg, #8E201B 0%, #721612 100%)',
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      color: '#FAF6F0',
                      fontWeight: 800,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      letterSpacing: '0.04em',
                      width: '80px',
                      py: 1.8,
                      borderBottom: '2px solid #C59B27',
                    }}
                  >
                    STT
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FAF6F0',
                      fontWeight: 800,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      letterSpacing: '0.04em',
                      width: { xs: '200px', sm: '280px' },
                      py: 1.8,
                      borderBottom: '2px solid #C59B27',
                    }}
                  >
                    Tên Di Tích
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#FAF6F0',
                      fontWeight: 800,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      letterSpacing: '0.04em',
                      py: 1.8,
                      borderBottom: '2px solid #C59B27',
                    }}
                  >
                    Địa Chỉ
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {SUPPORTED_MONUMENTS.map((item, index) => {
                  const isEven = index % 2 === 1;
                  return (
                    <TableRow
                      key={item.stt}
                      hover
                      sx={{
                        bgcolor: isEven ? 'rgba(248, 240, 226, 0.65)' : 'rgba(255, 253, 249, 0.9)',
                        transition: 'background-color 0.18s ease',
                        '&:hover': {
                          bgcolor: 'rgba(240, 226, 202, 0.95) !important',
                        },
                        borderBottom: '1px solid rgba(196, 164, 112, 0.35)',
                      }}
                    >
                      {/* STT có đánh số */}
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 800,
                          color: '#7B1814',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          py: 1.8,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'rgba(142, 32, 27, 0.08)',
                            border: '1px solid rgba(142, 32, 27, 0.2)',
                            color: '#7B1814',
                            fontWeight: 800,
                          }}
                        >
                          {item.stt}
                        </Box>
                      </TableCell>

                      {/* Tên di tích */}
                      <TableCell
                        sx={{
                          py: 1.8,
                          fontWeight: 500,
                          color: '#5B1513',
                          fontSize: { xs: '0.92rem', sm: '1.02rem' },
                          fontFamily: '"Be Vietnam Pro"',
                        }}
                      >
                        {item.name}
                      </TableCell>

                      {/* Địa chỉ xã phường */}
                      <TableCell
                        sx={{
                          py: 1.8,
                          color: '#3A2E26',
                          fontSize: { xs: '0.88rem', sm: '0.95rem' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon
                            sx={{
                              color: '#8E201B',
                              fontSize: 19,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 500,
                              color: '#3A2E26',
                              fontSize: 'inherit',
                              fontFamily: '"Be Vietnam Pro"',
                            }}
                          >
                            {item.address}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AncientParchmentTitleBanner>
      </Container>
    </Box>
  );
};
