'use client';

import { useState, useEffect } from 'react';
import { ToolsGrid } from './components/ToolsGrid';
import { ImageUpload } from './components/ImageUpload';
import { useImageProcessing } from './hooks/useImageProcessing';
import { Tool, ToastState } from './types';
import styles from './styles.module.css';

export default function ImageAI() {
  const [selectedTool, setSelectedTool] = useState<string>('remove-bg');
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false
  });

  const {
    state,
    setState,
    fileInputRef,
    resetUI,
    handleFile,
    togglePreview,
    processImage,
    downloadImage
  } = useImageProcessing();

  // Tool options
  const tools: Tool[] = [
    {
      id: 'remove-bg',
      title: 'Background Remover',
      description: 'Remove background from images with one click using advanced AI',
      icon: (
        <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'replace-bg',
      title: 'Replace Background',
      description: 'Swap backgrounds with custom images seamlessly',
      icon: (
        <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      id: 'remove-text',
      title: 'Text Remover',
      description: 'Remove unwanted text from images with precision',
      icon: (
        <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Handle tool selection
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    resetUI();
  };

  // Handle image processing
  const handleProcessImage = async () => {
    await processImage(selectedTool);
    if (!state.error) {
      showToast('Image processed successfully!');
    }
  };

  // Handle image download
  const handleDownload = () => {
    downloadImage();
    showToast('Image downloaded successfully!');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (state.error) {
        setState(prev => ({ ...prev, error: '' }));
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-4 ${styles.gradientText}`}>
            AI Image Processing Tools
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your images instantly with our advanced AI-powered tools
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">Fast Processing</span>
            <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">High Quality</span>
            <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">Easy to Use</span>
          </div>
        </div>

        {/* Tools Grid */}
        <ToolsGrid
          tools={tools}
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
        />

        {/* Image Upload Area */}
        <ImageUpload
          state={state}
          fileInputRef={fileInputRef}
          selectedTool={selectedTool}
          onFileSelect={handleFile}
          onProcess={handleProcessImage}
          onDownload={handleDownload}
          onTogglePreview={togglePreview}
          onReset={resetUI}
          onBackgroundPromptChange={(prompt) => setState(prev => ({ ...prev, backgroundPrompt: prompt }))}
        />

        {/* Error Message */}
        {state.error && (
          <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold text-red-400">Error</span>
            </div>
            <p className="text-red-300 mt-2">{state.error}</p>
          </div>
        )}
      </div>

      {/* Toast notification */}
      <div 
        className={`${styles.toast} ${toast.visible ? styles.show : ''} ${styles[toast.type]}`} 
        role="alert"
      >
        {toast.message}
      </div>
    </div>
  );
}
