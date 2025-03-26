'use client';

import { API_BASE_URL } from '@/app/utils/config';
import { useState } from 'react';

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedImages(data.images);
      showToast("Images generated successfully!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to generate images", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const previewImage = (url: string) => {
    window.open(url, "_blank");
  };

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image downloaded successfully!");
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            AI Image Generator
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Create stunning images with the power of AI. Just describe what you want
            to see.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none resize-none"
                placeholder="Describe the image you want to generate..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg> 
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Images
                </>
              )}
            </button>
          </form>
        </div>

        {generatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="image-card">
                <img src={imageUrl} alt="Generated image" className="w-full h-64 object-cover" />
                <div className="image-actions">
                  <button onClick={() => previewImage(imageUrl)} className="action-btn">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button onClick={() => downloadImage(imageUrl)} className="action-btn">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div 
        className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`} 
        role="alert"
      >
        {toast.message}
      </div>

      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #22d3ee, #0ea5e9, #0ea5e9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .toast {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          color: white;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 50;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .toast.show {
          transform: translateX(0);
          opacity: 1;
        }

        .toast.success {
          background: rgba(16, 185, 129, 0.85);
        }

        .toast.error {
          background: rgba(239, 68, 68, 0.85);
        }

        .image-card {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .image-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.2);
        }

        .image-actions {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-card:hover .image-actions {
          opacity: 1;
        }

        .action-btn {
          padding: 0.5rem;
          border-radius: 9999px;
          background: rgba(34, 211, 238, 0.2);
          color: #22d3ee;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(34, 211, 238, 0.3);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
