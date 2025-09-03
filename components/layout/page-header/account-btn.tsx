import { useAppKitNetwork } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

import { useMemo } from 'react';

import { BaseNetIds } from '@/config/network-config';

import { Button } from '@/components/ui/button';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function AccountBtn() {
  const { address } = useAccount();
  const { data: accountInfo, isLoading } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

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
      <div className="flex items-center justify-center leading-5 text-primary">
        {account ? <>#{accountInfo.id}</> : <>Create Account</>}
      </div>
    </Button>
  );
}
