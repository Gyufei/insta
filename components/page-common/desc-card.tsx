import Image from 'next/image';
import { ReactNode } from 'react';
import { WithLoading } from '@/components/with-loading';

export function DescCard({
  title,
  value,
  icon,
  isLoading = false,
}: {
  title: string;
  value: string;
  icon: string | ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="dark:bg-dark-500 min-w-card flex flex-1 flex-shrink-0 flex-grow items-center justify-between rounded bg-white px-4 py-6 shadow md:overflow-x-auto dark:shadow-none">
      <div className="mr-2 flex flex-col">
        <div className="text-xl mb-4 font-medium whitespace-nowrap">
          <WithLoading isPending={isLoading}>{value}</WithLoading>
        </div>
        <div className="text-grey-pure flex whitespace-nowrap">{title}</div>
      </div>
      <div className="text-ocean-blue-pure">
        {typeof icon === 'string' ? <Image src={icon} alt={title} width={48} height={48} /> : icon}
      </div>
    </div>
  );
}
