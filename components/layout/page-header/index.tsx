'use client';

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Power, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ToggleTheme } from '../app-sidebar/toggle-theme';
import { AccountBtn } from './account-btn';
import NetworkSelect from './network-select';
import PageTitle from './page-title';

export function PageHeader({ title, src }: { title: string; src: string | null }) {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  function openWeb3Modal() {
    open();
  }

  return (
    <header className="border-border flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:flex-nowrap 2xl:px-12 2xl:py-[20.5px]">
      <PageTitle title={title} src={src} />

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {isConnected ? (
          <>
            <AccountBtn />
          </>
        ) : (
          <Button variant="outline" onClick={openWeb3Modal}>
            <div className="leading-5 text-primary">Connect</div>
          </Button>
        )}

        <NetworkSelect />

        <ToggleTheme />

        <Button variant="outline" size="icon" className="text-primary h-9 w-9">
          <SlidersHorizontal size={18} />
        </Button>

        {isConnected && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
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
