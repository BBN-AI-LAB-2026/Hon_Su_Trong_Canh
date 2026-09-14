import React, { useState } from 'react';
import { Container } from '@mui/material';
import {
  AncientParchmentScroll,
  GuideCategoryTabs,
  GuideContentSections,
  GuideFooterAction,
} from '../features/user-guide';

export const UserGuidePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'SEARCH' | 'RECOGNITION'>('RECOGNITION');

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 } }}>
      <AncientParchmentScroll>
        {/* Tiêu đề & Chọn danh mục */}
        <GuideCategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Nội dung các bước hướng dẫn */}
        <GuideContentSections activeCategory={activeCategory} />

        {/* Nút thao tác nhanh chuyển trang */}
        <GuideFooterAction activeCategory={activeCategory} />
      </AncientParchmentScroll>
    </Container>
  );
};
