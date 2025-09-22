import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  STATION_FROM_TOKENS_BASE,
  STATION_FROM_TOKENS_ETH,
} from '@/app/token-station/station-config';

import { APR_MONAD, G_MONAD, IToken, MONAD, MonUSD } from '@/config/tokens';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useApiBalance } from '@/lib/data/balance/use-api-balance';
import { useUniswapTokens } from '@/lib/data/use-uniswap-tokens';
import { useAccountStore } from '@/lib/state/account';
import { eventBus } from '@/lib/state/eventBus';

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
  const router = useRouter();
  const pathname = usePathname();
  const { data: balanceData } = useApiBalance();

  const { address } = useAccount();
  const { data: selectedAccount } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

  const { data: uniswapTokensData } = useUniswapTokens();

  const [searchQuery, setSearchQuery] = useState('');
  const [MonadTokens, setMonadTokens] = useState<IToken[]>(MonadTokenData);
  const [BaseTokens, setBaseTokens] = useState<IToken[]>(BaseTokenData);
  const [EthTokens, setEthTokens] = useState<IToken[]>(EthTokenData);

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

  function monUsdClaim(token: IToken) {
    if (token.symbol !== 'monUSD') {
      return;
    }

    const addr = currentAccountType === 'EOA' ? address : selectedAccount?.sandbox_account;

    if (pathname.startsWith('/faucet')) {
      eventBus.publish('claim-monUsd', { name: 'ClaimMonUsd', props: { address: addr } });
    } else {
      sessionStorage.setItem('claim-monUsd', JSON.stringify({ address: addr }));
      router.push('/faucet');
    }
  }

  function handleQuerySearch(query: string) {
    setSearchQuery(query.trim());
  }

  useEffect(() => {
    if (searchQuery) {
      const monTokens = filterTokenByQuery(allMonTokens, searchQuery);
      const baseTokens = filterTokenByQuery(BaseTokenData, searchQuery);
      const ethTokens = filterTokenByQuery(EthTokenData, searchQuery);

      setMonadTokens(withMonUsdFirst(monTokens));
      setBaseTokens(baseTokens);
      setEthTokens(ethTokens);
    } else {
      setMonadTokens(withMonUsdFirst(withMonUsdFirst(allMonTokens)));
      setBaseTokens(BaseTokenData);
      setEthTokens(EthTokenData);
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
          {searchQuery &&
          MonadTokens.length === 0 &&
          BaseTokens.length === 0 &&
          EthTokens.length === 0 ? (
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
                      onClaim={token.symbol === 'monUSD' ? monUsdClaim : undefined}
                    />
                  );
                })}
              </>
              <>
                {EthTokens.map((token, index) => {
                  return (
                    <BaseTokenCard
                      showTrade={false}
                      token={token}
                      chain="eth"
                      balance={
                        balanceData?.find(
                          (bRes) =>
                            bRes.network === 'ETH' &&
                            (token.symbol === bRes.token || token.address === bRes.address)
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
                      token={token}
                      chain="base"
                      balance={
                        balanceData?.find(
                          (bRes) =>
                            bRes.network === 'BASE' &&
                            (token.symbol === bRes.token || token.address === bRes.address)
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
