import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import MuseumIcon from '@mui/icons-material/Museum';
import TranslateIcon from '@mui/icons-material/Translate';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import TuneIcon from '@mui/icons-material/Tune';
import { Switch, FormControlLabel } from '@mui/material';
import { adminService } from '../services/adminService';
import { vrTourAdminService } from '../../vr-tour/services/vrTourAdminService';
import { mindmapService } from '../../recognition/services/mindmapService';
import { audioNarrationService } from '../../recognition/services/audioNarrationService';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../types';

interface MonumentAdminOverviewProps {
  onGoToStories: () => void;
  onGoToVr: () => void;
  onGoToMindMap: () => void;
  onGoToAudio: () => void;
  onGoToSettings?: () => void;
}

export const MonumentAdminOverview: React.FC<MonumentAdminOverviewProps> = ({
  onGoToStories,
  onGoToVr,
  onGoToMindMap,
  onGoToAudio,
  onGoToSettings,
}) => {
  const stats = adminService.getMonumentStats();
  const vrSpaces = vrTourAdminService.getEmbeddedSpaces();
  const [mindmaps, setMindmaps] = useState(() => mindmapService.getAllMindMaps());
  const [narrations, setNarrations] = useState(() => audioNarrationService.getAllAudioNarrations());
  const [systemSettings, setSystemSettings] = useState(() => adminService.getSystemSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setMindmaps(mindmapService.getAllMindMaps());
      setNarrations(audioNarrationService.getAllAudioNarrations());
      setSystemSettings(adminService.getSystemSettings());
    };
    window.addEventListener('ditich_mindmaps_updated', handleUpdate);
    window.addEventListener('ditich_audio_narrations_updated', handleUpdate);
    window.addEventListener('ditich_system_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('ditich_mindmaps_updated', handleUpdate);
      window.removeEventListener('ditich_audio_narrations_updated', handleUpdate);
      window.removeEventListener('ditich_system_settings_updated', handleUpdate);
    };
  }, []);

  const totalStories = stats.reduce((acc, curr) => acc + curr.storiesCount, 0);
  const totalMonumentsWithStories = stats.filter((s) => s.storiesCount > 0).length;
  const totalVr = stats.filter((s) => s.hasVrTour).length;
  const totalMindmaps = Object.values(mindmaps).filter((m) => Boolean(m.content)).length;
  const totalAudios = Object.values(narrations).filter((a) => Boolean(a.audioUrl)).length;

  return (
    <Box>
      {/* Cấu Hình Nhanh: Hiển Thị Độ Tin Cậy Nhận Diện */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: '#E2D7C7',
          bgcolor: '#FAF7F0',
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TuneIcon color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                    Tùy Chỉnh Hiển Thị Độ Tin Cậy Nhận Diện
                  </Typography>
                  <Chip
                    size="small"
                    label={systemSettings.showConfidence ? 'Đang Bật' : 'Đang Tắt'}
                    color={systemSettings.showConfidence ? 'success' : 'default'}
                    sx={{ fontWeight: 800, height: 22, fontSize: '0.72rem' }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Mặc định: BẬT"
                    sx={{ height: 22, fontSize: '0.7rem', borderColor: '#D4AF37', color: '#8A6D1C' }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {systemSettings.showConfidence
                    ? 'Đang BẬT: Kết quả nhận diện HIỆN RA độ tin cậy kèm tên di tích.'
                    : 'Đang TẮT: Kết quả nhận diện KHÔNG HIỆN RA độ tin cậy (chỉ hiện tên di tích đã xác thực).'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.showConfidence}
                    onChange={(e) => adminService.updateSystemSettings({ showConfidence: e.target.checked })}
                    color="success"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: systemSettings.showConfidence ? 'success.dark' : 'text.secondary' }}>
                    {systemSettings.showConfidence ? 'BẬT' : 'TẮT'}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              {onGoToSettings && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onGoToSettings}
                  sx={{ textTransform: 'none', borderColor: '#D6C7B2', color: 'primary.dark', whiteSpace: 'nowrap' }}
                >
                  Chi tiết cài đặt
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Card variant="outlined" sx={{ bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountTreeIcon color="secondary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                  {totalMindmaps}/{stats.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Sơ Đồ MindMap (Link)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HeadphonesIcon color="secondary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                  {totalAudios}/{stats.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Audio Thuyết Minh (Link)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TranslateIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                  {totalMonumentsWithStories}/{stats.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Câu Chuyện Di Sản
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ bgcolor: '#FAF7F0', borderColor: '#E5DAC9' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ViewInArIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                  {totalVr}/{stats.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Không Gian VR 360°
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Summary Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#E5DAC9' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAF7F0' }}>
              <TableCell sx={{ fontWeight: 700, width: 50 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 100 }}>Mã</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tên Di Tích Lịch Sử</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 140 }}>
                MindMap (Link)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 140 }}>
                Audio (Link)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 110 }}>
                Câu Chuyện
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 140 }}>
                Không Gian VR 360°
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((item, index) => {
              const vrSpace = vrSpaces.find((v) => v.monumentCode === item.code);
              const hasMindmap = Boolean(mindmaps[item.code]?.content);
              const hasAudio = Boolean(narrations[item.code]?.audioUrl);

              return (
                <TableRow key={item.code} hover>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.code}
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
                  <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                  <TableCell align="center">
                    {hasMindmap ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                        label="Đã có link"
                        size="small"
                        color="success"
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        label="Chưa có"
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.72rem', color: 'text.disabled' }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {hasAudio ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                        label="Đã có Audio"
                        size="small"
                        color="success"
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        label="Chưa có"
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.72rem', color: 'text.disabled' }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${item.storiesCount} bài`}
                      size="small"
                      color={item.storiesCount > 0 ? 'primary' : 'default'}
                      variant={item.storiesCount > 0 ? 'filled' : 'outlined'}
                      sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {vrSpace ? (
                      (() => {
                        const opt = vrSpace.vrOption || (vrSpace.embedType === 'panorama_image' ? 'A' : vrSpace.embedType === 'iframe' ? 'B' : 'C');
                        if (opt === 'A') {
                          return (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                              label="Lựa chọn A: Ảnh 360"
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                            />
                          );
                        }
                        if (opt === 'B') {
                          return (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                              label="Lựa chọn B: Emebed"
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                            />
                          );
                        }
                        // Lựa chọn C (Mặc định)
                        return (
                          <Chip
                            label={vrSpace.embedUrl?.trim() ? 'Lựa chọn C: Đã có URL' : 'Lựa chọn C: Chờ cấp URL'}
                            size="small"
                            color={vrSpace.embedUrl?.trim() ? 'primary' : 'default'}
                            variant={vrSpace.embedUrl?.trim() ? 'filled' : 'outlined'}
                            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                          />
                        );
                      })()
                    ) : (
                      <Chip
                        label="Lựa chọn C (Mặc định)"
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.72rem', color: 'text.disabled' }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action shortcuts */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Button variant="outlined" color="secondary" onClick={onGoToMindMap} startIcon={<AccountTreeIcon />}>
          Quản Trị MindMap
        </Button>
        <Button variant="outlined" color="secondary" onClick={onGoToAudio} startIcon={<HeadphonesIcon />}>
          Quản Trị Audio
        </Button>
        <Button variant="outlined" color="primary" onClick={onGoToStories} startIcon={<TranslateIcon />}>
          Quản Lý Câu Chuyện Đa Ngôn Ngữ
        </Button>
        <Button variant="contained" color="primary" onClick={onGoToVr} startIcon={<ViewInArIcon />}>
          Quản Lý VR 360
        </Button>
      </Box>
    </Box>
  );
};
