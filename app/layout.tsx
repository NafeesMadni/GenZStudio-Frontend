import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { siteData } from "./utils/siteData";

const logo_font = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteData.name} - AI Tools for Content Creators`,
  description: siteData.description,
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap"
          rel="stylesheet"
        />

        <script
          src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 min-h-screen`}
      >
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              borderRadius: "0.5rem",
              border: "1px solid rgba(14, 165, 233, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#1e293b",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#1e293b",
              },
            },
          }}
        />

        {/* Fixed Background Elements */}
        <div className="page-background"></div>
        <div className="noise-overlay"></div>

        <Navigation />
        {children}

        <Analytics />
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        
        
          // Mobile menu functionality
          document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuButton = document.getElementById("mobile-menu-button");
            const mobileMenu = document.getElementById("mobile-menu");

            function closeMobileMenu() {
              mobileMenu.classList.remove("active");
              document.body.style.overflow = "";
            }

            if (mobileMenuButton && mobileMenu) {
              mobileMenuButton.addEventListener("click", () => {
                mobileMenu.classList.toggle("active");
                document.body.style.overflow = mobileMenu.classList.contains("active")
                  ? "hidden"
                  : "";
              });

              // Close menu when clicking links inside mobile menu
              const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
              Array.from(mobileMenuLinks).forEach(link => {
                link.addEventListener('click', (e) => {
                  closeMobileMenu();
                });
              });

              // Close menu when clicking outside
              document.addEventListener('click', (event) => {
                if (!mobileMenu.contains(event.target) && 
                    !mobileMenuButton.contains(event.target) && 
                    mobileMenu.classList.contains('active')) {
                  closeMobileMenu();
                }
              });
            }

            // Close mobile menu on window resize
            window.addEventListener("resize", () => {
              if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
              }
            });
          });
        `,
          }}
        />
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
    <nav className="bg-slate-900/5 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <div
              className={`text-2xl lg:text-3xl ${logo_font.className}  bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent `}
            >
              {siteData.logo}
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li className="relative dropdown group">
                <button className="text-slate-300 hover:text-cyan-400 font-medium focus:outline-none transition-all duration-200 flex items-center gap-1 group-hover:scale-105">
                  Free Tools
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="dropdown-menu absolute left-0 mt-2 w-[600px] lg:w-[720px] bg-[#0a131f] backdrop-blur-md shadow-xl rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-y-4">
                    {siteData.freeTools.map((tool) => (
                      <div key={tool.name}>
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                          {tool.name}
                        </h4>
                        <ul className="space-y-1">
                          {tool.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                className="link-hover-effect text-xs lg:text-sm text-gray-300"
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li className="relative dropdown">
                <button className="text-slate-300 hover:text-cyan-400 font-medium focus:outline-none transition-colors duration-200">
                  Features
                </button>
                {/* Features Dropdown Menu */}
                <div className="dropdown-menu absolute left-0 mt-2 w-[500px] bg-[#0a131f] backdrop-blur-md shadow-xl rounded-lg p-6">
                  <div className="space-y-3">
                    {siteData.features.map((feature) => (
                      <Link
                        href={feature.href}
                        className="block group"
                        key={feature.name}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-200">
                            {feature.icon}
                          </div>
                          <div>
                            <span className="link-hover-effect text-xs lg:text-base text-gray-300">
                              {feature.name}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
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
          <button
            id="mobile-menu-button"
            className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div id="mobile-menu" className="mobile-menu bg-[#0a131f]/95">
        <div className="px-4 py-2">
          {/* Free Tools Section */}
          <div className="pb-4">
            <button className="text-lg font-semibold text-cyan-400 mb-4">
              Free Tools
            </button>

            {siteData.freeTools.map((tool) => (
              <div className="mb-6" key={tool.name}>
                <h3 className="text-cyan-300 text-md font-medium mb-2">
                  {tool.name}
                </h3>
                <ul className="space-y-1 pl-4">
                  {tool.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="link-hover-effect text-gray-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Features Section in mobile menu */}
          <div className="pb-4">
            <button className="text-lg font-semibold text-cyan-400 mb-4">
              Features
            </button>
            <ul className="space-y-4 pl-4">
              {siteData.features.map((feature) => (
                <li key={feature.name}>
                  <Link href={feature.href} className="block">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <span className="link-hover-effect text-gray-300 text-base">
                          {feature.name}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
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
            <button className="w-full px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:border-cyan-400 hover:text-cyan-400">
              Login
            </button>
            <button className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">
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
    <footer className="bg-slate-900/5 backdrop-blur-sm py-12 px-5 md:px-20 text-slate-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <span
                className={`text-3xl ${logo_font.className} font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}
              >
                {siteData.logo}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {siteData.description}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {siteData.socials.map((social) => (
                <a
                  href={social.url}
                  target="_blank"
                  className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
                  key={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Sections Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {siteData.footerLinks.map((section) => (
              <div className="footer-section space-y-4" key={section.title}>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="link-hover-effect footer-link text-sm text-gray-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
              <Link
                href="#"
                className="link-hover-effect transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <span className="hidden md:inline text-gray-600">•</span>
              <Link
                href="#"
                className="link-hover-effect transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Made with
              <span className="mx-1 text-red-500">❤</span>
              in PK - © 2025
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors duration-200 pl-1">
                {siteData.name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
