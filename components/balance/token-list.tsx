'use client';

import { useState, useEffect } from 'react';
import TokenCard from './token-card';
import { tokenData } from '@/lib/data/tokens';
import { NoSearchResults } from './no-result';

interface TokenListProps {
  searchQuery: string;
}

export default function TokenList({ searchQuery }: TokenListProps) {
  const [filteredTokens, setFilteredTokens] = useState(tokenData);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tokenData.filter((token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokenData);
    }
  }, [searchQuery]);

  return (
    <div className="mt-2 flex flex-grow flex-col sm:mt-4">
      <div className="pb-6">
        {searchQuery && filteredTokens.length === 0 ? (
          <NoSearchResults searchQuery={searchQuery} onAddCustomToken={() => {}} />
        ) : (
          <>
            {filteredTokens.map((token, index) => (
              <TokenCard
                key={index}
                name={token.name}
                symbol={token.symbol}
                balance="0.00"
                value="$0.00"
                iconUrl={token.iconUrl}
                coingeckoUrl={token.coingeckoUrl}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
