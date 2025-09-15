import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { cn } from '@/lib/utils';

import { SideDrawerLayout } from '../common/side-drawer-layout';
import { usePathChangeBack } from '../use-path-change-back';
import { AccountDisplay } from './account-display';
import { NoAccountDisplay } from './no-account-display';
import { WalletDisplay } from './wallet-display';

export function AccountSetting() {
  const { handleBack } = usePathChangeBack();
  const { data: accountInfo } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  return (
    <>
      <SideDrawerBackHeader title="Account Settings" onClick={handleBack} />

      <SideDrawerLayout>
        <WalletDisplay className={cn('mt-6 mb-8')} />
        {account ? <AccountDisplay /> : <NoAccountDisplay />}
      </SideDrawerLayout>
    </>
  );
}
