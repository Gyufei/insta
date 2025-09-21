import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { trackEvent, trackWalletConnection } from '../analytics';
import { useAccounts } from '../data/account-address/use-account';
import { useSideDrawerStore } from '../state/side-drawer';

export function useWalletConnect() {
  const { open } = useAppKit();
  const { chainId } = useAppKitNetwork();
  const { isConnected, address } = useAppKitAccount();
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
      // Track wallet disconnect
      trackEvent('WALLET_DISCONNECT', {
        event_category: 'wallet',
      });
    } else if (isConnected && address) {
      // Track wallet connection
      trackWalletConnection(address, 'EOA');
    }
  }, [isConnected, address, currentComponent, setCurrentComponent]);

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
        if (chainId === NetworkConfigs.monadTestnet.id) {
          setCurrentComponent({ name: 'AccountSetting' });
          toast.info('Please create your DSA account.');
        }
        setWaitConnect(false);
      }
    }

    if (isConnected && waitConnect) {
      getAccounts();
    }
  }, [isConnected, accounts, waitConnect, chainId]);

  return {
    openWeb3Modal,
  };
}
