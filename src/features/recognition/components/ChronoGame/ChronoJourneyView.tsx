import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import FlareIcon from '@mui/icons-material/Flare';
import { TimelineEventItem } from '../../data/heritageTimelineEvents';
import { ChronoGuideAvatar, ChronoShardGraphic } from './ChronoGraphics';
import { chronoSoundService } from '../../services/chronoSoundService';

interface ChronoJourneyViewProps {
  monumentName: string;
  events: TimelineEventItem[]; // Exact 3 - 4 events
  shuffledEvents: TimelineEventItem[];
  isMuted: boolean;
  onToggleMute: () => void;
  onAllRestored: (stats: { score: number; shards: number; maxStreak: number }) => void;
}

export const ChronoJourneyView: React.FC<ChronoJourneyViewProps> = ({
  monumentName,
  events,
  shuffledEvents,
  isMuted,
  onToggleMute,
  onAllRestored,
}) => {
  // Matched slot tracking: slotId -> matched event
  const [restoredMap, setRestoredMap] = useState<Record<string, TimelineEventItem>>({});

  // Active selection for click-to-slot (great on mobile)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Dragging event ID
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  // Wrong attempt animation indicator
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [shards, setShards] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Feedback Dialog Modal (Screen 3)
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    slotTime: string;
    eventText: string;
    explanation: string;
  } | null>(null);

  const totalSlots = events.length;
  const restoredCount = Object.keys(restoredMap).length;
  const progressPercent = totalSlots > 0 ? (restoredCount / totalSlots) * 100 : 0;

  // Unplaced cards
  const unplacedCards = shuffledEvents.filter((ev) => !Object.values(restoredMap).some((r) => r.id === ev.id));

  // Handler to test placing a card into a slot
  const handlePlaceCardIntoSlot = (cardId: string, slotId: string) => {
    if (restoredMap[slotId]) return;

    const card = events.find((e) => e.id === cardId);
    const slot = events.find((e) => e.id === slotId);

    if (!card || !slot) return;

    chronoSoundService.playSnap();

    if (card.id === slot.id) {
      // === CORRECT RESTORATION ===
      chronoSoundService.playCorrect();
      setTimeout(() => chronoSoundService.playShardCollected(), 250);

      const nextMap = { ...restoredMap, [slotId]: card };
      setRestoredMap(nextMap);

      const newScore = score + 100;
      const newShards = shards + 1;
      const newStreak = currentStreak + 1;
      setScore(newScore);
      setShards(newShards);
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      setSelectedCardId(null);
      setDraggingCardId(null);
      setWrongSlotId(null);

      // Open Feedback Screen (Screen 3)
      setFeedbackState({
        isOpen: true,
        isCorrect: true,
        slotTime: slot.time,
        eventText: card.event,
        explanation: card.explanation,
      });
    } else {
      // === INCORRECT PLACEMENT ===
      chronoSoundService.playWrong();
      setWrongSlotId(slotId);
      setCurrentStreak(0);

      setTimeout(() => {
        setWrongSlotId(null);
        setSelectedCardId(null);
        setDraggingCardId(null);
      }, 750);
    }
  };

  // Drag and Drop HTML5
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggingCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggingCardId;
    if (cardId) {
      handlePlaceCardIntoSlot(cardId, slotId);
    }
  };

  // Close Feedback Dialog and continue
  const handleCloseFeedback = () => {
    setFeedbackState(null);

    // If all slots are restored, advance to Final Challenge Screen (Screen 4)
    if (Object.keys(restoredMap).length === totalSlots) {
      chronoSoundService.playGateOpen();
      onAllRestored({
        score: score,
        shards: shards,
        maxStreak: maxStreak,
      });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: '#0B192C',
        color: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        background: 'linear-gradient(180deg, #0E2238 0%, #0B192C 100%)',
      }}
    >
      {/* Top HUD Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2.5,
          pb: 1.5,
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ChronoGuideAvatar size={46} />
          <Box>
            <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 800, letterSpacing: '0.05em' }}>
              GS. TRẦN SỬ • HƯỚNG DẪN VIÊN THỜI GIAN
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {restoredCount === 0
                ? `Hãy kéo thả hoặc chạm thẻ sự kiện để đặt vào mốc năm tương ứng của ${monumentName}!`
                : `Tuyệt vời! Đã khôi phục ${restoredCount}/${totalSlots} tọa độ thời gian.`}
            </Typography>
          </Box>
        </Box>

        {/* Resources & Sound HUD */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Chip
            icon={<ChronoShardGraphic size={18} glow={false} />}
            label={`${shards} Mảnh`}
            sx={{
              bgcolor: 'rgba(0, 229, 255, 0.15)',
              color: '#00E5FF',
              fontWeight: 800,
              border: '1px solid rgba(0, 229, 255, 0.4)',
            }}
          />
          <Chip
            icon={<FlareIcon sx={{ fontSize: 16, color: '#D4AF37' }} />}
            label={`${score} pts`}
            sx={{
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              color: '#FFD54F',
              fontWeight: 800,
              border: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          />
          <Tooltip title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
            <IconButton
              size="small"
              onClick={onToggleMute}
              sx={{
                color: isMuted ? 'rgba(255,255,255,0.4)' : '#00E5FF',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Glowing Timeline Progress Ribbon */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#00E5FF', fontWeight: 700 }}>
            TIẾN ĐỘ KHÔI PHỤC DÒNG THỜI GIAN
          </Typography>
          <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800 }}>
            {restoredCount} / {totalSlots} MỐC HOÀN THÀNH ({Math.round(progressPercent)}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #D4AF37 0%, #00E5FF 100%)',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.6)',
            },
          }}
        />
      </Box>

      {/* Main Game Stage: 2-Section Grid (Timeline Slots & Event Cards) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          gap: { xs: 2.5, md: 3 },
          mb: 2,
        }}
      >
        {/* ================= SECTION 1: GLOWING TIMELINE SLOTS ================= */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#00E5FF',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            Tọa Độ Niên Đại Lịch Sử ({totalSlots} Mốc)
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
            {events.map((slot, idx) => {
              const restoredEvent = restoredMap[slot.id];
              const isWrong = wrongSlotId === slot.id;

              return (
                <Box
                  key={slot.id}
                  id={`slot-${slot.id}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  onClick={() => {
                    if (selectedCardId) {
                      handlePlaceCardIntoSlot(selectedCardId, slot.id);
                    }
                  }}
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    bgcolor: restoredEvent
                      ? 'rgba(46, 125, 50, 0.16)'
                      : isWrong
                      ? 'rgba(211, 47, 47, 0.22)'
                      : selectedCardId
                      ? 'rgba(0, 229, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: restoredEvent
                      ? '2px solid #00E5FF'
                      : isWrong
                      ? '2px solid #D32F2F'
                      : selectedCardId
                      ? '2px dashed #00E5FF'
                      : '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: restoredEvent
                      ? '0 0 16px rgba(0, 229, 255, 0.35)'
                      : 'none',
                    transition: 'all 0.25s ease',
                    cursor: restoredEvent ? 'default' : selectedCardId ? 'pointer' : 'default',
                    position: 'relative',
                    animation: isWrong ? 'gentleShake 0.4s ease-in-out' : 'none',
                    '@keyframes gentleShake': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '25%': { transform: 'translateX(-5px)' },
                      '75%': { transform: 'translateX(5px)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          bgcolor: restoredEvent ? '#00E5FF' : '#D4AF37',
                          color: '#0B192C',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {restoredEvent ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : idx + 1}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: '"Cinzel", "Be Vietnam Pro", serif',
                          fontWeight: 800,
                          color: restoredEvent ? '#00E5FF' : '#FFD54F',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {slot.time}
                      </Typography>
                    </Box>

                    {restoredEvent ? (
                      <Chip
                        label="ĐÃ KHÔI PHỤC"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 229, 255, 0.2)',
                          color: '#00E5FF',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          height: 22,
                        }}
                      />
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{
                          color: selectedCardId ? '#00E5FF' : 'rgba(255,255,255,0.45)',
                          fontStyle: 'italic',
                          fontWeight: 600,
                        }}
                      >
                        {selectedCardId ? 'Nhấp để đặt vào đây ↓' : 'Kéo thả sự kiện vào đây'}
                      </Typography>
                    )}
                  </Box>

                  {/* Slot content: either restored event or empty prompt */}
                  {restoredEvent ? (
                    <Box sx={{ pl: 4.2 }}>
                      <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 600, lineHeight: 1.45 }}>
                        {restoredEvent.event}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        pl: 4.2,
                        py: 0.8,
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '0.85rem',
                      }}
                    >
                      (Chưa có sự kiện nào được gắn kết)
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ================= SECTION 2: EVENT CARDS (THẺ SỰ KIỆN CẦN GHÉP) ================= */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#FFD54F',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MenuBookIcon sx={{ fontSize: 18 }} />
              Thẻ Sự Kiện Cần Sắp Xếp ({unplacedCards.length} Thẻ)
            </Typography>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <TouchAppIcon sx={{ fontSize: 13, verticalAlign: 'middle', mr: 0.3 }} />
              Hỗ trợ kéo thả hoặc chạm
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {unplacedCards.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'rgba(0, 229, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: '#00E5FF', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: '#00E5FF', fontWeight: 800 }}>
                  Toàn Bộ Thẻ Đã Được Đặt Về Đúng Mốc!
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mt: 0.5 }}>
                  Hệ thống đang chuẩn bị mở Thử Thách Cuối...
                </Typography>
              </Box>
            ) : (
              unplacedCards.map((card) => {
                const isSelected = selectedCardId === card.id;

                return (
                  <Box
                    key={card.id}
                    id={`card-${card.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onClick={() => {
                      chronoSoundService.playClick();
                      setSelectedCardId(isSelected ? null : card.id);
                    }}
                    sx={{
                      p: 1.8,
                      borderRadius: '10px',
                      bgcolor: isSelected ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.06)',
                      border: isSelected ? '2px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected
                        ? '0 0 16px rgba(212, 175, 55, 0.45)'
                        : '0 2px 8px rgba(0, 0, 0, 0.25)',
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: '#D4AF37',
                        bgcolor: 'rgba(212, 175, 55, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#F8FAFC',
                          fontWeight: 700,
                          lineHeight: 1.45,
                        }}
                      >
                        {card.event}
                      </Typography>
                      <Chip
                        label={isSelected ? 'Đang chọn' : 'Kéo thả'}
                        size="small"
                        sx={{
                          bgcolor: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                          color: isSelected ? '#0B192C' : 'rgba(255,255,255,0.7)',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 20,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>

      {/* ================= SCREEN 3: FEEDBACK DIALOG (GIẢI THÍCH LỊCH SỬ SÂU SẮC) ================= */}
      <Dialog
        open={Boolean(feedbackState?.isOpen)}
        onClose={handleCloseFeedback}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0B192C',
              color: '#F8FAFC',
              borderRadius: '12px',
              border: '2px solid #00E5FF',
              boxShadow: '0 0 32px rgba(0, 229, 255, 0.45)',
            },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 229, 255, 0.15)',
                border: '2px solid #00E5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 229, 255, 0.5)',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 36, color: '#00E5FF' }} />
            </Box>
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Cinzel", "Be Vietnam Pro", serif',
              color: '#00E5FF',
              fontWeight: 800,
              mb: 1,
            }}
          >
            KHÔI PHỤC THÀNH CÔNG!
          </Typography>

          <Chip
            icon={<ChronoShardGraphic size={16} glow={false} />}
            label="+1 MẢNH THỜI GIAN • +100 ĐIỂM DI SẢN"
            sx={{
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              color: '#FFD54F',
              fontWeight: 800,
              mb: 2.5,
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          />

          {/* Historical Explanation Box */}
          <Box
            sx={{
              textAlign: 'left',
              p: 2,
              borderRadius: '8px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderLeft: '4px solid #00E5FF',
              mb: 3,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#FFD54F', fontWeight: 800, mb: 0.5 }}>
              ⏱️ {feedbackState?.slotTime}: {feedbackState?.eventText}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              {feedbackState?.explanation}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              chronoSoundService.playClick();
              handleCloseFeedback();
            }}
            sx={{
              py: 1.2,
              fontWeight: 800,
              bgcolor: '#00E5FF',
              color: '#0B192C',
              borderRadius: '20px',
              '&:hover': { bgcolor: '#80DEEA' },
            }}
          >
            {restoredCount === totalSlots ? 'BƯỚC VÀO THỬ THÁCH CUỐI' : 'TIẾP TỤC KHÔI PHỤC MỐC KẾ'}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
