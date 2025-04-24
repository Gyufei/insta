import Image from 'next/image';

import { cn } from '@/lib/utils';

export function LogoWithPlaceholder({
  src,
  name,
  className,
  width = 16,
  height = 16,
}: {
  src?: string;
  name: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        className={cn('object-contain rounded-full', className)}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-300 font-medium uppercase shrink-0 text-primary',
        className
      )}
      style={{ width, height }}
    >
      <span className="my-auto h-fit text-center leading-[0]">{name.slice(0, 1)}</span>
    </div>
  );
}
