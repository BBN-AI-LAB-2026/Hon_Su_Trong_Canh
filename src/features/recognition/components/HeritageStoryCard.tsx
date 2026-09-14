import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { MultilingualStory, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../admin/types';
import { HeritageAudioPlayer } from './HeritageAudioPlayer';
import { useAuth } from '../../../core/hooks/useAuth';

interface HeritageStoryCardProps {
  stories: MultilingualStory[];
  monumentName: string;
  audioUrl?: string;
}

export const HeritageStoryCard: React.FC<HeritageStoryCardProps> = ({
  stories,
  monumentName,
  audioUrl,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [activeLangIndex, setActiveLangIndex] = useState<number>(0);
  const currentStory: MultilingualStory | undefined = stories[activeLangIndex];

  const fullStoryToSpeak =
    currentStory?.audioNarrationText ||
    (currentStory?.title
      ? currentStory.language === 'zh'
        ? `${currentStory.title}。${currentStory.content}`
        : `${currentStory.title}. ${currentStory.content}`
      : currentStory?.content) ||
    '';

  return (
    <Box sx={{ mb: 3 }} id="monument-heritage-story-card">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TranslateIcon fontSize="small" color="secondary" /> Thuyết Minh Lịch Sử & Câu Chuyện Di Tích
        </Typography>

        {isAdmin && (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate('/admin/')}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
          >
            Quản Lý Thuyết Minh
          </Button>
        )}
      </Box>

      {stories.length === 0 ? (
        <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF7F0', borderColor: '#E5DAC9', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Chưa có thuyết minh lịch sử cho di tích này. Quản trị viên có thể thêm nội dung trong trang Quản Trị.
          </Typography>
        </Card>
      ) : (
        <Card variant="outlined" sx={{ bgcolor: '#FAF7F0', borderColor: '#E5DAC9', overflow: 'hidden' }}>
          {/* Tabs for Language Selection */}
          <Box sx={{ borderBottom: 1, borderColor: '#E5DAC9', bgcolor: '#F5EFE6', px: 2, pt: 0.5 }}>
            <Tabs
              value={activeLangIndex}
              onChange={(_, newVal) => setActiveLangIndex(newVal)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTab-root': {
                  minHeight: 40,
                  py: 0.5,
                  px: 1.5,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'none',
                },
              }}
            >
              {stories.map((s, idx) => {
                const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === s.language);
                return (
                  <Tab
                    key={s.id || idx}
                    label={`${langConfig?.flag || '🌐'} ${langConfig?.label || s.language.toUpperCase()}`}
                    id={`tab-story-lang-${s.language}`}
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Story Content Area */}
          {currentStory && (
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', lineHeight: 1.3 }}>
                    {currentStory.title}
                  </Typography>
                  {currentStory.era && (
                    <Chip
                      label={currentStory.era}
                      size="small"
                      sx={{ mt: 0.75, height: 22, fontSize: '0.72rem', fontWeight: 600, bgcolor: '#EBE2D3' }}
                    />
                  )}
                </Box>

                {/* Integrated Audio Narration & TTS Player */}
                <HeritageAudioPlayer
                  language={currentStory.language}
                  audioUrl={audioUrl}
                  fullStoryToSpeak={fullStoryToSpeak}
                />
              </Box>

              {/* Main narrative content */}
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75, mt: 1.5, fontSize: '0.92rem' }}>
                {currentStory.content}
              </Typography>

              {currentStory.historicalValue && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E6DCCD' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 0.5 }}>
                    {currentStory.language === 'zh'
                      ? '历史与建筑价值'
                      : currentStory.language === 'en'
                      ? 'Historical & Architectural Value'
                      : 'Giá Trị Lịch Sử & Kiến Trúc'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {currentStory.historicalValue}
                  </Typography>
                </Box>
              )}

              {currentStory.heritageLesson && (
                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E6DCCD' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 0.5 }}>
                    {currentStory.language === 'zh'
                      ? '历史启迪与文化传承'
                      : currentStory.language === 'en'
                      ? 'Heritage Lessons & Legacy'
                      : 'Bài Học Lịch Sử & Di Sản'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {currentStory.heritageLesson}
                  </Typography>
                </Box>
              )}

              {currentStory.keyTakeaways && currentStory.keyTakeaways.length > 0 && (
                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E6DCCD' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 0.6 }}>
                    {currentStory.language === 'zh'
                      ? '核心要点速览'
                      : currentStory.language === 'en'
                      ? 'Key Takeaways'
                      : 'Điểm Cốt Lõi Ghi Nhớ'}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary', fontSize: '0.86rem', lineHeight: 1.6 }}>
                    {currentStory.keyTakeaways.map((point, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{point}</li>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
};
