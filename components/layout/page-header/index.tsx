'use client';

import { Power, Settings } from 'lucide-react';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import NetworkSelect from './network-select';
import PageTitle from './page-title';
import { AccountBtn } from './account-btn';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function PageHeader({ title, src }: { title: string; src: string | null }) {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  function openWeb3Modal() {
    open();
  }

  return (
    <header className="border-border flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:flex-nowrap 2xl:px-12 2xl:py-[18.5px]">
      <div className="relative">
        <SidebarTrigger className="absolute top-[1px] -left-10" />
        <PageTitle title={title} src={src} />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {isConnected ? (
          <>
            <AccountBtn />
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={openWeb3Modal}>
            <div className="leading-5 text-primary">Connect</div>
          </Button>
        )}

        <NetworkSelect />

        <Button variant="outline" size="icon" className="text-primary h-8 w-8">
          <Settings size={16} />
        </Button>

        {isConnected && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              disconnect();
            }}
          >
            <Power className="h-4 w-4 text-orange-500" />
          </Button>
        )}
      </div>
    </header>
  );
}
