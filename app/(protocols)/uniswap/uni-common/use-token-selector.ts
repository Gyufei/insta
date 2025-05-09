import { useState } from 'react';

import { IToken } from '@/config/tokens';

import { useSideDrawerStore } from '../../../../lib/state/side-drawer';

export enum PairTokenSelected {
  Token0 = 'Token0',
  Token1 = 'Token1',
}

export function useTokenSelector() {
  const { setIsOpen } = useSideDrawerStore();
  const [showTokenSelector, setShowTokenSelector] = useState<PairTokenSelected | null>(null);

  const handleTokenSelect = (token: IToken) => {
    if (showTokenSelector === PairTokenSelected.Token0) {
      return { token0: token };
    } else if (showTokenSelector === PairTokenSelected.Token1) {
      return { token1: token };
    }

    return {};
  };

  const handleBack = () => {
    if (showTokenSelector) {
      setShowTokenSelector(null);
    } else {
      setIsOpen(false);
    }
  };

  return {
    showTokenSelector,
    setShowTokenSelector,
    handleTokenSelect,
    handleBack,
  };
}
