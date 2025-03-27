export default function Page() {
    return <div>AI Video Script Generator Page</div>;
}
// 'use client';

// import { API_BASE_URL } from '@/app/utils/config';
// import { useState, useEffect } from 'react';

// export default function AIVideoScriptGenerator() {
//   const [videoTopic, setVideoTopic] = useState('');
//   const [generatedScript, setGeneratedScript] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isCopied, setIsCopied] = useState(false);
//   const [marked, setMarked] = useState<any>(null);

//   // Dynamically import marked on the client side
//   useEffect(() => {
//     import('marked').then((module) => {
//       setMarked(() => module.marked);
//     });
//   }, []);
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!videoTopic.trim()) return;
    
//     setIsLoading(true);
//     setGeneratedScript('');
//     setError('');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/content-creation/ai-video-script-generator`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ topic: videoTopic }),
//       });

//       const data = await response.json();

//       if (data.error) {
//         setError(data.message || 'Failed to generate script. Please try again.');
//       } else {
//         const formattedContent = data.data
//           .replace(/\n\n/g, "\n\n\n")
//           .replace(/^#{1}\s/gm, "# ")
//           .replace(/^#{2}\s/gm, "## ")
//           .replace(/^#{3}\s/gm, "### ")
//           .replace(/^#{4}\s/gm, "#### ")
//           .replace(/^#{5}\s/gm, "##### ")
//           .replace(/^#{6}\s/gm, "###### ")
//           .replace(/^\*\s/gm, "* ")
//           .replace(/^\d\.\s/gm, "$&");

//         setGeneratedScript(formattedContent || "No script generated.");
//       }
//     } catch (error) {
//       setError('An error occurred while generating the script. Please try again.');
//       console.error('Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyScript = () => {
//     if (!generatedScript) return;
    
//     const textArea = document.createElement("textarea");
//     textArea.value = generatedScript;
//     document.body.appendChild(textArea);
//     textArea.select();
//     document.execCommand("copy");
//     document.body.removeChild(textArea);
    
//     setIsCopied(true);
//     setTimeout(() => setIsCopied(false), 2000);
//   };

//   return (
//     <div className="bg-slate-900 text-white flex items-center justify-center min-h-screen py-10">
//       <div className="max-w-[785px] w-full px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//             AI Video Script Generator
//           </h1>
//           <p className="text-xl text-gray-400">
//             Create professional video scripts with AI assistance
//           </p>
//         </div>

//         <form 
//           onSubmit={handleSubmit}
//           className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm"
//         >
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-gray-200 font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 text-cyan-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                 />
//               </svg>
//               Video Topic/Script
//             </label>
//             <textarea
//               id="videoTopic"
//               rows={3}
//               value={videoTopic}
//               onChange={(e) => setVideoTopic(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
//               placeholder="Describe your video topic or outline your script ideas..."
//               required
//             ></textarea>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-5 h-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 10V3L4 14h7v7l9-11h-7z"
//                   />
//                 </svg>
//                 Generate Script
//               </>
//             )}
//           </button>
//         </form>

//         {/* Results Section */}
//         {generatedScript && (
//           <div className="mt-8 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-cyan-500/10 rounded-lg">
//                 <svg
//                   className="w-6 h-6 text-cyan-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//                 Generated Script
//               </h1>
//               <button
//                 onClick={copyScript}
//                 className="ml-auto px-4 py-2 bg-cyan-400/10 rounded-lg hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-sm"
//               >
//                 {isCopied ? (
//                   <>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                     </svg>
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
//                       />
//                     </svg>
//                     Copy
//                   </>
//                 )}
//               </button>
//             </div>
//             <div className="prose prose-invert prose-lg max-w-none">
//               <div 
//                 className="text-gray-300 space-y-4 [&>h1]:text-5xl [&>h1]:font-bold [&>h2]:text-4xl [&>h2]:font-bold [&>h3]:text-3xl [&>h3]:font-bold [&>h4]:text-2xl [&>h4]:font-bold [&>h5]:text-xl [&>h5]:font-bold [&>h6]:text-lg [&>h6]:font-bold [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>p]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-400 [&>blockquote]:pl-4 [&>blockquote]:italic"
//                 dangerouslySetInnerHTML={{ __html: marked ? marked.parse(generatedScript) : generatedScript }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mt-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
//             <div className="flex items-center gap-2 text-red-400 mb-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="font-semibold">Error</span>
//             </div>
//             <p className="text-red-300">{error}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
