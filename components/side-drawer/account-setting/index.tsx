import { useAccount } from 'wagmi';
import { ConnectWalletButton } from './connect-wallet-button';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { formatAddress } from '@/lib/utils';
import { Disconnect } from './disconnect';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useSelectedAccount } from '@/lib/data/use-account';
import { NoAccountDisplay } from './no-account-display';
import { AccountDisplay } from './account-display';
import Link from 'next/link';
import { SideDrawerLayout } from '../common/side-drawer-layout';

export function AccountSetting() {
  const { address } = useAccount();
  const { setIsOpen } = useSideDrawerStore();
  const { data: accountInfo } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  return (
    <>
      <SideDrawerBackHeader title="Account Settings" onClick={() => setIsOpen(false)} />

      <SideDrawerLayout>
        <div className="mb-10 flex flex-col gap-2">
          <ConnectWalletButton address={formatAddress(address || '')} />
        </div>
        {account ? <AccountDisplay /> : <NoAccountDisplay />}
        <div className="pt-6 text-center">
          <Link
            href="/authority"
            className="text-gray-300 hover:text-blue dark:hover:text-primary-foreground underline"
          >
            View Full Page
          </Link>
        </div>
      </SideDrawerLayout>
      <Disconnect />
    </>
  );
}
