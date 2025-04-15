'use client';

// [{'source_name': 'Drums', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/a6c99ca2-6e87-48d2-8104-2947dbcbeeed.mp3?'}, {'source_name': 'Bass', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/adc47c84-f5c6-4237-af6b-be807778d56e.mp3?'}, {'source_name': 'Music', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/1560fc78-49ae-4dea-a50a-7592acedf521.mp3?'}, {'source_name': 'Vocal', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/bb02373a-033f-4d21-a7fe-22877f248230.mp3?'}]

import { API_BASE_URL } from '@/app/utils/config';
import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

// Update the hook type definition
function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event?.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

interface AudioFile {
  source_name: string;
  download_url: string;
}

interface DownloadProgress {
  [key: string]: number;
}

const demoData = {
  "data": {
    "file_name": "Demo",
    "audio_files": [
      // {'source_name': 'Drums', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/4ac19c8e-9303-42ba-ad5e-d586d296bdd3.mp3?'}, 
      // {'source_name': 'Bass', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/aeccd70d-dbb9-4e83-8426-59abb8811ad5.mp3?'}, 
      // {'source_name': 'Music', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/beee74ac-52d9-49ee-8225-710a01580b5f.mp3?'}, 
      // {'source_name': 'Vocal', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/01037868-4e04-405f-b8a2-88e5c3a98229.mp3?'}  
      {'source_name': 'Drums', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/0a006e35-366b-4302-9aac-3e4047a477b0.mp3?'}, 
        {'source_name': 'Bass', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/05139482-3111-4d75-984c-09a31f80f3c5.mp3?'},
        {'source_name': 'Music', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/ed6d9db1-baa6-46c5-8c62-eba92e7d1fc0.mp3?'}, 
        {'source_name': 'Vocal', 'download_url': 'https://ujbzjpmepbcrqmrrkbib.supabase.co/storage/v1/object/public/Media-Files/splitter_ai/3290f7ef-60cb-4dfe-8c1d-cd40e1a191bc.mp3?'}
      ],
  },
  "message":"Sucess",
  "error":false
};

export default function SplitterAI() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(demoData.data.file_name);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(demoData.data.audio_files);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [individualVolumes, setIndividualVolumes] = useState<{ [key: string]: number }>({});
  const [waveSurfers, setWaveSurfers] = useState<{ [key: string]: WaveSurfer }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const [readyCount, setReadyCount] = useState<number>(0);
  const waveformRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Features
  const features = [
    { title: 'High-Quality Separation', icon: 'music' },
    { title: 'Fast Processing', icon: 'time' },
    { title: 'Multiple Formats', icon: 'format' },
  ];

  // Tools
  const tools = [
    { title: 'Vocals', description: 'Extract clean vocals from any song' },
    { title: 'Bass', description: 'Isolate bass tracks perfectly' },
    { title: 'Drums', description: 'Separate drum tracks cleanly' },
    { title: 'Music', description: 'Extract instrumental versions' },
  ];
  const toolColor = [
    { "bg": "#25744a", "fr": "#00ff8e", "w_clr": "#33ffae" },
    { "bg": "#363360", "fr": "#665dc3", "w_clr": "#7a72ce" }, 
    { "bg": "#747425", "fr": "#ffff00", "w_clr": "#ffff33" }, 
    { "bg": "#562838", "fr": "#b0415d", "w_clr": "#c25571" }, 
  ];
  
  // Helper function to format time
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
    setShowUploadSection(false);
    processFile(selectedFile);
  };

  const handleCancel = () => {
    setFile(null);
    setAudioFiles([]);
    setError('');
    setShowUploadSection(true);
    setIsUploading(false);
    setIsProcessing(false);
    setUploadProgress(0);
    Object.values(waveSurfers).forEach(ws => ws.destroy());
    setWaveSurfers({});
  };

  // Add drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
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
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
        setShowUploadSection(true);
      } else {
        setFileName(data.data.file_name);
        setAudioFiles(data.data.audio_files);
      }
    } catch (error) {
      setShowUploadSection(true);
      console.error(error);
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

  useEffect(() => {
    if (audioFiles.length > 0) {
      const initialVolumes = audioFiles.reduce((acc, file) => ({
        ...acc,
        [file.source_name]: 1
      }), {});
      setIndividualVolumes(initialVolumes);
    }
  }, [audioFiles]);

  // Function to handle individual volume change
  const handleIndividualVolumeChange = (sourceName: string, value: number) => {
    setIndividualVolumes(prev => ({
      ...prev,
      [sourceName]: value
    }));

    // Only adjust volume without affecting playback
    if (waveSurfers[sourceName]) {
      waveSurfers[sourceName].setVolume(value);
    }
  };

  // Initialize WaveSurfer instances
  useEffect(() => {
    if (audioFiles.length > 0) {
      const newWaveSurfers: { [key: string]: WaveSurfer } = {};
      setReadyCount(0); // Reset ready count when initializing
      setIsReady(false); // Reset ready state
      setIsPlaying(false); // Ensure play state is reset

      audioFiles.forEach((file, index) => {
        if (waveformRefs.current[file.source_name]) {
          const wavesurfer = WaveSurfer.create({
            container: waveformRefs.current[file.source_name]!,
            waveColor: toolColor[index].w_clr,
            progressColor: toolColor[index].fr,
            height: 64,
            normalize: true,
            barWidth: 2,
            barHeight: 0.1,
            barGap: 1,
            cursorColor: toolColor[index].fr,
            cursorWidth: 2,
          });

          wavesurfer.load(file.download_url);
          newWaveSurfers[file.source_name] = wavesurfer;

          // Add ready handler for all tracks
          wavesurfer.on('ready', () => {
            setReadyCount(prev => {
              const newCount = prev + 1;
              if (newCount === audioFiles.length) {
                setIsReady(true);
              }
              return newCount;
            });
          });

          // Add time update handler for the first track only
          if (file.source_name === audioFiles[0].source_name) {
            wavesurfer.on('audioprocess', (currentTime: number) => {
              setCurrentTime(currentTime);
            });
            wavesurfer.on('ready', () => {
              setDuration(wavesurfer.getDuration());
            });
          }

          // Handle end of playback
          wavesurfer.on('finish', () => {
            Object.values(newWaveSurfers).forEach(ws => {
              ws.pause();
              ws.seekTo(0);
            });
            setIsPlaying(false);
          });

          // Replace the seeking event handler
          wavesurfer.on('interaction', () => {
            const currentProgress = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
            Object.entries(newWaveSurfers).forEach(([name, ws]) => {
              if (name !== file.source_name) {
                ws.seekTo(currentProgress);
              }
            });
          });
        }
      });

      setWaveSurfers(newWaveSurfers);

      return () => {
        Object.values(newWaveSurfers).forEach(ws => ws.destroy());
      };
    }
  }, [audioFiles]);

  // Handle global playback
  const togglePlayback = () => {
    if (!isReady) return; // Prevent playback if not ready
    
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    Object.values(waveSurfers).forEach(ws => {
      if (newIsPlaying) {
        ws.play();
      } else {
        ws.pause();
      }
    });
  };

  // Handle waveform click
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>, sourceName: string) => {
    if (!waveSurfers[sourceName]) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const progress = relativeX / rect.width;
    
    // Pause all wavesurfers
    Object.values(waveSurfers).forEach(ws => ws.pause());
    
    // Seek the clicked wavesurfer first
    waveSurfers[sourceName].seekTo(progress);
    
    // Then seek others
    Object.entries(waveSurfers).forEach(([name, ws]) => {
      if (name !== sourceName) {
        ws.seekTo(progress);
      }
    });
    
    // Resume if was playing
    if (isPlaying) {
      Object.values(waveSurfers).forEach(ws => ws.play());
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
    setIsDownloadOpen(false);
  };

  const handleDownloadTrack = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength || '0', 10);
      const reader = response.body?.getReader();
      let receivedLength = 0;

      if (!reader) return;

      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        setDownloadProgress(prev => ({
          ...prev,
          [fileName]: Math.round((receivedLength / total) * 100)
        }));
      }

      const blob = new Blob(chunks);
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${fileName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Reset progress after successful download
      setDownloadProgress(prev => ({ ...prev, [fileName]: 0 }));
    } catch (error) {
      console.error('Download failed:', error);
      setError('Download failed. Please try again.');
    }
  };

  useClickOutside(downloadMenuRef, () => {
    if (isDownloadOpen) setIsDownloadOpen(false);
  });

  const renderTrackControl = (source: AudioFile, index: number) => (
    <div key={index} className="flex">
      {/* Source Name & Volume Adjuster Section*/}
      <div className={`lg:flex items-center justify-center px-4 py-2  mr-1 bg-slate-900  ${index == 0 ? 'rounded-tl-lg' : ''} ${index == 3 ? 'rounded-bl-lg' : ''}`}>
        <span className="text-base lg:text-xl text-gray-400 min-w-[60px] font-thin mr-3">{source.source_name}</span>
        <div className="relative flex items-center w-[60px] h-[24px]">
          <div className="flex items-baseline justify-center space-x-0.5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex-1 transition-all duration-200 w-6px"
                style={{
                  height: `${i+5.5}px`,
                  width: `4px`,
                  backgroundColor: `rgb(34 211 238 / ${
                    (individualVolumes[source.source_name]*10) > i ? '0.8' : '0.1'
                  })`,
                }}
              />
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={individualVolumes[source.source_name]}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              handleIndividualVolumeChange(source.source_name, value);
            }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      {/* WaveForms Section*/}
      <div className="flex-1">
        <div
          ref={(el: HTMLDivElement | null) => {
            if (el) waveformRefs.current[source.source_name] = el;
          }}
          style={{ 
            backgroundColor: toolColor[index].bg,
          }}
          className={`cursor-pointer overflow-hidden px-3 py-2 ${index == 0 ? 'rounded-tr-lg' : ''} ${index == 3 ? 'rounded-br-lg' : ''}`}
          onClick={(e) => handleWaveformClick(e, source.source_name)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 sm:p-8 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Vocal Splitter and Isolation
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
          Separate voice from music out of a song free with powerful AI algorithms
        </p>

        {/* Features list */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-6 px-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center gap-1.5 text-slate-300 ${
                index === 0
                  ? 'bg-sky-950/50 px-2 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-sky-400/20'
                  : 'text-gray-400'
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={feature.icon === 'music' ? 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' : 
                    feature.icon === 'time' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' : 
                    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'}
                />
              </svg>
              <span className="text-xs sm:text-sm md:text-base">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File upload section */}
      {showUploadSection && (
        <div className="text-center py-6 sm:py-10">
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Upload your audio file to start extracting components</p>
          <div 
            className="flex flex-col justify-center items-center px-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="w-full max-w-lg p-4 sm:p-8 mb-4 border-2 border-dashed border-cyan-400/30 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-400 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p className="text-gray-300 text-base sm:text-lg mb-2">Drag and drop your audio file here</p>
                <p className="text-gray-400 text-sm sm:text-base">or click to browse</p>
              </div>
            </div>
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-3">Supports MP3, WAV, OGG, M4A • Max 20MB</p>
        </div>
      )}

      {/* Result Container */}
      {audioFiles.length > 0 && (
        <div className="relative">

          {/* Master Controls */}
          <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-sky-500/10">
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
              <div className="flex flex-row items-center justify-between h-14 sm:h-16">
                {/* Left side controls */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={togglePlayback}
                    className="flex items-center gap-1 sm:gap-2 p-2 sm:px-4 md:px-6 sm:py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg sm:rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={isPlaying 
                          ? 'M15.25 6.75V17.25M8.75 6.75V17.25' 
                          : 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'
                        } 
                      />
                    </svg>
                    <span className="hidden sm:inline text-xs sm:text-sm md:text-base whitespace-nowrap">{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-base  md:text-medium text-gray-400 sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px]">{fileName.length > 15 ? fileName.slice(0, 15) + '...' : fileName }</span>
                  <div className="relative" ref={downloadMenuRef}>
                    <button
                      onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                      className="flex items-center gap-1 sm:gap-2 p-2 sm:px-4 md:px-6 sm:py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg sm:rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline text-xs sm:text-sm md:text-base">Download</span>
                    </button>
                    <div 
                      className={`absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-lg border border-sky-500/10 transform transition-all duration-200 origin-top ${
                        isDownloadOpen 
                          ? 'opacity-100 scale-100 translate-y-0' 
                          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {audioFiles.map((file, index) => (
                        <div 
                          key={file.source_name} 
                          className="px-4 py-3 hover:bg-slate-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm font-medium">{file.source_name}</span>
                            <button
                              onClick={() => handleDownloadTrack(file.download_url, file.source_name)}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 hover:bg-cyan-400/10 rounded-lg"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                          {downloadProgress[file.source_name] > 0 && (
                            <div className="w-full bg-slate-700/30 rounded-full h-1 mt-2 overflow-hidden">
                              <div
                                className="bg-cyan-400 h-full transition-all duration-300"
                                style={{ width: `${downloadProgress[file.source_name]}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 sm:gap-2 p-2 sm:px-4 md:px-6 sm:py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg sm:rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline text-xs sm:text-sm md:text-base">Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tracks Section */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-1">
              {audioFiles.map((source, index) => renderTrackControl(source, index))}
            </div>
          </div>
        </div>
      )}

      {/* Error Container */}
      {error && (
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-4">
          <div className="p-4 sm:p-6 bg-red-500/10 border border-[#665dc3]/30 text-white rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-bold text-red-400 text-sm sm:text-base">Error</p>
            </div>
            <p className="text-sm sm:text-base text-red-300 mt-2" dangerouslySetInnerHTML={{ __html: error }}></p>
          </div>
        </div>
      )}

      {/* Uploading Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400/20">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3">
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
                    strokeDashoffset: 251.2 * (1 - uploadProgress / 100),
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-400">Uploading file...</div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400/20">
            {/* Audio wave animation */}
            <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 audio-wave">
              <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-10 sm:h-12 animate-[wave_1.2s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-8 sm:h-10 animate-[wave_1.4s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-12 sm:h-16 animate-[wave_1s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1.2s_ease-in-out_infinite]"></div>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Audio processing<span className="dots"></span>
            </h3>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed py-2 sm:py-3">
              Our AI is processing your audio with precision. Larger files may take longer.
              <br />
              <span className="text-white font-medium block mt-2">Please keep this page open.</span>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .dots::after {
          content: '';
          animation: dots 1.5s steps(5, end) infinite;
        }

        @keyframes dots {
          0%,
          20% {
            content: '';
          }
          40% {
            content: '.';
          }
          60% {
            content: '..';
          }
          80%,
          100% {
            content: '...';
          }
        }

        @keyframes wave {
          0%,
          100% {
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
  );
}
