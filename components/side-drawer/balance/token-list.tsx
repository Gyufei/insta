import { useEffect, useState } from 'react';

import { APR_MONAD, G_MONAD, IToken, MONAD } from '@/lib/data/tokens';

import { AprMONTokenCard } from './apr-mon-token-card';
import { BalanceTokenCard } from './balance-token-card';
import { MagmaMonTokenCard } from './magma-mon-token-card';
import { NoSearchResult } from './no-search-result';
import SearchBar from './search-bar';

const TokenData = [MONAD, APR_MONAD, G_MONAD];

export default function TokenList() {
  const [searchQuery, setSearchQuery] = useState('');
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
      <div className="flex flex-shrink-0">
        <SearchBar
          placeholder="Search Currency"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mt-2 flex flex-grow flex-col sm:mt-4">
        <div className="pb-6 flex flex-col gap-2">
          {searchQuery && filteredTokens.length === 0 ? (
            <NoSearchResult searchQuery={searchQuery} />
          ) : (
            <>
              {filteredTokens.map((token, index) => {
                if (token.symbol === 'MON') {
                  return <BalanceTokenCard key={index} />;
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
    </div>
  );
}
