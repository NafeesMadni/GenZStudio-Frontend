'use client'

import { API_BASE_URL } from '@/app/utils/config'
import { useState, useRef } from 'react'

export default function InstagramVideoDownloader() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [channelName, setChannelName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResult, setShowResult] = useState(false)
  
  const videoDownloadRef = useRef<HTMLButtonElement>(null)
  const audioDownloadRef = useRef<HTMLButtonElement>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoUrl) return
    
    setLoading(true)
    setError('')
    setShowResult(false)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/instagram-video-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.message || 'Error fetching video information')
      } else {
        setVideoTitle(data.data.videoTitle)
        setChannelName(data.data.channelName)
        setShowResult(true)
      }
    } catch (error) {
      console.error(error)
      setError('Failed to fetch video information')
    } finally {
      setLoading(false)
    }
  }
  
  const handleVideoDownload = () => {
    window.location.href = `/api/stream/video?video_url=${encodeURIComponent(videoUrl)}`
  }
  
  const handleAudioDownload = () => {
    window.location.href = `/api/stream/audio?video_url=${encodeURIComponent(videoUrl)}`
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#00f2ea]/10 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))' }}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                >
                  <path
                    fill="#00d3f3"
                    d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Instagram Reels Downloader
            </h1>
            <p className="text-slate-400 text-xs md:text-sm lg:text-base max-w-xl mx-auto">
              Download Instagram Reels in HD quality
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-200 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#00d3f3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Enter Video URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Video
                </>
              )}
            </button>
          </form>
        </div>

        {showResult && (
          <div className="mt-8">
            <div className="p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm transition-all duration-300 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-cyan-400 font-medium">MP4 Video</span>
                </div>
                <p className="text-gray-200 font-medium truncate">{videoTitle}</p>
                <p className="text-gray-400 text-sm truncate">{channelName}</p>
              </div>
              <button
                ref={videoDownloadRef}
                onClick={handleVideoDownload}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Download Video</span>
              </button>
            </div>
            <div className="mt-4 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm transition-all duration-300 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span className="text-cyan-400 font-medium">MP3 Audio</span>
                </div>
                <p className="text-gray-200 font-medium truncate">{videoTitle}</p>
                <p className="text-gray-400 text-sm truncate">{channelName}</p>
              </div>
              <button
                ref={audioDownloadRef}
                onClick={handleAudioDownload}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Download Audio</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8">
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-sm">
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
              <p className="text-red-300 mt-2" dangerouslySetInnerHTML={{ __html: error }}></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
