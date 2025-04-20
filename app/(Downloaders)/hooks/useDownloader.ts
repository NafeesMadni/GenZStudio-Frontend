import { useState } from 'react'
import { API_BASE_URL } from '@/app/utils/config'
import toast from 'react-hot-toast'

export function useDownloader(downloadPath: string, metadataPath: string) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [channelName, setChannelName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({})
  const [downloading, setDownloading] = useState<{[key: string]: boolean}>({})
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      toast.error('Please enter a URL')
      return
    }
    
    setLoading(true)
    setShowResult(false)
    
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
        setTitle(data.data.videoTitle || data.data.title)
        setChannelName(data.data.channelName || data.data.artist)
        setShowResult(true)
        toast.success('Information fetched successfully')
      }
    } catch (error) {
      toast.error('Failed to fetch information')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (type: 'video' | 'audio') => {
    const downloadUrl = url.trim()
    if (!downloadUrl) {
      toast.error('Please enter a valid URL before downloading')
      return
    }

    const downloadPromise = new Promise(async (resolve, reject) => {
      try {
        setDownloading(prev => ({ ...prev, [type]: true }))
        setDownloadProgress(prev => ({ ...prev, [type]: 0 }))
        
        const apiUrl = `${API_BASE_URL}${downloadPath}/${type}?url=${encodeURIComponent(downloadUrl)}`
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        
        const mediaType = response.headers.get('Content-Type') || 
                          (type === 'video' ? 'video/mp4' : 'audio/mp3')
        
        let fileExtension = type === 'video' ? 'mp4' : 'mp3'
        if (mediaType.includes('audio/mpeg') || mediaType.includes('audio/mp3')) {
          fileExtension = 'mp3'
        } else if (mediaType.includes('audio/m4a')) {
          fileExtension = 'm4a'
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
              [type]: Math.round((receivedLength / total) * 100) 
            }))
          } else if (chunks.length % 10 === 0) {
            setDownloadProgress(prev => ({ 
              ...prev, 
              [type]: prev[type] < 99 ? prev[type] + 1 : 99
            }))
          }
        }
        
        let chunksAll = new Uint8Array(receivedLength)
        let position = 0
        for (const chunk of chunks) {
          chunksAll.set(chunk, position)
          position += chunk.length
        }
        
        setDownloadProgress(prev => ({ ...prev, [type]: 100 }))
        
        const blob = new Blob([chunksAll], { type: mediaType })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setDownloading(prev => ({ ...prev, [type]: false }))
        resolve(`${type.charAt(0).toUpperCase() + type.slice(1)} downloaded successfully!`)
      } catch (error: any) {
        const errorMessage = `Failed to download ${type}`
        setDownloading(prev => ({ ...prev, [type]: false }))
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
    title,
    channelName,
    loading,
    showResult,
    downloadProgress,
    downloading,
    handleSubmit,
    handleDownload,
  }
}