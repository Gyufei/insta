import { useAppKitNetwork } from '@reown/appkit/react';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { INetworkConfig, MONAD_TESTNET_NAME, NetworkConfigs } from '@/config/network-config';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NETWORKS = [
  {
    ...NetworkConfigs.monadTestnet,
    name: MONAD_TESTNET_NAME,
  },
  {
    ...NetworkConfigs.base,
  },
] as const;

export default function NetworkSelect() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig>(
    NETWORKS.find((n) => String(n.id) === String(chainId)) || NETWORKS[0]
  );
  const pathname = usePathname();
  const router = useRouter();

  function handleSelectNetwork(net: INetworkConfig) {
    if (net.id === NetworkConfigs.base.id) {
      localStorage.setItem('monad-before-page-url', pathname);
    }

    if (String(chainId) !== String(net.id)) {
      setSelectedNetwork(net);
      switchNetwork(net);
    }
  }

  useEffect(() => {
    if (String(chainId) === String(NetworkConfigs.base.id)) {
      router.replace('/token-station');
    } else {
      const beforePageUrl = localStorage.getItem('monad-before-page-url');
      if (pathname === '/token-station') {
        router.replace(beforePageUrl || '/');
      }
    }
  }, [chainId, router, pathname]);

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
      <SelectTrigger className="shadow-none focus-visible:ring-0 bg-transparent border-black/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            <Image src={network.icon} alt={network.name} width={20} height={20} />
            <span className="capitalize text-primary">{network.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
