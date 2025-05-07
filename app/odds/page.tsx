import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'odds | tadle',
};

export default function Odds() {
  redirect('/odds/markets');
}
