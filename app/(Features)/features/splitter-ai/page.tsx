'use client';

import { API_BASE_URL } from '@/app/utils/config';
import { useState, useRef } from 'react';

export default function SplitterAI() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Features
  const features = [
    { title: 'High-Quality Separation', icon: 'music' },
    { title: 'Fast Processing', icon: 'time' },
    { title: 'Multiple Formats', icon: 'play' },
  ];
  
  // Tools
  const tools = [
    { title: 'Vocals', description: 'Extract clean vocals from any song', icon: 'vocal' },
    { title: 'Bass', description: 'Isolate bass tracks perfectly', icon: 'bass' },
    { title: 'Drums', description: 'Separate drum tracks cleanly', icon: 'drum' },
    { title: 'Music', description: 'Extract instrumental versions', icon: 'music' },
  ];

  // Handle file change
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select an audio file.');
      setFile(null);
      setAudioFiles([]);
      return;
    }
    
    setFile(selectedFile);
    processFile(selectedFile);
  };

  // Simulate progress animation
  const animateProgress = () => {
    setUploadProgress(0);
    setIsUploading(true);
    
    let progress = 0;
    uploadTimerRef.current = setInterval(() => {
      progress += 1;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(uploadTimerRef.current as NodeJS.Timeout);
        setTimeout(() => {
          setIsUploading(false);
          setIsProcessing(true);
        }, 300);
      }
    }, 30);
  };

  // Process the uploaded file
  const processFile = async (audioFile: File) => {
    setError('');
    setAudioFiles([]);
    
    // Start animation
    animateProgress();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', audioFile);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/splitter-ai`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.message);
      } else {
        setFileName(data.data.file_name);
        setAudioFiles(data.data.audio_files);
      }
    } catch (error) {
      setError(`An error occurred while processing the file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // Stop animations and reset states
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  // Get the appropriate icon for each source
  const getSourceIcon = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    
    if (name.includes('vocal')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      );
    } else if (name.includes('drum')) {
      return (
        <>
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 2v4m0 12v4m20-10h-4m-16 0H0" />
        </>
      );
    } else if (name.includes('bass')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      );
    } else {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      );
    }
  };

  // Render the feature icon
  const renderFeatureIcon = (iconType: string) => {
    switch (iconType) {
      case 'music':
        return (
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'time':
        return (
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'play':
        return (
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Render the tool icon
  const renderToolIcon = (iconType: string) => {
    switch (iconType) {
      case 'vocal':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'bass':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
        );
      case 'drum':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 2v4m0 12v4m20-10h-4m-16 0H0" />
          </svg>
        );
      case 'music':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 text-white flex items-center justify-center min-h-screen py-10">
      <div className="max-w-[785px] w-full px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Vocal Splitter and Isolation
          </h1>
          <p className="text-xl text-gray-400">
            Separate voice from music out of a song free with powerful AI algorithms
          </p>

          {/* Features list */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 text-slate-300 ${
                  index === 0 ? 'bg-sky-950/50 px-4 py-2 rounded-full backdrop-blur-sm border border-sky-400/20' : 'text-gray-400'
                }`}
              >
                {renderFeatureIcon(feature.icon)}
                <span>{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12 mb-12 md:mb-16 px-2 md:px-0">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="p-3 md:p-4 bg-sky-950/30 rounded-xl border border-sky-400/20 backdrop-blur-sm hover:bg-sky-900/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                {renderToolIcon(tool.icon)}
                <h3 className="text-base md:text-lg font-semibold text-gray-200">
                  {tool.title}
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-400">
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        {/* File upload section */}
        <div className="text-center py-10">
          <p className="text-gray-400 mb-6">
            Upload your audio file to start extracting components
          </p>
          <div className="flex justify-center">
            <input 
              type="file" 
              id="fileInput" 
              ref={fileInputRef}
              accept="audio/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative py-3 px-8 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 text-white rounded-full border border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:ring-opacity-50 hover:border-cyan-400"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Browse my files
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Supports MP3, WAV, OGG, M4A • Max 20MB
          </p>
        </div>

        {/* Result Container */}
        {audioFiles.length > 0 && (
          <div className="mt-8">
            <div className="p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <h2 className="text-base md:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {fileName}
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                {audioFiles.map((source, index) => (
                  <div 
                    key={index}
                    className="group p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {getSourceIcon(source.source_name)}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-200 font-medium truncate">{source.source_name}</p>
                      </div>
                    </div>
                    <a 
                      href={source.download_url} 
                      download={source.source_name} 
                      target="_blank"
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Container */}
        {error && (
          <div className="mt-8">
            <div className="p-6 bg-red-500/10 border border-[#665dc3]/30 text-white rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300">
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
                <p className="font-bold text-red-400">Error</p>
              </div>
              <p className="text-red-200 mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Uploading Modal */}
        {isUploading && (
          <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400/20">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700/50 stroke-current"
                    strokeWidth="10"
                    fill="none"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-cyan-400 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: 251.2,
                      strokeDashoffset: 251.2 * (1 - uploadProgress / 100)
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="text-base sm:text-lg text-gray-400 mb-2 sm:mb-4">
                Uploading file...
              </div>
            </div>
          </div>
        )}

        {/* Processing Modal */}
        {isProcessing && (
          <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400/20">
              {/* Audio wave animation */}
              <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-4 sm:mb-6 audio-wave">
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1s_ease-in-out_infinite]"></div>
                <div className="w-0.5 sm:w-1 h-10 sm:h-12 animate-[wave_1.2s_ease-in-out_infinite]"></div>
                <div className="w-0.5 sm:w-1 h-8 sm:h-10 animate-[wave_1.4s_ease-in-out_infinite]"></div>
                <div className="w-0.5 sm:w-1 h-12 sm:h-16 animate-[wave_1s_ease-in-out_infinite]"></div>
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1.2s_ease-in-out_infinite]"></div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Audio processing<span className="dots"></span>
              </h3>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed py-2 sm:py-4">
                Our AI is processing your audio with precision. Larger files may take longer.<br />
                <span className="text-white font-medium block mt-2 sm:mt-3">Please keep this page open.</span>
              </p>
            </div>
          </div>
        )}

        <style jsx>{`
          .dots::after {
            content: "";
            animation: dots 1.5s steps(5, end) infinite;
          }

          @keyframes dots {
            0%, 20% {
              content: "";
            }
            40% {
              content: ".";
            }
            60% {
              content: "..";
            }
            80%, 100% {
              content: "...";
            }
          }

          @keyframes wave {
            0%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(0.5);
            }
          }

          .audio-wave div {
            background: linear-gradient(to bottom, #26c6da, #2196f3);
          }
        `}</style>
      </div>
    </div>
  );
}
