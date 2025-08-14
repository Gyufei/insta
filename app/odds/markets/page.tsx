import { Metadata } from 'next';

import MarketList from './market-list';

export const metadata: Metadata = {
  title: 'Odds Markets',
};

export default function MarketsPage() {
  return <MarketList />;
}
