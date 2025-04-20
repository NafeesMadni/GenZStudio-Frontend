'use client'

import { BaseDownloader } from '../components/BaseDownloader'

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))' }}
    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
  >
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="#00d3f3"
    />
  </svg>
)

export default function XVideoDownloader() {
  return (
    <BaseDownloader
      title="X Video Downloader"
      description="Download Video in HD quality"
      icon={<XIcon />}
      placeholder="https://twitter.com/..."
      downloadPath="/api/stream"
      metadataPath="/api/x-video-metadata"
    />
  )
}
