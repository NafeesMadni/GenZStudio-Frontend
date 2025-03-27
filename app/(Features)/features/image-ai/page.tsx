// 'use client';

// import { API_BASE_URL } from '@/app/utils/config';
// import { useState, useRef, useEffect } from 'react';

// export default function ImageAI() {
//   // State management
//   const [selectedTool, setSelectedTool] = useState<string>('remove-bg');
//   const [originalImage, setOriginalImage] = useState<string | null>(null);
//   const [processedImage, setProcessedImage] = useState<string | null>(null);
//   const [isPreviewingOriginal, setIsPreviewingOriginal] = useState<boolean>(false);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [backgroundPrompt, setBackgroundPrompt] = useState<string>('');
//   const [toast, setToast] = useState<{message: string; type: string; visible: boolean}>({
//     message: '',
//     type: 'success',
//     visible: false
//   });
  
//   // Refs
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   // Tool options
//   const tools = [
//     {
//       id: 'remove-bg',
//       title: 'Background Remover',
//       description: 'Remove background from images with one click using advanced AI',
//       icon: (
//         <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       )
//     },
//     {
//       id: 'replace-bg',
//       title: 'Replace Background',
//       description: 'Swap backgrounds with custom images seamlessly',
//       icon: (
//         <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//         </svg>
//       )
//     },
//     {
//       id: 'remove-text',
//       title: 'Text Remover',
//       description: 'Remove unwanted text from images with precision',
//       icon: (
//         <svg className="tool-icon w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//       )
//     }
//   ];

//   // Show toast notification
//   const showToast = (message: string, type: 'success' | 'error' = 'success') => {
//     setToast({ message, type, visible: true });
//     setTimeout(() => {
//       setToast(prev => ({ ...prev, visible: false }));
//     }, 3000);
//   };

//   // Reset UI state
//   const resetUI = () => {
//     setOriginalImage(null);
//     setProcessedImage(null);
//     setBackgroundPrompt('');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//     if (previewTimeoutRef.current) {
//       clearTimeout(previewTimeoutRef.current);
//       previewTimeoutRef.current = null;
//     }
//   };

//   // Handle file selection
//   const handleFile = (file: File | null) => {
//     if (!file || !file.type.startsWith('image/')) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target?.result) {
//         setOriginalImage(e.target.result as string);
//         setProcessedImage(null);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   // Toggle between original and processed image preview
//   const togglePreview = () => {
//     if (!originalImage || !processedImage) return;

//     if (previewTimeoutRef.current) {
//       clearTimeout(previewTimeoutRef.current);
//       previewTimeoutRef.current = null;
//     }

//     setIsPreviewingOriginal(true);

//     previewTimeoutRef.current = setTimeout(() => {
//       setIsPreviewingOriginal(false);
//       previewTimeoutRef.current = null;
//     }, 1500);
//   };

//   // Process image based on selected tool
//   const processImage = async () => {
//     if (!originalImage || !fileInputRef.current?.files?.[0]) {
//       showToast('Please select an image first', 'error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', fileInputRef.current.files[0]);

//     if (selectedTool === 'replace-bg') {
//       if (!backgroundPrompt) {
//         showToast('Please describe the new background', 'error');
//         return;
//       }
//       formData.append('prompt', backgroundPrompt);
//     }

//     setIsProcessing(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/${selectedTool}`, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (!result.error) {
//         const base64Image = result.data.img;
//         setProcessedImage(`data:image/png;base64,${base64Image}`);
//         showToast('Image processed successfully!');
//       } else {
//         throw new Error(result.message || 'Failed to process image');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showToast(
//         error instanceof Error ? error.message : 'Failed to process image. Please try again.',
//         'error'
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Download processed image
//   const downloadImage = () => {
//     if (!processedImage) return;
    
//     const link = document.createElement('a');
//     link.href = processedImage;
//     link.download = `processed-image-${Date.now()}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     showToast('Image downloaded successfully!');
//   };

//   // Clean up timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (previewTimeoutRef.current) {
//         clearTimeout(previewTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="bg-slate-900 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header Section */}
//         <div className="text-center mb-16 space-y-4">
//           <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//             AI Image Processing Tools
//           </h1>
//           <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
//             Transform your images instantly with our advanced AI-powered tools
//           </p>
//           <div className="flex justify-center gap-2 mt-4">
//             <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">Fast Processing</span>
//             <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">High Quality</span>
//             <span className="px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">Easy to Use</span>
//           </div>
//         </div>

//         {/* Enhanced Tools Grid */}
//         <div className="grid tools-grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6">
//           {tools.map((tool, index) => (
//             <button
//               key={tool.id}
//               className={`tool-button bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center gap-4 border ${
//                 selectedTool === tool.id 
//                 ? 'active border-cyan-400/50' 
//                 : 'border-slate-700/50 hover:border-cyan-400/50'
//               }`}
//               onClick={() => {
//                 setSelectedTool(tool.id);
//                 resetUI();
//               }}
//             >
//               <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl">
//                 {tool.icon}
//               </div>
//               <div className="text-center space-y-2">
//                 <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
//                 <p className="text-sm text-slate-400 leading-relaxed">
//                   {tool.description}
//                 </p>
//               </div>
//               <span className="mt-3 px-4 py-1.5 bg-cyan-500/10 rounded-full text-cyan-400 text-sm font-medium">
//                 Try Now →
//               </span>
//             </button>
//           ))}

