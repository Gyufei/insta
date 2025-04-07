'use client';

import { Power, Settings } from 'lucide-react';
import Image from 'next/image';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import NetworkSelect from './network-select';
import PageTitle from './page-title';
import { AccountBtn } from './account-btn';

export function PageHeader({ title, src }: { title: string; src: string }) {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  function openWeb3Modal() {
    open();
  }

  return (
    <header className="border-grey-light dark:border-dark-600 2xl:dark:bg-dark-500 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:flex-nowrap 2xl:px-12 2xl:py-[20.5px]">
      <PageTitle title={title} src={src} />

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {isConnected ? (
          <>
            <button className="bg-grey-pure/10 hover:bg-grey-pure/20 focus:bg-grey-pure/20 relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm px-2 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
              <div className="text-brand dark:text-light relative">
                <Image src="/icons/dsa-wallet.svg" alt="DSA Wallet" width={16} height={16} />
              </div>
            </button>
            <AccountBtn />
          </>
        ) : (
          <button
            className="bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/17 hover:bg-ocean-blue-pure/25 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/30 dark:active:bg-ocean-blue-pure/38 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure hover:text-ocean-blue-pure flex w-18 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50 2xl:w-[92px]"
            onClick={openWeb3Modal}
          >
            <div className="leading-5">Connect</div>
          </button>
        )}

        <NetworkSelect />

        <button className="border-grey-light focus:bg-ocean-blue-light focus:text-ocean-blue-pure dark:bg-grey-pure dark:hover:bg-grey-pure/15 dark:focus:bg-grey-pure/15 text-brand active:bg-grey-light hover:text-ocean-blue-pure dark:text-light flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-white py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-white/50 focus:outline-none disabled:opacity-50 dark:border-none dark:active:bg-white/40">
          <Settings size={18} />
        </button>

        {isConnected && (
          <button
            onClick={() => {
              disconnect();
            }}
            className="border-grey-light focus:bg-ocean-blue-light focus:text-ocean-blue-pure dark:border-grey-light/25 dark:bg-grey-pure dark:focus:bg-grey-pure/15 text-brand active:bg-grey-light hover:text-ocean-blue-pure dark:active:bg-grey-pure/40 dark:hover:bg-grey-pure/25 dark:text-light dark:bg-opacity-10 flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-white py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-white/50 focus:outline-none disabled:opacity-50 dark:border-none"
          >
            <Power className="text-passion-orange-pure h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
