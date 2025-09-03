import { useAccount } from 'wagmi';

import Link from 'next/link';

import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSelectedAccount } from '@/lib/data/use-account';
import { formatAddress } from '@/lib/utils';

import { SideDrawerLayout } from '../common/side-drawer-layout';
import { usePathChangeBack } from '../use-path-change-back';
import { AccountDisplay } from './account-display';
import { ConnectWalletButton } from './connect-wallet-button';
import { Disconnect } from './disconnect';
import { NoAccountDisplay } from './no-account-display';

export function AccountSetting() {
  const { address } = useAccount();
  const { handleBack } = usePathChangeBack();
  const { data: accountInfo } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  return (
    <>
      <SideDrawerBackHeader title="Account Settings" onClick={handleBack} />

      <SideDrawerLayout>
        <div className="mb-10 flex flex-col gap-2">
          <ConnectWalletButton address={formatAddress(address || '')} />
        </div>
        {account ? <AccountDisplay /> : <NoAccountDisplay />}
        <div className="pt-6 text-center">
          <Link
            href="/authority?chain=monad"
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
