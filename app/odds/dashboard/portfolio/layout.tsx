import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

export const metadata: Metadata = {
  title: 'Odds Market - Portfolio',
  openGraph: {
    title: 'Odds Market - Portfolio',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/social-card.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Market - Portfolio',
    site: '@tadle_com',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
