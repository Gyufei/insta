import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Odds Market - Watchlist',
  openGraph: {
    title: 'Odds Market - Watchlist',
  },
  twitter: {
    title: 'Odds Market - Watchlist',
  },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
