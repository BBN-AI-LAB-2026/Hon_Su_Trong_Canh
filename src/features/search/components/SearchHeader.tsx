import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
}) => {
  return (
    <HeritageCornerFrame
      id="box-search-input"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        mb: 4,
        background: 'linear-gradient(180deg, #FAF4E8 0%, #F5EBDA 100%)',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Be Vietnam Pro"',
            fontWeight: 700,
            color: '#7B1814',
            mb: 0.5,
          }}
        >
          Gõ tên địa danh cần tra cứu
        </Typography>
      </Box>

      {/* Ô Nhập Tìm Kiếm */}
      <TextField
        fullWidth
        id="input-monument-search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Gõ tên địa danh cần tra cứu (ví dụ: Chợ Bến Thành, Văn Miếu, Dinh Độc Lập...)"
        variant="outlined"
        autoComplete="off"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8E201B', fontSize: 28 }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Xóa từ khóa"
                  onClick={onClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon sx={{ color: '#7E6348' }} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              fontFamily: '"Be Vietnam Pro"',
              fontSize: { xs: '0.95rem', sm: '1.08rem' },
              fontWeight: 500,
              bgcolor: '#FFFDF9',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#C59B27',
                borderWidth: '1.5px',
              },
              '&:hover fieldset': {
                borderColor: '#8E201B',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8E201B',
                borderWidth: '2px',
              },
            },
          },
        }}
      />
    </HeritageCornerFrame>
  );
};
