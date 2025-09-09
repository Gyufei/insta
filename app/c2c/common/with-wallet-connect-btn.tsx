import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';

export default function WithWalletConnectBtn({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { setCurrentComponent } = useSideDrawerStore();

  const { data: accountInfo } = useSelectedAccount();

  function handleClick() {
    if (!isConnected) {
      open();
    } else if (!accountInfo?.sandbox_account) {
      setCurrentComponent({ name: 'AccountSetting' });
      onClick();
    } else {
      onClick();
    }
  }

  return (
    <div className={cn('', className)} onClick={handleClick}>
      {children}
    </div>
  );
}
