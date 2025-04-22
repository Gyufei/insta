'use client';

import { ArrowDown } from 'lucide-react';

import { useEffect, useState } from 'react';

import { ActionButton } from '@/components/side-drawer/common/action-button';

import { IToken } from '@/lib/data/tokens';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import TokenInput from './token-input';

export default function TokenSwap() {
  const { currentComponent } = useSideDrawerStore();
  const { token } = currentComponent?.props || {};

  const [sellToken, setSellToken] = useState<IToken | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<IToken | undefined>(undefined);
  const [sellValue, setSellValue] = useState('');
  const [buyValue, setBuyValue] = useState('');

  useEffect(() => {
    if (token) {
      setSellToken(token);
      setBuyToken(token);
    }
  }, [token]);

  function handleSwap() {
    console.log('swap');
  }

  return (
    <div className="flex flex-col gap-1">
      <TokenInput
        label="Sell"
        token={sellToken}
        value={sellValue}
        onChange={setSellValue}
        placeholder="0"
      />
      <div className="flex items-center relative">
        <div className="absolute left-1/2 border-white border-2 -translate-x-1/2 flex items-center justify-center rounded-sm cursor-pointer bg-accent p-2">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <TokenInput
        label="Buy"
        token={buyToken}
        value={buyValue}
        onChange={setBuyValue}
        placeholder="0"
      />

      <ActionButton
        disabled={!sellToken || !buyToken || !sellValue || !buyValue}
        isPending={false}
        onClick={handleSwap}
      >
        Swap
      </ActionButton>
    </div>
  );
}
