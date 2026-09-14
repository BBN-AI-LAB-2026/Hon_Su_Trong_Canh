import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Alert,
  Divider,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HeritageSeal } from '../../../core/components/HeritageSeal';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { MONUMENT_LESSONS_DATA, MonumentLessonData } from '../data/heritageLessonsAndQuiz';
import { adminService } from '../../admin/services/adminService';
import { SupportedLanguage } from '../../admin/types';

interface LessonExtractionStepProps {
  monumentCode: string;
  monumentName: string;
  imageData?: string;
  onNext: () => void;
  onBack: () => void;
}

export const LessonExtractionStep: React.FC<LessonExtractionStepProps> = ({
  monumentCode,
  monumentName,
  imageData,
  onNext,
  onBack,
}) => {
  const [customStories, setCustomStories] = useState(() => adminService.getStories({ monumentCode }));
  const [activeStoryTab, setActiveStoryTab] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomStories(adminService.getStories({ monumentCode }));
    };
    window.addEventListener('ditich_stories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_stories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [monumentCode]);

  const baseLessonData: MonumentLessonData = MONUMENT_LESSONS_DATA[monumentCode] || {
    code: monumentCode,
    name: monumentName,
    location: 'Di tích lịch sử văn hóa Việt Nam',
    region: 'Bắc',
    era: 'Di sản lịch sử',
    summary: `Di tích ${monumentName} là công trình lịch sử văn hóa có ý nghĩa đặc biệt trong dòng chảy lịch sử Việt Nam.`,
    historicalValue: `Lưu giữ những giá trị văn hóa, kiến trúc và bài học lịch sử thiêng liêng của dân tộc.`,
    heritageLesson: `Bài học về lòng tự hào dân tộc, ý thức trân quý cội nguồn và bảo tồn di sản cho thế hệ tương lai.`,
    keyTakeaways: [
      `Di tích quốc gia có giá trị lịch sử và văn hóa trường tồn.`,
      `Minh chứng cho tinh thần quật cường và tinh hoa văn hóa dân tộc Việt Nam.`,
      `Trách nhiệm gìn giữ và lan tỏa bài học lịch sử cho các thế hệ trẻ.`,
    ],
    audioNarrationText: `Di tích ${monumentName} mang những giá trị văn hóa lịch sử vô cùng to lớn. Chúng ta cùng tự hào và chung tay gìn giữ di sản thiêng liêng này.`,
  };

  // Merge with admin custom story if available
  const activeStory = customStories.find((s) => s.language === 'vi') || customStories[0];
  const lessonData: MonumentLessonData = {
    ...baseLessonData,
    summary: activeStory?.content || baseLessonData.summary,
    historicalValue: activeStory?.historicalValue || baseLessonData.historicalValue,
    heritageLesson: activeStory?.heritageLesson || baseLessonData.heritageLesson,
    keyTakeaways:
      activeStory?.keyTakeaways && activeStory.keyTakeaways.length > 0
        ? activeStory.keyTakeaways
        : baseLessonData.keyTakeaways,
    audioNarrationText:
      activeStory?.audioNarrationText || activeStory?.content || baseLessonData.audioNarrationText,
    era: activeStory?.era || baseLessonData.era,
  };

  const handlePlayTTS = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ đọc âm thanh tự động.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card sx={{ overflow: 'hidden', boxShadow: '0 4px 24px rgba(42, 31, 23, 0.08)' }} id="step-lesson-extraction-view">
      <HeritageCornerFrame>
        {/* Top Heritage Step Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            pb: 2,
            borderBottom: '1px solid #E2D7C7',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HeritageSeal text="BÀI HỌC" subtext="LỊCH SỬ" size="small" />
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                }}
              >
                Trích Xuất Bài Học & Tư Liệu Di Tích
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
                {lessonData.location}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`Miền ${lessonData.region}`}
              size="small"
              color="secondary"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Box>

        {/* User Explicit Notice Banner: "Trích xuất bài học (Nhập sau)" */}
        <Alert
          severity="info"
          icon={<HistoryEduIcon sx={{ fontSize: 24, color: '#C89D35' }} />}
          sx={{
            mb: 3,
            borderRadius: '6px',
            bgcolor: 'rgba(200, 157, 53, 0.08)',
            border: '1px solid rgba(200, 157, 53, 0.35)',
            color: 'primary.dark',
            '& .MuiAlert-message': { width: '100%' },
          }}
          id="notice-lesson-import-later"
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                📌 Trích Xuất Bài Học Lịch Sử (Nội dung chi tiết sẽ được Quản trị viên nhập sau)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.2 }}>
                Dưới đây là tóm lược ý nghĩa lịch sử cốt lõi và bài học giáo dục di sản đã trích xuất từ dữ liệu nhận diện di tích <strong>{monumentName}</strong>.
              </Typography>
            </Box>

            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={isPlayingAudio ? <StopIcon /> : <VolumeUpIcon />}
              onClick={() => handlePlayTTS(lessonData.audioNarrationText)}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                fontSize: '0.78rem',
                borderColor: '#C89D35',
                color: 'primary.dark',
                whiteSpace: 'nowrap',
              }}
            >
              {isPlayingAudio ? 'Dừng đọc' : 'Nghe Thuyết Minh'}
            </Button>
          </Box>
        </Alert>

        {/* Main Content Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          {/* Left: Thumbnail & Monument Context */}
          <Box sx={{ width: { xs: '100%', md: '36%' }, flexShrink: 0 }}>
            {imageData && (
              <Box
                sx={{
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #DFD5C6',
                  height: 220,
                  mb: 2,
                  bgcolor: '#FAF7F0',
                }}
              >
                <Box
                  component="img"
                  src={imageData}
                  alt={monumentName}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FAF7F0', borderColor: '#E2D7C7' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Thời kỳ lịch sử:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CalendarMonthIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {lessonData.era}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5, borderColor: '#E6DCCD' }} />

              <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Khái quát di tích:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.85rem' }}>
                {lessonData.summary}
              </Typography>
            </Paper>
          </Box>

          {/* Right: Extracted Heritage Lessons & Key Takeaways */}
          <Box sx={{ width: { xs: '100%', md: '64%' } }}>
            {/* Core Historical Value Box */}
            <Box sx={{ p: 2.5, bgcolor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2D7C7', mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: 'primary.dark',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <HistoryEduIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                Giá Trị Lịch Sử & Kiến Trúc
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                {lessonData.historicalValue}
              </Typography>
            </Box>

            {/* Extracted Heritage Lesson (The Core Teaching) */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'rgba(74, 37, 17, 0.03)',
                borderRadius: '6px',
                border: '1px solid #D6C7B2',
                borderLeft: '4px solid #C89D35',
                mb: 2.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: 'primary.dark',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <LightbulbIcon sx={{ color: '#C89D35', fontSize: 22 }} />
                Bài Học Lịch Sử Rút Ra Cho Thế Hệ Trẻ
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                  color: 'primary.dark',
                  lineHeight: 1.75,
                  fontSize: '0.98rem',
                  fontWeight: 600,
                }}
              >
                "{lessonData.heritageLesson}"
              </Typography>
            </Box>

            {/* Key Takeaways Checklist */}
            <Box sx={{ p: 2, bgcolor: '#FAF7F0', borderRadius: '6px', border: '1px solid #E2D7C7' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.dark', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                3 Điểm Cốt Lõi Cần Ghi Nhớ:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {lessonData.keyTakeaways.map((point, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, fontSize: '0.875rem' }}>
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Navigation Buttons */}
        <Divider sx={{ my: 2.5, borderColor: '#E2D7C7' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            id="btn-lesson-back-to-recognition"
            sx={{
              borderColor: '#D8CABE',
              color: 'primary.dark',
              fontWeight: 700,
            }}
          >
            Quay Lại Kết Quả Nhận Diện
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onNext}
            endIcon={<ArrowForwardIcon />}
            id="btn-lesson-next-to-quiz"
            sx={{
              py: 1.2,
              px: 3.5,
              fontWeight: 800,
              fontSize: '0.98rem',
              boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
            }}
          >
            Tiếp Tục: Thử Thách Quiz Nhanh, Vui
          </Button>
        </Box>
      </HeritageCornerFrame>
    </Card>
  );
};
