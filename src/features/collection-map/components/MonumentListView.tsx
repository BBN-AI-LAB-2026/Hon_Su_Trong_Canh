import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Link as RouterLink } from 'react-router-dom';
import { UserMonumentItem } from '../types';

interface MonumentListViewProps {
  monuments: UserMonumentItem[];
}

export const MonumentListView: React.FC<MonumentListViewProps> = ({ monuments }) => {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        borderColor: '#E5DAC9',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
      id="monuments-table-list"
    >
      <Table sx={{ minWidth: 700 }} size="medium">
        <TableHead>
          <TableRow sx={{ bgcolor: '#FAF7F0', borderBottom: '2px solid #E5DAC9' }}>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 60 }}>STT</TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 110 }}>Mã</TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 70 }}>Ảnh</TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif' }}>Tên Di Tích & Lịch Sử</TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 170 }}>Vị Trí / Vùng Miền</TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 130 }} align="center">
              Trạng Thái
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif', width: 160 }} align="right">
              Trải Nghiệm
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                Không tìm thấy di tích nào phù hợp với bộ lọc tìm kiếm.
              </TableCell>
            </TableRow>
          ) : (
            monuments.map((item, index) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>{index + 1}</TableCell>
                <TableCell>
                  <Chip
                    label={item.id}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      bgcolor: 'rgba(200, 157, 53, 0.15)',
                      color: 'primary.dark',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={item.thumbnailUrl}
                    alt={item.name}
                    sx={{
                      width: 48,
                      height: 48,
                      border: '1px solid #E2D7C7',
                      filter: item.isDiscovered ? 'none' : 'grayscale(70%)',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                      mt: 0.3,
                    }}
                  >
                    {item.shortDescription}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 15, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {item.location}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Miền ${item.region}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {item.isDiscovered ? (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                      label="Đã mở khóa"
                      color="success"
                      size="small"
                      sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700 }}
                    />
                  ) : (
                    <Chip
                      icon={<LockIcon sx={{ fontSize: '14px !important' }} />}
                      label="Chưa mở khóa"
                      size="small"
                      variant="outlined"
                      sx={{ height: 24, fontSize: '0.75rem', color: 'text.secondary' }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Xem thực tế ảo VR 360°">
                      <Button
                        component={RouterLink}
                        to="/vr-tour"
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<ViewInArIcon fontSize="small" />}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.5, px: 1 }}
                      >
                        VR 360°
                      </Button>
                    </Tooltip>
                    <Tooltip title="Nhận diện di tích qua ảnh">
                      <Button
                        component={RouterLink}
                        to="/nhandien/"
                        size="small"
                        variant="text"
                        color="secondary"
                        sx={{ minWidth: 'auto', p: 0.8 }}
                      >
                        <CameraAltIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
