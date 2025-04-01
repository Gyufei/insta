'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TokenIconProps {
  symbol: string;
  src: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export default function TokenIcon({ symbol, src, size = 'md', className }: TokenIconProps) {
  return (
    <div className={cn('token-icon bg-blue-50', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={`${symbol} token`}
        width={size === 'sm' ? 16 : size === 'md' ? 28 : 32}
        height={size === 'sm' ? 16 : size === 'md' ? 28 : 32}
      />
    </div>
  );
}
