import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.nadapp.net',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.nad.fun',
      },
      {
        protocol: 'https',
        hostname: 'img-bucket.tadle.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'https://arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'img-bucket.tadle.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tadle.com',
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
