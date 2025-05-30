import Image from 'next/image';
import { ReactNode } from 'react';
import { WithLoading } from '@/components/common/with-loading';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="min-w-card flex flex-1 flex-shrink-0 flex-grow items-center justify-between shadow-none md:overflow-x-auto">
      <CardContent className="flex w-full items-center justify-between px-5">
        <div className="mr-2 flex flex-col">
          <div className="text-xl mb-1 font-medium whitespace-nowrap">
            <WithLoading className='h-7 w-7' isLoading={isLoading}>{value}</WithLoading>
          </div>
          <div className="text-gray-400 font-normal flex whitespace-nowrap">{title}</div>
        </div>
        <div className="text-blue">
          {typeof icon === 'string' ? <Image src={icon} alt={title} width={40} height={40} /> : icon}
        </div>
      </CardContent>
    </Card>
  );
}
