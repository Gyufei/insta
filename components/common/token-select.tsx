'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
// import { multiply } from 'safebase';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { UNISWAP_TOKENS } from '@/app/(protocols)/uniswap/use-uniswap-token';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  INetworkConfig,
  MONAD_TESTNET_NAME,
  NetworkConfigs,
} from '@/config/network-config';
import { IToken, 
  // TokenPriceMap 
} from '@/config/tokens';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { useApiBalance } from '@/lib/data/balance/use-api-balance';
import type { IAccountTokenBalance } from '@/lib/data/balance/use-api-balance';
import { useTokenInfo } from '@/lib/data/use-token-info';
// import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { useUniswapTokens } from '@/lib/data/use-uniswap-tokens';
import { eventBus } from '@/lib/state/eventBus';
import { cn, isSameAddress } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';

interface TokenSelectProps {
  selectedToken?: IToken;
  onTokenChange: (token: IToken) => void;
  className?: string;
  disableMonUsd?: boolean;
  filterByBalance?: boolean;
  showNetworkTabs?: boolean;
  networks?: INetworkConfig[];
  label: string;
}

export function TokenSelect({
  selectedToken,
  onTokenChange,
  className,
  disableMonUsd = false,
  filterByBalance = false,
  showNetworkTabs = true,
  networks,
  label,
}: TokenSelectProps) {
  const [tokens, setTokens] = useState(UNISWAP_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const { address: wallet } = useAccount();

  const NETWORKS: INetworkConfig[] = useMemo(() => {
    return (
      networks || [
        {
          ...NetworkConfigs.monadTestnet,
          name: MONAD_TESTNET_NAME,
          icon: NetworkConfigs.monadTestnet.icon,
        },
        // { ...NetworkConfigs.base, icon: NetworkConfigs.base.icon },
        // { ...NetworkConfigs.eth, icon: NetworkConfigs.eth.icon },
      ]
    );
  }, [networks]);

  const { chainId } = useAppKitNetwork();
  const [activeNetwork, setActiveNetwork] = useState<INetworkConfig>(
    NETWORKS.find((n) => String(n?.id) === String(chainId)) || NETWORKS[0]
  );
  const [activeNetworkTab, setActiveNetworkTab] = useState<string>('All');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!chainId) return;
    const net = NETWORKS.find((n) => String(n.id) === String(chainId));
    if (net && net.id !== activeNetwork?.id) {
      setActiveNetwork(net);
    }
  }, [chainId, NETWORKS, activeNetwork?.id]);

  const isSearchingAddress = isAddress(searchQuery.trim());
  const { data: tokenInfoData, isLoading: isTokenInfoLoading } = useTokenInfo(
    isSearchingAddress ? searchQuery.trim() : ''
  );
  const tokenInfo =
    isSameAddress(tokenInfoData?.address || '', DEFAULT_NATIVE_ADDRESS) ||
    isSameAddress(tokenInfoData?.address || '', BACKEND_NATIVE_ADDRESS)
      ? undefined
      : tokenInfoData;

  const { data: balanceData } = useApiBalance(isOpen);
  const { data: uniswapTokensData, isLoading: isUniswapTokensLoading } = useUniswapTokens();
  // const { data: priceData } = useTokenStationPrice();

  // const ethPrice = priceData?.eth_price || '0';
  // const monPrice = priceData?.mon_price || '0';

  const activeNetworkCode = useMemo(() => {
    if (String(activeNetwork?.id) === String(NetworkConfigs.monadTestnet.id)) return 'MON';
    if (String(activeNetwork?.id) === String(NetworkConfigs.eth.id)) return 'ETH';
    if (String(activeNetwork?.id) === String(NetworkConfigs.base.id)) return 'BASE';
    return 'MON';
  }, [activeNetwork?.id]);

  const balancesIndex = useMemo(() => {
    const byAddress = new Map<string, IAccountTokenBalance>();
    const bySymbol = new Map<string, IAccountTokenBalance>();
    (balanceData || []).forEach((b) => {
      if (b.network === activeNetworkCode) {
        byAddress.set(b.address.toLowerCase(), b);
        bySymbol.set(b.token, b);
      }
    });
    return { byAddress, bySymbol };
  }, [balanceData, activeNetworkCode]);

  // function getPriceForTokenSymbol(symbol: string): string {
  //   if (!symbol) return '0';
  //   const upper = symbol.toUpperCase();
  //   if (upper === 'ETH' || upper === 'METH') return ethPrice;
  //   if (upper === 'MON' || upper === 'WMON') return monPrice;
  //   if (upper === 'USDT' || upper === 'USDC' || upper === 'MONUSD') return '1';
  //   if (TokenPriceMap[upper] !== undefined) return String(TokenPriceMap[upper]);
  //   return '0';
  // }

  const allTokens = useMemo(() => {
    const uniswapTokens = uniswapTokensData?.map((token) => ({
      ...token,
      logo: token.logoURI,
      description: token.tokenDescription,
    }));

    let allToken = [...tokens, ...(uniswapTokens || [])];

    if (filterByBalance) {
      const monBalanceTokens = balanceData?.filter((t) => t.network === 'MON');
      const hasBalanceTokens = uniswapTokens?.filter((token) =>
        monBalanceTokens?.some((bToken) => bToken.address === token.address)
      );
      allToken = [...tokens, ...(hasBalanceTokens || [])];
    }

    if (disableMonUsd) {
      allToken = allToken.filter(
        (token) => !isSameAddress(token.address, '0x57c914e3240C837EBE87F096e0B4d9A06E3F489B')
      );
    }

    return allToken;
  }, [tokens, uniswapTokensData, balanceData, filterByBalance, disableMonUsd]);

  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTokens;
    }

    const query = searchQuery.toLowerCase();
    let filtered = allTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        (isAddress(query) && isSameAddress(token.address, query))
    );

    if (isSearchingAddress && tokenInfo && !isTokenInfoLoading && !isUniswapTokensLoading) {
      const existingToken = filtered.find((token) =>
        isSameAddress(token.address, tokenInfo?.address || '')
      );
      if (!existingToken) {
        filtered = [tokenInfo as unknown as IToken, ...filtered];
      }
    }

    return filtered;
  }, [
    allTokens,
    searchQuery,
    tokenInfo,
    isTokenInfoLoading,
    isUniswapTokensLoading,
    isSearchingAddress,
  ]);

  function TokenQty({
    wallet,
    token,
    bItem,
    enabled,
  }: {
    wallet?: string;
    token: IToken;
    bItem?: IAccountTokenBalance;
    enabled?: boolean;
  }) {
    const hasWalletAddr = !!wallet;
    const bulkQty = truncateNumber(String(bItem?.formattedBalance ?? '0'), 6);
    const needFallback = hasWalletAddr && (!bItem || Number(bulkQty) === 0);
    const addr = needFallback ? wallet ?? '' : '';
    const { balance, isBalancePending } = useAddressBalance(
      addr,
      token.address,
      token.decimals,
      enabled,
      60_000
    );

    if (!hasWalletAddr) {
      return <span className="text-sm text-[#131E40]">--</span>;
    }

    if (needFallback) {
      if (enabled === false) {
        return <span className="text-sm text-[#131E40]">...</span>;
      }
      return (
        <span className="text-sm text-[#131E40]">{isBalancePending ? '...' : balance}</span>
      );
    }

    return <span className="text-sm text-[#131E40]">{bulkQty}</span>;
  }

  useEffect(() => {
    if (isSearchingAddress && tokenInfo) {
      const tokenAddress = (tokenInfo.address || '').toLowerCase();
      const isExist = allTokens.find((token) => token.address.toLowerCase() === tokenAddress);
      if (!isExist) {
        setTokens((prevTokens) => [...prevTokens, tokenInfo as unknown as IToken]);
      }
    }
  }, [tokenInfo, isSearchingAddress, allTokens]);

  return (
    <Select
      value={selectedToken?.address}
      onValueChange={(value) => {
        const selected = filteredTokens.find((token) => isSameAddress(token.address, value));
        if (selected) {
          onTokenChange(selected);
        }
      }}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger
        className={cn(
          'w-full focus-visible:ring-0 !h-10 px-3 border border-[#EBEBEB] rounded-[8px]',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {selectedToken ? (
            <>
              <div className="relative w-6 h-6">
                <LogoWithPlaceholder
                  src={selectedToken.logo}
                  className="w-6 h-6"
                  width={20}
                  height={20}
                  name={selectedToken.symbol}
                />
                <div className="absolute -top-0 -right-0 w-3 h-3 rounded-full ring-2 ring-white overflow-hidden bg-white">
                  <Image
                    src={activeNetwork.icon}
                    alt={activeNetwork.name}
                    width={12}
                    height={12}
                    className="w-3 h-3"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <SelectValue className="text-[#131E40] text-sm font-medium">
                  {selectedToken.symbol}
                </SelectValue>
                <span className="text-xs text-[#A5ADC6]">{activeNetwork.name}</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-6 h-6">
                <div className="w-6 h-6 rounded-full bg-[#EBEBEB]" />
              </div>
              <div className="flex items-center  gap-1">
                <span className="text-[#131E40] text-sm font-medium">{label}</span>
                <span className="text-xs text-[#A5ADC6]">Not Selected</span>
              </div>
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="w-[398px] max-h-[360px] border border-[#EBEBEB] rounded-[12px] bg-white p-0">
        {showNetworkTabs && (
          <div className="px-5 pt-5 pb-4 border-b border-[#EBEBEB]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                className={cn(
                  'h-10 px-4 rounded-[8px] text-sm border',
                  activeNetworkTab === 'All'
                    ? 'border-[#6E75F9] text-[#6E75F9] bg-[#6E75F910]'
                    : 'border-[#EBEBEB] text-[#6B7280] bg-white'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNetworkTab('All');
                }}
              >
                All
              </button>
              {NETWORKS.map((net) => (
                <button
                  key={net.name}
                  type="button"
                  className={cn(
                    'h-10 px-3 rounded-[8px] text-sm border flex items-center gap-2',
                    activeNetworkTab === net.name
                      ? 'border-[#6E75F9] text-[#6E75F9] bg-[#6E75F910]'
                      : 'border-[#EBEBEB] text-[#6B7280] bg-white'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNetwork(net);
                    setActiveNetworkTab(net.name);
                    eventBus.publish('toggle-network', net);
                  }}
                >
                  <Image src={net.icon} alt={net.name} width={16} height={16} className="w-4 h-4" />
                  <span className="capitalize text-[#131E40]">{net.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="px-5 pt-4 pb-4 border-b border-[#EBEBEB]">
          <Input
            placeholder="Search token name, symbol or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 text-sm"
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onBlur={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-[312px] overflow-y-auto px-5">
          {isSearchingAddress && (isTokenInfoLoading || isUniswapTokensLoading) ? (
            <div className="p-3 text-center text-sm text-gray-500">
              <Skeleton className="w-full h-8 mb-2" />
              <span>Loading...</span>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No token found</div>
          ) : (
            filteredTokens.map((token) => {
              const isNative =
                isSameAddress(token.address, DEFAULT_NATIVE_ADDRESS) ||
                isSameAddress(token.address, BACKEND_NATIVE_ADDRESS);
              const nativeAddr = BACKEND_NATIVE_ADDRESS.toLowerCase();
              const lookupAddr = isNative ? nativeAddr : token.address.toLowerCase();
              const tokenSymbolUpper = token.symbol?.toUpperCase() || '';
              const bItem =
                balancesIndex.byAddress.get(lookupAddr) ||
                balancesIndex.bySymbol.get(tokenSymbolUpper) ||
                balancesIndex.bySymbol.get(token.symbol);
              
              // const price = getPriceForTokenSymbol(token.symbol);
              // const usd = truncateNumber(
              //   multiply(String(bItem?.formattedBalance || '0'), price),
              //   2
              // );
              const isSelected = isSameAddress(selectedToken?.address || '', token.address);

              return (
                <SelectItem
                  key={`${token.symbol}-${token.address}`}
                  value={token.address}
                  className={cn(
                    'flex justify-between items-center my-2 w-full h-14 px-3 border rounded-[8px] bg-white *:[span]:last:w-full *:[span]:last:justify-between',
                    isSelected ? 'border-[#6E75F9] bg-[#6E75F910]' : 'border-[#EBEBEB]'
                  )}
                >
                  <div
                    className={cn(
                      'flex-1 min-w-0 flex justify-between items-center transition-all duration-200 ease-in-out',
                      isSelected ? 'pr-6' : 'pr-0'
                    )}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="relative w-10 h-10">
                        <LogoWithPlaceholder
                          src={token.logo}
                          className="w-10 h-10"
                          width={40}
                          height={40}
                          name={token.symbol}
                        />
                        <div className="absolute -top-0 -right-0 w-5 h-5 rounded-full ring-2 ring-white overflow-hidden bg-white">
                          <Image
                            src={activeNetwork.icon}
                            alt={activeNetwork.name}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#131E40]">{token.symbol}</span>
                        <span className="text-xs text-[#A5ADC6]">{activeNetwork.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <TokenQty wallet={wallet} token={token} bItem={bItem} enabled={isOpen} />
                      {/* <span className="text-xs text-[#A5ADC6]">{hasWallet ? `$${usd}` : '--'}</span> */}
                      <span className="text-xs text-[#A5ADC6]">{'--'}</span>
                    </div>
                  </div>
                </SelectItem>
              );
            })
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
