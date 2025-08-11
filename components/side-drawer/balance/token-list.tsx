import { useEffect, useState } from 'react';

import {
  STATION_FROM_TOKENS_BASE,
  STATION_FROM_TOKENS_ETH,
} from '@/app/token-station/station-config';

import { APR_MONAD, G_MONAD, IToken, MONAD, MonUSD } from '@/config/tokens';

import { useApiAccountTokenBalance } from '@/lib/data/use-api-account-token-balance';
import { useTokenStationPrice } from '@/lib/data/use-token-station-price';

import { AprMONTokenCard } from './apr-mon-token-card';
import { BaseTokenCard } from './base-token-card';
import { MagmaMonTokenCard } from './magma-mon-token-card';
import { NoSearchResult } from './no-search-result';
import SearchBar from './search-bar';

const MonadTokenData = [MONAD, APR_MONAD, G_MONAD, MonUSD];
const BaseTokenData = STATION_FROM_TOKENS_BASE;
const EthTokenData = STATION_FROM_TOKENS_ETH;

function filterTokenByQuery(tokens: IToken[], query: string) {
  return tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol.toLowerCase().includes(query.toLowerCase())
  );
}

export default function TokenList() {
  const { data: balanceData } = useApiAccountTokenBalance(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [MonadTokens, setMonadTokens] = useState<IToken[]>(MonadTokenData);
  const [BaseTokens, setBaseTokens] = useState<IToken[]>(BaseTokenData);
  const [EthTokens, setEthTokens] = useState<IToken[]>(EthTokenData);

  const { data: priceData } = useTokenStationPrice();
  const EthPrice = priceData?.eth_price;
  const monPrice = priceData?.mon_price;

  function withMonUsdFirst(tokens: IToken[]) {
    return tokens.sort((a: IToken, _b) => {
      if (a.symbol === 'monUSD') {
        return -1;
      }
      return 1;
    });
  }

  useEffect(() => {
    if (searchQuery) {
      const monTokens = filterTokenByQuery(MonadTokenData, searchQuery);
      const baseTokens = filterTokenByQuery(BaseTokenData, searchQuery);
      const ethTokens = filterTokenByQuery(EthTokenData, searchQuery);

      setMonadTokens(withMonUsdFirst(monTokens));
      setBaseTokens(baseTokens);
      setEthTokens(ethTokens);
    } else {
      setMonadTokens(withMonUsdFirst(MonadTokenData));
      setBaseTokens(BaseTokenData);
      setEthTokens(EthTokenData);
    }
  }, [searchQuery]);

  return (
    <div className="mt-2 flex flex-grow flex-col sm:mt-4 relative z-1 bg-bg-gray">
      <div className="flex flex-shrink-0">
        <SearchBar
          placeholder="Search Currency"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mt-2 flex flex-grow flex-col sm:mt-4">
        <div className="pb-6 flex flex-col gap-2">
          {searchQuery &&
          MonadTokens.length === 0 &&
          BaseTokens.length === 0 &&
          EthTokens.length === 0 ? (
            <NoSearchResult searchQuery={searchQuery} />
          ) : (
            <>
              <>
                {MonadTokens.map((token, index) => {
                  if (token.symbol === 'MON') {
                  }

                  if (token.symbol === 'aprMON') {
                    return <AprMONTokenCard key={index} />;
                  }

                  if (token.symbol === 'gMON') {
                    return <MagmaMonTokenCard key={index} />;
                  }

                  return (
                    <BaseTokenCard
                      price={String(monPrice)}
                      token={token}
                      chain="mon"
                      balance={
                        balanceData?.find(
                          (bRes) => bRes.network === 'MON' && token.symbol === bRes.token
                        )?.formattedBalance || '0'
                      }
                      key={index}
                    />
                  );
                })}
              </>
              <>
                {EthTokens.map((token, index) => {
                  return (
                    <BaseTokenCard
                      showTrade={false}
                      price={token.symbol === 'ETH' ? String(EthPrice) : '1'}
                      token={token}
                      chain="eth"
                      balance={
                        balanceData?.find(
                          (bRes) => bRes.network === 'ETH' && token.symbol === bRes.token
                        )?.formattedBalance || '0'
                      }
                      key={index}
                    />
                  );
                })}
              </>
              <>
                {BaseTokens.map((token, index) => {
                  return (
                    <BaseTokenCard
                      showTrade={false}
                      price={token.symbol === 'ETH' ? String(EthPrice) : '1'}
                      token={token}
                      chain="base"
                      balance={
                        balanceData?.find(
                          (bRes) => bRes.network === 'BASE' && token.symbol === bRes.token
                        )?.formattedBalance || '0'
                      }
                      key={index}
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
