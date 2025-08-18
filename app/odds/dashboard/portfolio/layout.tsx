import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Odds Market - Portfolio',
  openGraph: {
    title: 'Odds Market - Portfolio',
  },
  twitter: {
    title: 'Odds Market - Portfolio',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
