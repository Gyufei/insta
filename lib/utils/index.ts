import { type ClassValue, clsx } from 'clsx';
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

// Format date to user's timezone
export function formatDate(dateString: string | number): string {
  const date = new Date(String(dateString));

  // Return empty string if invalid date
  if (isNaN(date.getTime())) return '';

  // Format time
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  // Format date
  const dateFormatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${time}, ${dateFormatted}`;
}
