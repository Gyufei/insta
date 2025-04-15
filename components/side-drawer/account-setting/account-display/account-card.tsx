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
        'flex h-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border text-xs font-semibold whitespace-nowrap shadow-sm transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50',
        isCurrent
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted text-card-foreground hover:bg-muted/80',
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
          <div
            className={cn(
              'flex w-7 items-center justify-center text-center text-xs leading-none',
              isCurrent ? 'text-primary-foreground' : 'text-primary'
            )}
          >
            V1
          </div>
          <div
            className={cn(
              'flex h-7 flex-1 items-center justify-center border-r border-l text-center leading-none',
              isCurrent ? 'border-primary-foreground/50' : 'border-border/50'
            )}
          >
            #{accountInfo?.id}
          </div>
          <div className="inline-flex h-full w-7 items-center justify-center dark:opacity-90">
            <Image
              src={network.icon.replace('monad', isCurrent ? 'monad-white' : 'monad-black')}
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
            className={cn(
              'h-full w-full px-2 text-center font-semibold shadow-inner outline-none select-all',
              isCurrent ? 'bg-primary-foreground text-primary' : 'bg-card text-card-foreground'
            )}
          />
        </div>
      </div>
    </button>
  );
}
