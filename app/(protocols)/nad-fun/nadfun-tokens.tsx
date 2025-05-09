'use client';

import { Button } from '@/components/ui/button';

import { IToken } from '@/config/tokens';
import { useNadFunTokens } from '@/lib/data/use-nadfun-tokens';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { NadFunTokenList } from './nadfun-token-list';

export function NadFunTokens() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: tokens, isLoading } = useNadFunTokens();

  const parseTokens = tokens?.map(
    (token) =>
      ({
        ...token,
        logo: token.logo_url,
        decimals: 18,
      }) as IToken & { balance?: string }
  );

  function handleCreateToken() {
    setCurrentComponent({
      name: 'NadFunCreateToken',
    });
  }

  return (
    <>
      <NadFunTokenList
        tokens={parseTokens || undefined}
        isLoading={isLoading}
        title="Recently Active Tokens"
        emptyDesc="No recently active tokens found"
      >
        <Button className="w-fit self-end bg-pro-blue text-white hover:bg-pro-blue/80" onClick={handleCreateToken}>
          Create Token
        </Button>
      </NadFunTokenList>
    </>
  );
}
