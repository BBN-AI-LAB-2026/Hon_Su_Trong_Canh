import React from 'react';

export interface StepGuideItem {
  stepNumber: number;
  stepCode: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  summary: string;
  keyPoints: string[];
  tip: string;
  highlightBadge?: string;
}
