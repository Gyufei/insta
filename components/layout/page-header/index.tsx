'use client';

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Power } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { AccountBtn } from './account-btn';
import NetworkSelect from './network-select';

export function PageHeader() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  function openWeb3Modal() {
    open();
  }

  return (
    <header className="grid-header-nav bg-bg-gray border-[#ebebeb] flex items-center flex-nowrap pt-4">
      <div
        className={cn(
          'flex items-center gap-2 flex-nowrap px-8 w-[360px]',
          isConnected ? 'justify-between' : 'justify-end'
        )}
      >
        {isConnected ? (
          <>
            <AccountBtn />
          </>
        ) : (
          <Button
            variant="outline"
            className="shadow-none bg-transparent border-black/10"
            onClick={openWeb3Modal}
          >
            <div className="leading-5 text-primary">Connect</div>
          </Button>
        )}

        <NetworkSelect />

        {isConnected && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-transparent border-black/10"
            onClick={() => {
              disconnect();
            }}
          >
            <Power className="h-5 w-5 text-orange-500" />
          </Button>
        )}
      </div>
    </header>
  );
}
