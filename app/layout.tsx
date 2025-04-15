import type { Metadata } from "next";
import {  } from '@vercel/analytics/next';
import { Analytics } from '@vercel/analytics/next';

import { Geist, Geist_Mono, Space_Grotesk  } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

const logo_font = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenZStudio - AI Tools for Content Creators",
  description: "GenZStudio is the best AI tool to create captivating short-form videos in seconds for teams and businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap" rel="stylesheet"/>

        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" defer></script>
      </head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-slate-100 min-h-screen`}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 min-h-screen`}
      >
        <Navigation />
        {children}
        <Analytics />
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: `
          // Mobile menu functionality
          document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuButton = document.getElementById("mobile-menu-button");
            const mobileMenu = document.getElementById("mobile-menu");

            if (mobileMenuButton && mobileMenu) {
              mobileMenuButton.addEventListener("click", () => {
                mobileMenu.classList.toggle("active");
                // Prevent body scrolling when menu is open
                document.body.style.overflow = mobileMenu.classList.contains("active")
                  ? "hidden"
                  : "";
              });
            }

            // Close mobile menu on window resize
            window.addEventListener("resize", () => {
              if (window.innerWidth >= 768 && mobileMenu) {
                mobileMenu.classList.remove("active");
                document.body.style.overflow = "";
              }
            });

            const closeMenu = document.getElementById("close-menu");
            if (closeMenu && mobileMenu) {
              closeMenu.addEventListener("click", function () {
                mobileMenu.classList.add("hidden");
              });
            }
          });
        `}} />
        <style>
          {`
            :root {
              --background: #0f172a;
              --foreground: #f8fafc;
            }

            @theme inline {
              --color-background: var(--background);
              --color-foreground: var(--foreground);
              --font-sans: var(--font-geist-sans);
              --font-mono: var(--font-geist-mono);
            }

            @media (prefers-color-scheme: dark) {
              :root {
                --background: #0f172a;
                --foreground: #f8fafc;
              }
            }
            .dropdown-menu {
              opacity: 0;
              visibility: hidden;
              transform: translateY(-10px);
              transition: all 0.3s ease;
              border: 1px solid rgba(14, 165, 233, 0.1);
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            }
            .dropdown:hover .dropdown-menu {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }

            /* Mobile menu styles */
            .mobile-menu {
              display: none;
              position: fixed;
              top: 64px;
              left: 0;
              width: 100%;
              height: calc(100vh - 64px);
              background-color: #1f2937;
              z-index: 40;
              overflow-y: auto;
              -ms-overflow-style: none;
              scrollbar-width: thin;
            }
            .mobile-menu.active {
              display: block;
            }

            /* Unified link hover effect */
            .link-hover-effect {
              position: relative;
              display: inline-block;
              text-decoration: none;
              color: #94a3b8;
              padding: 2px 0;
              transition: color 0.3s ease;
            }

            .link-hover-effect::after {
              content: "";
              position: absolute;
              width: 100%;
              height: 1px;
              bottom: 0;
              left: 0;
              background-color: #0ea5e9;
              transform: scaleX(0);
              transform-origin: bottom left;
              transition: transform 0.3s ease;
            }

            .link-hover-effect:hover {
              color: #0ea5e9;
            }

            .link-hover-effect:hover::after {
              transform: scaleX(1);
            }

            /* Social icons */
            .social-icons {
              display: flex;
              gap: 16px;
            }

            .social-icons a {
              color: #e2e8f0;
              transition: color 0.3s ease;
            }

            .social-icons a:hover {
              color: #0ea5e9;
            }

            /* Responsive footer grid */
            @media (max-width: 768px) {
              .footer-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
              }
              .footer-section {
                margin-bottom: 2rem;
              }
            }
          `}
        </style>
      </body>
    </html>
  );
}

