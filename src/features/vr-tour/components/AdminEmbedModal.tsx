import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EmbeddedVrSpace, VrOptionKey, VrOptionType, vrTourAdminService } from '../services/vrTourAdminService';
import { HeritageSeal } from '../../../core/components/HeritageSeal';

interface AdminEmbedModalProps {
  open: boolean;
  onClose: () => void;
  onSpaceAdded: (newSpace: EmbeddedVrSpace) => void;
}

export const AdminEmbedModal: React.FC<AdminEmbedModalProps> = ({
  open,
  onClose,
  onSpaceAdded,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  // Mặc định là C (Nhập URL mở tab mới, URL sẽ cấp sau)
  const [selectedOption, setSelectedOption] = useState<VrOptionKey>('C');
  const [embedUrl, setEmbedUrl] = useState('');
  const [description, setDescription] = useState('');

  const getEmbedTypeForOption = (opt: VrOptionKey): VrOptionType => {
    switch (opt) {
      case 'A':
        return 'panorama_image';
      case 'B':
        return 'iframe';
      case 'C':
      default:
        return 'external_url';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Đối với A và B thì yêu cầu nhập URL, đối với C cho phép để trống (URL sẽ cấp sau)
    if ((selectedOption === 'A' || selectedOption === 'B') && !embedUrl.trim()) {
      return;
    }

    let cleanUrl = embedUrl.trim();
    let rawEmbedCode: string | undefined = undefined;
    if (selectedOption === 'B' || (selectedOption === 'C' && cleanUrl.includes('<iframe'))) {
      if (selectedOption === 'B') {
        rawEmbedCode = embedUrl.trim();
      }
      const iframeMatch = cleanUrl.match(/src=["']([^"']+)["']/);
      if (iframeMatch) {
        cleanUrl = iframeMatch[1];
      }
    }

    const embedType = getEmbedTypeForOption(selectedOption);

    const created = vrTourAdminService.addEmbeddedSpace({
      title: title.trim(),
      location: location.trim() || 'Việt Nam',
      embedType,
      vrOption: selectedOption,
      embedUrl: cleanUrl,
      rawEmbedCode,
      description: description.trim() || (selectedOption === 'C' && !cleanUrl ? 'Không gian VR 360° (Lựa chọn C - URL sẽ cấp sau).' : ''),
    });

    onSpaceAdded(created);
    setTitle('');
    setLocation('');
    setSelectedOption('C');
    setEmbedUrl('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <HeritageSeal text="VR 360" subtext="QUẢN TRỊ" size="small" />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
              Cấu Hình Không Gian VR 360° Mới
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lựa chọn 1 trong 3 phương án cấu hình VR 360 (Mặc định là C)
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <TextField
            label="Tên Di Tích / Không Gian"
            placeholder="Ví dụ: Hoàng Thành Thăng Long, Cố Đô Huế..."
            fullWidth
            size="small"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            id="input-admin-vr-title"
          />

          <TextField
            label="Địa Điểm / Tỉnh Thành"
            placeholder="Ví dụ: Phường Ba Đình, Thành phố Hà Nội..."
            fullWidth
            size="small"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 2 }}
            id="input-admin-vr-location"
          />

          {/* 3 Lựa chọn VR 360: A, B, C */}
          <FormControl component="fieldset" sx={{ mb: 2.5, width: '100%' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#2C1810', mb: 1 }}>
              Phương thức VR 360 Tour (Chọn 1 trong 3):
            </FormLabel>
            <RadioGroup
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value as VrOptionKey)}
              sx={{ gap: 1 }}
            >
              {/* Lựa chọn A */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: selectedOption === 'A' ? '#C89D35' : '#E8E1D5',
                  bgcolor: selectedOption === 'A' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="A"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: selectedOption === 'A' ? '#8C6718' : '#2C1810' }}>
                        Ảnh panorama 360 (nhập từ cloudinary): Lựa chọn A
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Nhập ảnh panorama 360 độ từ Cloudinary, hiển thị trực quan xoay trên Canvas.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>

              {/* Lựa chọn B */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: selectedOption === 'B' ? '#C89D35' : '#E8E1D5',
                  bgcolor: selectedOption === 'B' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="B"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: selectedOption === 'B' ? '#8C6718' : '#2C1810' }}>
                        Emebed (Nhúng): Lựa chọn B
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Nhúng iframe trực tiếp từ Panoee, Kuula, Matterport... hiển thị ngay trong trang.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>

              {/* Lựa chọn C (Mặc định) */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.2,
                  borderRadius: '6px',
                  borderColor: selectedOption === 'C' ? '#C89D35' : '#E8E1D5',
                  bgcolor: selectedOption === 'C' ? 'rgba(200, 157, 53, 0.08)' : '#FAF8F5',
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  value="C"
                  control={<Radio size="small" color="primary" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: selectedOption === 'C' ? '#8C6718' : '#2C1810' }}>
                          Nhập URL (Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập): Lựa chọn C
                        </Typography>
                        <Chip
                          label="Mặc định - URL sẽ cấp sau"
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                        Phương án mặc định. Quản trị viên có thể để trống và cấp URL sau. Khi người dùng nhấp vào nút sẽ mở sang một tab mới là URL đã nhập.
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>

          {/* Dynamic URL Input according to Option */}
          <TextField
            label={
              selectedOption === 'A'
                ? 'Ảnh panorama 360 (nhập từ cloudinary)'
                : selectedOption === 'B'
                ? 'Emebed (Nhúng) - Mã nhúng iframe hoặc URL tour VR 360'
                : 'Nhập URL (Người dùng nhấp vào nút và sẽ mở sang một tab mới là URL đã nhập)'
            }
            placeholder={
              selectedOption === 'A'
                ? 'https://res.cloudinary.com/.../image/upload/...jpg'
                : selectedOption === 'B'
                ? 'https://tour.panoee.net/... hoặc <iframe src="..."></iframe>'
                : 'https://... (Mặc định để trống nếu URL sẽ cấp sau)'
            }
            fullWidth
            multiline={selectedOption === 'B'}
            rows={selectedOption === 'B' ? 2 : 1}
            size="small"
            required={selectedOption === 'A' || selectedOption === 'B'}
            helperText={
              selectedOption === 'C'
                ? 'Lựa chọn C (Mặc định): URL có thể để trống và cấp sau. Người dùng nhấp vào nút sẽ mở sang một tab mới là URL đã nhập.'
                : selectedOption === 'A'
                ? 'Lựa chọn A: Nhập link ảnh panorama 360 toàn cảnh từ Cloudinary.'
                : 'Lựa chọn B: Nhập mã nhúng <iframe> hoặc link tour để nhúng trực tiếp vào giao diện.'
            }
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            sx={{ mb: 2 }}
            id="input-admin-vr-url"
          />

          <TextField
            label="Ghi chú kiến trúc / mô tả (Tùy chọn)"
            placeholder="Niên đại hoặc dấu ấn lịch sử ngắn gọn..."
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="input-admin-vr-desc"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            id="btn-admin-submit-vr"
          >
            Lưu & Kích Hoạt Tour
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
