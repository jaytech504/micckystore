import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix CSP warning in development
  experimental: {
    // esmExternals: 'loose',
  },
  
  // Webpack configuration to handle CSP
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Allow eval in development mode for better debugging
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  
  // Headers for CSP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; object-src 'none';"
              : "script-src 'self' 'unsafe-inline' https://vercel.live; object-src 'none';"
          },
        ],
      },
    ];
  },
};

export default nextConfig;
