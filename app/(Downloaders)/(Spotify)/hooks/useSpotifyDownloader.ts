import { useState } from 'react'
import { API_BASE_URL } from '@/app/utils/config'
import toast from 'react-hot-toast'

interface Track {
  title: string;
  artistName: string;
}

interface Data {
  title: string; 
  tracks_metadata: Track[];
}

export function useSpotifyDownloader(metadataPath: string) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Data | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({})
  const [downloading, setDownloading] = useState<{[key: string]: boolean}>({})
  const [completedDownloads, setCompletedDownloads] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Please enter a URL')
      return
    }
    
    setLoading(true)
    setShowResult(false)
    setData(null)
    setCompletedDownloads(0)
    
    try {
      const response = await fetch(`${API_BASE_URL}${metadataPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast.error(data.message || 'Error fetching information')
      } else {
        setData(data.data)
        setShowResult(true)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Failed to fetch information')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTrack = async (track: Track) => {
    const trackId = `${track.title}-${track.artistName}`
    const downloadPromise = new Promise(async (resolve, reject) => {
      try {
        setDownloading(prev => ({ ...prev, [trackId]: true }))
        setDownloadProgress(prev => ({ ...prev, [trackId]: 0 }))

        const apiUrl = `${API_BASE_URL}/api/stream/track?title=${encodeURIComponent(track.title)}&artistName=${encodeURIComponent(track.artistName)}`
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        
        const contentLength = response.headers.get('Content-Length')
        const total = contentLength ? parseInt(contentLength, 10) : 0
        const reader = response.body?.getReader()
        let receivedLength = 0
        let chunks = []
        
        if (!reader) throw new Error('Stream reader not available')
        
        while(true) {
          const { done, value } = await reader.read()
          
          if (done) {
            break
          }
          
          chunks.push(value)
          receivedLength += value.length
          
          if (total) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              [trackId]: Math.round((receivedLength / total) * 100) 
            }))
          } else if (chunks.length % 10 === 0) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              [trackId]: prev[trackId] < 99 ? prev[trackId] + 1 : 99
            }))
          }
        }
        
        let chunksAll = new Uint8Array(receivedLength)
        let position = 0
        
        for (const chunk of chunks) {
          chunksAll.set(chunk, position)
          position += chunk.length
        }
        
        setDownloadProgress(prev => ({ ...prev, [trackId]: 100 }))
        
        const blob = new Blob([chunksAll], { type: 'audio/mp3' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${track.title} - ${track.artistName}.mp3`.replace(/[^a-z0-9]/gi, '_')
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setDownloading(prev => ({ ...prev, [trackId]: false }))
        setCompletedDownloads(prev => prev + 1)
        resolve('Track downloaded successfully!')
      } catch (error: any) {
        const errorMessage = 'Failed to download track'
        setDownloading(prev => ({ ...prev, [trackId]: false }))
        reject(errorMessage)
      }
    })

    downloadPromise
      .then((message) => toast.success(message as string))
      .catch((error) => toast.error(error as string))
  }

  const handleDownloadZip = async () => {
    if (!data) return

    const downloadPromise = new Promise(async (resolve, reject) => {
      try {
        setDownloading(prev => ({ ...prev, zip: true }))
        setDownloadProgress(prev => ({ ...prev, zip: 0 }))

        const apiUrl = `${API_BASE_URL}/api/stream/zip?tracks_metadata=${encodeURIComponent(
          JSON.stringify(data.tracks_metadata)
        )}&fileName=${encodeURIComponent(data.title)}`
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        
        const contentLength = response.headers.get('Content-Length')
        const total = contentLength ? parseInt(contentLength, 10) : 0
        const reader = response.body?.getReader()
        let receivedLength = 0
        let chunks = []
        
        if (!reader) throw new Error('Stream reader not available')
        
        while(true) {
          const { done, value } = await reader.read()
          
          if (done) {
            break
          }
          
          chunks.push(value)
          receivedLength += value.length
          
          if (total) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              zip: Math.round((receivedLength / total) * 100) 
            }))
          } else if (chunks.length % 10 === 0) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              zip: prev.zip < 99 ? prev.zip + 1 : 99
            }))
          }
        }
        
        let chunksAll = new Uint8Array(receivedLength)
        let position = 0
        
        for (const chunk of chunks) {
          chunksAll.set(chunk, position)
          position += chunk.length
        }
        
        setDownloadProgress(prev => ({ ...prev, zip: 100 }))
        
        const blob = new Blob([chunksAll], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${data.title}.zip`.replace(/[^a-z0-9]/gi, '_')
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setDownloading(prev => ({ ...prev, zip: false }))
        resolve('Zip downloaded successfully!')
      } catch (error: any) {
        const errorMessage = 'Failed to download collection'
        setDownloading(prev => ({ ...prev, zip: false }))
        reject(errorMessage)
      }
    })

    downloadPromise
      .then((message) => toast.success(message as string))
      .catch((error) => toast.error(error as string))
  }

  return {
    url,
    setUrl,
    loading,
    data,
    showResult,
    downloadProgress,
    downloading,
    handleSubmit,
    handleDownloadTrack,
    handleDownloadZip,
    completedDownloads
  }
}