//           {/* Image Upload Area */}
//           <div className="col-span-full mb-8">
//             <div className="w-full max-w-2xl mx-auto">
//               <div 
//                 id="dropZone"
//                 className="border-2 border-dashed border-cyan-400/50 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   e.currentTarget.classList.add('border-cyan-400');
//                 }}
//                 onDragLeave={(e) => {
//                   e.preventDefault();
//                   e.currentTarget.classList.remove('border-cyan-400');
//                 }}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   e.currentTarget.classList.remove('border-cyan-400');
//                   handleFile(e.dataTransfer.files[0]);
//                 }}
//                 onClick={() => {
//                   if (!originalImage) {
//                     fileInputRef.current?.click();
//                   }
//                 }}
//               >
//                 <input 
//                   type="file" 
//                   ref={fileInputRef}
//                   className="hidden" 
//                   accept="image/*"
//                   onChange={(e) => handleFile(e.target.files?.[0] || null)} 
//                 />
                
//                 {!originalImage ? (
//                   <div id="uploadPrompt">
//                     <svg className="mx-auto h-12 w-12 text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                     </svg>
//                     <p className="text-cyan-400 mb-2">Drag and drop your image here</p>
//                     <p className="text-slate-400 text-sm">or</p>
//                     <button className="mt-2 px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-colors">
//                       Browse Files
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <img
//                       src={isPreviewingOriginal ? originalImage : (processedImage || originalImage)}
//                       className="max-h-96 mx-auto rounded-lg"
//                       alt="Preview"
//                     />
//                     {processedImage && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           togglePreview();
//                         }}
//                         className={`preview-icon ${!isPreviewingOriginal ? 'show' : ''}`}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </button>
//                     )}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         resetUI();
//                       }}
//                       className="absolute top-2 right-2 p-1 bg-slate-800/80 rounded-full text-cyan-400 hover:bg-slate-700/80"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               {selectedTool === 'replace-bg' && (
//                 <div className="mb-4">
//                   <input
//                     type="text"
//                     value={backgroundPrompt}
//                     onChange={(e) => setBackgroundPrompt(e.target.value)}
//                     placeholder="Enter new background description (e.g., 'beach sunset', 'office space')"
//                     className="w-full mt-4 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
//                   />
//                 </div>
//               )}
              
//               {originalImage && (
//                 <button
//                   onClick={processImage}
//                   disabled={isProcessing}
//                   className="mt-4 w-full py-3 process-btn text-white rounded-xl font-medium flex items-center justify-center gap-2"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                       </svg>
//                       Process Image
//                     </>
//                   )}
//                 </button>
//               )}
              
//               {processedImage && (
//                 <button
//                   onClick={downloadImage}
//                   className="mt-2 w-full py-3 download-btn text-white rounded-xl font-medium flex items-center justify-center gap-2"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   Download
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Toast notification */}
//       <div 
//         className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`} 
//         role="alert"
//       >
//         {toast.message}
//       </div>

//       <style jsx global>{`
//         .tool-button {
//           transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(8px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .tool-button:hover {
//           transform: translateY(-6px) scale(1.02);
//           box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.15),
//             0 0 20px rgba(14, 165, 233, 0.1);
//         }

//         .tool-button.active {
//           border-color: rgba(34, 211, 238, 0.5);
//           background: rgba(14, 165, 233, 0.15);
//           transform: translateY(-6px);
//           box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.2),
//             0 0 25px rgba(14, 165, 233, 0.1);
//         }

//         .tool-icon {
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .tool-button:hover .tool-icon {
//           transform: scale(1.1);
//         }

//         .gradient-text {
//           background: linear-gradient(135deg, #22d3ee, #0ea5e9, #0ea5e9);
//           -webkit-background-clip: text;
//           background-clip: text;
//           color: transparent;
//           background-size: 200% 200%;
//           animation: gradient-shift 8s ease infinite;
//         }

//         @keyframes gradient-shift {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }

//         @media (max-width: 768px) {
//           .tools-grid {
//             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           }
//         }

//         .preview-icon {
//           position: absolute;
//           top: 2px;
//           left: 2px;
//           padding: 4px;
//           background: rgba(15, 23, 42, 0.8);
//           border-radius: 9999px;
//           color: #22d3ee;
//           cursor: pointer;
//           display: none;
//         }

//         .preview-icon.show {
//           display: block;
//           opacity: 1;
//         }

//         .toast {
//           position: fixed;
//           bottom: 1rem;
//           right: 1rem;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           color: white;
//           transform: translateX(100%);
//           opacity: 0;
//           transition: all 0.3s ease;
//           z-index: 50;
//           backdrop-filter: blur(12px);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .toast.show {
//           transform: translateX(0);
//           opacity: 1;
//         }

//         .toast.success {
//           background: rgba(16, 185, 129, 0.85);
//         }

//         .toast.error {
//           background: rgba(239, 68, 68, 0.85);
//         }

//         #dropZone {
//           background: rgba(15, 23, 42, 0.3);
//           backdrop-filter: blur(10px);
//           border: 2px dashed rgba(34, 211, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         #dropZone:hover {
//           border-color: rgba(34, 211, 238, 0.6);
//           box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
//         }

//         .process-btn {
//           background: linear-gradient(135deg, #22d3ee, #0ea5e9);
//           transition: all 0.3s ease;
//           position: relative;
//           color: white;
//           transform: translateY(0);
//         }

//         .process-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 20px -10px rgba(34, 211, 238, 0.5);
//         }

//         .download-btn {
//           background: rgba(15, 23, 42, 0.5);
//           backdrop-filter: blur(8px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           transition: all 0.3s ease;
//         }

//         .download-btn:hover {
//           background: rgba(15, 23, 42, 0.7);
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.1);
//         }
//       `}</style>
//     </div>
//   );
// }
