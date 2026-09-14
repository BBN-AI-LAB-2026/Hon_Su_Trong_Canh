import React from 'react';
import { Box, Typography } from '@mui/material';
import { MonumentBasic } from '../../../core/types/common';
import { MonumentCard } from './MonumentCard';
import { SearchPromptOrEmpty } from './SearchPromptOrEmpty';

interface SearchResultsSectionProps {
  isAdmin: boolean;
  hasSearchInput: boolean;
  hasResults: boolean;
  searchTerm: string;
  selectedRegion: string;
  filteredMonuments: MonumentBasic[];
  onSelectMonument: (monument: MonumentBasic) => void;
  onClearSearch: () => void;
}

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  isAdmin,
  hasSearchInput,
  hasResults,
  searchTerm,
  selectedRegion,
  filteredMonuments,
  onSelectMonument,
  onClearSearch,
}) => {
  return (
    <Box id="search-results-section">
      {/* TRƯỜNG HỢP 1: KHÔNG PHẢI ADMIN VÀ CHƯA GÕ GÌ VÀO BOX TÌM KIẾM */}
      {!isAdmin && !hasSearchInput ? (
        <SearchPromptOrEmpty type="prompt" />
      ) : !hasResults ? (
        /* TRƯỜNG HỢP 2: CÓ NHẬP TÌM KIẾM NHƯNG KHÔNG TÌM THẤY KẾT QUẢ */
        <SearchPromptOrEmpty
          type="no-results"
          searchTerm={searchTerm}
          selectedRegion={selectedRegion}
          onClear={onClearSearch}
        />
      ) : (
        /* TRƯỜNG HỢP 3: CÓ KẾT QUẢ HIỂN THỊ */
        <Box>
          {/* Tiêu đề kết quả */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2.5,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#5C1D17',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              {hasSearchInput ? (
                <>
                  Tìm thấy {filteredMonuments.length} kết quả cho "{searchTerm}"
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <span>Toàn bộ danh sách {filteredMonuments.length} địa danh di tích lịch sử</span>
                </Box>
              )}
            </Typography>
          </Box>

          {/* Danh sách Thẻ Di Tích */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2.8,
            }}
          >
            {filteredMonuments.map((monument) => (
              <MonumentCard
                key={monument.id}
                monument={monument}
                onSelect={onSelectMonument}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
