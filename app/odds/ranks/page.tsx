import { Metadata } from 'next';

import RanksMain from './ranks-main';

export const metadata: Metadata = {
  title: 'Odds Ranks',
  description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  openGraph: {
    title: 'Odds Ranks | Tadle',
    description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  },
  twitter: {
    title: 'Odds Ranks | Tadle',
    description: 'View top traders and market makers ranked by volume and profit on Tadle Odds.',
  },
};

export default function RanksPage() {
  return <RanksMain />;
}
