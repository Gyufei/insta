import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'C2C',
  openGraph: {
    title: 'C2C',
  },
  twitter: {
    title: 'C2C',
  },
};

export default function Odds() {
  redirect('/c2c/markets');
}
