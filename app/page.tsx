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
          width: 500px;
          height: 500px;
          mix-blend-mode: plus-lighter;
          pointer-events: none;
          z-index: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
          filter: blur(10px);
        }

        .tool-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .tool-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
        }

        .tool-card:hover::before {
          opacity: 1;
        }

        .tool-card:hover svg {
          transform: scale(1.1);
        }

        .tool-svg {
          color: #00d3f3;
        }

        .tool-card svg {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
        }

        .tool-card:hover {
          transform: translateY(-5px);
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 0 10px 20px -10px rgba(6, 182, 212, 0.3);
        }

        @media (max-width: 768px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tool-card:nth-child(n + 3) {
            display: none;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to Toolify
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Your all-in-one platform for AI-powered content creation and social media
            management
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="#tools"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Explore Tools
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Tools Categories */}
      <section id="tools" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* TikTok Tools */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 md:w-10 md:h-10">
                <path
                  d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z"
                  fill="#00d3f3"
                />
                <path
                  d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z"
                  fill="#000000"
                />
                <path
                  d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z"
                  fill="#00d3f3"
                />
                <path
                  d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z"
                  fill="#69C9D0"
                />
                <path
                  d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z"
                  fill="#69C9D0"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                TikTok Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/tiktok/video-downloader"
                className="tool-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Video Downloader
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Download TikTok videos without watermark
                </p>
              </Link>

              {/* Caption Generator */}
              <Link
                href="/tiktok/caption-generator"
                className="tool-card tiktok-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Caption Generator
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Create engaging captions for your videos
                </p>
              </Link>

              {/* Hashtag Generator */}
              <Link
                href="/tiktok/hashtag-generator"
                className="tool-card tiktok-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Hashtag Generator
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Generate trending hashtags for more views
                </p>
              </Link>

              {/* Transcript Generator */}
              <Link
                href="/tiktok/transcript-generator"
                className="tool-card tiktok-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Transcript Generator
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Convert video content to text format
                </p>
              </Link>
            </div>
          </div>

          {/* Mouse highlight div */}
          <div className="mouse-highlight"></div>

          {/* YouTube Tools Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <path
                  fill="#00d3f3"
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                YouTube Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Video Downloader */}
              <Link
                href="/youtube-video-downloader"
                className="tool-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Video Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Download YouTube videos in HD quality
                </p>
              </Link>

              <Link
                href="/youtube/title-generator"
                className="tool-card youtube-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-red-500/30 hover:shadow-red-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">Title Generator</h3>
                </div>
                <p className="text-gray-400 text-sm">Create engaging video titles</p>
              </Link>

              {/* Hashtag Generator */}
              <Link
                href="/youtube/hashtag-generator"
                className="tool-card youtube-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-red-500/30 hover:shadow-red-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Hashtag Generator
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Generate trending YouTube hashtags
                </p>
              </Link>

              {/* Description Generator */}
              <Link
                href="/youtube/description-generator"
                className="tool-card youtube-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-red-500/30 hover:shadow-red-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Description Generator
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Create engaging video descriptions
                </p>
              </Link>
            </div>
          </div>

          {/* Instagram Tools Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <path
                  fill="#00d3f3"
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.381-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Instagram Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Reels Downloader */}
              <Link
                href="/instagram-video-downloader"
                className="tool-card instagram-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Reels Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Download Instagram Reels without watermark
                </p>
              </Link>

              {/* Caption Generator */}
              <Link
                href="/instagram/username-generator"
                className="tool-card instagram-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Caption Generator
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Create engaging post captions</p>
              </Link>

              {/* Username Generator */}
              <Link
                href="/instagram/username-generator"
                className="tool-card instagram-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Username Generator
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Create unique Instagram usernames</p>
              </Link>

              {/* Transcript Generator */}
              <Link
                href="/instagram/transcript-generator"
                className="tool-card instagram-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Transcript Generator
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Convert Reels to text format</p>
              </Link>
            </div>
          </div>

          {/* Spotify Tools Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <path
                  fill="#00d3f3"
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.381-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Spotify Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Track Downloader */}
              <Link
                href="/spotify-track-downloader"
                className="tool-card spotify-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Track Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Download Spotify Tracks in high quality
                </p>
              </Link>

              {/* Playlist Downloader */}
              <Link
                href="/spotify-playlist-downloader"
                className="tool-card spotify-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Playlist Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Download entire Spotify playlists</p>
              </Link>

              {/* Album Downloader */}
              <Link
                href="/spotify-album-downloader"
                className="tool-card spotify-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292V12M12 4.354V12m0 0v7.646a4 4 0 11-5.292-5.292L12 12z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Album Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Download complete Spotify albums</p>
              </Link>
            </div>
          </div>

          {/* Downloaders Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[#00d2f2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Downloaders
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* X (Twitter) Downloader */}
              <Link
                href="/x-video-downloader"
                className="tool-card x-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 tool-svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    X Video Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Download X (Twitter) videos easily
                </p>
              </Link>

              {/* LinkedIn Downloader */}
              <Link
                href="/linkedin-video-downloader"
                className="tool-card facebook-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 tool-svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    LinkedIn Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Download LinkedIn videos</p>
              </Link>

              {/* Reddit Downloader */}
              <Link
                href="/reddit-video-downloader"
                className="tool-card reddit-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 tool-svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Reddit Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">Download Reddit videos and GIFs</p>
              </Link>

              {/* Facebook Downloader */}
              <Link
                href="/facebook-video-downloader"
                className="tool-card linkedin-card group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 tool-svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Facebook Downloader
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Download Facebook videos and reels
                </p>
              </Link>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-cyan-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AI Content Creation
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Video Script Writer */}
              <Link
                href="/ai/video-script"
                className="tool-card ai-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-blue-500/30 hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Video Script Writer
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered video script generation
                </p>
              </Link>

              {/* Video Idea Generator */}
              <Link
                href="/content-creation/ai-video-idea-generator"
                className="tool-card ai-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-blue-500/30 hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">Video Ideas</h3>
                </div>
                <p className="text-gray-400 text-sm">Generate viral video ideas</p>
              </Link>

              {/* Hook Generator */}
              <Link
                href="/content-creation/ai-video-hook-generator"
                className="tool-card ai-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-blue-500/30 hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">Hook Generator</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Create attention-grabbing video hooks
                </p>
              </Link>

              {/* Vlogger Script Writer */}
              <Link
                href="/content-creation/vlogger-script-generator"
                className="tool-card ai-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-blue-500/30 hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 tool-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Vlogger Script Writer
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Automated AI-powered vlogs script creation.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Featured AI Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Splitter AI */}
            <Link
              href="/features/splitter-ai"
              className="tool-card group bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200">
                  <svg
                    className="w-6 h-6 text-cyan-400 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-200">Splitter AI</h3>
              </div>
              <p className="text-gray-400">
                Split music into separated parts with AI-Powered algorithms
              </p>
            </Link>

            {/* Transcript AI */}
            <Link
              href="/features/transcript-ai"
              className="tool-card group bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200">
                  <svg
                    className="w-6 h-6 text-cyan-400 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-200">Transcript AI</h3>
              </div>
              <p className="text-gray-400">
                Convert audio and video to text with AI-powered transcription
              </p>
            </Link>

            {/* Image AI */}
            <Link
              href="/features/image-ai"
              className="tool-card group bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 hover:bg-slate-800/70 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200">
                  <svg
                    className="w-6 h-6 text-cyan-400 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-200">Image AI</h3>
              </div>
              <p className="text-gray-400">
                Transform and enhance images with AI-powered tools
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Ready to supercharge your content?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of content creators who trust Toolify for their daily
            content needs.
          </p>
          <Link
            href="#"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          >
            Get Started Free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
