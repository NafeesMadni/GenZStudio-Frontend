import { ReactNode } from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export interface ImageProcessingState {
  originalImage: string | null;
  processedImage: string | null;
  isPreviewingOriginal: boolean;
  isProcessing: boolean;
  backgroundPrompt: string;
  error: string;
} 