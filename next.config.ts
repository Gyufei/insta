import { withSentryConfig } from '@sentry/nextjs';

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
  // 重定向常见路径到静态 404 页面，减少动态处理
  async redirects() {
    return [
      // 批量重定向到静态页面，减少动态处理
      {
        source: '/wp-:path*',
        destination: '/404.html', // 静态文件，不消耗 Edge Request
        permanent: false,
      },
      {
        source: '/:path*admin:path*',
        destination: '/404.html',
        permanent: false,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'tadle',

  project: 'tadle',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
