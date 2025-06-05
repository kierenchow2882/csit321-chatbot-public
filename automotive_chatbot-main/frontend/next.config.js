/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove invalid experimental options
  experimental: {
    // serverComponents is not a valid Next.js option
  },
  // Remove invalid server configuration - use CLI options instead
  // Only bind to localhost for development
  async rewrites() {
    return [];
  },
  // Additional security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 