import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Odds',
};

export default function Odds() {
  redirect('/odds/markets');
}
