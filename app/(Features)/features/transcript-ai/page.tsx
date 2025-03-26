'use client'

import { API_BASE_URL } from '@/app/utils/config';
import { useState, useRef, useEffect } from 'react'

interface FileData {
  transcript?: string;
  json_file?: {
    json_base64: string;
    name: string;
  };
  txt_file?: {
    txt_base64: string;
    name: string;
  };
  srt_file?: {
    srt_base64: string;
    name: string;
  };
  vtt_file?: {
    vtt_base64: string;
    name: string;
  };
}

export default function TranscriptAI() {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState('en')
  const [transcript, setTranscript] = useState('')
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [taskId, setTaskId] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const features = [
    { icon: 'M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z', text: 'High Accuracy' },
    { icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', text: 'Multi-language Support' },
    { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Multiple Formats' }
  ]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Reset states
    setFile(selectedFile)
    setError('')
    setTranscript('')
    setFileData(null)
    
    await uploadFile(selectedFile)
  }

  const uploadFile = async (selectedFile: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('lang', language)

    try {
      const response = await fetch(`${API_BASE_URL}/api/transcript-ai`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.error) {
        setError(data.message)
        setIsUploading(false)
        setIsProcessing(false)
      } else {
        setTaskId(data.data.task_id)
        simulateProgress()
        checkTaskStatus(data.data.task_id)
      }
    } catch (error) {
      setError(`An error occurred while processing the file: ${error}`)
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setIsProcessing(true)
      }
    }, 30)
  }

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/transcript-status/${taskId}`)
      const data = await response.json()

      setUploadProgress(data.progress)

      if (data.status === 'completed') {
        setIsUploading(false)
        setIsProcessing(false)
        setTranscript(data.data.transcript)
        setFileData(data.data)
      } else if (data.status === 'error') {
        setError(data.message)
        setIsUploading(false)
        setIsProcessing(false)
      } else {
        setTimeout(() => checkTaskStatus(taskId), 3000)
      }
    } catch (error) {
      setError('Error checking task status')
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const handleDownload = (fileType: 'json_file' | 'txt_file' | 'srt_file' | 'vtt_file') => {
    if (fileData && fileData[fileType]) {
      const data = fileData[fileType]
      const format = fileType.split('_')[0]
      const decodedData = Uint8Array.from(atob(data[`${format}_base64`]), c => c.charCodeAt(0))
      const blob = new Blob([decodedData], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.name
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const copyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="bg-slate-900 text-white flex items-center justify-center min-h-screen py-10">
      <div className="max-w-[785px] w-full px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Video Transcript Generator
          </h1>
          <p className="text-xl text-gray-400">
            Convert your video content into accurate text transcripts using AI
          </p>

          {/* Features list */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 ${index === 0 ? 'text-slate-300 bg-sky-950/50 border border-sky-400/20' : 'text-gray-400'} px-4 py-2 rounded-full backdrop-blur-sm`}
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
                <span>{feature.text}</span>
              </div>
            ))}
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
              id="fileInput"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*, audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative py-2.5 px-8 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 text-white rounded-lg border border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:ring-opacity-50 hover:border-cyan-400"
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
              className="bg-slate-800 text-white px-4 py-2.5 rounded-lg border border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
                <option value="en" data-flag="🇺🇸">🇺🇸 English</option>
                <option value="af" data-flag="🇿🇦">🇿🇦 Afrikaans</option>
                <option value="am" data-flag="🇪🇹">🇪🇹 Amharic</option>
                <option value="ar" data-flag="🇸🇦">🇸🇦 Arabic</option>
                <option value="as" data-flag="🇮🇳">🇮🇳 Assamese</option>
                <option value="az" data-flag="🇦🇿">🇦🇿 Azerbaijani</option>
                <option value="ba" data-flag="🇷🇺">🇷🇺 Bashkir</option>
                <option value="be" data-flag="🇧🇾">🇧🇾 Belarusian</option>
                <option value="bg" data-flag="🇧🇬">🇧🇬 Bulgarian</option>
                <option value="bn" data-flag="🇧🇩">🇧🇩 Bengali</option>
                <option value="bo" data-flag="🇨🇳">🇨🇳 Tibetan</option>
                <option value="br" data-flag="🇫🇷">🇫🇷 Breton</option>
                <option value="bs" data-flag="🇧🇦">🇧🇦 Bosnian</option>
                <option value="ca" data-flag="🇪🇸">🇪🇸 Catalan</option>
                <option value="cs" data-flag="🇨🇿">🇨🇿 Czech</option>
                <option value="cy" data-flag="🏴󠁧󠁢󠁷󠁬󠁳󠁿">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh</option>
                <option value="da" data-flag="🇩🇰">🇩🇰 Danish</option>
                <option value="de" data-flag="🇩🇪">🇩🇪 German</option>
                <option value="el" data-flag="🇬🇷">🇬🇷 Greek</option>
                <option value="eo" data-flag="🌍">🌍 Esperanto</option>
                <option value="es" data-flag="🇪🇸">🇪🇸 Spanish</option>
                <option value="et" data-flag="🇪🇪">🇪🇪 Estonian</option>
                <option value="eu" data-flag="🇪🇸">🇪🇸 Basque</option>
                <option value="fa" data-flag="🇮🇷">🇮🇷 Persian</option>
                <option value="fi" data-flag="🇫🇮">🇫🇮 Finnish</option>
                <option value="fo" data-flag="🇫🇴">🇫🇴 Faroese</option>
                <option value="fr" data-flag="🇫🇷">🇫🇷 French</option>
                <option value="gl" data-flag="🇪🇸">🇪🇸 Galician</option>
                <option value="gu" data-flag="🇮🇳">🇮🇳 Gujarati</option>
                <option value="ha" data-flag="🇳🇬">🇳🇬 Hausa</option>
                <option value="haw" data-flag="🇺🇸">🇺🇸 Hawaiian</option>
                <option value="hi" data-flag="🇮🇳">🇮🇳 Hindi</option>
                <option value="hr" data-flag="🇭🇷">🇭🇷 Croatian</option>
                <option value="hu" data-flag="🇭🇺">🇭🇺 Hungarian</option>
                <option value="hy" data-flag="🇦🇲">🇦🇲 Armenian</option>
                <option value="id" data-flag="🇮🇩">🇮🇩 Indonesian</option>
                <option value="is" data-flag="🇮🇸">🇮🇸 Icelandic</option>
                <option value="it" data-flag="🇮🇹">🇮🇹 Italian</option>
                <option value="ja" data-flag="🇯🇵">🇯🇵 Japanese</option>
                <option value="jw" data-flag="🇮🇩">🇮🇩 Javanese</option>
                <option value="ka" data-flag="🇬🇪">🇬🇪 Georgian</option>
                <option value="kk" data-flag="🇰🇿">🇰🇿 Kazakh</option>
                <option value="km" data-flag="🇰🇭">🇰🇭 Khmer</option>
                <option value="kn" data-flag="🇮🇳">🇮🇳 Kannada</option>
                <option value="ko" data-flag="🇰🇷">🇰🇷 Korean</option>
                <option value="la" data-flag="🏛️">🏛️ Latin</option>
                <option value="lb" data-flag="🇱🇺">🇱🇺 Luxembourgish</option>
                <option value="ln" data-flag="🇨🇩">🇨🇩 Lingala</option>
                <option value="lo" data-flag="🇱🇦">🇱🇦 Lao</option>
                <option value="lt" data-flag="🇱🇹">🇱🇹 Lithuanian</option>
                <option value="lv" data-flag="🇱🇻">🇱🇻 Latvian</option>
                <option value="mg" data-flag="🇲🇬">🇲🇬 Malagasy</option>
                <option value="mi" data-flag="🇳🇿">🇳🇿 Māori</option>
                <option value="mk" data-flag="🇲🇰">🇲🇰 Macedonian</option>
                <option value="ml" data-flag="🇮🇳">🇮🇳 Malayalam</option>
                <option value="mn" data-flag="🇲🇳">🇲🇳 Mongolian</option>
                <option value="mr" data-flag="🇮🇳">🇮🇳 Marathi</option>
                <option value="ms" data-flag="🇲🇾">🇲🇾 Malay</option>
                <option value="mt" data-flag="🇲🇹">🇲🇹 Maltese</option>
                <option value="my" data-flag="🇲🇲">🇲🇲 Burmese</option>
                <option value="ne" data-flag="🇳🇵">🇳🇵 Nepali</option>
                <option value="nl" data-flag="🇳🇱">🇳🇱 Dutch</option>
                <option value="nn" data-flag="🇳🇴">🇳🇴 Norwegian Nynorsk</option>
                <option value="no" data-flag="🇳🇴">🇳🇴 Norwegian</option>
                <option value="oc" data-flag="🇫🇷">🇫🇷 Occitan</option>
                <option value="pa" data-flag="🇮🇳">🇮🇳 Punjabi</option>
                <option value="pl" data-flag="🇵🇱">🇵🇱 Polish</option>
                <option value="ps" data-flag="🇦🇫">🇦🇫 Pashto</option>
                <option value="pt" data-flag="🇵🇹">🇵🇹 Portuguese</option>
                <option value="ro" data-flag="🇷🇴">🇷🇴 Romanian</option>
                <option value="ru" data-flag="🇷🇺">🇷🇺 Russian</option>
                <option value="sa" data-flag="🇮🇳">🇮🇳 Sanskrit</option>
                <option value="sd" data-flag="🇵🇰">🇵🇰 Sindhi</option>
                <option value="si" data-flag="🇱🇰">🇱🇰 Sinhala</option>
                <option value="sk" data-flag="🇸🇰">🇸🇰 Slovak</option>
                <option value="sl" data-flag="🇸🇮">🇸🇮 Slovenian</option>
                <option value="sn" data-flag="🇿🇼">🇿🇼 Shona</option>
                <option value="so" data-flag="🇸🇴">🇸🇴 Somali</option>
                <option value="sq" data-flag="🇦🇱">🇦🇱 Albanian</option>
                <option value="sr" data-flag="🇷🇸">🇷🇸 Serbian</option>
                <option value="su" data-flag="🇮🇩">🇮🇩 Sundanese</option>
                <option value="sv" data-flag="🇸🇪">🇸🇪 Swedish</option>
                <option value="sw" data-flag="🇹🇿">🇹🇿 Swahili</option>
                <option value="ta" data-flag="🇮🇳">🇮🇳 Tamil</option>
                <option value="te" data-flag="🇮🇳">🇮🇳 Telugu</option>
                <option value="tg" data-flag="🇹🇯">🇹🇯 Tajik</option>
                <option value="th" data-flag="🇹🇭">🇹🇭 Thai</option>
                <option value="tk" data-flag="🇹🇲">🇹🇲 Turkmen</option>
                <option value="tl" data-flag="🇵🇭">🇵🇭 Tagalog</option>
                <option value="tr" data-flag="🇹🇷">🇹🇷 Turkish</option>
                <option value="tt" data-flag="🇷🇺">🇷🇺 Tatar</option>
                <option value="uk" data-flag="🇺🇦">🇺🇦 Ukrainian</option>
                <option value="ur" data-flag="🇵🇰">🇵🇰 Urdu</option>
                <option value="uz" data-flag="🇺🇿">🇺🇿 Uzbek</option>
                <option value="vi" data-flag="🇻🇳">🇻🇳 Vietnamese</option>
                <option value="yo" data-flag="🇳🇬">🇳🇬 Yoruba</option>
                <option value="zh" data-flag="🇨🇳">🇨🇳 Chinese</option>
                <option value="zu" data-flag="🇿🇦">🇿🇦 Zulu</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-3">Supports MP4, MP3 ... • 50 MB</p>
        </div>

        {/* Upload progress container */}
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
                      strokeDashoffset: 251.2 * (1 - uploadProgress / 100),
                      transformOrigin: 'center',
                      animation: 'spin 2s linear infinite'
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

        {/* Processing container */}
        {isProcessing && (
          <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="text-center p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl border border-cyan-400/20">
              {/* Audio wave animation */}
              <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-4 sm:mb-6 audio-wave">
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                <div className="w-0.5 sm:w-1 h-10 sm:h-12 animate-[wave_1.2s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                <div className="w-0.5 sm:w-1 h-8 sm:h-10 animate-[wave_1.4s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                <div className="w-0.5 sm:w-1 h-12 sm:h-16 animate-[wave_1s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 animate-[wave_1.2s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-blue-500"></div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Generating Transcript<span className="dots"></span>
              </h3>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed py-2 sm:py-4">
                Our AI is processing your file. This may take a few minutes depending on the length.<br />
                <span className="text-white font-medium block mt-2 sm:mt-3">Please keep this page open.</span>
              </p>
            </div>
          </div>
        )}

        {/* Result Container */}
        {transcript && (
          <div className="mt-8">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 backdrop-blur-sm">
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
                  <div ref={dropdownRef} className="relative inline-block text-left">
                    <button
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
                          <button
                            onClick={() => handleDownload('json_file')}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg w-full text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            JSON
                          </button>

                          <button
                            onClick={() => handleDownload('txt_file')}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg w-full text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            TXT
                          </button>

                          <button
                            onClick={() => handleDownload('srt_file')}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg w-full text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            SRT
                          </button>

                          <button
                            onClick={() => handleDownload('vtt_file')}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 rounded-lg w-full text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            VTT
                          </button>
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
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <textarea
                value={transcript}
                readOnly
                className="w-full h-72 p-4 bg-gray-900/50 text-gray-200 rounded-lg resize-y text-base border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Error Container */}
        {error && !transcript && (
          <div className="mt-8">
            <div className="p-6 bg-red-500/10 border border-[#665dc3]/30 text-white rounded-xl backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-red-400">Error</p>
              </div>
              <p className="text-red-200 mt-2">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80%, 100% { content: "..."; }
        }

        .dots::after {
          content: "";
          animation: dots 1.5s steps(5, end) infinite;
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
  )
}
