import { useAppKitNetwork } from '@reown/appkit/react';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
  BaseNetIds,
  INetworkConfig,
  MONAD_TESTNET_NAME,
  NetworkConfigs,
} from '@/config/network-config';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useIsMobile } from '@/lib/utils/use-mobile';

const NETWORKS = [
  {
    ...NetworkConfigs.monadTestnet,
    name: MONAD_TESTNET_NAME,
  },
  {
    ...NetworkConfigs.base,
  },
  {
    ...NetworkConfigs.eth,
  },
] as const;

const BaseNetUrlPath = ['/token-station', '/badge-gallery'];

export default function NetworkSelect() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig>(
    NETWORKS.find((n) => String(n.id) === String(chainId)) || NETWORKS[0]
  );
  const pathname = usePathname();
  const router = useRouter();

  const { setCurrentComponent } = useSideDrawerStore();

  const isBaseNet = useMemo(() => BaseNetIds.includes(String(chainId)), [chainId]);

  const isMobile = useIsMobile();

  function handleSelectNetwork(net: INetworkConfig) {
    if (
      !isBaseNet &&
      BaseNetIds.includes(String(net.id) as unknown as (typeof BaseNetIds)[number])
    ) {
      localStorage.setItem('monad-before-page-url', pathname);
      setCurrentComponent({
        name: 'Balance',
      });
    }

    if (String(chainId) !== String(net.id)) {
      setSelectedNetwork(net);
      switchNetwork(net);
    }
  }

  useEffect(() => {
    if (chainId && selectedNetwork.id !== chainId) {
      const shouldChain = NETWORKS.find((n) => String(n.id) === String(chainId));
      if (shouldChain) {
        setSelectedNetwork(shouldChain);
      }
    }
  }, [chainId]);

  useEffect(() => {
    const isBasePath = BaseNetUrlPath.includes(pathname);

    if (isBaseNet) {
      if (!isBasePath) {
        router.replace('/token-station');
      }
    } else {
      const beforePageUrl = localStorage.getItem('monad-before-page-url');

      if (isBasePath) {
        router.replace(beforePageUrl || '/');
      }
    }
  }, [router, pathname, isBaseNet]);

  return (
    <Select
      value={selectedNetwork.name}
      onValueChange={(value) => {
        const network = NETWORKS.find((n) => n.name === value);
        if (network) {
          handleSelectNetwork(network);
        }
      }}
    >
      <SelectTrigger className="shadow-none focus-visible:ring-0 bg-transparent border-black/10 font-medium">
        {isMobile ? (
          <Image src={selectedNetwork.icon} alt={selectedNetwork.name} width={20} height={20} />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            <Image src={network.icon} alt={network.name} width={20} height={20} />
            <span className="capitalize text-primary font-medium">{network.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
