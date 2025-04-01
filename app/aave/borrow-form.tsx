'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import TokenIcon from '@/components/token-icon';
import { IToken, tokenData } from '@/lib/data/tokens';

const TOKEN_DATA: Record<string, IToken> = {
  usdc: tokenData.find((token) => token.symbol === 'USDC') as IToken,
  eth: tokenData.find((token) => token.symbol === 'ETH') as IToken,
  wsteth: tokenData.find((token) => token.symbol === 'WETH') as IToken,
};

export default function BorrowFormSection() {
  const searchParams = useSearchParams();
  const tokenKey = searchParams.get('tokenKey') || 'usdc';
  const token = TOKEN_DATA[tokenKey as keyof typeof TOKEN_DATA] || TOKEN_DATA.usdc;
  const [aprType, setAprType] = useState('variable');
  const [amount, setAmount] = useState('');

  return (
    <>
      <div className="my-6">
        <Link href="/aave-v3-lido" className="flex items-center text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
          <span>Borrow {token.symbol}</span>
        </Link>
      </div>

      <div className="absolute top-24 right-6 w-80 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center">
            <div className="flex items-center space-x-2">
              <TokenIcon symbol={token.symbol} src={token.iconUrl} size="sm" />
              <h2 className="text-lg font-semibold">Borrow {token.symbol}</h2>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-sm font-medium">APR type</div>
            <RadioGroup value={aprType} onValueChange={setAprType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="variable" id="apr-variable" />
                <label
                  htmlFor="apr-variable"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Variable
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stable" id="apr-stable" />
                <label
                  htmlFor="apr-stable"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Stable (0.00%)
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-sm font-medium">Borrowed</div>
            <div className="text-xl">0</div>
          </div>

          <Card className="mb-6 p-4">
            <div className="mb-2 text-sm">Amount to borrow</div>
            <Input
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </Card>

          <div className="mb-6">
            <div className="mb-4 text-lg font-medium">Projected Debt Position</div>

            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="text-sm">Status</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                No position
              </div>
            </div>

            <div className="mb-2 text-xs text-gray-500">Max: L.L. 0.00%</div>

            <Progress value={0} className="mb-4 h-2" />

            <div className="mb-6 text-center text-lg">0.00%</div>

            <div>
              <div className="mb-2 text-sm">Liquidation Price (ETH)</div>
              <div className="text-lg">$0.00 / $0.00</div>
            </div>
          </div>

          <Button className="w-full" disabled>
            Borrow
          </Button>
        </div>
      </div>
    </>
  );
}
