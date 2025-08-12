import { useAppKitNetwork } from '@reown/appkit/react';
import { useSwitchChain } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

// 网络ID到URL参数的映射
const NETWORK_TO_URL_PARAM: Record<string, string> = {
  [String(NetworkConfigs.monadTestnet.id)]: 'monad',
  [String(NetworkConfigs.base.id)]: 'base',
  [String(NetworkConfigs.eth.id)]: 'eth',
};

// URL参数到网络ID的映射
const URL_PARAM_TO_NETWORK: Record<string, string> = {
  monad: String(NetworkConfigs.monadTestnet.id),
  base: String(NetworkConfigs.base.id),
  eth: String(NetworkConfigs.eth.id),
};

const BaseNetUrlPath = ['/token-station', '/badge-gallery'];

export default function NetworkSelect() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig>(
    NETWORKS.find((n) => String(n.id) === String(chainId)) || NETWORKS[0]
  );
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setCurrentComponent } = useSideDrawerStore();

  const isBaseNet = useMemo(() => BaseNetIds.includes(String(chainId)), [chainId]);

  const isMobile = useIsMobile();

  // 更新URL参数
  const updateUrlChainParam = (networkId: string) => {
    const params = new URLSearchParams(searchParams);
    const chainParam = NETWORK_TO_URL_PARAM[networkId];

    if (chainParam) {
      params.set('chain', chainParam);
    } else {
      params.delete('chain');
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  // 从URL参数获取网络
  const getNetworkFromUrl = () => {
    const chainParam = searchParams.get('chain');
    if (chainParam && URL_PARAM_TO_NETWORK[chainParam]) {
      const networkId = URL_PARAM_TO_NETWORK[chainParam];
      const network = NETWORKS.find((n) => String(n.id) === networkId);
      return network;
    }
    return null;
  };

  async function handleSelectNetwork(net: INetworkConfig) {
    const isBasePath = BaseNetUrlPath.includes(pathname);

    console.log('handleSelectNetwork', chainId, net.id, pathname, isBasePath);

    if (net.id !== NetworkConfigs.monadTestnet.id && !isBasePath) {
      localStorage.setItem('monad-before-page-url', pathname);
      setCurrentComponent({
        name: 'Balance',
      });

      router.replace(
        `/token-station${net ? `?chain=${NETWORK_TO_URL_PARAM[String(net.id)]}` : ''}`
      );
    } else if (net.id === NetworkConfigs.monadTestnet.id && isBasePath) {
      const beforePageUrl = localStorage.getItem('monad-before-page-url');
      router.replace(beforePageUrl + '?chain=monad' || '/?chain=monad');
    }

    if (String(chainId) !== String(net.id)) {
      updateUrlChainParam(String(net.id));
      setSelectedNetwork(net);
      switchNetwork(net);
    }
  }

  const [pageInit, setPageInit] = useState(false);

  useEffect(() => {
    if (pageInit) {
      return;
    }

    if (chainId) {
      const urlNetwork = getNetworkFromUrl();

      if (urlNetwork) {
        switchNetwork(urlNetwork);
        setSelectedNetwork(
          NETWORKS.find((n) => String(n.id) === String(urlNetwork.id)) || NETWORKS[0]
        );
      } else {
        updateUrlChainParam(String(chainId));
        handleSelectNetwork(NETWORKS.find((n) => String(n.id) === String(chainId)) || NETWORKS[0]);
      }

      setTimeout(() => {
        setPageInit(true);
      }, 1000);
    }
  }, [pageInit, chainId]);

  useEffect(() => {
    if (!pageInit) {
      return;
    }

    if (chainId) {
      const shouldChain = NETWORKS.find((n) => String(n.id) === String(chainId));
      if (shouldChain) {
        updateUrlChainParam(String(chainId));
        handleSelectNetwork(shouldChain);
      }
    }
  }, [chainId, pageInit]);

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
