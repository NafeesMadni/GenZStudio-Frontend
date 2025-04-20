'use client'

import { BaseSpotifyDownloader } from '../components/BaseSpotifyDownloader'

export default function SpotifyAlbumDownloader() {
  return (
    <BaseSpotifyDownloader
      title="Spotify Album Downloader"
      description="Download Album Tracks in High quality"
      metadataPath="/api/spotify-album-metadata"
      placeholder="https://open.spotify.com/album/..." />
  )
}
