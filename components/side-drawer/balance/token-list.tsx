'use client';

import { useEffect, useState } from 'react';

import { IToken, TokenData } from '@/lib/data/tokens';

import { AprMONTokenCard } from './apr-mon-token-card';
import { MagmaMonTokenCard } from './magma-mon-token-card';
import { NoSearchResult } from './no-search-result';
import BalanceTokenCard from './balance-token-card';

interface TokenListProps {
  searchQuery: string;
}

export default function TokenList({ searchQuery }: TokenListProps) {
  const [filteredTokens, setFilteredTokens] = useState<IToken[]>(TokenData);

  useEffect(() => {
    if (searchQuery) {
      const filtered = TokenData.filter((token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(TokenData);
    }
  }, [searchQuery]);

  return (
    <div className="mt-2 flex flex-grow flex-col sm:mt-4">
      <div className="pb-6 flex flex-col gap-2">
        {searchQuery && filteredTokens.length === 0 ? (
          <NoSearchResult searchQuery={searchQuery} />
        ) : (
          <>
            {filteredTokens.map((token, index) => {
              if (token.symbol === 'MON') {
                return (
                  <BalanceTokenCard
                    key={index}
                    name={token.name}
                    symbol={token.symbol}
                    iconUrl={token.iconUrl}
                  />
                );
              }

              if (token.symbol === 'aprMON') {
                return <AprMONTokenCard key={index} />;
              }

              if (token.symbol === 'gMON') {
                return <MagmaMonTokenCard key={index} />;
              }

              return null;
            })}
          </>
        )}
      </div>
    </div>
  );
}
