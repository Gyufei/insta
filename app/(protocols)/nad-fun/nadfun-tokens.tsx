'use client';

import { Button } from '@/components/ui/button';

import { useNadFunTokens } from '@/lib/data/use-nadfun-tokens';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { NadFunTokenList } from './nadfun-token-list';

export function NadFunTokens() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: tokens, isLoading } = useNadFunTokens();

  function handleCreateToken() {
    setCurrentComponent({
      name: 'NadFunCreateToken',
    });
  }

  return (
    <>
      <NadFunTokenList
        tokens={tokens || undefined}
        isLoading={isLoading}
        title="Recently Active Tokens"
        emptyDesc="No recently active tokens found"
      >
        <Button className="w-fit self-end" onClick={handleCreateToken}>
          Create Token
        </Button>
      </NadFunTokenList>
    </>
  );
}
