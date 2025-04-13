"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Mouse effect for desktop
    const mouseHighlight = document.querySelector(".mouse-highlight");
    const cards = document.querySelectorAll(".tool-card");
    let mouseTimeout: number;

    function updateMousePosition(e: MouseEvent) {
      if (window.innerWidth < 768) return;

      cancelAnimationFrame(mouseTimeout);
      mouseTimeout = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;

        if (mouseHighlight) {
          (mouseHighlight as HTMLElement).style.left = `${x}px`;
          (mouseHighlight as HTMLElement).style.top = `${y}px`;

          // Check if mouse is over a card
          let isOverCard = false;
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            if (
              x >= rect.left &&
              x <= rect.right &&
              y >= rect.top &&
              y <= rect.bottom
            ) {
              isOverCard = true;
            }
          });

          // Adjust highlight effect
          (mouseHighlight as HTMLElement).style.transform = `translate(-50%, -50%) scale(${
            isOverCard ? 1.2 : 1
          })`;
          (mouseHighlight as HTMLElement).style.opacity = isOverCard ? "1" : "0.8";
          (mouseHighlight as HTMLElement).style.filter = `blur(${isOverCard ? "15px" : "10px"})`;
        }
      });
    }

    document.addEventListener("mousemove", updateMousePosition);

    // Performance optimization for scroll
    let scrollTimeout: number;
    document.addEventListener("scroll", () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(() => {
        if (mouseHighlight) {
          const mouseHighlightLeft = parseFloat((mouseHighlight as HTMLElement).style.left) || 0;
          const mouseHighlightTop = parseFloat((mouseHighlight as HTMLElement).style.top) || 0;
          updateMousePosition({
            clientX: mouseHighlightLeft,
            clientY: mouseHighlightTop,
          } as MouseEvent);
        }
      });
    });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .mouse-highlight {
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 211, 243, 0.15) 0%, rgba(0, 211, 243, 0) 70%);
          mix-blend-mode: plus-lighter;
          pointer-events: none;
          z-index: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translate(-50%, -50%) scale(1);
        }

        .gradient-grid {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: center center;
        }

        .feature-card {
          background: rgba(17, 25, 40, 0.75);
          backdrop-filter: blur(16px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.125);
          transform-style: preserve-3d;
          transform: perspective(1000px);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
          border-color: rgba(0, 211, 243, 0.5);
        }

        .feature-icon {
          background: linear-gradient(45deg, rgba(0, 211, 243, 0.2), rgba(0, 211, 243, 0.1));
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .cta-button {
          background: linear-gradient(45deg, #00d3f3, #0077ff);
          border-radius: 8px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 211, 243, 0.2);
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: rotate(45deg);
          transition: all 0.3s ease;
        }

        .cta-button:hover::after {
          transform: rotate(45deg) translateX(100%);
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }

        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-slower {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * 0.5s);
        }

        @keyframes bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-grid opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-500/20 animate-gradient"></div>
          <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="relative inline-block">
                <span className="inline-block text-sm font-medium px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full mb-4">
                  New Platform Release
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
               
                <span className="bg-gradient-to-r from-cyan-400  to-blue-500 bg-clip-text text-transparent">
                  Gen-Z
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                Transform your creative workflow with AI-powered tools designed for modern content creators
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
                <button className="cta-button group text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Get Started Free
                  <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-gray-300 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Preview/Demo Section */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform hover:scale-[1.01] transition-all duration-500">
                  {/* Mock Interface */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900/90 p-4">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-32 rounded-md bg-slate-800 animate-pulse"></div>
                        <div className="h-6 w-6 rounded-md bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-5 gap-4 h-[calc(100%-2rem)]">
                      {/* Sidebar */}
                      <div className="col-span-1 bg-slate-800/50 rounded-lg p-3 space-y-3">
                        {['TikTok', 'YouTube', 'Instagram'].map((platform) => (
                          <div key={platform} className="p-2 rounded-lg bg-slate-700/50 text-xs text-cyan-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            {platform}
                          </div>
                        ))}
                      </div>

                      {/* Main Content */}
                      <div className="col-span-4 space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                              <div className="h-2 w-12 bg-cyan-500/20 rounded mb-2"></div>
                              <div className="h-4 w-16 bg-cyan-500/40 rounded"></div>
                            </div>
                          ))}
                        </div>

                        {/* Content Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-cyan-400">TikTok Video</span>
                            </div>
                            <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-3 overflow-hidden relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 animate-ping"></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="h-2 w-24 bg-cyan-500/20 rounded animate-pulse"></div>
                                <div className="h-2 w-16 bg-cyan-500/10 rounded animate-pulse"></div>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                </div>
                                <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-purple-400">Audio Track</span>
                            </div>
                            <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-3 overflow-hidden relative">
                              <div className="absolute inset-0 flex items-center justify-center gap-1">
                                {[...Array(12)].map((_, i) => (
                                  <div key={i} 
                                    className="w-1 bg-purple-400/40 rounded-full animate-bounce"
                                    style={{ 
                                      height: `${Math.random() * 100}%`,
                                      animationDelay: `${i * 0.1}s`
                                    }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="h-2 w-20 bg-purple-500/20 rounded animate-pulse"></div>
                                <div className="h-2 w-14 bg-purple-500/10 rounded animate-pulse"></div>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center group">
                                  <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Live Stats Card */}
                          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-blue-400">Live Processing</span>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                <span className="text-[10px] text-blue-400">LIVE</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {['Processing', 'Optimizing', 'Finalizing'].map((step, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                                      style={{
                                        width: `${(3 - i) * 33}%`,
                                        transition: 'width 1s ease-in-out'
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] text-blue-400">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions Card */}
                          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'Download' },
                                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Process' },
                                { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5', label: 'Analytics' },
                                { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', label: 'Split' }
                              ].map((action, i) => (
                                <div key={i} className="group bg-slate-800/50 rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-700/50 transition-colors">
                                  <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                                  </svg>
                                  <span className="text-[10px] text-gray-400 group-hover:text-cyan-400 transition-colors">{action.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Indicator */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-cyan-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    Processing content...
                  </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 space-y-3">
                  {[
                    { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', color: 'cyan' },
                    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'blue' },
                    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5', color: 'purple' }
                  ].map(({ icon, color }, i) => (
                    <div key={i} 
                      className={`w-8 h-8 rounded-lg bg-${color}-500/20 backdrop-blur-sm border border-${color}-500/30 
                        flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
                      <svg className={`w-4 h-4 text-${color}-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful tools to enhance your content creation workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Downloader Card */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">Smart Downloaders</h3>
                <p className="text-gray-400 mb-4">Download content from TikTok, YouTube, Instagram, and more with a single click.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400">TikTok</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">YouTube</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">Instagram</span>
                </div>
              </div>
            </div>

            {/* Generator Card */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">AI Generators</h3>
                <p className="text-gray-400 mb-4">Create captions, hashtags, and video ideas with advanced AI technology.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">Captions</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">Hashtags</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">Scripts</span>
                </div>
              </div>
            </div>

            {/* Splitter Card */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Audio Splitters</h3>
                <p className="text-gray-400 mb-4">Extract vocals, instruments, and beats from any audio with AI precision.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">Vocals</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-400">Instruments</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400">Beats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mouse highlight div */}
      <div className="mouse-highlight"></div>

      {/* Call to Action */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Ready to Create?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of creators who are already using our platform to streamline their content creation workflow.
          </p>
          <button className="cta-button text-lg">
            Start Creating Now
            <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
