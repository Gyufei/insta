import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { useSelectedAccount } from '../data/use-account';
import { useSideDrawerStore } from '../state/side-drawer';

export function useWalletConnect() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { data: accountInfo, isSuccess } = useSelectedAccount();

  const [waitConnect, setWaitConnect] = useState(false);
  const { setCurrentComponent } = useSideDrawerStore();

  function openWeb3Modal() {
    open();
    setWaitConnect(true);
  }

  useEffect(() => {
    if (accountInfo) {
      setWaitConnect(false);
      return;
    }

    if (!isConnected || accountInfo || !isSuccess || !waitConnect) {
      return;
    }

    if (isConnected && isSuccess && !accountInfo && waitConnect) {
      setTimeout(() => {
        setCurrentComponent({ name: 'AccountSetting' });
        toast.info('Please create your DSA account.');
        setWaitConnect(false);
      }, 500);
    }
  }, [isConnected, accountInfo, isSuccess, waitConnect]);

  return {
    openWeb3Modal,
  };
}
