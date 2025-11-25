import { useEffect, useMemo, useState } from 'react';

import { APR_MONAD, G_MONAD, IToken, MONAD } from '@/config/tokens';

import { useApiBalance } from '@/lib/data/balance/use-api-balance';
import { useUniswapTokens } from '@/lib/data/use-uniswap-tokens';

import { AprMONTokenCard } from './apr-mon-token-card';
import { BaseTokenCard } from './base-token-card';
import { MagmaMonTokenCard } from './magma-mon-token-card';
import { NoSearchResult } from './no-search-result';
import SearchBar from './search-bar';

const MonadTokenData = [MONAD, APR_MONAD, G_MONAD];

function filterTokenByQuery(tokens: IToken[], query: string) {
  return tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
  );
}

export default function TokenList() {
  const { data: balanceData } = useApiBalance();

  const { data: uniswapTokensData } = useUniswapTokens();

  const [searchQuery, setSearchQuery] = useState('');
  const [MonadTokens, setMonadTokens] = useState<IToken[]>(MonadTokenData);

  const allMonTokens = useMemo(() => {
    const uniswapTokens = uniswapTokensData?.map((token) => ({
      ...token,
      logo: token.logoURI,
      description: token.tokenDescription,
    }));

    const monBalanceTokens = balanceData?.filter((token) => token.network === 'MON');

    const hasBalanceTokens = uniswapTokens?.filter((token) =>
      monBalanceTokens?.some((bToken) => bToken.address === token.address)
    );

    return [...MonadTokenData, ...(hasBalanceTokens || [])];
  }, [uniswapTokensData, balanceData]);

  function withMonUsdFirst(tokens: IToken[]) {
    return tokens.sort((a: IToken, _b) => {
      if (a.symbol === 'monUSD') {
        return -1;
      }
      return 1;
    });
  }

  function handleQuerySearch(query: string) {
    setSearchQuery(query.trim());
  }

  useEffect(() => {
    if (searchQuery) {
      const monTokens = filterTokenByQuery(allMonTokens, searchQuery);
      setMonadTokens(withMonUsdFirst(monTokens));
    } else {
      setMonadTokens(withMonUsdFirst(withMonUsdFirst(allMonTokens)));
    }
  }, [searchQuery, allMonTokens]);

  return (
    <div className="mt-2 flex flex-grow flex-col sm:mt-4 relative z-1 bg-bg-gray">
      <div className="flex flex-shrink-0">
        <SearchBar
          placeholder="Search Currency"
          value={searchQuery}
          onChange={(e) => handleQuerySearch(e.target.value)}
        />
      </div>
      <div className="mt-2 flex flex-grow flex-col sm:mt-4">
        <div className="pb-6 flex flex-col gap-2">
          {searchQuery && MonadTokens.length === 0 ? (
            <NoSearchResult searchQuery={searchQuery} />
          ) : (
            <>
              <>
                {MonadTokens.map((token, index) => {
                  if (token.symbol === 'aprMON') {
                    return <AprMONTokenCard key={index} />;
                  }

                  if (token.symbol === 'gMON') {
                    return <MagmaMonTokenCard key={index} />;
                  }

                  return (
                    <BaseTokenCard
                      token={token}
                      chain="mon"
                      balance={
                        balanceData?.find(
                          (bRes) =>
                            bRes.network === 'MON' &&
                            (token.symbol === bRes.token || token.address === bRes.address)
                        )?.formattedBalance || '0'
                      }
                      key={index}
                      onClaim={undefined}
                    />
                  );
                })}
              </>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
