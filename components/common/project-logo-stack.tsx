import Image from 'next/image';

import { cn } from '@/lib/utils';

export function ProjectLogoStack({
  logos,
  size = 16,
  overlap = 10,
  className,
  borderWidth = 1,
  borderColor = '#0D1B2A',
  backgroundColor = '#ffffff',
}: {
  logos: string[];
  size?: number;
  overlap?: number;
  className?: string;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {logos.slice(0, 3).reverse().map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute top-0 rounded-full"
          style={{
            left: i * overlap,
            width: size,
            height: size,
            border: `${borderWidth}px solid ${borderColor}`,
            backgroundColor,
          }}
        >
          <Image
            src={src}
            alt={`project-logo-${i + 1}`}
            width={size}
            height={size}
            className="rounded-full"
          />
        </div>
      ))}
    </div>
  );
}