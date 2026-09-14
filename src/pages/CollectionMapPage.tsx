import React, { useState, useMemo } from 'react';
import { Container, Box, Typography, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  CollectionStats,
  MonumentFilter,
  MonumentCard,
  MonumentListView,
  collectionService,
  RegionFilter,
  StatusFilter,
  UserMonumentItem,
} from '../features/collection-map';
import { HeritageSeal } from '../core/components/HeritageSeal';

export const CollectionMapPage: React.FC = () => {
  const [monuments] = useState<UserMonumentItem[]>(() =>
    collectionService.getUserMonuments()
  );
  const [stats] = useState(() => collectionService.getStats());

  // Filter state
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filtered monument list
  const filteredMonuments = useMemo(() => {
    return monuments.filter((item) => {
      // Region check
      if (regionFilter !== 'ALL' && item.region !== regionFilter) {
        return false;
      }
      // Status check
      if (statusFilter === 'DISCOVERED' && !item.isDiscovered) {
        return false;
      }
      if (statusFilter === 'LOCKED' && item.isDiscovered) {
        return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCode = item.id.toLowerCase().includes(query);
        return matchesName || matchesLoc || matchesCode;
      }
      return true;
    });
  }, [monuments, regionFilter, statusFilter, searchQuery]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }} id="page-collection-list">
      {/* Header Bar with Heritage Seal */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          pb: 1.5,
          borderBottom: '1px solid #E2D7C7',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HeritageSeal text="DANH MỤC" subtext="DI SẢN" size="medium" />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                color: 'primary.dark',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Danh Mục Di Tích
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Liệt kê danh sách các di tích lịch sử trọng điểm quốc gia theo mã phân định
            </Typography>
          </Box>
        </Box>

        {/* View mode toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
          sx={{ bgcolor: 'background.paper' }}
        >
          <Tooltip title="Xem dạng bảng danh sách">
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> Danh Sách
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Xem dạng lưới thẻ">
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} /> Dạng Thẻ
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>

      {/* Stats Header */}
      <CollectionStats stats={stats} />

      {/* Filter and Search Bar */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <MonumentFilter
          region={regionFilter}
          status={statusFilter}
          searchQuery={searchQuery}
          onRegionChange={setRegionFilter}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
        />
      </Box>

      {/* Monument List / Grid Display */}
      {viewMode === 'list' ? (
        <Box sx={{ mb: 4 }}>
          <MonumentListView monuments={filteredMonuments} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2.5,
            mt: 2,
            mb: 4,
          }}
          id="monuments-grid"
        >
          {filteredMonuments.map((item) => (
            <Box key={item.id}>
              <MonumentCard monument={item} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};
