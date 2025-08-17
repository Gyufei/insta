'use client';

import { Search } from 'lucide-react';
import { isAddress } from 'viem';

import { useEffect, useMemo, useRef, useState } from 'react';

import { IToken } from '@/config/tokens';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { NoSearchResult } from '@/components/side-drawer/balance/no-search-result';
import { Skeleton } from '@/components/ui/skeleton';

import { useTokenInfo } from '@/lib/data/use-token-info';
import { useUniswapTokens } from '@/lib/data/use-uniswap-tokens';

import { UNISWAP_TOKENS } from '../use-uniswap-token';

interface TokenSelectorProps {
  onSelect: (token: IToken) => void;
  onClose: () => void;
  onTokenAdded?: (token: IToken) => void; // 新增：当通过地址搜索选择代币时的回调
}

export default function TokenSelector({ onSelect, onClose, onTokenAdded }: TokenSelectorProps) {
  const tokens = UNISWAP_TOKENS;
  const [searchQuery, setSearchQuery] = useState('');
  const processedTokensRef = useRef<Set<string>>(new Set());
  const tokensRef = useRef(tokens);

  // 更新ref以保持最新值
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  // 检查搜索查询是否为有效的合约地址
  const isSearchingAddress = isAddress(searchQuery.trim());

  const { data: tokenInfo, isLoading: isTokenInfoLoading } = useTokenInfo(
    isSearchingAddress ? searchQuery.trim() : ''
  );

  const { data: uniswapTokensData, isLoading: isUniswapTokensLoading } = useUniswapTokens();

  // 当搜索查询改变时，重置已处理的代币记录
  useEffect(() => {
    processedTokensRef.current.clear();
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchingAddress && tokenInfo) {
      const tokenAddress = tokenInfo.address.toLowerCase();
      const isExist = tokensRef.current.find(
        (token) => token.address.toLowerCase() === tokenAddress
      );
      const hasBeenProcessed = processedTokensRef.current.has(tokenAddress);

      if (!isExist && !hasBeenProcessed) {
        processedTokensRef.current.add(tokenAddress);
        onTokenAdded?.(tokenInfo as unknown as IToken);
      }
    }
  }, [tokenInfo, isSearchingAddress, onTokenAdded]);

  const allTokens = useMemo(() => {
    const uniswapTokens = uniswapTokensData?.map((token) => ({
      ...token,
      logo: token.logoURI,
      description: token.tokenDescription,
    }));

    return [...tokens, ...(uniswapTokens || [])];
  }, [tokens, uniswapTokensData]);

  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTokens;
    }

    const query = searchQuery.toLowerCase();
    let filtered = allTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    );

    // 如果搜索的是合约地址且获取到了代币信息，添加到结果中
    if (isSearchingAddress && tokenInfo && !isTokenInfoLoading && !isUniswapTokensLoading) {
      // 检查是否已经存在于过滤结果中
      const existingToken = filtered.find(
        (token) => token.address.toLowerCase() === tokenInfo?.address?.toLowerCase()
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

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-2 mb-4 border border-[#ebebeb] rounded-lg p-2">
        <Search className="h-4 w-4 text-foreground" />
        <input
          type="text"
          placeholder="Search token name, symbol or address"
          className="flex-1 bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-1">
        {isSearchingAddress && (isTokenInfoLoading || isUniswapTokensLoading) ? (
          <div className="p-3 text-center text-sm text-gray-500">
            <Skeleton className="w-full h-8 mb-2" />
            <span>Loading...</span>
          </div>
        ) : filteredTokens.length === 0 ? (
          <NoSearchResult searchQuery={searchQuery} />
        ) : (
          filteredTokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center gap-2 p-2 hover:bg-primary-foreground rounded-lg cursor-pointer"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              <LogoWithPlaceholder
                src={token.logo}
                className="w-6 h-6"
                width={24}
                height={24}
                name={token.symbol}
              />
              <div>
                <div className="text-primary font-medium">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">{token.name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
