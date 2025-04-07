'use client';

import { useState, useEffect } from 'react';
import TokenCard from './token-card';
import { IToken, TokenData } from '@/lib/data/tokens';
import { NoSearchResult } from './no-search-result';
import { AprMONTokenCard } from './apr-mon-token-card';

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
      <div className="pb-6">
        {searchQuery && filteredTokens.length === 0 ? (
          <NoSearchResult searchQuery={searchQuery} />
        ) : (
          <>
            {filteredTokens.map((token, index) => {
              if (token.symbol === 'MON') {
                return (
                  <TokenCard
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

              return null;
            })}
          </>
        )}
      </div>
    </div>
  );
}
