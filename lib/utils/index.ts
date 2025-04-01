import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(
  address: string,
  {
    prefix = 6,
    suffix = 4,
  }: {
    prefix?: number;
    suffix?: number;
  } = {}
) {
  if (!address) {
    return '';
  }

  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}