function Navigation() {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <div className={`text-2xl lg:text-3xl ${logo_font.className}  bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent `}>
              GenZStudio
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li className="relative dropdown group">
                <button className="text-slate-300 hover:text-cyan-400 font-medium focus:outline-none transition-all duration-200 flex items-center gap-1 group-hover:scale-105">
                  Free Tools
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className="dropdown-menu absolute left-0 mt-2 w-[600px] lg:w-[720px] bg-slate-900/95 backdrop-blur-md shadow-xl rounded-lg p-6"
                >
                  <div className="grid grid-cols-3 gap-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        Youtube
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/youtube/title-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Title Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/youtube/username-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Username Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/youtube/hashtag-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Hashtag Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/youtube/description-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Description Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/youtube/transcript-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Transcript Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/youtube-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Video Downloader
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        Content Creation
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/content-creation/ai-video-idea-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Video Idea Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/content-creation/ai-video-hook-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Video Hook Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/content-creation/ai-video-script-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Video Script Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/content-creation/ai-movie-review-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Movie Review Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/content-creation/ai-series-review-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Series Review Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/content-creation/ai-image-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            AI Image Generator
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        Downloaders
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/linkedin-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            LinkedIn Video Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/reddit-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Reddit Video Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/facebook-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Facebook Video Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/x-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            X Video Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pinterest-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Pinterest Video Downloader
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        Instagram
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/instagram/username-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Username Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/instagram/caption-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Caption Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/instagram-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Reels Downloader
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        Spotify
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/spotify-track-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Track Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/spotify-playlist-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Playlist Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/spotify-album-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Album Downloader
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                        TikTok
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/tiktok/hashtag-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Hashtag Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/tiktok/caption-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Caption Generator
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/tiktok-video-downloader"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Video Downloader
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/tiktok/transcript-generator"
                            className="link-hover-effect text-xs lg:text-sm text-gray-300"
                          >
                            Transcript Generator
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative dropdown">
                <button
                  className="text-slate-300 hover:text-cyan-400 font-medium focus:outline-none transition-colors duration-200"
                >
                  Features
                </button>
                {/* Features Dropdown Menu */}
                <div
                  className="dropdown-menu absolute left-0 mt-2 w-[500px] bg-slate-900/95 backdrop-blur-md shadow-xl rounded-lg p-6"
                >
                  <div className="space-y-3">
                    <Link href="/features/splitter-ai" className="block group">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200"
                        >
                          <svg
                            className="w-6 h-6 text-cyan-400"
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
                        <div>
                          <span
                            className="link-hover-effect text-xs lg:text-base text-gray-300"
                          >
                            Splitter AI
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Split music into separated parts with AI-Powered
                            algorithms
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Link href="/features/transcript-ai" className="block group">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200"
                        >
                          <svg
                            className="w-6 h-6 text-cyan-400"
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
                        <div>
                          <span
                            className="link-hover-effect text-xs lg:text-base text-gray-300"
                          >
                            Transcript AI
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Convert audio and video to text with AI-powered
                            transcription
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/features/image-ai" className="block group">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200"
                        >
                          <svg
                            className="w-6 h-6 text-cyan-400"
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
                        <div>
                          <span
                            className="link-hover-effect text-xs lg:text-base text-gray-300"
                          >
                            Image AI
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Transform and enhance images with AI-powered tools
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 font-medium transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 font-medium transition-colors duration-200"
                >
                  Affiliate
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 font-medium transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 border border-slate-600/50 rounded-lg text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Login
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
              Try For Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button id="mobile-menu-button" className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        id="mobile-menu-overlay"
        className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
      ></div>

      {/* Mobile Menu Panel */}
      <div id="mobile-menu" className="mobile-menu bg-slate-900/95">
        <div className="px-4 py-2">
          {/* Free Tools Section */}
          <div className="pb-4">
            <button className="text-lg font-semibold text-cyan-400 mb-4">
              Free Tools
            </button>

            {/* YouTube Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">YouTube</h3>
              <ul className="space-y-1 pl-4">
                <li>
                  <Link
                    href="/youtube/title-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Title Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube/username-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Username Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube/hashtag-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Hashtag Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube/description-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Description Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube/transcript-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Transcript Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Video Downloader
                  </Link>
                </li>
              </ul>
            </div>

            {/* TikTok Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">TikTok</h3>
              <ul className="space-y-1 pl-4">
                <li>
                  <Link
                    href="/tiktok/hashtag-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Hashtag Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok/caption-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Caption Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok/transcript-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Transcript Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tiktok-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Video Downloader
                  </Link>
                </li>
              </ul>
            </div>

            {/* Instagram Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">Instagram</h3>
              <ul className="space-y-1 pl-4">
                <li>
                  <Link
                    href="/instagram/username-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Username Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram/caption-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Caption Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Reels Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram/transcript-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Transcript Generator
                  </Link>
                </li>
              </ul>
            </div>
            {/* Spotify Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">Spotify</h3>
              <ul className="space-y-1 pl-4">
                <li>
                  <Link
                    href="/spotify-track-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Track Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spotify-playlist-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Playlist Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spotify-album-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Album Downloader
                  </Link>
                </li>
              </ul>
            </div>
            {/* Content-Creation Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">
                Content Creation
              </h3>
              <ul className="space-y-2 pl-4">
                <li>
                  <Link
                    href="/content-creation/ai-video-idea-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Video Idea Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-video-hook-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Video Hook Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-video-script-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Video Script Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-movie-review-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Movie Review Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-series-review-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Series Review Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-image-generator"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    AI Image Generator
                  </Link>
                </li>
              </ul>
            </div>
            {/* Downloaders Section */}
            <div className="mb-6">
              <h3 className="text-cyan-300 text-md font-medium mb-2">
                Downloaders
              </h3>
              <ul className="space-y-2 pl-4">
                <li>
                  <Link
                    href="/linkedin-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    LinkedIn Video Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reddit-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Reddit Video Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/facebook-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Facebook Video Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/x-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    X Video Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pinterest-video-downloader"
                    className="link-hover-effect text-gray-300 text-sm"
                  >
                    Pinterest Video Downloader
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Features Section in mobile menu */}
          <div className="pb-4">
            <button className="text-lg font-semibold text-cyan-400 mb-4">
              Features
            </button>
            <ul className="space-y-4 pl-4">
              <li>
                <Link href="/features/splitter-ai" className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-cyan-400"
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
                    <div>
                      <span className="link-hover-effect text-gray-300 text-base">
                        Splitter AI
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Split music into separated parts with AI-Powered
                        algorithms
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/features/transcript-ai" className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-cyan-400"
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
                    <div>
                      <span className="link-hover-effect text-gray-300 text-base">
                        Transcript AI
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Convert audio and video to text with AI-powered
                        transcription
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/features/image-ai" className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-cyan-400"
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
                    <div>
                      <span className="link-hover-effect text-gray-300 text-base">
                        Image AI
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Transform and enhance images with AI-powered tools
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 pb-4">
            <Link
              href="#"
              className="block text-slate-300 hover:text-cyan-400 text-lg font-semibold"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="block text-slate-300 hover:text-cyan-400 text-lg font-semibold"
            >
              Affiliate
            </Link>
            <Link
              href="#"
              className="block text-slate-300 hover:text-cyan-400 text-lg font-semibold"
            >
              Blog
            </Link>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pb-6">
            <button
              className="w-full px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
            >
              Login
            </button>
            <button
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
            >
              Try For Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm py-12 px-5 md:px-20 text-slate-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <span className={`text-3xl ${logo_font.className} font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}>
                GenZStudio
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              GenZStudio is the best AI tool to create captivating short-form
              videos in seconds for teams and businesses.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://github.com/NafeesMadni"
                target="_blank" 
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/real.nafees/"
                target="_blank"
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/nafees07/"
                target="_blank"
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://x.com/nafiz_dev?s=21&t=IFIy2Y8wIMP_UzTKYYjb8A"
                target="_blank"
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
              >
                {/* X Logo */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Sections Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Company Section */}
            <div className="footer-section space-y-4">
              <h3
                className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Merch
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Affiliate
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Languages
                  </Link>
                </li>
              </ul>
            </div>

            {/* Editing Section */}
            <div className="footer-section space-y-4">
              <h3
                className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                Editing
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Customer Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Auto Subtitle Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Add Subtitles to Videos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Video Editor
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Video to Text
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    AI Podcast Clip (soon)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools Section */}
            <div className="footer-section space-y-4">
              <h3
                className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                Free Tools
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/spotify-playlist-downloader"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Spotify Playlist Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube-downloader"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Youtube Video Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram-video-downloader"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Instagram Reels Downloader
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-movie-review-generator"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Movie Reviewer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-creation/ai-series-review-generator"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Series Reviewer
                  </Link>
                </li>
               
                <li>
                  <Link
                    href="/content-creation/ai-image-generator"
                    className="link-hover-effect footer-link text-sm text-gray-400"
                  >
                    Image Generator
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
              <Link href="#" className="link-hover-effect transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="hidden md:inline text-gray-600">•</span>
              <Link href="#" className="link-hover-effect transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Made with
              <span className="mx-1 text-red-500">❤</span>
              in PK - © 2025 
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors duration-200 pl-1">
                GenZStudio
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}