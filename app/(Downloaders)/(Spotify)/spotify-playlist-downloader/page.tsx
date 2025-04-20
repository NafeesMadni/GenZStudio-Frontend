'use client'

import { BaseSpotifyDownloader } from '../components/BaseSpotifyDownloader'

export default function SpotifyPlaylistDownloader() {
  return (
    <BaseSpotifyDownloader
      title="Spotify Playlist Downloader"
      description="Download Playlist Tracks in High quality"
      metadataPath="/api/spotify-playlist-metadata"
      placeholder="https://open.spotify.com/playlist/..."
    />
  )
}
