import { Metadata } from 'next';

import MarketList from './market-list';

export const metadata: Metadata = {
  title: 'Markets | Tadle Odds',
};

export default function MarketsPage() {
  return <MarketList />;
}
