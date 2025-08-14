import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Odds Market  - Trade',
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
