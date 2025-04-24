'use client';

import { Search } from 'lucide-react';

import { useState } from 'react';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { NoSearchResult } from '@/components/side-drawer/balance/no-search-result';

import { IToken } from '@/lib/data/tokens';

import { useUniswapToken } from '../use-uniswap-token';

interface TokenSelectorProps {
  onSelect: (token: IToken) => void;
  onClose: () => void;
}

export default function TokenSelector({ onSelect, onClose }: TokenSelectorProps) {
  const { tokens } = useUniswapToken();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-2 mb-4 border border-border rounded-lg p-2">
        <Search className="h-4 w-4 text-foreground" />
        <input
          type="text"
          placeholder="Search token name or symbol"
          className="flex-1 bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {filteredTokens.length === 0 ? (
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
