import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { useAccounts } from '../data/account-address/use-account';
import { useSideDrawerStore } from '../state/side-drawer';

export function useWalletConnect() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { data: accounts, refetch: refetchAccounts } = useAccounts();

  const [waitConnect, setWaitConnect] = useState(false);
  const { currentComponent, setCurrentComponent } = useSideDrawerStore();

  function openWeb3Modal() {
    open();
    setWaitConnect(true);
  }

  useEffect(() => {
    if (!isConnected && currentComponent?.name === 'AccountSetting') {
      setCurrentComponent({ name: 'Balance' });
    }
  }, [isConnected, currentComponent, setCurrentComponent]);

  useEffect(() => {
    if ((accounts || [])?.length > 0) {
      setWaitConnect(false);
      return;
    }

    if (!isConnected || !waitConnect) {
      return;
    }

    async function getAccounts() {
      const acs = await refetchAccounts();

      if ((acs?.data || [])?.length > 0) {
        setWaitConnect(false);
      } else {
        setCurrentComponent({ name: 'AccountSetting' });
        toast.info('Please create your DSA account.');
        setWaitConnect(false);
      }
    }

    if (isConnected && waitConnect) {
      getAccounts();
    }
  }, [isConnected, accounts, waitConnect]);

  return {
    openWeb3Modal,
  };
}
