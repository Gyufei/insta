import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'C2C | tadle',
};

export default function Odds() {
  redirect('/c2c/markets');
}
