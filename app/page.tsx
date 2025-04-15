"use client";
import Image from "next/image";
import Link from 'next/link';
import { useEffect } from "react";

const demoTracks = [
  { source_name: 'Vocals', color: { bg: '#562838', wave: '#c25571', progress: '#b0415d' } },
  { source_name: 'Music', color: { bg: '#747425', wave: '#ffff33', progress: '#ffff00' } },
  { source_name: 'Drums', color: { bg: '#25744a', wave: '#33ffae', progress: '#00ff8e' } },
  { source_name: 'Bass', color: { bg: '#363360', wave: '#7a72ce', progress: '#665dc3' } },
];

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
          background: rgba(17, 25, 40, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 211, 243, 0.5);
          box-shadow: 0 10px 30px -10px rgba(0, 211, 243, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #00d3f3 0%, #0077ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .floating-features {
          animation: float 6s ease-in-out infinite;
        }

        /* Modern Pipe Styles */
        .data-pipe {
          position: absolute;
          opacity: 0.7;
          overflow: hidden;
        }

        .pipe-vertical {
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, 
            rgba(6, 182, 212, 0.15) 0%,
            rgba(6, 182, 212, 0.3) 100%);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }

        .pipe-horizontal {
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(6, 182, 212, 0.15) 0%,
            rgba(6, 182, 212, 0.3) 100%);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }

        .pipe-vertical::after,
        .pipe-horizontal::after {
          content: '';
          position: absolute;
          opacity: 0;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
        }

        .pipe-vertical::after {
          width: 100%;
          height: 40%;
          background: linear-gradient(180deg, 
            rgba(6, 182, 212, 0) 0%,
            rgba(6, 182, 212, 0.8) 50%,
            rgba(6, 182, 212, 0) 100%);
          animation: flowVertical cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .pipe-horizontal::after {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, 
            rgba(6, 182, 212, 0) 0%,
            rgba(6, 182, 212, 0.8) 50%,
            rgba(6, 182, 212, 0) 100%);
          animation: flowHorizontal cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .v1 { left: 15%; }
        .v2 { left: 45%; }
        .v3 { right: 15%; }

        .h1 { left: 15%; width: 30%; top: 25%; }
        .h2 { left: 45%; width: 40%; top: 50%; }
        .h3 { left: 15%; width: 30%; top: 75%; }

        .v1::after { animation-duration: 3s; animation-delay: 0s; }
        .h1::after { animation-duration: 2s; animation-delay: 3s; }
        .v2::after { animation-duration: 3s; animation-delay: 5s; }
        .h2::after { animation-duration: 2.5s; animation-delay: 8s; }
        .v3::after { animation-duration: 3s; animation-delay: 10.5s; }
        .h3::after { animation-duration: 2s; animation-delay: 13.5s; }

        @keyframes flowVertical {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%); opacity: 1; }
        }

        @keyframes flowHorizontal {
          0% { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(300%); opacity: 1; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
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

        @keyframes bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }

        /* Add new background styles */
        .page-background {
          background: radial-gradient(circle at 50% 0%, #0c1220 0%, #060913 100%);
          position: fixed;
          inset: 0;
          z-index: -2;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.4;
          z-index: -1;
          pointer-events: none;
        }

        /* Update section styling */
        .content-section {
          position: relative;
          background: linear-gradient(180deg, 
            rgba(6, 182, 212, 0.05) 0%,
            rgba(6, 182, 212, 0) 20%,
            rgba(6, 182, 212, 0) 80%,
            rgba(6, 182, 212, 0.05) 100%
          );
          backdrop-filter: blur(100px);
        }

        .section-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            rgba(6, 182, 212, 0.03) 0%,
            rgba(6, 182, 212, 0) 20%,
            rgba(6, 182, 212, 0) 80%,
            rgba(6, 182, 212, 0.03) 100%
          );
        }
      `}</style>

      {/* Fixed Background Elements */}
      <div className="page-background"></div>
      <div className="noise-overlay"></div>

      {/* Hero Section */}
      <section className="content-section relative min-h-screen flex items-center justify-center">
        <div className="section-overlay"></div>
        {/* Add grid overlay */}
        <div className="absolute inset-0 gradient-grid opacity-30"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Create Content with
              <span className="gradient-text block mt-2">AI Precision</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Professional-grade AI tools for modern content creators. 
              Transform your workflow with automated precision.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <button className="cta-button text-lg px-8 py-4">
                Start Creating
                <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link href="/demo" 
                className="text-lg px-8 py-4 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all">
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Floating Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "AI Audio Separation",
                description: "Split audio into vocals, instruments, and beats",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5"
              },
              {
                title: "Smart Content Generation",
                description: "Generate captions, hashtags, and video ideas",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                title: "Multi-Platform Support",
                description: "Download and process content from any platform",
                icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              }
            ].map((feature, i) => (
              <div key={i} className="feature-card p-6 floating-features" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Splitter AI Showcase */}
      <section className="content-section relative overflow-hidden">
        
        <div className="section-overlay"></div>
        <div className="data-pipe pipe-vertical v1"></div>
        <div className="data-pipe pipe-horizontal h1"></div>
        <div className="data-pipe pipe-vertical v2"></div>
        <div className="data-pipe pipe-horizontal h2"></div>
        <div className="data-pipe pipe-vertical v3"></div>
        <div className="data-pipe pipe-horizontal h3"></div>
        <div className="container mx-auto px-4">
          <div className="my-20 grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-cyan-500/10 rounded-full mb-6">
                <span className="text-cyan-400 font-medium">Featured Tool</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet
                <span className="gradient-text"> Splitter AI</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Industry-leading AI-powered audio separation technology. Extract clean vocals, instruments, and beats with unmatched precision.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Vocals', accuracy: '99.8%' },
                  { name: 'Drums', accuracy: '99.5%' },
                  { name: 'Bass', accuracy: '99.3%' },
                  { name: 'Music', accuracy: '99.6%' }
                ].map((item) => (
                  <div key={item.name} className="feature-card p-4">
                    <div className="text-lg font-semibold text-white mb-2">{item.name}</div>
                    <div className="text-cyan-400">{item.accuracy}</div>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/features/splitter-ai"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-lg px-5 py-2 inline-flex items-center hover:scale-105 transition-transform"
              >
                Try Splitter AI
                <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Interactive Visualization */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-20"></div>
              
              {/* macOS Browser Window */}
              <div className="relative bg-slate-800/30 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {/* Browser Controls */}
                <div className="bg-slate-950/50 px-4 py-3 border-b border-white/5">
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-lg shadow-yellow-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/20"></div>
                    </div>
                    <div className="mx-auto px-4 py-1.5 bg-slate-950/50 rounded-lg text-gray-400 text-sm border border-white/5 backdrop-blur-xl flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-cyan-400/70"></div>
                      splitter.ai/demo
                    </div>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="p-6 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/50 relative">
                  {/* Add subtle grid background for entire demo content */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  
                  <div className="relative space-y-1 ">
                    {demoTracks.map((track, index) => (
                      <div key={track.source_name} className="relative flex group hover:bg-white/5 rounded-lg transition-colors duration-300">
                        {/* Source Name & Volume Section */}
                        <div className={`lg:flex items-center justify-center px-4 py-2 mr-1 bg-slate-900/60 backdrop-blur-xl ${index == 0 ? 'rounded-tl-lg' : ''} ${index == 3 ? 'rounded-bl-lg' : ''}`}>
                          <span className="text-base lg:text-xl text-gray-400 min-w-[60px] font-thin mr-3">
                            {track.source_name}
                          </span>
                          <div className="relative flex items-center w-[60px] h-[24px]">
                            <div className="flex items-baseline justify-center space-x-0.5">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 transition-all duration-200"
                                  style={{
                                    height: `${i+5.5}px`,
                                    width: '4px',
                                    backgroundColor: `rgb(34 211 238 / ${i < 7 ? '0.8' : '0.1'})`,
                                    boxShadow: i < 7 ? '0 0 12px rgb(34 211 238 / 0.3)' : 'none'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Waveform Section with improved visualization */}
                        <div className="flex-1">
                          <div 
                            style={{ 
                              backgroundColor: `${track.color.bg}80`,
                              boxShadow: `inset 0 0 32px ${track.color.bg}`
                            }}
                            className={`cursor-pointer overflow-hidden px-3 py-2 backdrop-blur-sm transition-all duration-300 group-hover:brightness-110 ${index == 0 ? 'rounded-tr-lg' : ''} ${index == 3 ? 'rounded-br-lg' : ''}`}
                          >
                            <div className="h-16 flex items-center justify-center gap-0.5">
                              {[...Array(32)].map((_, j) => (
                                <div
                                  key={j}
                                  className="w-1 rounded-full animate-wave"
                                  style={{
                                    height: `${Math.sin(j * 0.5) * 50 + 50}%`,
                                    backgroundColor: track.color.wave,
                                    animationDelay: `${j * 0.05}s`,
                                    boxShadow: `0 0 12px ${track.color.wave}40`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Modernized Play Button */}
                    <div className="flex justify-center mt-6">
                      <button className="group relative px-6 py-2 rounded-lg overflow-hidden transition-all duration-300">
                        <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors duration-300"></div>
                        <div className="relative flex items-center gap-2 text-cyan-400">
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                          </svg>
                          <span className="text-sm font-medium">Play All</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mouse highlight div */}
      <div className="mouse-highlight"></div>

      {/* Call to Action */}
      <section className="content-section relative py-32">
      <div className="absolute inset-0 gradient-grid opacity-30"></div>
        <div className="section-overlay"></div>
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
