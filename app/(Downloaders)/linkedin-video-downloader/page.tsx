'use client'

import { BaseDownloader } from '../components/BaseDownloader'

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))' }}
  >
    <path
      fill="#00d3f3"
      d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.67H9.36V9h3.41v1.56h.05c.47-.89 1.61-1.85 3.32-1.85 3.55 0 4.2 2.34 4.2 5.37v6.37z"
    />
  </svg>
)

export default function LinkedinVideoDownloader() {
  return (
    <BaseDownloader
      title="LinkedIn Video Downloader"
      description="Download LinkedIn videos in high quality"
      icon={<LinkedInIcon />}
      placeholder="https://www.linkedin.com/posts/..."
      downloadPath="/api/stream"
      metadataPath="/api/linkedin-video-metadata"
    />
  )
}
