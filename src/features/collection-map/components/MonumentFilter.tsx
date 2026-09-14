import React from 'react';
import { Box, TextField, Tabs, Tab, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { RegionFilter, StatusFilter } from '../types';

interface MonumentFilterProps {
  region: RegionFilter;
  status: StatusFilter;
  searchQuery: string;
  onRegionChange: (region: RegionFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (query: string) => void;
}

export const MonumentFilter: React.FC<MonumentFilterProps> = ({
  region,
  status,
  searchQuery,
  onRegionChange,
  onStatusChange,
  onSearchChange,
}) => {
  return (
    <Box sx={{ mb: 3 }} id="monument-filter-controls">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
        {/* Search input */}
        <TextField
          size="small"
          placeholder="Tìm tên di tích hoặc tỉnh thành..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: { xs: '100%', md: 280 }, bgcolor: 'background.paper', borderRadius: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          id="input-search-monuments"
        />

        {/* Region Tabs */}
        <Tabs
          value={region}
          onChange={(_, val) => onRegionChange(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': { minHeight: 40, py: 0.5, px: 2, fontWeight: 600 },
          }}
        >
          <Tab label="Tất cả vùng miền" value="ALL" />
          <Tab label="Miền Bắc" value="Bắc" />
          <Tab label="Miền Trung" value="Trung" />
          <Tab label="Miền Nam" value="Nam" />
        </Tabs>

        {/* Status Tabs */}
        <Tabs
          value={status}
          onChange={(_, val) => onStatusChange(val)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': { minHeight: 40, py: 0.5, px: 1.5, fontSize: '0.85rem' },
          }}
        >
          <Tab label="Tất cả" value="ALL" />
          <Tab label="Đã mở khóa" value="DISCOVERED" />
          <Tab label="Chưa khám phá" value="LOCKED" />
        </Tabs>
      </Box>
    </Box>
  );
};
