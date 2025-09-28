import { useAppKitNetwork } from '@reown/appkit/react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BaseNetUrlPath } from '@/config/env-url';
import { INetworkConfig, MONAD_TESTNET_NAME, NetworkConfigs } from '@/config/network-config';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { eventBus } from '@/lib/state/eventBus';
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

let ToastId: number | string | undefined;

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

export default function NetworkSelect() {
  const { address } = useAccount();
  const { switchNetwork, chainId } = useAppKitNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig | null>(NETWORKS[0]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setCurrentComponent } = useSideDrawerStore();

  const isMobile = useIsMobile();

  const [pageHasInit, setPageInit] = useState(false);

  const [isUnsupportedChain, setIsUnsupportedChain] = useState(false);

  function checkIsUnsupported() {
    if (typeof window === 'undefined')
      return {
        isUnSup: false,
        cId: chainId,
      };
    const pageChain = (window?.ethereum as unknown as { chainId: string })?.chainId;

    if (!pageChain) {
      return {
        isUnSup: false,
        cId: chainId,
      };
    }

    const isSystemChain = (
      [NetworkConfigs.base.id, NetworkConfigs.eth.id, NetworkConfigs.monadTestnet.id] as number[]
    ).includes(Number(pageChain));

    const isBadgeGallery = pathname.includes('badge-gallery');
    const isBase = Number(pageChain) === NetworkConfigs.base.id;
    const isUnSup = (!isBadgeGallery && !isSystemChain) || (isBadgeGallery && !isBase);

    return {
      isUnSup,
      cId: Number(pageChain),
    };
  }

  useEffect(() => {});

  useEffect(() => {
    function checkUnState() {
      const isUns = checkIsUnsupported();

      if (isUns.isUnSup && address) {
        setIsUnsupportedChain(true);
      } else {
        setIsUnsupportedChain(false);
      }
    }

    const inter = setInterval(() => {
      checkUnState();
    }, 1000);

    return () => clearInterval(inter);
  }, [address]);

  useEffect(() => {
    const { isUnSup, cId } = checkIsUnsupported();
    if (!isUnSup || !address) {
      return;
    }
    if (ToastId) {
      return;
    }
    ToastId = 1;
    setTimeout(() => {
      ToastId = toast.custom((t: number | string) => (
        <div className="bg-white border border-[#ebebeb] rounded-[8px] p-4 w-[360px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src="/icons/warn-icon.svg" alt="unsupported-network" width={48} height={48} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-primary leading-[20px]">
                  Unsupported network
                </span>
                <span className="text-xs font-normal text-[#A5ADC6] leading-[20px]">
                  Chain id: {Number(cId)}
                </span>
              </div>
            </div>
            <div className="flex items-center h-6 w-6">
              <Image
                onClick={() => toast.dismiss(t)}
                src="/icons/close.svg"
                width={24}
                height={24}
                alt="close"
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      ));
    }, 1000);
  }, [isUnsupportedChain]);

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
    const nowUrl = new URL(window.location.href);
    const chainParam = nowUrl.searchParams.get('chain');
    if (chainParam && URL_PARAM_TO_NETWORK[chainParam]) {
      const networkId = URL_PARAM_TO_NETWORK[chainParam];
      const network = NETWORKS.find((n) => String(n.id) === networkId);
      return network;
    }
    return null;
  };

  async function handleSelectNetwork(net: INetworkConfig) {
    const isBasePath = BaseNetUrlPath.includes(pathname);
    sessionStorage.setItem('current-network', net.name);

    if (net.id !== NetworkConfigs.monadTestnet.id) {
      if (!isBasePath) {
        localStorage.setItem('monad-before-page-url', pathname);
        setCurrentComponent({
          name: 'Balance',
        });

        setSelectedNetwork(net);
        switchNetwork(net);
        router.replace(
          `/token-station${net ? `?chain=${NETWORK_TO_URL_PARAM[String(net.id)]}` : ''}`
        );
      } else {
        setSelectedNetwork(net);
        switchNetwork(net);
        updateUrlChainParam(String(net.id));
      }
    } else if (net.id === NetworkConfigs.monadTestnet.id && isBasePath) {
      const beforePageUrl = localStorage.getItem('monad-before-page-url');
      const goUrl = ['null', '/null', '/undefined', 'undefined'].includes(beforePageUrl || '')
        ? '/uniswap'
        : beforePageUrl;

      setSelectedNetwork(net);
      switchNetwork(net);
      router.replace(goUrl + '?chain=monad');
    } else {
      setSelectedNetwork(net);
      switchNetwork(net);
      updateUrlChainParam(String(net.id));
    }
  }

  useEffect(() => {
    const unSub = eventBus.subscribe(
      'toggle-network',
      (net: (typeof NetworkConfigs)[keyof typeof NetworkConfigs]) => {
        handleSelectNetwork(net);
      }
    );

    return () => unSub();
  }, []);

  useEffect(() => {
    if (pageHasInit) {
      return;
    }

    if (chainId) {
      const urlNetwork = getNetworkFromUrl();

      if (urlNetwork) {
        const isBaseNet = ([NetworkConfigs.base.id, NetworkConfigs.eth.id] as number[]).includes(
          urlNetwork?.id || 0
        );

        const isBasePath = BaseNetUrlPath.includes(pathname);

        if (isBaseNet && isBasePath) {
          switchNetwork(urlNetwork);
          setSelectedNetwork(
            NETWORKS.find((n) => String(n.id) === String(urlNetwork.id)) || NETWORKS[0]
          );
        }
      } else {
        const isBasePath = BaseNetUrlPath.includes(pathname);

        if (!isBasePath) {
          updateUrlChainParam(String(NetworkConfigs.monadTestnet.id));
          setSelectedNetwork(
            NETWORKS.find((n) => String(n.id) === String(NetworkConfigs.monadTestnet.id)) ||
              NETWORKS[0]
          );
        } else {
          updateUrlChainParam(String(chainId));
          handleSelectNetwork(
            NETWORKS.find((n) => String(n.id) === String(chainId)) || NETWORKS[0]
          );
        }
      }

      setTimeout(() => {
        setPageInit(true);
      }, 1000);
    }
  }, [pageHasInit, chainId, pathname]);

  return (
    <Select
      value={!isUnsupportedChain ? selectedNetwork?.name : ''}
      onValueChange={(value) => {
        const network = NETWORKS.find((n) => n.name === value);
        if (network) {
          handleSelectNetwork(network);
        }
      }}
    >
      <SelectTrigger className="shadow-none focus-visible:ring-0 bg-transparent border-black/10 font-medium px-2">
        {isUnsupportedChain ? (
          <div className="flex items-center gap-1">
            <Image src="/icons/unsupport.svg" alt="unsupported-network" width={20} height={20} />
            {!isMobile && (
              <span className="capitalize flex flex-col items-start text-xs font-medium text-primary text-left">
                <span>Unsupported</span>
                <span>Network</span>
              </span>
            )}
          </div>
        ) : isMobile ? (
          <Image
            src={selectedNetwork?.icon || ''}
            alt={selectedNetwork?.name || ''}
            width={20}
            height={20}
          />
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
