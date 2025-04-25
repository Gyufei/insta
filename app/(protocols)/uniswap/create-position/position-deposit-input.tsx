'use client';

import type React from 'react';

import { BadgeHelpTooltip } from '@/components/common/badge-help';
import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';

import { IToken } from '@/lib/data/tokens';

import { PairTokenSelected } from '../common/use-token-selector';

interface TokenSwapProps {
  token0: IToken | undefined;
  token1: IToken | undefined;
  amount0: string;
  amount1: string;
  onAmount0Change: (_v: string) => void;
  onAmount1Change: (_v: string) => void;
  onSelectToken: (v: PairTokenSelected) => void;
}

export default function PositionDepositInput({
  token0,
  token1,
  amount0,
  amount1,
  onAmount0Change,
  onAmount1Change,
  onSelectToken,
}: TokenSwapProps) {
  const handleAmountAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onAmount0Change(value);
  };

  const handleAmountBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onAmount1Change(value);
  };

  function handleNoToken(v: PairTokenSelected) {
    if (v === PairTokenSelected.Token0 && !token0) {
      onSelectToken(PairTokenSelected.Token0);
    }

    if (v === PairTokenSelected.Token1 && !token1) {
      onSelectToken(PairTokenSelected.Token1);
    }
  }

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <div className="text-lg font-medium text-primary flex items-center gap-2">
        <span>Deposit tokens</span>
        <BadgeHelpTooltip content="Specify the token amounts for your liquidity contribution." />
      </div>

      <div
        className="flex justify-between rounded-lg bg-gray-100 py-4 px-2 overflow-hidden cursor-pointer"
        onClick={() => handleNoToken(PairTokenSelected.Token0)}
      >
        <div className="flex flex-grow items-center h-9 mr-1 overflow-hidden">
          <div className="flex-grow flex-shrink">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount0}
              onChange={handleAmountAChange}
              className="font-semibold !text-2xl text-gray-900 bg-transparent border-none outline-none p-0 w-full"
            />
          </div>
        </div>
        {token0 && (
          <div className="flex items-center">
            <div className="relative flex items-center justify-center h-7 w-7">
              <LogoWithPlaceholder
                src={token0.logo}
                width={16}
                height={16}
                className="w-4 h-4"
                name={''}
              />
            </div>
            <span className="text-lg font-medium text-gray-900 pl-1">{token0.symbol}</span>
          </div>
        )}
      </div>

      {/* Token B Input */}
      <div
        className="flex justify-between rounded-lg bg-gray-100 py-4 px-2 overflow-hidden cursor-pointer"
        onClick={() => handleNoToken(PairTokenSelected.Token1)}
      >
        <div className="flex flex-grow items-center h-9 mr-1 overflow-hidden">
          <div className="flex-grow flex-shrink">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount1}
              onChange={handleAmountBChange}
              className="font-semibold !text-2xl text-gray-900 bg-transparent border-none outline-none p-0 w-full"
            />
          </div>
        </div>
        {token1 && (
          <div className="flex items-center justify-center gap-1 p-1">
            <div className="relative flex items-center justify-center h-7 w-7">
              <LogoWithPlaceholder
                src={token1.logo}
                width={16}
                height={16}
                className="w-4 h-4"
                name={token1.symbol}
              />
            </div>
            <span className="text-lg font-medium text-gray-900 pl-1">{token1.symbol}</span>
          </div>
        )}
      </div>
    </div>
  );
}
