import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { toast } from 'sonner';



import { useEffect, useRef, useState } from 'react';



import { NetworkConfigs } from '@/config/network-config';



import { useAccounts } from '../data/account-address/use-account';
import { useEnhancedAnalytics } from '../hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '../state/side-drawer';





export function useWalletConnect() {
  const { open } = useAppKit();
  const { chainId } = useAppKitNetwork();
  const { isConnected, address } = useAppKitAccount();
  const { data: accounts, refetch: refetchAccounts } = useAccounts();
  const { trackEvent, trackWalletConnection } = useEnhancedAnalytics();

  const [waitConnect, setWaitConnect] = useState(false);
  const { currentComponent, setCurrentComponent } = useSideDrawerStore();
  const lastTrackedAddressRef = useRef<string | null>(null);
  const lastConnectionStateRef = useRef<boolean>(false);

  function openWeb3Modal() {
    open();
    setWaitConnect(true);
  }

  // Handle component state changes when wallet disconnects
  useEffect(() => {
    if (!isConnected && currentComponent?.name === 'AccountSetting') {
      setCurrentComponent({ name: 'Balance' });
    }
  }, [isConnected, currentComponent, setCurrentComponent]);

  // Track wallet connection/disconnection events with deduplication
  useEffect(() => {
    // Track wallet disconnection (only when previously connected)
    if (!isConnected && lastConnectionStateRef.current) {
      lastConnectionStateRef.current = false;
      lastTrackedAddressRef.current = null;
      trackEvent('WALLET_DISCONNECT', {
        event_category: 'wallet',
      });
    }
    // Track wallet connection (only when newly connected and address changed)
    else if (isConnected && address && address !== lastTrackedAddressRef.current) {
      lastConnectionStateRef.current = true;
      lastTrackedAddressRef.current = address;
      trackWalletConnection('EOA');
    }
  }, [isConnected, address]);

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