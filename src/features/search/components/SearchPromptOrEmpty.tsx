import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';

interface SearchPromptOrEmptyProps {
  type: 'prompt' | 'no-results';
  searchTerm?: string;
  selectedRegion?: string;
  onClear?: () => void;
}

export const SearchPromptOrEmpty: React.FC<SearchPromptOrEmptyProps> = ({
  type,
  searchTerm = '',
  selectedRegion = 'ALL',
  onClear,
}) => {
  if (type === 'prompt') {
    return (
      <HeritageCornerFrame
        id="prompt-search-box"
        sx={{
          p: { xs: 3.5, sm: 5 },
          textAlign: 'center',
          background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            bgcolor: 'rgba(212, 175, 55, 0.18)',
            border: '2px solid #C59B27',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8E201B',
            boxShadow: '0 4px 14px rgba(142,32,27,0.12)',
          }}
        >
          <SearchIcon sx={{ fontSize: 38 }} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Be Vietnam Pro',
            fontWeight: 800,
            color: '#7B1814',
            mb: 1,
          }}
        >
          Gõ từ khóa vào ô tìm kiếm để tra cứu
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#6A4D32',
            maxWidth: 580,
            mx: 'auto',
            mb: 3,
            lineHeight: 1.6,
            fontSize: { xs: '0.92rem', sm: '1rem' },
          }}
        >
          Vui lòng nhập tên địa danh hoặc di tích lịch sử vào thanh tìm kiếm phía trên để hiển thị thông tin.
        </Typography>
      </HeritageCornerFrame>
    );
  }

  return (
    <HeritageCornerFrame
      id="no-results-box"
      sx={{
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
      }}
    >
      <Box
        sx={{
          width: 76,
          height: 76,
          mx: 'auto',
          mb: 2,
          borderRadius: '50%',
          bgcolor: 'rgba(142,32,27,0.1)',
          border: '2px dashed #8E201B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8E201B',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 42 }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Be Vietnam Pro',
          fontWeight: 800,
          color: '#7B1814',
          mb: 1.2,
        }}
      >
        Không có kết quả
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#6A4D32',
          maxWidth: 550,
          mx: 'auto',
          mb: 2.5,
          lineHeight: 1.6,
        }}
      >
        Không tìm thấy địa danh nào trùng khớp với từ khóa <strong>"{searchTerm}"</strong>
        {selectedRegion !== 'ALL' && ` tại khu vực Miền ${selectedRegion}`}.
        Vui lòng kiểm tra lại chính tả hoặc thử tìm kiếm với các địa danh khác.
      </Typography>

      {onClear && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={onClear}
            sx={{
              borderColor: '#8E201B',
              color: '#8E201B',
              fontWeight: 700,
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(142,32,27,0.08)',
                borderColor: '#7A1F1D',
              },
            }}
          >
            Xóa tìm kiếm cũ
          </Button>
        </Box>
      )}
    </HeritageCornerFrame>
  );
};
