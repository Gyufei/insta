import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.nadapp.net',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.nad.fun',
      },
    ],
  },
  /* config options here */
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
