'use client';

import Image from 'next/image';
import { cn, formatAddress } from '@/lib/utils';
import { NetworkConfigs } from '@/config/network-config';
import { IAccountInfo } from '@/lib/data/use-account';

export function AccountCard({
  accountInfo,
  className,
  isCurrent,
  onClick,
}: {
  accountInfo: IAccountInfo;
  className?: string;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const network = NetworkConfigs.monadTestnet;

  if (!accountInfo) return null;

  return (
    <button
      className={cn(
        'flex h-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border text-xs font-semibold whitespace-nowrap text-white shadow-sm transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50',
        isCurrent
          ? 'border-blue-100 bg-blue dark:bg-slate-200 dark:border-slate-200'
          : 'border-gray/10 bg-gray-200 hover:bg-gray-200/50 dark:bg-slate-300',
        className
      )}
    >
      <div className="flex w-full flex-col" onClick={onClick}>
        <div
          className={cn(
            'flex items-center justify-between',
            isCurrent ? 'pointer-events-none' : 'cursor-pointer'
          )}
        >
          <div className="text-blue-100 flex w-7 items-center justify-center text-center text-xs leading-none">
            V1
          </div>
          <div
            className={cn(
              'flex h-7 flex-1 items-center justify-center border-r border-l text-center leading-none',
              isCurrent
                ? 'border-blue-100/50 dark:border-blue-100/25'
                : 'border-gray/15'
            )}
          >
            #{accountInfo?.id}
          </div>
          <div className="inline-flex h-full w-7 items-center justify-center dark:opacity-90">
            <Image
              src={network.icon.replace('monad', isCurrent ? 'monad-black' : 'monad-white')}
              width={24}
              height={24}
              alt="network"
            />
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
            className="dark:bg-slate-500/70 text-primary dark:text-primary-foreground h-full w-full bg-white px-2 text-center font-semibold shadow-inner outline-none select-all"
          />
        </div>
      </div>
    </button>
  );
}
