import { useState, useRef } from 'react';
import { API_BASE_URL } from '@/app/utils/config';
import { ImageProcessingState } from '../types';

export const useImageProcessing = () => {
  const [state, setState] = useState<ImageProcessingState>({
    originalImage: null,
    processedImage: null,
    isPreviewingOriginal: false,
    isProcessing: false,
    backgroundPrompt: '',
    error: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetUI = () => {
    setState(prev => ({
      ...prev,
      originalImage: null,
      processedImage: null,
      backgroundPrompt: '',
      error: ''
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  };

  const handleFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setState(prev => ({
          ...prev,
          originalImage: e.target.result as string,
          processedImage: null
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const togglePreview = () => {
    if (!state.originalImage || !state.processedImage) return;

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    setState(prev => ({ ...prev, isPreviewingOriginal: true }));

    previewTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isPreviewingOriginal: false }));
      previewTimeoutRef.current = null;
    }, 1500);
  };

  const processImage = async (selectedTool: string) => {
    if (!state.originalImage || !fileInputRef.current?.files?.[0]) {
      setState(prev => ({ ...prev, error: 'Please select an image first' }));
      return;
    }

    const formData = new FormData();
    
    if (selectedTool === 'replace-bg') {
      if (!state.backgroundPrompt) {
        setState(prev => ({ ...prev, error: 'Please describe the new background' }));
        return;
      }
      formData.append('prompt', state.backgroundPrompt);
    }
    
    formData.append('file', fileInputRef.current.files[0]);
    setState(prev => ({ ...prev, isProcessing: true, error: '' }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/${selectedTool}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.error) {
        const base64Image = result.data.img;
        setState(prev => ({
          ...prev,
          processedImage: `data:image/png;base64,${base64Image}`,
          error: ''
        }));
      } else {
        throw new Error(result.message || 'Failed to process image');
      }
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process image. Please try again.'
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const downloadImage = () => {
    if (!state.processedImage) return;
    
    const link = document.createElement('a');
    link.href = state.processedImage;
    link.download = `processed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    state,
    setState,
    fileInputRef,
    resetUI,
    handleFile,
    togglePreview,
    processImage,
    downloadImage
  };
}; 