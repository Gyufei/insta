'use client';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from './connect-wallet-button';
import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { formatAddress } from '@/lib/utils';
import { Disconnect } from './disconnect';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useGetAccount } from '@/lib/data/use-get-account';
import { NoAccountDisplay } from './no-account-display';
import { AccountDisplay } from './account-display';
import Link from 'next/link';

export function AccountSetting() {
  const { address } = useAccount();
  const { setIsOpen } = useSideDrawerStore();
  const { data: accountInfo } = useGetAccount();
  const account = accountInfo?.sandbox_account;

  return (
    <>
      <SideDrawerBackHeader title="Account Settings" onClick={() => setIsOpen(false)} />

      <div className="scrollbar-hover flex flex-grow flex-col overflow-x-hidden overflow-y-scroll py-6">
        <div className="mb-10 flex flex-col gap-2 px-8">
          <ConnectWalletButton address={formatAddress(address || '')} />
        </div>
        {account ? <AccountDisplay /> : <NoAccountDisplay />}
        <div className="px-8 pt-6 text-center">
          <Link
            href="/authority"
            className="text-grey-pure hover:text-ocean-blue-pure dark:hover:text-light underline"
          >
            View Full Page
          </Link>
        </div>
      </div>
      <Disconnect />
    </>
  );
}
