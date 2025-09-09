import { useAppKitNetwork } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

import { useMemo } from 'react';

import { BaseNetIds } from '@/config/network-config';

import { Button } from '@/components/ui/button';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAccountStore } from '@/lib/state/account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatAddress } from '@/lib/utils';

export function AccountBtn() {
  const { address } = useAccount();
  const { data: accountInfo, isLoading } = useSelectedAccount();

  const account = accountInfo?.sandbox_account;
  const { currentAccountType } = useAccountStore();

  const { chainId } = useAppKitNetwork();
  const isBaseNet = useMemo(() => BaseNetIds.includes(String(chainId)), [chainId]);

  const { setCurrentComponent } = useSideDrawerStore();

  function handleCreate() {
    if (!address) return;
    setCurrentComponent({ name: 'AccountSetting' });
  }

  if (isBaseNet && !account) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="flex-shrink-0 min-w-[5.75rem] text-xs font-semibold whitespace-nowrap shadow-none bg-transparent border-black/10"
      onClick={handleCreate}
      disabled={isLoading}
    >
      <div className="flex flex-col items-center justify-center leading-5 text-primary">
        <span className="text-xs text-primary">
          {currentAccountType === 'EOA' ? (
            <>#{formatAddress(address || '')}</>
          ) : (
            <>#{accountInfo?.id}</>
          )}
        </span>
        <span className="text-[10px] text-[#A5ADC6] leading-[14px]">
          {currentAccountType === 'EOA' ? <>EOA</> : <>DSA</>}
        </span>
      </div>
    </Button>
  );
}
