import { useRef } from 'react';
import { ImageProcessingState } from '../types';

interface ImageUploadProps {
  state: ImageProcessingState;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedTool: string;
  onFileSelect: (file: File | null) => void;
  onProcess: () => void;
  onDownload: () => void;
  onTogglePreview: () => void;
  onReset: () => void;
  onBackgroundPromptChange: (prompt: string) => void;
}

export const ImageUpload = ({
  state,
  fileInputRef,
  selectedTool,
  onFileSelect,
  onProcess,
  onDownload,
  onTogglePreview,
  onReset,
  onBackgroundPromptChange
}: ImageUploadProps) => {
  return (
    <div className="col-span-full mb-8">
      <div className="w-full max-w-2xl mx-auto">
        <div 
          id="dropZone"
          className="border-2 border-dashed border-cyan-400/50 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('border-cyan-400');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-cyan-400');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-cyan-400');
            onFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => {
            if (!state.originalImage) {
              fileInputRef.current?.click();
            }
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => onFileSelect(e.target.files?.[0] || null)} 
          />
          
          {!state.originalImage ? (
            <div id="uploadPrompt">
              <svg className="mx-auto h-12 w-12 text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-cyan-400 mb-2">Drag and drop your image here</p>
              <p className="text-slate-400 text-sm">or</p>
              <button className="mt-2 px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={state.isPreviewingOriginal ? state.originalImage : (state.processedImage || state.originalImage)}
                className="max-h-96 mx-auto rounded-lg"
                alt="Preview"
              />
              {state.processedImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePreview();
                  }}
                  className={`preview-icon ${!state.isPreviewingOriginal ? 'show' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="absolute top-2 right-2 p-1 bg-slate-800/80 rounded-full text-cyan-400 hover:bg-slate-700/80"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {selectedTool === 'replace-bg' && (
          <div className="mb-4">
            <input
              type="text"
              value={state.backgroundPrompt}
              onChange={(e) => onBackgroundPromptChange(e.target.value)}
              placeholder="Enter new background description (e.g., 'beach sunset', 'office space')"
              className="w-full mt-4 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        )}
        
        {state.originalImage && (
          <button
            onClick={onProcess}
            disabled={state.isProcessing}
            className="mt-4 w-full py-3 process-btn text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            {state.isProcessing ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Process Image
              </>
            )}
          </button>
        )}
        
        {state.processedImage && (
          <button
            onClick={onDownload}
            className="mt-2 w-full py-3 download-btn text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        )}
      </div>
    </div>
  );
}; 