import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { adminService } from '../../admin/services/adminService';
import { audioNarrationService } from '../services/audioNarrationService';
import { HeritageStoryCard } from './HeritageStoryCard';
import { HeritageQuizChallenge } from './HeritageQuizChallenge';

interface MonumentHeritageStoriesAndQuizProps {
  monumentCode: string;
  monumentName: string;
}

export const MonumentHeritageStoriesAndQuiz: React.FC<MonumentHeritageStoriesAndQuizProps> = ({
  monumentCode,
  monumentName,
}) => {
  // Load stories and quizzes for this specific monument
  const [stories, setStories] = useState(() => adminService.getStories({ monumentCode }));
  const [quizzes, setQuizzes] = useState(() => adminService.getQuizzes({ monumentCode }));
  const [narration, setNarration] = useState(() => audioNarrationService.getAudioNarration(monumentCode));

  useEffect(() => {
    setStories(adminService.getStories({ monumentCode }));
    setQuizzes(adminService.getQuizzes({ monumentCode }));
    setNarration(audioNarrationService.getAudioNarration(monumentCode));

    const handleUpdate = () => {
      setStories(adminService.getStories({ monumentCode }));
      setQuizzes(adminService.getQuizzes({ monumentCode }));
      setNarration(audioNarrationService.getAudioNarration(monumentCode));
    };

    window.addEventListener('ditich_audio_narrations_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ditich_audio_narrations_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [monumentCode]);

  return (
    <Box id="monument-heritage-stories-and-quiz-wrapper">
      {/* Multilingual Historical Story & Audio Player */}
      <HeritageStoryCard
        stories={stories}
        monumentName={monumentName}
        audioUrl={narration?.audioUrl}
      />

      {/* Official Monument Challenge Quizzes (Configured by Admins, no AI generators) */}
      <HeritageQuizChallenge quizzes={quizzes} />
    </Box>
  );
};
