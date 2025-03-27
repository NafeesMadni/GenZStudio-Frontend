export default function Page() {
    return <div>AI Series Review Generator Page</div>;
}
// 'use client';

// import { useState, useEffect } from 'react';
// // Import marked dynamically to avoid server-side import issues
// import dynamic from 'next/dynamic';
// import { API_BASE_URL } from '@/app/utils/config';

// export default function AISeriesReviewGenerator() {
//   const [seriesName, setSeriesName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [review, setReview] = useState('');
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
    
//     if (!seriesName.trim()) return;
    
//     setIsLoading(true);
//     setReview('');
//     setError('');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/content-creation/ai-series-review-generator`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ seriesName }),
//       });

//       const data = await response.json();

//       if (data.error) {
//         setError(data.message || 'Failed to generate review. Please try again.');
//       } else {
//         const formattedContent = data.data
//           .replace(/\n\n/g, "\n\n\n") // Fix paragraph spacing
//           .replace(/^#{1}\s/gm, "# ") // Fix h1 spacing
//           .replace(/^#{2}\s/gm, "## ") // Fix h2 spacing
//           .replace(/^#{3}\s/gm, "### ") // Fix h3 spacing
//           .replace(/^#{4}\s/gm, "#### ") // Fix h4 spacing
//           .replace(/^#{5}\s/gm, "##### ") // Fix h5 spacing
//           .replace(/^#{6}\s/gm, "###### ") // Fix h6 spacing
//           .replace(/^\*\s/gm, "* ") // Fix list item spacing
//           .replace(/^\d\.\s/gm, "$&"); // Fix ordered list spacing

//         setReview(formattedContent || "No review generated.");
//       }
//     } catch (error) {
//       setError('Failed to generate review. Please try again.');
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyReview = () => {
//     if (!review) return;
    
//     const textArea = document.createElement("textarea");
//     textArea.value = review;
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
//             AI Series Review Generator
//           </h1>
//           <p className="text-xl text-gray-400">
//             Generate detailed, insightful TV series reviews with AI assistance
//           </p>
//         </div>

//         <form 
//           onSubmit={handleSubmit}
//           className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm"
//         >
//           <div className="space-y-2">
//             <label
//               htmlFor="seriesName"
//               className="flex items-center gap-2 text-gray-200 font-medium"
//             >
//               <svg
//                 className="w-5 h-5 text-cyan-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                 />
//               </svg>
//               Series Name
//             </label>
//             <input
//               type="text"
//               id="seriesName"
//               name="seriesName"
//               value={seriesName}
//               onChange={(e) => setSeriesName(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
//               placeholder="e.g., Breaking Bad, Stranger Things, The Crown"
//               required
//             />
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
//                 Generating Review<span className="dots"></span>
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//                 Generate Review
//               </>
//             )}
//           </button>
//         </form>

//         {/* Results Section */}
//         {review && (
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
//                     d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//                 Series Review
//               </h1>
//               <button
//                 onClick={copyReview}
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
//                 dangerouslySetInnerHTML={{ __html: marked ? marked.parse(review) : review }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mt-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
//             <div className="flex items-center gap-3">
//               <svg
//                 className="w-5 h-5 text-red-400"
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
//               <span className="font-semibold text-red-400">Error</span>
//             </div>
//             <p className="text-red-300 mt-2">{error}</p>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .dots::after {
//           content: "";
//           animation: dots 1.5s steps(5, end) infinite;
//         }

//         @keyframes dots {
//           0%, 20% {
//             content: "";
//           }
//           40% {
//             content: ".";
//           }
//           60% {
//             content: "..";
//           }
//           80%, 100% {
//             content: "...";
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
