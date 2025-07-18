"use client";

import { API_BASE_URL } from "@/app/utils/config";
import { useState, useRef, useEffect } from "react";

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event?.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const demoData = {
  data: {
    file_name: "Demo",
    source_name: "vocals",
    download_url: "https://example.com/demo-video.mp4",
  },
  message: "Success",
  error: false,
};

export default function DeMusic() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(demoData.data.file_name);
  const [processedVideo, setProcessedVideo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showUploadSection, setShowUploadSection] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Features
  const features = [
    { title: "Music Removal", icon: "music" },
    { title: "Fast Processing", icon: "time" },
    { title: "Multiple Formats", icon: "format" },
  ];

  // Handle file change
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a video file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setShowUploadSection(false);
    processFile(selectedFile);
  };

  // Merge audio with video
  const mergeAudioWithVideo = async (videoFile: File, audioUrl: string) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.muted = true; // Mute the original video audio
    await video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const audioElement = new Audio(audioUrl);

    video.pause();
    video.currentTime = 0;

    const stream = canvas.captureStream();
    const videoStream = stream.clone();
    const audioStream = stream.clone();

    // Combine video and audio streams
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm",
    });

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setProcessedVideo(url);
    };

    video.play();
    audioElement.play();
    mediaRecorder.start();

    video.ontimeupdate = () => {
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    video.onended = () => {
      mediaRecorder.stop();
      video.pause();
      audioElement.pause();

      // Clean up streams
      videoStream.getTracks().forEach((track) => track.stop());
      audioStream.getTracks().forEach((track) => track.stop());
    };
  };

  // Process the uploaded file
  const processFile = async (videoFile: File) => {
    setError("");
    setIsUploading(true);
    animateProgress();

    try {
      // First, send the video file to the streaming endpoint for audio extraction
      const videoFormData = new FormData();
      videoFormData.append("file", videoFile);

      const streamResponse = await fetch(
        `${API_BASE_URL}/api/stream/video-to-audio`,
        {
          method: "POST",
          body: videoFormData,
        }
      );

      if (!streamResponse.ok) {
        throw new Error("Failed to convert video to audio");
      }

      // Get the audio blob from the stream response
      const audioBlob = await streamResponse.blob();

      // Now send the audio to the demusic-ai endpoint
      const audioFormData = new FormData();
      audioFormData.append("file", audioBlob, "extracted_audio.wav");

      const response = await fetch(`${API_BASE_URL}/api/demusic-ai`, {
        method: "POST",
        body: audioFormData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
        setShowUploadSection(true);
      } else {
        setFileName(videoFile.name);
        if (data.data.download_url) {
          await mergeAudioWithVideo(videoFile, data.data.download_url);
        }
      }
    } catch (error) {
      setShowUploadSection(true);
      console.error(error);
      setError(
        `An error occurred while processing the file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (processedVideo) {
      const a = document.createElement("a");
      a.href = processedVideo;
      a.download = `demusic_${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Animate progress
  const animateProgress = () => {
    setUploadProgress(0);
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

  const handleCancel = () => {
    setFile(null);
    setProcessedVideo("");
    setVideoUrl("");
    setError("");
    setShowUploadSection(true);
    setIsUploading(false);
    setIsProcessing(false);
    setUploadProgress(0);
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

  return (
    <div className="min-h-screen p-4 sm:p-8 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Music Remover from Video
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
          Remove background music from your videos while keeping the vocals
          intact
        </p>

        {/* Features list */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-6 px-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center gap-1.5 text-slate-300 ${
                index === 0
                  ? "bg-sky-950/50 px-2 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-sky-400/20"
                  : "text-gray-400"
              }`}
            >
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    feature.icon === "music"
                      ? "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      : feature.icon === "time"
                      ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      : "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  }
                />
              </svg>
              <span className="text-xs sm:text-sm md:text-base">
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* File upload section */}
      {showUploadSection && (
        <div className="text-center py-6 sm:py-10">
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Upload your video file to start removing background music
          </p>
          <div
            className="flex flex-col justify-center items-center px-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              className="w-full max-w-lg p-4 sm:p-8 mb-4 border-2 border-dashed border-cyan-400/30 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-400 mb-3 sm:mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-gray-300 text-base sm:text-lg mb-2">
                  Drag and drop your video file here
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  or click to browse
                </p>
              </div>
            </div>
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            Supports MP4, WebM, MOV • Max 100MB
          </p>
        </div>
      )}

      {/* Video Preview */}
      {processedVideo && (
        <div className="relative max-w-4xl mx-auto mt-8">
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-900/70">
            <video
              ref={videoRef}
              src={processedVideo}
              className="w-full h-full"
              controls
            />
          </div>

          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-xl transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download</span>
            </button>

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Container */}
      {error && (
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-4">
          <div className="p-4 sm:p-6 bg-red-500/10 border border-[#665dc3]/30 text-white rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-400"
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
              <p className="font-bold text-red-400 text-sm sm:text-base">
                Error
              </p>
            </div>
            <p
              className="text-sm sm:text-base text-red-300 mt-2"
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
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
            <div className="text-sm sm:text-base md:text-lg text-gray-400">
              Uploading file...
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-gray-800/15 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md bg-slate-900/70 rounded-2xl shadow-2xl border border-cyan-400/20">
            <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 audio-wave">
              <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-10 sm:h-12 animate-[wave_1.2s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-8 sm:h-10 animate-[wave_1.4s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-12 sm:h-16 animate-[wave_1s_ease-in-out_infinite]"></div>
              <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1.2s_ease-in-out_infinite]"></div>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Processing video<span className="dots"></span>
            </h3>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed py-2 sm:py-3">
              Our AI is removing the background music from your video. Larger
              files may take longer.
              <br />
              <span className="text-white font-medium block mt-2">
                Please keep this page open.
              </span>
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
          0%,
          20% {
            content: "";
          }
          40% {
            content: ".";
          }
          60% {
            content: "..";
          }
          80%,
          100% {
            content: "...";
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
