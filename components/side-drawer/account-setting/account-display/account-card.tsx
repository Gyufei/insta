'use client';

import Image from 'next/image';
import { cn, formatAddress } from '@/lib/utils';
import { NetworkConfigs } from '@/config/network-config';
import { useSelectedAccount } from '@/lib/data/use-account';

export function AccountCard({ className }: { className?: string }) {
  const network = NetworkConfigs.monadTestnet;
  const { data: accountInfo } = useSelectedAccount();

  if (!accountInfo) return null;

  return (
    <button
      className={cn(
        'border-ocean-blue-pure bg-ocean-blue-pure dark:border-dark-300 dark:bg-dark-300 flex h-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border text-xs font-semibold whitespace-nowrap text-white shadow-sm transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50',
        className
      )}
    >
      <div className="flex w-full flex-col">
        <div className="pointer-events-none flex items-center justify-between">
          <div className="text-ocean-blue-light flex w-7 items-center justify-center text-center text-xs leading-none">
            V1
          </div>
          <div className="border-ocean-blue-light/50 dark:border-ocean-blue-light/25 flex h-7 flex-1 items-center justify-center border-r border-l text-center leading-none">
            #{accountInfo?.id}
          </div>
          <div className="inline-flex h-full w-7 items-center justify-center dark:opacity-90">
            <Image src={network.icon} width={24} height={24} alt="network" />
          </div>
        </div>
        <div className="h-7">
          <input
            readOnly
            type="text"
            placeholder={formatAddress(accountInfo?.sandbox_account || '', {
              prefix: 12,
              suffix: 12,
            })}
            className="dark:bg-dark-600/70 text-navi-pure dark:text-light h-full w-full bg-white px-2 text-center font-semibold shadow-inner outline-none select-all"
          />
        </div>
      </div>
    </button>
  );
}
