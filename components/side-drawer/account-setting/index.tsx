import { useAccount } from 'wagmi';
import { ConnectWalletButton } from './connect-wallet-button';
import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { formatAddress } from '@/lib/utils';
import { Disconnect } from './disconnect';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useGetAccount } from '@/lib/data/use-get-account';
import { NoAccountDisplay } from './no-account-display';
import { AccountDisplay } from './account-display';

export function AccountSetting() {
  const { address } = useAccount();
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: accountInfo } = useGetAccount();

  return (
    <>
      <SideDrawerBackHeader
        title="Account Settings"
        onClick={() => setCurrentComponent('Balance')}
      />

      <div className="scrollbar-hover flex flex-grow flex-col overflow-x-hidden overflow-y-scroll py-6">
        <div className="mb-10 flex flex-col gap-2 px-8">
          <ConnectWalletButton address={formatAddress(address || '')} />
        </div>
        {accountInfo ? <AccountDisplay /> : <NoAccountDisplay />}
      </div>
      <Disconnect />
    </>
  );
}
