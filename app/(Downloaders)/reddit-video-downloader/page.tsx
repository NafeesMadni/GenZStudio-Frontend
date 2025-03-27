'use client'

import { API_BASE_URL } from '@/app/utils/config'
import { useState, useRef } from 'react'

export default function RedditVideoDownloader() {
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
      const response = await fetch(`${API_BASE_URL}/api/reddit-video-metadata`, {
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
        setVideoTitle(data.data.videoTitle || 'Reddit Video')
        setChannelName(data.data.channelName || 'Reddit User')
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
                  viewBox="0 0 256 256"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))' }}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                >
                  <circle fill="#00d3f3" cx="128" cy="128" r="128"></circle>
                  <path
                    d="M213.149867,129.220267 C213.149867,118.843733 204.758756,110.603378 194.532978,110.603378 C189.498311,110.603378 184.918756,112.585956 181.562311,115.791644 C168.745244,106.635378 151.195022,100.6848 131.662222,99.9224889 L140.206933,59.9409778 L167.980089,65.8915556 C168.287289,72.9116444 174.084267,78.5578667 181.257956,78.5578667 C188.5824,78.5578667 194.532978,72.6072889 194.532978,65.28 C194.532978,57.9555556 188.5824,52.0049778 181.257956,52.0049778 C176.069689,52.0049778 171.490133,55.0570667 169.353956,59.4830222 L138.377956,52.9208889 C137.462044,52.7672889 136.546133,52.9208889 135.934578,53.3788444 C135.172267,53.8368 134.714311,54.5991111 134.563556,55.5150222 L125.100089,100.073244 C105.262933,100.6848 87.4083556,106.635378 74.4376889,115.945244 C71.0812444,112.739556 66.5016889,110.756978 61.4670222,110.756978 C51.0904889,110.756978 42.8501333,119.148089 42.8501333,129.373867 C42.8501333,137.002667 47.4268444,143.4112 53.8382222,146.312533 C53.5310222,148.141511 53.3802667,149.973333 53.3802667,151.958756 C53.3802667,180.644978 86.7996444,203.995022 128.001422,203.995022 C169.2032,203.995022 202.622578,180.798578 202.622578,151.958756 C202.622578,150.126933 202.468978,148.141511 202.164622,146.312533 C208.573156,143.4112 213.149867,136.849067 213.149867,129.220267 Z M85.2721778,142.495289 C85.2721778,135.170844 91.2227556,129.220267 98.5500444,129.220267 C105.874489,129.220267 111.825067,135.170844 111.825067,142.495289 C111.825067,149.819733 105.874489,155.773156 98.5500444,155.773156 C91.2227556,155.923911 85.2721778,149.819733 85.2721778,142.495289 Z M159.588978,177.746489 C150.432711,186.902756 133.036089,187.514311 128.001422,187.514311 C122.813156,187.514311 105.416533,186.749156 96.4110222,177.746489 C95.04,176.372622 95.04,174.236444 96.4110222,172.862578 C97.7848889,171.491556 99.9210667,171.491556 101.294933,172.862578 C107.094756,178.6624 119.303111,180.644978 128.001422,180.644978 C136.699733,180.644978 149.058844,178.6624 154.705067,172.862578 C156.078933,171.491556 158.215111,171.491556 159.588978,172.862578 C160.809244,174.236444 160.809244,176.372622 159.588978,177.746489 Z M157.1456,155.923911 C149.821156,155.923911 143.870578,149.973333 143.870578,142.648889 C143.870578,135.324444 149.821156,129.373867 157.1456,129.373867 C164.472889,129.373867 170.423467,135.324444 170.423467,142.648889 C170.423467,149.819733 164.472889,155.923911 157.1456,155.923911 Z"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  ></path>
                </svg>
              </div>
            </div>
            <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Reddit Video Downloader
            </h1>
            <p className="text-slate-400 text-xs md:text-sm lg:text-base max-w-xl mx-auto">
              Download Video in high quality
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="video_url" className="flex items-center gap-2 text-gray-200 font-medium">
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
                Enter Video Url:
              </label>

              <div className="relative">
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.reddit.com/user/..."
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
              <p className="text-red-200 mt-2">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
