import Image from 'next/image';

import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  src: string | null;
  titleClassName?: string;
}

export default function PageTitle({ title, src, titleClassName }: PageTitleProps) {
  return (
    <div
      className={cn(
        'flex w-full md:pt-8 md:pb-12 pt-5 pb-6 justify-start pl-4 md:pl-12',
        titleClassName
      )}
    >
      <div className="flex items-center h-6">
        {src && <Image src={src} alt={title} className="mr-2" width={24} height={24} />}
        <h1 className="text-2xl font-semibold text-primary leading-[24px]">{title}</h1>
      </div>
    </div>
  );
}