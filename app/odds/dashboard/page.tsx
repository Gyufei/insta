import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Odds Dashboard',
  openGraph: {
    title: 'Odds Dashboard',
  },
  twitter: {
    title: 'Odds Dashboard',
  },
};

export default function DashboardPage() {
  redirect('/odds/dashboard/trade');
}
