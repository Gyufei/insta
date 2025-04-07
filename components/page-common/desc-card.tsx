import Image from 'next/image';
import { ReactNode } from 'react';

export function DescCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string | ReactNode;
}) {
  return (
    <div className="dark:bg-dark-500 min-w-card flex flex-1 flex-shrink-0 flex-grow items-center justify-between rounded bg-white px-4 py-6 shadow md:overflow-x-auto dark:shadow-none">
      <div className="mr-2 flex flex-col">
        <div className="text-19 mb-4 font-medium whitespace-nowrap">{value}</div>
        <div className="text-grey-pure flex whitespace-nowrap">{title}</div>
      </div>
      <div className="text-ocean-blue-pure">
        {typeof icon === 'string' ? <Image src={icon} alt={title} width={48} height={48} /> : icon}
      </div>
    </div>
  );
}
