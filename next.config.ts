import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Catch all API requests
        destination: "/api/not-live", // Redirect them to a custom API route
      },
    ];
  },
};

export default nextConfig;
