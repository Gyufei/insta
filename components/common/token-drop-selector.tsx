'use client';

import { isAddress } from 'viem';

import { useEffect, useMemo, useRef, useState } from 'react';

import { IToken } from '@/config/tokens';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { NumberInput } from '@/components/common/number-input';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { useTokenInfo } from '@/lib/data/use-token-info';
import { useUniswapTokens } from '@/lib/data/use-uniswap-tokens';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/number';

interface TokenSelectorProps {
  tokens: IToken[];
  selectedToken?: IToken;
  onTokenChange: (token: IToken) => void;
  value: string;
  onValueChange: (value: string) => void;
  balance: string;
  isBalancePending: boolean;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
  className?: string;
  onTokenAdded?: (token: IToken) => void; // 新增：当通过地址搜索选择代币时的回调
}

export function TokenDropSelector({
  tokens,
  selectedToken,
  onTokenChange,
  value,
  onValueChange,
  balance,
  isBalancePending,
  label,
  placeholder,
  disabled = false,
  showMaxButton = false,
  onMaxClick,
  className,
  onTokenAdded,
}: TokenSelectorProps) {
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

  const { data: uniswapTokensData, isLoading: isUniswapTokensLoading } = useUniswapTokens();

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
    <div className={cn('flex flex-col gap-[10px]', className)}>
      <div className="flex justify-between items-center gap-[10px]">
        <div className="flex-1 flex flex-col gap-[10px]">
          <div className="text-sm text-[#A5ADC6] font-normal">Token</div>
          <Select
            value={selectedToken?.address}
            onValueChange={(value) => {
              const selectedToken = filteredTokens.find((token) => token.address === value);
              if (selectedToken) {
                onTokenChange(selectedToken);
              }
            }}
          >
            <SelectTrigger className="w-full focus-visible:ring-0">
              <div className="flex items-center gap-2">
                {selectedToken && (
                  <>
                    <LogoWithPlaceholder
                      src={selectedToken.logo}
                      className="w-6 h-6"
                      width={20}
                      height={20}
                      name={selectedToken.symbol}
                    />
                    <SelectValue>{selectedToken.symbol}</SelectValue>
                  </>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {/* 搜索输入框 */}
              <div className="p-3 border-b border-gray-100">
                <Input
                  placeholder="Search token name, symbol or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>

              {/* Token列表 */}
              <div className="max-h-[200px] overflow-y-auto">
                {isSearchingAddress && (isTokenInfoLoading || isUniswapTokensLoading) ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    <Skeleton className="w-full h-8 mb-2" />
                    <span>Loading...</span>
                  </div>
                ) : filteredTokens.length === 0 ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    {isSearchingAddress ? 'No token found' : 'No token found'}
                  </div>
                ) : (
                  filteredTokens.map((token) => (
                    <SelectItem key={`${token.symbol}-${token.address}`} value={token.address}>
                      <div className="flex items-center gap-2">
                        <LogoWithPlaceholder
                          src={token.logo}
                          className="w-6 h-6"
                          width={20}
                          height={20}
                          name={token.symbol}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{token.symbol}</span>
                          <span className="text-xs text-gray-500">{token.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="flex justify-between items-center font-normal">
          <span className="text-base text-[#131e40]">{label}:</span>
          <span className="text-sm flex items-center gap-1 text-[#A5ADC6]">
            {selectedToken && <span>{selectedToken?.symbol}: </span>}
            {isBalancePending ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span>{formatNumber(balance)}</span>
            )}
            {showMaxButton && onMaxClick && (
              <span className="text-[#6E75F9] cursor-pointer ml-1 font-medium" onClick={onMaxClick}>
                MAX
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <NumberInput
            className={cn(
              '!text-[32px] !font-medium bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full',
              disabled
                ? '!text-[#131E40] disabled:text-[#131E40] disabled:opacity-100'
                : Number(value) < Number(balance)
                  ? '!text-red'
                  : '!text-[#131E40]'
            )}
            value={value}
            onChange={onValueChange}
            disabled={disabled}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}
