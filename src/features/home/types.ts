import React from 'react';

export interface ScrollBoxItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
