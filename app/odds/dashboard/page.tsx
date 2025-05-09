import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Tadle Odds',
  description:
    'Manage your portfolio, track your trades, and monitor your performance on Tadle Odds.',
  openGraph: {
    title: 'Dashboard | Tadle Odds',
    description:
      'Manage your portfolio, track your trades, and monitor your performance on Tadle Odds.',
  },
  twitter: {
    title: 'Dashboard | Tadle Odds',
    description:
      'Manage your portfolio, track your trades, and monitor your performance on Tadle Odds.',
  },
};

export default function DashboardPage() {
  redirect('/odds/dashboard/trade');
}
