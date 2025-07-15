'use client';

import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';
import { Power } from 'lucide-react';

import { useMemo } from 'react';

import Image from 'next/image';

import { BaseNetIds } from '@/config/network-config';

import { Button } from '@/components/ui/button';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/utils/use-mobile';

import SidebarToggle from '../sidebar-toggle';
import { AccountBtn } from './account-btn';
import NetworkSelect from './network-select';

export function PageHeader() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  const { setIsOpen } = useSideDrawerStore();
  const isMobile = useIsMobile();

  const { chainId } = useAppKitNetwork();
  const isBaseNet = useMemo(() => BaseNetIds.includes(String(chainId)), [chainId]);

  function openWeb3Modal() {
    open();
  }

  function openBalanceDrawer() {
    setIsOpen(true);
  }

  const ConnectBtn = () =>
    isConnected ? (
      <>{!isBaseNet && <AccountBtn />}</>
    ) : (
      <Button
        variant="outline"
        className="shadow-none bg-transparent border-black/10"
        onClick={openWeb3Modal}
      >
        <div className="leading-5 text-primary">Connect</div>
      </Button>
    );

  const DisconnectBtn = () =>
    isConnected ? (
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
    ) : null;

  const BalanceBtn = () => (
    <Button
      onClick={openBalanceDrawer}
      variant="outline"
      size="icon"
      className="h-9 w-9 bg-transparent border-black/10"
    >
      <Image src="/icons/wallet.svg" alt="balance" width={20} height={20} />
    </Button>
  );

  return (
    <header className="grid-header-nav bg-[#F5F6F9] md:bg-bg-gray border-[#ebebeb] flex items-center flex-nowrap pt-4">
      <div
        className={cn(
          'flex items-center gap-2 flex-nowrap px-4 md:px-8 w-full md:w-[360px] justify-between md:justify-end'
        )}
      >
        {isMobile ? (
          <>
            <NetworkSelect />

            <div className="flex items-center gap-2">
              <ConnectBtn />
              <BalanceBtn />
              <DisconnectBtn />
              <SidebarToggle />
            </div>
          </>
        ) : (
          <>
            <ConnectBtn />
            <NetworkSelect />
            <DisconnectBtn />
          </>
        )}
      </div>
    </header>
  );
}
