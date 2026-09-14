import React, { useState, useMemo } from 'react';
import { Container, Box } from '@mui/material';
import { AncientParchmentTitleBanner } from '../features/recognition/components/AncientParchmentTitleBanner';
import { ALL_MAP_MONUMENTS } from '../features/collection-map/constants/mapConstants';
import { MonumentBasic } from '../core/types/common';
import { useAuth } from '../core/hooks/useAuth';
import {
  removeVietnameseTones,
  SearchHeader,
  SearchResultsSection,
  MonumentDetailView,
} from '../features/search';

export const FindMonumentPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'Bắc' | 'Trung' | 'Nam'>('ALL');

  // Step 3 state
  const [selectedMonument, setSelectedMonument] = useState<MonumentBasic | null>(null);

  // Filter monuments based on search term & region
  const filteredMonuments = useMemo(() => {
    const rawQuery = searchTerm.trim();
    const normalizedQuery = removeVietnameseTones(rawQuery);

    // Khi được đăng nhập admin thì mới có thể thấy được toàn bộ danh sách 14 di tích
    // Nếu không thì không thấy toàn bộ danh sách nếu không gõ bất cứ thứ gì vào box tìm kiếm
    if (!isAdmin && !rawQuery) {
      return [];
    }

    return ALL_MAP_MONUMENTS.filter((m) => {
      // Region filter
      if (selectedRegion !== 'ALL' && m.region !== selectedRegion) {
        return false;
      }

      // Keyword filter
      if (!normalizedQuery) {
        return true;
      }

      const normalizedName = removeVietnameseTones(m.name);
      const normalizedLoc = removeVietnameseTones(m.location);
      const normalizedDesc = removeVietnameseTones(m.shortDescription || '');
      const normalizedCode = removeVietnameseTones(m.id);

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedLoc.includes(normalizedQuery) ||
        normalizedDesc.includes(normalizedQuery) ||
        normalizedCode.includes(normalizedQuery)
      );
    });
  }, [searchTerm, selectedRegion, isAdmin]);

  const hasSearchInput = searchTerm.trim().length > 0;
  const hasResults = filteredMonuments.length > 0;

  const handleSelectMonument = (monument: MonumentBasic) => {
    setSelectedMonument(monument);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setSelectedMonument(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedRegion('ALL');
  };

  return (
    <Box
      id="find-monument-page"
      sx={{
        minHeight: '100vh',
        backgroundImage: `
          radial-gradient(ellipse at 50% 15%, rgba(212, 175, 55, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 10% 80%, rgba(123, 24, 20, 0.08) 0%, transparent 45%),
          linear-gradient(180deg, #FBF8F1 0%, #F5EEDD 100%)
        `,
        pt: { xs: 2.5, sm: 3.5 },
        pb: { xs: 6, sm: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Banner Cuộn Thư Cổ Điển */}
        <AncientParchmentTitleBanner
          line1="Tra Cứu Địa Danh"
          line2="Di Tích Lịch Sử"
        />

        {!selectedMonument ? (
          <Box>
            {/* KHU VỰC BƯỚC 1: KHUNG NHẬP TÊN ĐỊA DANH */}
            <SearchHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />

            {/* KHU VỰC BƯỚC 2: KẾT QUẢ TRA CỨU */}
            <SearchResultsSection
              isAdmin={isAdmin}
              hasSearchInput={hasSearchInput}
              hasResults={hasResults}
              searchTerm={searchTerm}
              selectedRegion={selectedRegion}
              filteredMonuments={filteredMonuments}
              onSelectMonument={handleSelectMonument}
              onClearSearch={handleClearSearch}
            />
          </Box>
        ) : (
          /* KHU VỰC BƯỚC 3: CHI TIẾT ĐỊA DANH ĐÃ CHỌN */
          <MonumentDetailView
            monument={selectedMonument}
            onBackToSearch={handleBackToSearch}
          />
        )}
      </Container>
    </Box>
  );
};
