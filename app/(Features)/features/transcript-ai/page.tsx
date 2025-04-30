"use client";

import { API_BASE_URL } from "@/app/utils/config";
import { useState, useRef, useEffect } from "react";

export default function TranscriptAI() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  // UI state management
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  // Function to handle file upload
  const handleUpload = async (selectedFile: File) => {
    // Reset states
    setError("");
    setShowError(false);
    setShowResult(false);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("lang", language);

    try {      // Animate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 30);

      // Make API request
      const response = await fetch(`${API_BASE_URL}/api/transcript-ai`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.error) {
        setError(data.message);
        setShowError(true);
        setIsUploading(false);
      } else {
        // Start checking task status
        setTimeout(() => {
          setIsUploading(false);
          setIsProcessing(true);
          checkTaskStatus(data.data.task_id);
        }, 500);
      }
    } catch (error) {
      setIsUploading(false);
      setError(`An error occurred while processing the file: ${error}`);
      setShowError(true);
    }
  };

  // Function to check task status
  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transcript-status/${taskId}`);
      const data = await response.json();

      // Update progress based on status
      setUploadProgress(data.progress);
      setProcessingStatus(data.message);

      if (data.status === "completed") {
        // Show result
        setIsProcessing(false);
        setShowResult(true);
        setTranscript(data.data.transcript);
        setFileData(data.data);
      } else if (data.status === "error") {
        // Show error
        setIsProcessing(false);
        setError(data.message);
        setShowError(true);
      } else {
        // Continue checking status
        setTimeout(() => checkTaskStatus(taskId), 3000);
      }
    } catch (error) {
      console.error("Error checking task status:", error);
      setIsProcessing(false);
      setError(`Error checking task status: ${error}`);
      setShowError(true);
    }
  };

  // Function to download file
  const downloadFile = (fileType: string) => {
    if (fileData && fileData[fileType]) {
      const fileInfo = fileData[fileType];
      const decodedData = Uint8Array.from(
        atob(fileInfo[`${fileType.split("_")[0]}_base64`]),
        (c) => c.charCodeAt(0)
      );
      const blob = new Blob([decodedData], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // Function to copy transcript
  const copyTranscript = () => {
    if (transcriptRef.current) {
      transcriptRef.current.select();
      document.execCommand("copy");
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy");
      }, 2000);
    }
  };

  // Style for circle progress
  const circleProgressStyle = {
    strokeDasharray: 251.2,
    strokeDashoffset: 251.2 * (1 - uploadProgress / 100),
    transformOrigin: "center",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest("#downloadBtn")) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="text-white flex items-center justify-center min-h-screen py-10">
      <div className="max-w-[785px] w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Video Transcript Generator
          </h1>
          <p className="text-xl text-gray-400">
            Convert your video content into accurate text transcripts using AI
          </p>

          {/* Features list */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-300 bg-sky-950/50 px-4 py-2 rounded-full backdrop-blur-sm border border-sky-400/20">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <span>High Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>Multi-language Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Multiple Formats</span>
            </div>
          </div>
        </div>

        {/* File upload section */}
        <div className="text-center py-10">
          <p className="text-gray-400 mb-6">
            Upload your video file and select the language for more accurate results
          </p>
          <div className="flex justify-center items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*, audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative py-2.5 px-8 bg-slate-800/15  hover:bg-slate-800/30 text-white rounded-lg border border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:ring-opacity-50 hover:border-cyan-400"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Browse my files
              </span>
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800/15 text-white px-4 py-2.5 rounded-lg border border-cyan-400/50  transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:ring-opacity-50 hover:border-cyan-400"
            >
              <option value="en" data-flag="🇺🇸" className="bg-slate-900">🇺🇸 English</option>
              <option value="af" data-flag="🇿🇦" className="bg-slate-900">🇿🇦 Afrikaans</option>
              <option value="am" data-flag="🇪🇹" className="bg-slate-900">🇪🇹 Amharic</option>
              <option value="ar" data-flag="🇸🇦" className="bg-slate-900">🇸🇦 Arabic</option>
              <option value="as" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Assamese</option>
              <option value="az" data-flag="🇦🇿" className="bg-slate-900">🇦🇿 Azerbaijani</option>
              <option value="ba" data-flag="🇷🇺" className="bg-slate-900">🇷🇺 Bashkir</option>
              <option value="be" data-flag="🇧🇾" className="bg-slate-900">🇧🇾 Belarusian</option>
              <option value="bg" data-flag="🇧🇬" className="bg-slate-900">🇧🇬 Bulgarian</option>
              <option value="bn" data-flag="🇧🇩" className="bg-slate-900">🇧🇩 Bengali</option>
              <option value="bo" data-flag="🇨🇳" className="bg-slate-900">🇨🇳 Tibetan</option>
              <option value="br" data-flag="🇫🇷" className="bg-slate-900">🇫🇷 Breton</option>
              <option value="bs" data-flag="🇧🇦" className="bg-slate-900">🇧🇦 Bosnian</option>
              <option value="ca" data-flag="🇪🇸" className="bg-slate-900">🇪🇸 Catalan</option>
              <option value="cs" data-flag="🇨🇿" className="bg-slate-900">🇨🇿 Czech</option>
              <option value="cy" data-flag="🏴󠁧󠁢󠁷󠁬󠁳󠁿" className="bg-slate-900">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh</option>
              <option value="da" data-flag="🇩🇰" className="bg-slate-900">🇩🇰 Danish</option>
              <option value="de" data-flag="🇩🇪" className="bg-slate-900">🇩🇪 German</option>
              <option value="el" data-flag="🇬🇷" className="bg-slate-900">🇬🇷 Greek</option>
              <option value="eo" data-flag="🌍" className="bg-slate-900">🌍 Esperanto</option>
              <option value="es" data-flag="🇪🇸" className="bg-slate-900">🇪🇸 Spanish</option>
              <option value="et" data-flag="🇪🇪" className="bg-slate-900">🇪🇪 Estonian</option>
              <option value="eu" data-flag="🇪🇸" className="bg-slate-900">🇪🇸 Basque</option>
              <option value="fa" data-flag="🇮🇷" className="bg-slate-900">🇮🇷 Persian</option>
              <option value="fi" data-flag="🇫🇮" className="bg-slate-900">🇫🇮 Finnish</option>
              <option value="fo" data-flag="🇫🇴" className="bg-slate-900">🇫🇴 Faroese</option>
              <option value="fr" data-flag="🇫🇷" className="bg-slate-900">🇫🇷 French</option>
              <option value="gl" data-flag="🇪🇸" className="bg-slate-900">🇪🇸 Galician</option>
              <option value="gu" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Gujarati</option>
              <option value="ha" data-flag="🇳🇬" className="bg-slate-900">🇳🇬 Hausa</option>
              <option value="haw" data-flag="🇺🇸" className="bg-slate-900">🇺🇸 Hawaiian</option>
              <option value="hi" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Hindi</option>
              <option value="hr" data-flag="🇭🇷" className="bg-slate-900">🇭🇷 Croatian</option>
              <option value="hu" data-flag="🇭🇺" className="bg-slate-900">🇭🇺 Hungarian</option>
              <option value="hy" data-flag="🇦🇲" className="bg-slate-900">🇦🇲 Armenian</option>
              <option value="id" data-flag="🇮🇩" className="bg-slate-900">🇮🇩 Indonesian</option>
              <option value="is" data-flag="🇮🇸" className="bg-slate-900">🇮🇸 Icelandic</option>
              <option value="it" data-flag="🇮🇹" className="bg-slate-900">🇮🇹 Italian</option>
              <option value="ja" data-flag="🇯🇵" className="bg-slate-900">🇯🇵 Japanese</option>
              <option value="jw" data-flag="🇮🇩" className="bg-slate-900">🇮🇩 Javanese</option>
              <option value="ka" data-flag="🇬🇪" className="bg-slate-900">🇬🇪 Georgian</option>
              <option value="kk" data-flag="🇰🇿" className="bg-slate-900">🇰🇿 Kazakh</option>
              <option value="km" data-flag="🇰🇭" className="bg-slate-900">🇰🇭 Khmer</option>
              <option value="kn" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Kannada</option>
              <option value="ko" data-flag="🇰🇷" className="bg-slate-900">🇰🇷 Korean</option>
              <option value="la" data-flag="🏛️" className="bg-slate-900">🏛️ Latin</option>
              <option value="lb" data-flag="🇱🇺" className="bg-slate-900">🇱🇺 Luxembourgish</option>
              <option value="ln" data-flag="🇨🇩" className="bg-slate-900">🇨🇩 Lingala</option>
              <option value="lo" data-flag="🇱🇦" className="bg-slate-900">🇱🇦 Lao</option>
              <option value="lt" data-flag="🇱🇹" className="bg-slate-900">🇱🇹 Lithuanian</option>
              <option value="lv" data-flag="🇱🇻" className="bg-slate-900">🇱🇻 Latvian</option>
              <option value="mg" data-flag="🇲🇬" className="bg-slate-900">🇲🇬 Malagasy</option>
              <option value="mi" data-flag="🇳🇿" className="bg-slate-900">🇳🇿 Māori</option>
              <option value="mk" data-flag="🇲🇰" className="bg-slate-900">🇲🇰 Macedonian</option>
              <option value="ml" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Malayalam</option>
              <option value="mn" data-flag="🇲🇳" className="bg-slate-900">🇲🇳 Mongolian</option>
              <option value="mr" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Marathi</option>
              <option value="ms" data-flag="🇲🇾" className="bg-slate-900">🇲🇾 Malay</option>
              <option value="mt" data-flag="🇲🇹" className="bg-slate-900">🇲🇹 Maltese</option>
              <option value="my" data-flag="🇲🇲" className="bg-slate-900">🇲🇲 Burmese</option>
              <option value="ne" data-flag="🇳🇵" className="bg-slate-900">🇳🇵 Nepali</option>
              <option value="nl" data-flag="🇳🇱" className="bg-slate-900">🇳🇱 Dutch</option>
              <option value="nn" data-flag="🇳🇴" className="bg-slate-900">🇳🇴 Norwegian Nynorsk</option>
              <option value="no" data-flag="🇳🇴" className="bg-slate-900">🇳🇴 Norwegian</option>
              <option value="oc" data-flag="🇫🇷" className="bg-slate-900">🇫🇷 Occitan</option>
              <option value="pa" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Punjabi</option>
              <option value="pl" data-flag="🇵🇱" className="bg-slate-900">🇵🇱 Polish</option>
              <option value="ps" data-flag="🇦🇫" className="bg-slate-900">🇦🇫 Pashto</option>
              <option value="pt" data-flag="🇵🇹" className="bg-slate-900">🇵🇹 Portuguese</option>
              <option value="ro" data-flag="🇷🇴" className="bg-slate-900">🇷🇴 Romanian</option>
              <option value="ru" data-flag="🇷🇺" className="bg-slate-900">🇷🇺 Russian</option>
              <option value="sa" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Sanskrit</option>
              <option value="sd" data-flag="🇵🇰" className="bg-slate-900">🇵🇰 Sindhi</option>
              <option value="si" data-flag="🇱🇰" className="bg-slate-900">🇱🇰 Sinhala</option>
              <option value="sk" data-flag="🇸🇰" className="bg-slate-900">🇸🇰 Slovak</option>
              <option value="sl" data-flag="🇸🇮" className="bg-slate-900">🇸🇮 Slovenian</option>
              <option value="sn" data-flag="🇿🇼" className="bg-slate-900">🇿🇼 Shona</option>
              <option value="so" data-flag="🇸🇴" className="bg-slate-900">🇸🇴 Somali</option>
              <option value="sq" data-flag="🇦🇱" className="bg-slate-900">🇦🇱 Albanian</option>
              <option value="sr" data-flag="🇷🇸" className="bg-slate-900">🇷🇸 Serbian</option>
              <option value="su" data-flag="🇮🇩" className="bg-slate-900">🇮🇩 Sundanese</option>
              <option value="sv" data-flag="🇸🇪" className="bg-slate-900">🇸🇪 Swedish</option>
              <option value="sw" data-flag="🇹🇿" className="bg-slate-900">🇹🇿 Swahili</option>
              <option value="ta" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Tamil</option>
              <option value="te" data-flag="🇮🇳" className="bg-slate-900">🇮🇳 Telugu</option>
              <option value="tg" data-flag="🇹🇯" className="bg-slate-900">🇹🇯 Tajik</option>
              <option value="th" data-flag="🇹🇭" className="bg-slate-900">🇹🇭 Thai</option>
              <option value="tk" data-flag="🇹🇲" className="bg-slate-900">🇹🇲 Turkmen</option>
              <option value="tl" data-flag="🇵🇭" className="bg-slate-900">🇵🇭 Tagalog</option>
              <option value="tr" data-flag="🇹🇷" className="bg-slate-900">🇹🇷 Turkish</option>
              <option value="tt" data-flag="🇷🇺" className="bg-slate-900">🇷🇺 Tatar</option>
              <option value="uk" data-flag="🇺🇦" className="bg-slate-900">🇺🇦 Ukrainian</option>
              <option value="ur" data-flag="🇵🇰" className="bg-slate-900">🇵🇰 Urdu</option>
              <option value="uz" data-flag="🇺🇿" className="bg-slate-900">🇺🇿 Uzbek</option>
              <option value="vi" data-flag="🇻🇳" className="bg-slate-900">🇻🇳 Vietnamese</option>
              <option value="yo" data-flag="🇳🇬" className="bg-slate-900">🇳🇬 Yoruba</option>
              <option value="zh" data-flag="🇨🇳" className="bg-slate-900">🇨🇳 Chinese</option>
              <option value="zu" data-flag="🇿🇦" className="bg-slate-900">🇿🇦 Zulu</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-3">Supports MP4-MP3 • 50 MB</p>
        </div>

        {/* Upload progress container */}
        {isUploading && (
          <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-xl  bg-slate-900/70  rounded-2xl shadow-2xl border border-cyan-400/20">
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
                    className="text-cyan-400 stroke-current animate-spin"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    r="40"
                    cx="50"
                    cy="50"
                    style={circleProgressStyle}
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

        {/* Processing container */}
        {isProcessing && (
          <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-xl md:max-w-2xl bg-slate-900/70 rounded-2xl shadow-2xl border border-cyan-400/20">
              {/* Audio wave animation */}
              <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-4 sm:mb-6 audio-wave">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-0.5 sm:w-1 h-${i % 2 === 0 ? 10 : 6} sm:h-${i % 2 === 0 ? 12 : 8} bg-gradient-to-b from-cyan-400 to-blue-500`}
                    style={{ animation: `wave ${1 + i * 0.1}s ease-in-out infinite` }}
                  />
                ))}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Generating Transcript
                <span className="dots" />
              </h3>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed py-2 sm:py-4">
                Our AI is processing your file. This may take a few minutes depending on the length.<br />
                <span className="text-white font-medium block mt-2 sm:mt-3">
                  Please keep this page open.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Result Container */}
        {showResult && (
          <div className="mt-8">
            <div className="p-6 bg-slate-900/30 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Generated Transcript
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative inline-block text-left">
                    <button
                      id="downloadBtn"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-gray-900/80 backdrop-blur-lg border border-gray-700 z-50">
                        <div>
                          <a href="#" onClick={() => downloadFile("json_file")} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            JSON
                          </a>

                          <a href="#" onClick={() => downloadFile("txt_file")} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            TXT
                          </a>

                          <a href="#" onClick={() => downloadFile("srt_file")} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            SRT
                          </a>

                          <a href="#" onClick={() => downloadFile("vtt_file")} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            VTT
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={copyTranscript}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copyButtonText}
                  </button>
                </div>
              </div>

              <textarea
                ref={transcriptRef}
                value={transcript}
                readOnly
                className="w-full h-72 p-4 bg-slate-900/30 text-gray-200 rounded-lg resize-y text-base border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Error Container */}
        {showError && (
          <div className="mt-8">
            <div className="p-6 bg-red-500/10 border border-[#665dc3]/30 text-white rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-red-400">Error</p>
              </div>
              <p className="text-red-300 mt-2" dangerouslySetInnerHTML={{ __html: error }}></p>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .dots::after {
          content: "";
          animation: dots 1.5s steps(5, end) infinite;
        }

        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80%, 100% { content: "..."; }
        }

        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
