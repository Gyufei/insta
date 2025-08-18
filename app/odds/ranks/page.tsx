import { Metadata } from 'next';

import RanksMain from './ranks-main';

export const metadata: Metadata = {
  title: 'Odds Ranks',
  openGraph: {
    title: 'Odds Ranks',
  },
  twitter: {
    title: 'Odds Ranks',
  },
};

export default function RanksPage() {
  return <RanksMain />;
}
