import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, CircularProgress, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HeritageCornerFrame } from '../../../core/components/HeritageCornerFrame';
import { adminService } from '../../admin/services/adminService';
import { DEFAULT_MONUMENT_STORIES } from '../data/defaultMonumentStories';
import { aiQuizService } from '../services/aiQuizService';
import { TimelineEventItem, getMonumentTimelineEvents } from '../data/heritageTimelineEvents';
import { ChronoWelcomeView } from './ChronoGame/ChronoWelcomeView';
import { ChronoJourneyView } from './ChronoGame/ChronoJourneyView';
import { ChronoFinalChallengeView } from './ChronoGame/ChronoFinalChallengeView';
import { ChronoAchievementView } from './ChronoGame/ChronoAchievementView';
import { chronoSoundService } from '../services/chronoSoundService';

interface QuickFunQuizStepProps {
  monumentCode: string;
  monumentName: string;
  onNext: () => void;
  onBack: () => void;
}

type GamePhase = 'welcome' | 'journey' | 'final_challenge' | 'achievement';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuickFunQuizStep: React.FC<QuickFunQuizStepProps> = ({
  monumentCode,
  monumentName,
  onNext,
  onBack,
}) => {
  // Retrieve story content from Recognition section
  const stories = adminService.getStories({ monumentCode });
  const storyContent =
    stories[0]?.content ||
    DEFAULT_MONUMENT_STORIES[monumentCode]?.storyContent ||
    `Di tích ${monumentName} là công trình văn hóa lịch sử tiêu biểu của Việt Nam.`;

  // Game state: Only Timeline Match & Restoration (no A, B, C, D multiple-choice)
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [events, setEvents] = useState<TimelineEventItem[]>([]);
  const [shuffledEvents, setShuffledEvents] = useState<TimelineEventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => chronoSoundService.getMuted());

  // Aggregate stats across phases
  const [gameStats, setGameStats] = useState<{
    score: number;
    shards: number;
    maxStreak: number;
  }>({ score: 0, shards: 0, maxStreak: 0 });

  // Load timeline matching events from AI grounded in story content BEFORE the game is loaded
  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const res = await aiQuizService.generateTimelineMatches({
        monumentCode,
        monumentName,
        storyContent,
      });

      let items: TimelineEventItem[] = [];
      if (res && res.success && Array.isArray(res.events) && res.events.length >= 3) {
        items = res.events.slice(0, 4);
      } else {
        items = getMonumentTimelineEvents(monumentCode).slice(0, 4);
      }

      setEvents(items);

      let shuffled = shuffleArray(items);
      if (items.length > 1 && shuffled.every((it, i) => it.id === items[i].id)) {
        shuffled = [...items.slice(1), items[0]];
      }
      setShuffledEvents(shuffled);
    } catch (err) {
      console.warn('[ChronoGame] Fallback loading:', err);
      const fallback = getMonumentTimelineEvents(monumentCode).slice(0, 4);
      setEvents(fallback);
      setShuffledEvents(shuffleArray(fallback));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
    return () => {
      chronoSoundService.stopBgm();
    };
  }, [monumentCode]);

  const handleToggleMute = () => {
    const nextMuted = chronoSoundService.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start campaign from welcome screen directly into Timeline Matching Journey
  const handleStartGame = () => {
    chronoSoundService.startBgm();
    setPhase('journey');
  };

  // Journey stage completed
  const handleJourneyFinished = (stats: { score: number; shards: number; maxStreak: number }) => {
    setGameStats(stats);
    setPhase('final_challenge');
  };

  // Final challenge completed
  const handleFinalChallengeFinished = (finalStats: {
    score: number;
    shards: number;
    maxStreak: number;
  }) => {
    setGameStats((prev) => ({
      score: prev.score + finalStats.score,
      shards: prev.shards + finalStats.shards,
      maxStreak: Math.max(prev.maxStreak, finalStats.maxStreak),
    }));
    setPhase('achievement');
  };

  // Replay campaign
  const handleReplay = () => {
    let shuffled = shuffleArray(events);
    if (events.length > 1 && shuffled.every((it, i) => it.id === events[i].id)) {
      shuffled = [...events.slice(1), itemsOrder(events)];
    }
    setShuffledEvents(shuffled);
    setGameStats({ score: 0, shards: 0, maxStreak: 0 });
    setPhase('journey');
  };

  const itemsOrder = (list: TimelineEventItem[]) => (list.length > 1 ? list[1] : list[0]);

  return (
    <Card
      sx={{
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(11, 25, 44, 0.15)',
        bgcolor: '#FAF7F0',
        borderRadius: '12px',
      }}
      id="step-chrono-game-container"
    >
      <HeritageCornerFrame>
        {/* Loading Spinner: Trước khi game được load ra */}
        {isLoading ? (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: 'center',
              bgcolor: '#0B192C',
              color: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              background: 'radial-gradient(circle at 50% 20%, #1E3E62 0%, #0B192C 75%, #050C16 100%)',
            }}
          >
            <CircularProgress size={48} sx={{ color: '#00E5FF', mb: 2.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37', mb: 1 }}>
              Đang Khởi Tạo Trò Chơi Khôi Phục Dòng Thời Gian...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 520, mx: 'auto', mb: 1.5, lineHeight: 1.6 }}>
              Trích xuất các mốc lịch sử từ bài thuyết minh di tích <strong>{monumentName}</strong> để tạo thử thách ghép nối dòng thời gian.
            </Typography>
            <Typography variant="caption" sx={{ color: '#00E5FF', display: 'block', fontWeight: 600 }}>
              ✦ Luân phiên 8 API Keys Gemini • Khôi phục tọa độ niên đại • Tương tác ghép nối lịch sử
            </Typography>
          </Box>
        ) : (
          <Box sx={{ my: 1 }}>
            {phase === 'welcome' && (
              <ChronoWelcomeView
                monumentName={monumentName}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onStart={handleStartGame}
              />
            )}

            {phase === 'journey' && (
              <ChronoJourneyView
                monumentName={monumentName}
                events={events}
                shuffledEvents={shuffledEvents}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onAllRestored={handleJourneyFinished}
              />
            )}

            {phase === 'final_challenge' && (
              <ChronoFinalChallengeView
                monumentName={monumentName}
                correctEvents={events}
                stats={gameStats}
                onCompleteFinal={handleFinalChallengeFinished}
              />
            )}

            {phase === 'achievement' && (
              <ChronoAchievementView
                monumentName={monumentName}
                events={events}
                stats={gameStats}
                onReview={() => setPhase('achievement')}
                onReplay={handleReplay}
                onNext={onNext}
              />
            )}
          </Box>
        )}

        {/* Global Bottom Navigation (Consistent with app flow) */}
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
            onClick={() => {
              chronoSoundService.stopBgm();
              onBack();
            }}
            startIcon={<ArrowBackIcon />}
            id="btn-quiz-back-to-mindmap"
            sx={{ borderColor: '#D8CABE', color: 'primary.dark', fontWeight: 700 }}
          >
            Quay Lại Sơ Đồ Kiến Thức
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => {
              chronoSoundService.stopBgm();
              onNext();
            }}
            endIcon={<ArrowForwardIcon />}
            id="btn-quiz-next-to-vr"
            sx={{
              py: 1.2,
              px: 3.5,
              fontWeight: 800,
              fontSize: '0.98rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(200, 157, 53, 0.35)',
            }}
          >
            VR 360° Tour
          </Button>
        </Box>
      </HeritageCornerFrame>
    </Card>
  );
};
