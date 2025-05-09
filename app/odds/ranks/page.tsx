import { Metadata } from 'next';

import RanksMain from './ranks-main';

export const metadata: Metadata = {
  title: 'Ranks | Tadle Odds',
  description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  openGraph: {
    title: 'Ranks | Tadle Odds',
    description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  },
  twitter: {
    title: 'Ranks | Tadle Odds',
    description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  },
};

export default function RanksPage() {
  return <RanksMain />;
}
