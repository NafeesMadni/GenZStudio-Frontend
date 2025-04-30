'use client'

import { useDownloader } from '../hooks/useDownloader'

interface BaseDownloaderProps {
  title: string
  description: string
  icon: React.ReactNode
  downloadPath: string
  metadataPath: string
  placeholder?: string
}

export function BaseDownloader({
  title,
  description,
  icon,
  downloadPath,
  metadataPath,
  placeholder
}: BaseDownloaderProps) {
  const {
    url: mediaUrl,
    setUrl: setMediaUrl,
    title: mediaTitle,
    channelName,
    loading,
    showResult,
    downloadProgress,
    downloading,
    handleSubmit,
    handleDownload,
  } = useDownloader(downloadPath, metadataPath)

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#00f2ea]/10 rounded-2xl">
                {icon}
              </div>
            </div>
            <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm lg:text-base max-w-xl mx-auto">
              {description}
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="media_url" className="flex items-center gap-2 text-gray-200 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00d3f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                Enter URL
              </label>
              <input
                type="url"
                id="media_url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={placeholder || "Enter URL here..."}
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                required
              />
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
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
                <p className="text-gray-200 font-medium truncate">{mediaTitle}</p>
                <p className="text-gray-400 text-sm truncate">{channelName}</p>
              </div>
              <button
                onClick={() => handleDownload('video')}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                disabled={downloading['video']}
              >
                {downloading['video'] ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {downloadProgress['video'] > 0 && (
                      <span>{downloadProgress['video']}%</span>
                    )}
                    {downloadProgress['video'] == 0 && (
                      <span className="hidden sm:inline">Downloading...</span>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                <p className="text-gray-200 font-medium truncate">{mediaTitle}</p>
                <p className="text-gray-400 text-sm truncate">{channelName}</p>
              </div>
              <button
                onClick={() => handleDownload('audio')}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                disabled={downloading['audio']}
              >
                {downloading['audio'] ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {downloadProgress['audio'] > 0 && (
                      <span>{downloadProgress['audio']}%</span>
                    )}
                    {downloadProgress['audio'] == 0 && (
                      <span className="hidden sm:inline">Downloading...</span> 
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
