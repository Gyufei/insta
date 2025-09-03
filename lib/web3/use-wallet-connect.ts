import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { useSelectedAccount } from '../data/use-account';
import { useSideDrawerStore } from '../state/side-drawer';

export function useWalletConnect() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { data: accountInfo, isLoading } = useSelectedAccount();

  const [waitConnect, setWaitConnect] = useState(false);
  const { setCurrentComponent } = useSideDrawerStore();

  function openWeb3Modal() {
    open();
    setWaitConnect(true);
  }

  useEffect(() => {
    if (!isConnected || accountInfo || isLoading || !waitConnect) {
      return;
    }

    if (isConnected && !isLoading && !accountInfo && waitConnect) {
      setTimeout(() => {
        setCurrentComponent({ name: 'AccountSetting' });
        toast.info('Please create your DSA account.');
        setWaitConnect(false);
      }, 500);
    }
  }, [isConnected, accountInfo, isLoading, waitConnect]);

  return {
    openWeb3Modal,
  };
}
