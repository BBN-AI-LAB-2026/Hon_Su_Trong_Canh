import { MonumentBasic } from '../../core/types/common';

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MonumentDetailed extends MonumentBasic {
  historicalStory: string;
  audioNarrationText: string;
  architecturalHighlights: string[];
  timeline: Milestone[];
  quiz: QuizQuestion[];
  panoramas: Array<{
    id: string;
    title: string;
    imageUrl: string;
    description: string;
  }>;
}

export interface RecognitionResult {
  monument: MonumentDetailed;
  confidenceScore: number;
  detectedFeatures: string[];
  recognizedAt: string;
}
