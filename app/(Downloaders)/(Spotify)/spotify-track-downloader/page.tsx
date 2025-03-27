'use client'

import { API_BASE_URL } from '@/app/utils/config'
import { useState, useRef } from 'react'

export default function SpotifyTrackDownloader() {
  const [trackUrl, setTrackUrl] = useState('')
  const [title, setTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResult, setShowResult] = useState(false)
  
  const downloadButtonRef = useRef<HTMLButtonElement>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackUrl) return
    
    setLoading(true)
    setError('')
    setShowResult(false)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/spotify-track-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trackUrl }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.message || 'Error fetching track information')
      } else {
        setTitle(data.data.title)
        setArtistName(data.data.artistName)
        setShowResult(true)
      }
    } catch (error) {
      console.error(error)
      setError('Failed to fetch track information')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDownload = () => {
    window.location.href = `/api/stream/track?title=${encodeURIComponent(title)}&artistName=${encodeURIComponent(artistName)}`
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#00f2ea]/10 rounded-2xl">
                <svg
                  viewBox="0 0 24 24"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))' }}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                >
                  <path
                    fill="#00d3f3"
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Spotify Track Downloader
            </h1>
            <p className="text-slate-400 text-xs md:text-sm lg:text-base max-w-xl mx-auto">
              Download Tracks in High quality
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="track_url"
                className="flex items-center gap-2 text-slate-200 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-cyan-400"
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
                Enter Track URL:
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="track_url"
                  name="track_url"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
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
                  Search Track
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
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span className="text-cyan-400 font-medium">MP3 Audio</span>
                </div>
                <p className="text-slate-200 font-medium truncate">{title}</p>
                <p className="text-slate-400 text-sm truncate">{artistName}</p>
              </div>

              <button
                ref={downloadButtonRef}
                onClick={handleDownload}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
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
                <span className="hidden sm:inline">Download</span>
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
