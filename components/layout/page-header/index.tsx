'use client';

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Power } from 'lucide-react';

import { Button } from '@/components/ui/button';

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
    <header className="grid-header-nav bg-bg-gray border-border flex items-center justify-end flex-nowrap pt-6">
      <div className="flex justify-end items-center gap-2 flex-nowrap pr-8 w-[360px]">
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
